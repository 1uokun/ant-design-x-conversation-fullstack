import { DEFAULT_MODEL } from "./types";

let activeModelName = DEFAULT_MODEL;

export const syncChatModelName = {
  read: () => activeModelName,
  write: (modelName: string) => {
    activeModelName = modelName;
  },
};
