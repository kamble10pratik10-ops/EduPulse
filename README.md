# 🎓 EduPulse AI - Student Performance Predictor

**EduPulse AI** is a premium, data-driven application designed to help students understand their academic trajectory. By combining research-backed heuristic algorithms with the power of **Groq-powered LLMs**, EduPulse provides not just a prediction, but a personalized roadmap to academic success.

![EduPulse Preview](https://raw.githubusercontent.com/kamble10pratik10-ops/EduPulse/main/frontend/public/preview.png) *(Note: Add your preview image to this path or replace with your generated image)*

## ✨ Key Features

-   **🎯 Heuristic Prediction Engine**: Instantly calculates an "Expected Grade" based on Study Hours, Attendance, Previous Performance, Sleep, and Stress levels.
-   **🤖 AI Academic Advisor**: Integrates with **Groq (Llama 3.1)** to generate deeply personalized study strategies, lifestyle adjustments, and motivational guidance.
-   **💎 Premium Glassmorphism UI**: A futuristic, high-fidelity interface built with React, Vite, and Framer Motion, optimized for all screen sizes.
-   **📊 Smart Insights**: Interactive cards that highlight key academic metrics at a glance.
-   **🚀 Deployment Ready**: Pre-configured for seamless deployment on **Railway** (Backend) and **Vercel** (Frontend).

## 🛠️ Technology Stack

-   **Frontend**: React (TypeScript), Vite, Framer Motion, Lucide Icons, React Markdown.
-   **Backend**: Python, FastAPI, Groq SDK, Pydantic, Uvicorn.
-   **Design**: Modern Vanilla CSS with Glassmorphism and Mesh Gradients.

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.10+
- Node.js & npm
- A [Groq API Key](https://console.groq.com/)

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```
Create a `.env` file in the `backend/` directory:
```text
GROQ_API_KEY=your_key_here
```
Run the server:
```bash
python main.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

## 🌐 Deployment

For instructions on how to deploy this app to **Railway** and **Vercel**, check the [Deployment Guide](DEPLOYMENT.md).

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Built with ❤️ for better education.