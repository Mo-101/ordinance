import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import './CatalogView.css';

interface CatalogViewProps {
  products: Product[];
  onAddToCart: (product: Product, qty: number) => void;
  onCheckout: () => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

type CatalogProductKey = 'kit' | 'mask' | 'glove';

const catalogProducts: Record<CatalogProductKey, {
  name: string;
  category: string;
  badge: string;
  sku: string;
  stock: string;
  useCase: string;
  shelfLife: string;
  shape: string;
  prices: Record<'USD' | 'EUR' | 'GBP' | 'AED', number>;
  description: string;
  meta: Record<string, string>;
}> = {
  kit: {
    name: 'Emergency Response Kit',
    category: 'Emergency Health Kits',
    badge: 'Emergency kit',
    sku: 'ERK-204 • Sealed case',
    stock: '124 Units',
    useCase: 'Trauma & field care',
    shelfLife: '36 months',
    shape: 'kit',
    prices: { USD: 149, EUR: 137, GBP: 118, AED: 547 },
    description: 'Comprehensive rapid-response medical kit packed for trauma stabilization, wound control, and fast deployment in clinics, ambulances, and field teams.',
    meta: {
      usage: 'Acute injury support, wound dressing, bleeding control, and emergency patient prep.',
      dosage: 'Not a drug product. Use according to included clinical protocol and local medical guidance.',
      included: 'Bandages, sterile gauze, tourniquet, shears, tape, gloves, CPR mask, saline pods.',
      storage: 'Store in a cool dry area. Seal integrity should be checked before deployment.',
      list1: 'Deploy for trauma preparation, scene response, or clinic rapid intake.',
      list2: 'Inspect seal, expiry labels, and sterile contents before assignment.',
      list3: 'Restock immediately after use to maintain emergency readiness.'
    }
  },
  mask: {
    name: 'N95 Protective Masks',
    category: 'PPE',
    badge: 'PPE',
    sku: 'PPE-118 • Box of 20',
    stock: '362 Boxes',
    useCase: 'Airborne barrier',
    shelfLife: 'NIOSH style',
    shape: 'mask',
    prices: { USD: 42, EUR: 39, GBP: 33, AED: 154 },
    description: 'High-filtration respiratory masks for airborne barrier protection in clinical, laboratory, and public-health response settings.',
    meta: {
      usage: 'Single-user respiratory barrier for procedural and exposure-control environments.',
      dosage: 'Non-pharmaceutical PPE item. Follow fit-check instructions before each use and facility replacement policy.',
      included: '20 folded masks, fit guide insert, lot tracking label, compliance card.',
      storage: 'Keep sealed in a dry room away from direct sunlight and compression damage.',
      list1: 'Use for patient-facing workflows and respiratory-risk environments.',
      list2: 'Discard immediately after visible contamination or integrity loss.',
      list3: 'Verify fit and seal before entering controlled care zones.'
    }
  },
  glove: {
    name: 'Sterile Nitrile Gloves',
    category: 'PPE',
    badge: 'PPE',
    sku: 'PPE-441 • Box of 100',
    stock: '510 Boxes',
    useCase: 'General examination',
    shelfLife: 'Powder-free: Yes',
    shape: 'glove',
    prices: { USD: 28, EUR: 26, GBP: 22, AED: 103 },
    description: 'Powder-free nitrile examination gloves with sterile presentation for controlled handling and clean procedural work.',
    meta: {
      usage: 'Barrier protection during examination, dressing changes, sample handling, and sterile prep.',
      dosage: 'Non-pharmaceutical PPE item. Select correct size and replace between patients or contaminated tasks.',
      included: '100 gloves per box, size labels, lot number tracking, sterile handling insert.',
      storage: 'Store below excess heat, keep away from puncture sources, and rotate stock by lot.',
      list1: 'Use a fresh pair for each patient contact and exposure-prone task.',
      list2: 'Avoid use if packaging is damaged or sterile status is compromised.',
      list3: 'Dispose according to clinical waste protocol after contaminated use.'
    }
  }
};

const currencySymbols: Record<'USD' | 'EUR' | 'GBP' | 'AED', string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  AED: 'AED '
};

function CatalogView({ products, onAddToCart, onCheckout }: CatalogViewProps) {
  const [currentProductKey, setCurrentProductKey] = useState<string>(products[0]?.id || '');
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'AED'>('USD');
  const [qty, setQty] = useState(2);
  const [showDetail, setShowDetail] = useState(false);

  const activeProductData = useMemo(() => {
    return products.find(p => p.id === currentProductKey) || products[0];
  }, [products, currentProductKey]);

  const mappedCatalogProduct = useMemo(() => {
    if (!activeProductData) return catalogProducts.kit;
    const shape = activeProductData.shape && ['kit','mask','glove'].includes(activeProductData.shape) ? activeProductData.shape as CatalogProductKey : 'kit';
    return {
      name: activeProductData.name,
      category: activeProductData.categoryLabel || activeProductData.category,
      badge: activeProductData.categoryLabel || activeProductData.category,
      sku: `${activeProductData.sku}`,
      stock: `${activeProductData.stockCount || activeProductData.stock || ''}`,
      useCase: activeProductData.useCase || 'Medical use',
      shelfLife: activeProductData.shelfLife || '36 months',
      shape,
      prices: { USD: activeProductData.price, EUR: Math.round(activeProductData.price * 0.92), GBP: Math.round(activeProductData.price * 0.8), AED: Math.round(activeProductData.price * 3.67) },
      description: activeProductData.description,
      meta: {
        usage: activeProductData.usage || 'Usage per product label.',
        dosage: activeProductData.dosage || 'Not a drug product. Follow protocol.',
        included: activeProductData.included || activeProductData.contents?.join(', ') || 'See product details.',
        storage: activeProductData.storage || 'Store in a cool dry place.',
        list1: activeProductData.list?.[0] || 'Quality certified',
        list2: activeProductData.list?.[1] || 'Sterile packaging',
        list3: activeProductData.list?.[2] || 'WHO approved'
      }
    };
  }, [activeProductData]);

  const imageForProduct = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    return prod?.image;
  };

  const handleAddToCart = () => {
    if (!activeProductData) return;
    onAddToCart(activeProductData, qty);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`products-shell ${showDetail ? 'hidden' : ''}`} id="productsCatalogShell">
      <section className="products-hero">
        <div className="hero-banner card">
          <div className="hero-copy">
            <div className="eyebrow">Medical products • sterile supply</div>
            <h2>Smart care inventory with a premium clinical shelf.</h2>
            <p>Borrowing that glossy product-landing drama from your references, but kept disciplined inside the same dashboard page width.</p>
            <div className="hero-actions">
              <button className="hero-btn primary">Browse catalog</button>
              <button className="hero-btn" onClick={() => setCurrentProductKey('kit')}>Emergency kits</button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="device-screen"><div className="device-ui"><div className="ui-line w56"></div><div className="ui-box"></div><div className="ui-line w88"></div><div className="ui-line w72"></div><div className="ui-line w64"></div></div></div>
            <div className="device-screen small"><div className="device-ui compact"><div className="ui-box short"></div><div className="ui-line w70"></div><div className="ui-line w48"></div></div></div>
          </div>
        </div>

        <div className="hero-side">
          <div className="card spotlight-card"><div className="product-art kit"></div><div className="spotlight-copy"><h3>Emergency Health Kits</h3><p>Trauma-ready, sealed, category-labeled kits for field response, clinics, and rapid dispatch stations.</p><div className="chip-row"><span className="chip">IFAK</span><span className="chip">Trauma</span><span className="chip">Rapid Pack</span></div></div></div>
          <div className="card spotlight-card"><div className="product-art mask"></div><div className="spotlight-copy"><h3>PPE Essentials</h3><p>Mask, gloves, shields, gowns, and sterile barrier stock with shelf-life and usage metadata.</p><div className="chip-row"><span className="chip">N95</span><span className="chip">Gloves</span><span className="chip">Sterile</span></div></div></div>
        </div>
      </section>

      <section className="products-layout">
        <aside className="card filters-card">
          <div className="search-box">⌕ Search products, SKUs, kits</div>
          <div className="filter-group">
            <div className="filter-title">Categories</div>
            <div className="category-link active">All Products <span>18</span></div>
            <div className="category-link" onClick={() => setCurrentProductKey('kit')}>Emergency Health Kits <span>5</span></div>
            <div className="category-link" onClick={() => setCurrentProductKey('mask')}>PPE <span>7</span></div>
            <div className="category-link">Respiratory Care <span>3</span></div>
            <div className="category-link">Sterile Accessories <span>3</span></div>
          </div>
          <div className="filter-group">
            <div className="filter-title">Currency</div>
            <div className="currency-pills">
              {(['USD','EUR','GBP','AED'] as const).map(cur => (
                <button key={cur} className={`currency-pill ${currency === cur ? 'active' : ''}`} data-currency={cur} onClick={() => setCurrency(cur)}>{cur}</button>
              ))}
            </div>
          </div>
          <div className="note-box"><b>Catalog note</b>Tap a product card and the detail panel updates with summary, usage guidance, dosage note where relevant, and pricing in the selected currency.</div>
        </aside>

        <div className="products-main">
          <div className="products-head">
            <div>
              <h3 className="products-head-title">Featured medical products</h3>
              <div className="subtle products-head-sub">Styled with the glossy promo energy of your references, but locked to the same dashboard width.</div>
            </div>
            <div className="chip-row">
              <span className="chip">Clinic Stock</span>
              <span className="chip">Emergency Ready</span>
              <span className="chip">Multi-currency</span>
            </div>
          </div>
          <div className="products-grid">
            {products.map((p) => {
              const active = p.id === currentProductKey;
              const shape = p.shape && ['kit','mask','glove'].includes(p.shape) ? p.shape : 'kit';
              return (
                <article key={p.id} className={`card product-card ${active ? 'active-product' : ''}`} data-product={p.id} onClick={() => setCurrentProductKey(p.id)}>
                  <div className="product-top image-bg">
                    <span className="badge">{p.categoryLabel || p.category}</span>
                    {imageForProduct(p.id) ? (
                      <div className="product-img-cover">
                        <img src={imageForProduct(p.id)} alt={p.name} />
                      </div>
                    ) : (
                      <div className={`product-shape ${shape}`}></div>
                    )}
                  </div>
                  <div className="product-body">
                    <div className="product-meta">
                      <div><h4 className="product-name">{p.name}</h4><div className="sku">SKU {p.sku}</div></div>
                      <div className="price-block"><strong className="money">{currencySymbols[currency]}{p.price}</strong><span>per {shape === 'kit' ? 'kit' : 'box'}</span></div>
                    </div>
                    <div className="spec-list"><div>Category<b>{p.categoryLabel || p.category}</b></div><div>Stock<b>{p.stockCount || p.stock}</b></div><div>Use case<b>{p.useCase || 'Medical use'}</b></div><div>Shelf life<b>{p.shelfLife || '36 months'}</b></div></div>
                    <div className="card-actions"><button className="link-btn" onClick={() => setCurrentProductKey(p.id)}>Summary</button><button className="link-btn primary" onClick={() => { setCurrentProductKey(p.id); setShowDetail(true); }}>View details</button></div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`products-detail-page ${showDetail ? 'active' : ''}`} id="productsDetailPage">
        <div className="section-nav full-span">
          <button className="ghost-btn">Dashboard</button>
          <button className="ghost-btn">Order requests</button>
          <button className="ghost-btn">OSL Operations</button>
          <button className="ghost-btn" onClick={() => setShowDetail(false)}>Back to catalog</button>
        </div>
        <div className="card detail-visual"><div className="eyebrow detail-eyebrow">Item detail</div><div className={`product-shape ${mappedCatalogProduct.shape}`} id="detailShape"></div></div>
        <div className="order-panel">
          <div className="card detail-summary"><div className="detail-title"><h2 id="detailName">{mappedCatalogProduct.name}</h2><p id="detailSummary">{mappedCatalogProduct.description}</p></div><div className="products-head no-padding"><div className="price-block left-align"><strong id="detailPrice">{currencySymbols[currency]}{mappedCatalogProduct.prices[currency]}</strong><span id="detailPriceMeta">per kit • tax excluded</span></div><span className="chip" id="detailCategory">{mappedCatalogProduct.category}</span></div><div className="detail-grid"><div className="detail-cell"><span>Usage</span><strong id="detailUsage">{mappedCatalogProduct.meta.usage}</strong></div><div className="detail-cell"><span>Dosage / note</span><strong id="detailDosage">{mappedCatalogProduct.meta.dosage}</strong></div><div className="detail-cell"><span>Included</span><strong id="detailIncluded">{mappedCatalogProduct.meta.included}</strong></div><div className="detail-cell"><span>Storage</span><strong id="detailStorage">{mappedCatalogProduct.meta.storage}</strong></div></div><div><div className="filter-title mb-10">Recommended usage</div><ul className="usage-list" id="detailList"><li>{mappedCatalogProduct.meta.list1}</li><li>{mappedCatalogProduct.meta.list2}</li><li>{mappedCatalogProduct.meta.list3}</li></ul></div></div>
          <div className="card">
            <div className="card-title"><h3>Build cart</h3><span className="subtle">Procurement input</span></div>
            <div className="order-grid">
              <div className="field"><label htmlFor="cartDepartment">Department</label><select id="cartDepartment" aria-label="Department"><option>Emergency Unit</option><option>ICU</option><option>General Ward</option><option>Field Team</option></select></div>
              <div className="field"><label htmlFor="cartPriority">Priority</label><select id="cartPriority" aria-label="Priority"><option>Normal</option><option>Urgent</option><option>Critical</option></select></div>
              <div className="field"><label>Quantity</label><div className="qty-stepper"><button type="button" onClick={() => setQty(Math.max(1, qty - 1))}>−</button><span className="qty-value" id="qtyValue">{qty}</span><button type="button" onClick={() => setQty(qty + 1)}>+</button></div></div>
              <div className="field"><label>Currency</label><div className="currency-pills">{(['USD','EUR','GBP','AED'] as const).map(cur => (<button key={cur} className={`currency-pill ${currency === cur ? 'active' : ''}`} data-currency={cur} onClick={() => setCurrency(cur)}>{cur}</button>))}</div></div>
              <div className="field"><label htmlFor="cartRequesterName">Requester name</label><input id="cartRequesterName" type="text" defaultValue="Ava Lewis" aria-label="Requester name" /></div>
              <div className="field"><label htmlFor="cartDeliveryDate">Delivery date</label><input id="cartDeliveryDate" type="date" defaultValue="2026-08-05" aria-label="Delivery date" /></div>
              <div className="field notes-field"><label htmlFor="cartNotes">Notes</label><textarea id="cartNotes" aria-label="Notes" defaultValue="Need sealed units for rapid deployment stock. Confirm expiry window longer than 24 months." /></div>
            </div>
          </div>
          <div className="card">
            <div className="card-title"><h3>Cart & checkout</h3><span className="subtle">Live estimate</span></div>
            <div className="summary-list">
              <div className="summary-row"><span>Focused item</span><strong id="summaryItem">{mappedCatalogProduct.name}</strong></div>
              <div className="summary-row"><span>Unit price</span><strong id="summaryUnitPrice">{currencySymbols[currency]}{mappedCatalogProduct.prices[currency]}</strong></div>
              <div className="summary-row"><span>Draft quantity</span><strong id="summaryQty">{qty}</strong></div>
              <div className="summary-row muted"><span>Handling</span><strong id="summaryHandling">$12</strong></div>
              <div className="summary-row total"><span>Draft total</span><strong id="summaryTotal">{currencySymbols[currency]}{mappedCatalogProduct.prices[currency] * qty + 12}</strong></div>
            </div>
            <div className="order-actions mt-18"><button className="link-btn" id="addToCartBtn" onClick={handleAddToCart}>Add to cart</button><button className="link-btn primary" id="placeOrderBtn" onClick={onCheckout}>Checkout to order request</button><button className="ghost-btn" onClick={() => setShowDetail(false)}>Back to catalog</button></div>
            <div className="card mt-16 padded-16">
              <div className="card-title mb-12"><h3 className="cart-title">Cart</h3><span className="cart-chip"><span className="cart-dot" id="cartCountDot">0</span><span id="cartSummaryText">0 items</span></span></div>
              <div className="cart-list" id="cartList"><div className="subtle">Your cart is empty. Add products from the catalog.</div></div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export default CatalogView;
