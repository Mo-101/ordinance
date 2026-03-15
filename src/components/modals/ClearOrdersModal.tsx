import React, { useState } from 'react';

interface ClearOrdersModalProps {
  mode: 'country' | 'all';
  onClose: () => void;
  onSuccess: () => void;
}

function ClearOrdersModal({ mode, onClose, onSuccess }: ClearOrdersModalProps) {
  const [password, setPassword] = useState('');

  const handleConfirm = () => {
    if (!password) return;
    onSuccess();
    onClose();
  };

  return (
    <div className="modal-overlay fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="modal bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-red-600">Confirm Deletion</h2>
          <button onClick={onClose} className="text-2xl text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-800">
            You are about to clear {mode === 'all' ? 'ALL' : 'country-specific'} order history. This action is permanent.
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-400">Confirm Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter your password"
            />
          </div>
        </div>
        <div className="p-6 bg-gray-50 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 font-bold text-gray-500 hover:text-gray-700">Cancel</button>
          <button 
            onClick={handleConfirm}
            disabled={!password}
            className="flex-1 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:opacity-50"
          >
            Confirm Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClearOrdersModal;
