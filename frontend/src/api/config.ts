/** 本地开发默认走 Vite 代理；GitHub Pages 构建时通过 VITE_API_BASE 指向 Workers */
const rawBase = import.meta.env.VITE_API_BASE || "/api/v1";

export const API_BASE = rawBase.replace(/\/$/, "");
export const CHAT_API_PATH = `${API_BASE}/chat`;
