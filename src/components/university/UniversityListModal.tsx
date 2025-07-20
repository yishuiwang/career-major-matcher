import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  Skeleton,
} from '@mui/material';
import {
  Close as CloseIcon,
  School as SchoolIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { getUniversities } from '../../services/universityService';
import type { University } from '../../types/university';

interface UniversityListModalProps {
  open: boolean;
  onClose: () => void;
}

// {{CHENGQI:
// Action: Added
// Timestamp: [2025-01-19 19:40:00 +08:00]
// Reason: 创建大学列表模态对话框组件，展示大学列表和筛选功能
// Principle_Applied: SOLID (单一职责 - 只负责模态对话框), KISS (清晰的对话框结构)
// Optimization: 响应式设计，支持筛选、搜索、分页功能
// Architectural_Note (AR): 可复用的大学列表模态组件
// Documentation_Note (DW): UniversityListModal组件已创建
// }}

const UniversityListModal: React.FC<UniversityListModalProps> = ({
  open,
  onClose,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0); // TablePagination uses 0-based indexing
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // 加载大学数据
  const loadUniversities = async () => {
    setLoading(true);
    try {
      console.log('Loading universities with params:', {
        page: page + 1,
        pageSize: pageSize,
        search: searchTerm || undefined,
      });

      const response = await getUniversities({
        page: page + 1, // API uses 1-based indexing, but TablePagination uses 0-based
        pageSize: pageSize,
        search: searchTerm || undefined,
        sortBy: 'name',
        sortOrder: 'asc'
      });

      console.log('API response:', response);
      setUniversities(response.universities);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to load universities:', error);
      setUniversities([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载和筛选条件变化时重新加载
  useEffect(() => {
    if (open) {
      loadUniversities();
    }
  }, [open, page, pageSize]);

  // 搜索防抖处理
  useEffect(() => {
    if (!open) return;
    
    const timeoutId = setTimeout(() => {
      loadUniversities();
    }, 500); // 500ms防抖

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // 重置页码当搜索条件变化时
  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClose = () => {
    onClose();
    // 重置状态
    setTimeout(() => {
      setPage(0);
      setSearchTerm('');
    }, 300);
  };

  // 获取办学层次的颜色
  const getLevelColor = (level: string) => {
    switch (level) {
      case '985':
        return 'error';
      case '211':
        return 'warning';
      case '双一流':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          height: isMobile ? '100%' : '90vh',
          maxHeight: isMobile ? '100%' : '90vh',
        },
      }}
    >
      {/* 对话框标题 */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SchoolIcon color="primary" />
          <Typography variant="h6" component="div">
            全国高等院校名单
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ({total.toLocaleString()} 所高校)
          </Typography>
        </Box>

        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      {/* 搜索栏 */}
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <TextField
          fullWidth
          size="small"
          placeholder="请输入高校名称/高校所在地"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
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

      {/* 对话框内容 */}
      <DialogContent
        sx={{
          p: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* 大学表格 */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            flexGrow: 1,
            overflow: 'auto',
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>
                  大学名称
                </TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: 'grey.50' }}>
                  所在地
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
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && Array.from({ length: pageSize }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                    </>
                  )}
                </TableRow>
              ))}

              {!loading && universities.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isMobile ? 4 : 6} sx={{ textAlign: 'center', py: 8 }}>
                    <SchoolIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      未找到匹配的大学
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                      请尝试调整搜索关键词
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {!loading && universities.map((university) => (
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

                  {/* 所在地 */}
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
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {university.level.map((level) => (
                        <Chip
                          key={level}
                          label={level}
                          size="small"
                          color={getLevelColor(level) as any}
                          variant="outlined"
                        />
                      ))}
                    </Box>
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
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={pageSize}
            onRowsPerPageChange={handlePageSizeChange}
            rowsPerPageOptions={[5, 10, 20]}
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
      </DialogContent>

      {/* 对话框操作按钮 */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
          数据来源：教育部全国高等学校名单
        </Typography>
        <Button onClick={handleClose} variant="outlined">
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UniversityListModal;
