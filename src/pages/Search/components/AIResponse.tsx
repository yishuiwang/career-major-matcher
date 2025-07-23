// {{CHENGQI:
// Action: Created
// Timestamp: [2025-01-21 10:35:00 +08:00]
// Reason: 创建AI回复组件，将Top 10专业内容内嵌到Markdown分析中，符合Grok AI风格
// Principle_Applied: SOLID (单一职责原则), KISS (简洁的AI回复展示), DRY (复用AI回复逻辑)
// Optimization: 将专业卡片内嵌到流式文本中，提供更自然的对话体验
// Architectural_Note (AR): 独立的AI回复组件，整合分析内容和专业推荐
// Documentation_Note (DW): AIResponse组件 - AI回复展示，内嵌Top 10专业内容
// }}

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Button,
} from '@mui/material';
import {
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import type { AIResponseProps } from '../types';
import type { TopMajor } from '../types';

const AIResponse: React.FC<AIResponseProps> = ({
  searchResults,
  isStreaming = false,
}) => {
  // 简单的Markdown渲染函数
  const renderMarkdownContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let currentIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // 标题处理
      if (line.startsWith('# ')) {
        elements.push(
          <Typography
            key={currentIndex++}
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              mt: i > 0 ? 3 : 0,
              color: 'text.primary',
            }}
          >
            {line.substring(2)}
          </Typography>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <Typography
            key={currentIndex++}
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 600,
              mb: 1.5,
              mt: 2,
              color: 'text.primary',
            }}
          >
            {line.substring(3)}
          </Typography>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <Typography
            key={currentIndex++}
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              mb: 1,
              mt: 1.5,
              color: 'text.primary',
            }}
          >
            {line.substring(4)}
          </Typography>
        );
      } else if (line.startsWith('- ')) {
        // 列表项
        elements.push(
          <Typography
            key={currentIndex++}
            variant="body1"
            component="li"
            sx={{
              mb: 0.5,
              ml: 2,
              color: 'text.primary',
              listStyleType: 'disc',
              display: 'list-item',
            }}
          >
            {line.substring(2)}
          </Typography>
        );
      } else if (line.match(/^\d+\. /)) {
        // 有序列表
        elements.push(
          <Typography
            key={currentIndex++}
            variant="body1"
            component="li"
            sx={{
              mb: 0.5,
              ml: 2,
              color: 'text.primary',
              listStyleType: 'decimal',
              display: 'list-item',
            }}
          >
            {line.replace(/^\d+\. /, '')}
          </Typography>
        );
      } else if (line.trim() === '') {
        // 空行
        elements.push(<Box key={currentIndex++} sx={{ height: 8 }} />);
      } else {
        // 普通段落
        if (line.trim()) {
          // 处理行内格式
          const processedLine = line
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code style="background-color: rgba(0,0,0,0.1); padding: 2px 4px; border-radius: 3px; font-family: monospace;">$1</code>');

          elements.push(
            <Typography
              key={currentIndex++}
              variant="body1"
              sx={{
                mb: 1,
                color: 'text.primary',
                lineHeight: 1.6,
                '& strong': {
                  fontWeight: 700,
                },
                '& em': {
                  fontStyle: 'italic',
                },
              }}
              dangerouslySetInnerHTML={{ __html: processedLine }}
            />
          );
        }
      }
    }

    return elements;
  };
  // 生成包含Top 10专业的完整Markdown内容
  const generateEnhancedContent = (analysis: string, majors: TopMajor[]): string => {
    if (!majors || majors.length === 0) {
      return analysis;
    }

    // 在分析内容中插入Top 10专业
    const topMajorsSection = `

## 🎯 Top ${majors.length} 推荐专业

基于您的查询，我为您精选了以下最匹配的专业：

${majors.map((major, index) => `
### ${index + 1}. ${major.majorName} - ${major.schoolName}

**匹配度：** ${major.matchScore}% | **就业率：** ${major.employmentRate}% | **平均薪资：** ¥${major.salaryLevel.toLocaleString()}

${major.description}

---
`).join('')}

## 💡 选择建议

以上专业都是基于您的需求精心筛选的，建议您：

1. **优先考虑前3名专业** - 它们在匹配度和就业前景方面表现最佳
2. **关注学校地理位置** - 选择适合您未来发展的城市
3. **了解专业课程设置** - 确保与您的兴趣和能力相匹配
4. **考虑行业发展趋势** - 选择有长期发展潜力的专业

点击下方的专业卡片可以查看更详细的信息和报告。`;

    return analysis + topMajorsSection;
  };

  // 渲染专业卡片
  const renderMajorCard = (major: TopMajor, index: number) => (
    <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={major.id}>
      <Card
        sx={{
          height: '100%',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          border: '1px solid rgba(5, 5, 5, 0.1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderColor: 'primary.main',
          },
          position: 'relative',
        }}
        onClick={() => {
          console.log('点击专业卡片:', major);
          // 这里可以实现跳转到专业详情页面的逻辑
        }}
      >
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

        <CardContent sx={{ p: 3 }}>
          {/* 学校名称 */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <SchoolIcon sx={{ color: 'primary.main', mr: 1, fontSize: '1.2rem' }} />
            <Typography variant="subtitle2" color="primary.main" fontWeight={600}>
              {major.schoolName}
            </Typography>
          </Box>

          {/* 专业名称 */}
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2, lineHeight: 1.3 }}>
            {major.majorName}
          </Typography>

          {/* 匹配度 */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                匹配度
              </Typography>
              <Typography variant="body2" fontWeight={600} color="primary.main">
                {major.matchScore}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={major.matchScore}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                },
              }}
            />
          </Box>

          {/* 关键指标 */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip
              icon={<WorkIcon />}
              label={`就业率 ${major.employmentRate}%`}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
            <Chip
              icon={<MoneyIcon />}
              label={`¥${(major.salaryLevel / 1000).toFixed(0)}k`}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          </Box>

          {/* 专业描述 */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {major.description}
          </Typography>

          {/* 查看详情按钮 */}
          <Button
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            查看详细报告
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );

  // 如果正在搜索且没有结果，显示加载状态
  if (isStreaming && !searchResults) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
          textAlign: 'center',
        }}
      >
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
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

  const enhancedContent = generateEnhancedContent(
    searchResults.analysis,
    searchResults.topMajors
  );

  return (
    <Box sx={{ width: '100%' }}>
      {/* 分析内容 */}
      <Box sx={{ mb: 4 }}>
        {renderMarkdownContent(enhancedContent)}
      </Box>

      {/* 专业卡片 */}
      {searchResults.topMajors.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <TrendingUpIcon sx={{ mr: 1, color: 'primary.main' }} />
            推荐专业详情
          </Typography>
          <Grid container spacing={3}>
            {searchResults.topMajors.map((major, index) =>
              renderMajorCard(major, index)
            )}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default AIResponse;
