import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';

export async function POST(req) {
  const { idToken, name, email, selectedCourseId } = await req.json();
  try {
    // 1) 토큰 검증
    const { uid } = await adminAuth.verifyIdToken(idToken);

    // 2) Auth 프로필 업데이트
    await adminAuth.updateUser(uid, { displayName: name, email });

    // 3) Firestore 정보 업데이트
    await adminDb.collection('users').doc(uid).update({ selectedCourseId });

    return NextResponse.json({ message: '정보 수정 완료' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
