"""FastAPI application for the Jamaica AI Government Assistant."""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from typing import Any, AsyncIterator

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.data_loader import get_fees_by_agency, load_agencies
from app.models import (
    AgencyResponse,
    ChatRequest,
    ChatResponse,
    FeeItem,
    FeeResponse,
    FeeServiceGroup,
    SessionMessage,
    SessionResponse,
)
from app.sessions import session_store

# RAG pipeline is optional — ChromaDB may not work on Python 3.14+
try:
    from app.rag import rag_pipeline

    _rag_available = True
except Exception as _rag_err:
    rag_pipeline = None  # type: ignore[assignment]
    _rag_available = False
    logging.getLogger(__name__).warning(
        "RAG pipeline unavailable (ChromaDB may not support Python %s): %s",
        __import__("sys").version.split()[0],
        _rag_err,
    )

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


# ---------------------------------------------------------------------------
# Lifespan -- ingest data on startup
# ---------------------------------------------------------------------------


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    """Run one-time startup tasks before the app begins serving requests."""
    if _rag_available and rag_pipeline is not None:
        logger.info("Ingesting research data into vector store ...")
        try:
            count = rag_pipeline.ingest_documents()
            logger.info("Ingestion complete -- %d chunks indexed.", count)
        except Exception:
            logger.exception("Data ingestion failed; RAG queries may not work.")
    else:
        logger.warning(
            "Skipping RAG ingestion — ChromaDB not available. "
            "Chat endpoint will return an error; data endpoints will work."
        )
    yield


# ---------------------------------------------------------------------------
# App factory
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Jamaica AI Government Assistant",
    description=(
        "A RAG-powered chatbot API that helps Jamaican citizens navigate "
        "government services. Provides information about processes, fees, "
        "required documents, and realistic timelines."
    ),
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------


@app.get("/health")
async def health() -> dict[str, str]:
    """Liveness / readiness probe."""
    return {"status": "healthy"}


# ---------------------------------------------------------------------------
# Chat
# ---------------------------------------------------------------------------


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """Answer a citizen's question about Jamaican government services."""
    if not _rag_available or rag_pipeline is None:
        raise HTTPException(
            status_code=503,
            detail="Chat is unavailable — ChromaDB is not compatible with this Python version. Use Python 3.11-3.13.",
        )

    session_id = session_store.get_or_create(request.session_id)

    try:
        result = await rag_pipeline.query(
            question=request.message,
            session_id=session_id,
        )
    except Exception as exc:
        logger.exception("RAG query failed")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate a response: {exc}",
        ) from exc

    return ChatResponse(
        response=result["response"],
        session_id=session_id,
        sources=result["sources"],
    )


# ---------------------------------------------------------------------------
# Agencies
# ---------------------------------------------------------------------------


@app.get("/agencies", response_model=list[AgencyResponse])
async def list_agencies() -> list[AgencyResponse]:
    """Return all government agencies from the data directory."""
    agencies = load_agencies()
    return [
        AgencyResponse(
            id=a["id"],
            name=a["name"],
            acronym=a.get("acronym"),
            website=a.get("website"),
            services_count=len(a.get("services", [])),
            has_online_portal=bool(a.get("online_portal")),
        )
        for a in agencies
    ]


# ---------------------------------------------------------------------------
# Fees
# ---------------------------------------------------------------------------


@app.get("/fees/{agency_id}", response_model=FeeResponse)
async def get_fees(agency_id: str) -> FeeResponse:
    """Return the fee schedule for a specific government agency."""
    fee_data = get_fees_by_agency(agency_id)
    if fee_data is None:
        raise HTTPException(
            status_code=404,
            detail=f"No fee data found for agency '{agency_id}'.",
        )

    service_groups: list[FeeServiceGroup] = []
    for svc_key, svc_fees in fee_data.get("services", {}).items():
        readable_name = svc_key.replace("_", " ").title()
        items = _parse_fee_items(svc_fees)
        service_groups.append(
            FeeServiceGroup(service=readable_name, fees=items)
        )

    return FeeResponse(
        agency_id=agency_id,
        agency_name=fee_data.get("name", agency_id),
        acronym=fee_data.get("acronym"),
        services=service_groups,
    )


def _parse_fee_items(raw: Any) -> list[FeeItem]:
    """Normalise the heterogeneous fee structures into FeeItem instances."""
    items: list[FeeItem] = []

    if isinstance(raw, list):
        for entry in raw:
            items.append(
                FeeItem(
                    type=entry.get("type"),
                    jmd=entry.get("jmd"),
                    days=entry.get("days"),
                    office=entry.get("office"),
                    note=entry.get("note"),
                )
            )
    elif isinstance(raw, dict):
        jmd = raw.get("jmd")
        jmd_range = raw.get("jmd_range")
        note = raw.get("note")

        # Collect any extra descriptive keys
        extra_parts: list[str] = []
        skip_keys = {"jmd", "jmd_range", "note", "type"}
        for k, v in raw.items():
            if k not in skip_keys:
                extra_parts.append(f"{k.replace('_', ' ').title()}: {v}")

        combined_note = note or ""
        if extra_parts:
            combined_note = (
                (combined_note + "; " if combined_note else "")
                + "; ".join(extra_parts)
            )

        items.append(
            FeeItem(
                type=raw.get("type"),
                jmd=jmd,
                jmd_range=jmd_range,
                note=combined_note or None,
            )
        )

    return items


# ---------------------------------------------------------------------------
# Sessions
# ---------------------------------------------------------------------------


@app.get("/sessions/{session_id}", response_model=SessionResponse)
async def get_session(session_id: str) -> SessionResponse:
    """Return the conversation history for a given session."""
    if not session_store.exists(session_id):
        raise HTTPException(
            status_code=404,
            detail=f"Session '{session_id}' not found.",
        )

    history = session_store.get_history(session_id)
    return SessionResponse(
        session_id=session_id,
        messages=[
            SessionMessage(role=m["role"], content=m["content"])
            for m in history
        ],
    )
