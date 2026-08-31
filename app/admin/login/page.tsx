'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <form onSubmit={handleLogin} className="bg-[#141414] border border-[#c9a24b]/20 p-10 w-full max-w-sm">
        <h1 className="font-display text-2xl text-[#f5f1e8] mb-6 text-center">Admin Login</h1>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <label className="block text-sm text-[#9a9a9a] mb-1">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black border border-[#c9a24b]/20 px-3 py-2 text-white mb-4" required />
        <label className="block text-sm text-[#9a9a9a] mb-1">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black border border-[#c9a24b]/20 px-3 py-2 text-white mb-6" required />
        <button type="submit" className="w-full bg-[#c9a24b] text-black py-2 font-medium hover:bg-[#dab868] transition-colors">Log In</button>
      </form>
    </div>
  );
}