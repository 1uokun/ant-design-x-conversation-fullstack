export type ChatModelTag = "default" | "new" | "code";

export type ChatModelOption = {
  /** 传给 /api/v1/chat 的 modelName */
  modelName: string;
  label: string;
  description: string;
  tags?: ChatModelTag[];
};

export const CHAT_MODELS: ChatModelOption[] = [
  {
    modelName: "deepseek-chat",
    label: "Qwen3.7-千问",
    description: "综合 AI 助手，全面回答工作、学习、生活各类问题",
    tags: ["default"],
  },
  {
    modelName: "deepseek-reasoner",
    label: "Qwen3.7-Max",
    description: "千问最新旗舰模型，擅长代码编写，处理复杂任务",
    tags: ["new"],
  },
  {
    modelName: "deepseek-chat",
    label: "Qwen3.5-Flash",
    description: "适用于简单任务，响应速度快",
  },
  {
    modelName: "deepseek-chat",
    label: "Qwen3-Max",
    description: "适用于日常通用型任务，综合能力均衡",
  },
  {
    modelName: "deepseek-reasoner",
    label: "Qwen3-Max-Thinking",
    description: "适用于多步骤推理与问题分析",
  },
  {
    modelName: "deepseek-coder",
    label: "Qwen3-Coder",
    description: "适用于代码生成与编程任务执行",
    tags: ["code"],
  },
];

/** UI 选项唯一 key（同 modelName 多选项时区分存储） */
export function getChatModelKey(model: ChatModelOption): string {
  return `${model.modelName}::${model.label}`;
}

export function findChatModelByKey(key: string): ChatModelOption | undefined {
  return CHAT_MODELS.find((item) => getChatModelKey(item) === key);
}

export function resolveChatModelName(key: string, fallback = CHAT_MODELS[0].modelName): string {
  return findChatModelByKey(key)?.modelName ?? fallback;
}

export const DEFAULT_CHAT_MODEL_KEY = getChatModelKey(CHAT_MODELS[0]);

export const CHAT_MODEL_STORAGE_KEY = "chat-selected-model-key";
