import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/auth.config'; // Corrected import path

import dbConnect from '@/lib/mongodb';

export async function GET() {
  const { db } = await dbConnect();
  const faqs = await db.collection('faq').find().toArray();
  return NextResponse.json(faqs);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const { db } = await dbConnect();
  const data = await req.json();
  const result = await db.collection('faq').insertOne(data);
  return NextResponse.json({ _id: result.insertedId, ...data }, { status: 201 });
}