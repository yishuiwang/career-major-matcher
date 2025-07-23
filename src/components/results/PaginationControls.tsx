import React from 'react';
import {
  Box,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
// 定义分页类型
interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// {{CHENGQI:
// Action: Added
// Timestamp: [2025-01-19 18:08:00 +08:00]
// Reason: 创建分页控制组件，支持页面导航和每页大小调整
// Principle_Applied: SOLID (单一职责 - 只负责分页控制), KISS (简洁的分页界面)
// Optimization: 响应式设计，支持移动端和桌面端不同显示
// Architectural_Note (AR): 可复用的分页组件，支持自定义页面大小选项
// Documentation_Note (DW): PaginationControls组件已创建，用于结果分页
// }}

interface PaginationControlsProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  pagination,
  onPageSizeChange,
  loading = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { page, pageSize, total, totalPages } = pagination;

  const handlePageSizeChange = (event: any) => {
    onPageSizeChange(event.target.value as number);
  };

  // 计算当前显示的结果范围
  const startIndex = (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, total);

  if (total === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        justifyContent: 'space-between',
        gap: 2,
        py: 2,
      }}
    >
      {/* 结果统计信息 */}
      <Typography variant="body2" color="text.secondary">
        显示第 {startIndex}-{endIndex} 条，共 {total} 条结果
      </Typography>

      {/* 分页控件 */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {/* 每页大小选择 */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>每页显示</InputLabel>
          <Select
            value={pageSize}
            label="每页显示"
            onChange={handlePageSizeChange}
            disabled={loading}
          >
            <MenuItem value={10}>10 条</MenuItem>
            <MenuItem value={20}>20 条</MenuItem>
            <MenuItem value={50}>50 条</MenuItem>
            <MenuItem value={100}>100 条</MenuItem>
          </Select>
        </FormControl>

        {/* 分页导航 */}
        <Pagination
          count={totalPages}
          page={page}
          // onChange={handlePageChange}
          disabled={loading}
          color="primary"
          size={isMobile ? 'small' : 'medium'}
          showFirstButton
          showLastButton
          siblingCount={isMobile ? 0 : 1}
          boundaryCount={isMobile ? 1 : 2}
        />
      </Box>
    </Box>
  );
};

export default PaginationControls;
