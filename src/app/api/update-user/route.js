import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'src', 'data', 'users.json');

export async function POST(req) {
  const { originalEmail, name, email } = await req.json();

  if (!existsSync(DB_PATH)) {
    return new Response(JSON.stringify({ error: '사용자 데이터가 없습니다.' }), { status: 400 });
  }

  const data = readFileSync(DB_PATH, 'utf-8');
  let users = JSON.parse(data);

  const userIndex = users.findIndex((u) => u.email === originalEmail);

  if (userIndex === -1) {
    return new Response(JSON.stringify({ error: '사용자를 찾을 수 없습니다.' }), { status: 404 });
  }

  // 이메일 중복 검사 (본인 제외)
  const emailExists = users.some(
    (u, idx) => u.email === email && idx !== userIndex
  );
  if (emailExists) {
    return new Response(JSON.stringify({ error: '이미 사용 중인 이메일입니다.' }), { status: 400 });
  }

  // 업데이트
  users[userIndex].name = name;
  users[userIndex].email = email;

  writeFileSync(DB_PATH, JSON.stringify(users, null, 2));

  return new Response(JSON.stringify({ message: '정보 수정 완료', user: users[userIndex] }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
