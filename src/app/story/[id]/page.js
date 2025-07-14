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
  const [preloadedTTS, setPreloadedTTS] = useState(null); // 미리 생성된 TTS 데이터
  const [isPreloading, setIsPreloading] = useState(false); // TTS 로딩 상태
  const [currentChunk, setCurrentChunk] = useState(0); // 현재 재생 중인 청크
  const [totalChunks, setTotalChunks] = useState(0); // 전체 청크 수

  // 스토리 데이터
  const stories = {
    1: {
      id: 1,
      title: '용머리해안의 전설',
      location: '용머리해안',
      image: '/assets/dragon.png',
      audioUrl: '/audio/dragon-story.mp3', // 실제 오디오 파일 경로
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
    }
  };

  useEffect(() => {
    const storyId = params?.id || '1';
    setStoryData(stories[storyId]);
    
    // 선택된 캐릭터 가져오기
    const character = localStorage.getItem('selectedCharacter') || 'hwarang';
    setSelectedCharacter(character);
  }, [params]);

  // 오디오 파일의 실제 duration 계산 함수
  const getAudioDuration = (audioUrl) => {
    return new Promise((resolve) => {
      const audio = new Audio(audioUrl);
      audio.addEventListener('loadedmetadata', () => {
        resolve(Math.ceil(audio.duration)); // 소수점 제거
      });
      audio.addEventListener('error', () => {
        resolve(180); // 오류 시 기본값
      });
    });
  };

  // 페이지 로드 시 TTS 미리 생성
  useEffect(() => {
    if (storyData && selectedCharacter) {
      const preloadTTS = async () => {
        try {
          setIsPreloading(true);
          
          // 캐시 키 생성
          const cacheKey = `tts_${storyData.id}_${selectedCharacter}`;
          
          // 캐시된 TTS 데이터 확인
          const cachedTTS = localStorage.getItem(cacheKey);
          if (cachedTTS) {
            const parsedTTS = JSON.parse(cachedTTS);
            
            // 스트리밍 데이터이고 모든 청크가 캐시에 있는지 확인
            if (parsedTTS.isStreaming && parsedTTS.textChunks) {
              let allChunksCached = true;
              const cachedChunks = [];
              
              for (let i = 0; i < parsedTTS.totalChunks; i++) {
                const chunkCacheKey = `tts_chunk_${storyData.id}_${selectedCharacter}_${i}`;
                const cachedChunk = localStorage.getItem(chunkCacheKey);
                if (cachedChunk) {
                  cachedChunks[i] = JSON.parse(cachedChunk);
                } else {
                  allChunksCached = false;
                  break;
                }
              }
              
              if (allChunksCached) {
                // 모든 청크가 캐시에 있으면 전체 캐시 사용
                parsedTTS.loadedChunks = cachedChunks;
                setPreloadedTTS(parsedTTS);
                setDuration(Math.ceil(parsedTTS.duration || 180));
                setIsPreloading(false);
                console.log('모든 청크 캐시 사용으로 즉시 재생 가능');
                return;
              }
            } else if (!parsedTTS.isStreaming) {
              // 일반 TTS 캐시 사용
              setPreloadedTTS(parsedTTS);
              setDuration(Math.ceil(parsedTTS.duration || 180)); // 소수점 제거
              setIsPreloading(false);
              console.log('캐시된 TTS 사용:', parsedTTS);
              return;
            }
          }
          
          // 스트리밍을 위한 텍스트 분할
          const splitTextIntoChunks = (text) => {
            const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
            const chunks = [];
            
            for (const paragraph of paragraphs) {
              if (paragraph.length <= 250) {
                chunks.push(paragraph);
              } else {
                const sentences = paragraph.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
                let currentChunk = '';
                
                for (const sentence of sentences) {
                  if (currentChunk.length + sentence.length <= 250) {
                    currentChunk += (currentChunk ? ' ' : '') + sentence;
                  } else {
                    if (currentChunk) chunks.push(currentChunk);
                    currentChunk = sentence;
                  }
                }
                if (currentChunk) chunks.push(currentChunk);
              }
            }
            
            return chunks.length > 0 ? chunks : [text];
          };
          
          const textChunks = splitTextIntoChunks(storyData.fullStory);
          console.log(`텍스트를 ${textChunks.length}개 청크로 분할:`, textChunks.map(chunk => chunk.slice(0, 50) + '...'));
          
          // 첫 번째 청크 캐시 확인
          const firstChunkCacheKey = `tts_chunk_${storyData.id}_${selectedCharacter}_0`;
          let firstChunkData = null;
          
          const cachedFirstChunk = localStorage.getItem(firstChunkCacheKey);
          if (cachedFirstChunk) {
            firstChunkData = JSON.parse(cachedFirstChunk);
            console.log('첫 번째 청크 캐시 사용 (JSON 방식)');
          } else {
            // 첫 번째 청크만 먼저 로드 (스트리밍)
            const firstChunkResponse = await fetch('/api/tts-chunk', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                text: textChunks[0],
                character: selectedCharacter,
                chunkIndex: 0
              })
            });

            if (!firstChunkResponse.ok) {
              throw new Error('첫 번째 청크 TTS API 호출 실패');
            }

            // JSON 응답 처리
            firstChunkData = await firstChunkResponse.json();
            
            // 첫 번째 청크 캐시 저장
            if (firstChunkData.success) {
              localStorage.setItem(firstChunkCacheKey, JSON.stringify(firstChunkData));
              console.log('첫 번째 청크 캐시 저장 (JSON 방식)');
            }
          }
          
          if (firstChunkData.success) {
            // 전체 duration 추정
            const estimatedDuration = Math.ceil(storyData.fullStory.length / 15);
            setDuration(estimatedDuration);
            
            // 스트리밍 데이터 저장
            const streamingData = {
              ...firstChunkData,
              textChunks: textChunks,
              totalChunks: textChunks.length,
              loadedChunks: [firstChunkData], // 첫 번째 청크만 로드됨
              duration: estimatedDuration,
              isStreaming: true
            };
            
            // 스트리밍 메타데이터 캐시 저장
            localStorage.setItem(cacheKey, JSON.stringify(streamingData));
            
            setPreloadedTTS(streamingData);
            console.log('스트리밍 첫 번째 청크 로드 완료 및 메타데이터 캐시 저장:', textChunks.length + '개 청크 중 1개');
          } else {
            throw new Error('첫 번째 청크 TTS 데이터 생성 실패');
          }
          
        } catch (error) {
          console.error('TTS 미리 생성 오류:', error);
          
          // 첫 번째 청크 실패 시 브라우저 TTS로 fallback
          const fallbackTTS = {
            success: true,
            useBrowserTTS: true,
            text: storyData.fullStory,
            character: selectedCharacter,
            duration: Math.ceil(storyData.fullStory.length / 15)
          };
          
          // Fallback 데이터도 캐시에 저장
          localStorage.setItem(cacheKey, JSON.stringify(fallbackTTS));
          setPreloadedTTS(fallbackTTS);
          setDuration(Math.ceil(fallbackTTS.duration)); // 소수점 제거
          
          console.log('첫 번째 청크 실패로 브라우저 TTS 사용');
        } finally {
          setIsPreloading(false);
        }
      };

      preloadTTS();
    }
  }, [storyData, selectedCharacter]);

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

  const togglePlay = async () => {
    if (!isPlaying) {
      try {
        // 미리 생성된 TTS 데이터가 없으면 대기
        if (!preloadedTTS) {
          if (isPreloading) {
            alert('음성을 준비 중입니다. 잠시 후 다시 시도해주세요.');
            return;
          } else {
            alert('음성 데이터를 불러올 수 없습니다.');
            return;
          }
        }
        
        setIsPlaying(true);
        
        if (preloadedTTS.isStreaming) {
          // 스트리밍 모드 - 청크별 재생
          const { textChunks, totalChunks, loadedChunks } = preloadedTTS;
          
          setTotalChunks(totalChunks);
          setCurrentChunk(0);
          
          // 나머지 청크들을 백그라운드에서 병렬로 로드
          const loadRemainingChunks = async () => {
            const remainingPromises = [];
            
            for (let i = 1; i < totalChunks; i++) {
              const chunkCacheKey = `tts_chunk_${storyData.id}_${selectedCharacter}_${i}`;
              
              const promise = (async (chunkIndex) => {
                // 캐시 확인
                const cachedChunk = localStorage.getItem(chunkCacheKey);
                if (cachedChunk) {
                  const parsedChunk = JSON.parse(cachedChunk);
                  loadedChunks[chunkIndex] = parsedChunk;
                  console.log(`청크 ${chunkIndex + 1}/${totalChunks} 캐시 사용 (JSON 방식)`);
                  return parsedChunk;
                }
                
                // 캐시 미스 시 API 호출
                try {
                  const response = await fetch('/api/tts-chunk', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      text: textChunks[chunkIndex],
                      character: preloadedTTS.character,
                      chunkIndex: chunkIndex
                    })
                  });
                  
                  if (response.ok) {
                    // JSON 응답 처리
                    const data = await response.json();
                    
                    if (data.success) {
                      loadedChunks[chunkIndex] = data;
                      // 캐시에 저장
                      localStorage.setItem(chunkCacheKey, JSON.stringify(data));
                      console.log(`청크 ${chunkIndex + 1}/${totalChunks} 로드 완료 및 캐시 저장 (JSON 방식)`);
                      return data;
                    } else {
                      console.error(`청크 ${chunkIndex + 1} 로드 실패:`, data.message);
                    }
                  } else {
                    console.error(`청크 ${chunkIndex + 1} 로드 실패:`, response.status, response.statusText);
                  }
                } catch (error) {
                  console.error(`청크 ${chunkIndex + 1} 로드 실패:`, error);
                }
                
                // 실패한 청크는 백그라운드에서 재시도
                setTimeout(async () => {
                  try {
                    const retryResponse = await fetch('/api/tts-chunk', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        text: textChunks[chunkIndex],
                        character: preloadedTTS.character,
                        chunkIndex: chunkIndex
                      })
                    });
                    
                    const retryData = await retryResponse.json();
                    if (retryData.success) {
                      loadedChunks[chunkIndex] = retryData;
                      localStorage.setItem(chunkCacheKey, JSON.stringify(retryData));
                      console.log(`청크 ${chunkIndex + 1}/${totalChunks} 재시도 로드 완료 및 캐시 저장`);
                    }
                  } catch (error) {
                    console.error(`청크 ${chunkIndex + 1} 재시도 실패:`, error);
                  }
                }, 2000); // 2초 후 재시도
                
                return null;
              })(i);
              
              remainingPromises.push(promise);
              
              // 200ms 지연으로 rate limit 방지 (캐시 히트 시에는 지연 없음)
              if (i < totalChunks - 1) {
                const cachedChunk = localStorage.getItem(chunkCacheKey);
                if (!cachedChunk) {
                  await new Promise(resolve => setTimeout(resolve, 200));
                }
              }
            }
            
            await Promise.all(remainingPromises);
            console.log('모든 청크 로드 완료');
            
            // 모든 청크가 로드되면 전체 스트리밍 캐시 업데이트
            const allChunksLoaded = loadedChunks.every(chunk => chunk !== null && chunk !== undefined);
            if (allChunksLoaded) {
              const streamingCacheKey = `tts_${storyData.id}_${selectedCharacter}`;
              const updatedStreamingData = {
                ...preloadedTTS,
                loadedChunks: [...loadedChunks], // 모든 청크 포함
                allChunksComplete: true
              };
              localStorage.setItem(streamingCacheKey, JSON.stringify(updatedStreamingData));
              console.log('전체 스트리밍 캐시 업데이트 완료 - 다음 번에는 즉시 재생 가능');
            }
          };
          
          // 백그라운드에서 나머지 청크 로드 시작
          loadRemainingChunks();
          
          // 청크별 재생 함수
          let currentChunkIndex = 0;
          
          const playNextChunk = async () => {
            if (currentChunkIndex >= totalChunks) {
              setIsPlaying(false);
              setCurrentChunk(0);
              setTotalChunks(0);
              return;
            }
            
            setCurrentChunk(currentChunkIndex + 1);
            
            // 현재 청크가 로드될 때까지 기다림 (무한 대기)
            while (!loadedChunks[currentChunkIndex]) {
              await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            const chunkData = loadedChunks[currentChunkIndex];
            
            if (chunkData.useBrowserTTS) {
              // 브라우저 TTS 사용
              if ('speechSynthesis' in window) {
                const voices = speechSynthesis.getVoices();
                const koreanVoices = voices.filter(voice => voice.lang.includes('ko'));
                
                let voiceSettings = { pitch: 1.0, rate: 1.0 };
                let selectedVoice = koreanVoices[0];
                
                if (koreanVoices.length > 0) {
                  if (chunkData.character === 'dolhareubang') {
                    selectedVoice = koreanVoices.find(voice => voice.name.includes('Male')) || koreanVoices[0];
                    voiceSettings = { pitch: 0.8, rate: 0.9 };
                  } else if (chunkData.character === 'tangerine') {
                    selectedVoice = koreanVoices[0];
                    voiceSettings = { pitch: 1.2, rate: 1.1 };
                  } else { // hwarang
                    selectedVoice = koreanVoices[0];
                    voiceSettings = { pitch: 1.0, rate: 1.0 };
                  }
                }
                
                const utterance = new SpeechSynthesisUtterance(chunkData.text);
                utterance.voice = selectedVoice;
                utterance.pitch = voiceSettings.pitch;
                utterance.rate = voiceSettings.rate;
                
                utterance.onend = () => {
                  currentChunkIndex++;
                  playNextChunk();
                };
                
                utterance.onerror = (e) => {
                  console.error('TTS 오류:', e);
                  setIsPlaying(false);
                  setCurrentChunk(0);
                  setTotalChunks(0);
                  alert('음성 재생 중 오류가 발생했습니다.');
                };
                
                speechSynthesis.speak(utterance);
              }
                         } else if (chunkData.audioUrl) {
               // ElevenLabs 오디오 재생
               const audio = new Audio(chunkData.audioUrl);
               
               // 오디오 로딩 완료 대기
               await new Promise((resolve, reject) => {
                 audio.addEventListener('canplaythrough', resolve);
                 audio.addEventListener('error', reject);
                 audio.load(); // 명시적으로 로드 시작
               });
               
               // 첫 번째 청크는 더 긴 지연 추가 (앞부분 잘림 방지)
               const delay = (currentChunkIndex === 0) ? 300 : 100;
               await new Promise(resolve => setTimeout(resolve, delay));
               
               audio.addEventListener('ended', () => {
                 currentChunkIndex++;
                 playNextChunk();
               });
               
               audio.addEventListener('error', (e) => {
                 console.error('오디오 재생 오류:', e);
                 setIsPlaying(false);
                 setCurrentChunk(0);
                 setTotalChunks(0);
                 alert('음성 재생 중 오류가 발생했습니다.');
               });
               
               // 첫 번째 청크는 볼륨 페이드인 적용
               if (currentChunkIndex === 0) {
                 audio.volume = 0.3;
                 await audio.play();
                 // 점진적으로 볼륨 증가
                 let volume = 0.3;
                 const volumeInterval = setInterval(() => {
                   if (volume < 1.0) {
                     volume += 0.1;
                     audio.volume = Math.min(volume, 1.0);
                   } else {
                     clearInterval(volumeInterval);
                   }
                 }, 50);
               } else {
                 audio.volume = 1.0;
                 await audio.play();
               }
             }
          };
          
          // 첫 번째 청크부터 재생 시작
          playNextChunk();
          
        } else if (preloadedTTS.useBrowserTTS) {
          // 브라우저 내장 TTS 사용 (fallback)
          if ('speechSynthesis' in window) {
            const voices = speechSynthesis.getVoices();
            const koreanVoices = voices.filter(voice => voice.lang.includes('ko'));
            
            let voiceSettings = { pitch: 1.0, rate: 1.0 };
            let selectedVoice = koreanVoices[0];
            
            if (koreanVoices.length > 0) {
              if (preloadedTTS.character === 'dolhareubang') {
                selectedVoice = koreanVoices.find(voice => voice.name.includes('Male')) || koreanVoices[0];
                voiceSettings = { pitch: 0.8, rate: 0.9 };
              } else if (preloadedTTS.character === 'tangerine') {
                selectedVoice = koreanVoices[0];
                voiceSettings = { pitch: 1.2, rate: 1.1 };
              } else { // hwarang
                selectedVoice = koreanVoices[0];
                voiceSettings = { pitch: 1.0, rate: 1.0 };
              }
            }
            
            const utterance = new SpeechSynthesisUtterance(preloadedTTS.text);
            utterance.voice = selectedVoice;
            utterance.pitch = voiceSettings.pitch;
            utterance.rate = voiceSettings.rate;
            
            utterance.onend = () => {
              setIsPlaying(false);
            };
            
            utterance.onerror = (e) => {
              console.error('TTS 오류:', e);
              setIsPlaying(false);
              alert('음성 재생 중 오류가 발생했습니다.');
            };
            
            speechSynthesis.speak(utterance);
          } else {
            throw new Error('브라우저가 음성 합성을 지원하지 않습니다.');
          }
        } else if (preloadedTTS.audioUrl) {
          // ElevenLabs 오디오 재생 (미리 생성된 파일)
          const audio = new Audio(preloadedTTS.audioUrl);
          
          audio.addEventListener('ended', () => {
            setIsPlaying(false);
          });
          
          audio.addEventListener('error', (e) => {
            console.error('오디오 재생 오류:', e);
            setIsPlaying(false);
            alert('음성 재생 중 오류가 발생했습니다.');
          });
          
          await audio.play();
        } else {
          throw new Error('오디오 데이터가 없습니다.');
        }
        
      } catch (error) {
        console.error('TTS 오류:', error);
        setIsPlaying(false);
        alert('음성 재생 중 오류가 발생했습니다: ' + error.message);
      }
    } else {
      // 재생 중지
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      setIsPlaying(false);
      setCurrentChunk(0);
      setTotalChunks(0);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds) => {
    const totalSeconds = Math.floor(seconds); // 소수점 제거
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
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
              disabled={isPreloading}
              className={`p-4 rounded-full text-white transition-all duration-200 shadow-lg ${
                isPreloading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600'
              }`}
            >
              {isPreloading ? (
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isPlaying ? (
                <PauseIcon className="w-8 h-8" />
              ) : (
                <PlayIcon className="w-8 h-8" />
              )}
            </button>

            <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <span className="text-xl">⚙️</span>
            </button>
          </div>
          
          {/* 로딩 상태 텍스트 */}
          {isPreloading && (
            <div className="mt-3 text-center">
              <p className="text-sm text-gray-600">
                🎵 {selectedCharacter === 'hwarang' ? '화랑이' : selectedCharacter === 'dolhareubang' ? '돌이방이' : '귤이'}의 음성을 준비하고 있어요...
              </p>
            </div>
          )}
          
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
              onClick={() => router.push(`/mission/${storyData.id}`)}
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