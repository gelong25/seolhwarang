import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import BottomNavigation from '@/components/BottomNavigation';

export default function Home() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [showCharacterSelect, setShowCharacterSelect] = useState(false);
  const [userPoints, setUserPoints] = useState(1250);
  const [completedMissions, setCompletedMissions] = useState(3);
  const router = useRouter();

  useEffect(() => {
    // 첫 방문 체크
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShowCharacterSelect(true);
    } else {
      setSelectedCharacter(localStorage.getItem('selectedCharacter') || 'hwarang');
    }
  }, []);

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
    localStorage.setItem('selectedCharacter', character);
    localStorage.setItem('hasVisited', 'true');
    setShowCharacterSelect(false);
  };

  const characters = [
    { id: 'hwarang', name: '화랑이', emoji: '/assets/hwarang.png', voice: '상냥한 목소리' },
    { id: 'dolhareubang', name: '돌이방이', emoji: '/assets/doribangi.png', voice: '든든한 목소리' },
    { id: 'tangerine', name: '귤이', emoji: '/assets/gyuri.png', voice: '밝은 목소리' }
  ];

  const todaysCourses = [
    {
      id: 1,
      title: '용머리해안의 전설',
      location: '용머리해안',
      story: '옛날 옛적, 용왕님의 이야기가...',
      difficulty: '쉬움',
      points: 100,
      missions: 3,
      image: '/assets/dragon.png',
      color: 'bg-blue-50 border-blue-200'
    },
    // {
    //   id: 2,
    //   title: '한라산 산신령 이야기',
    //   location: '한라산',
    //   story: '높은 산에 사는 친근한 산신령...',
    //   difficulty: '보통',
    //   points: 150,
    //   missions: 4,
    //   image: '⛰️',
    //   color: 'bg-green-50 border-green-200'
    // },
    // {
    //   id: 3,
    //   title: '성산일출봉의 비밀',
    //   location: '성산일출봉',
    //   story: '해가 뜨는 곳에 숨겨진 보물...',
    //   difficulty: '어려움',
    //   points: 200,
    //   missions: 5,
    //   image: '🌅',
    //   color: 'bg-orange-50 border-orange-200'
    // }
  ];

  const coupons = [
    { name: '제주 감귤 체험장', discount: '20%', points: 500 },
    { name: '해녀 박물관', discount: '무료입장', points: 300 },
    { name: '제주 전통차 카페', discount: '30%', points: 400 }
  ];

  if (showCharacterSelect) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-green-100 p-4">
        <Head>
          <title>화랑이와 제주 모험</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        
        <div className="max-w-md mx-auto pt-20">
          <div className="text-center mb-8">
            <div className="w-32 h-32 rounded-full flex items-center justify-center text-6xl mx-auto shadow-lg overflow-hidden bg-white">
              <img src="/assets/hwarang.png" alt="화랑이" className="w-full h-full object-cover" />
            </div>
            <h1 className="mt-6 text-3xl font-bold text-gray-800">반가워!</h1>
            <p className="text-gray-600 mt-2 text-lg">함께 모험을 떠날 친구를 선택해줘!</p>
          </div>

          <div className="space-y-4">
            {characters.map((char) => (
              <div
                key={char.id}
                onClick={() => handleCharacterSelect(char.id)}
                className="bg-white rounded-2xl p-6 shadow-md border-2 border-gray-100 active:scale-95 transition-transform cursor-pointer hover:border-green-300"
              >
                <div className="flex items-center space-x-4">
                <div className="text-4xl">
                  {char.emoji.startsWith('/') ? (
                    <img src={char.emoji} alt={char.name} className="w-25 h-25 object-cover" />
                  ) : (
                    char.emoji
                  )}
                </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">{char.name}</h3>
                    <p className="text-gray-500 text-sm">{char.voice}</p>
                  </div>
                  <button className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors">
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

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
      <Head>
        <title>화랑이와 제주 모험</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-md">
                <img src="/assets/hwarang.png" alt="화랑이" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="font-bold text-lg">화랑이</h2>
                <p className="text-sm opacity-90">모험 가이드</p>
              </div>
            </div>
            <button
              onClick={() => setShowCharacterSelect(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
            >
              변경
            </button>
          </div>
        </div>

        {/* 포인트 및 현황 */}
        <div className="p-4 bg-white border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="text-lg font-bold text-gray-800">{userPoints.toLocaleString()}P</p>
                <p className="text-sm text-gray-500">모험 포인트</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="text-lg font-bold text-gray-800">{completedMissions}개</p>
                <p className="text-sm text-gray-500">완료한 미션</p>
              </div>
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="p-4">
          {/* 캐릭터 인사 */}
          <div className="bg-green-50 rounded-2xl p-6 mb-6 border border-green-200 relative">
            <div className="flex items-center space-x-4">
              {/* 캐릭터 이미지 */}
              <div className="flex-shrink-0 self-start mt-6">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-white shadow-md">
                  <img src="/assets/hwarang.png" alt="화랑이" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* 말풍선 + 버튼 */}
              <div className="flex-1">
                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <p className="text-gray-800 leading-relaxed text-base">
                    "안녕~ 나는 화랑이야! <br/> 
                    오늘도 제주의 신비로운 이야기를 들으러 갈까? <br/>
                    새로운 모험이 기다리고 있어!"
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-center">
                  <button className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full text-sm font-medium hover:from-green-500 hover:to-blue-600 transition-all duration-200 shadow-md">
                    🎵 화랑이 목소리로 듣기
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
                  className={`rounded-2xl p-4 border-2 ${course.color} shadow-sm`}
                >
                  <div className="flex items-start space-x-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-sm flex items-center justify-center">
                    <img src={course.image} alt={course.title} className="w-full h-full object-contain" />
                  </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-800">{course.title}</h4>
                      <p className="text-gray-600 text-sm mb-2">{course.location}</p>
                      <p className="text-gray-700 text-sm mb-3 leading-relaxed">{course.story}</p>
                      
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center space-x-4">
                          <span className="text-xs px-2 py-1 bg-white rounded-full text-gray-600">
                            {course.difficulty}
                          </span>
                          <span className="text-xs text-gray-600">
                            미션 {course.missions}개
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-sm font-medium text-gray-700">
                            {course.points}P
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                      <button 
                          onClick={() => router.push(`/story/${course.id}`)}
                          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors"
                        >
                          🎧 스토리 듣기
                        </button>
                        <button
                          onClick={() => router.push(`/mission/${course.id}`)}
                          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors"
                        >
                          🎯 미션 시작
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 네비게이션 */}
        <BottomNavigation/>
      </div>
    </div>
  );
}