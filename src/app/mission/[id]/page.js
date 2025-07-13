//app/mission/[id]/page.js
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Head from 'next/head';
import characters from '@/data/character.json';

export default function Mission() { // 여기 수정
  const params = useParams();
  const id = params.id;  
  const router = useRouter();
  const [currentMission, setCurrentMission] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const missions = [
    {
      type: 'photo',
      title: '용머리해안 사진 찍기',
      description: '용머리해안의 멋진 모습을 사진으로 담아보세요!',
      icon: '📸',
      points: 50
    },
    {
      type: 'stamp',
      title: '관광 안내소 스탬프',
      description: '관광 안내소에서 기념 스탬프를 받아보세요.',
      icon: '🏛️',
      points: 30
    },
    {
      type: 'quiz',
      title: '용머리해안 퀴즈',
      description: '용머리해안에 대해 배운 것을 확인해보세요!',
      icon: '🧩',
      points: 70
    }
  ];

  // 캐릭터 선택 로직
  const selectedCharacterId = typeof window !== 'undefined'
    ? localStorage.getItem('selectedCharacter') || 'hwarang'
    : 'hwarang';

  const currentCharacter = characters.find(c => c.id === selectedCharacterId);

  const handleMissionComplete = () => {
    setShowSuccess(true);
    setTimeout(() => {
      if (currentMission < missions.length - 1) {
        setCurrentMission(currentMission + 1);
        setShowSuccess(false);
      } else {
        router.push('/');
      }
    }, 2000);
  };

  const mission = missions[currentMission];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>미션 수행 - 화랑이와 제주 모험</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-4 text-white">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold">미션 수행</h1>
              <p className="text-sm opacity-90">
                {currentMission + 1} / {missions.length}
              </p>
            </div>
          </div>
        </div>

        {/* 진행 바 */}
        <div className="p-4 bg-white border-b">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">진행률</span>
            <span className="text-sm font-medium text-gray-800">
              {Math.round(((currentMission + 1) / missions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentMission + 1) / missions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* 캐릭터 격려 */}
        <div className="p-4 bg-purple-50 border-b">
          <div className="flex items-start space-x-3">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-sm">
            <img src={currentCharacter.image} alt={currentCharacter.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="bg-white rounded-xl p-3 shadow-sm">
                <p className="text-gray-800 leading-relaxed">
                  "잘하고 있어! 이번 미션도 화이팅! 🎉"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 미션 내용 */}
        <div className="p-4 flex-1">
          {!showSuccess ? (
            <div className="text-center">
              <div className="text-8xl mb-6">{mission.icon}</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">{mission.title}</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">{mission.description}</p>
              
              <div className="mb-8">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-50 rounded-full border border-yellow-200">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-sm font-medium text-gray-700">
                    {mission.points}P 획득 가능
                  </span>
                </div>
              </div>

              {mission.type === 'photo' && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                    <div className="text-6xl mb-4">📷</div>
                    <p className="text-gray-500">사진을 찍어주세요</p>
                  </div>
                  <button
                    onClick={handleMissionComplete}
                    className="w-full px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                  >
                    카메라 열기
                  </button>
                </div>
              )}

              {mission.type === 'stamp' && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                    <div className="text-6xl mb-4">📍</div>
                    <p className="text-gray-500">위치를 확인해주세요</p>
                  </div>
                  <button
                    onClick={handleMissionComplete}
                    className="w-full px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
                  >
                    스탬프 받기
                  </button>
                </div>
              )}

              {mission.type === 'quiz' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 border-2 border-gray-100 text-left">
                    <h3 className="font-bold text-gray-800 mb-3">
                      용머리해안의 이름은 어떻게 생겨났을까요?
                    </h3>
                    <div className="space-y-2">
                      <button className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                        ① 용이 살았던 곳이라서
                      </button>
                      <button
                        onClick={handleMissionComplete}
                        className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        ② 바위 모양이 용의 머리를 닮아서
                      </button>
                      <button className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                        ③ 용궁으로 가는 입구라서
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-8xl mb-6">🎉</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">미션 완료!</h2>
              <p className="text-gray-600 mb-6">
                <span className="font-medium text-purple-600">+{mission.points}P</span> 획득!
              </p>
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
                <span className="text-green-500">✅</span>
                <span className="text-sm font-medium text-gray-700">
                  {currentMission < missions.length - 1 ? '다음 미션으로...' : '모든 미션 완료!'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}