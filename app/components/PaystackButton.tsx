'use client';

import { usePaystackPayment } from 'react-paystack';

interface PaystackButtonProps {
  email: string;
  amount: number; // amount in Naira (e.g. 5000 for ₦5,000)
  orderId: string;
  onSuccess: (reference: string) => void;
  onClose?: () => void;
}

export default function PaystackButton({
  email,
  amount,
  orderId,
  onSuccess,
  onClose,
}: PaystackButtonProps) {
  const config = {
    reference: orderId,
    email: email,
    amount: Math.round(amount * 100), // Paystack expects amount in kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string,
  };

  const initializePayment = usePaystackPayment(config);

  const handlePay = () => {
    initializePayment({
      onSuccess: (reference: { reference: string }) => {
        onSuccess(reference.reference);
      },
      onClose: () => {
        if (onClose) onClose();
      },
    });
  };

  return (
    <button
      onClick={handlePay}
      className="w-full bg-[#c9a24b] text-black font-medium py-3 rounded-lg hover:bg-[#b8913f] transition"
    >
      Pay Now
    </button>
  );
}