export async function POST(request) {
  try {
    const { text, character, voice } = await request.json();
    
    // request 유효성 검사
    if (!text || !character) {
      return Response.json({ error: '내용과 캐릭터 설정이 완료되지 않았습니다.' }, { status: 400 });
    }

    // ElevenLabs 초기화
    const ELEVENLABS_API_KEY = "sk_bdf03699e5c2b453f71ec57db0d9a5bd4316899666207f72";
    const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1";
    
    // 캐릭터별 음성 ID 설정
    // TODO: 캐릭터별 음성 검증해야댐
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
    const isTestMode = false; // flase: ElevenLabs API 사용
    
    if (isTestMode) {
      // 브라우저 TTS 모드 - 클라이언트에서 처리 - 이거 개빠름
      const mockResponse = {
        audioUrl: null, // 브라우저 TTS 사용을 위해 null
        duration: Math.ceil(text.length / 15),
        text: text,
        character: character,
        voice_id: selectedVoice.voice_id,
        success: true,
        testMode: true,
        useBrowserTTS: true // 브라우저 TTS 사용 플래그
      };
      
      return Response.json(mockResponse);
    }
    
    // ElevenLabs TTS API 호출
    const ttsResponse = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${selectedVoice.voice_id}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: text,
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
      throw new Error(`ElevenLabs API Error: ${ttsResponse.status}`);
    }

    // 오디오 데이터 -> Base64로 변환
    const audioBuffer = await ttsResponse.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');
    const audioDataUrl = `data:audio/mpeg;base64,${audioBase64}`;

    // 응답 데이터
    const response = {
      audioUrl: audioDataUrl, // Base64 데이터 URL
      duration: Math.ceil(text.length / 15), // 대략적인 재생 시간 계산 - mp3 파일 변환이 아니라서 정확한 길이 예측이 안됨.
      text: text,
      character: character,
      voice_id: selectedVoice.voice_id,
      success: true
    };

    return Response.json(response);
    
  } catch (error) {
    console.error('ElevenLabs TTS API Error:', error);
    return Response.json({ 
      error: 'ElevenLabs TTS 생성 실패', 
      message: error.message,
      success: false 
    }, { status: 500 });
  }
} 