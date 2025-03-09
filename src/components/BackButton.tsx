"use client";

import { useRouter } from "next/navigation";
import { sessionAPI } from "@/lib/client";

interface BackButtonProps {
  id: string;
}

export default function BackButton({ id }: BackButtonProps) {
  const router = useRouter();

  const handleBack = async () => {
    // hasVisitedフラグをtrueに設定して保存
    try {
      const response = await sessionAPI.saveSession({
        hasVisited: true,
      });

      if (!response.ok) {
        console.error("セッションの保存に失敗しました");
      }
    } catch (error) {
      console.error("セッションの保存に失敗:", error);
    }

    // 保存後にページ遷移
    router.replace(`/reading/${id}`);
  };

  return (
    <button
      onClick={handleBack}
      className="inline-block mb-8 text-purple-300 hover:text-purple-100 transition duration-300"
    >
      戻る
    </button>
  );
}
