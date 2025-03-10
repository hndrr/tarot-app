"use client";

import { useRouter } from "next/navigation";

export const BackButton = ({ label = "戻る" }: { label?: string }) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-block mb-8 text-purple-300 hover:text-purple-100 transition duration-300"
    >
      {label}
    </button>
  );
};
