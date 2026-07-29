"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import StaggeredMenu, { StaggeredMenuItem, StaggeredMenuSocialItem } from './StaggeredMenu';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(2);

  useEffect(() => {
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

  const menuItems: StaggeredMenuItem[] = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'Products & Specimens', ariaLabel: 'Explore Botanical Catalog', link: '/catalog' },
    { label: 'Quality Assurance', ariaLabel: 'View Purity & HPLC Protocols', link: '/quality' },
    { label: 'B2B Quotations', ariaLabel: 'Manage Quotations & Negotiations', link: '/quotations' },
    { label: 'Enterprise Orders', ariaLabel: 'Track Bulk Orders', link: '/orders' },
    { label: 'Invoices & Tax', ariaLabel: 'Download Invoices & LUT Records', link: '/invoices' },
    { label: 'Admin Console', ariaLabel: 'Access Administration', link: '/admin' }
  ];

  const socialItems: StaggeredMenuSocialItem[] = [
    { label: 'LinkedIn B2B', link: 'https://linkedin.com' },
    { label: 'Regulatory Desk', link: 'mailto:regulatory@madhavpharma.com' },
    { label: 'Export Documentation', link: '/quality' }
  ];

  return (
    <div className="w-full relative z-40">
      <StaggeredMenu
        isFixed={false}
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor="#122019"
        openMenuButtonColor="#ffffff"
        changeMenuColorOnOpen={true}
        colors={['#1c2822', '#2a3e35', '#d4af37']}
        accentColor="#d4af37"
        customLogo={
          <Link href="/" className={styles.brandTitle}>
            MADHAV PHARMA
          </Link>
        }
        rightActions={
          <div className="flex items-center gap-4">
            <Link href="/quote-cart" className={styles.cartBtn}>
              <span className="label-caps">Cart</span>
              {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
            </Link>
            <Link href="/auth" className={styles.loginBtn}>
              <span className="label-caps">Sign In / Up</span>
            </Link>
          </div>
        }
      />
    </div>
  );
}
