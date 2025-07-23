import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  School as SchoolIcon,
  Work as WorkIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import type { TopMajor } from '../types';

interface MajorCardProps {
  major: TopMajor;
  onClick: (major: TopMajor) => void;
}

const MajorCard: React.FC<MajorCardProps> = ({ major, onClick }) => {
  // 根据分数获取颜色
  const getScoreColor = (score: number) => {
    if (score >= 90) return '#4caf50';
    if (score >= 80) return '#8bc34a';
    if (score >= 70) return '#cddc39';
    if (score >= 60) return '#ffc107';
    return '#ff9800';
  };

  // 根据就业率获取颜色
  const getEmploymentColor = (rate: number) => {
    if (rate >= 90) return '#4caf50';
    if (rate >= 80) return '#8bc34a';
    if (rate >= 70) return '#cddc39';
    if (rate >= 60) return '#ffc107';
    return '#ff9800';
  };

  // 根据薪资水平获取文本
  const getSalaryText = (level: number) => {
    switch (level) {
      case 5:
        return '极高';
      case 4:
        return '较高';
      case 3:
        return '中等';
      case 2:
        return '较低';
      case 1:
        return '低';
      default:
        return '未知';
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        border: '1px solid rgba(5, 5, 5, 0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
          borderColor: 'primary.main',
        },
      }}
    >
      <CardContent sx={{ p: 3, flexGrow: 1 }}>
        {/* 专业名称 */}
        <Typography
          variant="h6"
          fontWeight={600}
          gutterBottom
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minHeight: '3.6rem',
          }}
        >
          {major.majorName}
        </Typography>

        {/* 学校名称 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SchoolIcon sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {major.schoolName}
          </Typography>
        </Box>

        {/* 匹配分数 */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" fontWeight={500}>
              匹配度
            </Typography>
            <Typography
              variant="body2"
              fontWeight={700}
              sx={{ color: getScoreColor(major.matchScore) }}
            >
              {major.matchScore}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={major.matchScore}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getScoreColor(major.matchScore),
              },
            }}
          />
        </Box>

        {/* 就业率和薪资水平 */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            size="small"
            icon={<WorkIcon sx={{ fontSize: '0.875rem !important' }} />}
            label={`就业率 ${major.employmentRate}%`}
            sx={{
              backgroundColor: `${getEmploymentColor(major.employmentRate)}20`,
              color: getEmploymentColor(major.employmentRate),
              fontWeight: 500,
            }}
          />
          <Chip
            size="small"
            icon={<TrendingUpIcon sx={{ fontSize: '0.875rem !important' }} />}
            label={`薪资 ${getSalaryText(major.salaryLevel)}`}
            sx={{
              backgroundColor: 'rgba(25, 118, 210, 0.1)',
              color: 'primary.main',
              fontWeight: 500,
            }}
          />
        </Box>

        {/* 专业描述 */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            mb: 2,
            minHeight: '4.5rem',
          }}
        >
          {major.description}
        </Typography>

        {/* 查看详情按钮 */}
        <Button
          variant="outlined"
          fullWidth
          onClick={() => onClick(major)}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          查看详情
        </Button>
      </CardContent>
    </Card>
  );
};

export default MajorCard;