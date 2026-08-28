/**
 * How React calls the Django API
 * ------------------------------
 * Every URL here is RELATIVE -- '/api/products/', never
 * 'http://localhost:8000/api/products/'.
 *
 * That matters because the app runs in two different situations:
 *
 *   python app.py      Django serves this bundle AND the API on port 8000.
 *                      '/api/products/' resolves to 127.0.0.1:8000/api/products/
 *                      automatically -- same origin, so no CORS involved.
 *
 *   npm run dev        Vite serves the app on port 3001 and proxies '/api' to
 *                      127.0.0.1:8000 (see the `server.proxy` block in
 *                      vite.config.js). The browser still only ever sees a
 *                      same-origin request.
 *
 * Hard-coding a host would break one of those two, and would break deployment
 * as well. Keep the leading '/api/'.
 */

const API_BASE = '/api';

/** Read the JWT saved at login, if there is one. */
function authHeaders() {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Thin fetch wrapper: attaches JSON headers, throws on non-2xx, and returns the
 * parsed body (or null for 204 No Content).
 */
async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    // Surface DRF's error body when it sends one, otherwise the status line.
    let detail = `${response.status} ${response.statusText}`;
    try {
      const body = await response.json();
      detail = body.detail || JSON.stringify(body);
    } catch {
      // Response had no JSON body; keep the status line.
    }
    throw new Error(`API ${path} failed: ${detail}`);
  }

  return response.status === 204 ? null : response.json();
}

/** The five Product endpoints from api/urls.py. */
export const productsApi = {
  list: () => request('/products/'),
  get: (id) => request(`/products/${id}/`),
  create: (product) => request('/products/', {
    method: 'POST',
    body: JSON.stringify(product),
  }),
  update: (id, product) => request(`/products/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(product),
  }),
  remove: (id) => request(`/products/${id}/`, { method: 'DELETE' }),
};

export { request, API_BASE };
