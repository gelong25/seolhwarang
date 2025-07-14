"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Head from 'next/head';
import BottomNavigation from '@/components/BottomNavigation';
import Header from '@/components/Header';
import characters from '@/data/character.json';
import missions from '@/data/missions.json';
import courses from '@/data/courses.json';

export default function Mission() {
  const router = useRouter();
  const params = useParams();
  const courseId = parseInt(params.id);
  const [currentMission, setCurrentMission] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [course, setCourse] = useState(null);
  const [courseMissions, setCourseMissions] = useState([]);

  useEffect(() => {
    const selected = courses.find(c => c.id === courseId);

    if (!selected) {
      alert("존재하지 않는 코스입니다.");
      router.push('/course');
      return;
    }

    if (selected.premium) {
      alert("프리미엄 코스입니다. 구독 후 이용해주세요.");
      router.push('/course');
      return;
    }

    const matchedMissions = missions.filter(m => m.courseId === courseId);

    if (matchedMissions.length === 0) {
      alert("해당 코스에 등록된 미션이 없습니다.");
      router.push('/course');
      return;
    }

    setCourse(selected);
    setCourseMissions(matchedMissions);
  }, [courseId, router]);

  const mission = courseMissions[currentMission];

  const selectedCharacterId = typeof window !== 'undefined'
    ? localStorage.getItem('selectedCharacter') || 'hwarang'
    : 'hwarang';

  const currentCharacter = characters.find(c => c.id === selectedCharacterId);

  const handleMissionComplete = () => {
    setShowSuccess(true);
    setTimeout(() => {
      if (currentMission < courseMissions.length - 1) {
        setCurrentMission(currentMission + 1);
        setShowSuccess(false);
      } else {
        router.push('/');
      }
    }, 2000);
  };

  if (!course || courseMissions.length === 0 || !mission) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-xl font-bold text-gray-700 mb-4">미션이 없습니다</h2>
        <p className="text-gray-500">먼저 코스를 선택해주세요.</p>
        <button
          onClick={() => router.push('/course')}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-xl"
        >
          코스 선택하러 가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>미션 수행 - {course.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="max-w-md mx-auto bg-white min-h-screen">
        <Header
          title={`미션 수행 - ${course.title}`}
          subtitle={`${currentMission + 1} / ${courseMissions.length}`}
          gradient="from-purple-400 to-pink-500"
        />

        {/* 진행 바 */}
        <div className="p-4 bg-white border-b">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">진행률</span>
            <span className="text-sm font-medium text-gray-800">
              {Math.round(((currentMission + 1) / courseMissions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentMission + 1) / courseMissions.length) * 100}%` }}
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
                  "{course.title} 코스의 {currentMission + 1}번째 미션이야! 화이팅! 🎉"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 미션 본문 (기존 UI 그대로) */}
        <div className="p-4 flex-1">
          {!showSuccess ? (
            <div className="text-center">
              <div className="text-8xl mb-6">{mission.icon}</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">{mission.title}</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">{mission.description}</p>
              <div className="mb-8">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-50 rounded-full border border-yellow-200 cursor-default">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-sm font-medium text-gray-700">
                    {mission.points}P 획득 가능
                  </span>
                </div>
              </div>

              {/* 미션 타입별 버튼 */}
              {mission.type === 'photo' && (
                <button
                  onClick={handleMissionComplete}
                  className="w-full px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600"
                >
                  📷 사진 미션 완료
                </button>
              )}
              {mission.type === 'stamp' && (
                <button
                  onClick={handleMissionComplete}
                  className="w-full px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600"
                >
                  📍 스탬프 받기
                </button>
              )}
              {mission.type === 'quiz' && (
                <button
                  onClick={handleMissionComplete}
                  className="w-full px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600"
                >
                  ❓ 퀴즈 완료
                </button>
              )}
              {mission.type === 'activity' && (
                <button
                  onClick={handleMissionComplete}
                  className="w-full px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600"
                >
                  🎯 활동 완료
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-8xl mb-6">🎉</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">미션 완료!</h2>
              <p className="text-gray-600 mb-6">
                <span className="font-medium text-purple-600">+{mission.points}P</span> 획득!
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
