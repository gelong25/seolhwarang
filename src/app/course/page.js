"use client";

import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import BottomNavigation from '@/components/BottomNavigation';
import SubscriptionModal from '@/components/SubscriptionModal';

export default function Courses() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  // TODO: 사용자 레벨을 API로부터 가져오도록 수정
  const [userLevel, setUserLevel] = useState(3);

  // TODO: 백엔드에서 카테고리 리스트를 받아오도록 변경
  const categories = [
    { id: 'all', name: '전체', icon: 'assets/all_icon.png' },
    { id: 'legend', name: '전설', icon: '/assets/dragon_icon.png' },
    { id: 'nature', name: '자연', icon: '/assets/nature_icon.png' },
    { id: 'culture', name: '문화', icon: '/assets/culture_icon.png' },
    { id: 'food', name: '음식', icon: '/assets/food_icon.png' }
  ];

  // TODO: 백엔드 API로부터 코스 목록 불러오기
  const allCourses = [
    {
      id: 1,
      title: '용머리해안의 전설',
      category: 'legend',
      location: '용머리해안',
      duration: '2시간',
      difficulty: 1,
      description: '바다 속 용왕님의 신비로운 이야기',
      missions: 3,
      points: 150,
      completed: true,
      image: '/assets/dragon.png',
      color: 'bg-blue-50 border-blue-200',
      premium: false
    },
    {
      id: 2,
      title: '한라산 산신령 이야기',
      category: 'legend',
      location: '한라산',
      duration: '3시간',
      difficulty: 2,
      description: '높은 산에 사는 친근한 산신령과의 만남',
      missions: 5,
      points: 200,
      completed: false,
      image: '/assets/guardian.png',
      color: 'bg-green-50 border-green-200',
      premium: false
    },
    {
      id: 3,
      title: '성산일출봉의 비밀',
      category: 'nature',
      location: '성산일출봉',
      duration: '2.5시간',
      difficulty: 3,
      description: '해가 뜨는 곳에 숨겨진 보물 찾기',
      missions: 4,
      points: 250,
      completed: false,
      image: '/assets/sungsan.png',
      color: 'bg-orange-50 border-orange-200',
      premium: true
    },
    {
      id: 4,
      title: '제주 해녀의 하루',
      category: 'culture',
      location: '해녀박물관',
      duration: '1.5시간',
      difficulty: 1,
      description: '용감한 제주 해녀 할머니들의 이야기',
      missions: 3,
      points: 120,
      completed: false,
      image: '/assets/haenyeo.png',
      color: 'bg-cyan-50 border-cyan-200',
      premium: false
    },
    {
      id: 5,
      title: '감귤 농장 탐험',
      category: 'food',
      location: '감귤농장',
      duration: '2시간',
      difficulty: 1,
      description: '달콤한 제주 감귤의 비밀을 알아보자',
      missions: 4,
      points: 180,
      completed: false,
      image: '/assets/mandarin.png',
      color: 'bg-yellow-50 border-yellow-200',
      premium: false
    },
    {
      id: 6,
      title: '돌하르방의 비밀',
      category: 'culture',
      location: '돌하르방공원',
      duration: '1시간',
      difficulty: 2,
      description: '제주를 지키는 돌하르방들의 이야기',
      missions: 3,
      points: 140,
      completed: false,
      image: '/assets/dolhareubang.png',
      color: 'bg-gray-50 border-gray-200',
      premium: true
    }
  ];

  const filteredCourses = selectedCategory === 'all' 
    ? allCourses 
    : allCourses.filter(course => course.category === selectedCategory);

  const getDifficultyText = (level) => {
    switch(level) {
      case 1: return '쉬움';
      case 2: return '보통';
      case 3: return '어려움';
      default: return '쉬움';
    }
  };

  const getDifficultyColor = (level) => {
    switch(level) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-red-100 text-red-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>모험 코스 - 화랑이와 제주 모험</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-indigo-400 to-purple-500 p-4 text-white">
          <div className="flex items-center justify-between">
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
                <h1 className="text-xl font-bold">모험 코스</h1>
                <p className="text-sm opacity-90">레벨 {userLevel} 모험가</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">완료</div>
              <div className="text-lg font-bold">
                {allCourses.filter(c => c.completed).length}/{allCourses.length}
              </div>
            </div>
          </div>
        </div>

        {/* 캐릭터 격려 */}
        <div className="p-4 bg-indigo-50 border-b">
          <div className="flex items-start space-x-3">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-sm">
              <img src="/assets/hwarang.png" alt="화랑이" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="bg-white rounded-xl p-3 shadow-sm">
                <p className="text-gray-800 leading-relaxed">
                  "모험을 떠날 준비 됐어? <br/>
                  그럼 가보고 싶은 곳을 선택해줘!"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="p-4 bg-white border-b">
          <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <img 
                src={category.icon} 
                alt={category.name} 
                className="w-6 h-6 rounded-full bg-white shadow p-1 object-contain"
              />
              <span>{category.name}</span>
            </button>
          ))}
          </div>
        </div>

        {/* 코스 목록 */}
        <div className="p-4 space-y-4">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className={`rounded-2xl p-4 border-2 ${course.color} shadow-sm relative overflow-hidden`}
            >
              {course.premium && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  ⭐ 프리미엄
                </div>
              )}
              
              {course.completed && (
                <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                  <span>✅</span>
                  <span>완료</span>
                </div>
              )}

              <div className="flex items-start space-x-3 mt-6">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-sm flex items-center justify-center">
                  <img src={course.image} alt={course.title} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-2 flex items-center space-x-2">
                    <span>📍 {course.location}</span>
                    <span>•</span>
                    <span>⏱️ {course.duration}</span>
                  </p>
                  <p className="text-gray-700 text-sm mb-3 leading-relaxed">{course.description}</p>
                  
                  <div className="flex items-center space-x-3 mb-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(course.difficulty)}`}>
                      {getDifficultyText(course.difficulty)}
                    </span>
                    <span className="text-xs text-gray-600 flex items-center space-x-1">
                      <span>🎯</span>
                      <span>미션 {course.missions}개</span>
                    </span>
                    <span className="text-xs text-gray-600 flex items-center space-x-1">
                      <span>⭐</span>
                      <span>{course.points}P</span>
                    </span>
                  </div>

                  {/* TODO: 해당 코스 ID 기반으로 스토리/미션 API 연결 필요 */}
                  <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      if (course.premium) {
                        setShowSubscriptionModal(true);
                      } else {
                        router.push(`/story/${course.id}`);
                      }
                    }}
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors"
                    >
                      🎧 스토리 듣기
                    </button>
                    <button
                      onClick={() => {
                        // TODO: 사용자 구독 상태를 API로부터 가져와야 함
                        // 사용자가 구독을 하지 않은 경우 모달 표시
                        if (course.premium) {
                          setShowSubscriptionModal(true);
                        } else {
                          router.push(`/mission/${course.id}`);
                        }
                      }}
                      className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        course.premium && !course.completed
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {/* TODO: 프리미엄 여부 및 사용자 구독 상태 API로 검증 필요 */}
                      {course.premium && !course.completed ? '🔓 구독하기' : '🎯 미션 시작'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 네비게이션 */}
        <BottomNavigation />

        {showSubscriptionModal && (
        <SubscriptionModal onClose={() => setShowSubscriptionModal(false)} />
      )}
      </div>
    </div>
  );
}