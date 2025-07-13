// src/components/BottomNavigation.js
"use client";

import { useRouter, usePathname } from 'next/navigation';

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (path) => pathname === path || pathname.startsWith(path + '/');
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t px-4 py-3">
      <div className="flex justify-around">
        <button
          onClick={() => router.push('/')}
          className={`flex flex-col items-center space-y-1 ${isActive('/') ? 'text-green-500' : 'text-gray-400'}`}
        >
          <span className="text-2xl">🏠</span>
          <span className="text-xs font-medium">홈</span>
        </button>

        <button
          onClick={() => router.push('/course')}
          className={`flex flex-col items-center space-y-1 ${isActive('/course') ? 'text-green-500' : 'text-gray-400'}`}
        >
          <span className="text-2xl">🗺️</span>
          <span className="text-xs font-medium">코스</span>
        </button>

        <button
          onClick={() => {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const userId = storedUser?.id;

            if (userId) {
              router.push(`/mission/${userId}`);
            } else {
              alert('로그인이 필요합니다!');
              router.push('/mypage'); // 로그인하러 유도할 수도 있음
            }
          }}
          className={`flex flex-col items-center space-y-1 ${isActive('/mission') ? 'text-green-500' : 'text-gray-400'}`}
        >
          <span className="text-2xl">🎯</span>
          <span className="text-xs font-medium">미션</span>
        </button>


        <button
          onClick={() => router.push('/mypage')}
          className={`flex flex-col items-center space-y-1 ${isActive('/mypage') ? 'text-green-500' : 'text-gray-400'}`}
        >
          <span className="text-2xl">👤</span>
          <span className="text-xs font-medium">마이페이지</span>
        </button>
      </div>
    </div>
  );
}
