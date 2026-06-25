const BASE_PATH = import.meta.env.BASE_URL.replace(/\/?$/, "");

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** 从当前 pathname 解析 sessionId；`/chat` 或根路径返回 null */
export function getSessionIdFromPath(
  pathname = window.location.pathname,
): string | null {
  const chatRoot = new RegExp(`^${escapeRegExp(BASE_PATH)}/chat/?$`);
  if (
    chatRoot.test(pathname) ||
    pathname === BASE_PATH ||
    pathname === `${BASE_PATH}/`
  ) {
    return null;
  }

  const chatSession = new RegExp(`^${escapeRegExp(BASE_PATH)}/chat/([^/]+)/?$`);
  const match = pathname.match(chatSession);
  if (!match?.[1]) return null;

  return decodeURIComponent(match[1]);
}

export function buildChatPath(sessionId?: string | null): string {
  if (!sessionId) {
    return `${BASE_PATH}/chat`.replace(/\/{2,}/g, "/") || "/chat";
  }
  return `${BASE_PATH}/chat/${sessionId}`.replace(/\/{2,}/g, "/");
}

export function syncChatPath(
  sessionId: string | null | undefined,
  method: "push" | "replace" = "replace",
): void {
  const nextPath = buildChatPath(sessionId);
  if (window.location.pathname === nextPath) return;

  if (method === "replace") {
    window.history.replaceState(null, "", nextPath);
  } else {
    window.history.pushState(null, "", nextPath);
  }
}

export function ensureChatRootPath(): void {
  if (getSessionIdFromPath()) return;
  const chatRoot = buildChatPath();
  if (window.location.pathname === chatRoot) return;
  syncChatPath(null);
}
