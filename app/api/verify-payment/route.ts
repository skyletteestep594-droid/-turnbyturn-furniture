import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { reference, orderId } = await request.json()

    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    )
    const verifyData = await verifyResponse.json()

    if (verifyData.status && verifyData.data.status === 'success') {
      const supabase = await createClient()
      await supabase.from('orders').update({ payment_status: 'paid' }).eq('id', orderId)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, message: 'Payment not verified' }, { status: 400 })
  } catch (error) {
    console.error('Payment verification failed:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}