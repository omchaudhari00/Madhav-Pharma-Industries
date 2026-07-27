"use client";

import React, { useEffect, useState } from 'react';
import { getProducts, ProductSpecimen } from '@/lib/api';
import styles from './page.module.css';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductSpecimen[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Specimen Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('Essential Oils');
  const [cas, setCas] = useState('');
  const [price, setPrice] = useState(85.0);
  const [moq, setMoq] = useState(25);
  const [purity, setPurity] = useState('99.8% Grade A');

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleRegisterProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newSpecimen: ProductSpecimen = {
      id: `mp-${Date.now()}`,
      name,
      code: code || `SP-${Math.floor(Math.random() * 9000)}-IN`,
      category,
      cas_number: cas || '8014-13-9',
      purity,
      availability_status: 'In Stock',
      price_per_kg: Number(price),
      moq_kg: Number(moq),
      description: 'Newly registered GMP-certified botanical extract specimen.',
      specifications: [
        { key: 'HPLC Purity', value: purity },
        { key: 'Storage Condition', value: 'Nitrogen-flushed drum below 25°C' }
      ],
      applications: ['Pharmaceutical active formulation', 'Nutraceutical softgel'],
      certifications: ['GMP Certified', 'ISO 9001:2015', 'COA Verified']
    };

    setProducts([newSpecimen, ...products]);
    setShowAddModal(false);
    setName('');
    setCode('');
    setCas('');
    alert(`Specimen "${name}" registered into active GMP catalog!`);
  };

  return (
    <div className={styles.wrapper}>
      {/* Title */}
      <div className="flex justify-between items-center hairline-b pb-4 mb-8">
        <div>
          <span className="label-caps label-gold">SPECIMEN ARCHIVE MANAGERIAL CONTROL</span>
          <h1 className="headline-md mt-1">PRODUCT CATALOG & SPECIMEN LEDGER.</h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          + REGISTER NEW SPECIMEN
        </button>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div className="flex justify-between items-center hairline-b pb-4 mb-6">
              <span className="label-caps label-gold">GMP FACTORY REGISTRATION FORM</span>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs font-bold uppercase"
              >
                CLOSE ×
              </button>
            </div>

            <h3 className="text-2xl font-extrabold mb-6">ADD PHARMA SPECIMEN SHEET</h3>

            <form onSubmit={handleRegisterProduct} className="space-y-4">
              <div>
                <label className="label-caps block mb-1">SPECIMEN NAME</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cardamom Seed Essential Oil"
                  className={styles.modalInput}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-caps block mb-1">CATALOG CODE</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="CAR-5512-IN"
                    className={styles.modalInput}
                    required
                  />
                </div>
                <div>
                  <label className="label-caps block mb-1">CAS REGISTRY NUMBER</label>
                  <input
                    type="text"
                    value={cas}
                    onChange={(e) => setCas(e.target.value)}
                    placeholder="8000-66-6"
                    className={styles.modalInput}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-caps block mb-1">CATEGORY</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={styles.modalInput}
                  >
                    <option>Essential Oils</option>
                    <option>Botanical Extracts</option>
                    <option>Oleoresins</option>
                    <option>Standardized Powders</option>
                  </select>
                </div>
                <div>
                  <label className="label-caps block mb-1">ASSAY PURITY</label>
                  <input
                    type="text"
                    value={purity}
                    onChange={(e) => setPurity(e.target.value)}
                    placeholder="99.8% High-Grade"
                    className={styles.modalInput}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-caps block mb-1">STANDARD RATE ($ / KG)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    className={styles.modalInput}
                    required
                  />
                </div>
                <div>
                  <label className="label-caps block mb-1">MINIMUM ORDER (MOQ KG)</label>
                  <input
                    type="number"
                    value={moq}
                    onChange={(e) => setMoq(parseInt(e.target.value) || 0)}
                    className={styles.modalInput}
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button type="submit" className="btn-primary flex-1">
                  REGISTER SPECIMEN →
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary px-6"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className={styles.tableBox}>
        {loading ? (
          <p className="label-caps py-12 text-center">LOADING SPECIMEN DIRECTORY...</p>
        ) : (
          <table className="foundry-table">
            <thead>
              <tr>
                <th>CODE</th>
                <th>SPECIMEN NAME</th>
                <th>CATEGORY & CAS</th>
                <th>PURITY ASSAY</th>
                <th>MOQ</th>
                <th>B2B RATE ($ / KG)</th>
                <th>STATUS</th>
                <th>MANAGE</th>
              </tr>
            </thead>
            <tbody>
              {products.map((pr) => (
                <tr key={pr.id}>
                  <td>
                    <strong className="text-[var(--gold)]">{pr.code}</strong>
                  </td>
                  <td>
                    <strong className="text-base font-extrabold text-[var(--ink)]">
                      {pr.name}
                    </strong>
                  </td>
                  <td>
                    <p className="text-sm font-semibold">{pr.category}</p>
                    <p className="text-xs text-[var(--ink-variant)]">CAS {pr.cas_number || 'N/A'}</p>
                  </td>
                  <td>{pr.purity}</td>
                  <td>{pr.moq_kg} KG</td>
                  <td>
                    <strong className="text-lg font-extrabold text-[var(--ink)]">
                      ${pr.price_per_kg.toFixed(2)}
                    </strong>
                  </td>
                  <td>
                    <span className="status-badge in-stock">{pr.availability_status}</span>
                  </td>
                  <td>
                    <button
                      onClick={() => alert(`Opening HPLC editing console for ${pr.code}...`)}
                      className="btn-secondary py-1.5 px-3 text-xs font-bold"
                    >
                      EDIT SPEC →
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
