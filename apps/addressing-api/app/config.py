"""Application configuration loaded from environment variables."""

from __future__ import annotations

from pathlib import Path
from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Central configuration for the addressing API.

    Values are read from environment variables (case-insensitive) and fall back
    to the defaults defined here.  A ``.env`` file in the project root is loaded
    automatically when present.
    """

    HOST: str = Field(default="0.0.0.0", description="Bind host for uvicorn")
    PORT: int = Field(default=8000, description="Bind port for uvicorn")
    DATA_DIR: Path = Field(
        default=Path(__file__).resolve().parent.parent.parent.parent / "data",
        description="Path to the shared data directory containing parishes.json etc.",
    )

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return the cached application settings singleton."""
    return Settings()
