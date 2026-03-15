import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronRight, Star, ShoppingCart, Heart, Truck, ShieldCheck, 
  RefreshCcw, Headphones, Minus, Plus, Info, Check, 
  Thermometer, Droplets, Sun, Lock, Package, Zap, Ambulance,
  ArrowLeft
} from 'lucide-react';
import { Product } from '../types';

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, qty: number) => void;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, onBack, onAddToCart }) => {
  const [currentQty, setCurrentQty] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [mainImage, setMainImage] = useState(product.image);
  const [currency, setCurrency] = useState('USD');

  const exchangeRates: Record<string, number> = { USD: 1, EUR: 0.85, GBP: 0.73, JPY: 149.50 };
  const currencySymbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', JPY: '¥' };

  const convertedPrice = (product.price * exchangeRates[currency] * currentQty).toFixed(2);

  const adjustQty = (delta: number) => {
    setCurrentQty(prev => Math.max(1, Math.min(99, prev + delta)));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto"
    >
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <button onClick={onBack} className="hover:text-blue-600 transition-colors">Products</button>
        <ChevronRight size={16} />
        <span>{product.categoryLabel}</span>
        <ChevronRight size={16} />
        <span className="text-gray-800 font-medium">{product.name}</span>
      </div>

      {/* Product Detail Card */}
      <div className="bg-white rounded-[20px] border border-gray-100 shadow-[8px_8px_16px_#e6e9ef,-8px_-8px_16px_#ffffff] p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: Product Image */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-full h-80 flex items-center justify-center mb-4">
              <img 
                src={mainImage} 
                alt={product.name} 
                className="max-h-full max-w-full object-contain drop-shadow-xl transition-all duration-300 hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex gap-3">
              {[product.image, "https://picsum.photos/seed/med1/320/240", "https://picsum.photos/seed/med2/320/240"].map((img, idx) => (
                <button 
                  key={idx}
                  className={`w-16 h-16 rounded-xl overflow-hidden bg-white border-2 transition-all ${mainImage === img ? 'border-blue-500 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  onClick={() => setMainImage(img)}
                >
                  <img src={img} className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white">{product.categoryLabel}</span>
              <span className="text-xs text-slate-500 font-mono">{product.sku}</span>
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star size={16} className="fill-amber-400 text-amber-400" />
                <span className="font-bold text-slate-900">4.8</span>
                <span className="text-slate-500 text-xs">(127 reviews)</span>
              </div>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <div className={`flex items-center gap-2 ${product.stockCount > 10 ? 'text-emerald-600' : 'text-amber-600'}`}>
                <span className={`w-2 h-2 rounded-full animate-pulse ${product.stockCount > 10 ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                <span className="font-medium text-sm">
                  {product.stockCount > 10 ? `In Stock (${product.stockCount} available)` : `Low Stock - Only ${product.stockCount} left!`}
                </span>
              </div>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-blue-600">{currencySymbols[currency]}{convertedPrice}</span>
                <span className="text-sm text-slate-400 font-medium">{currency}</span>
              </div>
              <div className="flex gap-2">
                {['USD', 'EUR', 'GBP'].map(curr => (
                  <button 
                    key={curr}
                    className={`px-3 py-1.5 rounded-full text-sm font-bold transition-all ${currency === curr ? 'bg-blue-600 text-white shadow-lg' : 'bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100'}`}
                    onClick={() => setCurrency(curr)}
                  >
                    {currencySymbols[curr]} {curr}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <div className="bg-slate-50 p-2 rounded-xl flex items-center gap-2 border border-slate-100">
                <button onClick={() => adjustQty(-1)} className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-blue-600 transition-all">
                  <Minus size={16} />
                </button>
                <input 
                  type="number" 
                  value={currentQty}
                  onChange={(e) => setCurrentQty(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
                  className="w-14 text-center font-bold bg-transparent border-none outline-none text-slate-800 text-lg"
                />
                <button onClick={() => adjustQty(1)} className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-blue-600 transition-all">
                  <Plus size={16} />
                </button>
              </div>
              
              <button 
                onClick={() => onAddToCart(product, currentQty)}
                className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Add to Order
              </button>
              
              <button className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                <Heart size={20} />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 text-center pt-4">
              {[
                { icon: Truck, label: 'Free Ship', color: 'text-blue-600' },
                { icon: ShieldCheck, label: 'FDA Approved', color: 'text-emerald-600' },
                { icon: RefreshCcw, label: '30-Day Return', color: 'text-purple-600' },
                { icon: Headphones, label: '24/7 Support', color: 'text-orange-600' }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <item.icon size={20} className={`${item.color} mx-auto mb-1`} />
                  <div className="text-[10px] font-bold text-slate-700 uppercase">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex gap-1 mb-6 bg-gray-50 p-2 rounded-xl w-fit">
            {[
              { id: 'specs', label: 'Specifications' },
              { id: 'contents', label: 'Contents' },
              { id: 'usage', label: 'Usage' },
              { id: 'shipping', label: 'Shipping' }
            ].map(tab => (
              <button 
                key={tab.id}
                className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="min-h-[200px]">
            {activeTab === 'specs' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">Technical Specifications</h4>
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        { label: "SKU", value: product.sku },
                        { label: "Category", value: product.categoryLabel },
                        { label: "Weight", value: product.weight },
                        { label: "Dimensions", value: product.dimensions },
                        { label: "Stock Status", value: product.stockCount > 10 ? 'In Stock' : 'Low Stock' },
                        { label: "Warranty", value: "2 Years" },
                        { label: "Certification", value: "FDA Approved" }
                      ].map((spec, i) => (
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
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                          <Check size={12} />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {activeTab === 'contents' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">Kit Contents</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {product.contents.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <Check size={14} />
                      </div>
                      <span className="text-sm text-gray-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'usage' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                  <p className="text-sm text-blue-800 flex items-start gap-2">
                    <Info size={16} className="mt-0.5 flex-shrink-0" />
                    <span>Always follow medical guidelines and consult a healthcare professional for proper use in emergency situations.</span>
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">Usage Instructions</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{product.usage}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">Dosage / Application</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{product.dosage}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'shipping' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-bold text-gray-800 mb-4 uppercase tracking-wide">Shipping Options</h4>
                  <div className="space-y-3">
                    {[
                      { icon: Package, title: 'Standard Shipping', desc: '5-7 business days • Free over $100' },
                      { icon: Zap, title: 'Express Shipping', desc: '2-3 business days • $15.99' },
                      { icon: Ambulance, title: 'Critical/Emergency', desc: 'Next business day • $29.99', special: true }
                    ].map((opt, i) => (
                      <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${opt.special ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'}`}>
                        <opt.icon size={20} className="text-blue-600" />
                        <div>
                          <div className={`font-semibold ${opt.special ? 'text-blue-800' : 'text-gray-800'}`}>{opt.title}</div>
                          <div className={`${opt.special ? 'text-blue-600' : 'text-gray-500'} text-xs`}>{opt.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-4 uppercase tracking-wide">Storage Requirements</h4>
                  <div className="space-y-3 text-gray-600">
                    {[
                      { icon: Thermometer, text: 'Store at 15-25°C (59-77°F)' },
                      { icon: Droplets, text: 'Keep humidity below 65%' },
                      { icon: Sun, text: 'Avoid direct sunlight exposure' },
                      { icon: Lock, text: 'Keep out of reach of children' }
                    ].map((req, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <req.icon size={20} className="text-gray-500" />
                        <span>{req.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetailView;
