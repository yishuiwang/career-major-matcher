// {{CHENGQI:
// Action: Created
// Timestamp: [2025-01-20 16:25:00 +08:00]
// Reason: 创建搜索结果展示组件，包含流式文本、D3图表占位符和专业卡片列表
// Principle_Applied: SOLID (单一职责原则), KISS (简洁的结果展示), DRY (复用结果展示逻辑)
// Optimization: 响应式网格布局，流式内容展示，清晰的信息层次
// Architectural_Note (AR): 独立的搜索结果组件，支持流式输出和卡片展示
// Documentation_Note (DW): SearchResults组件 - 搜索结果展示，包含分析内容和专业卡片
// }}

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import type { SearchResultsProps } from '../types';
import type { TopMajor } from '../types';
import StreamingText from './StreamingText';
import MajorCard from './MajorCard';

const SearchResults: React.FC<SearchResultsProps> = ({
  searchResults,
  streamingContent,
  isSearching,
}) => {
  const handleMajorCardClick = (major: TopMajor) => {
    console.log('点击专业卡片:', major);
    // 这里可以实现跳转到专业详情页面的逻辑
  };

  if (isSearching) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          textAlign: 'center',
        }}
      >
        <CircularProgress size={40} sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          正在分析中...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          我们正在为您匹配最适合的专业
        </Typography>
      </Box>
    );
  }

  if (!searchResults) {
    return null;
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* 查询信息 */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 1,
          }}
        >
          "{searchResults.query}" 的专业匹配分析
        </Typography>
        <Typography variant="body2" color="text.secondary">
          分析时间：{searchResults.timestamp.toLocaleString()}
        </Typography>
      </Box>

      {/* 流式分析内容 */}
      {streamingContent && (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            backgroundColor: '#fcfcfc',
            border: '1px solid rgba(5, 5, 5, 0.1)',
            borderRadius: '16px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <AnalyticsIcon sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6" fontWeight={600}>
              智能分析报告
            </Typography>
          </Box>
          <StreamingText
            content={streamingContent}
            speed={50}
            onComplete={() => {
              console.log('流式输出完成');
            }}
          />
        </Paper>
      )}

      {/* D3图表占位符 */}
      {searchResults.topMajors.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            backgroundColor: '#fcfcfc',
            border: '1px solid rgba(5, 5, 5, 0.1)',
            borderRadius: '16px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <AnalyticsIcon sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6" fontWeight={600}>
              匹配得分可视化
            </Typography>
          </Box>
          <Box
            sx={{
              height: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              borderRadius: '12px',
              border: '2px dashed rgba(5, 5, 5, 0.1)',
            }}
          >
            <Typography variant="body1" color="text.secondary">
              D3.js 图表将在此处显示
            </Typography>
          </Box>
        </Paper>
      )}

      <Divider sx={{ my: 4, borderColor: 'rgba(5, 5, 5, 0.1)' }} />

      {/* Top 10 专业卡片 */}
      {searchResults.topMajors.length > 0 && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <SchoolIcon sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6" fontWeight={600}>
              Top {searchResults.topMajors.length} 推荐专业
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {searchResults.topMajors.map((major, index) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={major.id}>
                <Box sx={{ position: 'relative' }}>
                  {/* 排名标识 */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -8,
                      left: -8,
                      zIndex: 1,
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: 
                        index === 0 ? '#ffd700' : // 金色
                        index === 1 ? '#c0c0c0' : // 银色
                        index === 2 ? '#cd7f32' : // 铜色
                        'primary.main',
                      color: index < 3 ? '#000' : 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    {index + 1}
                  </Box>
                  <MajorCard
                    major={major}
                    onClick={handleMajorCardClick}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* 底部提示 */}
      <Box
        sx={{
          mt: 6,
          p: 3,
          backgroundColor: 'rgba(25, 118, 210, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(25, 118, 210, 0.1)',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500 }}>
          💡 提示：点击专业卡片可查看更多详细信息，点击"查看详细报告"可获取完整的专业分析报告
        </Typography>
      </Box>
    </Box>
  );
};

export default SearchResults;
