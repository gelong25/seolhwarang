//app/mypage/app.js
'use client';
import Header from '@/components/Header'; // 여니추가
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import Head from 'next/head';
import BottomNavigation from '@/components/BottomNavigation';
import SubscriptionModal from '@/components/SubscriptionModal';

export default function MyPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState('hwarang');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const storedUser = typeof window !== 'undefined' 
  ? JSON.parse(localStorage.getItem('user')) 
  : null;

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const savedCharacter = user?.selectedCharacter || 'hwarang';
    setSelectedCharacter(savedCharacter);
  }, []);

  const userData = storedUser;

  const characters = [
    { id: 'hwarang', name: '화랑이', emoji: '/assets/hwarang.png' },
    { id: 'dolhareubang', name: '돌이방이', emoji: '/assets/doribangi.png' },
    { id: 'tangerine', name: '귤이', emoji: '/assets/gyuri.png' }
  ];

  const coupons = [
    { name: '제주 감귤 체험장', discount: '20%', points: 500 },
    { name: '해녀 박물관', discount: '무료입장', points: 300 },
    { name: '제주 전통차 카페', discount: '30%', points: 400 }
  ];

  const getCurrentCharacter = () => {
    return characters.find(char => char.id === selectedCharacter) || characters[0];
  };

  const handleLogin = async () => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
  
    const data = await res.json();
    if (res.ok) {
      alert('로그인 성공!');
      localStorage.setItem('user', JSON.stringify(data.user));
      setIsLoggedIn(true); 
    } else {
      alert(data.error);
    }
  };

  // TODO: 구독 처리 - 백엔드에 사용자 구독 요청 API 연동 필요
  const handleSubscribe = () => {
    setShowSubscriptionModal(true);
  };

  const closeModal = () => {
    setShowSubscriptionModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>마이페이지</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="pb-24 max-w-md mx-auto bg-white min-h-screen">
        {/* 헤더 */}
        {/*<div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-md">
                <img src={getCurrentCharacter().emoji} alt={getCurrentCharacter().name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="font-bold text-lg">마이페이지</h2>
                <p className="text-sm opacity-90">내 정보와 혜택</p>
              </div>
            </div>
          </div>
        </div>*/}
        <Header title="마이페이지" subtitle="내 정보와 혜택" gradient="from-green-400 to-blue-500" />


        {/* 로그인하지 않은 경우 */}
        {!isLoggedIn ? (
          <div className="p-4">
            {/* 캐릭터 인사 */}
            <div className="bg-green-50 rounded-2xl p-6 mb-6 border border-green-200">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 self-start mt-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-white shadow-md">
                    <img src={getCurrentCharacter().emoji} alt={getCurrentCharacter().name} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-white rounded-xl p-5 shadow-sm">
                    <p className="text-gray-800 leading-relaxed text-base">
                      "안녕~ 나는 {getCurrentCharacter().name}야! <br/> 
                      로그인하고 더 많은 모험을 함께 떠나볼까? <br/>
                      특별한 혜택도 기다리고 있어!"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {/* 이메일, 비밀번호 입력 */}
            <div className="space-y-4 mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 입력"
                className="w-full px-4 py-2 border rounded-xl"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                className="w-full px-4 py-2 border rounded-xl"
              />
            </div>
            {/* 로그인 버튼 */}
              <button
                onClick={handleLogin}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-2xl text-lg font-medium hover:from-green-500 hover:to-blue-600 transition-all duration-200 shadow-md"
              >
                🔐 로그인하기
              </button>
              <button
                onClick={() => router.push('/signup')} 
                className="w-full px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl text-lg font-medium hover:bg-gray-50 transition-colors shadow-sm"
              >
                👤 회원가입하기
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 포인트 및 현황 */}
            <div className="p-4 bg-white border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="text-lg font-bold text-gray-800">{(userData.points ?? 0).toLocaleString()}P</p>
                    <p className="text-sm text-gray-500">모험 포인트</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <p className="text-lg font-bold text-gray-800">{(userData.completedMissions ?? 0).toLocaleString()}개</p>
                    <p className="text-sm text-gray-500">완료한 미션</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4">
              {/* 사용자 정보 */}
              <div className="bg-green-50 rounded-2xl p-6 mb-6 border border-green-200">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-md">
                    <img src={getCurrentCharacter().emoji} alt={getCurrentCharacter().name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{userData.name}</h3>
                    <p className="text-sm text-gray-600">{userData.email}</p>
                  </div>
                </div>

                {/* 구독 상태 */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {userData.isSubscribed ? '🎉 프리미엄 구독 중' : '🌟 무료 플랜'}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {userData.isSubscribed 
                          ? '모든 기능을 이용할 수 있어요' 
                          : '구독하고 더 많은 혜택을 누려보세요'}
                      </p>
                    </div>
                    {!userData.isSubscribed && (
                      <button
                        onClick={handleSubscribe}
                        className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full text-sm font-medium hover:from-green-500 hover:to-blue-600 transition-all duration-200 shadow-md"
                      >
                        구독하기
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 쿠폰 교환하기 */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🎁</span>
                  쿠폰 교환하기
                </h3>
                
                <div className="space-y-4">
                  {coupons.map((coupon, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                            <span className="text-2xl">🎟️</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800">{coupon.name}</h4>
                            <p className="text-sm text-gray-600">{coupon.discount} 할인</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-2">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm font-medium text-gray-700">
                              {coupon.points}P
                            </span>
                          </div>
                          <button className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors">
                            교환하기
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 기타 메뉴 */}
              <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm">
                <div className="p-4 space-y-1">
                  <button className="w-full text-left py-3 px-4 rounded-xl hover:bg-gray-50 text-gray-700 flex items-center">
                    <span className="mr-3">⚙️</span>
                    내 정보 수정
                  </button>
                  <button className="w-full text-left py-3 px-4 rounded-xl hover:bg-gray-50 text-gray-700 flex items-center">
                    <span className="mr-3">💬</span>
                    문의하기
                  </button>
                  <button 
                    onClick={() => setIsLoggedIn(false)}
                    className="w-full text-left py-3 px-4 rounded-xl hover:bg-gray-50 text-red-600 flex items-center"
                  >
                    {/* TODO: 로그아웃 처리 - 세션/토큰 제거 및 백엔드 로그아웃 호출 필요 */}
                    <span className="mr-3">🚪</span>
                    로그아웃
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* 구독 모달 */}
        {showSubscriptionModal && <SubscriptionModal onClose={closeModal} />}

        {/* 하단 내비게이션<BottomNavigation /> */}
        <BottomNavigation />
      </div>
    </div>
  );
}