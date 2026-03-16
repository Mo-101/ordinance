/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { 
  Header, 
  Sidebar,
  Dashboard, 
  CatalogView, 
  OrdersView, 
  OSLOperations, 
  AdminView,
  WarehouseManagement
} from './components';
import OrderDetailPage from './components/OrderDetailPage';
import rawInventory from '../data/inventory.json';
import { COMMODITIES, INITIAL_ORDERS } from './constants';
import { Product, Order, OrderStatus } from './types';

// Build products from canonical inventory data
const PRODUCTS: Product[] = (rawInventory as any[]).map((item, idx) => {
  const price = typeof item.price === 'string'
    ? parseFloat(item.price.replace(/[$,]/g, ''))
    : Number(item.price) || 0;

  const filename = typeof item.image === 'string' ? item.image : '';
  const normalizedImage = (() => {
    if (!filename) return '/placeholder-logo.svg';
    const parts = filename.split('/').filter(Boolean);
    const base = parts.pop() || filename;
    return `/${base}`;
  })();

  return {
    id: String(item.id ?? idx + 1),
    name: item.name || 'Unnamed Item',
    sku: item.model3d || item.name || `SKU-${idx + 1}`,
    category: (item.category || 'uncategorized').toString().toLowerCase().replace(/\s+/g, '-'),
    categoryLabel: item.category || 'Uncategorized',
    price,
    stock: 100,
    stockCount: 100,
    useCase: item.usedFor || 'Standard medical use',
    shelfLife: '36 Months',
    shape: 'kit',
    description: item.description || item.usedFor || '',
    usage: item.usedFor || '',
    dosage: 'See instructions',
    included: 'Standard kit packaging.',
    storage: 'Cool, dry place.',
    list: [],
    image: normalizedImage,
    contents: [],
    weight: '-',
    dimensions: '-',
    features: [],
  } as Product;
});

// Map INITIAL_ORDERS to the Order type
const MAPPED_ORDERS: Order[] = INITIAL_ORDERS.map(o => ({
  id: o.id,
  ref: (o as any).pateoRef || o.id,
  name: 'Authorized Personnel',
  address: `${o.country} Office`,
  date: o.date,
  value: o.items.reduce((acc, item) => acc + item.commodity.price * item.qty, 0),
  status: (o.status.toLowerCase().includes('draft') ? 'draft' : 
           o.status.toLowerCase().includes('submitted') ? 'submitted' : 
           o.status.toLowerCase().includes('approved') ? 'approved' : 'completed') as OrderStatus,
  initiator: 'Regional Logistics Hub',
  shipmentMode: 'Air Freight',
  pteao: (o as any).pateoRef || '',
  consignee: `${o.country} Health Ministry`,
  notify: 'logistics@who.int',
  readyDate: 'TBD',
  weight: 0,
  volume: 0,
  remarks: (o as any).notes || '',
  items: o.items.map(item => ({
    product: PRODUCTS.find(p => p.name === item.commodity.name) || PRODUCTS[0],
    qty: item.qty
  }))
}));

export default function App() {
  const [currentUser] = useState({
    name: 'Dr. Alex Laurent',
    role: 'Super Admin',
    country: 'Switzerland'
  });
  
  const [activeTopTab, setActiveTopTab] = useState('dashboard');
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<{ product: Product, qty: number }[]>([]);
  const [orders, setOrders] = useState<Order[]>(MAPPED_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const addToCart = (product: Product, qty: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, qty: item.qty + qty } : item);
      }
      return [...prev, { product, qty }];
    });
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      ref: `REF-${Math.floor(Math.random() * 10000)}`,
      name: currentUser.name,
      address: `${currentUser.country} Office`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      value: cart.reduce((acc, item) => acc + item.product.price * item.qty, 0),
      status: 'draft',
      initiator: 'HCOMS Portal User',
      shipmentMode: 'Air Freight',
      pteao: '',
      consignee: 'Regional Hub',
      notify: 'logistics@who.int',
      readyDate: 'TBD',
      weight: 0,
      volume: 0,
      remarks: 'Order placed via catalog.',
      items: [...cart]
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setActiveTopTab('orders');
    setActiveSubTab('orders');
    setSelectedOrderId(newOrder.id);
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const handleProfileSettings = () => {
    console.log('Opening profile settings...');
  };

  const handleOrderClick = (orderId: string) => {
    setActiveTopTab('supply-chain');
    setActiveSubTab('orders');
    setSelectedOrderId(orderId);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex flex-col">
      <Toaster position="top-right" />
      
      <Header 
        currentUser={currentUser}
        activeTab={activeTopTab}
        setActiveTab={(tab) => {
          setActiveTopTab(tab);
          // default subtabs per top-level
          if (tab === 'dashboard') setActiveSubTab('overview');
          if (tab === 'catalog') setActiveSubTab('catalog');
          if (tab === 'orders') setActiveSubTab('orders');
          if (tab === 'osl') setActiveSubTab('osl-operations');
          if (tab === 'inventory') setActiveSubTab('inventory');
          if (tab === 'laboratory') setActiveSubTab('lab-dashboard');
          if (tab === 'admin') setActiveSubTab('admin-dashboard');
        }}
        onLogout={handleLogout}
        onProfileSettings={handleProfileSettings}
        onOrderClick={handleOrderClick}
      />

      <div className="flex flex-1">
        <Sidebar 
          activeTopTab={activeTopTab}
          activeSubTab={activeSubTab} 
          setActiveSubTab={setActiveSubTab}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <main className="main-with-sidebar">
          {activeTopTab === 'dashboard' && (
            <>
              {activeSubTab === 'overview' && <Dashboard />}
              {activeSubTab === 'analytics' && (
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
                  <h2 className="text-2xl font-bold text-gray-400 italic">Analytics View Implementation in Progress...</h2>
                </div>
              )}
            </>
          )}

          {activeTopTab === 'catalog' && (
            <>
              {activeSubTab === 'catalog' && (
                <CatalogView 
                  products={PRODUCTS} 
                  onAddToCart={addToCart} 
                  onCheckout={handleCheckout}
                  activeCategory={selectedCategory}
                  setActiveCategory={setSelectedCategory}
                />
              )}
              {activeSubTab === 'categories' && (
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
                  <h2 className="text-2xl font-bold text-gray-400 italic">Categories View Implementation in Progress...</h2>
                </div>
              )}
            </>
          )}

          {activeTopTab === 'orders' && (
            <>
              {activeSubTab === 'orders' && (
                <OrdersView 
                  orders={orders}
                  onUpdateStatus={updateOrderStatus}
                  selectedOrderId={selectedOrderId}
                  setSelectedOrderId={setSelectedOrderId}
                />
              )}
              {activeSubTab === 'order-detail' && (
                <OrderDetailPage />
              )}
              {activeSubTab === 'drafts' && (
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
                  <h2 className="text-2xl font-bold text-gray-400 italic">Draft Orders View Implementation in Progress...</h2>
                </div>
              )}
            </>
          )}

          {activeTopTab === 'osl' && (
            <OSLOperations 
              orders={orders} 
              onUpdateStatus={updateOrderStatus} 
            />
          )}

          {activeTopTab === 'inventory' && (
            <>
              {activeSubTab === 'inventory' && (
                <WarehouseManagement />
              )}
            </>
          )}

          {activeTopTab === 'laboratory' && (
            <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
              <h2 className="text-2xl font-bold text-gray-400 italic">Laboratory View Implementation in Progress...</h2>
            </div>
          )}

          {activeTopTab === 'admin' && <AdminView />}
        </main>
      </div>
    </div>
  );
}
