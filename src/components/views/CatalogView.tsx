import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Product } from '../../types';

import './CatalogView.css';

interface CatalogViewProps {
  products: Product[];
  onAddToCart: (product: Product, qty: number) => void;
  onCheckout: () => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

type SupportedCurrency = 'USD' | 'KES' | 'NGN' | 'GHS' | 'ZAR' | 'AED';
type ShapeKey = 'kit' | 'mask' | 'glove';

const exchangeRates: Record<SupportedCurrency, number> = {
  USD: 1,
  KES: 129.5,
  NGN: 1580,
  GHS: 15.4,
  ZAR: 18.6,
  AED: 3.67,
};

const currencySymbols: Record<SupportedCurrency, string> = {
  USD: '$',
  KES: 'KSh ',
  NGN: '₦',
  GHS: 'GH₵ ',
  ZAR: 'R ',
  AED: 'AED ',
};

function CatalogView({
  products,
  onAddToCart,
  onCheckout,
  activeCategory,
  setActiveCategory,
}: CatalogViewProps) {
  const [currentProductKey, setCurrentProductKey] = useState<string>(products[0]?.id || '');
  const [currency, setCurrency] = useState<SupportedCurrency>('USD');
  const [qty, setQty] = useState(2);
  const [showDetail, setShowDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const normalizedProducts = useMemo(() => products ?? [], [products]);

  const categoryOptions = useMemo(() => {
    const grouped = normalizedProducts.reduce<Record<string, number>>((acc, product) => {
      const raw = (product.category || '').toLowerCase();
      let category = 'all';

      if (raw.includes('ppe')) category = 'ppe';
      else if (raw.includes('emergency')) category = 'emergency';
      else if (raw.includes('diagnostic')) category = 'diagnostics';
      else if (raw.includes('laboratory') || raw.includes('supply')) category = 'supplies';
      else if (raw.includes('reagent')) category = 'reagents';
      else if (raw.includes('first')) category = 'firstaid';

      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, { all: normalizedProducts.length });

    return [
      { id: 'all', label: 'All Products', count: grouped.all || normalizedProducts.length },
      { id: 'emergency', label: 'Emergency Kits', count: grouped.emergency || 0 },
      { id: 'ppe', label: 'PPE & Protection', count: grouped.ppe || 0 },
      { id: 'diagnostics', label: 'Diagnostics', count: grouped.diagnostics || 0 },
      { id: 'supplies', label: 'Laboratory Supplies', count: grouped.supplies || 0 },
      { id: 'reagents', label: 'Reagents', count: grouped.reagents || 0 },
      { id: 'firstaid', label: 'First Aid', count: grouped.firstaid || 0 },
    ];
  }, [normalizedProducts]);

  const filteredProducts = useMemo(() => {
    return normalizedProducts.filter((product) => {
      const haystack = [
        product.name,
        product.sku,
        product.category,
        product.categoryLabel,
        product.description,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch = !searchTerm.trim() || haystack.includes(searchTerm.toLowerCase());

      const raw = (product.category || '').toLowerCase();
      let derivedCategory = 'all';
      if (raw.includes('ppe')) derivedCategory = 'ppe';
      else if (raw.includes('emergency')) derivedCategory = 'emergency';
      else if (raw.includes('diagnostic')) derivedCategory = 'diagnostics';
      else if (raw.includes('laboratory') || raw.includes('supply')) derivedCategory = 'supplies';
      else if (raw.includes('reagent')) derivedCategory = 'reagents';
      else if (raw.includes('first')) derivedCategory = 'firstaid';

      const matchesCategory = activeCategory === 'all' || derivedCategory === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [normalizedProducts, searchTerm, activeCategory]);

  const activeProductData = useMemo(() => {
    return filteredProducts.find((p) => p.id === currentProductKey)
      || normalizedProducts.find((p) => p.id === currentProductKey)
      || filteredProducts[0]
      || normalizedProducts[0];
  }, [filteredProducts, normalizedProducts, currentProductKey]);

  const mappedCatalogProduct = useMemo(() => {
    if (!activeProductData) return null;

    const shape: ShapeKey =
      activeProductData.shape && ['kit', 'mask', 'glove'].includes(activeProductData.shape)
        ? (activeProductData.shape as ShapeKey)
        : 'kit';

    const basePrice = activeProductData.price || 0;

    return {
      name: activeProductData.name,
      category: activeProductData.categoryLabel || activeProductData.category || 'Medical Supplies',
      badge: activeProductData.categoryLabel || activeProductData.category || 'Medical Supplies',
      sku: `${activeProductData.sku || 'N/A'}`,
      stock: `${activeProductData.stockCount || activeProductData.stock || 'N/A'}`,
      useCase: activeProductData.useCase || 'Medical use',
      shelfLife: activeProductData.shelfLife || '36 months',
      shape,
      prices: {
        USD: Math.round(basePrice * exchangeRates.USD),
        KES: Math.round(basePrice * exchangeRates.KES),
        NGN: Math.round(basePrice * exchangeRates.NGN),
        GHS: Math.round(basePrice * exchangeRates.GHS),
        ZAR: Math.round(basePrice * exchangeRates.ZAR),
        AED: Math.round(basePrice * exchangeRates.AED),
      },
      description: activeProductData.description || 'No product description available.',
      meta: {
        usage: activeProductData.usage || 'Usage per product label.',
        dosage: activeProductData.dosage || 'Not a drug product. Follow protocol.',
        included: activeProductData.included || activeProductData.contents?.join(', ') || 'See product details.',
        storage: activeProductData.storage || 'Store in a cool dry place.',
        list1: activeProductData.list?.[0] || 'Quality certified',
        list2: activeProductData.list?.[1] || 'Sterile packaging',
        list3: activeProductData.list?.[2] || 'WHO approved',
      },
    };
  }, [activeProductData]);

  const imageForProduct = (productId: string) => {
    const prod = normalizedProducts.find((p) => p.id === productId);
    return prod?.image;
  };

  const handleAddToCart = () => {
    if (!activeProductData) return;
    onAddToCart(activeProductData, qty);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`products-shell ${showDetail ? 'hidden' : ''}`}
      id="productsCatalogShell"
    >
      <section className="products-hero">
        <div className="hero-banner card">
          <div className="hero-copy">
            <div className="eyebrow">Medical products • sterile supply</div>
            <h2>Smart care inventory with a premium clinical shelf.</h2>
            <p>
              Browse live inventory-backed product records with country-friendly multi-currency
              display and a cleaner catalog-to-detail workflow.
            </p>
            <div className="hero-actions">
              <button className="hero-btn primary" onClick={() => setShowDetail(false)}>
                Browse catalog
              </button>
              <button className="hero-btn" onClick={() => setActiveCategory('emergency')}>
                Emergency kits
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="device-screen">
              <div className="device-ui">
                <div className="ui-line w56"></div>
                <div className="ui-box"></div>
                <div className="ui-line w88"></div>
                <div className="ui-line w72"></div>
                <div className="ui-line w64"></div>
              </div>
            </div>
            <div className="device-screen small">
              <div className="device-ui compact">
                <div className="ui-box short"></div>
                <div className="ui-line w70"></div>
                <div className="ui-line w48"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-side">
          <div className="card spotlight-card">
            <div className="product-art kit"></div>
            <div className="spotlight-copy">
              <h3>Emergency Health Kits</h3>
              <p>Trauma-ready, sealed, category-labeled kits for field response, clinics, and rapid dispatch stations.</p>
              <div className="chip-row">
                <span className="chip">IFAK</span>
                <span className="chip">Trauma</span>
                <span className="chip">Rapid Pack</span>
              </div>
            </div>
          </div>

          <div className="card spotlight-card">
            <div className="product-art mask"></div>
            <div className="spotlight-copy">
              <h3>PPE Essentials</h3>
              <p>Mask, gloves, shields, gowns, and sterile barrier stock with shelf-life and usage metadata.</p>
              <div className="chip-row">
                <span className="chip">N95</span>
                <span className="chip">Gloves</span>
                <span className="chip">Sterile</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="products-layout">
        <aside className="card filters-card">
          <input
            className="search-box"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="⌕ Search products, SKUs, kits"
          />

          <div className="filter-group">
            <div className="filter-title">Categories</div>
            {categoryOptions.map((category) => (
              <button
                key={category.id}
                className={`category-link ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
                type="button"
              >
                <span>{category.label}</span>
                <span>{category.count}</span>
              </button>
            ))}
          </div>

          <div className="filter-group">
            <div className="filter-title">Currency</div>
            <div className="currency-pills">
              {(['USD', 'KES', 'NGN', 'GHS', 'ZAR', 'AED'] as const).map((cur) => (
                <button
                  key={cur}
                  className={`currency-pill ${currency === cur ? 'active' : ''}`}
                  data-currency={cur}
                  onClick={() => setCurrency(cur)}
                >
                  {cur}
                </button>
              ))}
            </div>
          </div>

          <div className="note-box">
            <b>Catalog note</b>
            Tap a product card and the detail panel updates with summary, usage guidance,
            storage notes, and pricing in the selected currency.
          </div>
        </aside>

        <div className="products-main">
          <div className="products-head">
            <div>
              <h3 className="products-head-title">Featured medical products</h3>
              <div className="subtle products-head-sub">
                {filteredProducts.length} item(s) shown from live inventory-backed products.
              </div>
            </div>
            <div className="chip-row">
              <span className="chip">Clinic Stock</span>
              <span className="chip">Emergency Ready</span>
              <span className="chip">Multi-currency</span>
            </div>
          </div>

          <div className="products-grid">
            {filteredProducts.map((p) => {
              const active = p.id === currentProductKey;
              const shape = p.shape && ['kit', 'mask', 'glove'].includes(p.shape) ? p.shape : 'kit';
              const convertedPrice = (p.price || 0) * exchangeRates[currency];

              return (
                <article
                  key={p.id}
                  className={`card product-card ${active ? 'active-product' : ''}`}
                  data-product={p.id}
                  onClick={() => setCurrentProductKey(p.id)}
                >
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
                      <div>
                        <h4 className="product-name">{p.name}</h4>
                        <div className="sku">SKU {p.sku}</div>
                      </div>
                      <div className="price-block">
                        <strong className="money">
                          {currencySymbols[currency]}{convertedPrice.toFixed(2)}
                        </strong>
                        <span>per {shape === 'kit' ? 'kit' : 'box'}</span>
                      </div>
                    </div>

                    <div className="spec-list">
                      <div>Category<b>{p.categoryLabel || p.category}</b></div>
                      <div>Stock<b>{p.stockCount || p.stock}</b></div>
                      <div>Use case<b>{p.useCase || 'Medical use'}</b></div>
                      <div>Shelf life<b>{p.shelfLife || '36 months'}</b></div>
                    </div>

                    <div className="card-actions">
                      <button
                        className="link-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentProductKey(p.id);
                        }}
                      >
                        Summary
                      </button>
                      <button
                        className="link-btn primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentProductKey(p.id);
                          setShowDetail(true);
                        }}
                      >
                        View details
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {showDetail && (
        <section className={`products-detail-page ${showDetail ? 'active' : ''}`} id="productsDetailPage">
          <div className="section-nav full-span">
            <button className="ghost-btn">Dashboard</button>
            <button className="ghost-btn">Order requests</button>
            <button className="ghost-btn">OSL Operations</button>
            <button className="ghost-btn" onClick={() => setShowDetail(false)}>Back to catalog</button>
          </div>

          {mappedCatalogProduct ? (
            <>
              <div className="card detail-visual">
                <div className="eyebrow detail-eyebrow">Item detail</div>
                <div className={`product-shape ${mappedCatalogProduct.shape}`} id="detailShape"></div>
              </div>

              <div className="order-panel">
                <div className="card detail-summary">
                  <div className="detail-title">
                    <h2 id="detailName">{mappedCatalogProduct.name}</h2>
                    <p id="detailSummary">{mappedCatalogProduct.description}</p>
                  </div>

                  <div className="products-head no-padding">
                    <div className="price-block left-align">
                      <strong id="detailPrice">
                        {currencySymbols[currency]}{mappedCatalogProduct.prices[currency]}
                      </strong>
                      <span id="detailPriceMeta">per kit • tax excluded</span>
                    </div>
                    <span className="chip" id="detailCategory">{mappedCatalogProduct.category}</span>
                  </div>

                  <div className="detail-grid">
                    <div className="detail-cell">
                      <span>Usage</span>
                      <strong id="detailUsage">{mappedCatalogProduct.meta.usage}</strong>
                    </div>
                    <div className="detail-cell">
                      <span>Dosage / note</span>
                      <strong id="detailDosage">{mappedCatalogProduct.meta.dosage}</strong>
                    </div>
                    <div className="detail-cell">
                      <span>Included</span>
                      <strong id="detailIncluded">{mappedCatalogProduct.meta.included}</strong>
                    </div>
                    <div className="detail-cell">
                      <span>Storage</span>
                      <strong id="detailStorage">{mappedCatalogProduct.meta.storage}</strong>
                    </div>
                  </div>

                  <div className="filter-title mb-10">Usage checklist</div>
                  <ul className="usage-list">
                    <li>{mappedCatalogProduct.meta.list1}</li>
                    <li>{mappedCatalogProduct.meta.list2}</li>
                    <li>{mappedCatalogProduct.meta.list3}</li>
                  </ul>
                </div>

                <div className="card padded-16">
                  <h3 className="cart-title">Request item</h3>

                  <div className="order-grid mt-16">
                    <div className="field">
                      <label>Quantity</label>
                      <div className="qty-stepper">
                        <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                        <span className="qty-value">{qty}</span>
                        <button onClick={() => setQty((q) => q + 1)}>+</button>
                      </div>
                    </div>

                    <div className="field">
                      <label>Currency</label>
                      <select value={currency} onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}>
                        {(['USD', 'KES', 'NGN', 'GHS', 'ZAR', 'AED'] as const).map((cur) => (
                          <option key={cur} value={cur}>{cur}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="summary-list mt-16">
                    <div className="summary-row muted">
                      <span>Unit price</span>
                      <span>{currencySymbols[currency]}{mappedCatalogProduct.prices[currency]}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total</span>
                      <span>{currencySymbols[currency]}{(mappedCatalogProduct.prices[currency] * qty).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="order-actions mt-18">
                    <button className="link-btn primary" onClick={handleAddToCart}>Add to cart</button>
                    <button className="ghost-btn" onClick={onCheckout}>Checkout</button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="card detail-summary">
              <div className="detail-title">
                <h2>Product not found</h2>
                <p>The selected product could not be found or is no longer available.</p>
              </div>
              <div className="order-actions mt-18">
                <button className="link-btn primary" onClick={() => setShowDetail(false)}>Back to catalog</button>
              </div>
            </div>
          )}
        </section>
      )}
    </motion.div>
  );
}

export default CatalogView;