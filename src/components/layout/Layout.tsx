import React, { useState } from 'react';
import { Box, CssBaseline, useTheme, useMediaQuery, IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import Sidebar, { SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

// {{CHENGQI:
// Action: Modified
// Timestamp: [2025-01-19 20:15:00 +08:00]
// Reason: 重新设计布局为左侧边栏 + 右侧主内容区域的结构，并优化主内容区域背景色
// Principle_Applied: SOLID (单一职责 - 只负责左右布局组合), KISS (清晰的侧边栏布局)
// Optimization: 响应式设计，桌面端固定侧边栏，移动端抽屉式侧边栏，主内容区域使用浅灰色背景提升视觉层次
// Architectural_Note (AR): 改为左右式布局，Sidebar在左侧，主内容区域在右侧，背景色统一设计
// Documentation_Note (DW): Layout组件已重新设计为侧边栏布局，主内容区域背景色已优化
// }}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // 计算当前侧边栏宽度
  const getCurrentSidebarWidth = () => {
    if (isMobile) return 0; // 移动端使用抽屉式，不占用空间
    return sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;
  };

  // 获取主内容区域的动画配置，与侧边栏保持同步
  const getContentTransition = () => {
    return theme.transitions.create(['width', 'margin-left', 'padding'], {
      easing: theme.transitions.easing.sharp,
      duration: sidebarCollapsed 
        ? theme.transitions.duration.leavingScreen 
        : theme.transitions.duration.enteringScreen,
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        // 为整个布局添加性能优化
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}
    >
      <CssBaseline />

      {/* 侧边栏 */}
      {isMobile ? (
        // 移动端：抽屉式侧边栏
        <Sidebar
          open={mobileOpen}
          onClose={handleDrawerToggle}
          variant="temporary"
        />
      ) : (
        // 桌面端：固定侧边栏，支持折叠
        <Sidebar
          open={true}
          onClose={() => {}}
          variant="permanent"
          collapsed={sidebarCollapsed}
          onToggleCollapse={handleSidebarToggle}
        />
      )}

      {/* 主内容区域 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          // 使用精确的宽度计算，确保与侧边栏完美配合
          width: isMobile 
            ? '100%' 
            : `calc(100vw - ${getCurrentSidebarWidth()}px)`,
          minWidth: isMobile ? '100%' : `calc(100vw - ${SIDEBAR_WIDTH}px)`, // 防止收缩过度
          maxWidth: '100%',
          overflow: 'hidden',
          position: 'relative',
          // 使用与Sidebar完全相同的过渡配置确保同步
          transition: getContentTransition(),
          // 高级性能优化
          transform: 'translate3d(0, 0, 0)', // 强制GPU加速
          willChange: 'width', // 仅优化宽度变化
          backfaceVisibility: 'hidden',
          perspective: 1000, // 改善3D渲染性能
          // 使用contain属性优化渲染性能
          contain: 'layout style paint',
        }}
      >
        {/* 移动端菜单按钮 */}
        {isMobile && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 1200,
            }}
          >
            <IconButton
              color="primary"
              onClick={handleDrawerToggle}
              sx={{
                backgroundColor: 'background.paper',
                boxShadow: 2,
                '&:hover': {
                  backgroundColor: 'background.paper',
                  boxShadow: 4,
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        )}

        {/* 页面内容 */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            p: { xs: 2, md: 3 },
            pt: { xs: 8, md: 3 }, // 移动端顶部留出菜单按钮空间
            width: '100%',
            minWidth: 0, // 防止内容撑开容器
            backgroundColor: 'rgb(246, 245, 245)',
            // 确保内容区域也有平滑的过渡效果
            transition: getContentTransition(),
            // 性能优化
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden', // 防止闪烁
            contain: 'layout style', // 优化重绘性能
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
