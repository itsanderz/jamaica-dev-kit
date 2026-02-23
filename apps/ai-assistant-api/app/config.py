"""Application configuration using pydantic-settings."""

from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Settings for the AI Government Assistant API.

    Values are loaded from environment variables (case-insensitive) and
    fall back to the defaults declared here.  A ``.env`` file placed next
    to ``pyproject.toml`` is loaded automatically.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # --- Anthropic -----------------------------------------------------------
    anthropic_api_key: str = Field(
        default="",
        description="Anthropic API key for Claude access.",
    )

    # --- Model ---------------------------------------------------------------
    model_name: str = Field(
        default="claude-sonnet-4-20250514",
        description="Claude model identifier used for generation.",
    )

    # --- ChromaDB ------------------------------------------------------------
    chromadb_host: str = Field(
        default="localhost",
        description="ChromaDB server host (used in client mode).",
    )
    chromadb_port: int = Field(
        default=8000,
        description="ChromaDB server port (used in client mode).",
    )
    chromadb_persist_dir: str = Field(
        default=".chroma",
        description="Directory for persistent local ChromaDB storage.",
    )

    # --- RAG -----------------------------------------------------------------
    chunk_size: int = Field(
        default=1000,
        description="Maximum characters per text chunk during ingestion.",
    )
    chunk_overlap: int = Field(
        default=200,
        description="Overlap between consecutive text chunks.",
    )

    # --- Data ----------------------------------------------------------------
    data_dir: Path = Field(
        default=Path(__file__).resolve().parent.parent.parent.parent / "data",
        description="Path to the shared data/ directory.",
    )


settings = Settings()
