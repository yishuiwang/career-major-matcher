import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  LinearProgress,
  Collapse,
  Divider,

  Avatar,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Compare as CompareIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  TrendingUp as TrendingUpIcon,
  LocationOn as LocationIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
// 定义数据类型
interface University {
  id: string;
  name: string;
  location: {
    province: string;
    city: string;
    coordinates: [number, number];
  };
  tier: '985' | '211' | '双一流' | '普通';
  logo?: string;
  establishedYear?: number;
}

interface Skill {
  name: string;
  category: string;
  matchScore: number;
  importance: number;
}

interface EmploymentData {
  totalGraduates: number;
  employmentRate: number;
  relatedFieldRate: number;
  averageSalary?: number;
  topEmployers?: string[];
}

interface Major {
  id: string;
  name: string;
  code: string;
  category: string;
  degree: '本科' | '硕士' | '博士';
  university: University;
  description?: string;
  skillsMatch: number;
  employmentMatch: number;
  finalScore: number;
  skills: Skill[];
  employmentData: EmploymentData;
}

// {{CHENGQI:
// Action: Added
// Timestamp: [2025-01-19 18:00:00 +08:00]
// Reason: 创建匹配结果卡片组件，展示单个专业的详细信息和匹配度
// Principle_Applied: SOLID (单一职责 - 只负责单个结果展示), KISS (清晰的信息层次)
// Optimization: 支持展开/收起、收藏、对比等交互功能
// Architectural_Note (AR): 可复用的结果卡片组件，支持多种交互状态
// Documentation_Note (DW): MatchResultCard组件已创建，用于展示专业匹配结果
// }}

interface MatchResultCardProps {
  major: Major;
  onViewDetails: (majorId: string) => void;
  onToggleFavorite?: (majorId: string) => void;
  onAddToCompare?: (majorId: string) => void;
  isFavorited?: boolean;
  isInComparison?: boolean;
  expanded?: boolean;
  onToggleExpand?: (majorId: string) => void;
}

const MatchResultCard: React.FC<MatchResultCardProps> = ({
  major,
  onViewDetails,
  onToggleFavorite,
  onAddToCompare,
  isFavorited = false,
  isInComparison = false,
  expanded = false,
  onToggleExpand,
}) => {
  const theme = useTheme();

  const handleExpandClick = () => {
    if (onToggleExpand) {
      onToggleExpand(major.id);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return theme.palette.success.main;
    if (score >= 80) return theme.palette.info.main;
    if (score >= 70) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const formatSalary = (salary: number) => {
    if (salary >= 10000) {
      return `${(salary / 10000).toFixed(1)}万`;
    }
    return `${salary}`;
  };

  return (
    <Card
      elevation={2}
      sx={{
        mb: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          elevation: 4,
          transform: 'translateY(-2px)',
        },
        border: isInComparison ? `2px solid ${theme.palette.primary.main}` : 'none',
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        {/* 头部信息 */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              width: 56,
              height: 56,
            }}
          >
            <SchoolIcon />
          </Avatar>
          
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {major.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {major.university.name} · {major.university.location.city}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              <Chip
                size="small"
                label={major.university.tier}
                color="primary"
                variant="outlined"
              />
              <Chip
                size="small"
                label={major.category}
                color="secondary"
                variant="outlined"
              />
              <Chip
                size="small"
                label={major.degree}
                variant="outlined"
              />
            </Box>
          </Box>

          {/* 综合评分 */}
          <Box sx={{ textAlign: 'center', minWidth: 80 }}>
            <Typography
              variant="h4"
              component="div"
              sx={{
                color: getScoreColor(major.finalScore),
                fontWeight: 'bold',
                lineHeight: 1,
              }}
            >
              {major.finalScore.toFixed(1)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              综合评分
            </Typography>
          </Box>
        </Box>

        {/* 匹配度指标 */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">技能匹配度</Typography>
              <Typography variant="body2" fontWeight="medium">
                {major.skillsMatch.toFixed(1)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={major.skillsMatch}
              sx={{
                height: 6,
                borderRadius: 3,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getScoreColor(major.skillsMatch),
                },
              }}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">就业匹配度</Typography>
              <Typography variant="body2" fontWeight="medium">
                {major.employmentMatch.toFixed(1)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={major.employmentMatch}
              sx={{
                height: 6,
                borderRadius: 3,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getScoreColor(major.employmentMatch),
                },
              }}
            />
          </Box>
        </Box>

        {/* 就业数据概览 */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {major.employmentData.employmentRate.toFixed(1)}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              就业率
            </Typography>
          </Box>

          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {formatSalary(major.employmentData.averageSalary || 0)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              平均薪资
            </Typography>
          </Box>

          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {major.employmentData.totalGraduates}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              毕业生数
            </Typography>
          </Box>
        </Box>

        {/* 展开的详细信息 */}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Divider sx={{ my: 2 }} />
          
          {/* 专业描述 */}
          {major.description && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                专业介绍
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {major.description}
              </Typography>
            </Box>
          )}

          {/* 技能详情 */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              技能匹配详情
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {major.skills.slice(0, 5).map((skill, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">{skill.name}</Typography>
                  <Typography variant="body2" color="primary" fontWeight="medium">
                    {skill.matchScore.toFixed(0)}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* 主要雇主 */}
          {major.employmentData.topEmployers && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                主要雇主
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {major.employmentData.topEmployers.map((employer, index) => (
                  <Chip
                    key={index}
                    label={employer}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </Collapse>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Button
          size="small"
          startIcon={<InfoIcon />}
          onClick={() => onViewDetails(major.id)}
        >
          查看详情
        </Button>
        
        <Box sx={{ flexGrow: 1 }} />
        
        {onToggleFavorite && (
          <Tooltip title={isFavorited ? '取消收藏' : '收藏'}>
            <IconButton
              size="small"
              onClick={() => onToggleFavorite(major.id)}
              color={isFavorited ? 'error' : 'default'}
            >
              {isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>
        )}
        
        {onAddToCompare && (
          <Tooltip title={isInComparison ? '已在对比中' : '添加到对比'}>
            <IconButton
              size="small"
              onClick={() => onAddToCompare(major.id)}
              color={isInComparison ? 'primary' : 'default'}
              disabled={isInComparison}
            >
              <CompareIcon />
            </IconButton>
          </Tooltip>
        )}
        
        {onToggleExpand && (
          <Tooltip title={expanded ? '收起' : '展开详情'}>
            <IconButton
              size="small"
              onClick={handleExpandClick}
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Tooltip>
        )}
      </CardActions>
    </Card>
  );
};

export default MatchResultCard;
