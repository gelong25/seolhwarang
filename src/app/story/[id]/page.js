//app/story/[id]/page.js
"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
// import { ChevronLeftIcon, PlayIcon, PauseIcon, VolumeXIcon, Volume2Icon } from '@heroicons/react/24/outline';

// 아이콘 컴포넌트 
const ChevronLeftIcon = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
  
  const PlayIcon = (props) => (
    <svg {...props} fill="currentColor" viewBox="0 0 20 20">
      <path d="M6 4l12 6-12 6V4z" />
    </svg>
  );
  
  const PauseIcon = (props) => (
    <svg {...props} fill="currentColor" viewBox="0 0 20 20">
      <path d="M6 4h4v12H6V4zm6 0h4v12h-4V4z" />
    </svg>
  );
  
  const VolumeXIcon = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 9v6h4l5 5V4l-5 5H9zM19 19l-6-6m0 0l6-6m-6 6l6 6" />
    </svg>
  );
  
  const Volume2Icon = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M11 5L6 9H2v6h4l5 4V5zm6.34 3.66a8 8 0 010 11.31m2.83-2.83a4 4 0 000-5.66" />
    </svg>
  );

export default function StoryPage({ params }) {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // 3분 예시
  const [storyData, setStoryData] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState('hwarang');

  // 미션 시작 핸들러 
  const handleStartMission = async (courseId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('로그인이 필요합니다.');
      return;
    }
  
    const res = await fetch('/api/select-course', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, selectedCourseId: courseId })
    });
  
    if (res.ok) {
      localStorage.setItem('selectedCourseId', courseId);
      router.push('/mission');
    } else {
      const data = await res.json();
      alert(data.error || '코스 선택 실패');
    }
  };

  // 스토리 데이터
  const stories = {
    1: {
      id: 1,
      title: '용머리해안의 전설',
      location: '용머리해안',
      image: '/assets/dragon.png',
      // TODO: 오디오 파일 URL을 백엔드에서 story 데이터에 포함시켜 전달받도록 수정
      audioUrl: '/audio/dragon-story.mp3',
      fullStory: `옛날 옛적, 제주도 서쪽 끝에 있는 용머리해안에는 신비로운 전설이 있었어요.

바다 깊은 곳에 사는 용왕님이 육지로 올라와 쉬던 곳이 바로 이곳이라고 해요. 용왕님은 매일 밤 이곳에 올라와 별을 보며 제주 사람들의 안전을 지켜주었답니다.

어느 날, 큰 태풍이 제주를 향해 다가오고 있었어요. 제주 사람들은 모두 걱정에 떨고 있었죠. 그때 용왕님이 나타나서 자신의 긴 꼬리로 태풍을 막아주었어요.

그 후로 사람들은 이곳을 '용머리해안'이라고 부르게 되었고, 지금도 용왕님의 머리와 꼬리 모양을 닮은 바위들을 볼 수 있답니다.

용왕님은 지금도 제주 바다를 지키고 있어요. 용머리해안에 가면 파도 소리 속에서 용왕님의 따뜻한 목소리를 들을 수 있을 거예요.`,
      characters: {
        hwarang: {
          name: '화랑이',
          voice: '상냥한 목소리',
          image: '/assets/hwarang.png'
        },
        dolhareubang: {
          name: '돌이방이',
          voice: '든든한 목소리',
          image: '/assets/doribangi.png'
        },
        tangerine: {
          name: '귤이',
          voice: '밝은 목소리',
          image: '/assets/gyuri.png'
        }
      }
    },

    2: {
      id: 2,
      title: '한라산 산신령 이야기',
      location: '한라산',
      image: '/assets/guardian.png',
      // TODO: 오디오 파일 URL을 백엔드에서 story 데이터에 포함시켜 전달받도록 수정
      audioUrl: '/audio/mountain-story.mp3',
      fullStory: `옛날 옛적, 한라산 꼭대기에는 산신령이 살고 있었어요.

산신령은 산을 오르는 사람들에게 용기와 건강을 주며 지켜주었답니다. 어느 날, 한 청년이 소원을 빌기 위해 산신령을 찾았는데...`,
      characters: {
        hwarang: {
          name: '화랑이',
          voice: '상냥한 목소리',
          image: '/assets/hwarang.png'
        },
        dolhareubang: {
          name: '돌이방이',
          voice: '든든한 목소리',
          image: '/assets/doribangi.png'
        },
        tangerine: {
          name: '귤이',
          voice: '밝은 목소리',
          image: '/assets/gyuri.png'
        }
      }
    },
    3: {
      id: 3,
      title: '성산일출봉의 비밀',
      location: '성산일출봉',
      image: '/assets/sungsan.png',
      audioUrl: '/audio/sunrise-story.mp3',
      fullStory: `성산일출봉에는 숨겨진 보물이 있다고 전해져요.
  
  해가 떠오를 때마다 바위 사이에서 빛나는 보석이 나타난다는 전설이 있답니다. 이 전설을 따라 많은 사람들이 성산일출봉을 찾아온다고 해요.`,
      characters: {
        hwarang: { name: '화랑이', voice: '상냥한 목소리', image: '/assets/hwarang.png' },
        dolhareubang: { name: '돌이방이', voice: '든든한 목소리', image: '/assets/doribangi.png' },
        tangerine: { name: '귤이', voice: '밝은 목소리', image: '/assets/gyuri.png' }
      }
    },
    4: {
      id: 4,
      title: '제주 해녀의 하루',
      location: '구좌읍 해녀마을',
      image: '/assets/haenyeo.png',
      audioUrl: '/audio/sunrise-story.mp3',
      fullStory: `제주의 해녀들은 바다의 여신으로부터 특별한 힘을 받았다고 전해집니다.

어린 시절부터 물질을 배우며 바다와 친구가 된 해녀들은 깊은 바다 속에서도 숨을 오래 참을 수 있는 능력을 갖추고 있어요.

어느 날, 해녀 할머니는 어린 손녀에게 물질을 가르치며 바닷속의 신비한 세계를 소개했답니다. 바닷속에는 빛나는 소라와 전복, 그리고 바다 요정들이 살고 있었어요.

할머니는 바닷속 보물들을 손녀와 함께 찾으며, 바다의 소중함과 자연을 아끼는 마음을 전해주었답니다.

지금도 해녀들은 파도 소리와 함께 살아가며 제주 바다를 지키고 있어요.`,
      characters: {
        hwarang: { name: '화랑이', voice: '상냥한 목소리', image: '/assets/hwarang.png' },
        dolhareubang: { name: '돌이방이', voice: '든든한 목소리', image: '/assets/doribangi.png' },
        tangerine: { name: '귤이', voice: '밝은 목소리', image: '/assets/gyuri.png' }
      }
    },
    5: {
      id: 5,
      title: '감귤 농장 탐험',
      location: '서귀포 감귤농장',
      image: '/assets/mandarin.png',
      audioUrl: '/audio/mandarin-story.mp3',
      fullStory: `제주의 감귤 농장에는 햇빛 요정이 살고 있다고 전해집니다.
    
    햇빛 요정은 매일 아침 감귤나무 사이를 날아다니며 달콤한 햇살을 나눠주지요. 그 덕분에 제주 감귤은 더욱 달고 향긋하게 자랄 수 있었어요.
    
    어느 날, 농장 주인은 작은 아이들에게 감귤 따는 법과 감귤이 자라는 과정을 알려주었답니다. 아이들은 신이 나서 감귤을 따고, 맛을 보며 웃음을 멈출 수 없었어요.
    
    또한, 감귤로 만든 청과 디저트를 함께 만들어 보면서 자연의 소중함과 농부들의 정성을 배웠답니다.
    
    제주 감귤은 단순한 과일이 아니라, 제주 사람들의 사랑과 자연의 기적이 담긴 보물이랍니다.`,
      characters: {
        hwarang: {
          name: '화랑이',
          voice: '상냥한 목소리',
          image: '/assets/hwarang.png'
        },
        dolhareubang: {
          name: '돌이방이',
          voice: '든든한 목소리',
          image: '/assets/doribangi.png'
        },
        tangerine: {
          name: '귤이',
          voice: '밝은 목소리',
          image: '/assets/gyuri.png'
        }
      }
    }
    
  };

  useEffect(() => {
    const storyId = params?.id || '1';
    // TODO: storyId 기반으로 백엔드에서 스토리 데이터 fetch 필요
    setStoryData(stories[storyId]);
    
    // 선택된 캐릭터 가져오기
    // TODO: 백엔드 또는 사용자 세션에서 캐릭터 정보 조회
    const character = localStorage.getItem('selectedCharacter') || 'hwarang';
    setSelectedCharacter(character);
  }, [params]);

  // TODO: 실제 오디오 객체 생성 및 컨트롤 필요 
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (currentTime / duration) * 100;

  if (!storyData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">스토리를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const currentCharacter = storyData.characters[selectedCharacter];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <Head>
        <title>{storyData.title} - 화랑이와 제주 모험</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 text-white">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <div>
              <h1 className="font-bold text-lg">{storyData.title}</h1>
              <p className="text-sm opacity-90">{storyData.location}</p>
            </div>
          </div>
        </div>

        {/* 스토리 이미지 */}
        <div className="relative h-64 bg-gradient-to-b from-blue-100 to-green-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden">
              <img 
                src={storyData.image} 
                alt={storyData.title}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* 캐릭터 정보 */}
        <div className="p-4 bg-white border-b">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
              <img 
                src={currentCharacter.image} 
                alt={currentCharacter.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium text-gray-800">{currentCharacter.name}의 목소리로</p>
              <p className="text-sm text-gray-600">{currentCharacter.voice}</p>
            </div>
          </div>
        </div>

        {/* 오디오 플레이어 */}
        <div className="p-6 bg-white border-b">
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-6">
            <button
              onClick={toggleMute}
              className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {isMuted ? (
                <VolumeXIcon className="w-6 h-6 text-gray-600" />
              ) : (
                <Volume2Icon className="w-6 h-6 text-gray-600" />
              )}
            </button>

            <button
              onClick={togglePlay}
              className="p-4 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white hover:from-green-500 hover:to-blue-600 transition-all duration-200 shadow-lg"
            >
              {isPlaying ? (
                <PauseIcon className="w-8 h-8" />
              ) : (
                <PlayIcon className="w-8 h-8" />
              )}
            </button>

            <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <span className="text-xl">⚙️</span>
            </button>
          </div>
        </div>

        {/* 스토리 텍스트 */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-2xl mr-2">📖</span>
            스토리 내용
          </h3>
          
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="prose prose-sm max-w-none">
              {storyData.fullStory.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-relaxed mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 액션 버튼 */}
        <div className="p-4 bg-white border-t">
          <div className="flex space-x-3">
            <button
              onClick={() => handleStartMission(course.id)}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl font-medium hover:from-green-500 hover:to-blue-600 transition-all duration-200 shadow-md"
            >
              🎯 미션 시작하기
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              🏠 홈으로
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}