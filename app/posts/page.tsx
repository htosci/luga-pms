// app/posts/page.tsx
import { createClient } from '@/utils/supabase/client'

export default async function PostsPage() {
  const supabase = await createClient()

  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return <p className="text-red-500">Ошибка загрузки: {error.message}</p>
  }

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Посты</h1>
      <ul className="space-y-4">
        {posts?.map((post) => (
          <li key={post.id} className="p-4 border rounded shadow-sm">
            <h2 className="font-semibold">{post.name}</h2>
            <p className="text-gray-700">{post.content}</p>
            <p className="text-xs text-gray-400">{post.created_at}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}

