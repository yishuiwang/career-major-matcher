import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Fab,
  useTheme,
  useMediaQuery,
  Skeleton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  MenuBook as MenuBookIcon,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import MarkdownRenderer from '../../components/reports/MarkdownRenderer';
import ReportTOC from '../../components/reports/ReportTOC';
import ExportControls from '../../components/reports/ExportControls';

// {{CHENGQI:
// Action: Modified
// Timestamp: [2025-01-19 18:45:00 +08:00]
// Reason: 重新实现ReportPage，集成Markdown渲染、目录导航、搜索、导出功能
// Principle_Applied: SOLID (单一职责 - 只负责报告页面组合), DRY (复用组件)
// Optimization: 响应式设计，状态管理，URL参数支持
// Architectural_Note (AR): 完整的报告页面实现，集成所有功能组件
// Documentation_Note (DW): ReportPage已重新实现，包含完整的报告展示功能
// }}

const ReportPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { reportId } = useParams<{ reportId: string }>();
  const [tocCollapsed, setTocCollapsed] = useState(isMobile);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<any>(null);
  const [toc, setTOC] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 模拟加载报告数据
  useEffect(() => {
    const loadReportData = async () => {
      setLoading(true);
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 模拟报告数据
      const mockReport = {
        content: `# 软件工程师专业匹配分析报告

## 报告概述

本报告基于您的搜索条件"软件工程师"，对相关专业进行了深入分析，为您提供专业选择的决策支持。

### 分析范围
- **目标岗位群**: 软件工程师
- **分析专业数量**: 5个
- **数据来源**: 全国高等院校专业数据库
- **分析时间**: ${new Date().toLocaleDateString()}

---

## 1. 专业概述

### 1.1 推荐专业列表

根据技能匹配度和就业前景分析，为您推荐以下专业：

| 排名 | 专业名称 | 院校 | 综合评分 | 技能匹配度 | 就业匹配度 |
|------|----------|------|----------|------------|------------|
| 1 | 软件工程 | 清华大学 | 95.2 | 94.8% | 95.6% |
| 2 | 计算机科学与技术 | 北京大学 | 93.7 | 93.2% | 94.2% |
| 3 | 人工智能 | 上海交通大学 | 91.5 | 90.8% | 92.2% |
| 4 | 数据科学与大数据技术 | 浙江大学 | 89.3 | 88.7% | 89.9% |
| 5 | 信息安全 | 华中科技大学 | 87.8 | 86.5% | 89.1% |

## 2. 技能匹配度分析

### 2.1 核心技能要求

软件工程师岗位的核心技能要求如下：

#### 编程语言技能
- **Java**: 重要性 90%, 平均匹配度 88%
- **Python**: 重要性 85%, 平均匹配度 82%
- **JavaScript**: 重要性 80%, 平均匹配度 75%
- **C++**: 重要性 75%, 平均匹配度 78%

## 3. 就业前景分析

### 3.1 就业率统计

| 专业 | 整体就业率 | 对口就业率 | 平均起薪 | 薪资增长率 |
|------|------------|------------|----------|------------|
| 软件工程 | 96.8% | 89.2% | ¥12,500 | 15%/年 |
| 计算机科学与技术 | 95.5% | 87.8% | ¥11,800 | 14%/年 |
| 人工智能 | 94.2% | 85.6% | ¥13,200 | 18%/年 |

## 4. 总结与建议

### 4.1 核心建议

1. **首选推荐**: 软件工程专业，综合评分最高，就业前景最好
2. **备选方案**: 计算机科学与技术，基础扎实，发展空间大
3. **新兴方向**: 人工智能专业，符合技术发展趋势

*本报告基于当前市场数据和专业分析生成，建议结合个人实际情况进行决策。*`,
        metadata: {
          reportId: reportId || 'demo-report-001',
          jobGroupName: '软件工程师',
          majorCount: 5,
          reportType: 'detailed',
          createdAt: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
      };

      setReport(mockReport);
      setLoading(false);
    };

    loadReportData();
  }, [reportId]);

  const handleTOCGenerated = (generatedTOC: any) => {
    setTOC(generatedTOC);
  };

  const handleSectionClick = (anchor: string) => {
    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    if (isMobile) {
      setTocCollapsed(true);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleExport = async (options: any) => {
    console.log('导出报告:', options);
    // 模拟导出功能
    alert(`正在导出${options.format.toUpperCase()}格式的报告...`);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* 目录骨架 */}
          {!isMobile && (
            <Box sx={{ width: 300, flexShrink: 0 }}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="text" width="100%" height={24} sx={{ mt: 1 }} />
                <Skeleton variant="text" width="80%" height={24} />
                <Skeleton variant="text" width="90%" height={24} />
                <Skeleton variant="text" width="70%" height={24} />
              </Paper>
            </Box>
          )}

          {/* 内容骨架 */}
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton variant="text" width="40%" height={48} />
            <Skeleton variant="text" width="60%" height={24} sx={{ mt: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={400} sx={{ mt: 3 }} />
          </Box>
        </Box>
      </Container>
    );
  }

  if (!report) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            未找到报告
          </Typography>
          <Typography variant="body2" color="text.secondary">
            请确认报告ID是否正确
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Container maxWidth="xl" sx={{ py: 4, height: '100%' }}>
        {/* 报告头部 */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {report.metadata.jobGroupName} - 专业匹配分析报告
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                报告类型：{report.metadata.reportType} ·
                分析专业：{report.metadata.majorCount}个 ·
                生成时间：{new Date(report.createdAt).toLocaleString()}
              </Typography>
            </Box>

            {/* 操作按钮 */}
            {!isMobile && (
              <ExportControls
                reportId={report.metadata.reportId}
                onExport={handleExport}
                loading={false}
              />
            )}
          </Box>

          {/* 搜索栏 */}
          <Paper elevation={1} sx={{ p: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="在报告中搜索..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleClearSearch}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Paper>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* 目录导航 */}
          {!isMobile && toc && (
            <Box sx={{ width: 300, flexShrink: 0 }}>
              <ReportTOC
                toc={toc}
                onSectionClick={handleSectionClick}
                collapsed={tocCollapsed}
                onToggleCollapse={() => setTocCollapsed(!tocCollapsed)}
              />
            </Box>
          )}

          {/* 报告内容 */}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Paper elevation={2} sx={{ p: { xs: 2, md: 4 } }}>
              <MarkdownRenderer
                content={report.content}
                onTOCGenerated={handleTOCGenerated}
                searchTerm={searchTerm}
                highlightMatches={true}
              />
            </Paper>
          </Box>
        </Box>

        {/* 移动端浮动按钮 */}
        {isMobile && toc && (
          <Fab
            color="primary"
            onClick={() => setTocCollapsed(!tocCollapsed)}
            sx={{
              position: 'fixed',
              bottom: 80,
              right: 16,
              zIndex: 1000,
            }}
          >
            <MenuBookIcon />
          </Fab>
        )}
      </Container>
    </Box>
  );


};

export default ReportPage;
