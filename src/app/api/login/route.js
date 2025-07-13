//app/api/login/route.js
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'src', 'data', 'users.json');

export async function POST(req) {
  const { email, password } = await req.json();

  if (!existsSync(DB_PATH)) {
    return new Response(JSON.stringify({ error: '가입된 정보가 없습니다.' }), { status: 400 });
  }

  const data = readFileSync(DB_PATH, 'utf-8');
  const users = JSON.parse(data);
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return new Response(JSON.stringify({ error: '이메일 또는 비밀번호가 틀렸습니다.' }), { status: 401 });
  }

  return new Response(JSON.stringify({ message: '로그인 성공', user }), { status: 200 });
}