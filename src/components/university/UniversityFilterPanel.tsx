import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  InputAdornment,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

import {
  PROVINCES,
} from '../../types/university';

// 本地接口定义
interface UniversityFilters {
  search: string;
  province: string;
  level: string;
  type: string;
}

interface UniversityFilterPanelProps {
  filters: UniversityFilters;
  onFiltersChange: (filters: UniversityFilters) => void;
  onReset: () => void;
  loading?: boolean;
}

// {{CHENGQI:
// Action: Added
// Timestamp: [2025-01-19 19:45:00 +08:00]
// Reason: 创建大学筛选面板组件，提供搜索和筛选功能
// Principle_Applied: SOLID (单一职责 - 只负责筛选), KISS (简洁的筛选界面)
// Optimization: 支持多维度筛选，实时搜索，重置功能
// Architectural_Note (AR): 可复用的筛选面板组件
// Documentation_Note (DW): UniversityFilterPanel组件已创建
// }}

const UniversityFilterPanel: React.FC<UniversityFilterPanelProps> = ({
  filters,
  onFiltersChange,
  onReset,
  loading = false,
}) => {
  const handleFilterChange = (field: keyof UniversityFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  const handleReset = () => {
    onReset();
  };

  return (
    <Box
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      {/* 标题 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FilterIcon color="primary" />
        <Typography variant="h6" fontWeight={600}>
          筛选条件
        </Typography>
      </Box>

      <Divider />

      {/* 搜索框 */}
      <Box>
        <Typography variant="subtitle2" gutterBottom fontWeight={600}>
          搜索
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="输入大学名称、省份或城市"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          disabled={loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />
      </Box>

      {/* 省份筛选 */}
      <Box>
        <Typography variant="subtitle2" gutterBottom fontWeight={600}>
          省份地区
        </Typography>
        <FormControl fullWidth size="small">
          <InputLabel>选择省份</InputLabel>
          <Select
            value={filters.province}
            label="选择省份"
            onChange={(e) => handleFilterChange('province', e.target.value)}
            disabled={loading}
            sx={{
              borderRadius: 2,
            }}
          >
            <MenuItem value="">
              <em>全部省份</em>
            </MenuItem>
            {PROVINCES.map((province) => (
              <MenuItem key={province} value={province}>
                {province}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* 办学层次筛选 */}
      <Box>
        <Typography variant="subtitle2" gutterBottom fontWeight={600}>
          办学层次
        </Typography>
        <FormControl fullWidth size="small">
          <InputLabel>选择层次</InputLabel>
          <Select
            value={filters.level}
            label="选择层次"
            onChange={(e) => handleFilterChange('level', e.target.value)}
            disabled={loading}
            sx={{
              borderRadius: 2,
            }}
          >
            <MenuItem value="">
              <em>全部层次</em>
            </MenuItem>
            {['985', '211', '双一流', '省重点', '普通本科', '专科'].map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* 学校类型筛选 */}
      <Box>
        <Typography variant="subtitle2" gutterBottom fontWeight={600}>
          学校类型
        </Typography>
        <FormControl fullWidth size="small">
          <InputLabel>选择类型</InputLabel>
          <Select
            value={filters.type}
            label="选择类型"
            onChange={(e) => handleFilterChange('type', e.target.value)}
            disabled={loading}
            sx={{
              borderRadius: 2,
            }}
          >
            <MenuItem value="">
              <em>全部类型</em>
            </MenuItem>
            {['综合类', '理工类', '师范类', '农林类', '医药类', '财经类', '政法类', '语言类', '艺术类', '体育类', '军事类', '民族类'].map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* 重置按钮 */}
      <Box sx={{ mt: 'auto' }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={handleReset}
          disabled={loading}
          sx={{
            borderRadius: 2,
            py: 1,
          }}
        >
          重置筛选
        </Button>
      </Box>

      {/* 筛选统计 */}
      <Box
        sx={{
          p: 2,
          backgroundColor: 'grey.50',
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          当前筛选条件
        </Typography>
        <Typography variant="body2" fontWeight={600}>
          {[
            filters.search && `搜索: ${filters.search}`,
            filters.province && `省份: ${filters.province}`,
            filters.level && `层次: ${filters.level}`,
            filters.type && `类型: ${filters.type}`,
          ]
            .filter(Boolean)
            .join(' | ') || '无筛选条件'}
        </Typography>
      </Box>
    </Box>
  );
};

export default UniversityFilterPanel;
