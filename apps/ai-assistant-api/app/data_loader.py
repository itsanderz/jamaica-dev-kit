"""Functions for loading the shared JSON data files.

These are used by both the RAG ingestion pipeline and the direct-query
endpoints (agencies, fees, parishes).
"""

from __future__ import annotations

import json
import logging
from functools import lru_cache
from pathlib import Path
from typing import Any

from app.config import settings

logger = logging.getLogger(__name__)


def _read_json(filename: str) -> dict[str, Any]:
    """Read and parse a JSON file from the data directory."""
    path = settings.data_dir / filename
    if not path.exists():
        raise FileNotFoundError(f"Data file not found: {path}")
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


# ---------------------------------------------------------------------------
# Public loaders (cached after first call)
# ---------------------------------------------------------------------------


@lru_cache(maxsize=1)
def load_agencies() -> list[dict[str, Any]]:
    """Return the list of government agencies from ``agencies.json``."""
    data = _read_json("agencies.json")
    agencies: list[dict[str, Any]] = data.get("agencies", [])
    logger.info("Loaded %d agencies from agencies.json", len(agencies))
    return agencies


@lru_cache(maxsize=1)
def load_fees() -> dict[str, Any]:
    """Return the full fees structure from ``fees.json``.

    The top-level keys under ``"agencies"`` are agency IDs (e.g. ``"taj"``).
    """
    data = _read_json("fees.json")
    fees: dict[str, Any] = data.get("agencies", {})
    logger.info("Loaded fees for %d agencies from fees.json", len(fees))
    return fees


@lru_cache(maxsize=1)
def load_fees_metadata() -> dict[str, Any]:
    """Return the metadata block from ``fees.json`` (exchange rate, GCT, etc.)."""
    data = _read_json("fees.json")
    return data.get("metadata", {})


@lru_cache(maxsize=1)
def load_parishes() -> list[dict[str, Any]]:
    """Return the list of parishes from ``parishes.json``."""
    data = _read_json("parishes.json")
    parishes: list[dict[str, Any]] = data.get("parishes", [])
    logger.info("Loaded %d parishes from parishes.json", len(parishes))
    return parishes


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def get_agency_by_id(agency_id: str) -> dict[str, Any] | None:
    """Look up a single agency by its ``id`` field."""
    for agency in load_agencies():
        if agency["id"] == agency_id:
            return agency
    return None


def get_fees_by_agency(agency_id: str) -> dict[str, Any] | None:
    """Look up the fee schedule for a specific agency."""
    return load_fees().get(agency_id)


def build_documents_for_ingestion() -> list[dict[str, str]]:
    """Flatten all data files into a list of text documents for RAG ingestion.

    Each document carries ``text`` (human-readable content) and ``source``
    metadata so the retriever can cite its origin.
    """
    documents: list[dict[str, str]] = []

    # --- Agencies & services -------------------------------------------------
    for agency in load_agencies():
        header = (
            f"Agency: {agency['name']}"
            + (f" ({agency['acronym']})" if agency.get("acronym") else "")
        )
        if agency.get("website"):
            header += f"\nWebsite: {agency['website']}"
        if agency.get("online_portal"):
            header += f"\nOnline Portal: {agency['online_portal']}"

        for svc in agency.get("services", []):
            lines = [
                header,
                f"\nService: {svc['name']}",
                f"Available online: {'Yes' if svc.get('online_available') else 'No'}",
            ]
            if svc.get("fee_jmd") is not None:
                lines.append(
                    f"Fee: J${svc['fee_jmd']:,.0f}"
                    if svc["fee_jmd"]
                    else "Fee: Free"
                )
            if svc.get("fee_note"):
                lines.append(f"Fee note: {svc['fee_note']}")
            if svc.get("stated_processing_days") is not None:
                lines.append(
                    f"Stated processing time: {svc['stated_processing_days']} days"
                )
            if svc.get("actual_processing_days") is not None:
                lines.append(
                    f"Actual processing time: {svc['actual_processing_days']} days"
                )
            if svc.get("required_documents"):
                lines.append(
                    "Required documents: "
                    + ", ".join(svc["required_documents"])
                )
            if svc.get("steps"):
                lines.append("Steps:")
                for i, step in enumerate(svc["steps"], 1):
                    lines.append(f"  {i}. {step}")
            if svc.get("note"):
                lines.append(f"Note: {svc['note']}")

            documents.append(
                {
                    "text": "\n".join(lines),
                    "source": f"agencies.json / {agency['id']} / {svc['name']}",
                }
            )

        # Common complaints
        if agency.get("common_complaints"):
            complaints_text = (
                f"{header}\n\nCommon complaints:\n"
                + "\n".join(
                    f"- {c}" for c in agency["common_complaints"]
                )
            )
            documents.append(
                {
                    "text": complaints_text,
                    "source": f"agencies.json / {agency['id']} / complaints",
                }
            )

    # --- Fees ----------------------------------------------------------------
    for agency_id, agency_data in load_fees().items():
        agency_name = agency_data.get("name", agency_id)
        acronym = agency_data.get("acronym", "")
        for svc_key, svc_fees in agency_data.get("services", {}).items():
            readable_name = svc_key.replace("_", " ").title()
            lines = [
                f"Agency: {agency_name}"
                + (f" ({acronym})" if acronym else ""),
                f"Fee schedule for: {readable_name}",
            ]
            if isinstance(svc_fees, list):
                for entry in svc_fees:
                    parts = []
                    if entry.get("type"):
                        parts.append(entry["type"].replace("_", " ").title())
                    if entry.get("jmd") is not None:
                        parts.append(f"J${entry['jmd']:,.0f}")
                    if entry.get("days") is not None:
                        parts.append(f"{entry['days']} days")
                    if entry.get("office"):
                        parts.append(f"({entry['office']})")
                    lines.append("  - " + " | ".join(parts))
            elif isinstance(svc_fees, dict):
                for k, v in svc_fees.items():
                    if k == "note":
                        lines.append(f"  Note: {v}")
                    elif k == "jmd":
                        lines.append(f"  Fee: J${v:,.0f}")
                    elif k == "jmd_range":
                        lines.append(
                            f"  Fee range: J${v[0]:,.0f} - J${v[1]:,.0f}"
                        )
                    elif isinstance(v, (int, float)):
                        lines.append(
                            f"  {k.replace('_', ' ').title()}: {v}"
                        )
                    else:
                        lines.append(
                            f"  {k.replace('_', ' ').title()}: {v}"
                        )

            documents.append(
                {
                    "text": "\n".join(lines),
                    "source": f"fees.json / {agency_id} / {svc_key}",
                }
            )

    # --- Parishes ------------------------------------------------------------
    for parish in load_parishes():
        lines = [
            f"Parish: {parish['name']}",
            f"Capital: {parish['capital']}",
            f"Population: {parish['population']:,}",
            f"Area: {parish['area_km2']} km\u00b2",
            f"Urban percentage: {parish.get('urban_pct', 'N/A')}%",
        ]
        inet = parish.get("internet", {})
        if inet:
            lines.append(f"Broadband level: {inet.get('broadband_level', 'N/A')}")
        sc = parish.get("service_centers", {})
        if sc:
            present = [
                k.upper()
                for k in ("nla", "taj", "pica", "coj")
                if sc.get(k)
            ]
            lines.append(f"Government offices present: {', '.join(present) or 'None'}")
            if sc.get("nla_distance_km"):
                lines.append(f"Distance to nearest NLA: {sc['nla_distance_km']} km")
            if sc.get("pica_distance_km"):
                lines.append(f"Distance to nearest PICA: {sc['pica_distance_km']} km")
        if parish.get("hospitals"):
            lines.append(f"Hospitals: {', '.join(parish['hospitals'])}")

        documents.append(
            {
                "text": "\n".join(lines),
                "source": f"parishes.json / {parish['name']}",
            }
        )

    logger.info(
        "Built %d documents for RAG ingestion from data files", len(documents)
    )
    return documents
