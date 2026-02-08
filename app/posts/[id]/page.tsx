'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Post {
  id: number;
  title: string;
  content: string;
  like_count: number;
  created_at: string;
}

export default function PostPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [liked, setLiked] = useState(false);
  const [userId] = useState(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('userId');
      if (!id) {
        id = `user_${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem('userId', id);
      }
      return id;
    }
    return '';
  });

  useEffect(() => {
    if (params.id) {
      fetch(`/api/posts/${params.id}`)
        .then(res => res.json())
        .then(data => setPost(data))
        .catch(console.error);
    }
  }, [params.id]);

  const handleLike = async () => {
    if (!post) return;

    try {
      if (liked) {
        await fetch('/api/likes', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ post_id: post.id, user_id: userId }),
        });
        setPost({ ...post, like_count: post.like_count - 1 });
        setLiked(false);
      } else {
        await fetch('/api/likes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ post_id: post.id, user_id: userId }),
        });
        setPost({ ...post, like_count: post.like_count + 1 });
        setLiked(true);
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen p-8 pb-20 sm:p-20">
        <div className="max-w-4xl mx-auto">
          <p>読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <main className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">
          ← 戻る
        </Link>
        
        <article className="border border-gray-300 dark:border-gray-700 rounded-lg p-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            {new Date(post.created_at).toLocaleDateString('ja-JP')}
          </div>
          
          <div className="prose dark:prose-invert max-w-none mb-8">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>
          
          <div className="flex items-center gap-4 pt-6 border-t border-gray-300 dark:border-gray-700">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                liked
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <span>{liked ? '❤️' : '🤍'}</span>
              <span>{post.like_count}</span>
            </button>
          </div>
        </article>
      </main>
    </div>
  );
}
