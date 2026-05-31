#!/bin/bash

echo "Starting backend services..."

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
elif [ -d ".venv" ]; then
    source .venv/bin/activate
fi

# Trap SIGINT (Ctrl+C) to gracefully stop all background processes when the script stops
trap 'echo "Stopping all services..."; kill $(jobs -p); exit' SIGINT SIGTERM EXIT

# Start all services in the background
python manage.py runserver &
celery -A app worker -l info &
celery -A app.celery beat -l info &
uvicorn app.asgi:application --host 127.0.0.1 --port 8005 &
(cd FASTAPI && uvicorn main:app --host 0.0.0.0 --port 8001 --reload) &

echo "All services started."
echo "Press Ctrl+C to stop all services."

# Wait for all background jobs to finish
wait
