'use client';

import { usePaystackPayment } from 'react-paystack';

interface PaystackCheckoutButtonProps {
  email: string;
  amount: number;
  publicKey: string;
  disabled: boolean;
  loading: boolean;
  onSuccess: (reference: any) => void;
  onClose: () => void;
}

export default function PaystackCheckoutButton({
  email,
  amount,
  publicKey,
  disabled,
  loading,
  onSuccess,
  onClose,
}: PaystackCheckoutButtonProps) {
  const config = {
    reference: new Date().getTime().toString(),
    email,
    amount,
    publicKey,
  };

  const initializePayment = usePaystackPayment(config);

  const handleClick = () => {
    initializePayment({ onSuccess, onClose });
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className="w-full bg-[#c9a24b] text-black font-semibold py-3 rounded disabled:opacity-50"
    >
      {loading ? 'Processing...' : 'Pay Now'}
    </button>
  );
}