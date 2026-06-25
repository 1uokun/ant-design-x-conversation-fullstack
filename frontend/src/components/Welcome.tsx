import { createStyles } from "antd-style";
import React from "react";
import locale from "../_utils/local";

const AGENT_NAME = locale.agentName;
const ANIMATION_MS = 280;
const ANIMATION_EASING = "cubic-bezier(0.4, 0, 0.2, 1)";

const useStyle = createStyles(({ token, css }) => ({
  welcome: css`
    display: flex;
    flex-direction: column;
    flex: 0 0 auto;
    width: 100%;
    transition: flex-grow ${ANIMATION_MS}ms ${ANIMATION_EASING};
  `,
  expanded: css`
    flex-grow: 1;
    justify-content: center;
    
  `,
  agentName: css`
    font-size: ${token.fontSizeHeading2}px;
    font-weight: ${token.fontWeightStrong};
    line-height: ${token.lineHeightHeading2};
    color: ${token.colorText};
    text-align: center;
    margin-bottom: 16px;
  `,
}));

export type ChatWelcomeProps = {
  visible: boolean;
  children: React.ReactNode;
};

const ChatWelcome: React.FC<ChatWelcomeProps> = ({ visible, children }) => {
  const { styles, cx } = useStyle();

  return (
    <div className={cx(styles.welcome, visible && styles.expanded)}>
      {visible && <div className={styles.agentName}>{AGENT_NAME}</div>}
      {children}
    </div>
  );
};

export default ChatWelcome;
