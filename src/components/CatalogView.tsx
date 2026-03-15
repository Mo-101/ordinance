import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, ShoppingCart, Heart, Tag, 
  ChevronLeft, ChevronRight, Grid3X3, List,
  Filter, ArrowUpDown
} from 'lucide-react';
import { Product } from '../types';
import ProductDetailView from './ProductDetailView';

interface CatalogViewProps {
  products: Product[];
  onAddToCart: (product: Product, qty: number) => void;
  onCheckout: () => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

function CatalogView({ products, onAddToCart, onCheckout, activeCategory, setActiveCategory }: CatalogViewProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currency, setCurrency] = useState('USD');

  const exchangeRates: Record<string, number> = {
    USD: 1, EUR: 0.85, GBP: 0.73, JPY: 149.50, CAD: 1.36, AUD: 1.52
  };

  const currencySymbols: Record<string, string> = {
    USD: '$', EUR: '€', GBP: '£', JPY: '¥', CAD: 'C$', AUD: 'A$'
  };

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'emergency', label: 'Emergency Health Kits' },
    { id: 'ppe', label: 'PPE & Protection' },
    { id: 'diagnostics', label: 'Diagnostics' },
    { id: 'firstaid', label: 'First Aid' },
    { id: 'medications', label: 'Medications' }
  ];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           p.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchTerm]);

  if (selectedProduct) {
    return (
      <ProductDetailView 
        product={selectedProduct} 
        onBack={() => setSelectedProduct(null)}
        onAddToCart={(p, q) => {
          onAddToCart(p, q);
          setSelectedProduct(null);
        }}
      />
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Medical Products</h1>
          <p className="text-gray-500 mt-1">Browse emergency health kits, PPE, and medical supplies</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">Currency:</span>
            <select 
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-white px-4 py-2 text-sm font-semibold text-gray-700 rounded-xl border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="CAD">CAD (C$)</option>
              <option value="AUD">AUD (A$)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-3">
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2 text-sm font-bold rounded-full transition-all ${activeCategory === cat.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 shadow-sm border border-gray-100 hover:bg-gray-50'}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="bg-gray-50 flex items-center gap-3 px-4 py-3 rounded-xl flex-1 w-full md:w-auto border border-gray-100">
          <Search className="text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search products, SKUs, or categories..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-gray-700 w-full font-medium"
          />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button className="px-5 py-3 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-600 flex items-center gap-2 hover:bg-gray-50 transition-all">
            <Filter size={18} />
            Filters
          </button>
          <button className="px-5 py-3 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-600 flex items-center gap-2 hover:bg-gray-50 transition-all">
            <ArrowUpDown size={18} />
            Sort
          </button>
          <div className="flex gap-2">
            <button className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100">
              <Grid3X3 size={18} />
            </button>
            <button className="p-3 bg-white border border-gray-100 text-gray-600 rounded-xl hover:bg-gray-50 transition-all">
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => (
            <motion.div 
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -8 }}
              className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl hover:bg-white transition-all group relative cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full border border-white/60 shadow-sm text-[11px] font-bold">
                <span className={`w-2 h-2 rounded-full ${product.stockCount > 10 ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`}></span>
                <span className={product.stockCount > 10 ? 'text-emerald-700' : 'text-amber-700'}>
                  {product.stockCount > 10 ? `${product.stockCount} in stock` : `Only ${product.stockCount} left`}
                </span>
              </div>

              <div className="h-48 flex items-center justify-center p-6 bg-transparent">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="max-h-full max-w-full object-contain filter drop-shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-extrabold text-blue-600 uppercase tracking-wider mb-3">
                  <Tag size={12} />
                  {product.categoryLabel}
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-2">{product.name}</h3>
                <div className="mb-3">
                  <span className="font-mono text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">{product.sku}</span>
                </div>
                
                <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-blue-600">
                      {currencySymbols[currency]}{(product.price * exchangeRates[currency]).toFixed(2)}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">{currency}</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product, 1);
                    }}
                    className="flex-1 h-11 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100 hover:shadow-blue-200 transition-all hover:-translate-y-0.5"
                  >
                    <ShoppingCart size={16} />
                    Quick Order
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="w-11 h-11 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <Heart size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 pt-8">
        <button className="p-2 rounded-xl bg-white border border-gray-100 text-gray-400 cursor-not-allowed">
          <ChevronLeft size={20} />
        </button>
        <button className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-100">1</button>
        <button className="w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-600 font-bold hover:bg-gray-50 transition-all">2</button>
        <button className="w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-600 font-bold hover:bg-gray-50 transition-all">3</button>
        <span className="text-gray-400 px-2">...</span>
        <button className="w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-600 font-bold hover:bg-gray-50 transition-all">8</button>
        <button className="p-2 rounded-xl bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 transition-all">
          <ChevronRight size={20} />
        </button>
      </div>
    </motion.div>
  );
}

export default CatalogView;
