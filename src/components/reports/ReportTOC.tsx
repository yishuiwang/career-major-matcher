import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  MenuBook as MenuBookIcon,
} from '@mui/icons-material';

// {{CHENGQI:
// Action: Added
// Timestamp: [2025-01-19 18:35:00 +08:00]
// Reason: 创建报告目录导航组件，支持章节跳转和导航
// Principle_Applied: SOLID (单一职责 - 只负责目录导航), KISS (清晰的导航结构)
// Optimization: 支持多级目录、当前章节高亮、响应式设计
// Architectural_Note (AR): 可复用的目录导航组件，支持自动滚动定位
// Documentation_Note (DW): ReportTOC组件已创建，用于报告目录导航
// }}

// 定义类型
interface TOCItem {
  id: string;
  title: string;
  level: number;
  anchor: string;
  children?: TOCItem[];
}

interface TableOfContents {
  items: TOCItem[];
  totalSections: number;
}

interface ReportTOCProps {
  toc: TableOfContents;
  activeSection?: string;
  onSectionClick: (anchor: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const ReportTOC: React.FC<ReportTOCProps> = ({
  toc,
  activeSection,
  onSectionClick,
  collapsed = false,
  onToggleCollapse,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // 自动展开包含当前活动章节的父级
  useEffect(() => {
    if (activeSection) {
      const newExpanded = new Set(expandedSections);
      // 这里可以添加逻辑来展开包含当前章节的父级
      setExpandedSections(newExpanded);
    }
  }, [activeSection]);

  const handleSectionClick = (anchor: string) => {
    onSectionClick(anchor);
    
    // 滚动到目标元素
    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const renderTOCItem = (item: TOCItem, index: number) => {
    const isActive = activeSection === item.anchor;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSections.has(item.id);

    // 根据标题级别设置缩进和样式
    const getItemStyles = (level: number) => {
      const baseIndent = (level - 1) * 16;
      return {
        pl: `${baseIndent + 16}px`,
        py: level === 1 ? 1 : 0.5,
        borderRadius: 1,
        mb: level === 1 ? 0.5 : 0,
      };
    };

    const getTextStyles = (level: number) => {
      switch (level) {
        case 1:
          return {
            fontSize: '1rem',
            fontWeight: 600,
            color: theme.palette.primary.main,
          };
        case 2:
          return {
            fontSize: '0.9rem',
            fontWeight: 500,
            color: theme.palette.text.primary,
          };
        default:
          return {
            fontSize: '0.85rem',
            fontWeight: 400,
            color: theme.palette.text.secondary,
          };
      }
    };

    return (
      <Box key={item.id}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleSectionClick(item.anchor)}
            selected={isActive}
            sx={{
              ...getItemStyles(item.level),
              backgroundColor: isActive ? theme.palette.primary.main + '15' : 'transparent',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main + '20',
                borderLeft: `3px solid ${theme.palette.primary.main}`,
                '&:hover': {
                  backgroundColor: theme.palette.primary.main + '25',
                },
              },
            }}
          >
            <ListItemText
              primary={item.title}
              primaryTypographyProps={{
                sx: {
                  ...getTextStyles(item.level),
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                },
              }}
            />
            {hasChildren && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSection(item.id);
                }}
                sx={{ ml: 1 }}
              >
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )}
          </ListItemButton>
        </ListItem>

        {/* 渲染子项 */}
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map((child, childIndex) =>
                renderTOCItem(child, childIndex)
              )}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  if (toc.items.length === 0) {
    return null;
  }

  return (
    <Paper
      elevation={2}
      sx={{
        height: 'fit-content',
        maxHeight: isMobile ? '50vh' : '80vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 目录标题 */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: theme.palette.grey[50],
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MenuBookIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            目录
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ({toc.totalSections}章节)
          </Typography>
        </Box>

        {onToggleCollapse && (
          <IconButton
            size="small"
            onClick={onToggleCollapse}
            sx={{
              transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        )}
      </Box>

      {/* 目录内容 */}
      <Collapse in={!collapsed} timeout="auto">
        <Box
          sx={{
            maxHeight: isMobile ? '40vh' : '70vh',
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: 6,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: theme.palette.grey[100],
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.grey[400],
              borderRadius: 3,
            },
          }}
        >
          <List component="nav" disablePadding sx={{ p: 1 }}>
            {toc.items.map((item, index) => renderTOCItem(item, index))}
          </List>
        </Box>
      </Collapse>

      {/* 底部统计信息 */}
      {!collapsed && (
        <Box
          sx={{
            p: 1.5,
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.grey[50],
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            共 {toc.totalSections} 个章节
            {activeSection && ' · 当前阅读进度'}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ReportTOC;
