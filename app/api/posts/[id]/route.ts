import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [rows]: any = await pool.query(`
      SELECT 
        p.id,
        p.title,
        p.content,
        p.created_at,
        COUNT(l.id) as like_count
      FROM posts p
      LEFT JOIN likes l ON p.id = l.post_id
      WHERE p.id = ?
      GROUP BY p.id, p.title, p.content, p.created_at
    `, [id]);
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}
