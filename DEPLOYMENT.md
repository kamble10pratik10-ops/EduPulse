# Deployment Guide - EduPulse AI

This guide will walk you through deploying your application to production using **Railway** (for the Backend) and **Vercel** (for the Frontend).

## 1. Prepare for Deployment

### A. Backend (Railway)
1.  **Gunicorn/Uvicorn**: Railway automatically detects FastAPI, but it's best to have a `Procfile` or a start script.
2.  **Create a `Procfile`** in the `backend/` directory:
    ```text
    web: uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
    ```
3.  **Ensure `requirements.txt`** is up to date.

### B. Frontend (Vercel)
1.  Update the API URL in `App.tsx` to use an environment variable so it works in both local and production environments.
2.  **Create a `.env.production`** (optional) or set the variable in the Vercel dashboard.

---

## 2. Deploying the Backend (Railway or Render)

### A. Deploying to Railway
1.  Create a [Railway.app](https://railway.app/) account.
2.  Click **New Project** > **Deploy from GitHub repo**.
3.  Select your repository and choose the `backend` folder as the root.
4.  **Add Variables**:
    - `GROQ_API_KEY`: Your actual Groq key.
5.  Railway will give you a public URL.

### B. Deploying to Render.com
1.  Create a [Render.com](https://render.com/) account.
2.  Click **New +** > **Web Service**.
3.  Connect your GitHub repository.
4.  Set the following configuration:
    - **Name**: `edupulse-backend`
    - **Root Directory**: `backend`
    - **Runtime**: `Python 3`
    - **Build Command**: `pip install -r requirements.txt`
    - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5.  **Advanced** > **Add Environment Variable**:
    - `GROQ_API_KEY`: Your actual Groq key.
6.  Click **Create Web Service**. Render will provide a URL like `https://edupulse-backend.onrender.com`.

---

## 3. Deploying the Frontend (Vercel)

1.  Push your code to GitHub.
2.  Go to [Vercel](https://vercel.com/) and click **Add New** > **Project**.
3.  Import your GitHub repository.
4.  **Framework Preset**: Select `Vite`.
5.  **Root Directory**: Select `frontend`.
6.  **Environment Variables**:
    - Add `VITE_API_URL` and set it to your **Render URL** (e.g., `https://edupulse-backend.onrender.com`).
7.  Click **Deploy**.

---

## 4. Final Updates to Code
I have updated your code to support these environment variables. Make sure to commit these changes before deploying!
