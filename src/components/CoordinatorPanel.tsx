/**
 * CoordinatorPanel - AI Coordinator Interface
 * Left: Order form | Right: Inventory assessment | Bottom: Action strip
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Package,
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  Send,
  Eye,
  Settings,
  RefreshCw,
  TrendingUp,
  MapPin,
  DollarSign,
  Calendar,
  FileText,
  User,
  ChevronRight,
  Plus,
  Minus,
  Info,
} from 'lucide-react';
import { coordinatorAPI, inventoryAPI } from '../services/api';
import { SourcingOption, InventoryAssessment } from '../types';
import toast from 'react-hot-toast';

interface CoordinatorPanelProps {
  orderId?: string;
  onClose?: () => void;
}

const CoordinatorPanel: React.FC<CoordinatorPanelProps> = ({ orderId, onClose }) => {
  const [activeTab, setActiveTab] = useState<'assessment' | 'options' | 'routing'>('assessment');
  const [orderLines, setOrderLines] = useState<{ skuCode: string; requestedQty: number }[]>([]);
  const [assessments, setAssessments] = useState<InventoryAssessment[]>([]);
  const [sourcingOptions, setSourcingOptions] = useState<SourcingOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<SourcingOption | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchSku, setSearchSku] = useState('');

  // Load order lines (mock for now)
  useEffect(() => {
    if (orderId) {
      setOrderLines([
        { skuCode: 'ERK-204', requestedQty: 25 },
        { skuCode: 'N95-118', requestedQty: 100 },
        { skuCode: 'SNG-441', requestedQty: 50 },
      ]);
    }
  }, [orderId]);

  // Assess inventory when order lines change
  useEffect(() => {
    if (orderLines.length > 0) {
      assessInventory();
    }
  }, [orderLines]);

  const assessInventory = async () => {
    setIsLoading(true);
    try {
      const response = await coordinatorAPI.assessInventory(orderLines);
      if (response.success) {
        setAssessments(response.data.assessments as InventoryAssessment[]);
        toast.success('Inventory assessment complete');
      }
    } catch (error: any) {
      toast.error(error.message || 'Assessment failed');
    } finally {
      setIsLoading(false);
    }
  };

  const buildSourcingOptions = async () => {
    if (!orderId) return;
    
    setIsLoading(true);
    try {
      const response = await coordinatorAPI.buildSourcingOptions(orderId, assessments);
      if (response.success) {
        setSourcingOptions(response.data.options as SourcingOption[]);
        setActiveTab('options');
        toast.success('Sourcing options generated');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate options');
    } finally {
      setIsLoading(false);
    }
  };

  const routeOrder = async (optionId: string) => {
    if (!orderId) return;

    setIsLoading(true);
    try {
      const response = await coordinatorAPI.routeOrder(orderId, optionId);
      if (response.success) {
        toast.success(`Order routed to ${response.data.routedToHub}`);
        setActiveTab('routing');
      }
    } catch (error: any) {
      toast.error(error.message || 'Routing failed');
    } finally {
      setIsLoading(false);
    }
  };

  const addOrderLine = () => {
    if (searchSku.trim()) {
      setOrderLines(prev => [...prev, { skuCode: searchSku.toUpperCase(), requestedQty: 1 }]);
      setSearchSku('');
    }
  };

  const updateOrderLineQty = (index: number, delta: number) => {
    setOrderLines(prev => prev.map((line, i) => 
      i === index 
        ? { ...line, requestedQty: Math.max(1, line.requestedQty + delta) }
        : line
    ));
  };

  const removeOrderLine = (index: number) => {
    setOrderLines(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-7xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Settings className="w-6 h-6" />
                AI Coordinator
              </h2>
              <p className="text-blue-100 mt-1">
                {orderId ? `Order: ${orderId}` : 'Intelligent order coordination'}
              </p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Eye className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {(['assessment', 'options', 'routing'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-4 font-semibold text-sm capitalize transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex h-[600px]">
          {/* Left Panel - Order Form */}
          <div className="w-1/3 border-r border-gray-200 p-6 overflow-y-auto">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Order Lines
            </h3>

            {/* Add SKU */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="SKU Code"
                value={searchSku}
                onChange={(e) => setSearchSku(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addOrderLine()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addOrderLine}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Order Lines */}
            <div className="space-y-2">
              {orderLines.map((line, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{line.skuCode}</div>
                    <div className="text-gray-500 text-xs">Qty: {line.requestedQty}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateOrderLineQty(index, -1)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{line.requestedQty}</span>
                    <button
                      onClick={() => updateOrderLineQty(index, 1)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeOrderLine(index)}
                      className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors ml-2"
                    >
                      <Minus className="w-3 h-3 rotate-45" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-2">
              <button
                onClick={assessInventory}
                disabled={isLoading || orderLines.length === 0}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Assess Inventory
              </button>
              <button
                onClick={buildSourcingOptions}
                disabled={isLoading || assessments.length === 0}
                className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
                Build Options
              </button>
            </div>
          </div>

          {/* Right Panel - Dynamic Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'assessment' && (
                <motion.div
                  key="assessment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Inventory Assessment
                  </h3>

                  {assessments.map((assessment, index) => (
                    <div key={index} className="neu-card p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{assessment.skuCode}</h4>
                          <p className="text-sm text-gray-600">Requested: {assessment.totalRequested}</p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          assessment.canCoverFully 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {assessment.canCoverFully ? 'Available' : 'Shortage'}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        {assessment.availableByHub.map((hub, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span>{hub.hub}: {hub.availableQty}</span>
                          </div>
                        ))}
                      </div>

                      <div className="text-sm p-2 bg-gray-50 rounded">
                        <strong>Recommended:</strong> {assessment.recommendedSourcing.reason}
                      </div>

                      {assessment.shortageQty > 0 && (
                        <div className="mt-2 flex items-center gap-2 text-orange-600 text-sm">
                          <AlertTriangle className="w-4 h-4" />
                          Shortage: {assessment.shortageQty} units
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'options' && (
                <motion.div
                  key="options"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Sourcing Options
                  </h3>

                  {sourcingOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`neu-card p-4 cursor-pointer transition-all ${
                        selectedOption?.id === option.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedOption(option)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">Option {option.optionNumber}</h4>
                          <p className="text-sm text-gray-600">{option.sourcingMode}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">${option.totalEstimatedCostUsd.toFixed(2)}</div>
                          <div className="text-sm text-gray-600">{option.estimatedDeliveryDays} days</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span>{option.primaryHub}</span>
                        </div>
                        {option.secondaryHub && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-purple-600" />
                            <span>{option.secondaryHub}</span>
                          </div>
                        )}
                      </div>

                      <div className="text-sm p-2 bg-gray-50 rounded">
                        {option.coordinatorSummary}
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          option.coverageConfidence === 'high' 
                            ? 'bg-green-100 text-green-800'
                            : option.coverageConfidence === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {option.coverageConfidence} confidence
                        </div>
                      </div>
                    </div>
                  ))}

                  {selectedOption && (
                    <button
                      onClick={() => routeOrder(selectedOption.id)}
                      disabled={isLoading}
                      className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Route Order to {selectedOption.primaryHub}
                    </button>
                  )}
                </motion.div>
              )}

              {activeTab === 'routing' && (
                <motion.div
                  key="routing"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Order Routed
                  </h3>

                  <div className="neu-card p-6 text-center">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h4 className="font-bold text-lg mb-2">Order Successfully Routed</h4>
                    <p className="text-gray-600 mb-4">
                      The order has been routed to the appropriate hub and is ready for processing.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-left">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Next Steps</div>
                        <ul className="text-sm mt-1 space-y-1">
                          <li>• Generate Stock Requisition</li>
                          <li>• Reserve Inventory</li>
                          <li>• Prepare Dispatch</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Estimated Timeline</div>
                        <div className="text-sm mt-1 space-y-1">
                          <li>• SR Generation: 2 hours</li>
                          <li>• Stock Reservation: 4 hours</li>
                          <li>• Dispatch: 24 hours</li>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CoordinatorPanel;
