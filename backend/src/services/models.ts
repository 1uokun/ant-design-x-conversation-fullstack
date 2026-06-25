import type { Env } from "../env";

type UpstreamModelsResponse = {
  data?: Array<{ id?: string }>;
};

const CACHE_TTL_MS = 5 * 60 * 1000;

let cachedIds: string[] | null = null;
let cacheExpiresAt = 0;

function getModelsUrl(baseUrl: string): string {
  const normalized = baseUrl.replace(/\/$/, "");
  return normalized.endsWith("/v1") ? `${normalized}/models` : `${normalized}/v1/models`;
}

export async function listUpstreamModelIds(env: Env): Promise<string[]> {
  const now = Date.now();
  if (cachedIds && now < cacheExpiresAt) {
    return cachedIds;
  }

  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY 未配置");
  }

  const baseUrl = env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const upstream = await fetch(getModelsUrl(baseUrl), {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
  });

  if (!upstream.ok) {
    const errText = await upstream.text();
    throw new Error(errText || `upstream ${upstream.status}`);
  }

  const payload = (await upstream.json()) as UpstreamModelsResponse;
  const ids = (payload.data ?? [])
    .map((item) => item.id)
    .filter((id): id is string => typeof id === "string" && id.length > 0);

  cachedIds = ids;
  cacheExpiresAt = now + CACHE_TTL_MS;
  return ids;
}
