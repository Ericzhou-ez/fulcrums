# Fulcrums Backend API

FastAPI + MongoDB backend that replaces Firebase callable functions and Firestore realtime with REST endpoints and WebSockets.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

3. Set up environment variables:
- `MONGODB_URI`: MongoDB connection string
- `FIREBASE_PROJECT_ID`: Firebase project ID
- `FIREBASE_STORAGE_BUCKET`: Firebase Storage bucket name
- `FIREBASE_SERVICE_ACCOUNT_PATH`: Path to Firebase service account JSON file
- `CORS_ORIGINS`: Comma-separated list of allowed CORS origins

4. Run the server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Authentication

All endpoints (except `/` and `/health`) require Firebase ID token in the Authorization header:
```
Authorization: Bearer <firebase-id-token>
```
