// src/components/Header.js
"use client";

import { useRouter } from 'next/navigation';

export default function Header({ title, subtitle, gradient = "from-green-400 to-blue-500" }) {
  const router = useRouter();
  return (
    <div className={`bg-gradient-to-r ${gradient} p-4 text-white`}>
      <div className="flex items-center space-x-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-white/20 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="font-bold text-lg">{title}</h1>
          {subtitle && <p className="text-sm opacity-90">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
