import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
  IconButton,
  Collapse,
  Tooltip,
  styled,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Search as SearchIcon,
  TrendingUp as ResultsIcon,
  Description as ReportIcon,
  History as HistoryIcon,
  Article as ArticleIcon,
  ExpandLess,
  ExpandMore,
  AccessTime,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

// {{CHENGQI:
// Action: Added & Optimized
// Timestamp: [2025-01-19 20:20:00 +08:00]
// Reason: 创建新的侧边栏组件，并优化历史记录折叠栏的动画效果
// Principle_Applied: SOLID (单一职责 - 只负责侧边栏导航), KISS (清晰的导航结构)
// Optimization: 响应式设计，支持桌面端固定侧边栏和移动端抽屉式侧边栏，优化Collapse动画使用自定义时间和缓动函数
// Architectural_Note (AR): 新的侧边栏布局组件，包含主要功能导航和历史记录，动画效果更自然流畅
// Documentation_Note (DW): Sidebar组件已创建并优化动画效果，用于新的布局结构
// }}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  variant?: 'permanent' | 'temporary';
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const DRAWER_WIDTH = 280;
const DRAWER_COLLAPSED_WIDTH = 72;

// 创建样式化的Drawer组件
const StyledDrawer = styled(Drawer, { 
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'collapsed' 
})<{ collapsed?: boolean }>(({ theme, collapsed }) => ({
  width: collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  ...(collapsed ? {
    '& .MuiDrawer-paper': {
      width: DRAWER_COLLAPSED_WIDTH,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      backgroundColor: 'rgb(246, 245, 245)',
    },
  } : {
    '& .MuiDrawer-paper': {
      width: DRAWER_WIDTH,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      backgroundColor: 'rgb(246, 245, 245)',
    },
  }),
}));

const Sidebar: React.FC<SidebarProps> = ({
  open,
  onClose,
  variant = 'permanent',
  collapsed = false,
  onToggleCollapse,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [reportsExpanded, setReportsExpanded] = useState(false);

  // 在移动端忽略折叠状态
  const isCollapsed = !isMobile && collapsed;

  // 主要功能导航
  const mainNavItems = [
    {
      path: '/dashboard',
      label: '数据概览',
      icon: <DashboardIcon />,
      description: '查看系统数据统计',
    },
    {
      path: '/',
      label: '搜索专业',
      icon: <SearchIcon />,
      description: '搜索匹配专业',
    },
    {
      path: '/results',
      label: '匹配结果',
      icon: <ResultsIcon />,
      description: '查看匹配结果',
    },
    {
      path: '/report',
      label: '分析报告',
      icon: <ReportIcon />,
      description: '生成分析报告',
    },
  ];

  // 模拟搜索历史数据
  const searchHistory = [
    { id: '1', query: '软件工程师', time: '2小时前', count: 45 },
    { id: '2', query: '数据分析师', time: '1天前', count: 32 },
    { id: '3', query: '产品经理', time: '2天前', count: 28 },
    { id: '4', query: 'UI设计师', time: '3天前', count: 21 },
  ];

  // 模拟报告历史数据
  const reportHistory = [
    { id: '1', title: '软件工程师专业匹配报告', time: '1小时前', type: 'detailed' },
    { id: '2', title: '数据分析师就业前景分析', time: '2天前', type: 'basic' },
    { id: '3', title: '计算机专业综合分析', time: '1周前', type: 'comprehensive' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const handleSearchHistoryClick = (query: string) => {
    navigate(`/?q=${encodeURIComponent(query)}`);
    if (isMobile) {
      onClose();
    }
  };

  const handleReportClick = (reportId: string) => {
    navigate(`/report/${reportId}`);
    if (isMobile) {
      onClose();
    }
  };

  const sidebarContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 工具栏区域 - 包含标题和折叠按钮 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          px: isCollapsed ? 1 : 2,
          py: 2,
          minHeight: 64,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        {isCollapsed ? (
          <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <Tooltip title="岗位群匹配专业 · 点击展开" placement="right">
              <IconButton
                onClick={onToggleCollapse || (() => handleNavigation('/'))}
                sx={{ 
                  p: 1,
                  position: 'relative',
                  '&:hover .logo-icon': {
                    opacity: 0,
                  },
                  '&:hover .expand-icon': {
                    opacity: 1,
                  },
                }}
              >
                <SchoolIcon 
                  className="logo-icon"
                  color="primary" 
                  sx={{ 
                    fontSize: 28,
                    position: 'absolute',
                    transition: theme.transitions.create(['opacity'], {
                      easing: theme.transitions.easing.easeInOut,
                      duration: theme.transitions.duration.short,
                    }),
                    opacity: 1,
                  }} 
                />
                <ChevronRight 
                  className="expand-icon"
                  color="primary" 
                  sx={{ 
                    fontSize: 28,
                    position: 'absolute',
                    transition: theme.transitions.create(['opacity'], {
                      easing: theme.transitions.easing.easeInOut,
                      duration: theme.transitions.duration.short,
                    }),
                    opacity: 0,
                  }} 
                />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleNavigation('/')}>
              <SchoolIcon color="primary" sx={{ fontSize: 28, mr: 1 }} />
              <Typography variant="h6" fontWeight={700} color="primary">
                岗位群匹配专业
              </Typography>
            </Box>
            {onToggleCollapse && (
              <Tooltip title="折叠侧边栏" placement="left">
                <IconButton onClick={onToggleCollapse} size="small">
                  <ChevronLeft />
                </IconButton>
              </Tooltip>
            )}
          </>
        )}
      </Box>

      {/* 主导航列表 */}
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <List sx={{ pt: 1, px: isCollapsed ? 0.5 : 1 }}>
          {mainNavItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={isCollapsed ? item.label : ''} placement="right" disableHoverListener={!isCollapsed}>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: isCollapsed ? 'center' : 'initial',
                    px: isCollapsed ? 0 : 2.5,
                    borderRadius: 1.5,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.primary.main + '15',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.main + '25',
                      },
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isCollapsed ? 0 : 3,
                      justifyContent: 'center',
                      color: location.pathname === item.path 
                        ? theme.palette.primary.main 
                        : theme.palette.text.secondary,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!isCollapsed && (
                    <ListItemText
                      primary={item.label}
                      secondary={item.description}
                      primaryTypographyProps={{
                        fontWeight: location.pathname === item.path ? 600 : 400,
                        fontSize: '0.95rem',
                        color: location.pathname === item.path 
                          ? theme.palette.primary.main 
                          : theme.palette.text.primary,
                      }}
                      secondaryTypographyProps={{
                        fontSize: '0.75rem',
                        color: theme.palette.text.secondary,
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>

        {/* 历史记录部分 - 只在展开状态显示 */}
        {!isCollapsed && (
          <>
            <Divider sx={{ mx: 2, my: 1 }} />

            {/* 搜索历史 */}
            <Box sx={{ px: 1 }}>
              <ListItemButton
                onClick={() => setHistoryExpanded(!historyExpanded)}
                sx={{
                  borderRadius: 1.5,
                  mb: 0.5,
                  px: 2.5,
                  minHeight: 40,
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <HistoryIcon fontSize="small" color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="搜索历史"
                  primaryTypographyProps={{
                    variant: 'subtitle2',
                    fontWeight: 600,
                    color: 'text.secondary',
                    fontSize: '0.85rem',
                  }}
                />
                {historyExpanded ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={historyExpanded} timeout="auto" unmountOnExit>
                <List disablePadding sx={{ pl: 1 }}>
                  {searchHistory.map((item) => (
                    <ListItem key={item.id} disablePadding>
                      <ListItemButton
                        onClick={() => handleSearchHistoryClick(item.query)}
                        sx={{
                          borderRadius: 1,
                          minHeight: 36,
                          pl: 5,
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <AccessTime sx={{ fontSize: 14, color: 'text.disabled' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.query}
                          secondary={`${item.time} · ${item.count}个结果`}
                          primaryTypographyProps={{
                            fontSize: '0.825rem',
                            fontWeight: 500,
                          }}
                          secondaryTypographyProps={{
                            fontSize: '0.7rem',
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Box>

            {/* 报告历史 */}
            <Box sx={{ px: 1 }}>
              <ListItemButton
                onClick={() => setReportsExpanded(!reportsExpanded)}
                sx={{
                  borderRadius: 1.5,
                  mb: 0.5,
                  px: 2.5,
                  minHeight: 40,
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <ArticleIcon fontSize="small" color="action" />
                </ListItemIcon>
                <ListItemText
                  primary="最近报告"
                  primaryTypographyProps={{
                    variant: 'subtitle2',
                    fontWeight: 600,
                    color: 'text.secondary',
                    fontSize: '0.85rem',
                  }}
                />
                {reportsExpanded ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={reportsExpanded} timeout="auto" unmountOnExit>
                <List disablePadding sx={{ pl: 1 }}>
                  {reportHistory.map((item) => (
                    <ListItem key={item.id} disablePadding>
                      <ListItemButton
                        onClick={() => handleReportClick(item.id)}
                        sx={{
                          borderRadius: 1,
                          minHeight: 48,
                          pl: 5,
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <Bookmark sx={{ fontSize: 14, color: 'text.disabled' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.title}
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                {item.time}
                              </Typography>
                              <Chip
                                label={item.type}
                                size="small"
                                variant="outlined"
                                sx={{ height: 16, fontSize: '0.6rem' }}
                              />
                            </Box>
                          }
                          primaryTypographyProps={{
                            fontSize: '0.825rem',
                            fontWeight: 500,
                            sx: {
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            },
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );

  // 移动端临时侧边栏
  if (variant === 'temporary') {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            backgroundColor: 'rgb(246, 245, 245)',
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  // 桌面端永久侧边栏
  return (
    <StyledDrawer
      variant="permanent"
      collapsed={isCollapsed}
    >
      {sidebarContent}
    </StyledDrawer>
  );
};

export default Sidebar;
export { DRAWER_WIDTH as SIDEBAR_WIDTH, DRAWER_COLLAPSED_WIDTH as SIDEBAR_COLLAPSED_WIDTH };
