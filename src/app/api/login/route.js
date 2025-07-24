import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebaseAdmin';

export async function POST(req) {
  const { idToken } = await req.json();
  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    const { uid, email, name } = decoded;
    return NextResponse.json({ uid, email, name }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: '유효하지 않은 토큰' }, { status: 401 });
  }
}
