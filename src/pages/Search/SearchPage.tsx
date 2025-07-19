import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Chip,
  InputAdornment,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  History as HistoryIcon,
  TrendingUp as TrendingIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

// {{CHENGQI:
// Action: Modified
// Timestamp: [2025-01-19 17:20:00 +08:00]
// Reason: 根据用户需求，重新设计SearchPage，参考Grok设计风格，实现中间搜索框、下方热门搜索、左侧历史记录
// Principle_Applied: SOLID (单一职责), KISS (简洁的搜索界面设计)
// Optimization: 响应式设计，移动端和桌面端不同布局
// Architectural_Note (AR): 参考Grok设计，实现现代化搜索界面
// Documentation_Note (DW): SearchPage重新设计，包含搜索框、热门搜索、历史记录功能
// }}

const SearchPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchQuery, setSearchQuery] = useState('');

  // 模拟历史搜索记录
  const searchHistory = [
    '软件工程师',
    '数据分析师',
    '产品经理',
    '人工智能工程师',
    'UI/UX设计师',
    '市场营销专员',
  ];

  // 模拟热门搜索
  const popularSearches = [
    '当前全球最受欢迎的经济分析',
    '哪些ETF的增长机会最大？',
    '最新的技能要求对哪些专业有利？',
    '你能为我制定文科生涯规划行程吗？',
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: 实现搜索逻辑
    console.log('搜索:', query);
  };

  const handleHistoryClick = (item: string) => {
    setSearchQuery(item);
    handleSearch(item);
  };

  const handlePopularClick = (item: string) => {
    setSearchQuery(item);
    handleSearch(item);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <Box sx={{ height: '100%', width: '100%', display: 'flex' }}>
      {/* 左侧历史搜索记录 - 仅桌面端显示 */}
      {!isMobile && (
        <Box
          sx={{
            width: 280,
            borderRight: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HistoryIcon color="primary" />
              搜索历史
            </Typography>
          </Box>
          <List sx={{ flexGrow: 1, py: 0 }}>
            {searchHistory.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => handleHistoryClick(item)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <HistoryIcon sx={{ mr: 2, color: 'text.secondary', fontSize: 20 }} />
                  <ListItemText
                    primary={
                      <Typography variant="body2" color="text.primary">
                        {item}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* 主要内容区域 */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, md: 4 },
          maxWidth: '800px',
          mx: 'auto',
        }}
      >
        {/* Logo和标题区域 */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            岗位群匹配专业
          </Typography>
          <Typography variant="h6" color="text.secondary">
            你想知道什么？
          </Typography>
        </Box>

        {/* 搜索框 */}
        <Paper
          elevation={2}
          sx={{
            width: '100%',
            maxWidth: 600,
            mb: 4,
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="输入岗位群名称，找到最适合的大学专业..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                handleSearch(searchQuery.trim());
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton onClick={clearSearch} size="small">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  border: '2px solid',
                  borderColor: 'primary.main',
                },
                py: 1,
                fontSize: '1.1rem',
              },
            }}
          />
        </Paper>

        {/* 热门搜索 */}
        <Box sx={{ width: '100%', maxWidth: 600 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <TrendingIcon color="primary" />
            <Typography variant="subtitle1" fontWeight={600}>
              热门搜索
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {popularSearches.map((item, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'primary.50',
                    transform: 'translateY(-1px)',
                    boxShadow: 1,
                  },
                }}
                onClick={() => handlePopularClick(item)}
              >
                <Typography variant="body1" color="text.primary">
                  {item}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* 移动端历史搜索 */}
        {isMobile && searchHistory.length > 0 && (
          <Box sx={{ width: '100%', maxWidth: 600, mt: 4 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              最近搜索
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {searchHistory.slice(0, 6).map((item, index) => (
                <Chip
                  key={index}
                  label={item}
                  onClick={() => handleHistoryClick(item)}
                  variant="outlined"
                  sx={{
                    '&:hover': {
                      bgcolor: 'primary.50',
                      borderColor: 'primary.main',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SearchPage;
