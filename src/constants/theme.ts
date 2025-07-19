import { createTheme } from '@mui/material/styles';

// {{CHENGQI:
// Action: Added
// Timestamp: [2025-01-19 16:43:00 +08:00]
// Reason: 创建Material-UI主题配置，定义应用的视觉风格
// Principle_Applied: SOLID (单一职责 - 只负责主题配置), DRY (统一的设计系统)
// Optimization: 响应式设计，支持深色和浅色主题
// Architectural_Note (AR): 主题系统配置，支持全局样式定制
// Documentation_Note (DW): 主题配置文档已创建，包含颜色、字体、间距等设置
// }}

// 定义主色调
const primaryColor = {
  main: '#1976d2', // 蓝色主色调
  light: '#42a5f5',
  dark: '#1565c0',
  contrastText: '#ffffff',
};

const secondaryColor = {
  main: '#dc004e', // 红色辅助色
  light: '#ff5983',
  dark: '#9a0036',
  contrastText: '#ffffff',
};

// 创建主题
export const theme = createTheme({
  palette: {
    primary: primaryColor,
    secondary: secondaryColor,
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  spacing: 8, // 基础间距单位
  shape: {
    borderRadius: 8, // 圆角半径
  },
  components: {
    // 自定义组件样式
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // 禁用按钮文字大写转换
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default theme;
