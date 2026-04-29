# Scaler Persona Chatbot

A working persona-based chatbot featuring three Scaler and InterviewBit personalities: Anshuman Singh, Abhimanyu Saxena, and Kshitij Mishra. Switching personas resets the conversation and changes the system prompt.

## Features
- Persona switcher with clear active state
- Suggestion chips tailored to each persona
- Typing indicator while the API responds
- Mobile-friendly, responsive UI
- Robust error handling with user-friendly messages

## Tech Stack
- Node.js + Express
- Vanilla HTML, CSS, and JavaScript
- Cerebras OpenAI-compatible API

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment variables:
   ```bash
   copy .env.example .env
   ```
3. Add your API key to `.env`.
4. Start the server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000`.

## Environment Variables
- `CEREBRAS_API_KEY`: API key for Cerebras
- `CEREBRAS_MODEL`: Optional model name. If omitted or unavailable, the server falls back to a supported public model.
- `PORT`: Optional server port

## Deployment
- Deploy to Render, Railway, or Vercel (Node server). Ensure environment variables are set in the hosting provider.
- Update this README with your deployed URL.

## Screenshots
- Add screenshots of the chat UI and persona switcher here.

## Notes
- Do not commit your real API key. Use `.env` locally and `.env.example` for sharing.
