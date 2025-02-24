import { Hono } from "hono";
import { handle } from "hono/vercel";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { createSession, getSession } from "@/lib/actions";

// APIの型定義
const api = new Hono().basePath("/api/session");

// セッション作成のスキーマ
const createSessionSchema = z.object({
  userId: z.string(),
  readingType: z.enum(["daily", "weekly", "monthly"]),
});

// セッション作成のエンドポイント
api.post("/", zValidator("json", createSessionSchema), async (c) => {
  const data = c.req.valid("json");

  try {
    // セッション作成のロジック
    const session = await createSession(data);
    return c.json(session, 201);
  } catch (error) {
    console.error("Create session error:", error);
    return c.json({ error: "Failed to create session" }, 500);
  }
});

// セッション取得のエンドポイント
api.get("/:id", async (c) => {
  const id = c.req.param("id");

  try {
    const session = await getSession(id);
    if (!session) {
      return c.json({ error: "Session not found" }, 404);
    }
    return c.json(session);
  } catch (error) {
    console.error("Get session error:", error);
    return c.json({ error: "Failed to get session" }, 500);
  }
});

export const GET = handle(api);
export const POST = handle(api);
