import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  content: string;
  like_count: number;
  created_at: string;
}

async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/posts`, {
    cache: 'no-store',
  });
  
  if (!res.ok) {
    return [];
  }
  
  return res.json();
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">ブログ</h1>
        
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <Link href={`/posts/${post.id}`}>
                <h2 className="text-2xl font-semibold mb-2 hover:text-blue-600 dark:hover:text-blue-400">
                  {post.title}
                </h2>
              </Link>
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {post.content}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
                <span>{new Date(post.created_at).toLocaleDateString('ja-JP')}</span>
                <span className="flex items-center gap-1">
                  ❤️ {post.like_count}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {posts.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">投稿がありません</p>
        )}
      </main>
    </div>
  );
}
