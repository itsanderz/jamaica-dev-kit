"""RAG (Retrieval-Augmented Generation) pipeline.

Responsibilities:
1. Ingest JSON data into a ChromaDB vector store.
2. At query time, retrieve relevant chunks and generate answers via Claude.
"""

from __future__ import annotations

import logging
from typing import Any

from langchain_anthropic import ChatAnthropic
from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.config import settings
from app.data_loader import build_documents_for_ingestion
from app.sessions import session_store

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# System prompt
# ---------------------------------------------------------------------------

SYSTEM_PROMPT = """\
You are the Jamaica Government Services Assistant, a friendly and \
professional AI helper created to assist Jamaican citizens with \
navigating government services.

Your role:
- Help citizens understand which government agency handles their need.
- Explain required documents, fees (always in JMD), processing times, \
  and step-by-step procedures.
- Reference specific agencies by their full name AND acronym \
  (e.g. "Tax Administration Jamaica (TAJ)").
- When a service has both stated and actual processing times, share both \
  so citizens can plan realistically.
- Mention whether a service is available online and provide the portal URL \
  when available.
- If you are unsure or the question falls outside Jamaican government \
  services, say so honestly rather than guessing.

Tone:
- Warm and respectful -- address the user as "you".
- Concise but thorough -- give all the details a citizen needs in one go.
- Use plain language; avoid bureaucratic jargon.

Important context:
- Jamaica has 14 parishes.  Major service hubs are in Kingston, \
  Montego Bay (St. James), and Mandeville (Manchester).
- Many services still require in-person visits.  Always mention when \
  that is the case.
- Currency is the Jamaican Dollar (JMD / J$).
"""

# ---------------------------------------------------------------------------
# RAG Pipeline
# ---------------------------------------------------------------------------


class RAGPipeline:
    """Encapsulates document ingestion and query-time retrieval + generation."""

    def __init__(self) -> None:
        self._vectorstore: Chroma | None = None
        self._llm: ChatAnthropic | None = None
        self._ingested = False

    # ------------------------------------------------------------------
    # Lazy initialisation helpers
    # ------------------------------------------------------------------

    def _get_llm(self) -> ChatAnthropic:
        if self._llm is None:
            self._llm = ChatAnthropic(
                model=settings.model_name,
                anthropic_api_key=settings.anthropic_api_key,
                max_tokens=1024,
                temperature=0.3,
            )
        return self._llm

    def _get_vectorstore(self) -> Chroma:
        if self._vectorstore is None:
            # Use a simple default embedding function shipped with Chroma
            # so the dev setup has zero external dependencies beyond Chroma.
            self._vectorstore = Chroma(
                collection_name="jamaica_gov",
                persist_directory=settings.chromadb_persist_dir,
            )
        return self._vectorstore

    # ------------------------------------------------------------------
    # Ingestion
    # ------------------------------------------------------------------

    def ingest_documents(self) -> int:
        """Load JSON data, split into chunks, and upsert into ChromaDB.

        Returns the number of chunks stored.
        """
        raw_docs = build_documents_for_ingestion()

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.chunk_size,
            chunk_overlap=settings.chunk_overlap,
            separators=["\n\n", "\n", ". ", " ", ""],
        )

        documents: list[Document] = []
        for raw in raw_docs:
            chunks = splitter.split_text(raw["text"])
            for chunk in chunks:
                documents.append(
                    Document(
                        page_content=chunk,
                        metadata={"source": raw["source"]},
                    )
                )

        if not documents:
            logger.warning("No documents produced during ingestion.")
            return 0

        store = self._get_vectorstore()

        # Clear previous data so re-ingestion is idempotent.
        try:
            existing = store.get()
            if existing and existing.get("ids"):
                store.delete(ids=existing["ids"])
        except Exception:
            pass  # collection may not exist yet

        store.add_documents(documents)
        self._ingested = True
        logger.info("Ingested %d chunks into ChromaDB.", len(documents))
        return len(documents)

    # ------------------------------------------------------------------
    # Query
    # ------------------------------------------------------------------

    async def query(
        self,
        question: str,
        session_id: str,
    ) -> dict[str, Any]:
        """Answer a user question using RAG.

        Parameters
        ----------
        question:
            The citizen's natural-language question.
        session_id:
            Conversation session ID (must already exist in the store).

        Returns
        -------
        dict with keys ``response`` (str) and ``sources`` (list[str]).
        """
        # 1. Retrieve relevant chunks
        store = self._get_vectorstore()
        results = store.similarity_search(question, k=6)

        context_parts: list[str] = []
        sources: list[str] = []
        for doc in results:
            context_parts.append(doc.page_content)
            src = doc.metadata.get("source", "unknown")
            if src not in sources:
                sources.append(src)

        context_block = "\n---\n".join(context_parts)

        # 2. Build message list (system + history + current question)
        messages: list[SystemMessage | HumanMessage | AIMessage] = [
            SystemMessage(content=SYSTEM_PROMPT),
        ]

        # Include recent conversation history (last 10 turns)
        history = session_store.get_history(session_id)
        for msg in history[-10:]:
            if msg["role"] == "user":
                messages.append(HumanMessage(content=msg["content"]))
            else:
                messages.append(AIMessage(content=msg["content"]))

        # Current turn with retrieved context
        user_message = (
            f"Relevant information:\n{context_block}\n\n"
            f"Citizen's question: {question}"
        )
        messages.append(HumanMessage(content=user_message))

        # 3. Generate
        llm = self._get_llm()
        ai_response = await llm.ainvoke(messages)
        answer: str = (
            ai_response.content
            if isinstance(ai_response.content, str)
            else str(ai_response.content)
        )

        # 4. Persist turn in session
        session_store.add_message(session_id, "user", question)
        session_store.add_message(session_id, "assistant", answer)

        return {"response": answer, "sources": sources}


# Module-level singleton
rag_pipeline = RAGPipeline()
