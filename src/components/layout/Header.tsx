import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  Dashboard as DashboardIcon,
  Description as ReportIcon,
  TrendingUp as ResultsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

// {{CHENGQI:
// Action: Modified
// Timestamp: [2025-01-19 17:02:00 +08:00]
// Reason: 根据用户反馈，修改Header组件适配上下式布局，移除菜单按钮，优化导航
// Principle_Applied: SOLID (单一职责 - 只负责顶部导航), KISS (简化导航结构)
// Optimization: 移除侧边栏相关逻辑，优化桌面端和移动端导航体验
// Architectural_Note (AR): 适配上下式布局，提供完整的顶部导航功能
// Documentation_Note (DW): Header组件已修改，移除侧边栏依赖，优化导航体验
// }}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navigationItems = [
    { path: '/', label: '搜索专业', icon: <SearchIcon /> },
    { path: '/results', label: '匹配结果', icon: <ResultsIcon /> },
    { path: '/dashboard', label: '数据概览', icon: <DashboardIcon /> },
    { path: '/report', label: '分析报告', icon: <ReportIcon /> },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar>
        {/* 应用标题 */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            mr: 4,
            cursor: 'pointer',
            fontWeight: 600,
          }}
          onClick={() => handleNavigation('/')}
        >
          岗位群匹配专业
        </Typography>

        {/* 导航菜单 */}
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
          {navigationItems.map(item => (
            <Button
              key={item.path}
              color="inherit"
              startIcon={!isMobile ? item.icon : undefined}
              onClick={() => handleNavigation(item.path)}
              sx={{
                backgroundColor:
                  location.pathname === item.path
                    ? 'rgba(255, 255, 255, 0.15)'
                    : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                borderRadius: 1,
                px: { xs: 1, md: 2 },
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                minWidth: { xs: 'auto', md: 'auto' },
              }}
            >
              {isMobile ? item.label.slice(0, 2) : item.label}
            </Button>
          ))}
        </Box>

        {/* 右侧操作区域 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* 这里可以添加用户菜单、设置等 */}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
