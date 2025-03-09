"use client";

import { useEffect, useRef } from "react";
import { Card } from "@/types";
import { saveCardToSession } from "@/lib/actions";

interface SaveCardProps {
  card: Card;
  isFirstVisit?: boolean;
  skipSave?: boolean;
}

export default function SaveCard({
  card,
  isFirstVisit = true,
  skipSave = false,
}: SaveCardProps) {
  console.log("SaveCard component received card:", JSON.stringify(card)); // デバッグ用
  console.log("isReversed in card:", card.isReversed); // デバッグ用
  console.log("isFirstVisit:", isFirstVisit); // デバッグ用

  // 保存が完了したかどうかを追跡するためのref
  const savedRef = useRef(false);

  // cardのisReversedが変更された場合に保存を再実行するために、前回のisReversed値を保持
  const prevIsReversedRef = useRef(card.isReversed);

  const saveSession = async () => {
    try {
      // サーバーアクションを使用してカードデータを保存
      console.log("Using server action to save card"); // デバッグ用
      console.log("hasVisited will be set to:", !isFirstVisit); // デバッグ用
      await saveCardToSession(card, !isFirstVisit);
      console.log("Server action completed"); // デバッグ用

      // 保存が完了したことを記録
      savedRef.current = true;
    } catch (error) {
      console.error("Failed to save session using server action:", error);
    }
  };

  useEffect(() => {
    // skipSaveがtrueの場合は何もしない
    if (skipSave) {
      console.log("Skipping save due to skipSave flag"); // デバッグ用
      return;
    }

    // 既に保存済みで、かつisReversedが変更されていない場合は何もしない
    if (savedRef.current && prevIsReversedRef.current === card.isReversed) {
      console.log("Already saved and isReversed hasn't changed"); // デバッグ用
      return;
    }

    // isReversedの値を更新
    prevIsReversedRef.current = card.isReversed;

    saveSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipSave, card.id, card.isReversed, isFirstVisit]); // card.isReversedを依存配列に追加

  return null;
}
