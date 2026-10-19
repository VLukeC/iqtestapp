# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Restored local Supabase

The original database and storage volumes have been migrated to Ubuntu Docker
for `iqtestapp`. Run these commands in Ubuntu from the project root:

```bash
./.tools/supabase start -x logflare,vector,realtime
npm run dev
```

Quiz generation also requires the Python backend in a separate terminal:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r api/requirements.txt
.\.venv\Scripts\python.exe api/api.py
```

The backend listens on port 5000 and uses `GEMINI_API_KEY` from `.env`.

The app uses the local Supabase settings in `.env`. Studio is available at
http://127.0.0.1:54323 and local password-reset emails at http://127.0.0.1:54324.
Analytics and Realtime are disabled in this local configuration.

To stop Supabase while preserving the restored data, run `./.tools/supabase stop`.
Avoid `supabase db reset` and `supabase stop --no-backup`: they can remove restored data.
Database backup files are excluded from Git and the app's file watcher.

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

Run the full app from the project folder in Ubuntu with one command:

```bash
sudo sh docker/start.sh
```

Open http://localhost:3000. The launcher starts the migrated original Supabase
project first, then builds and starts React, Flask, and Nginx with Compose.
Existing accounts and quiz history remain in the original migrated volumes.
Docker Desktop is not needed. The launcher uses the Linux Supabase CLI already
installed in the ignored `.tools/supabase` file. It also handles stale Docker
Desktop plugin links by using Ubuntu's installed native Compose/Buildx plugins.

Keep `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `GEMINI_API_KEY` in `.env`.
The browser uses same-origin `/supabase/` requests forwarded by the app gateway.
For startup failures, check `.tools/supabase-start.log` and
`sudo docker compose logs`. The Supabase log may contain local credentials;
keep it out of version control.

Stop the full app and Supabase with:

```bash
sudo sh docker/stop.sh
```

Both scripts preserve database volumes. Avoid Supabase reset or
`supabase stop --no-backup` commands, which can remove restored data.

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
