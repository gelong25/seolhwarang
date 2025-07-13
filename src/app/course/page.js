//app/course/route.js
"use client";

import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import BottomNavigation from '@/components/BottomNavigation';
import SubscriptionModal from '@/components/SubscriptionModal';
import characters from '@/data/character.json';
import CourseModal from '@/components/CourseModal';
import { getDifficultyColor, getDifficultyText } from '@/utils/courseUtils';
import courses from '@/data/courses.json';
import Header from '@/components/Header';

export default function Courses() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
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

  // const allCourses = courses.map(course => ({
  //   ...course,
  //   color: getDifficultyColor(course.difficulty),
  //   difficultyText: getDifficultyText(course.difficulty)
  // }));

  const allCourses = [
    {
      id: 1,
      title: '용머리해안의 전설',
      category: 'legend',
      location: '용머리해안 일대',
      duration: '4-5시간',
      difficulty: 1,
      description: '바다 속 용왕님의 신비로운 이야기와 함께하는 서귀포 해안 여행',
      missions: 5,
      points: 150,
      completed: true,
      image: '/assets/dragon.png',
      color: 'bg-blue-50 border-blue-200',
      premium: false,
      spots: [
        { name: '용머리해안', type: '관광지', description: '용이 바다로 들어가는 모습을 닮은 절벽', duration: '60분' },
        { name: '산방산', type: '관광지', description: '용왕의 보물이 숨겨진 신비로운 산', duration: '90분' },
        { name: '해녀박물관', type: '체험', description: '용왕님과 해녀들의 특별한 관계 배우기', duration: '45분' },
        { name: '용머리해안 카페거리', type: '휴식', description: '바다를 보며 제주 감귤차 마시기', duration: '30분' }
      ],
      story: '옛날 용왕님이 육지로 올라와 아름다운 제주 처녀와 사랑에 빠졌다는 전설이 있어요. 용왕님은 처녀를 위해 바다에서 가장 아름다운 보물들을 가져다주었지만...',
      highlights: ['🌊 용머리해안 절벽 트레킹', '🏔️ 산방산 전망대', '🤿 해녀 문화 체험', '☕ 오션뷰 카페 투어']
    },
    {
      id: 2,
      title: '한라산 산신령 이야기',
      category: 'legend',
      location: '한라산 국립공원',
      duration: '6-7시간',
      difficulty: 2,
      description: '높은 산에 사는 친근한 산신령과의 만남, 한라산 트레킹 코스',
      missions: 6,
      points: 200,
      completed: false,
      image: '/assets/guardian.png',
      color: 'bg-green-50 border-green-200',
      premium: false,
      spots: [
        { name: '어리목 탐방로', type: '트레킹', description: '산신령이 처음 나타나는 신비로운 숲길', duration: '120분' },
        { name: '윗세오름', type: '관광지', description: '산신령의 정원이라 불리는 고원 습지', duration: '90분' },
        { name: '한라산 자연휴양림', type: '체험', description: '산신령이 지켜주는 치유의 숲 체험', duration: '60분' },
        { name: '제주허브동산', type: '체험', description: '산신령이 키우는 약초 배우기', duration: '45분' }
      ],
      story: '한라산 깊은 곳에는 제주를 천 년 동안 지켜온 착한 산신령이 살고 있어요. 산신령은 길을 잃은 사람들을 도와주고, 아픈 사람들에게 약초를 나누어주곤 했답니다.',
      highlights: ['🥾 한라산 트레킹', '🌿 치유의 숲 체험', '🌺 약초 체험', '🍃 고원 습지 탐방']
    },
    {
      id: 3,
      title: '성산일출봉의 비밀',
      category: 'nature',
      location: '성산일출봉 일대',
      duration: '5-6시간',
      difficulty: 3,
      description: '해가 뜨는 곳에 숨겨진 보물 찾기, 성산 해안 완전 정복',
      missions: 7,
      points: 250,
      completed: false,
      image: '/assets/sungsan.png',
      color: 'bg-orange-50 border-orange-200',
      premium: true,
      spots: [
        { name: '성산일출봉', type: '관광지', description: '일출의 여신이 숨겨둔 보물 찾기', duration: '120분' },
        { name: '섭지코지', type: '관광지', description: '해안 절벽 위 신비로운 등대', duration: '90분' },
        { name: '성산포 해녀 체험', type: '체험', description: '바다 속 보물 찾기 체험', duration: '60분' },
        { name: '일출랜드', type: '체험', description: '조각 공원에서 보물 지도 퍼즐 풀기', duration: '45분' },
        { name: '성산 해안도로', type: '관광지', description: '드라이브 코스로 숨겨진 명소 발견', duration: '30분' }
      ],
      story: '성산일출봉 정상에는 일출의 여신이 인간 세상을 위해 숨겨둔 특별한 보물이 있다고 해요. 하지만 그 보물은 진정한 용기를 가진 사람만이 찾을 수 있답니다.',
      highlights: ['🌅 일출봉 등반', '🌊 해녀 체험', '🚗 해안도로 드라이브', '🎨 조각공원 탐방']
    },
    {
      id: 4,
      title: '제주 해녀의 하루',
      category: 'culture',
      location: '구좌읍 해녀마을',
      duration: '4-5시간',
      difficulty: 1,
      description: '용감한 제주 해녀 할머니들의 이야기, 해녀 문화 완전 체험',
      missions: 5,
      points: 120,
      completed: false,
      image: '/assets/haenyeo.png',
      color: 'bg-cyan-50 border-cyan-200',
      premium: false,
      spots: [
        { name: '해녀박물관', type: '체험', description: '해녀 할머니들의 삶과 문화 배우기', duration: '90분' },
        { name: '구좌읍 해녀마을', type: '체험', description: '현직 해녀와 함께하는 물질 체험', duration: '120분' },
        { name: '월정리 해변', type: '관광지', description: '해녀들이 작업하는 아름다운 해변', duration: '60분' },
        { name: '해녀의 집', type: '음식', description: '해녀가 직접 잡은 해산물 맛보기', duration: '45분' }
      ],
      story: '제주 해녀들은 바다의 여신으로부터 특별한 힘을 받아 깊은 바다 속에서도 숨을 오래 참을 수 있어요. 해녀 할머니들의 용기와 지혜가 담긴 이야기를 들어보세요.',
      highlights: ['🤿 해녀 물질 체험', '🏛️ 해녀박물관 투어', '🌊 월정리 해변 산책', '🦐 신선한 해산물 맛보기']
    },
    {
      id: 5,
      title: '감귤 농장 탐험',
      category: 'food',
      location: '서귀포 감귤농장',
      duration: '3-4시간',
      difficulty: 1,
      description: '달콤한 제주 감귤의 비밀을 알아보자, 농장 체험과 요리 클래스',
      missions: 4,
      points: 180,
      completed: false,
      image: '/assets/mandarin.png',
      color: 'bg-yellow-50 border-yellow-200',
      premium: false,
      spots: [
        { name: '감귤농장', type: '체험', description: '감귤 따기 체험과 농장 주인 이야기', duration: '90분' },
        { name: '감귤 박물관', type: '관광지', description: '제주 감귤의 역사와 품종 배우기', duration: '45분' },
        { name: '감귤 요리 클래스', type: '체험', description: '감귤 청 만들기와 감귤 디저트 만들기', duration: '60분' },
        { name: '오설록 티뮤지엄', type: '관광지', description: '감귤차와 녹차의 만남', duration: '30분' }
      ],
      story: '제주 감귤에는 햇빛 요정이 살고 있어요. 요정이 감귤에 달콤함을 불어넣어 주기 때문에 제주 감귤이 세상에서 가장 맛있답니다.',
      highlights: ['🍊 감귤 따기 체험', '👨‍🍳 감귤 요리 클래스', '🫖 감귤차 시음', '📚 감귤 박물관 견학']
    },
    {
      id: 6,
      title: '돌하르방의 비밀',
      category: 'culture',
      location: '제주시 돌하르방공원',
      duration: '3-4시간',
      difficulty: 2,
      description: '제주를 지키는 돌하르방들의 이야기, 제주 전통 문화 체험',
      missions: 5,
      points: 140,
      completed: false,
      image: '/assets/dolhareubang.png',
      color: 'bg-gray-50 border-gray-200',
      premium: true,
      spots: [
        { name: '돌하르방공원', type: '관광지', description: '다양한 돌하르방들의 표정과 의미 알아보기', duration: '60분' },
        { name: '제주민속촌', type: '체험', description: '돌하르방이 지키는 전통 마을 체험', duration: '90분' },
        { name: '돌하르방 만들기 체험', type: '체험', description: '나만의 미니 돌하르방 만들기', duration: '45분' },
        { name: '제주 전통시장', type: '관광지', description: '돌하르방이 지키는 옛날 시장 탐방', duration: '30분' }
      ],
      story: '돌하르방은 제주의 수호신으로, 마을을 지키고 악귀를 쫓아내는 역할을 해요. 각각의 돌하르방마다 다른 표정과 성격을 가지고 있답니다.',
      highlights: ['🗿 돌하르방 조각 체험', '🏘️ 전통 마을 탐방', '🎭 민속 공연 관람', '🛍️ 전통시장 투어']
    }
  ];

  const filteredCourses = selectedCategory === 'all' 
    ? allCourses 
    : allCourses.filter(course => course.category === selectedCategory);

  // 캐릭터 선택 로직
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
            <img src={currentCharacter.image} alt={currentCharacter.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="bg-white rounded-xl p-3 shadow-sm">
                <p className="text-gray-800 leading-relaxed">
                  "모험을 떠날 준비 됐어? <br/>
                  카드를 눌러서 자세한 정보를 확인해보고 가고 싶은 곳을 선택해줘!"
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
              className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
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
              onClick={() => setSelectedCourse(course)}
              className={`rounded-2xl p-4 border-2 ${course.color} shadow-sm relative overflow-hidden cursor-pointer hover:shadow-md transition-transform duration-150 ease-in-out active:scale-95`}
            >
              {course.premium && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  ⭐ 프리미엄
                </div>
              )}
              
              {/* 완료된 코스 표시   */}
              {/* {course.completed && (
                <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                  <span>✅</span>
                  <span>완료</span>
                </div>
              )} */}

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
                      <span>🏛️</span>
                      <span>{course.spots.length}개 장소</span>
                    </span>
                    <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 flex items-center space-x-1">
                      <span>⭐</span>
                      <span>{course.points}P</span>
                    </span>
                  </div>
                  </div>
                  
                </div>
              </div>
            </div>
          ))}
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