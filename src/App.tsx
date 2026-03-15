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
import { COMMODITIES, INITIAL_ORDERS } from './constants';
import { Product, Order, OrderStatus } from './types';

// Map the products from the provided HTML to the Product type
const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Advanced Emergency Trauma Kit",
    category: "emergency",
    categoryLabel: "Emergency Health Kits",
    price: 149.99,
    stock: 45,
    stockCount: 45,
    image: "https://picsum.photos/seed/trauma/640/360",
    sku: "EMT-ADV-001",
    description: "Comprehensive trauma kit for critical care situations. Designed for first responders, EMTs, and emergency medical personnel. Contains life-saving hemorrhage control and airway management tools.",
    contents: ["Trauma Shears", "Israeli Bandage (4-inch)", "Chest Seal (2-pack)", "Tourniquet CAT Gen 7", "Compressed Gauze", "Nitrile Gloves (Pair)", "Emergency Blanket", "CPR Face Shield"],
    usage: "For severe bleeding, chest wounds, and traumatic injuries. Apply tourniquet 2-3 inches above wound. Use Israeli bandage for compression. Seal chest wounds immediately.",
    dosage: "N/A - External use only. Single patient use. Dispose after use.",
    weight: "2.3 lbs",
    dimensions: "12 x 8 x 6 inches",
    features: ["Military-grade tourniquet", "Ventilated chest seal", "Latex-free materials", "Water-resistant case", "Reflective markings"],
    useCase: "Standard medical use",
    shelfLife: "36 Months",
    shape: "kit",
    included: "Standard kit packaging.",
    storage: "Cool, dry place.",
    list: ["Quality certified", "Sterile packaging", "WHO approved"]
  },
  {
    id: "2",
    name: "N95 Respirator Masks (Box of 20)",
    category: "ppe",
    categoryLabel: "PPE & Protection",
    price: 45.99,
    stock: 120,
    stockCount: 120,
    image: "https://picsum.photos/seed/mask/640/360",
    sku: "PPE-N95-020",
    description: "NIOSH-approved N95 particulate respirators with 95% filtration efficiency against solid and liquid aerosols. Essential for infection control.",
    contents: ["20 N95 Respirators", "Adjustable Nose Clip", "Ultrasonic welded headbands", "Usage Instructions"],
    usage: "Wear when exposed to airborne particles, bioaerosols, or contaminated environments. Ensure proper seal by molding nose clip.",
    dosage: "Single use only. Maximum 8 hours continuous wear. Replace when damaged, moist, or breathing resistance increases.",
    weight: "0.5 lbs",
    dimensions: "8 x 5 x 4 inches",
    features: ["NIOSH Approved N95", "≥95% Filtration", "Comfortable foam nose cushion", "Latex-free", "Flame resistant"],
    useCase: "Standard medical use",
    shelfLife: "36 Months",
    shape: "mask",
    included: "Standard box packaging.",
    storage: "Cool, dry place.",
    list: ["Quality certified", "Sterile packaging", "WHO approved"]
  },
  {
    id: "3",
    name: "Family First Aid Kit Deluxe",
    category: "firstaid",
    categoryLabel: "First Aid",
    price: 89.99,
    stock: 8,
    stockCount: 8,
    image: "https://picsum.photos/seed/firstaid/640/360",
    sku: "FAK-DLX-001",
    description: "300-piece comprehensive first aid kit for home, office, and travel. Treats minor injuries and provides essential emergency supplies.",
    contents: ["Bandages (assorted sizes)", "Antiseptic Wipes (20)", "Burn Gel", "Digital Thermometer", "CPR Mask", "Emergency Blanket", "Scissors", "Tweezers", "Gauze Pads", "Medical Tape", "Finger Splints"],
    usage: "Treatment of minor cuts, burns, sprains, and emergencies. Clean wounds before applying bandages. Monitor temperature with included thermometer.",
    dosage: "As needed for minor injuries. For serious injuries, seek professional medical attention immediately.",
    weight: "3.1 lbs",
    dimensions: "10 x 7 x 3 inches",
    features: ["300+ pieces", "Hard-shell waterproof case", "Wall mountable", "FDA approved contents", "5-year shelf life"],
    useCase: "Standard medical use",
    shelfLife: "36 Months",
    shape: "kit",
    included: "Standard kit packaging.",
    storage: "Cool, dry place.",
    list: ["Quality certified", "Sterile packaging", "WHO approved"]
  },
  {
    id: "4",
    name: "Disposable Medical Coveralls (Case of 25)",
    category: "ppe",
    categoryLabel: "PPE & Protection",
    price: 175.00,
    stock: 32,
    stockCount: 32,
    image: "https://picsum.photos/seed/coveralls/640/360",
    sku: "PPE-COV-025",
    description: "Level 2 protective coveralls with hood and boot covers. Provides protection against hazardous dust and limited liquid splash.",
    contents: ["25 Microporous Film Coveralls", "Attached Hood with Elastic Face", "Attached Boot Covers", "Elastic Wrists", "Front Zipper with Storm Flap"],
    usage: "Body protection in medical, laboratory, and contaminated environments. Zip completely and seal all openings.",
    dosage: "Single use. Dispose in biohazard waste after contamination or after single use in critical environments.",
    weight: "8.5 lbs",
    dimensions: "18 x 12 x 10 inches",
    features: ["CE Certified", "Microporous fabric", "Breathable", "Liquid splash resistant", "Multiple sizes available"],
    useCase: "Standard medical use",
    shelfLife: "36 Months",
    shape: "glove", // Using glove as a placeholder for coverall shape
    included: "Standard case packaging.",
    storage: "Cool, dry place.",
    list: ["Quality certified", "Sterile packaging", "WHO approved"]
  },
  {
    id: "5",
    name: "Digital Blood Pressure Monitor",
    category: "diagnostics",
    categoryLabel: "Diagnostics",
    price: 79.99,
    stock: 56,
    stockCount: 56,
    image: "https://picsum.photos/seed/bpm/640/360",
    sku: "DIA-BPM-001",
    description: "Automatic upper arm blood pressure monitor with irregular heartbeat detection. Clinically validated for accuracy.",
    contents: ["Monitor Unit", "Wide-Range Cuff (8.7-16.5 in)", "Carrying Case", "4 AA Batteries", "Instruction Manual"],
    usage: "Monitor blood pressure and pulse rate at home or clinic. Sit quietly for 5 minutes before measurement. Arm at heart level.",
    dosage: "Measure 2-3 times daily or as directed by physician. Take 3 readings and average results for accuracy.",
    weight: "0.8 lbs",
    dimensions: "6 x 4 x 3 inches",
    features: ["Irregular heartbeat detection", "120 memory readings", "Large LCD display", "WHO BP Classification", "5-year warranty"],
    useCase: "Standard medical use",
    shelfLife: "36 Months",
    shape: "kit",
    included: "Standard unit packaging.",
    storage: "Cool, dry place.",
    list: ["Quality certified", "Sterile packaging", "WHO approved"]
  }
];

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
    setActiveTopTab('supply-chain');
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
          // Set default subtab
          if (tab === 'dashboard') setActiveSubTab('overview');
          if (tab === 'products') setActiveSubTab('catalog');
          if (tab === 'supply-chain') setActiveSubTab('orders');
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

          {activeTopTab === 'products' && (
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

          {activeTopTab === 'supply-chain' && (
            <>
              {activeSubTab === 'orders' && (
                <OrdersView 
                  orders={orders} 
                  onUpdateStatus={updateOrderStatus}
                  selectedOrderId={selectedOrderId}
                  setSelectedOrderId={setSelectedOrderId}
                />
              )}
              {activeSubTab === 'drafts' && (
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
                  <h2 className="text-2xl font-bold text-gray-400 italic">Draft Orders View Implementation in Progress...</h2>
                </div>
              )}
              {activeSubTab === 'osl-operations' && (
                <OSLOperations 
                  orders={orders} 
                  onUpdateStatus={updateOrderStatus} 
                />
              )}
              {activeSubTab === 'inventory' && (
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
                  <h2 className="text-2xl font-bold text-gray-400 italic">Inventory View Implementation in Progress...</h2>
                </div>
              )}
              {activeSubTab === 'warehouse' && <WarehouseManagement />}
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
