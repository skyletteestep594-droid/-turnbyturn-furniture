import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DeleteCategoryButton from './DeleteCategoryButton'
import AddCategoryForm from './AddCategoryForm'

export default async function AdminCategories() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/admin/login')
  }

  const { data: categories } = await supabase.from('categories').select('*').order('created_at')

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f1e8] p-10">
      <h1 className="font-display text-3xl mb-8">Categories</h1>
      <AddCategoryForm />
      <div className="border border-[#c9a24b]/20 mt-8">
        {categories?.map((category) => (
          <div key={category.id} className="flex items-center justify-between p-4 border-b border-[#c9a24b]/10 last:border-b-0">
            <p className="font-medium">{category.name} {category.image_url && '📷'}</p>
            <div className="flex gap-3">
              <Link href={`/admin/categories/${category.id}/edit`} className="text-[#c9a24b] text-sm hover:underline">Edit</Link>
              <DeleteCategoryButton categoryId={category.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}