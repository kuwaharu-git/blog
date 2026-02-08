import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { post_id, user_id } = await request.json();
    
    if (!post_id || !user_id) {
      return NextResponse.json({ error: 'post_id and user_id are required' }, { status: 400 });
    }
    
    const [result] = await pool.query(
      'INSERT INTO likes (post_id, user_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE post_id = post_id',
      [post_id, user_id]
    );
    
    return NextResponse.json({ success: true, result }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to add like' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { post_id, user_id } = await request.json();
    
    if (!post_id || !user_id) {
      return NextResponse.json({ error: 'post_id and user_id are required' }, { status: 400 });
    }
    
    const [result] = await pool.query(
      'DELETE FROM likes WHERE post_id = ? AND user_id = ?',
      [post_id, user_id]
    );
    
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to remove like' }, { status: 500 });
  }
}
