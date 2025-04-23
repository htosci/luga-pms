'use client'; // Обязательно — для использования хуков в Next.js App Router

import { useRouter } from 'next/navigation';

type Props = {
  to: string;
  label: string;
};

export default function NavigateButton({ to, label }: Props) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(to)}
      className="p-2 bg-blue-500 text-white rounded"
    >
      {label}
    </button>
  );
}
