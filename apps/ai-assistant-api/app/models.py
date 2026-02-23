"""Pydantic request / response models for the AI Government Assistant API."""

from __future__ import annotations

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Chat
# ---------------------------------------------------------------------------


class ChatRequest(BaseModel):
    """Incoming chat message from a citizen."""

    message: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="The user's question or message.",
    )
    session_id: str | None = Field(
        default=None,
        description="Optional session identifier for conversation continuity.",
    )


class ChatResponse(BaseModel):
    """Response returned from the /chat endpoint."""

    response: str = Field(
        ...,
        description="The assistant's reply.",
    )
    session_id: str = Field(
        ...,
        description="Session identifier (created if not supplied in the request).",
    )
    sources: list[str] = Field(
        default_factory=list,
        description="Source references used to generate the answer.",
    )


# ---------------------------------------------------------------------------
# Agencies
# ---------------------------------------------------------------------------


class ServiceSummary(BaseModel):
    """Abbreviated view of a single government service."""

    name: str
    online_available: bool
    fee_jmd: float | None = None
    fee_note: str | None = None
    stated_processing_days: int | None = None
    actual_processing_days: int | None = None


class AgencyResponse(BaseModel):
    """Public representation of a government agency."""

    id: str
    name: str
    acronym: str | None = None
    website: str | None = None
    services_count: int
    has_online_portal: bool


# ---------------------------------------------------------------------------
# Fees
# ---------------------------------------------------------------------------


class FeeItem(BaseModel):
    """A single fee entry for a service."""

    type: str | None = None
    jmd: float | None = None
    jmd_range: list[float] | None = None
    days: int | None = None
    office: str | None = None
    note: str | None = None


class FeeServiceGroup(BaseModel):
    """Fees grouped under one service name."""

    service: str
    fees: list[FeeItem]


class FeeResponse(BaseModel):
    """All fees for a given agency."""

    agency_id: str
    agency_name: str
    acronym: str | None = None
    services: list[FeeServiceGroup]


# ---------------------------------------------------------------------------
# Sessions
# ---------------------------------------------------------------------------


class SessionMessage(BaseModel):
    """A single message in a conversation session."""

    role: str = Field(
        ...,
        description="Either 'user' or 'assistant'.",
    )
    content: str


class SessionResponse(BaseModel):
    """Full conversation history for a session."""

    session_id: str
    messages: list[SessionMessage]


# ---------------------------------------------------------------------------
# Parishes
# ---------------------------------------------------------------------------


class ParishResponse(BaseModel):
    """Summary view of a Jamaican parish."""

    name: str
    code: str
    capital: str
    population: int
    area_km2: float
