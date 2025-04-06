import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongodb';
import { authOptions } from '../auth/[...nextauth]/auth.config'; // Corrected import path

export async function GET() {
  const { db } = await dbConnect();
  const about = await db.collection('about').findOne({}) || { content: '' };
  return NextResponse.json(about);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const { db } = await dbConnect();
  const { content } = await req.json();
  await db.collection('about').updateOne(
    {},
    { $set: { content } },
    { upsert: true }
  );
  const about = await db.collection('about').findOne({});
  return NextResponse.json(about);
}