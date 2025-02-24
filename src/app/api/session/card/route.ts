import { NextResponse } from "next/server";
import { saveCardToSession } from "@/lib/actions";
import { Card } from "@/lib/actions";

export async function POST(request: Request) {
  try {
    const card: Card = await request.json();
    await saveCardToSession(card);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save card:", error);
    return NextResponse.json(
      { error: "カードの保存に失敗しました。" },
      { status: 500 }
    );
  }
}
