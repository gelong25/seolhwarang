'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import BottomNavigation from '@/components/BottomNavigation';
import characters from '@/data/character.json';
import CourseModal from '@/components/CourseModal';
import { getDifficultyColor, getDifficultyText } from '@/utils/courseUtils';
import courses from '@/data/courses.json';

// Firebase Client 초기화 모듈에서 가져오기
import { auth, db } from '@/lib/firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function Home() {
  const [selectedCharacter, setSelectedCharacter] = useState('hwarang');
  const [showCharacterSelect, setShowCharacterSelect] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [completedMissions, setCompletedMissions] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  // 인증 상태 변화 감지하여 Firestore에서 프로필 읽기
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, 'users', user.uid));
        const profile = snap.exists() ? snap.data() : {};
        setSelectedCharacter(profile.selectedCharacter ?? 'hwarang');
        setUserPoints(profile.points ?? 0);
        setCompletedMissions(profile.completedMissions ?? 0);
      } else {
        // 비로그인 시 첫 방문으로 간주
        setShowCharacterSelect(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // 캐릭터 선택 시 Firestore 업데이트
  const handleCharacterSelect = async (characterId) => {
    setSelectedCharacter(characterId);
    setShowCharacterSelect(false);
    if (auth.currentUser) {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        selectedCharacter: characterId,
      });
    }
  };

  const currentCharacter =
    characters.find((c) => c.id === selectedCharacter) || characters[0];

  // 예시: 오늘의 코스 (ID가 1인 코스만)
  const todaysCourses = courses.filter((course) => course.id === 1);

  // 쿠폰 데이터
  const coupons = [
    { name: '제주 감귤 체험장', discount: '20%', points: 500 },
    { name: '해녀 박물관', discount: '무료입장', points: 300 },
    { name: '제주 전통차 카페', discount: '30%', points: 400 }
  ];

  // 캐릭터 선택 모달 렌더링
  if (showCharacterSelect) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Head>
          <title>화랑이와 제주 모험</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div className="max-w-md mx-auto bg-gradient-to-b from-sky-100 to-green-100 min-h-screen p-4">
          <div className="text-center mb-8">
            <div className="w-32 h-32 rounded-full mx-auto shadow-lg overflow-hidden bg-white">
              <img
                src={currentCharacter.image}
                alt={currentCharacter.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="mt-6 text-3xl font-bold text-gray-800">반가워!</h1>
            <p className="text-gray-600 mt-2 text-lg">
              함께 모험을 떠날 친구를 선택해줘!
            </p>
          </div>
          <div className="space-y-4">
            {characters.map((char) => (
              <div
                key={char.id}
                onClick={() => handleCharacterSelect(char.id)}
                className="bg-white rounded-2xl p-6 shadow-md border-2 border-gray-100 cursor-pointer hover:border-green-300 transition-transform active:scale-95"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20">
                    <img
                      src={char.image}
                      alt={char.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">
                      {char.name}
                    </h3>
                    <p className="text-gray-500 text-sm">{char.voice}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const audio = new Audio(`/assets/mp3/${char.id}0.mp3`);
                      audio.play();
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
                  >
                    들어보기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 메인 화면 렌더링
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <Head>
        <title>화랑이와 제주 모험</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 text-white flex items-center justify-between">
          <img src="/assets/logo.png" alt="로고" className="w-24 h-auto" />
          <button
            onClick={() => setShowCharacterSelect(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
          >
            변경
          </button>
        </div>

        {/* 포인트 및 현황 */}
        <div className="p-4 bg-white border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="text-lg font-bold text-gray-800">
                  {userPoints.toLocaleString()}P
                </p>
                <p className="text-sm text-gray-500">모험 포인트</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="text-lg font-bold text-gray-800">
                  {completedMissions.toLocaleString()}개
                </p>
                <p className="text-sm text-gray-500">완료한 미션</p>
              </div>
            </div>
          </div>
        </div>

        {/* 캐릭터 인사 */}
        <div className="p-4">
          <div className="bg-green-50 rounded-2xl p-6 mb-6 border border-green-200">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 self-start mt-6">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-white shadow-md">
                  <img
                    src={currentCharacter.image}
                    alt={currentCharacter.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <p className="text-gray-800 leading-relaxed text-base whitespace-pre-line">
                    {`"${currentCharacter.greeting}"`}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-center">
                  <button className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full text-sm font-medium hover:from-green-500 hover:to-blue-600 transition-all shadow-md">
                    {currentCharacter.name} 목소리로 듣기
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 오늘의 추천 코스 */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="text-2xl mr-2">🗺️</span>
              오늘의 추천 코스
            </h3>
            <div className="space-y-4">
              {todaysCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className={`rounded-2xl p-4 border-2 ${getDifficultyColor(
                    course.difficulty
                  )} shadow-sm hover:scale-95 cursor-pointer transition-transform duration-150`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-sm flex items-center justify-center">
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
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(
                            course.difficulty
                          )}`}
                        >
                          {getDifficultyText(course.difficulty)}
                        </span>
                        <span className="text-xs text-gray-600 flex items-center space-x-1">
                          <span>🎯</span>
                          <span>미션 {course.missions}개</span>
                        </span>
                        <span className="text-xs text-gray-600 flex items-center space-x-1">
                          <span>🏛️</span>
                          <span>{course.spots.length}개 장소</span>
                        </span>
                        <span className="text-xs text-gray-600 flex items-center space-x-1">
                          <span>⭐</span>
                          <span>{course.points}P</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 코스 상세 모달 */}
        {selectedCourse && (
          <CourseModal
            course={selectedCourse}
            onClose={() => setSelectedCourse(null)}
            setShowSubscriptionModal={setShowSubscriptionModal}
          />
        )}

        <BottomNavigation />
      </div>
    </div>
  );
}
