import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getPostById } from '@/lib/posts';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = parseInt(id, 10);
    
    if (isNaN(postId)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }
    
    // Get post from markdown file
    const post = getPostById(postId);
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // Get like count from database
    const [rows]: any = await pool.query(
      'SELECT COUNT(*) as like_count FROM likes WHERE post_id = ?',
      [postId]
    );
    
    const postWithLikes = {
      ...post,
      like_count: rows[0]?.like_count || 0,
    };
    
    return NextResponse.json(postWithLikes);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}
