Write-Host "Starting backend services..." -ForegroundColor Green

# Path to the virtual environment activation script for Windows CMD
$VenvActivate = ".\venv\Scripts\activate.bat"

# Use Start-Process to launch separate cmd windows for each service
# This makes it easy to monitor their individual logs and stop them by closing the windows
Start-Process "cmd.exe" -ArgumentList "/k `"title Django Server && $VenvActivate && py manage.py runserver`""
Start-Process "cmd.exe" -ArgumentList "/k `"title Celery Worker && $VenvActivate && celery -A app worker --pool=solo -l info`""
Start-Process "cmd.exe" -ArgumentList "/k `"title Celery Beat && $VenvActivate && celery -A app.celery beat -l info`""
Start-Process "cmd.exe" -ArgumentList "/k `"title ASGI Server && $VenvActivate && uvicorn app.asgi:application --host 127.0.0.1 --port 8005`""
Start-Process "cmd.exe" -ArgumentList "/k `"title FastAPI && $VenvActivate && cd FASTAPI && uvicorn main:app --host 0.0.0.0 --port 8001 --reload`""

Write-Host "All services started in separate windows!" -ForegroundColor Cyan
