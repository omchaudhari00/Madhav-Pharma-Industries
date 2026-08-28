"""
URL configuration for the backend project.

Everything below is served by ONE Django server on port 8000, which is what lets
the frontend and the API share an origin:

    /admin/          Django admin
    /api/...         REST endpoints (JSON)
    /                the compiled React app (index.html)
    /anything-else   also index.html, so React Router owns client-side routes

Static assets produced by `npm run build` (/assets/..., /images/...) never reach
this file -- the WhiteNoise middleware answers them first. See the
"How React is served by Django" comment in settings.py.
"""
from django.conf import settings
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.http import FileResponse, Http404, HttpResponse
from django.urls import include, path, re_path
from django.views.decorators.cache import never_cache


def clear_test_user(request):
    get_user_model().objects.filter(email='madhavpharmaindustries@gmail.com').delete()
    return HttpResponse("Database cleared for madhavpharmaindustries@gmail.com!")


@never_cache
def react_app(request):
    """
    Serve the React entry point.

    Returned for '/' and for any client-side route (e.g. /products, /customer).
    The file is streamed as-is rather than rendered as a Django template, so
    Vite's output is passed through untouched. `never_cache` means a rebuilt
    index.html is picked up immediately instead of being read from the browser
    cache while its hashed assets have already changed.
    """
    # A path whose last segment contains a dot is asking for a file
    # (/images/logo.png, /assets/app.js), not a React route. WhiteNoise already
    # had its chance to serve it, so the file genuinely does not exist -- return
    # a real 404 rather than 200 + index.html, which would silently mask a
    # missing asset and confuse the browser about the content type.
    last_segment = request.path.rstrip('/').rsplit('/', 1)[-1]
    if '.' in last_segment:
        raise Http404(f'No such file: {request.path}')

    index_file = settings.FRONTEND_DIST / 'index.html'
    if not index_file.exists():
        return HttpResponse(
            "<h1>React build not found</h1>"
            "<p>Build the frontend first:</p>"
            "<pre>cd frontend\nnpm install\nnpm run build</pre>"
            "<p>Then restart with <code>python app.py</code>.</p>",
            status=501,
        )
    return FileResponse(open(index_file, 'rb'), content_type='text/html')


urlpatterns = [
    path('admin/', admin.site.urls),

    # --- REST API ---------------------------------------------------------
    # React calls these with relative URLs (fetch('/api/products/')), so no
    # host or port is ever hard-coded in the frontend.
    path('api/accounts/', include('accounts.urls')),
    path('api/catalog/', include('catalog.urls')),
    path('api/quotations/', include('quotations.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/interactions/', include('interactions.urls')),
    path('api/clear-db/', clear_test_user),
    # Simple Product CRUD: /api/products/ and /api/products/<id>/
    path('api/', include('api.urls')),

    # --- React SPA --------------------------------------------------------
    # Must stay LAST. The negative lookahead keeps /api/ and /admin/ out, so an
    # unknown API path still returns a real 404 instead of the HTML shell.
    re_path(r'^(?!api/|admin/|static/).*$', react_app, name='react-app'),
]
