import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, MapPin, AlertTriangle, ChevronRight, Search, Filter } from 'lucide-react';
import { warehouseAPI } from '../services/api';
import Loading from './Loading';
import toast from 'react-hot-toast';

function WarehouseManagement() {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);
  const [inventory, setInventory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchWarehouses = async () => {
    setIsLoading(true);
    try {
      const response = await warehouseAPI.getAll();
      if (response.success) {
        setWarehouses(response.data.warehouses);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch warehouses');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInventory = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await warehouseAPI.getInventory(id);
      if (response.success) {
        setInventory(response.data.inventory);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch inventory');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  useEffect(() => {
    if (selectedWarehouse) {
      fetchInventory(selectedWarehouse.id);
    }
  }, [selectedWarehouse]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
        <div>
          <h2 className="text-2xl font-black text-gray-800">Warehouse Management</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Global Stock & Logistics Control</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search locations..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold"
            />
          </div>
          <button className="p-2 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors">
            <Filter size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Warehouse List */}
        <div className="lg:col-span-1 space-y-4">
          {isLoading && warehouses.length === 0 ? (
            <Loading />
          ) : (
            warehouses.filter(w => w.name.toLowerCase().includes(searchTerm.toLowerCase())).map((warehouse) => (
              <motion.div 
                key={warehouse.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedWarehouse(warehouse)}
                className={`p-5 rounded-3xl cursor-pointer transition-all duration-300 border ${selectedWarehouse?.id === warehouse.id ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-100' : 'bg-white text-gray-800 border-gray-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-blue-100'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${selectedWarehouse?.id === warehouse.id ? 'bg-white/20' : 'bg-blue-50'}`}>
                    <MapPin size={20} className={selectedWarehouse?.id === warehouse.id ? 'text-white' : 'text-blue-600'} />
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${selectedWarehouse?.id === warehouse.id ? 'bg-white/20' : 'bg-gray-100 text-gray-400'}`}>
                    {warehouse.code}
                  </div>
                </div>
                <h3 className="font-black text-lg mb-1">{warehouse.name}</h3>
                <p className={`text-xs font-bold mb-4 ${selectedWarehouse?.id === warehouse.id ? 'text-white/70' : 'text-gray-400'}`}>
                  {warehouse.location}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <div>
                      <div className={`text-[10px] font-black uppercase tracking-widest ${selectedWarehouse?.id === warehouse.id ? 'text-white/50' : 'text-gray-400'}`}>Capacity</div>
                      <div className="text-sm font-black">{warehouse.capacity_used}%</div>
                    </div>
                    <div>
                      <div className={`text-[10px] font-black uppercase tracking-widest ${selectedWarehouse?.id === warehouse.id ? 'text-white/50' : 'text-gray-400'}`}>Staff</div>
                      <div className="text-sm font-black">{warehouse.staff_count}</div>
                    </div>
                  </div>
                  <ChevronRight size={20} className={selectedWarehouse?.id === warehouse.id ? 'text-white' : 'text-gray-300'} />
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Inventory Details */}
        <div className="lg:col-span-2">
          {selectedWarehouse ? (
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-black text-gray-800">Inventory: {selectedWarehouse.name}</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Live Stock Levels</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
                  Request Transfer
                </button>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoading ? (
                  <div className="col-span-2 py-12"><Loading /></div>
                ) : inventory.length > 0 ? (
                  inventory.map((item, i) => (
                    <div key={i} className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 flex items-center gap-4 group hover:bg-white hover:shadow-lg transition-all duration-300">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                        <Package size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-sm font-black text-gray-800">{item.product_name}</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">SKU: {item.sku}</div>
                          </div>
                          {item.quantity < item.reorder_point && (
                            <div className="text-orange-500" title="Low Stock Warning">
                              <AlertTriangle size={16} />
                            </div>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${item.quantity < item.reorder_point ? 'bg-orange-500' : 'bg-emerald-500'}`} 
                              style={{ width: `${Math.min(100, (item.quantity / item.reorder_point) * 50)}%` }}
                            />
                          </div>
                          <span className="text-xs font-black text-gray-700">{item.quantity} {item.unit}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 py-12 text-center text-gray-400 font-bold italic">
                    No inventory data found for this location.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-gray-100 p-12 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <MapPin size={40} className="text-gray-200" />
              </div>
              <h3 className="text-xl font-black text-gray-300 uppercase tracking-widest">Select a Warehouse</h3>
              <p className="text-sm text-gray-400 font-bold mt-2">Choose a location from the list to view detailed stock levels and operations.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default WarehouseManagement;
