# SafePulse — API deployment

This document shows quick steps to deploy the Express API (and optionally the built frontend) to Render or Railway, and how to connect the frontend (Vercel) via `VITE_API_BASE`.

Prerequisites
- Node.js 18+, npm
- Repository accessible from Render/Railway

Render (recommended for full-stack together)
1. Create a new **Web Service** on Render and connect your Git repo.
2. Set the **Root Directory** to `dashboard`.
3. Build Command:

```
npm install && npm --prefix server install && npm run build
```

4. Start Command:

```
node server/index.js
```

5. Environment / Settings:
- `PORT` is provided by Render automatically; `server/index.js` uses `process.env.PORT`.
- (Optional) add `CORS_ORIGIN` or similar and update `server/index.js` to restrict origins.

6. After deploy, note the service URL (e.g. `https://your-service.onrender.com`) and set `VITE_API_BASE` in your Vercel frontend project to that URL.

Railway
1. Create a new project on Railway and connect the repo.
2. If Railway asks for a service root, set it to `dashboard`.
3. Build Command:

```
npm install && npm --prefix server install && npm run build
```

4. Start Command:

```
node server/index.js
```

5. Railway provides `PORT` environment variable automatically.

Frontend integration (Vercel)
- In your Vercel dashboard for the frontend project, set `VITE_API_BASE` to the API URL (no trailing slash), e.g. `https://your-service.onrender.com`.
- Vite exposes env vars prefixed with `VITE_`, so `VITE_API_BASE` is available in the app.

Local test commands

From the repo root:

```
# install deps
npm install
npm --prefix server install
# build frontend
npm run build
# start local combined server (serves dist + API)
npm run serve:all
```

Quick curl tests (replace host/port if deployed):

```
curl https://your-service.onrender.com/api/incidents/incidents/
curl -X POST https://your-service.onrender.com/api/auth/login/ -H 'Content-Type: application/json' -d '{"email":"a@b.com","password":"pass"}'
```

Security notes
- The backend currently enables permissive CORS (`cors()`). For production, set and enforce a specific origin.
- Replace any demo/fake tokens with real auth before production.

If you want, I can: convert the Express routes into Vercel serverless functions, or create a small CI workflow for Render/Railway — which should I do next?