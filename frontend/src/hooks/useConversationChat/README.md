# useConversationChat

在 `useXConversations` + `useXChat` 之上对接后端 API，`App.tsx` 的唯一入口。

## 功能概览

| 模块 | 做什么 | 涉及 |
|------|--------|------|
| URL 同步 | `/chat/:sessionId` ↔ 当前会话，支持前进后退 | `utils/route` |
| 会话列表 + 后端 | 拉取/删/改名会话，首条消息前本地草稿合并；仅新建会话时用首条内容前 15 字作 title | `useXConversations`、`adapters` |
| 消息聊天 | 流式对话、切换会话拉历史、失败/中止兜底 | `useXChat`、`provider` |
| 发送 / 中断 / 反馈 | 发送、停止生成、点赞点踩 | `abortChat`、`submitFeedback` |
| 消息操作 | 删除一轮对话、编辑用户消息后重新生成 | `deleteMessage`、`handleEditUserMessage` |
| 模型选择 | 当前会话模型 key / 名称，持久化到 localStorage | `config/chat-models`、`model-sync` |
| 排序整理 | 置顶 / 今天 / 昨天 / 日期分组排序 | `adapters` |

## 入参

| 参数 | 类型 | 说明 |
|------|------|------|
| `messageApi` | `MessageInstance` | antd `message.useMessage()` 返回值，用于错误提示 |

## 返回值

| 字段 | 类型 | 说明 | 传给 |
|------|------|------|------|
| `conversations` | `Conversation[]` | 分组排序后的会话列表 | `ConversationSide` |
| `activeConversationKey` | `string` | 当前选中会话 ID，空字符串表示新对话 | 侧边栏 / `ChatSender` / `ChatContext` |
| `selectConversation` | `(key: string) => void` | 切换会话 | `ConversationSide` |
| `messages` | `DefaultMessageInfo<AppChatMessage>[]` | 当前会话消息 | `ChatList` → `Bubble.List` |
| `isRequesting` | `boolean` | 是否正在流式生成 | `ChatSender` / `ModelSelector` |
| `isDefaultMessagesRequesting` | `boolean` | 是否正在加载历史消息 | `ChatList` |
| `modelKey` | `string` | 当前选中模型 key | `ModelSelector` |
| `modelName` | `string` | 当前模型 API 名称 | 内部发请求 |
| `setModelKey` | `(key: string) => void` | 切换模型 | `ModelSelector` |
| `onSubmit` | `(val: string) => void` | 发送用户消息 | `ChatSender` / `ChatWelcome` |
| `handleAbort` | `() => void` | 停止生成 | `ChatSender` onCancel |
| `onReload` | 包装后的 `useXChat.onReload` | 重新生成（带 messageId 校验） | `ChatContext` → `BubbleAssistant` |
| `setMessage` | `useXChat` 同名 | 更新单条消息（反馈、收起、编辑态等） | `ChatContext` → `BubbleUser` / `BubbleAssistant` |
| `handleFeedback` | `(messageId, 'good' \| 'bad') => void` | 提交点赞/点踩 | `ChatContext` |
| `handleDeleteMessage` | `(bubbleId) => Promise<void>` | 删除一轮对话（用户 + 助手） | `ChatContext` → `BubbleUser` |
| `handleToggleUserMessageEdit` | `(messageKey, editing) => void` | 切换用户消息编辑态 | `ChatContext` → `BubbleUser` |
| `handleCancelUserMessageEdit` | `(messageKey) => void` | 取消用户消息编辑 | `ChatContext` / `ChatList` |
| `handleEditUserMessage` | `(messageKey, content) => void` | 确认编辑并触发重新生成 | `ChatContext` / `ChatList` |
| `handleCreateConversation` | `() => void` | 新建会话（清空当前选中） | `ConversationSide` |
| `handleDeleteConversation` | `(key: string) => Promise<void>` | 删除会话 | `ConversationSide` |
| `handleRenameConversation` | `(key, title) => Promise<boolean>` | 重命名会话 | `ConversationSide` |
| `onRequest` | `useXChat` 同名 | 底层发请求，一般不用，优先 `onSubmit` | — |

另导出类型 `AppChatMessage`，供 `ChatList`、`BubbleUser`、`BubbleAssistant`、`ChatContext` 使用。

### `AppChatMessage.extraInfo`

| 字段 | 说明 |
|------|------|
| `feedback` | 助手消息点赞/点踩 UI 状态 |
| `userCanCollapse` | 用户消息是否超过收起高度阈值 |
| `userCollapsed` | 用户消息是否收起（默认 `false`，展开） |
| `editing` | 用户消息是否处于编辑态 |

### 最后一条消息的操作限制

`ChatList` 根据 `messages.at(-1)` 计算 `lastMessageKey` / `lastUserMessageKey`：

- **重新生成**：仅当助手气泡 `key === lastMessageKey` 时显示（`BubbleAssistant`）
- **编辑**：仅最后一轮的用户消息可编辑，且不含图片（`BubbleUser` + Bubble `editable`）

编辑确认后：`handleEditUserMessage` 更新用户内容，并对已有助手回复调用 `onReload`（`userAction: 'retry'`）重新生成。

## ChatContext

`App.tsx` 将以下能力注入 `ChatContext`，供 `BubbleUser` / `BubbleAssistant` 使用：

| 字段 | 说明 |
|------|------|
| `onReload` | 重新生成 |
| `setMessage` | 更新消息 / extraInfo |
| `sessionId` | 当前 `activeConversationKey` |
| `onFeedback` | 提交反馈 |
| `onDeleteMessage` | 删除一轮对话 |
| `onToggleUserMessageEdit` | 进入/退出编辑态 |
| `onEditUserMessage` | 确认编辑（`App` 内可包装滚动到底部） |
| `onCancelUserMessageEdit` | 取消编辑 |

## 使用示例

```tsx
import { message } from "antd";
import { useRef } from "react";
import { BubbleListRef } from "@ant-design/x/es/bubble";
import { ChatContext } from "./components/ChatContext";
import ChatList from "./components/ChatList";
import { useConversationChat } from "./hooks/useConversationChat";

const App = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const listRef = useRef<BubbleListRef>(null);

  const {
    conversations,
    activeConversationKey,
    selectConversation,
    messages,
    isRequesting,
    isDefaultMessagesRequesting,
    modelKey,
    setModelKey,
    onReload,
    setMessage,
    onSubmit: submitChat,
    handleAbort,
    handleFeedback,
    handleCreateConversation,
    handleDeleteConversation,
    handleRenameConversation,
    handleDeleteMessage,
    handleToggleUserMessageEdit,
    handleCancelUserMessageEdit,
    handleEditUserMessage,
  } = useConversationChat({ messageApi });

  const onSubmit = (val: string) => {
    submitChat(val);
    listRef.current?.scrollTo({ top: "bottom" });
  };

  const handleEditUserMessageWithScroll = (messageKey: string | number, content: string) => {
    handleEditUserMessage(messageKey, content);
    listRef.current?.scrollTo({ top: "bottom" });
  };

  return (
    <>
      {contextHolder}
      <ChatContext.Provider
        value={{
          onReload,
          setMessage,
          sessionId: activeConversationKey,
          onFeedback: handleFeedback,
          onDeleteMessage: handleDeleteMessage,
          onToggleUserMessageEdit: handleToggleUserMessageEdit,
          onEditUserMessage: handleEditUserMessageWithScroll,
          onCancelUserMessageEdit: handleCancelUserMessageEdit,
        }}
      >
        <ConversationSide
          conversations={conversations}
          activeConversationKey={activeConversationKey}
          onSelect={selectConversation}
          onCreate={handleCreateConversation}
          onDelete={handleDeleteConversation}
          onRename={handleRenameConversation}
        />
        <ModelSelector value={modelKey} onChange={setModelKey} disabled={isRequesting} />
        <ChatList
          listRef={listRef}
          messages={messages}
          isDefaultMessagesRequesting={isDefaultMessagesRequesting}
          className={markdownClassName}
          onSubmit={onSubmit}
          onEditUserMessage={handleEditUserMessageWithScroll}
          onCancelUserMessageEdit={handleCancelUserMessageEdit}
        />
        <ChatSender
          activeConversationKey={activeConversationKey}
          isRequesting={isRequesting}
          onSubmit={onSubmit}
          onCancel={handleAbort}
        />
      </ChatContext.Provider>
    </>
  );
};
```

## 相关文件

| 文件 | 职责 |
|------|------|
| `useConversationChat.ts` | Hook 主逻辑 |
| `provider.ts` | `/api/v1/chat` 请求体转换 |
| `adapters.ts` | 后端 Session / MessageTurn ↔ UI 模型 |
| `types.ts` | `AppChatMessage` 等类型 |
| `../components/BubbleUser.tsx` | 用户气泡：复制、删除、编辑、收起 |
| `../components/BubbleAssistant.tsx` | 助手气泡：复制、反馈、重新生成 |
| `../components/ChatList.tsx` | `Bubble.List` 组装与 role 配置 |
