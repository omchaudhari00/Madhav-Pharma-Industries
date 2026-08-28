/**
 * A small, self-contained page that exercises the whole stack:
 *
 *   React (this file)
 *     -> productsApi in src/services/api.js
 *       -> relative fetch('/api/products/')
 *         -> Django REST Framework (api/views.py)
 *           -> PostgreSQL
 *
 * Reachable at /api-demo once the app is running. Nothing else in the project
 * imports it, so you can delete this file and its route in App.jsx at any time.
 */
import React, { useEffect, useState } from 'react';

import { productsApi } from '../services/api';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', stock: '' });

  // Load the list once on mount.
  async function refresh() {
    try {
      setStatus('loading');
      setProducts(await productsApi.list());
      setStatus('ready');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleCreate(event) {
    event.preventDefault();
    try {
      await productsApi.create({
        name: form.name,
        price: form.price,
        stock: Number(form.stock) || 0,
      });
      setForm({ name: '', price: '', stock: '' });
      setError(null);
      refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await productsApi.remove(id);
      refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  const field = 'w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-sm focus:border-[#d4a373] focus:outline-none';

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Product API demo</h1>
        <p className="text-neutral-400 text-sm mb-10">
          Talking to <code className="text-[#d4a373]">/api/products/</code> on the same
          origin — one Django server, one port.
        </p>

        {/* Create */}
        <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-4 mb-4">
          <input
            className={`${field} sm:col-span-2`}
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className={field}
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <input
            className={field}
            placeholder="Stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
          />
          <button
            type="submit"
            className="sm:col-span-4 py-2.5 rounded-lg bg-[#d4a373] text-black font-bold text-sm hover:bg-[#e0b589] transition-colors cursor-pointer"
          >
            POST /api/products/
          </button>
        </form>

        {error && (
          <p className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/40 text-red-300 text-sm">
            {error}
          </p>
        )}

        {/* List */}
        {status === 'loading' && <p className="text-neutral-500 text-sm">Loading…</p>}

        {status === 'ready' && products.length === 0 && (
          <p className="text-neutral-500 text-sm">
            No products yet — add one above.
          </p>
        )}

        {products.length > 0 && (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-neutral-500 border-b border-neutral-800">
                <th className="py-2 font-medium">ID</th>
                <th className="py-2 font-medium">Name</th>
                <th className="py-2 font-medium">Price</th>
                <th className="py-2 font-medium">Stock</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-neutral-900">
                  <td className="py-2.5 text-neutral-500">{product.id}</td>
                  <td className="py-2.5">{product.name}</td>
                  <td className="py-2.5">{product.price}</td>
                  <td className="py-2.5">{product.stock}</td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
