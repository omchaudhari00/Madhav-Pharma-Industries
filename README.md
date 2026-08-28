# Madhav Pharma Industries

A full-stack app: **React (Vite)** frontend, **Django + Django REST Framework** backend,
**PostgreSQL** database — all served by **one server on one port**.

```
python app.py     ->     http://127.0.0.1:8000/
```

You do **not** run `npm run dev` and `python manage.py runserver` separately.

---

## How it works

```
                 ┌─────────────────────┐
                 │       Browser        │
                 │   127.0.0.1:8000    │
                 └──────────┬──────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │    Django     │
                    │   Port 8000   │
                    └───────┬───────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
       React frontend                 REST API
       /                              /api/
                                        │
                                        ▼
                                   PostgreSQL
```

| URL | Served by | What it is |
|-----|-----------|------------|
| `http://127.0.0.1:8000/` | WhiteNoise | `frontend/dist/index.html` — the React app |
| `http://127.0.0.1:8000/assets/*` | WhiteNoise | Compiled JS and CSS |
| `http://127.0.0.1:8000/products` | Django catch-all | `index.html` again, so React Router handles it |
| `http://127.0.0.1:8000/api/` | Django REST Framework | JSON endpoints |
| `http://127.0.0.1:8000/admin/` | Django | Admin site |

### Why frontend and backend can share one port

There is only **one** server process. `npm run build` compiles React ahead of time
into plain static files in `frontend/dist/`, so nothing needs to keep running to
serve the frontend — Django can hand those files out itself.

For each incoming request, that single Django process decides:

1. **Does a real file match?** The WhiteNoise middleware (first in `MIDDLEWARE`,
   configured via `WHITENOISE_ROOT` in `backend/settings.py`) serves it straight
   from `frontend/dist/` and stops there. This covers `/assets/...` and `/images/...`.
2. **Does it start with `api/` or `admin/`?** Django's URL resolver routes it to a
   view in `backend/urls.py`.
3. **Anything else?** The catch-all route at the bottom of `backend/urls.py`
   returns `index.html`, letting React Router take over in the browser.

Because the React app and the API share an origin, there is no CORS to configure
and no proxy in production.

### How React calls the Django API

Always with **relative** URLs:

```javascript
fetch('/api/products/')          // correct
```

Never with a hard-coded host:

```javascript
fetch('http://localhost:8000/api/products/')   // don't — breaks in production
```

`frontend/src/services/api.js` wraps this up:

```javascript
import { productsApi } from './services/api';

const products = await productsApi.list();
await productsApi.create({ name: 'Cumin Seed Oil', price: '1250.00', stock: 40 });
```

Relative URLs work in both modes: under `python app.py` they hit the same Django
server, and under `npm run dev` Vite's `server.proxy` (in `frontend/vite.config.js`)
forwards `/api` to `127.0.0.1:8000`.

### How Django connects to PostgreSQL

`backend/settings.py` builds `DATABASES` from environment variables loaded out of
`.env` — the password is never written into any source file:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'madhav_pharma'),
        'USER': os.getenv('DB_USER', 'postgres'),
        'PASSWORD': os.getenv('DB_PASSWORD', ''),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
        'CONN_MAX_AGE': 600,
    }
}
```

If a single `DATABASE_URL` is set (managed hosts like Render supply one), it takes
priority instead.

### How `app.py` starts the application

`app.py` is a small launcher. It checks the required packages are installed, checks
the React build exists, connects to PostgreSQL, applies any pending migrations,
then starts Django on `127.0.0.1:8000` and opens your browser with Python's
`webbrowser` module. It works the same on Windows, Linux and macOS.

---

## First-time setup

You need **Python 3.10+**, **Node.js 18+** and a running **PostgreSQL**.

```bash
# Install Python dependencies
pip install -r requirements.txt

# Configure the database
cp .env.example .env        # Windows: copy .env.example .env
#   then edit .env and set DB_NAME / DB_USER / DB_PASSWORD

# Create the PostgreSQL database (once)
createdb madhav_pharma

# Install React dependencies
cd frontend
npm install

# Build React
npm run build

# Return to project root
cd ..

# Start everything
python app.py
```

Your browser opens at `http://127.0.0.1:8000/`.

### After the first setup

```bash
python app.py
```

That is all. Rebuild the frontend (`cd frontend && npm run build`) whenever you
change React code.

### Optional: create an admin login

```bash
python manage.py createsuperuser
```

Then sign in at `http://127.0.0.1:8000/admin/`.

---

## Working on the frontend

`python app.py` serves the **built** bundle, so React edits only appear after a
rebuild. While actively editing React, run Vite's dev server for hot reload:

```bash
# Terminal 1 — API on port 8000
python app.py

# Terminal 2 — React with hot reload on port 3001
cd frontend
npm run dev
```

Open `http://127.0.0.1:3001/` for that workflow. Vite proxies `/api` to Django, so
your relative `fetch('/api/...')` calls keep working. When you are done, run
`npm run build` and go back to the single-port setup on port 8000.

---

## API reference

Product model: `id`, `name`, `price`, `stock`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products/` | List all products |
| `POST` | `/api/products/` | Create a product |
| `GET` | `/api/products/<id>/` | Retrieve one product |
| `PUT` | `/api/products/<id>/` | Update a product |
| `DELETE` | `/api/products/<id>/` | Delete a product |

```bash
# List
curl http://127.0.0.1:8000/api/products/

# Create
curl -X POST http://127.0.0.1:8000/api/products/ \
  -H "Content-Type: application/json" \
  -d '{"name":"Cumin Seed Oil","price":"1250.00","stock":40}'

# Update
curl -X PUT http://127.0.0.1:8000/api/products/1/ \
  -H "Content-Type: application/json" \
  -d '{"name":"Cumin Seed Oil","price":"1499.99","stock":25}'

# Delete
curl -X DELETE http://127.0.0.1:8000/api/products/1/
```

The rest of the application's endpoints live under `/api/accounts/`, `/api/catalog/`,
`/api/quotations/`, `/api/orders/` and `/api/interactions/`. Those require a JWT
obtained by logging in; `/api/products/` is open so you can try it immediately.

---

## Project layout

```
Madhav-Pharma-Industries/
│
├── app.py                  # Single entry point — python app.py
├── manage.py               # Standard Django CLI
├── requirements.txt
├── .env                    # Your local secrets (git-ignored)
├── .env.example            # Template — copy to .env
├── README.md
│
├── backend/                # Django project package (settings, urls, wsgi)
│   ├── settings.py         # PostgreSQL config + how React is served
│   ├── urls.py             # /api/ routes + the React catch-all
│   ├── asgi.py
│   └── wsgi.py
│
├── api/                    # Simple Product API
│   ├── models.py           # Product: name, price, stock
│   ├── serializers.py
│   ├── views.py            # The 5 endpoints
│   ├── urls.py
│   └── admin.py
│
├── accounts/               # Users + JWT auth
├── catalog/                # Product catalogue
├── quotations/             # B2B quotations
├── orders/                 # Orders + payments
├── interactions/           # Activity log
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── public/             # Copied into dist/ on build
    ├── dist/               # Build output — served by Django (git-ignored)
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── components/
        ├── pages/
        ├── context/
        └── services/
            └── api.js      # Relative-URL API helper
```

---

## Troubleshooting

### PostgreSQL is not running

```
Cannot connect to PostgreSQL
could not connect to server: Connection refused
```

Start the service:

```bash
# Windows (PowerShell as Administrator)
net start postgresql-x64-17

# macOS (Homebrew)
brew services start postgresql

# Linux (systemd)
sudo systemctl start postgresql
```

Confirm it is listening:

```bash
psql -U postgres -h localhost -c "SELECT version();"
```

### Database connection failure

`app.py` prints the exact host, port, database and user it tried. Check each one
against your `.env`. The most common cause is that the database has not been
created yet:

```bash
createdb madhav_pharma
```

Or from inside psql:

```bash
psql -U postgres -c "CREATE DATABASE madhav_pharma;"
```

List the databases that do exist:

```bash
psql -U postgres -l
```

### Incorrect PostgreSQL credentials

```
FATAL: password authentication failed for user "postgres"
```

`DB_USER` / `DB_PASSWORD` in `.env` do not match your server. Test them directly:

```bash
psql -U your_db_user -h localhost -d madhav_pharma
```

If that prompt fails, the credentials are wrong at the PostgreSQL level. Reset the
password:

```bash
psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'newpassword';"
```

Then update `.env`. Two things to watch for:

- No quotes around values in `.env` — write `DB_PASSWORD=secret`, not `DB_PASSWORD="secret"`.
- If your password contains a `#`, wrap it in single quotes, or the `#` starts a comment.

### Missing Python packages

```
Missing Python packages
    djangorestframework
```

```bash
pip install -r requirements.txt
```

If you use a virtual environment, activate it first:

```bash
# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

### Missing React build

```
React build not found
Expected: .../frontend/dist/index.html
```

Django serves the compiled bundle, so it has to exist:

```bash
cd frontend
npm install
npm run build
cd ..
python app.py
```

If `npm run build` itself fails, reinstall the dependencies:

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

On Windows use `rmdir /s /q node_modules` and `del package-lock.json` instead.

### Port 8000 already in use

```
Error: That port is already in use.
```

Find and stop whatever holds it:

```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <pid> /F
```

```bash
# macOS / Linux
lsof -i :8000
kill -9 <pid>
```

Or run on another port by editing `PORT` near the top of `app.py`:

```python
PORT = '8080'
```

### Browser did not open automatically

Harmless — the server is still running. Open `http://127.0.0.1:8000/` yourself.
This happens on headless machines and under WSL, where `webbrowser` has no browser
to launch.

### Blank page, or 404s on `/assets/...`

The bundle is stale or missing. Rebuild:

```bash
cd frontend && npm run build && cd ..
```

Then hard-reload the browser (`Ctrl+Shift+R`, or `Cmd+Shift+R` on macOS).

### SECRET_KEY error on startup

```
ImproperlyConfigured: The SECRET_KEY environment variable must be set
in production mode (DEBUG=False).
```

`DEBUG=True` is missing from `.env`. Local development needs it:

```
DEBUG=True
```

For a real deployment set `DEBUG=False` and a genuine `SECRET_KEY` instead.
