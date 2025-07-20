import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Typography,
  Chip,
  Skeleton,
  Link,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  OpenInNew as OpenInNewIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import {
  University,
  UniversityLevel,
} from '../../types/university';

// 本地接口定义
interface UniversityTableProps {
  universities: University[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

// {{CHENGQI:
// Action: Added
// Timestamp: [2025-01-19 19:50:00 +08:00]
// Reason: 创建大学表格组件，展示大学列表数据
// Principle_Applied: SOLID (单一职责 - 只负责表格展示), KISS (清晰的表格结构)
// Optimization: 响应式设计，分页功能，数据格式化
// Architectural_Note (AR): 可复用的大学表格组件
// Documentation_Note (DW): UniversityTable组件已创建
// }}

const UniversityTable: React.FC<UniversityTableProps> = ({
  universities,
  loading,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // 获取办学层次的颜色
  const getLevelColor = (level: UniversityLevel) => {
    switch (level) {
      case UniversityLevel.LEVEL_985:
        return 'error';
      case UniversityLevel.LEVEL_211:
        return 'warning';
      case UniversityLevel.DOUBLE_FIRST_CLASS:
        return 'primary';
      case UniversityLevel.PROVINCIAL_KEY:
        return 'info';
      default:
        return 'default';
    }
  };

  // 渲染办学层次标签
  const renderLevelChips = (levels: UniversityLevel[]) => {
    return (
      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
        {levels.map((level) => (
          <Chip
            key={level}
            label={level}
            size="small"
            color={getLevelColor(level) as any}
            variant="outlined"
          />
        ))}
      </Box>
    );
  };

  // 渲染加载状态
  const renderLoadingSkeleton = () => {
    return Array.from({ length: pageSize }).map((_, index) => (
      <TableRow key={index}>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={120} />
          </Box>
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width={80} />
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Skeleton variant="rectangular" width={40} height={20} />
            <Skeleton variant="rectangular" width={40} height={20} />
          </Box>
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width={60} />
        </TableCell>
        {!isMobile && (
          <>
            <TableCell>
              <Skeleton variant="text" width={40} />
            </TableCell>
            <TableCell>
              <Skeleton variant="text" width={60} />
            </TableCell>
            <TableCell>
              <Skeleton variant="text" width={50} />
            </TableCell>
          </>
        )}
      </TableRow>
    ));
  };

  // 渲染空状态
  const renderEmptyState = () => {
    return (
      <TableRow>
        <TableCell colSpan={isMobile ? 4 : 7} sx={{ textAlign: 'center', py: 8 }}>
          <SchoolIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            未找到匹配的大学
          </Typography>
          <Typography variant="body2" color="text.disabled">
            请尝试调整筛选条件或搜索关键词
          </Typography>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 表格容器 */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          '& .MuiTableCell-root': {
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>
                大学名称
              </TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>
                省份
              </TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>
                办学层次
              </TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>
                学校类型
              </TableCell>
              {!isMobile && (
                <>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>
                    排名
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>
                    建校年份
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>
                    官网
                  </TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && renderLoadingSkeleton()}
            
            {!loading && universities.length === 0 && renderEmptyState()}
            
            {!loading &&
              universities.map((university) => (
                <TableRow
                  key={university.id}
                  hover
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  {/* 大学名称 */}
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {university.name}
                      </Typography>
                      {university.englishName && (
                        <Typography variant="caption" color="text.secondary">
                          {university.englishName}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>

                  {/* 省份 */}
                  <TableCell>
                    <Typography variant="body2">
                      {university.province}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {university.city}
                    </Typography>
                  </TableCell>

                  {/* 办学层次 */}
                  <TableCell>
                    {renderLevelChips(university.level)}
                  </TableCell>

                  {/* 学校类型 */}
                  <TableCell>
                    <Typography variant="body2">
                      {university.type}
                    </Typography>
                  </TableCell>

                  {/* 桌面端额外列 */}
                  {!isMobile && (
                    <>
                      {/* 排名 */}
                      <TableCell>
                        <Typography variant="body2">
                          {university.ranking?.national ? `#${university.ranking.national}` : '-'}
                        </Typography>
                      </TableCell>

                      {/* 建校年份 */}
                      <TableCell>
                        <Typography variant="body2">
                          {university.establishedYear || '-'}
                        </Typography>
                      </TableCell>

                      {/* 官网 */}
                      <TableCell>
                        {university.website ? (
                          <Link
                            href={university.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              textDecoration: 'none',
                              color: 'primary.main',
                              '&:hover': {
                                textDecoration: 'underline',
                              },
                            }}
                          >
                            <Typography variant="body2">访问</Typography>
                            <OpenInNewIcon sx={{ fontSize: 14 }} />
                          </Link>
                        ) : (
                          <Typography variant="body2" color="text.disabled">
                            -
                          </Typography>
                        )}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 分页控件 */}
      <Box
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: 'background.paper',
        }}
      >
        <TablePagination
          component="div"
          count={total}
          page={page - 1} // TablePagination 使用 0-based 索引
          onPageChange={(_, newPage) => onPageChange(newPage + 1)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
          rowsPerPageOptions={[5, 10, 20, 50]}
          labelRowsPerPage="每页显示:"
          labelDisplayedRows={({ from, to, count }) =>
            `第 ${from}-${to} 条，共 ${count !== -1 ? count : `超过 ${to}`} 条`
          }
          sx={{
            '& .MuiTablePagination-toolbar': {
              minHeight: 52,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default UniversityTable;
