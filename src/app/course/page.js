import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function POST(request) {
  try {
    // 1) 클라이언트에서 보낸 userId, selectedCourseId 파싱
    const { userId, selectedCourseId } = await request.json();

    // 2) Firestore 'users/{userId}' 문서 참조
    const userRef = adminDb.collection('users').doc(userId);
    const userSnap = await userRef.get();

    // 3) 사용자 존재 여부 확인
    if (!userSnap.exists) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    // 4) selectedCourseId 필드만 업데이트
    await userRef.update({ selectedCourseId });

    // 5) 성공 응답
    return NextResponse.json(
      { message: '코스 선택 완료' },
      { status: 200 }
    );
  } catch (err) {
    console.error('코스 선택 실패:', err);
    return NextResponse.json(
      { error: '서버 오류' },
      { status: 500 }
    );
  }
}
