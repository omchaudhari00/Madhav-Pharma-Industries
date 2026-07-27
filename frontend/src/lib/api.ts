import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for JWT tokens if stored
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// TYPES FOR MADHAV PHARMA ERP
export interface ProductSpecimen {
  id: string | number;
  name: string;
  code: string;
  category: string;
  botanical_name?: string;
  cas_number?: string;
  purity: string;
  availability_status: 'In Stock' | 'Made to Order' | 'Out of Stock';
  price_per_kg: number;
  moq_kg: number;
  description: string;
  specifications: { key: string; value: string }[];
  applications: string[];
  certifications: string[];
}

export interface QuotationSpecimen {
  id: string;
  reference: string;
  date: string;
  status: 'Pending' | 'Approved' | 'In Negotiation' | 'Converted';
  customer_name: string;
  company_name: string;
  items: {
    product_name: string;
    quantity_kg: number;
    target_price_per_kg: number;
    total_price: number;
  }[];
  total_amount: number;
  notes?: string;
}

export interface OrderSpecimen {
  id: string;
  order_number: string;
  date: string;
  status: 'Processing' | 'Confirmed' | 'Shipped' | 'Delivered';
  customer_name: string;
  total_amount: number;
  tracking_reference?: string;
}

export interface InvoiceSpecimen {
  id: string;
  invoice_number: string;
  order_number: string;
  date: string;
  status: 'Pending' | 'Completed' | 'Failed';
  total_amount: number;
  tax_information?: string;
}

// FALLBACK SPECIMEN DATA (Used automatically if API is offline or returns empty during UI testing)
export const FALLBACK_PRODUCTS: ProductSpecimen[] = [
  {
    id: 'mp-101',
    name: 'Cumin Seed Essential Oil',
    code: 'CSO-9901-IN',
    category: 'Essential Oils',
    botanical_name: 'Cuminum cyminum',
    cas_number: '8014-13-9',
    purity: '99.8% High-Grade Grade A',
    availability_status: 'In Stock',
    price_per_kg: 84.50,
    moq_kg: 25,
    description: 'Steam-distilled from selected Cuminum cyminum seeds. Rich in Cuminaldehyde with a warm, spicy, and persistent balsamic aromatic profile. Formulated for high-end pharmaceutical and nutraceutical formulations.',
    specifications: [
      { key: 'Specific Gravity (20°C)', value: '0.905 - 0.925' },
      { key: 'Refractive Index (20°C)', value: '1.498 - 1.506' },
      { key: 'Optical Rotation', value: '+3° to +8°' },
      { key: 'Cuminaldehyde Content', value: '≥ 42.5% (GC-MS Verified)' },
      { key: 'Heavy Metals (Pb, As)', value: '< 0.05 ppm' },
      { key: 'Storage Condition', value: 'Store in nitrogen-flushed amber drum below 25°C' }
    ],
    applications: [
      'Pharmaceutical Gastro-intestinal Carminative Formulations',
      'High-potency Nutraceutical Softgels & Antioxidant Blends',
      'Botanical Antimicrobial & Antifungal Topicals'
    ],
    certifications: ['GMP Certified', 'ISO 9001:2015', 'FDA Registered Facility', 'COA Batch Analyzed', 'Halal & Kosher']
  },
  {
    id: 'mp-102',
    name: 'Peppermint Essential Oil (Rectified)',
    code: 'PPO-4402-IN',
    category: 'Essential Oils',
    botanical_name: 'Mentha piperita',
    cas_number: '8006-90-4',
    purity: '99.9% Pharma Grade USP',
    availability_status: 'In Stock',
    price_per_kg: 62.00,
    moq_kg: 50,
    description: 'Triple-rectified peppermint essential oil complying with USP/EP standards. High l-menthol content with exceptionally crisp aroma and cooling analgesic action.',
    specifications: [
      { key: 'Total Menthol Content', value: '≥ 51.0% (GC/FID)' },
      { key: 'Menthone Content', value: '18.0% - 24.0%' },
      { key: 'Specific Gravity (20°C)', value: '0.898 - 0.908' },
      { key: 'Solubility', value: '1 vol in 3 vol of 70% ethanol' }
    ],
    applications: [
      'Topical Analgesic & Muscle Relief Ointments',
      'Oral Care & Antiseptic Formulations',
      'Pharmaceutical Excipient & Flavor Masking Agent'
    ],
    certifications: ['USP Grade Compliant', 'GMP Certified', 'ISO 22000', 'COA Batch Analyzed']
  },
  {
    id: 'mp-103',
    name: 'Ashwagandha Root Extract (Standardized)',
    code: 'ASH-8805-EX',
    category: 'Botanical Extracts',
    botanical_name: 'Withania somnifera',
    cas_number: '90147-43-6',
    purity: '5% Withanolides HPLC',
    availability_status: 'In Stock',
    price_per_kg: 95.00,
    moq_kg: 25,
    description: 'High-purity aqueous extract of cultivated Withania somnifera roots. Standardized for Withanolides with verified absence of cytotoxic Withaferin A (< 0.1%).',
    specifications: [
      { key: 'Withanolides HPLC', value: '≥ 5.0%' },
      { key: 'Loss on Drying', value: '< 4.5%' },
      { key: 'Bulk Density', value: '0.45 - 0.55 g/mL' },
      { key: 'Microbial Plate Count', value: '< 1000 cfu/g' }
    ],
    applications: [
      'Adaptogenic Stress-Relief Nutraceutical Tablets',
      'Endocrine & Adrenal Support Formulations',
      'Clinical Sports Recovery Capsules'
    ],
    certifications: ['GMP Certified', 'USDA Organic', 'ISO 14001', 'Heavy Metal Screened']
  },
  {
    id: 'mp-104',
    name: 'Turmeric Oleoresin (95% Curcuminoids)',
    code: 'TUR-7712-OL',
    category: 'Oleoresins',
    botanical_name: 'Curcuma longa',
    cas_number: '8024-37-1',
    purity: '95% Total Curcuminoids',
    availability_status: 'Made to Order',
    price_per_kg: 110.00,
    moq_kg: 10,
    description: 'Concentrated solvent-extracted botanical oleoresin from high-curcumin rhizomes. Delivers potent anti-inflammatory curcuminoids with enhanced bioavailability profiles.',
    specifications: [
      { key: 'Curcuminoid Assay', value: '95.2% (HPLC Verified)' },
      { key: 'Residual Solvent (Acetone)', value: '< 20 ppm' },
      { key: 'Lead (Pb)', value: '< 0.02 ppm' }
    ],
    applications: [
      'Clinical Anti-Inflammatory Softgels',
      'Joint Health & Osteo-Therapies',
      'Botanical Pharmaceutical Color & Active Blend'
    ],
    certifications: ['GMP Certified', 'ISO 9001:2015', 'FDA Facility Approved']
  }
];

export const FALLBACK_QUOTATIONS: QuotationSpecimen[] = [
  {
    id: 'mp-8821',
    reference: 'QT-8821-2026',
    date: '2026-07-27',
    status: 'In Negotiation',
    customer_name: 'Dr. Alistair Vance',
    company_name: 'Helios Pharmaceuticals Ltd (UK)',
    items: [
      {
        product_name: 'Cumin Seed Essential Oil (CSO-9901-IN)',
        quantity_kg: 100,
        target_price_per_kg: 82.00,
        total_price: 8200.00
      },
      {
        product_name: 'Ashwagandha Root Extract (ASH-8805-EX)',
        quantity_kg: 50,
        target_price_per_kg: 90.00,
        total_price: 4500.00
      }
    ],
    total_amount: 12700.00,
    notes: 'Customer requesting custom nitrogen-flushed 25kg aluminum containers and priority air freight to London Heathrow.'
  },
  {
    id: 'mp-8740',
    reference: 'QT-8740-2026',
    date: '2026-07-21',
    status: 'Approved',
    customer_name: 'Elena Rostova',
    company_name: 'BioSynthetix GMBH (Germany)',
    items: [
      {
        product_name: 'Peppermint Essential Oil (PPO-4402-IN)',
        quantity_kg: 250,
        target_price_per_kg: 60.00,
        total_price: 15000.00
      }
    ],
    total_amount: 15000.00,
    notes: 'Approved at bulk tier price. Awaiting final payment confirmation.'
  }
];

export const FALLBACK_ORDERS: OrderSpecimen[] = [
  {
    id: 'ord-5501',
    order_number: 'ORD-5501-INT',
    date: '2026-07-19',
    status: 'Shipped',
    customer_name: 'Helios Pharmaceuticals Ltd',
    total_amount: 12700.00,
    tracking_reference: 'DHL-EXPRESS-9928174'
  },
  {
    id: 'ord-5489',
    order_number: 'ORD-5489-INT',
    date: '2026-07-10',
    status: 'Delivered',
    customer_name: 'BioSynthetix GMBH',
    total_amount: 15000.00,
    tracking_reference: 'DHL-EXPRESS-8821034'
  }
];

export const FALLBACK_INVOICES: InvoiceSpecimen[] = [
  {
    id: 'inv-9001',
    invoice_number: 'INV-9001-2026',
    order_number: 'ORD-5501-INT',
    date: '2026-07-19',
    status: 'Completed',
    total_amount: 12700.00,
    tax_information: 'Zero-rated Export (LUT Ref: AD24072600123)'
  },
  {
    id: 'inv-8980',
    invoice_number: 'INV-8980-2026',
    order_number: 'ORD-5489-INT',
    date: '2026-07-10',
    status: 'Completed',
    total_amount: 15000.00,
    tax_information: 'Zero-rated Export'
  }
];

// API FETCH METHODS WITH GRACEFUL FALLBACKS
export async function getProducts(): Promise<ProductSpecimen[]> {
  try {
    const res = await api.get('/catalog/products/');
    if (res.data && res.data.length > 0) return res.data;
  } catch {
    // API offline or not seeded yet -> return Foundry Modernist B2B specimen fallback
  }
  return FALLBACK_PRODUCTS;
}

export async function getProductById(id: string): Promise<ProductSpecimen | null> {
  try {
    const res = await api.get(`/catalog/products/${id}/`);
    if (res.data) return res.data;
  } catch {
    // Fallback search
  }
  const found = FALLBACK_PRODUCTS.find((p) => String(p.id) === String(id) || p.code.toLowerCase().includes(String(id).toLowerCase()));
  return found || FALLBACK_PRODUCTS[0];
}

export async function getQuotations(): Promise<QuotationSpecimen[]> {
  try {
    const res = await api.get('/quotations/quotations/');
    if (res.data && res.data.length > 0) return res.data;
  } catch {
    // fallback
  }
  return FALLBACK_QUOTATIONS;
}

export async function getOrders(): Promise<OrderSpecimen[]> {
  try {
    const res = await api.get('/orders/orders/');
    if (res.data && res.data.length > 0) return res.data;
  } catch {
    // fallback
  }
  return FALLBACK_ORDERS;
}

export async function getInvoices(): Promise<InvoiceSpecimen[]> {
  try {
    const res = await api.get('/orders/invoices/');
    if (res.data && res.data.length > 0) return res.data;
  } catch {
    // fallback
  }
  return FALLBACK_INVOICES;
}
