import { Conversations as AntConversations } from "@ant-design/x";
import { createStyles } from "antd-style";
import React from "react";
import SidebarToggle from "./SidebarToggle";

const useStyle = createStyles(({ token, css }) => ({
  root: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
  `,
  logo: css`
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
  `,
  logoBrand: css`
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;

    span {
      font-weight: bold;
      color: ${token.colorText};
      font-size: 16px;
    }
  `,
  creation: css`
    padding: 0 !important;
    overflow: visible !important;
    gap: 0;

    .ant-conversations-creation {
      width: 100%;
      margin-block-end: 0;
    }
  `,
}));

export type LogoProps = {
  onToggleCollapse: () => void;
  onCreate: () => void;
};

const Logo: React.FC<LogoProps> = ({ onToggleCollapse, onCreate }) => {
  const { styles } = useStyle();

  return (
    <div className={styles.root}>
      <div className={styles.logo}>
        <div className={styles.logoBrand} onClick={onCreate}>
          <img
            src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
            draggable={false}
            alt="logo"
            width={24}
            height={24}
          />
          <span>Ant Design X</span>
        </div>
        <SidebarToggle collapsed={false} onToggle={onToggleCollapse} />
      </div>
      <AntConversations
        className={styles.creation}
        items={[]}
        creation={{ onClick: onCreate }}
      />
    </div>
  );
};

export default Logo;
