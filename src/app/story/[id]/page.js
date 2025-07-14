"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';

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
  const [stories, setStories] = useState([]);

  // 스토리 데이터 로드
  useEffect(() => {
    const loadStories = async () => {
      try {
        // story.json 파일을 읽어오기
        const fileData = await window.fs.readFile('story.json', { encoding: 'utf8' });
        const storiesData = JSON.parse(fileData);
        setStories(storiesData);
        
        // 현재 코스 ID에 해당하는 스토리 찾기
        const courseId = parseInt(params?.id || '1');
        const currentStory = storiesData.find(story => story.courseId === courseId);
        
        if (currentStory) {
          // JSON 데이터를 기존 스토리 형태로 변환
          const formattedStory = {
            id: currentStory.courseId,
            title: currentStory.title,
            location: getLocationByCourseId(currentStory.courseId),
            image: getImageByCourseId(currentStory.courseId),
            audioUrl: currentStory.audioUrl,
            fullStory: currentStory.fullStory,
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
          };
          setStoryData(formattedStory);
        } else {
          console.error('해당 코스 ID의 스토리를 찾을 수 없습니다:', courseId);
        }
        
      } catch (error) {
        console.error('스토리 데이터 로드 오류:', error);
        // 오류 발생 시 기본 스토리 데이터 사용
        setStoryData(getDefaultStoryData(parseInt(params?.id || '1')));
      }
    };

    loadStories();
  }, [params]);

  // 코스 ID에 따른 위치 정보 반환
  const getLocationByCourseId = (courseId) => {
    const locationMap = {
      1: '용머리해안',
      2: '외도 마을',
      4: '모슬포 마을'
    };
    return locationMap[courseId] || '제주도';
  };

  // 코스 ID에 따른 이미지 반환
  const getImageByCourseId = (courseId) => {
    const imageMap = {
      1: '/assets/dragon.png',
      2: '/assets/guardian.png',
      4: '/assets/haenyeo.png'
    };
    return imageMap[courseId] || '/assets/default.png';
  };

  // 기본 스토리 데이터 (JSON 로드 실패 시 사용)
  const getDefaultStoryData = (courseId) => {
    const defaultStories = {
      1: {
        id: 1,
        title: '용머리해안의 전설',
        location: '용머리해안',
        image: '/assets/dragon.png',
        audioUrl: '/audio/dragon-story.mp3',
        fullStory: `옛날 옛적, 제주도 서쪽 끝에 있는 용머리해안에는 신비로운 전설이 있었어요.\n\n바다 깊은 곳에 사는 용왕님이 육지로 올라와 쉬던 곳이 바로 이곳이라고 해요. 용왕님은 매일 밤 이곳에 올라와 별을 보며 제주 사람들의 안전을 지켜주었답니다.\n\n어느 날, 큰 태풍이 제주를 향해 다가오고 있었어요. 제주 사람들은 모두 걱정에 떨고 있었죠. 그때 용왕님이 나타나서 자신의 긴 꼬리로 태풍을 막아주었어요.\n\n그 후로 사람들은 이곳을 '용머리해안'이라고 부르게 되었고, 지금도 용왕님의 머리와 꼬리 모양을 닮은 바위들을 볼 수 있답니다.\n\n용왕님은 지금도 제주 바다를 지키고 있어요. 용머리해안에 가면 파도 소리 속에서 용왕님의 따뜻한 목소리를 들을 수 있을 거예요.`,
        characters: {
          hwarang: { name: '화랑이', voice: '상냥한 목소리', image: '/assets/hwarang.png' },
          dolhareubang: { name: '돌이방이', voice: '든든한 목소리', image: '/assets/doribangi.png' },
          tangerine: { name: '귤이', voice: '밝은 목소리', image: '/assets/gyuri.png' }
        }
      },
      2: {
        id: 2,
        title: '꿈속에서 만난 송씨영감',
        location: '외도 마을',
        image: '/assets/guardian.png',
        audioUrl: '/audio/guardian-story.mp3',
        fullStory: `옛날옛날, 제주 외도 마을에 홍좌수라는 멋진 어른이 살았어요.\n힘도 세고 똑똑해서, 마을 사람들은 조금 무서워하면서도 좋아했죠.\n\n그러던 어느 날, 꿈속에 하얀 머리의 할아버지가 나타나 말했어요.\n“나는 이 마을을 지켜주는 송씨영감이란다.\n나를 모실 집을 만들어 주면, 너랑 마을에 좋은 일이 생길 거야!”\n\n홍좌수는 잠에서 깨자마자 신을 모시는 집을 지었어요.\n그날부터 마법처럼 좋은 일들이 생겼어요!\n집안은 점점 부자가 되고, 마을도 더 행복해졌답니다.\n\n그런데 몇몇 사람이 부러워하며 나쁜 계획을 꾸몄어요.\n바로 그날 밤, 꿈에 다시 송씨영감이 나와 말했어요.\n“그때가 오면, 조용히 가만히 있어야 해. 그러면 무사할 거야.”\n\n홍좌수는 약속을 잘 지켜 위험한 순간을 무사히 넘겼고,\n그 뒤로도 송씨영감을 정성껏 모셨어요.\n지금도 외도 마을 사람들은 매년 제사를 지내며\n행복과 복을 빌고 있답니다!`,
        characters: {
          hwarang: { name: '화랑이', voice: '상냥한 목소리', image: '/assets/hwarang.png' },
          dolhareubang: { name: '돌이방이', voice: '든든한 목소리', image: '/assets/doribangi.png' },
          tangerine: { name: '귤이', voice: '밝은 목소리', image: '/assets/gyuri.png' }
        }
      },
      4: {
        id: 4,
        title: '산호 해녀의 전설',
        location: '모슬포 마을',
        image: '/assets/haenyeo.png',
        audioUrl: '/audio/haenyeo-story.mp3',
        fullStory: `옛날 제주도 모슬포 마을에 고운 얼굴의 착한 해녀가 살고 있었어요.\n\n그녀는 파도 속에서도 누구보다 씩씩하게 물질을 했지요.\n\n어느 날, 큰 바다에서 거북이 한 마리가 그물에 걸려 허우적거리고 있었어요.\n\n해녀는 그 거북이를 조심스럽게 바다로 돌려보내 주었답니다.\n\n며칠 뒤, 해녀는 깊은 바다에서 물질을 하다가 갑자기 눈앞이 반짝이는 궁전으로 바뀌는 걸 보았어요.\n\n그곳은 바로 용궁, 바닷속 왕국이었어요!\n\n그곳에 있던 산호 여왕님이 다가와 말했어요.\n\n“네가 우리 아기를 살려주었구나. 고마워. 이 산호꽃을 간직하렴. 이 꽃은 널 무서운 병에서 지켜줄 거란다.”\n\n그리고 병든 아버지를 위한 신비한 약도 함께 건네주었어요.\n\n그날 이후, 해녀는 마을에서도 가장 건강하고 씩씩한 사람이 되었어요.\n\n사람들은 그녀를 ‘산호 해녀’라 불렀고,\n\n그녀의 이야기는 제주 바다와 함께 오래도록 전해졌답니다.`,
        characters: {
          hwarang: { name: '화랑이', voice: '상냥한 목소리', image: '/assets/hwarang.png' },
          dolhareubang: { name: '돌이방이', voice: '든든한 목소리', image: '/assets/doribangi.png' },
          tangerine: { name: '귤이', voice: '밝은 목소리', image: '/assets/gyuri.png' }
        }
      }
    };
    return defaultStories[courseId] || defaultStories[1];
  };

  // 미션 시작 핸들러 
  const handleStartMission = async (courseId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('로그인이 필요합니다.');
      return;
    }
  
    try {
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
    } catch (error) {
      console.error('미션 시작 오류:', error);
      alert('미션 시작 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    // 선택된 캐릭터 가져오기
    const character = localStorage.getItem('selectedCharacter') || 'hwarang';
    setSelectedCharacter(character);
  }, []);

  // 오디오 플레이어 시뮬레이션
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

        {/* 캐릭터 정보 & 오디오 플레이어 */}
        <div className="p-4 bg-white border-b">
          <div className="flex items-center justify-between">
            {/* 캐릭터 정보 */}
            <div className="flex items-center space-x-3 flex-1">
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

            {/* 재생 버튼 */}
            <div className="flex items-center justify-start space-x-3">
            <button
              onClick={togglePlay}
              className="p-3 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white hover:from-green-500 hover:to-blue-600 transition-all duration-200 shadow-lg"
            >
              {isPlaying ? (
                <PauseIcon className="w-6 h-6" />
              ) : (
                <PlayIcon className="w-6 h-6" />
              )}
            </button>
            </div>
          </div>

          {/* 진행률 표시 (옵션) */}
          <div className="mt-4">
            {/* <div className="flex justify-between text-sm text-gray-500 mb-2"> */}
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            {/* <div className="w-full bg-gray-200 rounded-full h-2"> */}
              {/* <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div> */}
            {/* </div> */}
          {/* </div> */}
        </div>

        {/* 오디오 플레이어 */}
        {/* <div className="p-6 bg-white border-b">
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
        </div> */}

        {/* 스토리 텍스트 */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-2xl mr-2">📖</span>
            스토리 내용
          </h3>
          
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="prose prose-sm max-w-none">
              {storyData.fullStory.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
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
              onClick={() => handleStartMission(storyData.id)}
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