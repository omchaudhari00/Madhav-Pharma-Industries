#!/usr/bin/env python
"""
Single entry point for the whole application -- the Flask-style `python app.py`.

What this script does, in order:

  1. Check the required Python packages are importable.
  2. Check the React production build exists (frontend/dist/index.html).
  3. Check PostgreSQL is reachable, and apply migrations if needed.
  4. Start Django on 127.0.0.1:8000.
  5. Open http://127.0.0.1:8000/ in the default browser.

Why one server and one port is enough
-------------------------------------
There is no separate Node process. `npm run build` has already compiled React
down to static files in frontend/dist, and Django serves that folder through the
WhiteNoise middleware while also answering /api/ with JSON. One process, one
port, no CORS, no proxy:

    http://127.0.0.1:8000/          -> frontend/dist/index.html (React)
    http://127.0.0.1:8000/assets/*  -> frontend/dist/assets/*   (JS + CSS)
    http://127.0.0.1:8000/api/      -> Django REST Framework
    http://127.0.0.1:8000/admin/    -> Django admin

Runs on Windows, Linux and macOS -- everything below uses the standard library
plus Django itself.
"""
import os
import sys
import threading
import webbrowser
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIST = BASE_DIR / 'frontend' / 'dist'

HOST = '127.0.0.1'
PORT = '8000'
URL = f'http://{HOST}:{PORT}/'

# Import name -> pip name, for the dependency check below.
REQUIRED_PACKAGES = {
    'django': 'Django',
    'rest_framework': 'djangorestframework',
    'psycopg2': 'psycopg2-binary',
    'dotenv': 'python-dotenv',
    'whitenoise': 'whitenoise',
    'dj_database_url': 'dj-database-url',
}


def fail(title, *lines):
    """Print a readable error block and exit."""
    print(flush=True)
    print(f'  {title}')
    print('  ' + '-' * len(title))
    for line in lines:
        print(f'  {line}')
    print()
    sys.exit(1)


def step(message):
    # flush=True so progress appears immediately even when stdout is
    # redirected to a file or pipe, where Python would otherwise buffer it.
    print(f'  -> {message}', flush=True)


# ---------------------------------------------------------------- 1. packages
def check_packages():
    import importlib.util

    missing = [
        pip_name
        for import_name, pip_name in REQUIRED_PACKAGES.items()
        if importlib.util.find_spec(import_name) is None
    ]
    if missing:
        fail(
            'Missing Python packages',
            'These packages are required but not installed:',
            '',
            *[f'    {name}' for name in missing],
            '',
            'Install everything with:',
            '',
            '    pip install -r requirements.txt',
        )
    step(f'Python packages OK ({len(REQUIRED_PACKAGES)} checked)')


# ------------------------------------------------------------ 2. react build
def check_react_build():
    index_file = FRONTEND_DIST / 'index.html'
    if not index_file.exists():
        fail(
            'React build not found',
            f'Expected: {index_file}',
            '',
            'Django serves the compiled React app, so it has to be built once',
            'before starting. From the project root run:',
            '',
            '    cd frontend',
            '    npm install',
            '    npm run build',
            '    cd ..',
            '',
            'Then start again with:',
            '',
            '    python app.py',
        )
    step('React build found (frontend/dist)')


# --------------------------------------------------------------- 3. database
def setup_django():
    """Point Django at our settings module and load the app registry."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    import django
    django.setup()


def check_database():
    from django.db import connection
    from django.db.utils import OperationalError

    try:
        connection.ensure_connection()
    except OperationalError as exc:
        from django.conf import settings
        db = settings.DATABASES['default']
        fail(
            'Cannot connect to PostgreSQL',
            f'{exc}'.strip(),
            '',
            'Django tried to reach:',
            f'    host     {db.get("HOST")}',
            f'    port     {db.get("PORT")}',
            f'    database {db.get("NAME")}',
            f'    user     {db.get("USER")}',
            '',
            'Check that:',
            '  1. PostgreSQL is running.',
            '  2. That database exists  (createdb ' + str(db.get('NAME')) + ')',
            '  3. DB_NAME / DB_USER / DB_PASSWORD / DB_HOST / DB_PORT in .env',
            '     match your PostgreSQL setup.',
            '',
            'See the Troubleshooting section of README.md for details.',
        )
    step(f'PostgreSQL connected ({connection.settings_dict.get("NAME")})')


def run_migrations():
    """Apply migrations only when something is actually pending."""
    from django.core.management import call_command
    from django.db.migrations.executor import MigrationExecutor
    from django.db import connection

    executor = MigrationExecutor(connection)
    targets = executor.loader.graph.leaf_nodes()
    pending = executor.migration_plan(targets)

    if not pending:
        step('Database schema up to date')
        return

    step(f'Applying {len(pending)} pending migration(s)...')
    call_command('migrate', interactive=False, verbosity=1)
    step('Migrations applied')


# ------------------------------------------------------- 4 + 5. serve + open
def open_browser_when_ready():
    """
    Open the browser shortly after the server starts.

    Runs on a background timer so it never blocks the server, and only in the
    process that actually serves requests -- Django's autoreloader runs this
    module twice, and RUN_MAIN marks the real one.
    """
    def _open():
        print(f'  -> Opening {URL}', flush=True)
        webbrowser.open(URL)

    threading.Timer(1.5, _open).start()


def main():
    print()
    print('  Madhav Pharma Industries')
    print('  Starting Django + React on a single port')
    print()

    check_packages()
    check_react_build()
    setup_django()
    check_database()
    run_migrations()

    print()
    print(f'  Application  {URL}', flush=True)
    print(f'  REST API     {URL}api/')
    print(f'  Admin        {URL}admin/')
    print()
    print('  Press CTRL+C to stop.', flush=True)
    print()

    open_browser_when_ready()

    # runserver with the autoreloader disabled: it would otherwise start a
    # second process and open the browser twice.
    from django.core.management import execute_from_command_line
    execute_from_command_line(
        ['manage.py', 'runserver', f'{HOST}:{PORT}', '--noreload']
    )


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('\n  Stopped.\n')
