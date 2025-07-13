'use client';

import React, { useState } from 'react';

export default function EditProfileModal({ userData, onClose }) {
  const [name, setName] = useState(userData.name);
  const [email, setEmail] = useState(userData.email);

  const handleSave = () => {
    // TODO: 실제 저장 처리 로직
    alert('정보가 수정되었습니다.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">⚙️ 내 정보 수정</h2>

        <div className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="이름"
            className="w-full px-4 py-2 border rounded-xl"
          />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="이메일"
            className="w-full px-4 py-2 border rounded-xl"
          />
        </div>

        <div className="flex justify-end mt-6 space-x-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-500 hover:underline">취소</button>
          <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded-xl">저장</button>
        </div>
      </div>
    </div>
  );
}
