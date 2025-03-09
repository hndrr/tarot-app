"use client";

import { useEffect, useRef, useState } from "react";
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
  // 保存状態を管理するためのstate
  const [isSaved, setIsSaved] = useState(false);
  // 保存試行回数を追跡
  const saveAttemptRef = useRef(0);
  // マウント状態を追跡
  const isMountedRef = useRef(true);

  // カードデータの検証
  const isValidCard = card && card.id;

  console.log(
    "SaveCard component received card:",
    isValidCard ? JSON.stringify(card) : "invalid card"
  ); // デバッグ用

  const saveSession = async () => {
    if (!isValidCard) return;

    try {
      // 保存試行回数をインクリメント
      saveAttemptRef.current += 1;
      console.log(`保存試行回数: ${saveAttemptRef.current}`);

      // カードデータを準備（isReversedを確実に真偽値に変換）
      const cardToSave: Card = {
        ...card,
        isReversed: Boolean(card.isReversed),
        position: Boolean(card.isReversed) ? "reversed" : "upright",
      };

      console.log("Saving card with data:", JSON.stringify(cardToSave)); // デバッグ用
      console.log(
        "typeof cardToSave.isReversed:",
        typeof cardToSave.isReversed
      ); // デバッグ用

      // サーバーアクションを使用してカードデータを保存
      console.log("Using server action to save card"); // デバッグ用
      console.log("hasVisited will be set to:", !isFirstVisit); // デバッグ用
      const result = await saveCardToSession(cardToSave, !isFirstVisit);
      console.log("Server action completed, result:", result); // デバッグ用

      // コンポーネントがまだマウントされている場合のみ状態を更新
      if (isMountedRef.current) {
        setIsSaved(true);
        console.log("Card saved successfully");
      }
    } catch (error) {
      console.error("Failed to save session using server action:", error);
      // コンポーネントがまだマウントされていて、最大3回まで再試行
      if (isMountedRef.current && saveAttemptRef.current < 3) {
        console.log(
          `保存に失敗しました。再試行します (${saveAttemptRef.current}/3)`
        );
        setTimeout(saveSession, 1000); // 1秒後に再試行（時間を長くした）
      }
    }
  };

  useEffect(() => {
    // コンポーネントがマウントされたことを記録
    isMountedRef.current = true;

    // 無効なカードデータまたはskipSaveがtrueの場合は何もしない
    if (!isValidCard || skipSave) {
      console.log("Skipping save due to invalid card or skipSave flag"); // デバッグ用
      return;
    }

    if (isValidCard) {
      console.log("isReversed in card:", card.isReversed); // デバッグ用
      console.log("typeof isReversed:", typeof card.isReversed); // デバッグ用
      console.log("position in card:", card.position); // デバッグ用
    }

    console.log("isFirstVisit:", isFirstVisit); // デバッグ用
    console.log("skipSave:", skipSave); // デバッグ用

    // まだ保存されていない場合のみ保存を実行
    if (!isSaved) {
      console.log("カードデータをセッションに保存します");
      // 少し遅延させて実行（レンダリング完了後に実行されるようにする）
      const timeoutId = setTimeout(saveSession, 100);
      return () => clearTimeout(timeoutId);
    } else {
      console.log("カードは既に保存されています");
    }

    // コンポーネントのアンマウント時に実行されるクリーンアップ関数
    return () => {
      console.log("SaveCardコンポーネントがアンマウントされました");
      isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipSave, card, isSaved, isFirstVisit, isValidCard]); // 依存配列を修正

  // 無効なカードデータの場合は早期リターン
  if (!isValidCard) {
    console.error("SaveCard: Invalid card data received:", card);
    return null;
  }

  // このコンポーネントは表示要素を持たない
  return null;
}
