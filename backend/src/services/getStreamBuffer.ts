import { EventType, SourceType } from "../constants";
import { feedbackToApi, parseContent } from "../content";
import { getMessageByMessageId } from "../db";
import type { Env } from "../env";
import type { StreamBufferDto } from "../types";
import { readAll } from "./streamBuffer";

/** 轻量查询：单条消息终态（SSE 结束后 Accept: application/json 调用） */
export async function getStreamBuffer(
  env: Env,
  sessionId: string,
  messageId: string,
): Promise<StreamBufferDto | null> {
  const message = await getMessageByMessageId(env.DB, messageId);
  if (!message || message.sessionId !== sessionId) return null;

  let text = "";
  if (message.eventType === EventType.STREAMING) {
    text = await readAll(env.STREAM_KV, sessionId, messageId);
  } else {
    const row = await env.DB
      .prepare("SELECT content FROM agent_content WHERE sourceType = ? AND sourceId = ?")
      .bind(SourceType.ASSISTANT, message.responseId)
      .first<{ content: string | null }>();
    text = parseContent(row?.content)
      .map((item) => item.text)
      .filter(Boolean)
      .join("\n");
  }

  return {
    messageId: message.messageId,
    eventType: message.eventType,
    text,
    feedbackType: feedbackToApi(message.feedbackType),
  };
}
