import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

// {{CHENGQI:
// Action: Modified
// Timestamp: [2025-01-19 17:00:00 +08:00]
// Reason: 根据用户反馈，将布局从左右式改为上下式，移除侧边栏，改为简洁的上下布局
// Principle_Applied: KISS (保持布局简单), SOLID (单一职责 - 只负责上下布局组合)
// Optimization: 简化布局结构，更好的桌面端适配，移除复杂的侧边栏逻辑
// Architectural_Note (AR): 改为上下式布局，Header在顶部，Footer在底部，主内容区域在中间
// Documentation_Note (DW): Layout组件已修改为上下式布局，移除侧边栏
// }}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <CssBaseline />

      {/* 顶部导航栏 */}
      <Header />

      {/* 主内容区域 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          overflow: 'auto',
        }}
      >
        {/* 页面内容 */}
        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 3 },
            width: '100%',
            maxWidth: '100%',
          }}
        >
          {children}
        </Box>

        {/* 底部信息栏 */}
        {/* <Footer /> */}
      </Box>
    </Box>
  );
};

export default Layout;
