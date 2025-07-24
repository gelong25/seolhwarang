'use client';

import Header from '@/components/Header';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import Head from 'next/head';
import BottomNavigation from '@/components/BottomNavigation';
import SubscriptionModal from '@/components/SubscriptionModal';
import EditProfileModal from '@/components/EditProfileModal';
import ContactModal from '@/components/ContactModal';

// Firebase Client 초기화 모듈에서 가져오기
import { auth, db } from '@/lib/firebaseClient';

// Firebase Auth, Firestore util
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function MyPage() {
  const router = useRouter();

  // 인증/회원 정보 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // 모달 상태
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // 폼 입력
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 캐릭터 선택
  const [selectedCharacter, setSelectedCharacter] = useState('hwarang');

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

  // 인증 상태 변화 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Firestore에서 추가 프로필 읽기
        const snap = await getDoc(doc(db, 'users', user.uid));
        const profile = snap.exists() ? snap.data() : {};

        setUserData({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          points: profile.points ?? 0,
          completedMissions: profile.completedMissions ?? 0,
          isSubscribed: profile.isSubscribed ?? false,
          selectedCharacter: profile.selectedCharacter ?? 'hwarang',
        });
        setSelectedCharacter(profile.selectedCharacter ?? 'hwarang');
        setIsLoggedIn(true);
      } else {
        setUserData(null);
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 로그인
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged가 알아서 userData 세팅
    } catch (err) {
      alert(err.message);
    }
  };

  // 로그아웃
  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (err) {
      console.error(err);
    }
  };

  // 캐릭터 변경 시 Firestore 업데이트
  const handleCharacterSelect = async (charId) => {
    setSelectedCharacter(charId);
    if (auth.currentUser) {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        selectedCharacter: charId
      });
    }
  };

  const getCurrentCharacter = () =>
    characters.find((c) => c.id === selectedCharacter) || characters[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>마이페이지</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="pb-24 max-w-md mx-auto bg-white min-h-screen">
        <Header title="마이페이지" subtitle="내 정보와 혜택" gradient="from-green-400 to-blue-500" />

        {/* 로그인 전 */}
        {!isLoggedIn ? (
          <div className="p-4">
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
                      "안녕~ 나는 {getCurrentCharacter().name}야!<br/>
                      로그인하고 더 많은 모험을 함께 떠나볼까?<br/>
                      특별한 혜택도 기다리고 있어!"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="space-y-4 mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일 입력"
                  className="w-full px-4 py-2 border rounded-xl text-gray-400"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                  className="w-full px-4 py-2 border rounded-xl text-gray-400"
                />
              </div>
              <button
                onClick={handleLogin}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-2xl text-lg font-medium hover:from-green-500 hover:to-blue-600 transition-all shadow-md"
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
            {/* 로그인 후: 포인트/미션 현황 */}
            {userData && (
              <div className="p-4 bg-white border-b">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">⭐</span>
                    <div>
                      <p className="text-lg font-bold text-gray-800">{userData.points.toLocaleString()}P</p>
                      <p className="text-sm text-gray-500">모험 포인트</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <p className="text-lg font-bold text-gray-800">{userData.completedMissions.toLocaleString()}개</p>
                      <p className="text-sm text-gray-500">완료한 미션</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4">
              {/* 사용자 프로필 */}
              {userData && (
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
                          onClick={() => setShowSubscriptionModal(true)}
                          className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full text-sm font-medium hover:from-green-500 hover:to-blue-600 transition-all shadow-md"
                        >
                          구독하기
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 쿠폰 교환 */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🎁</span>
                  쿠폰 교환하기
                </h3>
                <div className="space-y-4">
                  {coupons.map((coupon, idx) => (
                    <div key={idx} className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200 shadow-sm">
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
                            <span className="text-sm font-medium text-gray-700">{coupon.points}P 필요</span>
                          </div>
                          <button 
                            onClick={() => setShowSubscriptionModal(true)}
                            className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
                          >
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
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="w-full text-left py-3 px-4 rounded-xl hover:bg-gray-50 text-gray-700 flex items-center"
                  >
                    <span className="mr-3 text-gray-800">⚙️</span>
                    내 정보 수정
                  </button>
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="w-full text-left py-3 px-4 rounded-xl hover:bg-gray-50 text-gray-700 flex items-center"
                  >
                    <span className="mr-3 text-gray-800">💬</span>
                    문의하기
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-3 px-4 rounded-xl hover:bg-gray-50 text-red-600 flex items-center"
                  >
                    <span className="mr-3">🚪</span>
                    로그아웃
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* 모달 */}
        {showSubscriptionModal && <SubscriptionModal onClose={() => setShowSubscriptionModal(false)} />}
        {showEditModal && userData && (
          <EditProfileModal
            userData={userData}
            onClose={() => setShowEditModal(false)}
            onUpdateUser={(updated) => {
              setUserData(updated);
            }}
          />
        )}
        {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}

        <BottomNavigation />
      </div>
    </div>
);
}
