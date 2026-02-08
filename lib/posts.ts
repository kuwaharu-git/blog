import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  like_count?: number;
}

interface PostFrontMatter {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

// Ensure posts directory exists
if (!fs.existsSync(postsDirectory)) {
  fs.mkdirSync(postsDirectory, { recursive: true });
}

// Get all post IDs
export function getAllPostIds(): number[] {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const fileContents = fs.readFileSync(path.join(postsDirectory, fileName), 'utf8');
      const { data } = matter(fileContents);
      return (data as PostFrontMatter).id;
    })
    .sort((a, b) => b - a); // Sort by ID descending
}

// Get a single post by ID
export function getPostById(id: number): Post | null {
  const fileNames = fs.readdirSync(postsDirectory);
  
  for (const fileName of fileNames) {
    if (!fileName.endsWith('.md')) continue;
    
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const frontMatter = data as PostFrontMatter;
    
    if (frontMatter.id === id) {
      return {
        id: frontMatter.id,
        title: frontMatter.title,
        content: content.trim(),
        created_at: frontMatter.created_at,
        updated_at: frontMatter.updated_at,
      };
    }
  }
  
  return null;
}

// Get all posts
export function getAllPosts(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const posts: Post[] = [];
  
  for (const fileName of fileNames) {
    if (!fileName.endsWith('.md')) continue;
    
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const frontMatter = data as PostFrontMatter;
    
    posts.push({
      id: frontMatter.id,
      title: frontMatter.title,
      content: content.trim(),
      created_at: frontMatter.created_at,
      updated_at: frontMatter.updated_at,
    });
  }
  
  // Sort by created_at descending (newest first)
  return posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

// Create a new post
export function createPost(title: string, content: string): Post {
  const ids = getAllPostIds();
  const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
  const now = new Date().toISOString();
  
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
  
  const fileName = `${newId}-${slug}.md`;
  const filePath = path.join(postsDirectory, fileName);
  
  const frontMatter = {
    id: newId,
    title,
    created_at: now,
    updated_at: now,
  };
  
  const fileContent = matter.stringify(content, frontMatter);
  fs.writeFileSync(filePath, fileContent, 'utf8');
  
  return {
    id: newId,
    title,
    content,
    created_at: now,
    updated_at: now,
  };
}
