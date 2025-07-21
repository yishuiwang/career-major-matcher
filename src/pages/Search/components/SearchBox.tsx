// {{CHENGQI:
// Action: Modified
// Timestamp: [2025-01-21 14:45:00 +08:00]
// Reason: 重构SearchBox组件以符合Google Gemini设计风格，采用大圆角、简洁布局和现代化的视觉设计
// Principle_Applied: SOLID (单一职责原则), KISS (简化设计，减少视觉噪音), DRY (复用搜索框逻辑)
// Optimization: Google Gemini风格的大圆角设计、微妙阴影效果、简化的工具栏布局
// Architectural_Note (AR): 基于Google Gemini设计语言的搜索框组件，保持功能完整性
// Documentation_Note (DW): SearchBox组件已重构为Google Gemini风格，采用现代化的视觉设计
// }}

import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon,
  Balance as BalanceIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import type { SearchBoxProps, MatchModeConfig } from '../types.js';

// 匹配模式配置
const MATCH_MODES: MatchModeConfig[] = [
  {
    value: 'comprehensive',
    label: '综合推荐',
    icon: <BalanceIcon />,
    description: '平衡考虑技能匹配度、就业前景、学习难度等因素',
  },
  {
    value: 'skill',
    label: '技能优先',
    icon: <PsychologyIcon />,
    description: '优先推荐与用户现有技能匹配度高的专业',
  },
  {
    value: 'employment',
    label: '就业优先',
    icon: <TrendingUpIcon />,
    description: '优先推荐就业前景好、薪资水平高的专业',
  },
];

const SearchBox: React.FC<SearchBoxProps> = ({
  searchQuery,
  onSearchQueryChange,
  onSearch,
  onClear,
  matchMode,
  onMatchModeChange,
  onFilterDialogOpen,
  getAppliedFiltersCount,
  mode,
  placeholder = "输入岗位群名称，找到最适合的大学专业...",
  disabled = false,
}) => {
  const isTopMode = mode === 'top';

  // Google Gemini 风格的尺寸配置
  const containerMaxWidth = isTopMode ? '100%' : 800;
  const searchBoxHeight = isTopMode ? '48px' : '56px';
  const searchBoxMaxHeight = isTopMode ? '120px' : '200px';
  const searchBoxPadding = isTopMode ? '12px 52px 12px 20px' : '16px 52px 16px 20px';
  const searchBoxFontSize = isTopMode ? '14px' : '16px';
  const iconButtonSize = isTopMode ? 32 : 36;
  const toolbarSpacing = isTopMode ? 2 : 3;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && searchQuery.trim()) {
      e.preventDefault();
      onSearch(searchQuery.trim());
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: containerMaxWidth,
        mb: isTopMode ? 0 : toolbarSpacing,
        position: 'relative',
      }}
    >
      {/* 主搜索框容器 - Google Gemini 风格 */}
      <Box
        sx={{
          position: 'relative',
          backgroundColor: 'background.paper',
          borderRadius: '28px', // Google Gemini 的大圆角
          border: '1px solid rgba(0, 0, 0, 0.06)', // 更淡的边框
          boxShadow: '0 2px 5px 1px rgba(64, 60, 67, 0.16)', // Google 标准阴影
          transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)', // Google 标准缓动
          '&:hover': {
            boxShadow: '0 4px 8px 3px rgba(64, 60, 67, 0.15)',
            borderColor: 'rgba(0, 0, 0, 0.12)',
          },
          '&:focus-within': {
            boxShadow: '0 4px 8px 3px rgba(64, 60, 67, 0.15)',
            borderColor: 'primary.main',
          },
          opacity: disabled ? 0.6 : 1,
          pointerEvents: disabled ? 'none' : 'auto',
        }}
      >
        {/* 搜索输入区域 */}
        <Box sx={{ position: 'relative', p: '4px' }}>
          <textarea
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            style={{
              width: '100%',
              minHeight: searchBoxHeight,
              maxHeight: searchBoxMaxHeight,
              padding: searchBoxPadding,
              border: 'none',
              outline: 'none',
              resize: 'none',
              backgroundColor: 'transparent',
              fontSize: searchBoxFontSize,
              fontFamily: 'Google Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              color: '#202124', // Google 标准文字颜色
              lineHeight: '1.5',
              borderRadius: '24px',
            }}
          />

          {/* 提交按钮 - Google Gemini 风格 */}
          {searchQuery.trim() && (
            <IconButton
              onClick={() => onSearch(searchQuery.trim())}
              disabled={disabled}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                width: iconButtonSize,
                height: iconButtonSize,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                color: 'white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  boxShadow: '0 2px 8px rgba(26,115,232,0.24)',
                },
                '& .MuiSvgIcon-root': {
                  fontSize: isTopMode ? '16px' : '20px',
                },
              }}
            >
              <SearchIcon />
            </IconButton>
          )}

          {/* 清除按钮 */}
          {searchQuery && (
            <IconButton
              onClick={onClear}
              disabled={disabled}
              sx={{
                position: 'absolute',
                right: searchQuery.trim() ? (iconButtonSize + 12) : 8,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: 'transparent',
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '& .MuiSvgIcon-root': {
                  fontSize: '16px',
                },
              }}
            >
              <ClearIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* 工具栏 - 移到搜索框外部，Google Gemini 风格 */}
      {!isTopMode && (
        <Box
          sx={{
            mt: toolbarSpacing,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >

          {/* 左侧：匹配模式选择器 */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            {MATCH_MODES.map((modeConfig) => (
              <Tooltip key={modeConfig.value} title={modeConfig.description} arrow placement="top">
                <Button
                  onClick={() => onMatchModeChange(modeConfig.value)}
                  variant={matchMode === modeConfig.value ? "contained" : "outlined"}
                  size="small"
                  disabled={disabled}
                  sx={{
                    minWidth: 'auto',
                    height: 36,
                    borderRadius: '18px', // Google Gemini 风格圆角
                    textTransform: 'none',
                    fontSize: '13px',
                    fontWeight: 500,
                    px: 2,
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    backgroundColor: matchMode === modeConfig.value ? 'primary.main' : 'transparent',
                    color: matchMode === modeConfig.value ? 'white' : 'text.primary',
                    '&:hover': {
                      backgroundColor: matchMode === modeConfig.value ? 'primary.dark' : 'action.hover',
                      borderColor: matchMode === modeConfig.value ? 'primary.dark' : 'rgba(0, 0, 0, 0.24)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                    },
                    '&.MuiButton-outlined': {
                      borderColor: 'rgba(0, 0, 0, 0.12)',
                    },
                    '& .MuiSvgIcon-root': {
                      fontSize: '14px',
                      mr: 0.5,
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                  }}
                  startIcon={modeConfig.icon}
                >
                  {modeConfig.label}
                </Button>
              </Tooltip>
            ))}
          </Box>

          {/* 右侧：高级筛选按钮 */}
          <Badge
            badgeContent={getAppliedFiltersCount()}
            color="primary"
            invisible={getAppliedFiltersCount() === 0}
          >
            <Button
              variant="outlined"
              size="small"
              startIcon={<FilterListIcon />}
              onClick={onFilterDialogOpen}
              disabled={disabled}
              sx={{
                height: 36,
                borderRadius: '18px',
                textTransform: 'none',
                fontSize: '13px',
                fontWeight: 500,
                px: 2,
                border: '1px solid rgba(0, 0, 0, 0.12)',
                backgroundColor: 'transparent',
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'action.hover',
                  borderColor: 'rgba(0, 0, 0, 0.24)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                },
                '& .MuiSvgIcon-root': {
                  fontSize: '14px',
                },
                transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
              }}
            >
              筛选
              {getAppliedFiltersCount() > 0 && (
                <Typography variant="caption" sx={{ ml: 0.5, color: 'primary.main' }}>
                  ({getAppliedFiltersCount()})
                </Typography>
              )}
            </Button>
          </Badge>
        </Box>
      )}
    </Box>
  );
};

export default SearchBox;
