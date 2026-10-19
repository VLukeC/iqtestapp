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

The downloaded database has been restored into the Docker volume for `iqtestapp`.
Start Docker Desktop, then run:

```bash
npx --yes supabase start -x logflare,vector,realtime
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

To stop Supabase while preserving the restored data, run `npx --yes supabase stop`.
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

Start Docker, then run from the project root (in Ubuntu/WSL, use
`cd /mnt/c/Users/Sam/OneDrive/Desktop/iqtestapp`):

```bash
sudo docker compose up --build -d
```

Open http://localhost:3000. Compose builds and starts the React frontend and
Python API, plus an Nginx gateway that forwards `/api/` requests to Flask.
The Python API starts automatically using Gunicorn.

The project-root `.env` must contain `VITE_SUPABASE_URL`,
`VITE_SUPABASE_ANON_KEY`, and `GEMINI_API_KEY`. Only the public Supabase
settings are embedded in the frontend build; the Gemini key is passed to
the API at runtime. Rebuild after changing the Supabase settings.
Environment files, local dependencies, and database backups are excluded
from the build context.

Supabase remains a separate service: start your existing local Supabase
with the command above, or use a hosted Supabase project. The Supabase URL
must be reachable from your browser. This Compose setup does not start or
migrate the existing database. If login redirects should return to this
Docker app, configure the auth redirect URL for port 3000; the current
password-reset flow uses port 5173.

If an older container is using port 3000, stop it before starting Compose.
To inspect logs or stop this app:

```bash
sudo docker compose logs -f
sudo docker compose down
```

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
