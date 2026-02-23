FROM python:3.11-slim

WORKDIR /app

COPY apps/addressing-api/pyproject.toml .
RUN pip install --no-cache-dir .

COPY apps/addressing-api/app ./app
COPY data ./data

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
