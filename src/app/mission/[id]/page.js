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
    console.log('URL params:', params);
    console.log('courseId (raw):', params.id);
    console.log('courseId (parsed):', courseId);
    console.log('Available courses:', courses);

    const selected = courses.find(c => c.id === courseId);
    console.log('Selected course:', selected);

    if (!selected) {
      console.log('Course not found for id:', courseId);
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
  
        {/* 미션 본문 */}
        <div className="p-4 flex-1">
          {!showSuccess ? (
            <div>
              {/* 공통 미션 헤더 */}
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{mission.icon}</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">{mission.title}</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">{mission.description}</p>
                <div className="mb-6">
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-50 rounded-full border border-yellow-200">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-medium text-gray-700">
                      {mission.points}P 획득 가능
                    </span>
                  </div>
                </div>
              </div>
  
              {/* 미션 타입별 UI */}
              {mission.type === 'quiz' && (
                <QuizMission mission={mission} onComplete={handleMissionComplete} />
              )}
              
              {mission.type === 'photo' && (
                <PhotoMission mission={mission} onComplete={handleMissionComplete} />
              )}
              
              {mission.type === 'stamp' && (
                <StampMission mission={mission} onComplete={handleMissionComplete} />
              )}
              
              {mission.type === 'activity' && (
                <ActivityMission mission={mission} onComplete={handleMissionComplete} />
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

// 퀴즈 미션 컴포넌트
function QuizMission({ mission, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // 미션별 퀴즈 데이터
  const quizData = {
    'm3': {
      questions: [
        {
          question: "용머리해안이 형성된 이유는?",
          options: ["화산활동", "침식작용", "지진", "빙하작용"],
          correct: 0
        },
        {
          question: "용머리해안의 특징적인 모양은?",
          options: ["사자머리", "용머리", "호랑이머리", "독수리머리"],
          correct: 1
        }
      ]
    },
    'm11': {
      questions: [
        {
          question: "산호는 어떤 생물인가요?",
          options: ["식물", "동물", "광물", "바이러스"],
          correct: 1
        },
        {
          question: "산호가 살기 좋은 바다는?",
          options: ["차가운 바다", "따뜻한 바다", "깊은 바다", "얕은 바다"],
          correct: 1
        }
      ]
    }
  };

  const currentQuiz = quizData[mission.id] || quizData['m3'];
  const question = currentQuiz.questions[currentQuestion];

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === question.correct) {
      setScore(score + 1);
    }
    
    if (currentQuestion < currentQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const handleQuizComplete = () => {
    onComplete();
  };

  if (showResult) {
    return (
      <div className="text-center">
        <div className="text-6xl mb-4">
          {score >= currentQuiz.questions.length / 2 ? '🎉' : '😅'}
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-800">퀴즈 결과</h3>
        <p className="text-gray-600 mb-6">
          {currentQuiz.questions.length}문제 중 {score}문제 정답!
        </p>
        <button
          onClick={handleQuizComplete}
          className="w-full px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600"
        >
          미션 완료하기
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 text-center">
        <span className="text-sm text-gray-500">
          {currentQuestion + 1} / {currentQuiz.questions.length}
        </span>
      </div>
      
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <h3 className="text-lg font-medium mb-4 text-gray-800">{question.question}</h3>
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full p-3 rounded-xl border-2 transition-all text-gray-800 ${
                selectedAnswer === index
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      
      <button
        onClick={handleNextQuestion}
        disabled={selectedAnswer === null}
        className="w-full px-6 py-3 bg-purple-500 text-gray-800 rounded-xl font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {currentQuestion < currentQuiz.questions.length - 1 ? '다음 문제' : '결과 보기'}
      </button>
    </div>
  );
}

// 사진 미션 컴포넌트
function PhotoMission({ mission, onComplete }) {
  const [photoTaken, setPhotoTaken] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const handleTakePhoto = () => {
    setShowCamera(true);
    // 실제 카메라 기능 시뮬레이션
    setTimeout(() => {
      setPhotoTaken(true);
      setShowCamera(false);
    }, 2000);
  };

  if (showCamera) {
    return (
      <div className="text-center">
        <div className="bg-gray-200 rounded-xl p-8 mb-6">
          <div className="text-4xl mb-4">📷</div>
          <p className="text-gray-600">카메라를 준비 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      {!photoTaken ? (
        <div>
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <div className="text-4xl mb-4">📸</div>
            <p className="text-gray-700 mb-4">
              {mission.id === 'm1' ? '용머리해안의 멋진 풍경을' : 
               mission.id === 'm4' ? '송씨영감의 흔적을' :
               mission.id === 'm8' ? '당산에서 인사하는 모습을' :
               mission.id === 'm9' ? '산호 모양을' : '아름다운 순간을'} 사진으로 남겨보세요!
            </p>
          </div>
          
          <button
            onClick={handleTakePhoto}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 mb-4"
          >
            📷 사진 촬영하기
          </button>
          
        </div>
      ) : (
        <div>
          <div className="bg-green-50 rounded-xl p-6 mb-6">
            <div className="text-4xl mb-4">✅</div>
            <p className="text-gray-700 mb-4">멋진 사진을 찍었습니다!</p>
            <div className="bg-gray-200 rounded-xl p-8">
              <div className="text-2xl">🖼️</div>
              <p className="text-sm text-gray-500 mt-2">촬영된 사진</p>
            </div>
          </div>
          
          <button
            onClick={onComplete}
            className="w-full px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600"
          >
            미션 완료하기
          </button>
        </div>
      )}
    </div>
  );
}

// 스탬프 미션 컴포넌트
function StampMission({ mission, onComplete }) {
  const [stampReceived, setStampReceived] = useState(false);
  const [showStampAnimation, setShowStampAnimation] = useState(false);

  const handleGetStamp = () => {
    setShowStampAnimation(true);
    setTimeout(() => {
      setStampReceived(true);
      setShowStampAnimation(false);
    }, 1500);
  };

  if (showStampAnimation) {
    return (
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">📬</div>
        <p className="text-gray-600">스탬프를 받는 중...</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      {!stampReceived ? (
        <div>
          <div className="bg-green-50 rounded-xl p-6 mb-6">
            <div className="text-4xl mb-4">🏛️</div>
            <p className="text-gray-700 mb-4">
              {mission.id === 'm2' ? '관광 안내소에서' : 
               mission.id === 'm5' ? '카페에서 지정 음료를 마시고' : '지정 장소에서'} 
              스탬프를 받아보세요!
            </p>
            <div className="bg-white rounded-xl p-4 border-2 border-dashed border-gray-300">
              <p className="text-sm text-gray-500">스탬프 받을 공간</p>
            </div>
          </div>
          
          <button
            onClick={handleGetStamp}
            className="w-full px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 mb-4"
          >
            📍 스탬프 받기
          </button>
        </div>
      ) : (
        <div>
          <div className="bg-green-50 rounded-xl p-6 mb-6">
            <div className="text-4xl mb-4">✅</div>
            <p className="text-gray-700 mb-4">스탬프를 받았습니다!</p>
            <div className="bg-white rounded-xl p-4 border-2 border-green-300">
              <div className="text-2xl text-green-600">🏛️</div>
              <p className="text-sm text-green-600 mt-2">
                {new Date().toLocaleDateString()} 방문 확인
              </p>
            </div>
          </div>
          
          <button
            onClick={onComplete}
            className="w-full px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600"
          >
            미션 완료하기
          </button>
        </div>
      )}
    </div>
  );
}

// 활동 미션 컴포넌트
function ActivityMission({ mission, onComplete }) {
  const [activityCompleted, setActivityCompleted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const activitySteps = {
    'm10': [
      { step: 1, text: "해녀 체험복을 입어보세요", icon: "👕" },
      { step: 2, text: "바닷속 산호 보호 포즈를 취해보세요", icon: "🌊" },
      { step: 3, text: "사진을 촬영해보세요", icon: "📸" }
    ],
    'm11': [
      { step: 1, text: "엽서 재료를 준비하세요", icon: "📝" },
      { step: 2, text: "각자의 소원을 적어보세요", icon: "✍️" },
      { step: 3, text: "산호꽃 모양으로 꾸며보세요", icon: "🌺" }
    ]
  };

  const steps = activitySteps[mission.id] || activitySteps['m10'];

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setActivityCompleted(true);
    }
  };

  return (
    <div className="text-center">
      {!activityCompleted ? (
        <div>
          <div className="bg-orange-50 rounded-xl p-6 mb-6">
            <div className="text-4xl mb-4">{steps[currentStep].icon}</div>
            <h3 className="text-lg font-medium mb-2">
              단계 {currentStep + 1} / {steps.length}
            </h3>
            <p className="text-gray-700">{steps[currentStep].text}</p>
          </div>
          
          {/* 단계 진행 바 */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
          
          <button
            onClick={handleNextStep}
            className="w-full px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600"
          >
            {currentStep < steps.length - 1 ? '다음 단계' : '활동 완료'}
          </button>
        </div>
      ) : (
        <div>
          <div className="bg-orange-50 rounded-xl p-6 mb-6">
            <div className="text-4xl mb-4">🎯</div>
            <p className="text-gray-700 mb-4">활동을 완료했습니다!</p>
            <div className="bg-white rounded-xl p-4">
              <div className="text-2xl mb-2">🏆</div>
              <p className="text-sm text-gray-600">
                {mission.id === 'm11' ? '아름다운 소원 엽서가 완성되었습니다!' : 
                 '멋진 활동을 완료했습니다!'}
              </p>
            </div>
          </div>
          
          <button
            onClick={onComplete}
            className="w-full px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600"
          >
            미션 완료하기
          </button>
        </div>
      )}
    </div>
  );
}
