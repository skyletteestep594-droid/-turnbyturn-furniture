import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { reference } = await request.json()

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
      return NextResponse.json({ verified: true, marker: 'TEST123' })
    }

    return NextResponse.json({ verified: false, message: 'Payment not verified' }, { status: 400 })
  } catch (error) {
    console.error('Payment verification failed:', error)
    return NextResponse.json({ verified: false }, { status: 500 })
  }
}