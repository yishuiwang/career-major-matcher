import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
  useTheme,
} from '@mui/material';

// {{CHENGQI:
// Action: Added
// Timestamp: [2025-01-19 16:34:00 +08:00]
// Reason: 创建Footer组件，提供页面底部信息和链接
// Principle_Applied: SOLID (单一职责 - 只负责底部信息展示), KISS (简单的底部布局)
// Optimization: 响应式设计，简洁的信息展示
// Architectural_Note (AR): 使用Container组件保持内容宽度一致性
// Documentation_Note (DW): Footer组件文档已创建，包含版权信息和相关链接
// }}

const Footer: React.FC = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 3,
        px: 2,
        backgroundColor: theme.palette.grey[50],
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: 2,
          }}
        >
          {/* 左侧信息 */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h6" color="primary" gutterBottom>
              岗位群匹配专业系统
            </Typography>
            <Typography variant="body2" color="text.secondary">
              基于数据驱动的智能专业推荐平台
            </Typography>
          </Box>

          {/* 右侧链接 */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 1, md: 3 },
              alignItems: 'center',
            }}
          >
            <Link
              href="#"
              color="text.secondary"
              underline="hover"
              variant="body2"
            >
              使用帮助
            </Link>
            <Link
              href="#"
              color="text.secondary"
              underline="hover"
              variant="body2"
            >
              数据来源
            </Link>
            <Link
              href="#"
              color="text.secondary"
              underline="hover"
              variant="body2"
            >
              联系我们
            </Link>
            <Link
              href="#"
              color="text.secondary"
              underline="hover"
              variant="body2"
            >
              隐私政策
            </Link>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 版权信息 */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} 岗位群匹配专业系统. 保留所有权利.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            数据更新时间: {new Date().toLocaleDateString('zh-CN')}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
