// {{CHENGQI:
// Action: Created
// Timestamp: [2025-01-20 16:05:00 +08:00]
// Reason: 创建独立的SearchBox组件，支持居中和顶部两种模式，集成匹配模式选择器和高级筛选功能
// Principle_Applied: SOLID (单一职责原则), KISS (简洁的组件设计), DRY (复用搜索框逻辑)
// Optimization: 支持两种显示模式，保持Grok风格设计，响应式布局
// Architectural_Note (AR): 独立的搜索框组件，可在不同页面状态下复用
// Documentation_Note (DW): SearchBox组件 - 集成式搜索框，支持居中和顶部模式
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
import type { SearchBoxProps, MatchModeConfig } from '../types';

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
  const containerMaxWidth = isTopMode ? '100%' : 800;
  const inputHeight = isTopMode ? '40px' : '56px';
  const inputMaxHeight = isTopMode ? '120px' : '200px';
  const inputPadding = isTopMode ? '12px 60px 0 12px' : '20px 60px 0 12px';
  const inputFontSize = isTopMode ? '14px' : '16px';
  const buttonSize = isTopMode ? 28 : 32;
  const toolbarButtonHeight = isTopMode ? 28 : 32;
  const toolbarButtonRadius = isTopMode ? '14px' : '16px';
  const toolbarButtonFontSize = isTopMode ? '11px' : '12px';

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
        mb: isTopMode ? 0 : 3,
        position: 'relative',
        backgroundColor: 'background.default',
        borderRadius: '24px',
        padding: '0 8px 48px',
        boxShadow: `
          inset 0 0 0 0 rgb(255, 255, 255),
          inset 0 0 0 1px rgba(5, 5, 5, 0.1),
          0 1px 3px 0 rgba(0, 0, 0, 0.05),
          0 1px 2px -1px rgba(0, 0, 0, 0.05)
        `,
        border: '1px solid rgba(5, 5, 5, 0.08)',
        '&:hover': {
          borderColor: 'rgba(5, 5, 5, 0.15)',
          boxShadow: `
            inset 0 0 0 0 rgb(255, 255, 255),
            inset 0 0 0 1px rgba(5, 5, 5, 0.15),
            0 2px 8px 0 rgba(0, 0, 0, 0.08),
            0 2px 4px -1px rgba(0, 0, 0, 0.08)
          `,
        },
        '&:focus-within': {
          borderColor: 'rgba(5, 5, 5, 0.15)',
          boxShadow: `
            inset 0 0 0 0 rgb(255, 255, 255),
            inset 0 0 0 1px rgba(5, 5, 5, 0.15),
            0 2px 8px 0 rgba(0, 0, 0, 0.08),
            0 2px 4px -1px rgba(0, 0, 0, 0.08)
          `,
        },
        opacity: disabled ? 0.6 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
      }}
    >
      {/* 搜索框标题 */}
      {!isTopMode && (
        <Typography
          variant="body2"
          sx={{
            position: 'absolute',
            top: 12,
            left: 20,
            color: 'text.secondary',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          你想知道什么？
        </Typography>
      )}
      
      {/* 搜索输入区域 */}
      <Box sx={{ position: 'relative', pt: '20px' }}>
        <textarea
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            width: '100%',
            minHeight: inputHeight,
            maxHeight: inputMaxHeight,
            padding: inputPadding,
            border: 'none',
            outline: 'none',
            resize: 'none',
            backgroundColor: 'transparent',
            fontSize: inputFontSize,
            fontFamily: 'inherit',
            color: '#1d1c1b',
            lineHeight: '1.5',
          }}
        />
        
        {/* 提交按钮 */}
        {searchQuery.trim() && (
          <IconButton
            onClick={() => onSearch(searchQuery.trim())}
            disabled={disabled}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              width: isTopMode ? 32 : 40,
              height: isTopMode ? 32 : 40,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
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
              right: searchQuery.trim() ? (isTopMode ? 44 : 52) : 8,
              top: '50%',
              transform: 'translateY(-50%)',
              width: buttonSize,
              height: buttonSize,
              borderRadius: '50%',
              backgroundColor: 'transparent',
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              '& .MuiSvgIcon-root': {
                fontSize: isTopMode ? '14px' : '18px',
              },
            }}
          >
            <ClearIcon />
          </IconButton>
        )}
      </Box>

      {/* 集成工具栏 - 匹配模式和高级筛选 */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          right: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        {/* 左侧：匹配模式选择器 */}
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          {MATCH_MODES.map((modeConfig) => (
            <Tooltip key={modeConfig.value} title={modeConfig.description} arrow placement="top">
              <Button
                onClick={() => onMatchModeChange(modeConfig.value)}
                variant={matchMode === modeConfig.value ? "contained" : "outlined"}
                size="small"
                disabled={disabled}
                sx={{
                  minWidth: 'auto',
                  height: toolbarButtonHeight,
                  borderRadius: toolbarButtonRadius,
                  textTransform: 'none',
                  fontSize: toolbarButtonFontSize,
                  fontWeight: 500,
                  px: isTopMode ? 1 : 1.5,
                  border: '1px solid rgba(5, 5, 5, 0.1)',
                  backgroundColor: matchMode === modeConfig.value ? 'primary.main' : 'transparent',
                  color: matchMode === modeConfig.value ? 'white' : '#1d1c1b',
                  '&:hover': {
                    backgroundColor: matchMode === modeConfig.value ? 'primary.dark' : 'rgba(5, 5, 5, 0.05)',
                    borderColor: matchMode === modeConfig.value ? 'primary.dark' : 'rgba(5, 5, 5, 0.15)',
                  },
                  '&.MuiButton-outlined': {
                    borderColor: 'rgba(5, 5, 5, 0.1)',
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: isTopMode ? '12px' : '14px',
                    mr: isTopMode ? 0.3 : 0.5,
                  },
                  transition: 'all 0.2s ease',
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
              height: toolbarButtonHeight,
              borderRadius: toolbarButtonRadius,
              textTransform: 'none',
              fontSize: toolbarButtonFontSize,
              fontWeight: 500,
              px: isTopMode ? 1 : 1.5,
              border: '1px solid rgba(5, 5, 5, 0.1)',
              backgroundColor: 'transparent',
              color: '#1d1c1b',
              '&:hover': {
                backgroundColor: 'rgba(5, 5, 5, 0.05)',
                borderColor: 'rgba(5, 5, 5, 0.15)',
              },
              '& .MuiSvgIcon-root': {
                fontSize: isTopMode ? '12px' : '14px',
              },
              transition: 'all 0.2s ease',
            }}
          >
            筛选
            {getAppliedFiltersCount() > 0 && (
              <Typography variant="caption" sx={{ ml: isTopMode ? 0.3 : 0.5, color: 'primary.main' }}>
                ({getAppliedFiltersCount()})
              </Typography>
            )}
          </Button>
        </Badge>
      </Box>
    </Box>
  );
};

export default SearchBox;
