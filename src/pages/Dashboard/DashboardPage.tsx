import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  School as SchoolIcon,
  Work as WorkIcon,
  TrendingUp as TrendingIcon,
  Update as UpdateIcon,
} from '@mui/icons-material';
import StatCard from '../../components/common/StatCard';
import SankeyChart from '../../components/charts/SankeyChart';
import HeatMap from '../../components/charts/HeatMap';
import { useDashboardStore } from '../../store/dashboardStore';

// {{CHENGQI:
// Action: Modified
// Timestamp: [2025-01-19 17:48:00 +08:00]
// Reason: 重新实现Dashboard页面，集成统计卡片、桑基图、热力图组件
// Principle_Applied: SOLID (单一职责 - 只负责Dashboard页面组合), DRY (复用组件)
// Optimization: 响应式设计，数据驱动的状态管理，错误处理
// Architectural_Note (AR): 完整的Dashboard页面实现，集成所有可视化组件
// Documentation_Note (DW): DashboardPage已重新实现，包含完整的数据可视化功能
// }}

const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const {
    statistics,
    sankeyData,
    heatMapData,
    loading,
    error,
    loadAllData,
    clearError,
  } = useDashboardStore();

  // 页面加载时获取数据
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // 格式化更新时间
  const formatUpdateTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '未知';
    }
  };

  const handleNodeClick = (node: any) => {
    console.log('Node clicked:', node);
    // TODO: 实现节点点击处理逻辑
  };

  const handleCloseError = (type: keyof typeof error) => {
    clearError(type);
  };

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Container maxWidth="xl" sx={{ py: 4, height: '100%' }}>
        {/* 页面标题 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            数据概览
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            查看系统数据统计和可视化图表
          </Typography>
        </Box>

        {/* 统计卡片区域 */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="大学总数"
              value={statistics?.totalUniversities || 0}
              icon={<SchoolIcon fontSize="large" />}
              color="primary"
              loading={loading.statistics}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="专业总数"
              value={statistics?.totalMajors || 0}
              icon={<WorkIcon fontSize="large" />}
              color="secondary"
              loading={loading.statistics}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="岗位群总数"
              value={statistics?.totalJobGroups || 0}
              icon={<TrendingIcon fontSize="large" />}
              color="success"
              loading={loading.statistics}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="数据更新时间"
              value={statistics ? formatUpdateTime(statistics.lastUpdateTime) : '加载中...'}
              icon={<UpdateIcon fontSize="large" />}
              color="info"
              loading={loading.statistics}
            />
          </Grid>
        </Grid>

        {/* 图表区域 */}
        <Grid container spacing={3}>
          {/* 桑基图 */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <SankeyChart
              data={sankeyData || { nodes: [], links: [] }}
              width={isMobile ? 350 : 800}
              height={500}
              loading={loading.sankey}
              onNodeClick={handleNodeClick}
            />
          </Grid>

          {/* 热力图 */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <HeatMap
              data={heatMapData || { data: [], maxValue: 0, minValue: 0 }}
              height={500}
              loading={loading.heatMap}
              title="毕业生就业地理分布"
            />
          </Grid>
        </Grid>

        {/* 错误提示 */}
        {Object.entries(error).map(([key, errorMessage]) => (
          errorMessage && (
            <Snackbar
              key={key}
              open={!!errorMessage}
              autoHideDuration={6000}
              onClose={() => handleCloseError(key as keyof typeof error)}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Alert
                onClose={() => handleCloseError(key as keyof typeof error)}
                severity="error"
                sx={{ width: '100%' }}
              >
                {errorMessage}
              </Alert>
            </Snackbar>
          )
        ))}
      </Container>
    </Box>
  );
};

export default DashboardPage;
