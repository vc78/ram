FROM python:3.11-slim

WORKDIR /app

# Install system deps
RUN apt-get update && apt-get install -y build-essential default-libmysqlclient-dev gcc --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY app ./app
COPY seed_sample_data.py ./
COPY migrate.py ./
COPY alembic.ini ./
COPY alembic ./alembic

ENV PYTHONUNBUFFERED=1

EXPOSE 8000

CMD ["/bin/sh", "-c", "python migrate.py && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"]
