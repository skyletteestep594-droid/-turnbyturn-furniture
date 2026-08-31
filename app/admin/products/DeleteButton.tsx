'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DeleteButton({ productId }: { productId: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete this product?')
    if (!confirmed) return

    const supabase = createClient()
    await supabase.from('products').delete().eq('id', productId)
    router.refresh()
  }

  return (
    <button onClick={handleDelete} className="text-red-400 text-sm hover:underline">Delete</button>
  );
}