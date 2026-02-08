import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.id,
        p.title,
        p.content,
        p.created_at,
        COUNT(l.id) as like_count
      FROM posts p
      LEFT JOIN likes l ON p.id = l.post_id
      GROUP BY p.id, p.title, p.content, p.created_at
      ORDER BY p.created_at DESC
    `);
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, content } = await request.json();
    
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }
    
    const [result] = await pool.query(
      'INSERT INTO posts (title, content) VALUES (?, ?)',
      [title, content]
    );
    
    return NextResponse.json({ success: true, result }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
