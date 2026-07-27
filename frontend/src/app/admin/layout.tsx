"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './layout.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview Metrics', href: '/admin', icon: 'dashboard' },
    { label: 'Products', href: '/admin/products', icon: 'science' },
    { label: 'Invoices & Orders', href: '/admin/invoices', icon: 'receipt_long' },
    { label: 'B2B Client Directory', href: '/admin/customers', icon: 'group' },
    { label: 'Quotation Queue', href: '/quotations', icon: 'request_quote' },
    { label: 'Public Website →', href: '/', icon: 'public' },
  ];

  return (
    <div className={styles.adminWrapper}>
      {/* Editorial Navigation Drawer (The Anchor) */}
      <aside className={styles.sidebar}>
        <div className={styles.brandBox}>
          <Link href="/admin" className={styles.brandTitle}>
            MADHAV PHARMA
          </Link>
          <p className="label-caps label-gold mt-1">ADMIN CONSOLE v2.6</p>
        </div>

        <nav className={styles.navMenu}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${active ? styles.activeNav : ''}`}
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                <span className="label-caps">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 border border-[var(--hairline)] flex items-center justify-center bg-[var(--paper-highest)]">
              <span className="material-symbols-outlined text-[14px]">settings</span>
            </div>
            <span className="label-caps text-[var(--ink-variant)]">SYSTEM GOVERNANCE</span>
          </div>
          <p className="text-[10px] text-[var(--ink-variant)] mt-2">
            GMP LEDGER RECORD: ACTIVE
          </p>
        </div>
      </aside>

      {/* Main Admin Viewport */}
      <div className={styles.mainContent}>
        <header className={styles.adminTopBar}>
          <div className="flex items-center gap-4">
            <span className="label-caps label-gold">MADHAV PHARMA ERP INTERNAL EXECUTIVE CONSOLE</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="status-badge in-stock">GMP FACTORY ONLINE</span>
            <span className="label-caps">ADMINISTRATOR DESK</span>
          </div>
        </header>

        <div className={styles.viewport}>
          {children}
        </div>
      </div>
    </div>
  );
}
