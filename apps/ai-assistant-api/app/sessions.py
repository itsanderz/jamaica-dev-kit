"""Simple in-memory conversation session store.

Each session is identified by a UUID and contains an ordered list of
``{role, content}`` messages exchanged between the user and assistant.

Note: This store is *not* persistent -- sessions are lost when the
process restarts.  A production deployment should swap this for Redis
or a database-backed implementation.
"""

from __future__ import annotations

import uuid
from dataclasses import dataclass, field


@dataclass
class _Session:
    """Internal representation of a single conversation session."""

    session_id: str
    messages: list[dict[str, str]] = field(default_factory=list)


class SessionStore:
    """Thread-safe, in-memory conversation store keyed by session ID."""

    def __init__(self) -> None:
        self._sessions: dict[str, _Session] = {}

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def get_or_create(self, session_id: str | None = None) -> str:
        """Return an existing session ID or create a new one.

        If *session_id* is ``None`` or not found in the store a brand-new
        session is created and its ID returned.
        """
        if session_id and session_id in self._sessions:
            return session_id

        new_id = session_id or uuid.uuid4().hex
        self._sessions[new_id] = _Session(session_id=new_id)
        return new_id

    def add_message(self, session_id: str, role: str, content: str) -> None:
        """Append a message to an existing session.

        Parameters
        ----------
        session_id:
            Must be a valid session ID previously returned by
            :meth:`get_or_create`.
        role:
            ``"user"`` or ``"assistant"``.
        content:
            The message body.
        """
        session = self._sessions.get(session_id)
        if session is None:
            raise KeyError(f"Session not found: {session_id}")
        session.messages.append({"role": role, "content": content})

    def get_history(self, session_id: str) -> list[dict[str, str]]:
        """Return the full message history for a session.

        Returns an empty list when the session does not exist.
        """
        session = self._sessions.get(session_id)
        if session is None:
            return []
        return list(session.messages)

    def exists(self, session_id: str) -> bool:
        """Check whether a session ID is present in the store."""
        return session_id in self._sessions


# Module-level singleton so all modules share the same store.
session_store = SessionStore()
