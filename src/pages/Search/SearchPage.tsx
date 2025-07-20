import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Search as SearchIcon,
  TrendingUp as TrendingIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon,
  Balance as BalanceIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

// 匹配模式类型
type MatchMode = 'comprehensive' | 'skill' | 'employment';

// 筛选条件类型
interface FilterOptions {
  regions: string[];
  cities: string[];
  schoolLevels: string[];
}

// {{CHENGQI:
// Action: Integrated Search Interface with Embedded Controls
// Timestamp: [2025-01-20 15:30:00 +08:00]
// Reason: 将匹配模式和高级筛选集成到搜索框内部，创建类似Grok的集成式搜索界面，提升用户体验和界面简洁性
// Principle_Applied: KISS (集成式简洁设计), SOLID (功能内聚), DRY (统一的交互模式)
// Optimization: 集成工具栏设计：搜索框底部嵌入匹配模式选择器和筛选按钮，32px小尺寸按钮，16px圆角，保持Grok风格一致性
// Architectural_Note (AR): 采用集成式架构：主搜索容器内嵌功能工具栏，减少界面层次，提升交互效率
// Documentation_Note (DW): SearchPage集成式重构：匹配模式和高级筛选内嵌于搜索框，底部保留热门搜索和历史记录
// }}

// 常量定义
const MATCH_MODES = [
  {
    value: 'comprehensive' as MatchMode,
    label: '综合推荐',
    icon: <BalanceIcon />,
    description: '平衡考虑技能匹配度、就业前景、学习难度等因素',
  },
  {
    value: 'skill' as MatchMode,
    label: '技能优先',
    icon: <PsychologyIcon />,
    description: '优先推荐与用户现有技能匹配度高的专业',
  },
  {
    value: 'employment' as MatchMode,
    label: '就业优先',
    icon: <TrendingUpIcon />,
    description: '优先推荐就业前景好、薪资水平高的专业',
  },
];

const REGIONS = ['华北', '华东', '华南', '华中', '西北', '西南', '东北'];
const CITIES = ['北京', '上海', '广州', '深圳', '杭州', '南京', '成都', '武汉', '西安', '天津'];
const SCHOOL_LEVELS = ['985工程', '211工程', '双一流', '省重点', '普通本科'];

const SearchPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // 基础状态
  const [searchQuery, setSearchQuery] = useState('');
  const [matchMode, setMatchMode] = useState<MatchMode>('comprehensive');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  // 筛选条件状态
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    regions: [],
    cities: [],
    schoolLevels: [],
  });

  // 从localStorage加载筛选条件
  useEffect(() => {
    const savedFilters = localStorage.getItem('searchFilters');
    const savedMatchMode = localStorage.getItem('matchMode');

    if (savedFilters) {
      try {
        setFilterOptions(JSON.parse(savedFilters));
      } catch (error) {
        console.error('Failed to parse saved filters:', error);
      }
    }

    if (savedMatchMode && ['comprehensive', 'skill', 'employment'].includes(savedMatchMode)) {
      setMatchMode(savedMatchMode as MatchMode);
    }
  }, []);

  // 保存筛选条件到localStorage
  const saveFiltersToStorage = (filters: FilterOptions) => {
    localStorage.setItem('searchFilters', JSON.stringify(filters));
  };

  const saveMatchModeToStorage = (mode: MatchMode) => {
    localStorage.setItem('matchMode', mode);
  };

  // 计算应用的筛选条件数量
  const getAppliedFiltersCount = () => {
    return filterOptions.regions.length +
           filterOptions.cities.length +
           filterOptions.schoolLevels.length;
  };

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
    '低空经济产业/飞行器设计与制造',
    '低空经济产业/机械设计师',
    '低空经济产业/飞机设计与制造',
    '集成电路/软件开发工程师'
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: 实现搜索逻辑，传递匹配模式和筛选条件
    console.log('搜索:', {
      query,
      matchMode,
      filters: filterOptions,
    });
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

  // 匹配模式变更处理
  const handleMatchModeChange = (newMode: MatchMode) => {
    setMatchMode(newMode);
    saveMatchModeToStorage(newMode);
  };

  // 筛选条件变更处理
  const handleFilterChange = (type: keyof FilterOptions, value: string, checked: boolean) => {
    setFilterOptions(prev => {
      const newFilters = { ...prev };
      if (checked) {
        newFilters[type] = [...newFilters[type], value];
      } else {
        newFilters[type] = newFilters[type].filter(item => item !== value);
      }
      return newFilters;
    });
  };

  // 应用筛选条件
  const handleApplyFilters = () => {
    saveFiltersToStorage(filterOptions);
    setFilterDialogOpen(false);
  };

  // 重置筛选条件
  const handleResetFilters = () => {
    const emptyFilters: FilterOptions = {
      regions: [],
      cities: [],
      schoolLevels: [],
    };
    setFilterOptions(emptyFilters);
    saveFiltersToStorage(emptyFilters);
  };

  return (
    <Box sx={{
      height: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* 主要内容区域 - 居中布局 */}
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
          width: '100%',
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

        {/* 搜索框 - 真正的Grok风格设计 */}
        <Box
          sx={{
            width: '100%',
            maxWidth: 800,
            mb: 3,
            position: 'relative',
            backgroundColor: '#fcfcfc',
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
          }}
        >
    

          {/* 搜索输入区域 */}
          <Box sx={{ position: 'relative', pt: '20px' }}>
            <textarea
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && searchQuery.trim()) {
                  e.preventDefault();
                  handleSearch(searchQuery.trim());
                }
              }}
              placeholder="输入岗位群名称，找到最适合的大学专业..."
              style={{
                width: '100%',
                minHeight: '56px',
                maxHeight: '200px',
                padding: '20px 60px 0 12px',
                border: 'none',
                outline: 'none',
                resize: 'none',
                backgroundColor: 'transparent',
                fontSize: '16px',
                fontFamily: 'inherit',
                color: '#1d1c1b',
                lineHeight: '1.5',
              }}
            />

            {/* 提交按钮 */}
            {searchQuery.trim() && (
              <IconButton
                onClick={() => handleSearch(searchQuery.trim())}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: '20px',
                  },
                }}
              >
                <SearchIcon />
              </IconButton>
            )}

            {/* 清除按钮 */}
            {searchQuery && (
              <IconButton
                onClick={clearSearch}
                sx={{
                  position: 'absolute',
                  right: searchQuery.trim() ? 52 : 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: 'transparent',
                  color: 'text.secondary',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: '18px',
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
              {MATCH_MODES.map((mode) => (
                <Tooltip key={mode.value} title={mode.description} arrow placement="top">
                  <Button
                    onClick={() => handleMatchModeChange(mode.value)}
                    variant={matchMode === mode.value ? "contained" : "outlined"}
                    size="small"
                    sx={{
                      minWidth: 'auto',
                      height: 32,
                      borderRadius: '16px',
                      textTransform: 'none',
                      fontSize: '12px',
                      fontWeight: 500,
                      px: 1.5,
                      border: '1px solid rgba(5, 5, 5, 0.1)',
                      backgroundColor: matchMode === mode.value ? 'primary.main' : 'transparent',
                      color: matchMode === mode.value ? 'white' : '#1d1c1b',
                      '&:hover': {
                        backgroundColor: matchMode === mode.value ? 'primary.dark' : 'rgba(5, 5, 5, 0.05)',
                        borderColor: matchMode === mode.value ? 'primary.dark' : 'rgba(5, 5, 5, 0.15)',
                      },
                      '&.MuiButton-outlined': {
                        borderColor: 'rgba(5, 5, 5, 0.1)',
                      },
                      '& .MuiSvgIcon-root': {
                        fontSize: '14px',
                        mr: 0.5,
                      },
                      transition: 'all 0.2s ease',
                    }}
                    startIcon={mode.icon}
                  >
                    {mode.label}
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
                onClick={() => setFilterDialogOpen(true)}
                sx={{
                  height: 32,
                  borderRadius: '16px',
                  textTransform: 'none',
                  fontSize: '12px',
                  fontWeight: 500,
                  px: 1.5,
                  border: '1px solid rgba(5, 5, 5, 0.1)',
                  backgroundColor: 'transparent',
                  color: '#1d1c1b',
                  '&:hover': {
                    backgroundColor: 'rgba(5, 5, 5, 0.05)',
                    borderColor: 'rgba(5, 5, 5, 0.15)',
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: '14px',
                  },
                  transition: 'all 0.2s ease',
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
        </Box>

        {/* 热门搜索 */}
        <Box sx={{ width: '100%', maxWidth: '800px', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, justifyContent: 'center' }}>
            <TrendingIcon color="primary" fontSize="small" />
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
              热门搜索
            </Typography>
          </Box>
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
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
                size="small"
                sx={{
                  height: 40,
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 500,
                  border: '1px solid rgba(5, 5, 5, 0.1)',
                  backgroundColor: 'transparent',
                  color: '#1d1c1b',
                  '&:hover': {
                    backgroundColor: 'rgba(5, 5, 5, 0.05)',
                    borderColor: 'rgba(5, 5, 5, 0.15)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease',
                  '& .MuiChip-label': {
                    px: 2,
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* 高级筛选对话框 */}
      <Dialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        slotProps={{
          paper: {
            sx: {
              borderRadius: isMobile ? 0 : 2,
              maxHeight: '90vh',
            },
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight={600}>
              高级筛选
            </Typography>
            <IconButton onClick={() => setFilterDialogOpen(false)} size="small">
              <ClearIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* 地域选择 */}
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                地域选择
              </FormLabel>
              <FormGroup row={!isMobile}>
                {REGIONS.map((region) => (
                  <FormControlLabel
                    key={region}
                    control={
                      <Checkbox
                        checked={filterOptions.regions.includes(region)}
                        onChange={(e) => handleFilterChange('regions', region, e.target.checked)}
                        color="primary"
                      />
                    }
                    label={region}
                  />
                ))}
              </FormGroup>
            </FormControl>

            {/* 城市选择 */}
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                城市选择
              </FormLabel>
              <FormGroup row={!isMobile}>
                {CITIES.map((city) => (
                  <FormControlLabel
                    key={city}
                    control={
                      <Checkbox
                        checked={filterOptions.cities.includes(city)}
                        onChange={(e) => handleFilterChange('cities', city, e.target.checked)}
                        color="primary"
                      />
                    }
                    label={city}
                  />
                ))}
              </FormGroup>
            </FormControl>

            {/* 院校层次 */}
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                院校层次
              </FormLabel>
              <FormGroup row={!isMobile}>
                {SCHOOL_LEVELS.map((level) => (
                  <FormControlLabel
                    key={level}
                    control={
                      <Checkbox
                        checked={filterOptions.schoolLevels.includes(level)}
                        onChange={(e) => handleFilterChange('schoolLevels', level, e.target.checked)}
                        color="primary"
                      />
                    }
                    label={level}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleResetFilters}
            startIcon={<RefreshIcon />}
            color="inherit"
            sx={{ textTransform: 'none' }}
          >
            重置筛选
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            onClick={() => setFilterDialogOpen(false)}
            color="inherit"
            sx={{ textTransform: 'none' }}
          >
            取消
          </Button>
          <Button
            onClick={handleApplyFilters}
            variant="contained"
            sx={{ textTransform: 'none' }}
          >
            应用筛选
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SearchPage;
