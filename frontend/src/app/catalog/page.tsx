"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getProducts, ProductSpecimen } from '@/lib/api';
import styles from './page.module.css';

const CATEGORIES = [
  'All Specimens',
  'Essential Oils',
  'Botanical Extracts',
  'Oleoresins',
  'Standardized Powders',
];

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('cat') || 'All Specimens';

  const [products, setProducts] = useState<ProductSpecimen[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState('');
  const [addedAlert, setAddedAlert] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = products.filter((p) => {
    const matchesCat =
      selectedCat === 'All Specimens' ||
      p.category.toLowerCase().includes(selectedCat.toLowerCase());
    const matchesQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.cas_number && p.cas_number.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const handleQuickAdd = (product: ProductSpecimen) => {
    const existingStr = localStorage.getItem('mp_quote_cart');
    const existing = existingStr ? JSON.parse(existingStr) : [];
    
    // Check if already in cart
    const foundIdx = existing.findIndex((item: any) => item.product_id === product.id);
    if (foundIdx > -1) {
      existing[foundIdx].quantity_kg += product.moq_kg;
    } else {
      existing.push({
        product_id: product.id,
        product_name: product.name,
        code: product.code,
        price_per_kg: product.price_per_kg,
        quantity_kg: product.moq_kg,
        target_price_per_kg: product.price_per_kg,
      });
    }
    localStorage.setItem('mp_quote_cart', JSON.stringify(existing));
    setAddedAlert(`${product.name} (${product.moq_kg} KG MOQ) added to your Quote Cart.`);
    setTimeout(() => setAddedAlert(null), 3500);
  };

  return (
    <div className={styles.wrapper}>
      {/* Editorial Catalog Header */}
      <section className={styles.header}>
        <div className="container-max">
          <div className="w-full lg:w-2/3 pr-0 lg:pr-8 text-left">
            <div className="flex flex-wrap items-center gap-3 hairline-b pb-4 mb-8 text-left">
              <span className="label-caps label-gold">SPECIMEN DIRECTORY • SERIES 2026</span>
              <span className="text-[var(--ink-variant)]">•</span>
              <span className="label-caps">ANALYTICAL PURITY VERIFIED BY GC-MS / HPLC</span>
            </div>

            <h1 className="headline-lg mb-6 text-left">
              BOTANICAL SPECIMEN CATALOG.
            </h1>
            <p className="text-lg text-[var(--ink-variant)] mb-8 text-left">
              Browse our complete archive of standardized botanical extracts, essential oils, and oleoresin actives. Every specimen includes downloadable HPLC certificates and bulk tier pricing.
            </p>

            {/* Filter Bar & Search */}
            <div className={styles.filterBar}>
              <div className={styles.categoryTabs}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCat(cat)}
                    className={`${styles.catTab} ${selectedCat === cat ? styles.catTabActive : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className={styles.searchBox}>
                <span className="material-symbols-outlined text-[var(--ink-variant)]">search</span>
                <input
                  type="text"
                  placeholder="Search CAS Number, Botanical Name, or Specimen Code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-xs font-bold uppercase">
                    CLEAR
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alert Banner */}
      {addedAlert && (
        <div className="bg-[var(--gold)] text-white py-3 px-6 text-xs font-extrabold tracking-wider uppercase text-center sticky top-[64px] z-50">
          ✓ {addedAlert} — <Link href="/quote-cart" className="underline ml-2">VIEW QUOTE CART →</Link>
        </div>
      )}

      {/* Specimen Grid */}
      <section className={styles.catalogSection}>
        <div className="container-max">
          <div className="flex justify-between items-center mb-6">
            <span className="label-caps text-[var(--ink-variant)]">
              SHOWING {filtered.length} OF {products.length} REGISTERED SPECIMENS
            </span>
            <Link href="/quote-cart" className="text-xs font-extrabold underline text-[var(--gold)] uppercase">
              OPEN ACTIVE QUOTE CART →
            </Link>
          </div>

          {loading ? (
            <div className={styles.emptyBox}>
              <p className="label-caps">LOADING SPECIMEN ARCHIVE FROM FOUNDRY...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.emptyBox}>
              <h3 className="text-xl font-extrabold mb-2">NO SPECIMENS MATCHING QUERY</h3>
              <p className="text-sm text-[var(--ink-variant)] mb-4">
                We couldn&apos;t find any botanical compounds matching &quot;{searchQuery}&quot;.
              </p>
              <button onClick={() => { setSelectedCat('All Specimens'); setSearchQuery(''); }} className="btn-secondary">
                RESET FILTERS
              </button>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map((product) => (
                <div key={product.id} className="specimen-card flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <span className="label-caps text-[var(--gold-soft)]">
                        CAS {product.cas_number || '8014-13-9'}
                      </span>
                      <span className={`status-badge ${product.availability_status === 'In Stock' ? 'in-stock' : 'made-to-order'}`}>
                        {product.availability_status}
                      </span>
                    </div>

                    <p className="label-caps text-[var(--ink-variant)] mb-1">
                      {product.code} • {product.category}
                    </p>
                    <h3 className="text-2xl font-extrabold text-white mb-2 leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-sm text-[var(--gold-soft)] italic mb-4">
                      {product.botanical_name || 'Botanical extract'}
                    </p>
                    <p className="text-sm text-[var(--hairline)] mb-6 line-clamp-3">
                      {product.description}
                    </p>

                    {/* Specifications table */}
                    <div className={styles.specTable}>
                      <div className={styles.specRow}>
                        <span>ASSAY PURITY</span>
                        <strong>{product.purity}</strong>
                      </div>
                      <div className={styles.specRow}>
                        <span>MOQ DRUM</span>
                        <strong>{product.moq_kg} KG</strong>
                      </div>
                      {product.specifications?.[0] && (
                        <div className={styles.specRow}>
                          <span>{product.specifications[0].key}</span>
                          <strong>{product.specifications[0].value}</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[var(--card-dark-tint)] flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs text-[var(--ink-variant)] uppercase block">INDICATIVE B2B RATE</span>
                        <span className="text-xl font-extrabold text-[var(--gold-container)]">
                          ${product.price_per_kg.toFixed(2)} / KG
                        </span>
                      </div>
                      <Link
                        href={`/catalog/${product.id}`}
                        className="bg-white text-[var(--ink)] px-5 py-3 text-xs font-extrabold uppercase hover:bg-[var(--gold)] hover:text-white transition-colors"
                      >
                        SPECIMEN SHEET →
                      </Link>
                    </div>

                    <button
                      onClick={() => handleQuickAdd(product)}
                      className="w-full py-3 border border-[var(--hairline)] text-xs font-bold text-white uppercase tracking-wider hover:bg-[var(--gold)] hover:border-[var(--gold)] transition-colors"
                    >
                      + ADD TO QUOTE CART ({product.moq_kg} KG MOQ)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center label-caps">LOADING SPECIMEN ARCHIVE...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
