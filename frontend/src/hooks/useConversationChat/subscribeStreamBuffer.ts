import { API_BASE } from "../../api/config";

function extractDeltaContent(sseData: string): string | null {
  try {
    const json = JSON.parse(sseData) as {
      choices?: Array<{ delta?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.delta?.content;
    if (!content) return null;
    return content;
  } catch {
    return null;
  }
}

export type SubscribeStreamBufferHandlers = {
  onUpdate: (accumulated: string) => void;
  onDone: () => void;
  onError: (error: Error) => void;
};

/** 刷新后订阅 GET /chat/stream-buffer（SSE），offset 为已有文本长度 */
export async function subscribeStreamBuffer(
  sessionId: string,
  messageId: string,
  initialText: string,
  handlers: SubscribeStreamBufferHandlers,
  signal?: AbortSignal,
): Promise<void> {
  const offset = initialText.length;
  const url = `${API_BASE}/chat/stream-buffer?sessionId=${encodeURIComponent(sessionId)}&messageId=${encodeURIComponent(messageId)}&offset=${offset}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "text/event-stream" },
    signal,
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(errText || `subscribe stream-buffer failed: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("subscribe stream-buffer body empty");
  }

  const decoder = new TextDecoder();
  let lineBuffer = "";
  let accumulated = initialText;
  let eventName = "message";
  let dataLines: string[] = [];

  const flushEvent = () => {
    if (!dataLines.length) {
      eventName = "message";
      return;
    }
    const data = dataLines.join("\n");
    dataLines = [];

    if (eventName === "error") {
      handlers.onError(new Error(data || "stream error"));
      return;
    }

    if (data === "[DONE]") {
      handlers.onDone();
      return;
    }

    const delta = extractDeltaContent(data);
    if (delta) {
      accumulated += delta;
      handlers.onUpdate(accumulated);
    }
    eventName = "message";
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      lineBuffer += decoder.decode(value, { stream: true });
      const lines = lineBuffer.split("\n");
      lineBuffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trimEnd();
        if (!trimmed) {
          flushEvent();
          continue;
        }
        if (trimmed.startsWith("event:")) {
          eventName = trimmed.slice("event:".length).trim();
          continue;
        }
        if (trimmed.startsWith("data:")) {
          dataLines.push(trimmed.slice("data:".length).trimStart());
        }
      }
    }
    flushEvent();
  } catch (err) {
    if (signal?.aborted) return;
    throw err;
  }
}
