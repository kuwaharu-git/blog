import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAllPosts, createPost } from '@/lib/posts';

export async function GET() {
  try {
    // Get all posts from markdown files
    const posts = getAllPosts();
    
    // Get like counts from database for each post
    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        const [rows]: any = await pool.query(
          'SELECT COUNT(*) as like_count FROM likes WHERE post_id = ?',
          [post.id]
        );
        return {
          ...post,
          like_count: rows[0]?.like_count || 0,
        };
      })
    );
    
    return NextResponse.json(postsWithLikes);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, content } = await request.json();
    
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }
    
    // Create post in markdown file
    const post = createPost(title, content);
    
    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
