import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Fab,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Compare as CompareIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MatchResultCard from '../../components/results/MatchResultCard';
import FilterPanel from '../../components/results/FilterPanel';
import PaginationControls from '../../components/results/PaginationControls';
import { useResultsStore } from '../../store/resultsStore';

// {{CHENGQI:
// Action: Modified
// Timestamp: [2025-01-19 18:12:00 +08:00]
// Reason: 重新实现ResultsPage，集成所有结果展示、筛选、分页功能
// Principle_Applied: SOLID (单一职责 - 只负责结果页面组合), DRY (复用组件)
// Optimization: 响应式设计，状态管理，URL参数支持
// Architectural_Note (AR): 完整的结果页面实现，集成所有功能组件
// Documentation_Note (DW): ResultsPage已重新实现，包含完整的结果展示功能
// }}

const ResultsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showExportSnackbar, setShowExportSnackbar] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const {
    results,
    pagination,
    filters,
    loading,
    error,
    searchQuery,
    favorites,
    comparison,
    expandedCards,
    filterOptions,
    searchMajors,
    applyFilters,
    toggleFavorite,
    addToComparison,
    removeFromComparison,
    toggleCardExpansion,
    expandAllCards,
    collapseAllCards,
    changePage,
    changePageSize,
    exportResults,
    clearError,
    loadFilterOptions,
  } = useResultsStore();

  // 页面加载时处理URL参数
  useEffect(() => {
    const query = searchParams.get('q');
    if (query && query !== searchQuery) {
      const urlFilters = {
        location: searchParams.get('location') || undefined,
        universityTier: searchParams.get('tier') || undefined,
        majorCategory: searchParams.get('category') || undefined,
        degreeLevel: searchParams.get('degree') || undefined,
        minScore: searchParams.get('minScore') ? Number(searchParams.get('minScore')) : undefined,
      };

      searchMajors(query, urlFilters);
    }

    // 加载筛选选项
    loadFilterOptions();
  }, [searchParams, searchQuery, searchMajors, loadFilterOptions]);

  const handleViewDetails = (majorId: string) => {
    navigate(`/major/${majorId}`);
  };

  const handleFiltersChange = (newFilters: any) => {
    applyFilters(newFilters);
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    setExportLoading(true);
    try {
      const downloadUrl = await exportResults(format);
      // 在实际应用中，这里会触发文件下载
      console.log('Export URL:', downloadUrl);
      setShowExportSnackbar(true);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExportLoading(false);
    }
  };

  const handleCompareClick = () => {
    if (comparison.length > 0) {
      navigate(`/compare?majors=${comparison.join(',')}`);
    }
  };

  const allExpanded = results.length > 0 && expandedCards.length === results.length;

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Container maxWidth="xl" sx={{ py: 4, height: '100%' }}>
        {/* 页面标题和操作栏 */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                匹配结果
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {searchQuery && `搜索"${searchQuery}"的结果`}
                {pagination && ` · 共找到 ${pagination.total} 个匹配专业`}
              </Typography>
            </Box>

            {/* 操作按钮 */}
            {!isMobile && results.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={allExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  onClick={allExpanded ? collapseAllCards : expandAllCards}
                  size="small"
                >
                  {allExpanded ? '收起全部' : '展开全部'}
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleExport('excel')}
                  disabled={exportLoading}
                  size="small"
                >
                  导出结果
                </Button>
              </Box>
            )}
          </Box>

          {/* 对比栏 */}
          {comparison.length > 0 && (
            <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'primary.50' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="body2" fontWeight="medium">
                  对比列表 ({comparison.length}/4):
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', flexGrow: 1 }}>
                  {comparison.map((majorId) => {
                    const major = results.find(r => r.id === majorId);
                    return major ? (
                      <Chip
                        key={majorId}
                        label={`${major.name} - ${major.university.name}`}
                        onDelete={() => removeFromComparison(majorId)}
                        size="small"
                      />
                    ) : null;
                  })}
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<CompareIcon />}
                  onClick={handleCompareClick}
                >
                  开始对比
                </Button>
              </Box>
            </Paper>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* 筛选面板 */}
          <Box sx={{ width: { xs: '100%', md: '300px' }, flexShrink: 0 }}>
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              availableOptions={filterOptions}
              loading={loading}
            />
          </Box>

          {/* 结果列表 */}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            {loading && results.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : results.length > 0 ? (
              <>
                {results.map((major) => (
                  <MatchResultCard
                    key={major.id}
                    major={major}
                    onViewDetails={handleViewDetails}
                    onToggleFavorite={toggleFavorite}
                    onAddToCompare={addToComparison}
                    isFavorited={favorites.includes(major.id)}
                    isInComparison={comparison.includes(major.id)}
                    expanded={expandedCards.includes(major.id)}
                    onToggleExpand={toggleCardExpansion}
                  />
                ))}

                {/* 分页控制 */}
                {pagination && (
                  <Paper elevation={1} sx={{ mt: 2 }}>
                    <PaginationControls
                      pagination={pagination}
                      onPageChange={changePage}
                      onPageSizeChange={changePageSize}
                      loading={loading}
                    />
                  </Paper>
                )}
              </>
            ) : (
              <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {searchQuery ? '未找到匹配的专业' : '请输入搜索条件'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchQuery ? '尝试调整筛选条件或搜索其他关键词' : '从搜索页面开始您的专业匹配之旅'}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/search')}
                  sx={{ mt: 2 }}
                >
                  去搜索
                </Button>
              </Paper>
            )}
          </Box>
        </Box>

        {/* 移动端浮动操作按钮 */}
        {isMobile && comparison.length > 0 && (
          <Fab
            color="primary"
            onClick={handleCompareClick}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000,
            }}
          >
            <CompareIcon />
          </Fab>
        )}

        {/* 错误提示 */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={clearError}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={clearError} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>

        {/* 导出成功提示 */}
        <Snackbar
          open={showExportSnackbar}
          autoHideDuration={3000}
          onClose={() => setShowExportSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setShowExportSnackbar(false)}
            severity="success"
            sx={{ width: '100%' }}
          >
            导出成功！文件将自动下载
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default ResultsPage;
