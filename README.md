# WashWorld — Dockerized

Containerized deployment of the WashWorld car wash app, built for the **E26 Development Environments** course assignment. This repo packages an existing full-stack application (originally built by a four-person student team as an exam project) into a reproducible Docker Compose setup with a database, a named network, and persistent volumes.

## What's in here

| Service      | Tech                          | Container name          | Host port |
|--------------|--------------------------------|--------------------------|-----------|
| `frontend`   | Next.js / TypeScript / Tailwind | `washworld_frontend`    | 3000      |
| `backend`    | Flask (Python)                 | `washworld_flask`       | 80        |
| `mariadb`    | MariaDB                        | `washworld_mariadb`     | 3308 → 3306 |
| `phpmyadmin` | phpMyAdmin                     | `washworld_phpmyadmin`  | 8080      |

All four services run on a shared custom Docker network, **`washworld-network`**, so they can reach each other by service name (e.g. the backend connects to the database at host `mariadb`, and phpMyAdmin is configured with `PMA_HOST=mariadb`).

Database data is stored in a named Docker volume, **`mariadb_data`**, so it persists across container restarts (`docker compose down` / `docker compose up`) — the data is only lost if you explicitly run `docker compose down -v`.

## Prerequisites

- Docker Desktop (or Docker Engine + Compose) installed and running
- Git

## Setup

1. **Clone the repo:**
   ```
   git clone https://github.com/Arhqirah/washworld-docker.git
   cd washworld-docker
   ```

2. **Create your environment file** from the provided template and fill in real values:
   ```
   cp .env.example .env
   ```
   (On Windows PowerShell: `copy .env.example .env`)

   Variables you'll need to set in `.env`:
   - `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE` — database credentials
   - `DOCKER_PLATFORM` — `linux/amd64` on Windows/Intel Macs, `linux/arm64` on Apple Silicon
   - `SECRET_KEY` — used for JWT signing on the backend
   - `BACKEND_URL`, `FRONTEND_URL` — should stay as `http://localhost` and `http://localhost:3000` for local use
   - `RESEND_API_KEY` — used for sending verification emails (optional for local testing; registration still works without a valid key, it just won't deliver the email)
   - `NEXT_PUBLIC_API_BASE_URL` — **must be `http://localhost:80`** (this is the backend's host port; port 8080 is phpMyAdmin, not the API — see note below)
   - `NEXT_PUBLIC_MAPBOX_TOKEN` — a Mapbox access token, needed for the map/geolocation features

3. **Build and start everything:**
   ```
   docker compose up --build
   ```

4. **Open the app:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:80](http://localhost:80)
   - phpMyAdmin: [http://localhost:8080](http://localhost:8080)

To stop everything (keeping your data):
```
docker compose down
```

To stop everything **and wipe the database volume** (fresh start):
```
docker compose down -v
```

## Notes on the setup

- **`NEXT_PUBLIC_*` variables are baked in at build time**, not read at runtime. If you change `NEXT_PUBLIC_API_BASE_URL` or `NEXT_PUBLIC_MAPBOX_TOKEN` after the frontend image has already been built, you need to rebuild it for the change to take effect:
  ```
  docker compose up --build frontend
  ```
- Port 80 (backend) and port 8080 (phpMyAdmin) are easy to mix up — the backend's Flask app listens on container port 8080 internally, but is mapped to **host port 80**. phpMyAdmin is the one mapped to host port 8080.
- MariaDB's host port is mapped to **3308** (not the default 3306), since a locally installed MySQL Server or another MariaDB container can easily already be using 3306 on your machine. This only affects connecting to the database directly from your host (e.g. a desktop DB client) — the app itself always talks to MariaDB internally over `washworld-network` at `mariadb:3306`, regardless of this mapping. If you hit a "port already in use" error when starting the stack, something else on your machine is bound to that port — on Windows you can find it with `netstat -ano | findstr :<port>` followed by `tasklist /FI "PID eq <pid>"`.

## What was tested

This setup was verified end-to-end, not just assumed to work from the compose file:

- **Volume persistence** — confirmed database row counts survive a full `docker compose down` / `up` cycle.
- **Named network connectivity** — confirmed all four containers share `washworld-network`, resolve each other by hostname, and the backend can open a real TCP connection to MariaDB on port 3306.
- **Reproducibility** — cloned the repo into a completely separate folder, built a fresh `.env` from `.env.example` only, and confirmed `docker compose up --build` works from a clean checkout with no leftover state.
- **End-to-end smoke test** — registered a user through the actual frontend UI and confirmed the request reaches the backend and database successfully (this caught and fixed a CORS bug caused by `NEXT_PUBLIC_API_BASE_URL` initially pointing at the wrong port).

## Tech stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS, TanStack Query, Mapbox
- **Backend:** Flask, MariaDB
- **Infrastructure:** Docker, Docker Compose

## Course context

Assignment for **E26 Development Environments**: containerize an existing application using Docker and Docker Compose, with a database, a named network, and Docker volumes. Deliverables: this repository plus this README, and a live demo.
