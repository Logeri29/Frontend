# SafePulse

SafePulse — a Vite + React dashboard with an Express API for community incident reporting, live feed, searchable incidents, and basic admin tools.

## Quick start

Prerequisites: Node.js 18+, npm

1. Install dependencies

```bash
npm install
npm --prefix server install
```

2. Run in development (frontend + API in separate terminals)

```bash
npm run dev                    # frontend (Vite)
npm --prefix server run dev    # API (nodemon)
```

3. Share the local frontend with others

```bash
npx ngrok http 5173
# or
npx localtunnel --port 5173
```

4. Build and serve (production-style)

```bash
npm run build
npm run serve:all
```

The server serves the built app and API on the same port (default 4000).

## API endpoints (examples)

- `GET /api/incidents/incidents/` — list incidents
- `POST /api/incidents/incidents/submit/` — submit incident
- `POST /api/incidents/incidents/:id/acknowledge/` — acknowledge incident
- Auth stubs under `/api/auth/*`

See `src/api/endpoints.js` for the endpoint constants used by the frontend.

## Development notes

- Frontend entry: `src/main.jsx`
- Sidebar, Header, LiveIncidentFeed components are under `src/components`
- Mock data: `src/data/incidentData.js`

## Contributing

1. Create a branch using a descriptive name (example: `safe-pulse/add-search-api`).
2. Commit changes and push to GitHub.
3. Open a Pull Request against `main` and request review.


## Deploy

- Recommended: Render, Vercel, or Railway.

- Vercel (frontend-only): set **Build Command** to `npm run build` and **Output Directory** to `dist`. This repo includes an example `vercel.json` configured for a static build.

- Full-stack (frontend + API on Vercel): this repo now includes a Vercel serverless API under `api/[...slug].js`, so frontend and API can run together on Vercel using the same `/api/*` routes.

- Example for Render: set build command to `npm run build` and start command to `node server/index.js`.

See [DEPLOYMENT.md](DEPLOYMENT.md) for a detailed guide: required secrets, Render/Vercel steps, CI workflow behavior, and troubleshooting.

Detailed deployment notes

- Option A — Host frontend on Vercel, API on Render or Railway

	1. Deploy the frontend to Vercel (root `dashboard`):

		 - Build Command: `npm run build`
		 - Output Directory: `dist`
		 - (Optional) Set Environment Variable `VITE_API_BASE` to your API URL, e.g. `https://your-api.onrender.com`.

	2. Deploy the API to Render or Railway from the repository (set the service root to `dashboard`):

		 - Build Command: `npm install && npm --prefix server install && npm run build`
		 - Start Command: `node server/index.js`
		 - Port: Render/Railway will provide `PORT` automatically; `server/index.js` uses `process.env.PORT`.

	3. On Vercel, set `VITE_API_BASE` to the API's URL so the frontend makes requests to the hosted API.
+
+  4. If you want CI to deploy both, add these GitHub secrets to your repo:
+     - `RENDER_API_KEY`
+     - `RENDER_SERVICE_ID`
+     - `VERCEL_TOKEN`
+     - `VERCEL_PROJECT_ID` (optional, only needed if the frontend repo is not already linked)
+
+- Option B — Single service on Render/Railway (frontend + API together)
	1. Create a Web Service and set the root directory to `dashboard`.
	2. Build Command: `npm install && npm --prefix server install && npm run build`
	3. Start Command: `node server/index.js`
	4. The Express server will serve the built frontend from `dashboard/dist` and expose `/api/*` endpoints.

Notes & recommendations

- CORS: the backend currently uses permissive `cors()` (allows all origins). For production, set a specific origin or configure via `CORS_ORIGIN` env var and use it in `server/index.js`.
- Environment variable in frontend: Vite exposes variables prefixed with `VITE_`. Set `VITE_API_BASE` in the Vercel project settings (or in the site settings on Render when serving frontend) to point to your API.
- If you prefer serverless functions on Vercel, I can help convert the Express routes into Vercel Serverless Functions under an `/api` folder.

## License

Add your license here.

