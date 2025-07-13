// src/components/SubscriptionModal.js
'use client';

import React from 'react';

export default function SubscriptionModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚀</span>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            아직 준비 중이에요!
          </h3>
          <p className="text-gray-600 mb-6">곧 만나요</p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl font-medium hover:from-green-500 hover:to-blue-600 transition-all duration-200 shadow-md"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
