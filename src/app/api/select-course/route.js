import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'src', 'data', 'users.json');

export async function POST(req) {
  try {
    const { userId, selectedCourseId } = await req.json();
    const users = JSON.parse(readFileSync(DB_PATH, 'utf-8'));
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return new Response(JSON.stringify({ error: '사용자를 찾을 수 없습니다' }), { status: 404 });
    }

    users[userIndex].selectedCourseId = selectedCourseId;

    writeFileSync(DB_PATH, JSON.stringify(users, null, 2));

    return new Response(JSON.stringify({ message: '코스 선택 완료' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('코스 선택 실패:', err);
    return new Response(JSON.stringify({ error: '서버 오류' }), { status: 500 });
  }
}
