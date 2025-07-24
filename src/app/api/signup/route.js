import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';

export async function POST(req) {
  const { name, email, password, selectedCourseId } = await req.json();
  try {
    // 1) Auth 유저 생성
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    // 2) Firestore에 추가 정보 저장
    await adminDb
      .collection('users')
      .doc(userRecord.uid)
      .set({ selectedCourseId });

    return NextResponse.json(
      { message: '회원가입 성공', uid: userRecord.uid },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}
