import type { RoleProps } from '@ant-design/x/es/bubble/interface';

export const getUserRole = (): RoleProps => ({
  placement: 'end',
  variant: 'filled',
  classNames: {
    content: 'user-bubble-content',
  },
  styles: {
    root: {
      maxWidth: 'min(83%, 664px)',
    },
    content: {
      backgroundColor: '#ebf5ff',
      color: '#222',
      borderRadius: 16,
      padding: '10px 16px',
      fontSize: 16,
      lineHeight: '26px',
      whiteSpace: 'pre-line',
      wordBreak: 'break-all',
      overflowWrap: 'break-word',
      overflow: 'hidden',
      boxSizing: 'border-box',
      maxWidth: '100%',
    },
  },
});
