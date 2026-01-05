# Verba AI – Simple Chat Interface (Mocked Backend)

This project is a simple full-stack chat application built as a home task for the Full-Stack Intern position at Verba AI.

The app demonstrates a clean chat UI connected to a mocked backend that simulates AI responses.

---

## Tech Stack

### Frontend
- React
- Vite
- CSS (custom styling, responsive layout)

### Backend
- Python
- FastAPI
- Uvicorn

---

## Features

- Chat interface with message input
- Message history (user & bot messages)
- Mocked AI responses (rule-based)
- Message timestamps
- Loading / typing indicator
- Basic error handling
- Mobile-friendly responsive layout

---

## How to Run the Project

### Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8001

Backend will run at:
http://localhost:8001

Frontend (React)
cd frontend
npm install
npm run dev

Frontend (React)
http://localhost:5173

How This Would Integrate with a Real AI Agent
In a production system, the mocked response logic would be replaced with:
A call to an AI provider (OpenAI, Azure OpenAI)
The backend would forward user messages to the AI API
The AI-generated response would be returned to the frontend
Additional features like conversation memory, user context, and streaming responses could be added
The current architecture already supports this upgrade without major frontend changes.