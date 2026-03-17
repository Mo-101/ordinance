/**
 * SourcingOptionsModal - Country-facing options cards
 * Displays sourcing options with accept/reject actions
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  MapPin,
  DollarSign,
  Calendar,
  Package,
  Truck,
  FileText,
  ChevronRight,
  Clock,
  TrendingUp,
  Shield,
  Star,
} from 'lucide-react';
import { ordersAPI } from '../services/api';
import { SourcingOption, CountryOptionResponse } from '../types';
import toast from 'react-hot-toast';

interface SourcingOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: string;
  options: SourcingOption[];
  onResponse?: (response: CountryOptionResponse) => void;
}

const SourcingOptionsModal: React.FC<SourcingOptionsModalProps> = ({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  options,
  onResponse,
}) => {
  const [selectedOption, setSelectedOption] = useState<SourcingOption | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [alternativeNotes, setAlternativeNotes] = useState('');
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [showAlternativeForm, setShowAlternativeForm] = useState(false);

  const handleAccept = async (option: SourcingOption) => {
    setIsSubmitting(true);
    try {
      const response = await ordersAPI.respondToOption(
        orderId,
        option.id,
        'accept',
        { autoAccepted: false }
      );
      
      if (response.success) {
        toast.success('Option accepted successfully');
        onResponse?.({
          id: crypto.randomUUID(),
          orderId,
          optionId: option.id,
          response: 'accept',
          respondedBy: 'country',
          respondedAt: new Date(),
          acceptedTransportCost: option.transportCostUsd,
        });
        onClose();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to accept option');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (option: SourcingOption) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await ordersAPI.respondToOption(
        orderId,
        option.id,
        'reject',
        { rejectionReason }
      );
      
      if (response.success) {
        toast.success('Option rejected');
        onResponse?.({
          id: crypto.randomUUID(),
          orderId,
          optionId: option.id,
          response: 'reject',
          respondedBy: 'country',
          respondedAt: new Date(),
          rejectionReason,
        });
        onClose();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject option');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestAlternative = async (option: SourcingOption) => {
    if (!alternativeNotes.trim()) {
      toast.error('Please describe your alternative requirements');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await ordersAPI.respondToOption(
        orderId,
        option.id,
        'request_alternative',
        { alternativeRequestNotes: alternativeNotes }
      );
      
      if (response.success) {
        toast.success('Alternative request submitted');
        onResponse?.({
          id: crypto.randomUUID(),
          orderId,
          optionId: option.id,
          response: 'request_alternative',
          respondedBy: 'country',
          respondedAt: new Date(),
          alternativeRequestNotes: alternativeNotes,
        });
        onClose();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to request alternative');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getConfidenceIcon = (confidence: string) => {
    switch (confidence) {
      case 'high': return <CheckCircle className="w-4 h-4" />;
      case 'medium': return <AlertTriangle className="w-4 h-4" />;
      case 'low': return <XCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-6xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Package className="w-6 h-6" />
                Sourcing Options
              </h2>
              <p className="text-blue-100 mt-1">
                Order: {orderNumber} • {options.length} options available
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {options.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`neu-card p-6 cursor-pointer transition-all ${
                  selectedOption?.id === option.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedOption(option)}
              >
                {/* Option Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Option {option.optionNumber}</h3>
                    <p className="text-sm text-gray-600 capitalize">{option.sourcingMode.replace('_', ' ')}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      ${option.totalEstimatedCostUsd.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">USD</div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Delivery</div>
                    <div className="font-semibold text-sm">{option.estimatedDeliveryDays} days</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Primary Hub</div>
                    <div className="font-semibold text-sm">{option.primaryHub}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Truck className="w-4 h-4 text-green-600 mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Transport</div>
                    <div className="font-semibold text-sm">${option.transportCostUsd}</div>
                  </div>
                </div>

                {/* Confidence Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${getConfidenceColor(option.coverageConfidence)}`}>
                    {getConfidenceIcon(option.coverageConfidence)}
                    {option.coverageConfidence} confidence
                  </div>
                  {option.secondaryHub && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-3 h-3" />
                      + {option.secondaryHub}
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="p-3 bg-blue-50 rounded-lg mb-4">
                  <p className="text-sm text-blue-800">{option.coordinatorSummary}</p>
                </div>

                {/* Line Items Preview */}
                <div className="mb-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Included Items</h4>
                  <div className="space-y-1">
                    {option.lines.slice(0, 3).map((line, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-600">{line.skuCode}</span>
                        <span className="font-medium">{line.proposedQty} units</span>
                      </div>
                    ))}
                    {option.lines.length > 3 && (
                      <div className="text-sm text-gray-500">+{option.lines.length - 3} more items</div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAccept(option);
                    }}
                    disabled={isSubmitting}
                    className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    Accept
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowRejectionForm(true);
                      setSelectedOption(option);
                    }}
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAlternativeForm(true);
                      setSelectedOption(option);
                    }}
                    className="flex-1 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Alternative
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-gray-600">
                <p className="font-semibold mb-1">Important Information:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Transport costs are your responsibility as per country agreement</li>
                  <li>• Delivery estimates are from hub dispatch to final destination</li>
                  <li>• Partial fulfillment may occur if stock is limited</li>
                  <li>• You can request alternatives if options don't meet your needs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Rejection Form Modal */}
        <AnimatePresence>
          {showRejectionForm && selectedOption && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
              >
                <h3 className="text-lg font-bold mb-4">Reject Option {selectedOption.optionNumber}</h3>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please explain why you're rejecting this option..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleReject(selectedOption)}
                    disabled={isSubmitting || !rejectionReason.trim()}
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Confirm Rejection
                  </button>
                  <button
                    onClick={() => {
                      setShowRejectionForm(false);
                      setRejectionReason('');
                      setSelectedOption(null);
                    }}
                    className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Alternative Request Form Modal */}
        <AnimatePresence>
          {showAlternativeForm && selectedOption && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
              >
                <h3 className="text-lg font-bold mb-4">Request Alternative - Option {selectedOption.optionNumber}</h3>
                <textarea
                  value={alternativeNotes}
                  onChange={(e) => setAlternativeNotes(e.target.value)}
                  placeholder="Describe what you'd like to change (delivery timeline, sourcing hub, quantities, etc.)..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleRequestAlternative(selectedOption)}
                    disabled={isSubmitting || !alternativeNotes.trim()}
                    className="flex-1 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Submit Request
                  </button>
                  <button
                    onClick={() => {
                      setShowAlternativeForm(false);
                      setAlternativeNotes('');
                      setSelectedOption(null);
                    }}
                    className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SourcingOptionsModal;
