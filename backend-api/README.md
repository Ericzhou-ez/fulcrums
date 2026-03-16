# Fulcrums Backend API

FastAPI + MongoDB backend that replaces Firebase callable functions and Firestore realtime with REST endpoints and WebSockets.

## Setup

### Option 1: Docker Compose (Recommended)

1. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

2. Update `.env` with your Firebase credentials:
- `FIREBASE_PROJECT_ID`: Firebase project ID
- `FIREBASE_STORAGE_BUCKET`: Firebase Storage bucket name
- `FIREBASE_SERVICE_ACCOUNT_PATH`: Path to Firebase service account JSON file (if using file)
- `CORS_ORIGINS`: Comma-separated list of allowed CORS origins

3. Place Firebase service account JSON file in `firebase-credentials/` directory (if using file-based auth)

4. Start all services:
```bash
docker-compose up -d
```

Or for development with hot reload:
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

5. View logs:
```bash
docker-compose logs -f
```

6. Stop services:
```bash
docker-compose down
```

### Option 2: Local Development

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

3. Set up environment variables:
- `MONGODB_URI`: MongoDB connection string (e.g., `mongodb://localhost:27017/fulcrums`)
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
