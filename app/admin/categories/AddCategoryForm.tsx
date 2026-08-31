'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AddCategoryForm() {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setUploading(true)
    const supabase = createClient()

    let imageUrl = null

    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`
      const { error: uploadError } = await supabase.storage.from('images').upload(fileName, imageFile)
      if (uploadError) {
        setError(uploadError.message)
        setUploading(false)
        return
      }
      const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(fileName)
      imageUrl = publicUrlData.publicUrl
    }

    const { error } = await supabase.from('categories').insert({ name, slug, image_url: imageUrl })
    setUploading(false)
    if (error) {
      setError(error.message)
    } else {
      setName('')
      setSlug('')
      setImageFile(null)
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl">
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-sm text-[#9a9a9a] mb-1">Category Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#141414] border border-[#c9a24b]/20 px-3 py-2 text-white" required />
        </div>
        <div className="flex-1">
          <label className="block text-sm text-[#9a9a9a] mb-1">Slug</label>
          <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full bg-[#141414] border border-[#c9a24b]/20 px-3 py-2 text-white" required />
        </div>
      </div>
      <div>
        <label className="block text-sm text-[#9a9a9a] mb-1">Category Photo</label>
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="w-full bg-[#141414] border border-[#c9a24b]/20 px-3 py-2 text-white" />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button type="submit" disabled={uploading} className="bg-[#c9a24b] text-black px-6 py-2 font-medium hover:bg-[#dab868] transition-colors disabled:opacity-50 w-fit">{uploading ? 'Adding...' : 'Add'}</button>
    </form>
  );
}