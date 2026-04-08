# Deployment Guide: Centralized API & AI Services

This repo is now configured for a single, centralized deployment on **Render** using Docker.

Note: The AI service folder name in this repository is `ai_services`.

## 🚀 One-Click Deployment

1.  Push your changes to your GitHub repository.
2.  Go to the [Render Dashboard](https://dashboard.render.com/).
3.  Click **New +** and select **Blueprint**.
4.  Connect this repository.
5.  Render will automatically detect the `render.yaml` file and set up:
    *   A **PostgreSQL** database.
    *   The **Centralized API Service** (Backend + AI Services).

## 🔑 Environment Variables to Set

After the Blueprint starts, go to the **Environment** tab of your `smart-hospitality-api` service and fill in:

*   `GROQ_API_KEY`: Your Groq key.
*   `GOOGLE_API_KEY`: Your Gemini key.
*   `STRIPE_SECRET_KEY`: From your Stripe dashboard.
*   `JWT_EXPIRY`: e.g. `7d`.
*   `EMAIL_USER` / `EMAIL_PASS`: If you want email support.

## 🌐 Frontend Configuration

On **Vercel** (or wherever your frontend is), update your environment variables:

1.  `REACT_APP_API_URL`: `https://your-service-name.onrender.com/api`
2.  `REACT_APP_AI_URL`: `https://your-service-name.onrender.com/api/ai`

For your current frontend deployment (`https://shmi.vercel.app/`), set:

1.  `REACT_APP_API_URL`: `https://smart-hospitality-api.onrender.com/api` (replace with your actual Render service URL)
2.  `REACT_APP_AI_URL`: `https://smart-hospitality-api.onrender.com/api/ai` (replace with your actual Render service URL)

## 🛠 Local Development (Docker)

To test the entire centralized setup locally:

```bash
docker build -t hospitality-api .
docker run -p 10000:10000 --env-file .env hospitality-api
```

Your API will be available at `http://localhost:10000/api` and AI at `http://localhost:10000/api/ai`.
