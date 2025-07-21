// {{CHENGQI:
// Action: Created
// Timestamp: [2025-01-21 10:30:00 +08:00]
// Reason: 创建消息气泡组件，支持用户和AI消息的显示，参考Grok AI的对话界面风格
// Principle_Applied: SOLID (单一职责原则), KISS (简洁的消息展示), DRY (复用消息气泡逻辑)
// Optimization: 支持用户和AI两种消息类型，清晰的视觉区分，响应式设计
// Architectural_Note (AR): 独立的消息气泡组件，可复用于不同的对话场景
// Documentation_Note (DW): MessageBubble组件 - 消息气泡展示，支持用户和AI消息类型
// }}

import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
} from '@mui/material';
import {
  Person as PersonIcon,
  SmartToy as AIIcon,
} from '@mui/icons-material';

export interface MessageBubbleProps {
  type: 'user' | 'ai';
  content: string | React.ReactNode;
  timestamp?: Date;
  isStreaming?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  type,
  content,
  timestamp,
  isStreaming = false,
}) => {
  const isUser = type === 'user';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        gap: 2,
        mb: 3,
        px: { xs: 2, md: 0 },
      }}
    >
      {/* 头像 */}
      <Avatar
        sx={{
          width: 40,
          height: 40,
          backgroundColor: isUser ? 'primary.main' : 'secondary.main',
          color: 'white',
          flexShrink: 0,
        }}
      >
        {isUser ? <PersonIcon /> : <AIIcon />}
      </Avatar>

      {/* 消息内容 */}
      <Box
        sx={{
          maxWidth: { xs: '85%', md: '75%' },
          width: 'fit-content',
        }}
      >
        {/* 发送者标识 */}
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            mb: 0.5,
            display: 'block',
            textAlign: isUser ? 'right' : 'left',
            fontWeight: 500,
          }}
        >
          {isUser ? '你' : 'AI助手'}
          {timestamp && (
            <span style={{ marginLeft: 8 }}>
              {timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          )}
        </Typography>

        {/* 消息气泡 */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: isUser 
              ? 'primary.main' 
              : '#fcfcfc',
            color: isUser ? 'white' : 'text.primary',
            borderRadius: isUser 
              ? '20px 20px 4px 20px' 
              : '20px 20px 20px 4px',
            border: isUser 
              ? 'none' 
              : '1px solid rgba(5, 5, 5, 0.1)',
            boxShadow: isUser
              ? '0 2px 8px rgba(25, 118, 210, 0.2)'
              : '0 1px 3px rgba(0, 0, 0, 0.05)',
            position: 'relative',
            '&::before': isUser ? {
              content: '""',
              position: 'absolute',
              bottom: 0,
              right: -8,
              width: 0,
              height: 0,
              borderLeft: '8px solid',
              borderLeftColor: 'primary.main',
              borderTop: '8px solid transparent',
            } : {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: -8,
              width: 0,
              height: 0,
              borderRight: '8px solid #fcfcfc',
              borderTop: '8px solid transparent',
            },
          }}
        >
          {typeof content === 'string' ? (
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.6,
                fontSize: '16px',
                color: isUser ? 'white' : 'text.primary',
                wordBreak: 'break-word',
              }}
            >
              {content}
            </Typography>
          ) : (
            content
          )}

          {/* 流式输出指示器 */}
          {isStreaming && !isUser && (
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                width: '2px',
                height: '1.2em',
                backgroundColor: 'primary.main',
                ml: 0.5,
                animation: 'blink 1s infinite',
                '@keyframes blink': {
                  '0%, 50%': {
                    opacity: 1,
                  },
                  '51%, 100%': {
                    opacity: 0,
                  },
                },
              }}
            />
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default MessageBubble;
