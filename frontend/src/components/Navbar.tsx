"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(2); // Initial sample cart count

  useEffect(() => {
    // Check local storage for quote cart count if available
    const storedCart = localStorage.getItem('mp_quote_cart');
    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart);
        setCartCount(Array.isArray(parsed) ? parsed.length : 2);
      } catch {
        // ignore
      }
    }
  }, [pathname]);

  const navLinks = [
    { name: 'Products', href: '/catalog' },
    { name: 'Our Process', href: '/process' },
    { name: 'Quality', href: '/quality' },
    { name: 'Quotations', href: '/quotations' },
    { name: 'Orders', href: '/orders' },
    { name: 'Invoices', href: '/invoices' },
    { name: 'Admin Console', href: '/admin', gold: true },
  ];

  return (
    <>
      <header className={styles.navbar}>
        <div className={styles.container}>
          {/* Logo Brand */}
          <div className={styles.brandGroup}>
            <button 
              className={styles.menuTrigger} 
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle Navigation"
            >
              <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
            </button>
            <Link href="/" className={styles.brandTitle}>
              MADHAV PHARMA
            </Link>
          </div>

          {/* Desktop Links */}
          <nav className={styles.desktopNav}>
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`${styles.navLink} ${active ? styles.activeLink : ''} ${link.gold ? styles.goldLink : ''}`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className={styles.actions}>
            <Link href="/quote-cart" className={styles.cartBtn}>
              <span className="label-caps">Cart</span>
              {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
            </Link>

            <Link href="/auth" className={styles.loginBtn}>
              <span className="label-caps">Sign In / Up</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className={styles.mobileDrawer}>
          <div className={styles.mobileNav}>
            <p className={styles.drawerHeader}>ENTERPRISE NAVIGATION</p>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`${styles.mobileLink} ${pathname === link.href ? styles.activeMobile : ''}`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-6 border-t border-[var(--hairline)] flex flex-col gap-3">
              <Link
                href="/quote-cart"
                onClick={() => setMobileOpen(false)}
                className="btn-primary w-full"
              >
                Cart ({cartCount})
              </Link>
              <Link
                href="/auth"
                onClick={() => setMobileOpen(false)}
                className="btn-secondary w-full"
              >
                Sign In / Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
