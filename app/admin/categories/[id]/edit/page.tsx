'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function EditCategory() {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [currentImageUrl, setCurrentImageUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const loadCategory = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('categories').select('*').eq('id', params.id).single()
      if (data) {
        setName(data.name)
        setSlug(data.slug)
        setCurrentImageUrl(data.image_url ?? '')
      }
      setLoading(false)
    }
    loadCategory()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setUploading(true)
    const supabase = createClient()

    let imageUrl = currentImageUrl

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

    const { error } = await supabase.from('categories').update({ name, slug, image_url: imageUrl }).eq('id', params.id)
    setUploading(false)
    if (error) {
      setError(error.message)
    } else {
      router.push('/admin/categories')
      router.refresh()
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0a] text-[#f5f1e8] p-10">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f1e8] p-10">
      <h1 className="font-display text-3xl mb-8">Edit Category</h1>
      {error && <p className="text-red-400 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="max-w-lg flex flex-col gap-4">
        <div>
          <label className="block text-sm text-[#9a9a9a] mb-1">Category Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#141414] border border-[#c9a24b]/20 px-3 py-2 text-white" required />
        </div>
        <div>
          <label className="block text-sm text-[#9a9a9a] mb-1">Slug</label>
          <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full bg-[#141414] border border-[#c9a24b]/20 px-3 py-2 text-white" required />
        </div>
        <div>
          <label className="block text-sm text-[#9a9a9a] mb-1">Category Photo {currentImageUrl && '(currently has one — upload a new one to replace it)'}</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="w-full bg-[#141414] border border-[#c9a24b]/20 px-3 py-2 text-white" />
        </div>
        <button type="submit" disabled={uploading} className="bg-[#c9a24b] text-black py-3 font-medium hover:bg-[#dab868] transition-colors mt-2 disabled:opacity-50">{uploading ? 'Saving...' : 'Save Changes'}</button>
      </form>
    </div>
  );
}