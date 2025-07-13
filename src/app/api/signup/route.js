//app/api/signup/route.js

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'src', 'data');
const DB_PATH = join(DATA_DIR, 'users.json');

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    let users = [];

    // 폴더 없으면 생성
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true });
    }

    if (existsSync(DB_PATH)) {
      const data = readFileSync(DB_PATH, 'utf-8');
      users = JSON.parse(data || '[]');
    }

    const emailExists = users.find((u) => u.email === email);
    if (emailExists) {
      return new Response(JSON.stringify({ error: '이미 가입된 이메일입니다.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 새로운 id 생성
    const newId = users.length > 0 ? Math.max(...users.map(u => Number(u.id))) + 1 : 0;

    // id 포함해서 user 생성
    const newUser = { id: String(newId), name, email, password };

    users.push(newUser);
    writeFileSync(DB_PATH, JSON.stringify(users, null, 2));

    return new Response(JSON.stringify({ message: '회원가입 성공', user: newUser }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('에러:', err);
    return new Response(JSON.stringify({ error: '서버 오류' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


/*import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'src', 'data');
const DB_PATH = join(DATA_DIR, 'users.json');

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    const newUser = {id: String(newId), name, email, password };

    // data 폴더가 없으면 생성
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true });
    }

    let users = [];
    if (existsSync(DB_PATH)) {
      const data = readFileSync(DB_PATH, 'utf-8');
      users = JSON.parse(data || '[]');
    }

    const emailExists = users.find((u) => u.email === email);
    if (emailExists) {
      return new Response(JSON.stringify({ error: '이미 가입된 이메일입니다.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id || 0)) + 1 : 1;
    users.push(newUser);
    writeFileSync(DB_PATH, JSON.stringify(users, null, 2));

    return new Response(JSON.stringify({ message: '회원가입 성공' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('에러:', err);
    return new Response(JSON.stringify({ error: '서버 오류' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
*/
