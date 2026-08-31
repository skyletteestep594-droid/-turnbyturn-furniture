'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DeleteCategoryButton({ categoryId }: { categoryId: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    const confirmed = confirm('Delete this category?')
    if (!confirmed) return
    const supabase = createClient()
    await supabase.from('categories').delete().eq('id', categoryId)
    router.refresh()
  }

  return (
    <button onClick={handleDelete} className="text-red-400 text-sm hover:underline">Delete</button>
  );
}