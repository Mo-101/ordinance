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

const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onBack,
  onAddToCart,
}) => {
  const [currentQty, setCurrentQty] = useState(1);
  const [currency, setCurrency] = useState<'USD' | 'KES' | 'NGN' | 'GHS' | 'ZAR' | 'AED'>('USD');
  const [activeTab, setActiveTab] = useState<'specs' | 'contents' | 'usage' | 'shipping'>('specs');
  const [isFavorite, setIsFavorite] = useState(false);

  const exchangeRates: Record<typeof currency, number> = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    JPY: 149.5,
    CAD: 1.36,
    AUD: 1.52,
    AED: 3.67,
  };

  const currencySymbols: Record<typeof currency, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CAD: 'C$',
    AUD: 'A$',
    AED: 'AED ',
  };

  const safeFeatures = product.features ?? [];
  const safeContents = product.contents ?? [];
  const safeList = product.list ?? ['Deploy for trauma preparation, scene response, or clinic rapid intake.', 'Inspect seal, expiry labels, and sterile contents before assignment.', 'Restock immediately after use to maintain emergency readiness.'];

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
            {/* Left visuals */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-full h-80 flex items-center justify-center mb-4 neu-pressed">
                {product.image && (
                  <img id="mainImage" src={product.image} alt={product.name} className="max-h-full max-w-full object-contain drop-shadow-xl transition-all duration-300 hover:scale-105" />
                )}
              </div>
              <div className="flex gap-3">
                {thumbnailImages.map((img, idx) => (
                  <button key={idx} className={`thumbnail-btn ${idx === 0 ? 'active' : ''} w-16 h-16 rounded-xl overflow-hidden bg-white border-2 ${idx === 0 ? 'border-blue-500' : 'border-transparent opacity-60 hover:opacity-100'} transition-all`}>
                    <img src={img} alt={`${product.name} thumb ${idx + 1}`} className="w-full h-full object-contain p-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white">{safeCategoryLabel}</span>
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
                  <span className="text-3xl font-bold text-blue-600">{currencySymbols[currency]}{convertedUnitPrice}</span>
                  <span className="text-sm text-slate-400 font-medium">{currency}</span>
                </div>
                <div className="flex gap-2">
                  {(['USD','EUR','GBP'] as const).map(curr => (
                    <button key={curr} className={`currency-chip px-3 py-1.5 rounded-full text-sm ${currency === curr ? 'active' : ''}`} onClick={() => setCurrency(curr)}>{currencySymbols[curr]} {curr}</button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <div className="glass-panel p-2 rounded-xl flex items-center gap-2">
                  <button aria-label="Decrease quantity" onClick={() => adjustQty(-1)} className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-blue-600 transition-all">
                    <Minus size={16} />
                  </button>
                  <input aria-label="Quantity" type="number" min={1} max={99} value={currentQty} onChange={(e) => setCurrentQty(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))} className="w-14 text-center font-bold bg-transparent border-none outline-none text-slate-800 text-lg" />
                  <button aria-label="Increase quantity" onClick={() => adjustQty(1)} className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-blue-600 transition-all">
                    <Plus size={16} />
                  </button>
                </div>

                <button aria-label="Add to order" onClick={() => onAddToCart(product, currentQty)} className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                  <ShoppingCart size={18} />
                  Add to Order
                </button>

                <button aria-label="Toggle favorite" className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all" onClick={() => setIsFavorite(!isFavorite)}>
                  <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3 text-center pt-4">
                {[
                  { icon: Package, label: 'Free Ship' },
                  { icon: ShieldCheck, label: 'FDA Approved' },
                  { icon: RefreshCcw, label: '30-Day Return' },
                  { icon: Headphones, label: '24/7 Support' },
                ].map((stat, idx) => (
                  <div key={idx} className="glass-panel p-3 rounded-xl">
                    <stat.icon size={18} className="text-blue-600 mx-auto mb-1" />
                    <div className="text-xs font-bold text-slate-700">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex gap-1 mb-6 bg-gray-50 p-2 rounded-xl w-fit">
              {(
                [
                  { id: 'specs', label: 'Specifications' },
                  { id: 'contents', label: 'Contents' },
                  { id: 'usage', label: 'Usage' },
                  { id: 'shipping', label: 'Shipping' },
                ] as const
              ).map(tab => (
                <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className={`tab-content ${activeTab === 'specs' ? 'active' : ''}`}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">Technical Specifications</h4>
                  <table className="w-full text-sm">
                    <tbody>
                      {specs.map((spec, i) => (
                        <tr key={i} className="border-b border-gray-100 last:border-0">
                          <td className="py-2 pr-4 font-semibold text-gray-700 w-1/3">{spec.label}:</td>
                          <td className="py-2 text-gray-600">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">Key Features</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {safeFeatures.length ? safeFeatures.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                          <Check size={12} />
                        </div>
                        <span>{feature}</span>
                      </li>
                    )) : <li className="text-gray-500 italic">No features listed.</li>}
                  </ul>
                </div>
              </div>
            </div>

            <div className={`tab-content ${activeTab === 'contents' ? 'active' : ''}`}>
              <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">Kit Contents</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {safeContents.length ? safeContents.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                      <Check size={12} />
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{item}</span>
                  </div>
                )) : <div className="text-gray-500 italic">No contents listed.</div>}
              </div>
            </div>

            <div className={`tab-content ${activeTab === 'usage' ? 'active' : ''}`}>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                <p className="text-sm text-blue-800 flex items-start gap-2">
                  <span className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600">ℹ</span>
                  <span>Always follow medical guidelines and consult a healthcare professional for proper use in emergency situations.</span>
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">Usage Instructions</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{safeUsage}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">Dosage / Application</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{safeDosage}</p>
                </div>
              </div>
            </div>

            <div className={`tab-content ${activeTab === 'shipping' ? 'active' : ''}`}>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-bold text-gray-800 mb-4 uppercase tracking-wide">Shipping Options</h4>
                  <div className="space-y-3">
                    {[
                      { icon: Package, title: 'Standard Shipping', desc: '5-7 business days • Free over $100' },
                      { icon: Zap, title: 'Express Shipping', desc: '2-3 business days • $15.99' },
                      { icon: Ambulance, title: 'Critical/Emergency', desc: 'Next business day • $29.99', highlight: true },
                    ].map((opt, i) => (
                      <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${opt.highlight ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'} }`}>
                        <opt.icon size={20} className="text-blue-600" />
                        <div>
                          <div className={opt.highlight ? 'font-semibold text-blue-800' : 'font-semibold text-gray-800'}>{opt.title}</div>
                          <div className={opt.highlight ? 'text-blue-600 text-xs' : 'text-gray-500 text-xs'}>{opt.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-4 uppercase tracking-wide">Storage Requirements</h4>
                  <div className="space-y-3 text-gray-600">
                    {[ { icon: Thermometer, text: 'Store at 15-25°C (59-77°F)' }, { icon: Droplets, text: 'Keep humidity below 65%' }, { icon: Sun, text: 'Avoid direct sunlight exposure' }, { icon: Lock, text: 'Keep out of reach of children' } ].map((req, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <req.icon size={20} className="text-gray-500" />
                        <span>{req.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default ProductDetailView;