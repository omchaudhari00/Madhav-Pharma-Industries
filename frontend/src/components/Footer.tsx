import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Column 1: Brand & Specimen Metadata */}
          <div className={styles.colBrand}>
            <h3 className={styles.brandTitle}>MADHAV PHARMA</h3>
            <p className={styles.tagline}>
              SWISS-MODERNIST B2B PHARMACEUTICAL EXTRACTS & ESSENTIAL OILS FOUNDRY.
            </p>
          </div>

          {/* Column 2: Catalog Categories */}
          <div className={styles.col}>
            <p className="label-caps label-gold mb-4">SPECIMEN CATALOG</p>
            <ul className={styles.linkList}>
              <li><Link href="/catalog?cat=Essential+Oils">Essential Oils</Link></li>
              <li><Link href="/catalog?cat=Botanical+Extracts">Botanical Extracts</Link></li>
              <li><Link href="/catalog?cat=Oleoresins">Oleoresins & Resins</Link></li>
              <li><Link href="/catalog?cat=Standardized+Powders">Standardized Powders</Link></li>
              <li><Link href="/catalog">All 240+ Specimen Sheets →</Link></li>
            </ul>
          </div>

          {/* Column 3: B2B Enterprise Portal */}
          <div className={styles.col}>
            <p className="label-caps label-gold mb-4">ENTERPRISE PORTAL</p>
            <ul className={styles.linkList}>
              <li><Link href="/quote-cart">Active Quote Cart</Link></li>
              <li><Link href="/quotations">My Quotations & Negotiations</Link></li>
              <li><Link href="/orders">Order Management Timeline</Link></li>
              <li><Link href="/invoices">Invoices & Tax Records</Link></li>
              <li><Link href="/auth">Client & Partner Authentication</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Coordinates */}
          <div className={styles.col}>
            <p className="label-caps label-gold mb-4">LABORATORY & HEADQUARTERS</p>
            <address className={styles.address}>
              Madhav Pharma Industries Ltd.<br />
              Plot 42, GIDC Chemical Zone,<br />
              Ahmedabad, Gujarat 380015, India
            </address>
            <div className={styles.contactRow}>
              <span>B2B DESK:</span>
              <a href="mailto:quotes@madhavpharma.com" className="underline">quotes@madhavpharma.com</a>
            </div>
            <div className={styles.contactRow}>
              <span>SECURE PROTOCOL:</span>
              <span>AES-256 TLS 1.3</span>
            </div>
          </div>
        </div>

        {/* Hairline Bottom Bar */}
        <div className={styles.bottomBar}>
          <p>© 2026 MADHAV PHARMA INDUSTRIES. ALL RIGHTS RESERVED. SWISS-MODERNIST DESIGN SYSTEM.</p>
          <div className={styles.bottomLinks}>
            <Link href="/quality">Quality Assurance</Link>
            <Link href="/admin">Admin Console</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
