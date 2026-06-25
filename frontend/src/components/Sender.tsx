import { Sender as AntSender } from '@ant-design/x';
import { Flex } from 'antd';
import { createStyles } from 'antd-style';
import React, { useEffect, useState } from 'react';
import locale from '../_utils/local';

const useStyle = createStyles(({ token, css }) => ({
  sender: css`
    width: 100%;
    max-width: 840px;
  `,
  disclaimer: css`
    width: 100%;
    max-width: 840px;
    margin: 0 auto;
    text-align: center;
    font-size: 10px;
    line-height: 20px;
    color: ${token.colorTextTertiary};
  `,
}));

export type ChatSenderProps = {
  activeConversationKey?: string;
  isRequesting: boolean;
  onSubmit: (val: string) => void;
  onCancel: () => void;
};

const ChatSender: React.FC<ChatSenderProps> = ({
  activeConversationKey,
  isRequesting,
  onSubmit,
  onCancel,
}) => {
  const { styles } = useStyle();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!activeConversationKey) {
      setInputValue('');
    }
  }, [activeConversationKey]);

  const handleSubmit = (val: string) => {
    onSubmit(val);
    setInputValue('');
  };

  return (
    <Flex vertical gap={12} align="center" style={{ margin: 8 }}>
      <AntSender
        value={inputValue}
        onSubmit={() => {
          handleSubmit(inputValue);
        }}
        onChange={setInputValue}
        onCancel={onCancel}
        loading={isRequesting}
        className={styles.sender}
        placeholder={locale.askOrInputUseSkills}
      />
      {activeConversationKey && <div className={styles.disclaimer}>{locale.aiContentDisclaimer}</div>}
    </Flex>
  );
};

export default ChatSender;
