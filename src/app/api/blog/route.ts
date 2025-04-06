import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongodb';
import { authOptions } from '../auth/[...nextauth]/auth.config'; // Corrected import path

// Define the Blog type (for TypeScript)
interface Blog {
  _id: string;
  title: string;
  content: string;
  date: string;
  imageUrl: string;
}

export async function GET() {
  try {
    const { db } = await dbConnect();
    const blogs = await db.collection('blogs').find().toArray();
    // Convert MongoDB ObjectId to string for JSON serialization
    const formattedBlogs = blogs.map((blog) => ({
      ...blog,
      _id: blog._id.toString(),
    }));
    return NextResponse.json(formattedBlogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check for authenticated session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Parse the request body
    const data = await req.json();

    // Validate required fields
    const { title, content, imageUrl } = data;
    if (!title || !content || !imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, and imageUrl are required' },
        { status: 400 }
      );
    }

    // Add a date field if not provided
    const blogData: Omit<Blog, '_id'> = {
      title,
      content,
      imageUrl,
      date: new Date().toISOString(),
    };

    // Insert the blog into the database
    const { db } = await dbConnect();
    const result = await db.collection('blogs').insertOne(blogData);

    // Return the inserted blog with its ID
    const insertedBlog: Blog = {
      _id: result.insertedId.toString(),
      ...blogData,
    };
    return NextResponse.json(insertedBlog, { status: 201 });
  } catch (error) {
    console.error('Error adding blog:', error);
    return NextResponse.json({ error: 'Failed to add blog' }, { status: 500 });
  }
}