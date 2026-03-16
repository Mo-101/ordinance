import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  Package,
  Zap,
  Ambulance,
  Thermometer,
  Droplets,
  Sun,
  Lock,
  Check,
  ShieldCheck,
  RefreshCcw,
  Headphones,
  ArrowLeft,
} from 'lucide-react';
import { Product } from '../types';
import './ProductDetailView.css';

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, qty: number) => void;
}

type SupportedCurrency = 'USD' | 'KES' | 'NGN' | 'GHS' | 'ZAR' | 'AED';

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

const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onBack,
  onAddToCart,
}) => {
  const [currentQty, setCurrentQty] = useState(1);
  const [currency, setCurrency] = useState<SupportedCurrency>('USD');
  const [activeTab, setActiveTab] = useState<'specs' | 'contents' | 'usage' | 'shipping'>('specs');
  const [isFavorite, setIsFavorite] = useState(false);

  const safeFeatures = product.features ?? [];
  const safeContents = product.contents ?? [];
  const safeList = product.list ?? [
    'Deploy for trauma preparation, scene response, or clinic rapid intake.',
    'Inspect seal, expiry labels, and sterile contents before assignment.',
    'Restock immediately after use to maintain emergency readiness.',
  ];

  const safeDescription = product.description ?? 'No product description available.';
  const safeUsage = product.usage ?? 'Usage guidance not provided.';
  const safeDosage = product.dosage ?? 'No dosage or application note provided.';
  const safeWeight = product.weight ?? 'Not specified';
  const safeDimensions = product.dimensions ?? 'Not specified';
  const safeShelfLife = product.shelfLife ?? 'Not specified';
  const safeStorage = product.storage ?? 'Store in a cool, dry place.';
  const safeIncluded = product.included ?? 'Standard item packaging.';
  const safeCategoryLabel = product.categoryLabel ?? product.category ?? 'Medical Supplies';
  const safeUseCase = product.useCase ?? 'Standard medical use';

  const convertedUnitPrice = useMemo(() => {
    return (product.price * exchangeRates[currency]).toFixed(2);
  }, [product.price, currency]);

  const convertedTotalPrice = useMemo(() => {
    return (product.price * exchangeRates[currency] * currentQty).toFixed(2);
  }, [product.price, currency, currentQty]);

  const adjustQty = (delta: number) => {
    setCurrentQty((prev) => Math.max(1, Math.min(99, prev + delta)));
  };

  const thumbnailImages = [product.image].filter(Boolean);

  const specs = [
    { label: 'SKU', value: product.sku },
    { label: 'Category', value: safeCategoryLabel },
    { label: 'Weight', value: safeWeight },
    { label: 'Dimensions', value: safeDimensions },
    { label: 'Shelf Life', value: safeShelfLife },
    { label: 'Stock Status', value: product.stockCount ? `${product.stockCount} available` : 'In Stock' },
    { label: 'Use Case', value: safeUseCase },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
      className="space-y-6"
    >
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 font-semibold text-gray-500 transition-colors hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to catalog
        </button>
        <ChevronRight size={16} />
        <span>{safeCategoryLabel}</span>
        <ChevronRight size={16} />
        <span className="font-medium text-gray-800">{product.name}</span>
      </div>

      <section className="max-w-6xl mx-auto">
        <div className="neu-flat p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-full h-80 flex items-center justify-center mb-4 neu-pressed">
                {product.image && (
                  <img
                    id="mainImage"
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain drop-shadow-xl transition-all duration-300 hover:scale-105"
                  />
                )}
              </div>

              <div className="flex gap-3">
                {thumbnailImages.map((img, idx) => (
                  <button
                    key={idx}
                    className={`thumbnail-btn ${idx === 0 ? 'active' : ''} w-16 h-16 rounded-xl overflow-hidden bg-white border-2 ${idx === 0 ? 'border-blue-500' : 'border-transparent opacity-60 hover:opacity-100'} transition-all`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumb ${idx + 1}`}
                      className="w-full h-full object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white">
                  {safeCategoryLabel}
                </span>
                <span className="text-xs text-slate-500 font-mono">{product.sku}</span>
              </div>

              <h1 className="text-2xl font-bold text-slate-900 leading-tight">{product.name}</h1>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-amber-400">★</span>
                  <span className="font-bold text-slate-900">4.8</span>
                  <span className="text-slate-500 text-xs">(127 reviews)</span>
                </div>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <div className="flex items-center gap-2 text-emerald-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="font-medium text-sm">In Stock ({product.stockCount ?? '—'})</span>
                </div>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed">{safeDescription}</p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-blue-600">
                    {currencySymbols[currency]}{convertedUnitPrice}
                  </span>
                  <span className="text-sm text-slate-400 font-medium">{currency}</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {(['USD', 'KES', 'NGN', 'GHS', 'ZAR', 'AED'] as const).map((curr) => (
                    <button
                      key={curr}
                      className={`currency-chip px-3 py-1.5 rounded-full text-sm ${currency === curr ? 'active' : ''}`}
                      onClick={() => setCurrency(curr)}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <div className="glass-panel p-2 rounded-xl flex items-center gap-2">
                  <button
                    aria-label="Decrease quantity"
                    onClick={() => adjustQty(-1)}
                    className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-blue-600 transition-all"
                  >
                    <Minus size={16} />
                  </button>

                  <input
                    aria-label="Quantity"
                    type="number"
                    min={1}
                    max={99}
                    value={currentQty}
                    onChange={(e) => setCurrentQty(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
                    className="w-14 text-center font-bold bg-transparent border-none outline-none text-slate-800 text-lg"
                  />

                  <button
                    aria-label="Increase quantity"
                    onClick={() => adjustQty(1)}
                    className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-blue-600 transition-all"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={() => onAddToCart(product, currentQty)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
                >
                  <ShoppingCart size={18} />
                  Add to cart
                </button>

                <button
                  onClick={() => setIsFavorite((prev) => !prev)}
                  className={`w-12 h-12 rounded-xl border transition-all ${isFavorite ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-white border-slate-200 text-slate-500 hover:text-rose-500'}`}
                >
                  <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium">Total</span>
                  <strong className="text-xl text-slate-900">
                    {currencySymbols[currency]}{convertedTotalPrice}
                  </strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-xl bg-white border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-blue-600 mb-2"><Package size={16} /> <span className="font-semibold text-sm">Included</span></div>
                  <p className="text-sm text-slate-600">{safeIncluded}</p>
                </div>
                <div className="rounded-xl bg-white border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-emerald-600 mb-2"><Zap size={16} /> <span className="font-semibold text-sm">Use case</span></div>
                  <p className="text-sm text-slate-600">{safeUseCase}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6">
            <div className="flex flex-wrap gap-2 mb-5">
              {(['specs', 'contents', 'usage', 'shipping'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {tab === 'specs' ? 'Specifications' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {specs.map((spec) => (
                  <div key={spec.label} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-400 font-bold mb-2">{spec.label}</div>
                    <div className="text-sm font-semibold text-slate-800">{spec.value || 'Not specified'}</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'contents' && (
              <div className="grid gap-3">
                {safeContents.length ? safeContents.map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                    {item}
                  </div>
                )) : (
                  <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
                    No contents list provided.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'usage' && (
              <div className="grid gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="font-bold text-slate-900 mb-2">Usage guidance</div>
                  <p className="text-sm text-slate-600">{safeUsage}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="font-bold text-slate-900 mb-2">Notes</div>
                  <p className="text-sm text-slate-600">{safeDosage}</p>
                </div>
                <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2">
                  {safeList.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-2"><Thermometer size={16} /> Storage</div>
                  <p className="text-sm text-slate-600">{safeStorage}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-2"><ShieldCheck size={16} /> Shelf life</div>
                  <p className="text-sm text-slate-600">{safeShelfLife}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default ProductDetailView;