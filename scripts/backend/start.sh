#!/bin/bash
# Start script for SIID FLASH Python backend

echo "Starting SIID FLASH Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install/update dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Prefer local backend .env; if absent, copy project root .env for convenience
if [ -f ".env" ]; then
    echo "Using scripts/backend/.env"
elif [ -f "../../.env" ]; then
    echo "Found project root .env — copying to backend dir for convenience"
    cp ../../.env .env
else
    echo "Warning: .env not found. Please create scripts/backend/.env (see .env.example)"
    exit 1
fi

# Test database connection (uses app.settings to read .env)
echo "Testing database connection..."
python test_connection.py

# Apply migrations (Alembic if available, fallback to create_all)
echo "Running migrations (alembic upgrade head or fallback)..."
python migrate.py

# Start the server
echo "Starting uvicorn server..."
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
