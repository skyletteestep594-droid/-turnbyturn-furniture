'use client'

import { usePaystackPayment } from 'react-paystack'

type PaystackButtonProps = {
  email: string
  amount: number
  publicKey: string
  disabled: boolean
  label: string
  onSuccess: (reference: string) => void
  onClose: () => void
}

export default function PaystackButton({ email, amount, publicKey, disabled, label, onSuccess, onClose }: PaystackButtonProps) {
  const config = {
    reference: new Date().getTime().toString(),
    email,
    amount,
    publicKey,
  }

  const initializePayment = usePaystackPayment(config)

  const handleClick = () => {
    initializePayment({
      onSuccess: (response: { reference: string }) => onSuccess(response.reference),
      onClose,
    })
  }

  return (
    <button type="button" onClick={handleClick} disabled={disabled} className="bg-[#c9a24b] text-black py-3 font-medium hover:bg-[#dab868] transition-colors mt-2 disabled:opacity-50 w-full">
      {label}
    </button>
  )
}