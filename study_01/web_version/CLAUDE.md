# Web Version - Handwritten Digit Recognition

## Overview

Web-based handwritten digit recognition application using Flask/FastAPI backend and React/Vue frontend. Deployed on cloud platform for public access.

## Architecture

- **Backend:** Flask or FastAPI (Python)
- **Frontend:** React or Vue.js (JavaScript)
- **Model:** Scikit-learn Random Forest Classifier
- **Deployment:** Docker container or cloud platform (Heroku, AWS, GCP, Azure)
- **Database:** Optional (SQLite for training history, PostgreSQL for production)

## Tech Stack

```
Backend:
- Flask>=2.0.0 or FastAPI>=0.95.0
- numpy>=1.19.0
- scikit-learn>=0.24.0
- Pillow>=8.0.0
- CORS enabled for frontend communication

Frontend:
- React 18+ or Vue 3+
- Axios for API calls
- Canvas API for drawing
- Bootstrap or Tailwind for styling

DevOps:
- Docker for containerization
- Docker Compose for local development
- GitHub Actions or GitLab CI for CI/CD
```

## Project Structure

```
web_version/
├── backend/
│   ├── app.py (Flask/FastAPI main)
│   ├── models/
│   │   ├── digit_recognizer.py
│   │   └── trained_model.pkl
│   ├── routes/
│   │   ├── api.py
│   │   └── auth.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── tests/
│       └── test_api.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Canvas.jsx/vue
│   │   │   ├── PredictionResult.jsx/vue
│   │   │   └── HistoryPanel.jsx/vue
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx/vue
│   │   └── index.js
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml
├── CLAUDE.md (this file)
└── README.md
```

## Development Workflow

### TDD Principles (Must Follow)

1. **Write failing tests first** - Always start with test, verify it fails
2. **Implement minimal code** - Only enough to pass the test
3. **Refactor** - Improve code while keeping tests green
4. **API contract first** - Define API endpoints before implementing

### Backend Development

1. Define API endpoints (Flask routes or FastAPI endpoints)
2. Write tests for endpoints
3. Implement route handlers
4. Add model integration
5. Write integration tests

### Frontend Development

1. Create component structure
2. Write component tests (Jest/Vitest)
3. Implement component logic
4. Connect to API
5. Add E2E tests (Cypress/Playwright)

## Key Features

### Phase 1: MVP (Minimum Viable Product)
- [ ] Backend API with POST /predict endpoint
- [ ] Frontend canvas drawing interface
- [ ] Real-time prediction
- [ ] Error handling for empty canvas
- [ ] Basic styling

### Phase 2: Enhanced UX
- [ ] Prediction history / gallery
- [ ] Confidence scores display
- [ ] Batch prediction (multiple images)
- [ ] Model accuracy stats
- [ ] User accounts (optional)

### Phase 3: Advanced Features
- [ ] Model retraining via UI
- [ ] Different model options
- [ ] Export predictions as CSV
- [ ] Real-time collaboration (WebSockets)
- [ ] Mobile-responsive design

## Environment Variables

### Backend (.env)
```
FLASK_ENV=development
FLASK_DEBUG=True
MODEL_PATH=./models/trained_model.pkl
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Digit Recognizer
```

## Testing Strategy

### Backend
- Unit tests: Test individual functions (models, utilities)
- Integration tests: Test API endpoints
- Test coverage target: >80%
- Use pytest for Python tests

### Frontend
- Component tests: Test React/Vue components
- Integration tests: Test component interactions
- E2E tests: Test full user workflows
- Test coverage target: >70%

## API Specification

### POST /api/predict
**Request:**
```json
{
  "image": "base64_encoded_png"
}
```

**Response:**
```json
{
  "prediction": 7,
  "confidence": 0.95,
  "probabilities": {
    "0": 0.01,
    "1": 0.02,
    ...
    "7": 0.95,
    ...
    "9": 0.001
  }
}
```

### GET /api/history
**Response:**
```json
{
  "predictions": [
    {
      "id": "abc123",
      "timestamp": "2026-09-19T10:30:00Z",
      "prediction": 7,
      "image_thumb": "base64_url"
    }
  ]
}
```

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Tests passing (100%)
- [ ] API documentation generated
- [ ] Frontend build optimized
- [ ] Docker images built and tested
- [ ] CI/CD pipeline configured
- [ ] Error logging configured (Sentry, LogRocket)
- [ ] CORS properly configured
- [ ] Database backups configured
- [ ] SSL certificate configured
- [ ] Rate limiting configured

## Code Standards

- **Python:** PEP 8, Black formatter, mypy type checking
- **JavaScript:** ESLint, Prettier, TypeScript (optional)
- **Comments:** Explain WHY, not WHAT
- **Documentation:** README, API docs, deployment guide
- **English:** All code, comments, documentation in English

## Monitoring & Observability

- Application logging (Python logging, console logs)
- Error tracking (Sentry, DataDog)
- Performance monitoring (New Relic, Datadog)
- API metrics (response times, error rates)
- Frontend analytics (Google Analytics, Mixpanel)

## Security Considerations

- Input validation on both backend and frontend
- CORS properly configured
- HTTPS enforced in production
- No sensitive data in browser (API keys, tokens)
- Rate limiting to prevent abuse
- CSRF protection if using session-based auth
- SQL injection prevention (parameterized queries)
- XSS prevention (sanitize user input)

## Running Locally

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
# Runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000 (Vite) or 3000 (Create React App)
```

### Docker Compose
```bash
docker-compose up
# Backend on http://localhost:5000
# Frontend on http://localhost:3000
```

## Contributing Guidelines

1. Create feature branch from main
2. Follow TDD: tests first, then implementation
3. Keep commits small and focused
4. Write clear commit messages
5. Create PR with description of changes
6. Pass all tests before merging
7. At least one code review before merge

## Support

For issues or questions about this web version development, check:
- Backend API documentation: `/api/docs` (FastAPI) or Swagger UI
- Frontend component documentation: Storybook or similar
- Deployment documentation: docs/DEPLOYMENT.md
- Architecture decision records: docs/adr/
