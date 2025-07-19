import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  useTheme,
} from '@mui/material';
// 定义组件Props类型
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  loading?: boolean;
}

// {{CHENGQI:
// Action: Added
// Timestamp: [2025-01-19 17:35:00 +08:00]
// Reason: 创建统计卡片组件，展示Dashboard基础统计数据
// Principle_Applied: SOLID (单一职责 - 只负责统计数据展示), KISS (简洁的卡片设计)
// Optimization: 支持加载状态，响应式设计，Material Design风格
// Architectural_Note (AR): 可复用的统计卡片组件，支持不同颜色主题
// Documentation_Note (DW): StatCard组件已创建，用于Dashboard统计数据展示
// }}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = 'primary',
  loading = false,
}) => {
  const theme = useTheme();

  const getColorStyles = (colorName: string) => {
    const colors = {
      primary: {
        bg: theme.palette.primary.main + '15',
        icon: theme.palette.primary.main,
      },
      secondary: {
        bg: theme.palette.secondary.main + '15',
        icon: theme.palette.secondary.main,
      },
      success: {
        bg: theme.palette.success.main + '15',
        icon: theme.palette.success.main,
      },
      warning: {
        bg: theme.palette.warning.main + '15',
        icon: theme.palette.warning.main,
      },
      error: {
        bg: theme.palette.error.main + '15',
        icon: theme.palette.error.main,
      },
      info: {
        bg: theme.palette.info.main + '15',
        icon: theme.palette.info.main,
      },
    };
    return colors[colorName as keyof typeof colors] || colors.primary;
  };

  const colorStyles = getColorStyles(color);

  if (loading) {
    return (
      <Card
        elevation={2}
        sx={{
          height: '100%',
          borderRadius: 2,
          transition: 'all 0.3s ease',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Skeleton
              variant="circular"
              width={56}
              height={56}
              sx={{ flexShrink: 0 }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="80%" height={32} sx={{ mt: 1 }} />
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          elevation: 4,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* 图标区域 */}
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              backgroundColor: colorStyles.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colorStyles.icon,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>

          {/* 内容区域 */}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontWeight: 500,
                mb: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                lineHeight: 1.2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
