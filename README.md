# HealthTrust Platform

A comprehensive healthcare management system utilizing a distributed architecture to provide medical appointment scheduling, patient record management, and deep learning-based medical image analysis.

## System Architecture

The application is built on a hybrid microservices architecture designed to decouple standard web operations from intensive machine learning workloads.

*   **Core Backend (Django & Django REST Framework):** Manages relational data, user authentication, role-based access control, appointment scheduling, and financial transactions.
*   **Asynchronous Task Queue (Celery & Redis):** Processes non-blocking operations such as email dispatch, scheduled background jobs, and inter-service communication.
*   **Real-Time Subsystem (Django Channels & Redis):** Provides persistent WebSocket connections to deliver instant notifications and updates to active users.
*   **AI Inference Microservice (FastAPI):** An isolated service dedicated to loading and executing deep learning models (TensorFlow/Keras) for medical scan classification, preventing heavy computational loads from blocking the primary web server.
*   **Client Application (React & Vite):** A responsive Single Page Application built with TypeScript and Tailwind CSS, acting as the primary interface for patients, doctors, and administrators.

## Features

### Role-Based Access Control
*   **Administrator:** Full system oversight, including user management, subscription overrides, and global analytics.
*   **Premium Patient:** Access to advanced features, including priority scheduling and a monthly allocation of automated AI scan inferences.
*   **Standard Patient:** Baseline access for booking appointments and viewing medical history.

### Appointment Management
*   Automated scheduling system preventing double-booking and weekend appointments.
*   Real-time status updates (Pending, Approved, Finished, Canceled).
*   Ability for patients to request rescheduling and for administrators to manage clinic availability.

### Medical History and AI Inference
*   Secure storage and retrieval of patient medical records and imaging.
*   Integrated pipeline for automated scan analysis. When an authorized user uploads a scan (e.g., chest X-ray), the system securely routes the image to the FastAPI service.
*   The inference service normalizes the data, executes the appropriate predictive model (binary or multiclass classification), and returns a diagnostic prediction alongside a confidence metric.
*   Results are permanently archived within the patient's medical history for physician review.

### Real-Time Communication
*   WebSocket connections deliver instantaneous notifications regarding appointment status changes, AI inference completion, and system alerts.
*   A dedicated notification center within the frontend provides users with a consolidated view of recent activity without requiring page refreshes.

### Subscriptions and Billing
*   Premium membership tier management.
*   Support for promotional coupons to grant temporary premium access or discounted rates.

### System Event Auditing and Monitoring
*   Automated transactional and entity event logging implemented across key models, including user, appointment, payment, subscription, and medical history.
*   System audit log captures including the initiating user context, precise action categorization, detailed event description, and precise UTC timestamps.
*   A secure management endpoint restricted to administrators exposes the most recent 10 events.
*   Dedicated system activity logs dashboard interface to allow administrators to monitor audit trails in real-time.

## Project Setup
Note : to make the setup easier, a run script (`run.ps1` / `run.sh`) has been established for convenience , use it to run the project, or else you can run each component individually.

### Core Backend (Django)

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Create and activate a Python virtual environment:
    ```bash
    python -m venv venv
    # Windows:
    venv\Scripts\activate
    # Unix:
    source venv/bin/activate
    ```

3.  Install required dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  Configure environment variables by creating a `.env` file in the `backend/` directory:
    ```env
    CHARGILY_KEY=your_chargily_key #TBD
    CHARGILY_SECRET=your_chargily_secret #TBD
    EMAIL=your_system_email@domain.com
    EMAIL_PASSWORD=your_app_password
    USE_REDIS=True
    REDIS_HOST=127.0.0.1
    ```

5.  Apply database migrations and populate initial seed data:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    python manage.py seed
    ```

6.  Initialize infrastructure services:
    *   Ensure a Redis server is operational on `127.0.0.1:6379`.
    *   Start the Celery worker process:
        ```bash
        celery -A app worker -l info -P eventlet
        ```

7.  Start the ASGI application server:
    ```bash
    uvicorn app.asgi:application --host 127.0.0.1 --port 8000
    ```

### AI Inference Service (FastAPI)
Note : Make sure to download the model for the inference service, located in https://huggingface.co/Laufey/mutliclassifier-lungcancer/tree/main directory.

1.  Navigate to the FastAPI directory:
    ```bash
    cd backend/FASTAPI
    ```

2.  Start the inference service:
    ```bash
    uvicorn main:app --host 0.0.0.0 --port 8001 --reload
    ```

### Client Application (React)

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install Node dependencies:
    ```bash
    npm install
    ```

3.  Start the Vite development server:
    ```bash
    npm run dev
    ```

## API Documentation

### Authentication and User Management
*   `POST /api/token/` : Obtain JWT access and refresh tokens.
*   `POST /api/token/refresh/` : Generate a new access token.
*   `POST /users/` : Register a new patient account.
*   `GET /users/me/` : Retrieve the authenticated user profile.
*   `PATCH /users/me/` : Modify profile information.
*   `PATCH /users/change-password/` : Update account credentials.

### Appointment Scheduling
*   `GET /appointments/` : Retrieve the user's appointment history.
*   `POST /appointments/` : Request a new appointment slot.
*   `PATCH /appointments/<id>/` : Modify details of a pending appointment.
*   `DELETE /appointments/<id>/` : Cancel an existing appointment.

### Premium Services and Financials
*   `POST /premium/` : Upgrade a user to premium status (Administrative endpoint).
*   `DELETE /premium/revoke/<user_id>/` : Remove premium privileges (Administrative endpoint).
*   `POST /coupons/redeem/` : Apply a discount code to an account.
*   `POST /payments/` : Process and record a transaction.

### Medical Records and Inference
*   `GET /medical-history/` : Retrieve archived patient records.
*   `POST /medical-history/` : Attach a new record or scan to a patient file.
*   `POST /ai-inference/` : Dispatch a medical image to the FastAPI service for diagnostic classification.

### System Monitoring and Auditing
*   `GET /admin/activity-logs/` : Retrieve the 10 most recent system audit logs (Administrative endpoint).

### WebSocket Connections
*   `ws://localhost:8000/ws/notifications/` : Subscribes the client to real-time account and system events.
*   `ws://localhost:8000/ws/chat/<room_name>/` : Establishes a connection for real-time messaging within a designated room.
