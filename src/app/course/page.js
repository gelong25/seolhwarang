'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import BottomNavigation from '@/components/BottomNavigation';
import SubscriptionModal from '@/components/SubscriptionModal';
import CourseModal from '@/components/CourseModal';
import Header from '@/components/Header';
import characters from '@/data/character.json';
import { getDifficultyColor, getDifficultyText } from '@/utils/courseUtils';

// Firebase Client 초기화
import { db } from '@/lib/firebaseClient';
import { collection, getDocs } from 'firebase/firestore';

export default function Courses() {
  const router = useRouter();

  // Firestore에서 불러온 코스 데이터
  const [courses, setCourses] = useState([]);

  // UI 상태
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [userLevel, setUserLevel] = useState(3);

  // 페이지 진입 시 Firestore에서 courses 컬렉션 로드
  useEffect(() => {
    async function loadCourses() {
      const snap = await getDocs(collection(db, 'courses'));
      setCourses(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    loadCourses();
  }, []);

  // 모달 열릴 때 스크롤 방지
  useEffect(() => {
    if (selectedCourse || showSubscriptionModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedCourse, showSubscriptionModal]);

  // 카테고리 목록 (고정)
  const categories = [
    { id: 'all', name: '전체', icon: '/assets/all_icon.png' },
    { id: 'legend', name: '전설', icon: '/assets/dragon_icon.png' },
    { id: 'nature', name: '자연', icon: '/assets/nature_icon.png' },
    { id: 'culture', name: '문화', icon: '/assets/culture_icon.png' },
    { id: 'food', name: '음식', icon: '/assets/food_icon.png' }
  ];

  // difficulty 정보 붙이기
  const allCourses = courses.map(course => ({
    ...course,
    difficultyColor: getDifficultyColor(course.difficulty),
    difficultyText: getDifficultyText(course.difficulty)
  }));

  // 카테고리 필터링
  const filteredCourses = selectedCategory === 'all'
    ? allCourses
    : allCourses.filter(c => c.category === selectedCategory);

  // 로컬스토리지에서 선택된 캐릭터
  const selectedCharacterId = typeof window !== 'undefined'
    ? localStorage.getItem('selectedCharacter') || 'hwarang'
    : 'hwarang';
  const currentCharacter = characters.find(c => c.id === selectedCharacterId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>모험 코스 - 화랑이와 제주 모험</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="pb-24 max-w-md mx-auto bg-white min-h-screen">
        {/* 헤더 */}
        <Header
          title="모험 코스"
          subtitle={`레벨 ${userLevel} 모험가`}
          gradient="from-indigo-400 to-purple-500"
        />

        {/* 캐릭터 격려 */}
        <div className="p-4 bg-indigo-50 border-b">
          <div className="flex items-start space-x-3">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-sm">
              <img
                src={currentCharacter.image}
                alt={currentCharacter.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="bg-white rounded-xl p-3 shadow-sm">
                <p className="text-gray-800 leading-relaxed">
                  "모험을 떠날 준비 됐어?<br/>
                  카드를 눌러서 자세한 정보를 확인해보고<br/>
                  가고 싶은 곳을 선택해줘!"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="p-4 bg-white border-b">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <img
                  src={cat.icon}
                  alt={cat.name}
                  className="w-6 h-6 rounded-full bg-white shadow p-1 object-contain"
                />
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 코스 목록 */}
        <div className="p-4 space-y-4">
          {filteredCourses.map(course => {
            const [bgColorClass, borderColorClass] = course.color.split(' ');
            return (
              <div
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className={`rounded-2xl p-4 border-2 ${bgColorClass} ${borderColorClass} shadow-sm relative overflow-hidden cursor-pointer hover:shadow-md transition-transform duration-150 ease-in-out active:scale-95`}
              >
                {course.premium && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    ⭐ 프리미엄
                  </div>
                )}
                <div className="flex items-start space-x-3 mt-6">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm flex items-center justify-center">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 mb-1">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 flex items-center space-x-2">
                      <span>📍 {course.location}</span>
                      <span>•</span>
                      <span>⏱️ {course.duration}</span>
                    </p>
                    <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                      {course.description}
                    </p>
                    <div className="flex items-center space-x-3 mb-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium text-black ${course.difficultyColor}`}>
                        {course.difficultyText}
                      </span>
                      <span className="text-xs text-gray-600 flex items-center space-x-1">
                        <span>🎯</span><span>미션 {course.missions}개</span>
                      </span>
                      <span className="text-xs text-gray-600 flex items-center space-x-1">
                        <span>🏛️</span><span>{course.spots.length}개 장소</span>
                      </span>
                      <span className="text-xs text-gray-600 flex items-center space-x-1">
                        <span>⭐</span><span>{course.points}P</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 하단 네비게이션 */}
        <BottomNavigation />

        {/* 코스 상세 모달 */}
        {selectedCourse && (
          <CourseModal
            course={selectedCourse}
            onClose={() => setSelectedCourse(null)}
            setShowSubscriptionModal={setShowSubscriptionModal}
          />
        )}

        {/* 구독 모달 */}
        {showSubscriptionModal && (
          <SubscriptionModal onClose={() => setShowSubscriptionModal(false)} />
        )}
      </div>
    </div>
  );
}
