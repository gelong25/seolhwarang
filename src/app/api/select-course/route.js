import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function POST(request) {
  try {
    // 1) 요청 바디에서 userId, selectedCourseId 파싱
    const body = await request.json();
    const { userId, selectedCourseId } = body;

    // 2) 입력값 검증
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      console.error('Invalid userId:', userId);
      return NextResponse.json(
        { error: 'userId가 유효하지 않습니다' },
        { status: 400 }
      );
    }

    if (!selectedCourseId || (typeof selectedCourseId !== 'string' && typeof selectedCourseId !== 'number')) {
      console.error('Invalid selectedCourseId:', selectedCourseId);
      return NextResponse.json(
        { error: 'selectedCourseId가 유효하지 않습니다' },
        { status: 400 }
      );
    }

    console.log('Processing request:', { userId, selectedCourseId });

    // 3) Firestore 'users/{userId}' 문서 참조
    const userRef = adminDb.collection('users').doc(userId.trim());
    const userSnap = await userRef.get();

    // 4) 사용자 존재 여부 확인
    if (!userSnap.exists) {
      console.error('User not found:', userId);
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // 5) selectedCourseId 필드만 업데이트 (문자열로 변환)
    await userRef.set({ 
      selectedCourseId: String(selectedCourseId),
      updatedAt: new Date().toISOString()
    }, { merge: true });

    console.log('Course selection successful:', { userId, selectedCourseId });

    // 6) 성공 응답
    return NextResponse.json(
      { 
        message: '코스 선택 완료',
        selectedCourseId: String(selectedCourseId)
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('코스 선택 실패:', err);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}