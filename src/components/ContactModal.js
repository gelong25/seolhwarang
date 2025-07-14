'use client';

import React from 'react';

export default function ContactModal({ onClose }) {
  const supportEmail = "hayeon788@gmail.com";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">💬 문의하기</h2>
        <p className="text-gray-700 mb-4">
          문의 사항이 있으시면 아래 이메일로 연락 주세요.
        </p>
        <p className="text-blue-600 font-medium mb-6">{supportEmail}</p>

        <div className="flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-xl text-gray-700">닫기</button>
        </div>
      </div>
    </div>
  );
}
