import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  PieChart, 
  Package, 
  Layers, 
  Tag,
  ChevronDown,
  ChevronRight,
  FlaskConical,
  Settings,
  Users,
  ClipboardList,
  Warehouse,
  Boxes
} from 'lucide-react';
import { SIDEBAR_NAV_ITEMS } from '../constants';
import '../styles/Sidebar.css';

interface SidebarProps {
  activeTopTab: string;
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTopTab, 
  activeSubTab, 
  setActiveSubTab,
  selectedCategory,
  setSelectedCategory
}) => {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);

  const getIcon = (id: string) => {
    switch(id) {
      case 'overview': return LayoutDashboard;
      case 'analytics': return PieChart;
      case 'catalog': return Package;
      case 'categories': return Layers;
      case 'orders': return ShoppingCart;
      case 'drafts': return ClipboardList;
      case 'osl-operations': return Boxes;
      case 'inventory': return Layers;
      case 'warehouse': return Warehouse;
      case 'lab-dashboard': return FlaskConical;
      case 'controls': return Settings;
      case 'admin-dashboard': return Tag;
      case 'users': return Users;
      case 'settings': return Settings;
      default: return LayoutDashboard;
    }
  };

  const menuItems = SIDEBAR_NAV_ITEMS[activeTopTab] || [];

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'emergency', label: 'Emergency Kits' },
    { id: 'ppe', label: 'PPE & Protection' },
    { id: 'diagnostics', label: 'Diagnostics' },
    { id: 'supplies', label: 'Laboratory Supplies' },
    { id: 'reagents', label: 'Reagents' },
    { id: 'firstaid', label: 'First Aid' }
  ];

  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = getIcon(item.id);
          const isProductsCategories = activeTopTab === 'products' && item.id === 'categories';

          return (
            <div key={item.id}>
              <div
                className={`sidebar-item ${activeSubTab === item.id ? 'active' : ''}`}
                onClick={() => {
                  if (isProductsCategories) {
                    setIsCategoriesOpen(!isCategoriesOpen);
                  }
                  setActiveSubTab(item.id);
                }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {isProductsCategories && (
                  <div className="ml-auto">
                    {isCategoriesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </div>
                )}
              </div>

              {isProductsCategories && isCategoriesOpen && (
                <div className="sidebar-sub-menu">
                  {categories.map(cat => (
                    <div 
                      key={cat.id} 
                      className={`sidebar-sub-item ${selectedCategory === cat.id ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setActiveSubTab('catalog');
                      }}
                    >
                      {cat.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] opacity-50">HCOMS v2.4.0</p>
          <div className="flex gap-3">
            <a href="#">Help</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
