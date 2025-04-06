import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  const { db } = await dbConnect();
  const users = [
    { username: 'admin', password: await bcrypt.hash('admin123', 10), role: 'admin' },
    { username: 'user', password: await bcrypt.hash('user123', 10), role: 'simple' },
  ];
  await db.collection('users').deleteMany({});
  await db.collection('users').insertMany(users);
  return NextResponse.json({ message: 'Users seeded' });
}