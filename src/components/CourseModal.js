'use client';

import { useRouter } from 'next/navigation';
import { getDifficultyColor, getDifficultyText } from '@/utils/courseUtils';


const CourseModal = ({ course, onClose, setShowSubscriptionModal }) => {
    const router = useRouter();
    
      if (!course) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* 모달 헤더 */}
          <div className="relative">
            <div className={`p-6 rounded-t-2xl ${course.color}`}>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-xl bg-white shadow-sm flex items-center justify-center">
                  <img src={course.image} alt={course.title} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800 mb-1">{course.title}</h2>
                  <p className="text-gray-600 text-sm">📍 {course.location}</p>
                  <p className="text-gray-600 text-sm">⏱️ {course.duration}</p>
                </div>
              </div>
              
              {course.premium && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  ⭐ 프리미엄
                </div>
              )}
            </div>
          </div>

          {/* 모달 내용 */}
          <div className="p-6">
            {/* 스토리 */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">📖 이야기</h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700 leading-relaxed">{course.story}</p>
              </div>
            </div>

            {/* 하이라이트 */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">✨ 코스 하이라이트</h3>
              <div className="grid grid-cols-2 gap-2">
                {course.highlights.map((highlight, index) => (
                  <div key={index} className="bg-indigo-50 rounded-lg p-3 text-sm text-gray-700">
                    {highlight}
                  </div>
                ))}
              </div>
            </div>

            {/* 방문 장소 */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">📍 방문 장소 ({course.spots.length}곳)</h3>
              <div className="space-y-3">
                {course.spots.map((spot, index) => (
                  <div key={index} className="border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{spot.name}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          spot.type === '관광지' ? 'bg-blue-100 text-blue-700' :
                          spot.type === '체험' ? 'bg-green-100 text-green-700' :
                          spot.type === '음식' ? 'bg-orange-100 text-orange-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {spot.type}
                        </span>
                        <span className="text-xs text-gray-500">{spot.duration}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{spot.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 코스 정보 */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">📊 코스 정보</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`text-sm px-2 py-1 rounded-full text-black font-medium ${getDifficultyColor(course.difficulty)}`}>
                    {getDifficultyText(course.difficulty)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">난이도</p>
                </div>
                <div className="text-center">
                  <div className="text-sm bg-gray-100 px-2 py-1 rounded-full font-medium text-gray-700">
                    미션 {course.missions}개
                  </div>
                  <p className="text-xs text-gray-500 mt-1">미션 수</p>
                </div>
                <div className="text-center">
                  <div className="text-sm bg-yellow-100 px-2 py-1 rounded-full font-medium text-black">
                    {course.points}P
                  </div>
                  <p className="text-xs text-gray-500 mt-1">획득 포인트</p>
                </div>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex space-x-3">
              <button 
                onClick={() => {
                  if (course.premium) {
                    setShowSubscriptionModal(true);
                  } else {
                    router.push(`/story/${course.id}`);
                  }
                }}
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
              >
                🎧 스토리 듣기
              </button>
              <button
                onClick={async () => {
                  if (course.premium) {
                    setShowSubscriptionModal(true);
                    return;
                  }
                
                  const stored = localStorage.getItem('user');
                  if (!stored) {
                    alert('로그인이 필요합니다');
                    return;
                  }
                
                  const storedUser = localStorage.getItem('user');
                  if (!storedUser) {
                    alert('로그인이 필요합니다');
                    return;
                  }

                  const user = JSON.parse(storedUser);
                  const userId = user.id;

                  // 선택한 코스 ID 저장
                  user.selectedCourseId = course.id;
                  localStorage.setItem('user', JSON.stringify(user));
                  localStorage.setItem('selectedCourseId', String(course.id));

                  // 서버에도 저장
                  const res = await fetch('/api/select-course', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, selectedCourseId: course.id }),
                  });

                  if (res.ok) {
                    router.push(`/mission/${course.id}`);
                  } else {
                    const data = await res.json();
                    alert(data.error || '코스 선택 실패');
                  }
                }}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
                  course.premium && !course.completed
                    ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {course.premium && !course.completed ? '🔓 구독하기' : '🎯 미션 시작'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default CourseModal;