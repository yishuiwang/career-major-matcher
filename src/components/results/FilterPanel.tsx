import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Slider,
  Button,
  Divider,
  Collapse,
  IconButton,
  useTheme,

} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
// 定义筛选类型
interface SearchFilters {
  location?: string[];
  universityTier?: ('985' | '211' | '双一流' | '普通')[];
  majorCategory?: string[];
  degreeLevel?: ('本科' | '硕士' | '博士')[];
  sortBy?: 'skillsMatch' | 'employmentMatch' | 'finalScore';
  sortOrder?: 'asc' | 'desc';
  minScore?: number;
}

// {{CHENGQI:
// Action: Added
// Timestamp: [2025-01-19 18:05:00 +08:00]
// Reason: 创建筛选面板组件，提供多维度的结果筛选功能
// Principle_Applied: SOLID (单一职责 - 只负责筛选功能), KISS (清晰的筛选界面)
// Optimization: 支持多选、范围筛选、快速清除等功能
// Architectural_Note (AR): 可复用的筛选组件，支持动态筛选选项
// Documentation_Note (DW): FilterPanel组件已创建，用于结果筛选
// }}

interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  availableOptions: {
    locations: string[];
    categories: string[];
    tiers: string[];
  };
  loading?: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  availableOptions,
  loading = false,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const handleLocationChange = (event: any) => {
    const value = event.target.value as string[];
    onFiltersChange({
      ...filters,
      location: value.length > 0 ? value : undefined,
    });
  };

  const handleTierChange = (event: any) => {
    const value = event.target.value as string[];
    onFiltersChange({
      ...filters,
      // universityTier: value.length > 0 ? value : undefined,
    });
  };

  const handleCategoryChange = (event: any) => {
    const value = event.target.value as string[];
    onFiltersChange({
      ...filters,
      majorCategory: value.length > 0 ? value : undefined,
    });
  };

  const handleDegreeLevelChange = (event: any) => {
    const value = event.target.value as string[];
    onFiltersChange({
      ...filters,
      // degreeLevel: value.length > 0 ? value : undefined,
    });
  };

  const handleMinScoreChange = (event: Event, newValue: number | number[]) => {
    onFiltersChange({
      ...filters,
      minScore: newValue as number,
    });
  };

  const handleSortChange = (sortBy: SearchFilters['sortBy'], sortOrder: SearchFilters['sortOrder']) => {
    onFiltersChange({
      ...filters,
      sortBy,
      sortOrder,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      sortBy: 'finalScore',
      sortOrder: 'desc',
    });
  };

  const hasActiveFilters = () => {
    return !!(
      filters.location?.length ||
      filters.universityTier?.length ||
      filters.majorCategory?.length ||
      filters.degreeLevel?.length ||
      (filters.minScore && filters.minScore > 0)
    );
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.location?.length) count++;
    if (filters.universityTier?.length) count++;
    if (filters.majorCategory?.length) count++;
    if (filters.degreeLevel?.length) count++;
    if (filters.minScore && filters.minScore > 0) count++;
    return count;
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      {/* 筛选头部 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon color="primary" />
          <Typography variant="h6">
            筛选条件
          </Typography>
          {hasActiveFilters() && (
            <Chip
              label={getActiveFilterCount()}
              size="small"
              color="primary"
              sx={{ minWidth: 24, height: 20 }}
            />
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {hasActiveFilters() && (
            <Button
              size="small"
              startIcon={<ClearIcon />}
              onClick={clearAllFilters}
              disabled={loading}
            >
              清除
            </Button>
          )}
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            sx={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>
      </Box>

      {/* 排序控制 - 始终显示 */}
      <Box sx={{ display: 'flex', gap: 2, mb: expanded ? 2 : 0 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>排序方式</InputLabel>
          <Select
            value={filters.sortBy || 'finalScore'}
            label="排序方式"
            onChange={(e) => handleSortChange(e.target.value as SearchFilters['sortBy'], filters.sortOrder)}
            disabled={loading}
          >
            <MenuItem value="finalScore">综合评分</MenuItem>
            <MenuItem value="skillsMatch">技能匹配度</MenuItem>
            <MenuItem value="employmentMatch">就业匹配度</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>排序</InputLabel>
          <Select
            value={filters.sortOrder || 'desc'}
            label="排序"
            onChange={(e) => handleSortChange(filters.sortBy, e.target.value as SearchFilters['sortOrder'])}
            disabled={loading}
          >
            <MenuItem value="desc">从高到低</MenuItem>
            <MenuItem value="asc">从低到高</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* 详细筛选选项 */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* 地区筛选 */}
          <FormControl size="small" fullWidth>
            <InputLabel>地区</InputLabel>
            <Select
              multiple
              value={filters.location || []}
              onChange={handleLocationChange}
              input={<OutlinedInput label="地区" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
              disabled={loading}
            >
              {availableOptions.locations.map((location) => (
                <MenuItem key={location} value={location}>
                  {location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 学校层次筛选 */}
          <FormControl size="small" fullWidth>
            <InputLabel>学校层次</InputLabel>
            <Select
              multiple
              value={filters.universityTier || []}
              onChange={handleTierChange}
              input={<OutlinedInput label="学校层次" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
              disabled={loading}
            >
              {availableOptions.tiers.map((tier) => (
                <MenuItem key={tier} value={tier}>
                  {tier}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 专业门类筛选 */}
          <FormControl size="small" fullWidth>
            <InputLabel>专业门类</InputLabel>
            <Select
              multiple
              value={filters.majorCategory || []}
              onChange={handleCategoryChange}
              input={<OutlinedInput label="专业门类" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
              disabled={loading}
            >
              {availableOptions.categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 学历层次筛选 */}
          <FormControl size="small" fullWidth>
            <InputLabel>学历层次</InputLabel>
            <Select
              multiple
              value={filters.degreeLevel || []}
              onChange={handleDegreeLevelChange}
              input={<OutlinedInput label="学历层次" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
              disabled={loading}
            >
              {['本科', '硕士', '博士'].map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 最低评分筛选 */}
          {/* <Box>
            <Typography variant="body2" gutterBottom>
              最低评分: {filters.minScore || 0}
            </Typography>
            <Slider
              value={filters.minScore || 0}
              onChange={handleMinScoreChange}
              min={0}
              max={100}
              step={5}
              marks={[
                { value: 0, label: '0' },
                { value: 50, label: '50' },
                { value: 100, label: '100' },
              ]}
              valueLabelDisplay="auto"
              disabled={loading}
            />
          </Box> */}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default FilterPanel;
