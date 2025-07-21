// {{CHENGQI:
// Action: Modified
// Timestamp: [2025-01-21 15:00:00 +08:00]
// Reason: 重构SearchPage以符合Google Gemini设计风格，优化布局、间距和视觉层次，创造更现代化的用户体验
// Principle_Applied: SOLID (单一职责原则), KISS (简化布局设计), DRY (组件复用)
// Optimization: Google Gemini风格的布局设计、更好的留白处理、现代化的视觉层次
// Architectural_Note (AR): 基于Google Gemini设计语言的页面布局，保持组件化架构
// Documentation_Note (DW): SearchPage已重构为Google Gemini风格，采用现代化的布局和视觉设计
// }}

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';

// 导入类型定义
import type {
  MatchMode,
  FilterOptions,
  SearchResult,
  FilterChangeHandler,
} from './types.js';

// 导入子组件
import SearchBox from './components/SearchBox';
import FilterDialog from './components/FilterDialog';
import AIResponse from './components/AIResponse';

// 导入模拟数据
import { getMockSearchResult } from './mockData';

// 热门搜索数据
const popularSearches = [
  '低空经济/飞行器设计与制造',
  '低空经济/无人机研发',
  '集成电路/软件开发',
  '集成电路/集成电路设计',
];

const SearchPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // 基础状态
  const [searchQuery, setSearchQuery] = useState('');
  const [matchMode, setMatchMode] = useState<MatchMode>('comprehensive');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  // 搜索结果相关状态
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);


  // 筛选条件状态
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    regions: [],
    cities: [],
    schoolLevels: [],
  });

  // 搜索历史
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // 从localStorage加载数据
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }

    const savedMatchMode = localStorage.getItem('matchMode') as MatchMode;
    if (savedMatchMode) {
      setMatchMode(savedMatchMode);
    }

    const savedFilters = localStorage.getItem('filterOptions');
    if (savedFilters) {
      setFilterOptions(JSON.parse(savedFilters));
    }
  }, []);

  // 保存搜索历史
  const saveSearchHistory = (query: string) => {
    const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  // 保存匹配模式
  const saveMatchModeToStorage = (mode: MatchMode) => {
    localStorage.setItem('matchMode', mode);
  };

  // 保存筛选条件
  const saveFilterOptionsToStorage = (options: FilterOptions) => {
    localStorage.setItem('filterOptions', JSON.stringify(options));
  };



  // 搜索处理
  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setShowResults(true);
    
    // 保存搜索历史
    saveSearchHistory(query.trim());
    
    // 模拟搜索延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 创建模拟搜索结果
    const results = getMockSearchResult(query.trim());
    setSearchResults(results);

    setIsSearching(false);
  };

  // 清除搜索
  const clearSearch = () => {
    setSearchQuery('');
  };

  // 匹配模式变更处理
  const handleMatchModeChange = (newMode: MatchMode) => {
    setMatchMode(newMode);
    saveMatchModeToStorage(newMode);
  };

  // 筛选条件变更处理
  const handleFilterChange: FilterChangeHandler = (type, value, checked) => {
    setFilterOptions(prev => {
      const newOptions = { ...prev };
      if (checked) {
        newOptions[type] = [...newOptions[type], value];
      } else {
        newOptions[type] = newOptions[type].filter(item => item !== value);
      }
      saveFilterOptionsToStorage(newOptions);
      return newOptions;
    });
  };

  // 应用筛选
  const handleApplyFilters = () => {
    setFilterDialogOpen(false);
    // 这里可以重新执行搜索逻辑
    if (searchQuery.trim()) {
      handleSearch(searchQuery.trim());
    }
  };

  // 重置筛选
  const handleResetFilters = () => {
    const emptyFilters: FilterOptions = {
      regions: [],
      cities: [],
      schoolLevels: [],
    };
    setFilterOptions(emptyFilters);
    saveFilterOptionsToStorage(emptyFilters);
  };

  // 获取已应用的筛选条件数量
  const getAppliedFiltersCount = () => {
    return filterOptions.regions.length + filterOptions.cities.length + filterOptions.schoolLevels.length;
  };

  // 热门搜索点击处理
  const handlePopularClick = (item: string) => {
    setSearchQuery(item);
    handleSearch(item);
  };



  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {showResults ? (
        // Grok AI风格的对话界面
        <>
          {/* 内容区域 */}
          <Box
            sx={{
              flexGrow: 1,
            }}
          >
            <Box sx={{ maxWidth: '800px', mx: 'auto', width: '100%' }}>
              {/* 用户查询显示 */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 1,
                  }}
                >
                  "{searchResults?.query || searchQuery}"
                </Typography>
                {searchResults?.timestamp && (
                  <Typography variant="body2" color="text.secondary">
                    查询时间：{searchResults.timestamp.toLocaleString()}
                  </Typography>
                )}
              </Box>

              {/* AI回复内容 */}
              <AIResponse
                searchResults={searchResults}
                isStreaming={isSearching}
              />

              {/* 底部安全间距，确保内容不会被搜索栏遮挡 */}
              {/* <Box sx={{ height: '120px' }} /> */}
            </Box>
          </Box>

          {/* 底部搜索框 */}
          <Box
            sx={{
              // p: 2,
              position: 'sticky',
              bottom: 0,
              zIndex: 1000,
              backgroundColor: 'background.default',
              // 确保与页面底部无缝连接
              margin: 0,
              width: '100%',
            }}
          >
            <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
              <SearchBox
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                onSearch={handleSearch}
                onClear={clearSearch}
                matchMode={matchMode}
                onMatchModeChange={handleMatchModeChange}
                filterOptions={filterOptions}
                onFilterDialogOpen={() => setFilterDialogOpen(true)}
                getAppliedFiltersCount={getAppliedFiltersCount}
                mode="top"
                placeholder="继续对话或输入新的查询..."
                disabled={isSearching}
              />
            </Box>
          </Box>
        </>
      ) : (
        // 原始搜索页面
        <>
          {/* 主要内容区域 - Google Gemini 风格居中布局 */}
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: { xs: 3, md: 6 },
              maxWidth: '900px', // 稍微增加最大宽度
              mx: 'auto',
              width: '100%',
              minHeight: '60vh', // 确保有足够的高度
            }}
          >
            {/* Logo和标题区域 - Google Gemini 风格 */}
            <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontWeight: 400, // Google 使用较轻的字重
                  mb: 3,
                  color: 'text.primary',
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                }}
              >
                岗位群匹配专业
              </Typography>
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '1.125rem', md: '1.375rem' },
                  fontWeight: 400,
                  letterSpacing: '0.01em',
                  lineHeight: 1.4,
                }}
              >
                你想知道什么？
              </Typography>
            </Box>

            {/* 搜索框 */}
            <SearchBox
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              onSearch={handleSearch}
              onClear={clearSearch}
              matchMode={matchMode}
              onMatchModeChange={handleMatchModeChange}
              filterOptions={filterOptions}
              onFilterDialogOpen={() => setFilterDialogOpen(true)}
              getAppliedFiltersCount={getAppliedFiltersCount}
              mode="center"
              disabled={isSearching}
            />

            {/* 热门搜索 - Google Gemini 风格 */}
            <Box sx={{ width: '100%', maxWidth: '700px', mt: { xs: 4, md: 6 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, justifyContent: 'center' }}>
                <TrendingIcon
                  sx={{
                    color: 'text.secondary',
                    fontSize: '20px',
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    color: 'text.secondary',
                    fontSize: '15px',
                    letterSpacing: '0.01em',
                  }}
                >
                  热门搜索
                </Typography>
              </Box>
              <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1.5,
                justifyContent: 'center',
                maxWidth: '600px',
                mx: 'auto',
              }}>
                {popularSearches.map((item, index) => (
                  <Chip
                    key={index}
                    label={item}
                    onClick={() => handlePopularClick(item)}
                    variant="outlined"
                    sx={{
                      height: 36,
                      borderRadius: '18px', // Google Gemini 风格圆角
                      fontSize: '14px',
                      fontWeight: 400,
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                      backgroundColor: 'background.paper',
                      color: 'text.primary',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        borderColor: 'rgba(0, 0, 0, 0.24)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                      '& .MuiChip-label': {
                        px: 2,
                        py: 0.5,
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </>
      )}

      {/* 高级筛选对话框 */}
      <FilterDialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        getAppliedFiltersCount={getAppliedFiltersCount}
        isMobile={isMobile}
      />
    </Box>
  );
};

export default SearchPage;
