# Deployment Guide — Vercel + Render

This guide explains how to deploy the SafePulse frontend and API using Vercel (frontend or combined) and Render (API), and how the included GitHub Actions workflows operate.

Contents
- Overview
- Prerequisites
Required GitHub secrets
-----------------------

- `RENDER_DEPLOY_HOOK` (optional) — a Render Deploy Hook URL. If present, CI will POST to this URL to trigger a deploy.
- `RENDER_API_KEY` — Render API key (used to trigger deploys via the API). Must have deploy permission. Used if `RENDER_DEPLOY_HOOK` is not provided.
- `RENDER_SERVICE_ID` — Render Service ID for your API service (used with `RENDER_API_KEY`).
- `VERCEL_TOKEN` — Vercel personal token (for CI deploys via the Vercel Action).
- `VERCEL_PROJECT_ID` (optional) — Vercel project ID for the frontend (useful when project is not linked).
- `VERCEL_ORG_ID` (optional) — Vercel organization ID (some CI setups require it).
- `FRONTEND_VITE_API_BASE` (optional) — the URL of the hosted API (used during frontend build to bake in absolute API URLs).
Overview
--------

You have three primary deployment options:

- Frontend-only on Vercel (static site)
- Full-stack on Render (Express server serves `dist` and `/api/*`)
- Combined CI: API deployed to Render and frontend deployed to Vercel automatically via GitHub Actions

Prerequisites
-------------

- GitHub repository with this code
- Node.js 18+ for local builds
- Accounts on Vercel and Render (or Railway)

Required GitHub secrets
-----------------------

- `RENDER_API_KEY` — Render API key (used to trigger deploys). Must have deploy permission.
- `RENDER_SERVICE_ID` — Render Service ID for your API service.
- `VERCEL_TOKEN` — Vercel personal token (for CLI/API deploys from CI).
- `VERCEL_PROJECT_ID` (optional) — Vercel project ID for the frontend (useful when project is not linked).
- `FRONTEND_VITE_API_BASE` (optional) — the URL of the hosted API (used during frontend build to bake in absolute API URLs).

Vercel setup (manual)
----------------------

1. In Vercel, create a new project and point it to this repository. Choose the `dashboard` directory as the root (or link the repo and then `vercel link`).
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Environment Variables: add `VITE_API_BASE` and set it to your API URL (if the API is hosted separately), e.g. `https://your-api.onrender.com`.
5. Deploy using the Vercel dashboard or the CLI:

```bash
cd dashboard
npx vercel --prod
```

Render setup (manual)
---------------------

1. Create a new Web Service on Render and connect your Git repository.
2. Set the **Root Directory** to `dashboard`.
3. Build Command:

```
npm install && npm --prefix server install && npm run build
```

4. Start Command:

```
node server/index.js
```

5. Note the service URL and copy it; if you use Vercel for the frontend, set `VITE_API_BASE` to this URL in the Vercel project settings.

C I workflows (what they do)
--------------------------

- `.github/workflows/deploy-render.yml` — builds the project and triggers a Render deploy using the Render API. Useful if you want a single host (Render) to run both frontend and API together.
- `.github/workflows/deploy-both.yml` — builds the frontend, triggers a Render deploy for the API (via Deploy Hook if `RENDER_DEPLOY_HOOK` is set, otherwise via the Render API), and deploys the frontend to Vercel using the `amondnet/vercel-action`. It expects these secrets: `RENDER_DEPLOY_HOOK` or (`RENDER_API_KEY` + `RENDER_SERVICE_ID`), `VERCEL_TOKEN` and optionally `VERCEL_PROJECT_ID`, `VERCEL_ORG_ID`, and `FRONTEND_VITE_API_BASE`.

Notes about CI behavior
- The CI builds the frontend artifact locally in the workflow and then triggers the Render deploy via the Render API. Render will do its own build/deploy unless you configure a Deploy Hook or use a specific Render action.
- The Vercel deploy step uses the Vercel CLI in the workflow. For deterministic CI deploys, prefer using `VERCEL_PROJECT_ID` (the action accepts the project ID) or pre-link the project in the repository via `vercel link` locally.

Environment variables and `VITE_API_BASE`
----------------------------------------

- `VITE_API_BASE` is used by `src/api/endpoints.js` to create absolute API URLs when provided. Set it to the API base URL without a trailing slash (e.g. `https://api.example.com`).
- When building in CI, set the `FRONTEND_VITE_API_BASE` GitHub secret (the workflows map it to `VITE_API_BASE` at build time).

Production recommendations
------------------------

- CORS: the API currently uses permissive `cors()`; restrict it to the frontend origin in production.
- Persistence: the serverless API stores incidents in memory; use a persistent DB (Postgres, MongoDB) or an external storage backend for production.
- Auth: replace demo/fake tokens with a proper auth flow (JWTs with secret management or an auth provider).
- Logging & monitoring: add structured logging and monitoring integrations for the API.

Troubleshooting
---------------

- Large bundles: the Vite build may warn about large chunks. Consider code-splitting with dynamic `import()` for heavy components.
- Vercel CLI in CI: if the `npx vercel --prod` step fails, ensure `VERCEL_TOKEN` and (optionally) `VERCEL_PROJECT_ID` secrets are set.
- Render API failures: double-check `RENDER_API_KEY` and `RENDER_SERVICE_ID`. You can manually trigger a deploy in the Render dashboard to verify.

Verifying a deployed full-stack site
-----------------------------------

1. If deployed on Render alone, visit the Render service URL — the Express server serves both `dist` and `/api/*`.
2. If frontend is on Vercel and API on Render, visit the Vercel URL and ensure network requests to `/api/*` return expected responses. Use browser devtools to inspect requests.

Rollback and safety
-------------------

- Vercel and Render both provide dashboard UI to rollback to a previous deployment.
- For CI safety, protect the `main` branch and use pull requests for changes to deployment-critical files.

If you want
-----------

- I can add a GitHub Action that uses the Render GitHub App or the official Render deploy action (if you prefer not to use direct API calls).
- I can switch the Vercel deployment step to use the dedicated `amondnet/vercel-action` for more control and environment management.

Contact
-------

If you want me to wire up any of the optional improvements (Railway action, Render GitHub App, Vercel action, or DB integration), tell me which and I’ll implement it.
