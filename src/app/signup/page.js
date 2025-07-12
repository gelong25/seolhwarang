'use client';

import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { useState } from 'react';

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    // TODO: 백엔드 회원가입 API 연동 필요
    alert('회원가입이 완료되었습니다!');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>회원가입</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="max-w-md mx-auto bg-white min-h-screen px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">👤 회원가입</h2>

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl font-medium hover:from-green-500 hover:to-blue-600 transition-all duration-200 shadow-md"
          >
            회원가입 완료하기
          </button>
        </form>
      </div>
    </div>
  );
}
