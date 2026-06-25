import enUS_X from '@ant-design/x/locale/en_US';
import zhCN_X from '@ant-design/x/locale/zh_CN';
import enUS_antd from 'antd/locale/en_US';
import zhCN_antd from 'antd/locale/zh_CN';

const zhCN = {
  requestAborted: '请求已中止',
  requestFailed: '请求失败，请重试！',
  rename: '重命名',
  delete: '删除',
  pinToTop: '置顶',
  unpinFromTop: '取消置顶',
  pinFailed: '置顶操作失败',
  uploadFile: '上传文件',
  dropFileHere: '将文件拖到此处',
  uploadFiles: '上传文件',
  clickOrDragFilesToUpload: '点击或将文件拖到此处上传',
  askOrInputUseSkills: '提问或输入 / 使用技能',
  deepThinking: '深度思考中',
  completeThinking: '深度思考完成',
  modelIsRunning: '正在调用模型',
  executionFailed: '执行失败',
  aborted: '已经终止',
  curConversation: '当前对话',
  itIsNowANewConversation: '当前已经是新会话',
  retry: '重新生成',
  edit: '编辑',
  done: '完成',
  expand: '展开',
  collapse: '收起',
  collapseSidebar: '收起侧边栏',
  expandSidebar: '展开侧边栏',
  deleteMessageConfirm: '确定删除这条消息？',
  deleteMessageFailed: '删除消息失败',
  aiContentDisclaimer: '内容由AI生成，可能不准确，请注意核实',
  agentName: 'Ant Design X 助手',
  upgrades: '升级',
  components: '组件',
  richGuide: 'RICH 指南',
  installationIntroduction: '安装介绍',
};

const enUS = {
  requestAborted: 'Request aborted',
  requestFailed: 'Request failed, please try again!',
  rename: 'Rename',
  delete: 'Delete',
  pinToTop: 'Pin',
  unpinFromTop: 'Unpin',
  pinFailed: 'Failed to update pin status',
  uploadFile: 'Upload File',
  dropFileHere: 'Drop file here',
  uploadFiles: 'Upload files',
  clickOrDragFilesToUpload: 'Click or drag files to this area to upload',
  askOrInputUseSkills: 'Ask or input / use skills',
  deepThinking: 'Deep Thinking',
  completeThinking: 'Complete Thinking',
  modelIsRunning: 'Model is running',
  executionFailed: 'Execution failed',
  aborted: 'Aborted',
  curConversation: 'Current Conversation',
  itIsNowANewConversation: 'It is now a new conversation.',
  retry: 'retry',
  edit: 'Edit',
  done: 'Done',
  expand: 'Expand',
  collapse: 'Collapse',
  collapseSidebar: 'Collapse sidebar',
  expandSidebar: 'Expand sidebar',
  deleteMessageConfirm: 'Delete this message?',
  deleteMessageFailed: 'Failed to delete message',
  aiContentDisclaimer: 'Content is AI-generated and may be inaccurate. Please verify.',
  agentName: 'Ant Design X Assistant',
  upgrades: 'Upgrades',
  components: 'Components',
  richGuide: 'RICH Guide',
  installationIntroduction: 'Installation Introduction',
};

/** 根据浏览器语言偏好判断是否使用中文 */
export function detectZhCN(): boolean {
  if (typeof navigator === "undefined") return true;

  const langs =
    navigator.languages?.length > 0
      ? navigator.languages
      : [navigator.language];

  return langs.some((lang) => {
    const normalized = lang.toLowerCase();
    return normalized === "zh" || normalized.startsWith("zh-");
  });
}

export const isZhCN = detectZhCN();

export default isZhCN
  ? ({ ...zhCN_antd, ...zhCN, ...zhCN_X } as typeof zhCN_antd & typeof zhCN & typeof zhCN_X)
  : ({ ...enUS_antd, ...enUS, ...enUS_X } as typeof enUS_antd & typeof enUS & typeof enUS_X);
