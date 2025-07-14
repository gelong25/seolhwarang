export async function POST(request) {
  try {
    const { text, character, chunkIndex } = await request.json();
    
    if (!text || !character) {
      return Response.json({ error: '내용과 캐릭터 설정이 완료되지 않았습니다.' }, { status: 400 });
    }

    console.log(`청크 ${chunkIndex} 처리 중 (${text.length}자)`);

    // 첫 번째 청크의 경우 앞부분 잘림 방지를 위해 패딩 추가
    let processedText = text;
    if (chunkIndex === 0 || chunkIndex === "0") {
      // 더 강력한 패딩: 여러 침묵 구간과 부드러운 시작 문구
      processedText = "         " + text; // 침묵 표시와 공백으로 패딩
      console.log(`첫 번째 청크 - 앞부분 잘림 방지를 위해 강화된 패딩 추가`);
    }

    // ElevenLabs 초기화
    const ELEVENLABS_API_KEY = "sk_1af322001168edcc19c502245966e6fbbc9789fe1ef6cbbd";
    const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1";
    
    // 캐릭터별 음성 ID 설정
    const voiceSettings = {
      hwarang: {
        voice_id: "21m00Tcm4TlvDq8ikWAM", // Rachel - 부드러운 여성 음성
        stability: 0.5,
        similarity_boost: 0.8,
        style: 0.2
      },
      dolhareubang: {
        voice_id: "29vD33N1CtxCmqQRPOHJ", // Drew - 든든한 남성 음성
        stability: 0.7,
        similarity_boost: 0.7,
        style: 0.1
      },
      tangerine: {
        voice_id: "pNInz6obpgDQGcFmaJgB", // Adam - 밝은 목소리
        stability: 0.4,
        similarity_boost: 0.9,
        style: 0.3
      }
    };

    const selectedVoice = voiceSettings[character] || voiceSettings.hwarang;
    
    // 테스트 모드 체크 -> True이면 브라우저 내장 tts 사용함
    const isTestMode = false; // false: ElevenLabs API 사용
    
    if (isTestMode) {
      // 브라우저 TTS 모드 - 클라이언트에서 처리
      const mockResponse = {
        audioUrl: null, // 브라우저 TTS 사용을 위해 null
        duration: Math.ceil(processedText.length / 15),
        text: processedText, // 처리된 텍스트 사용
        character: character,
        voice_id: selectedVoice.voice_id,
        success: true,
        testMode: true,
        useBrowserTTS: true, // 브라우저 TTS 사용 플래그
        chunkIndex: chunkIndex
      };
      
      console.log(`청크 ${chunkIndex} 처리 완료 (${processedText.length}자)`);
      return Response.json(mockResponse);
    }
    
    // ElevenLabs TTS API 호출 (재시도 로직 포함)
    const maxRetries = 3;
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`청크 ${chunkIndex} - 시도 ${attempt}/${maxRetries}`);
        
        const ttsResponse = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${selectedVoice.voice_id}`, {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY
          },
          body: JSON.stringify({
            text: processedText, // 처리된 텍스트 사용
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: selectedVoice.stability,
              similarity_boost: selectedVoice.similarity_boost,
              style: selectedVoice.style,
              use_speaker_boost: true
            }
          })
        });

        if (!ttsResponse.ok) {
          const errorStatus = ttsResponse.status;
          
          if (errorStatus === 429 && attempt < maxRetries) {
            // Rate limit 에러면 잠시 대기 후 재시도
            const waitTime = attempt * 1000; // 1초, 2초, 3초로 점진적 대기
            console.log(`청크 ${chunkIndex} - Rate limit 에러, ${waitTime}ms 대기 후 재시도`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
          
          throw new Error(`ElevenLabs API Error: ${errorStatus}`);
        }

        // 오디오 데이터 직접 반환 (스트리밍 최적화)
        const audioBuffer = await ttsResponse.arrayBuffer();
        
        // 오디오 데이터 검증
        if (audioBuffer.byteLength < 1000) {
          throw new Error(`오디오 데이터가 너무 작습니다: ${audioBuffer.byteLength} bytes`);
        }
        
        console.log(`청크 ${chunkIndex} 처리 완료 (${processedText.length}자, ${attempt}번째 시도, 오디오 크기: ${audioBuffer.byteLength} bytes)`);
        
        // JSON 응답으로 메타데이터와 Base64 오디오 함께 반환
        const audioBase64 = Buffer.from(audioBuffer).toString('base64');
        const response = {
          audioUrl: `data:audio/mpeg;base64,${audioBase64}`,
          duration: Math.ceil(processedText.length / 15),
          text: processedText,
          character: character,
          voice_id: selectedVoice.voice_id,
          success: true,
          chunkIndex: chunkIndex,
          attempt: attempt,
          audioSize: audioBuffer.byteLength
        };

        return Response.json(response);
        
      } catch (error) {
        lastError = error;
        console.error(`청크 ${chunkIndex} - 시도 ${attempt} 실패:`, error.message);
        
        if (attempt < maxRetries) {
          // 다른 에러도 잠시 대기 후 재시도
          const waitTime = attempt * 500;
          console.log(`청크 ${chunkIndex} - ${waitTime}ms 대기 후 재시도`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }
    
    // 모든 재시도 실패 시 에러 반환 (fallback 없음)
    console.error(`청크 ${chunkIndex} - 모든 재시도 실패:`, lastError);
    return Response.json({ 
      error: 'ElevenLabs TTS 생성 실패', 
      message: lastError.message,
      success: false,
      chunkIndex: chunkIndex,
      maxRetriesExceeded: true
    }, { status: 500 });
    
  } catch (error) {
    console.error('TTS Chunk API Error:', error);
    return Response.json({ 
      error: 'TTS 청크 생성 실패', 
      message: error.message,
      success: false,
      chunkIndex: chunkIndex
    }, { status: 500 });
  }
} 