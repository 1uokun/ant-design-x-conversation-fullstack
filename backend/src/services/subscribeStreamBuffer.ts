import { getMessageByMessageId } from "../db";
import type { Env } from "../env";
import { createKvPollingSseStream } from "./pollingSse";

/** 刷新后订阅 KV 缓冲 SSE，不触发 prepareChat / Queue */
export async function handleStreamBufferSubscribe(
  env: Env,
  sessionId: string,
  messageId: string,
  textOffset: number,
): Promise<Response> {
  const message = await getMessageByMessageId(env.DB, messageId);
  if (!message || message.sessionId !== sessionId) {
    return new Response(JSON.stringify({ success: false, message: "消息不存在" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const readable = createKvPollingSseStream(env, sessionId, messageId, {
    textOffset: Math.max(0, textOffset),
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
