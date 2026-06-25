import { Tooltip } from "antd";
import { createStyles } from "antd-style";
import React from "react";
import locale from "../../_utils/local";

const PanelLeftOpenIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M9 3v18" />
    <path d="m14 9 3 3-3 3" />
  </svg>
);

const useStyle = createStyles(({ token, css }) => ({
  trigger: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
  `,
  toggle: css`
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    padding: 0;
    border: none;
    background: transparent;
    color: ${token.colorText};
    cursor: pointer;

    &:hover {
      color: ${token.colorTextSecondary};
    }

    svg {
      width: 18px;
      height: 18px;
    }
  `,
  flipped: css`
    svg {
      transform: scaleX(-1);
    }
  `,
}));

export type SidebarToggleProps = {
  collapsed: boolean;
  onToggle: () => void;
};

const SidebarToggle: React.FC<SidebarToggleProps> = ({
  collapsed,
  onToggle,
}) => {
  const { styles, cx } = useStyle();
  const title = collapsed ? locale.expandSidebar : locale.collapseSidebar;

  return (
    <Tooltip title={title} placement="bottom">
      <span className={styles.trigger}>
        <button
          type="button"
          className={cx(styles.toggle, !collapsed && styles.flipped)}
          onClick={onToggle}
          aria-label={title}
        >
          <PanelLeftOpenIcon />
        </button>
      </span>
    </Tooltip>
  );
};

export default SidebarToggle;
