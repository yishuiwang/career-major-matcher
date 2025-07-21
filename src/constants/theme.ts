import { createTheme } from '@mui/material/styles';

// {{CHENGQI:
// Action: Modified
// Timestamp: [2025-01-21 14:30:00 +08:00]
// Reason: 重构主题配置以符合Google Gemini设计语言，采用更柔和的色彩方案和现代化的设计系统
// Principle_Applied: SOLID (单一职责 - 只负责主题配置), KISS (简化设计系统), DRY (统一的设计标准)
// Optimization: Google Gemini风格的颜色、字体、间距系统，提升用户体验
// Architectural_Note (AR): 基于Material Design 3.0和Google Gemini设计语言的主题系统
// Documentation_Note (DW): 主题配置已更新为Google Gemini风格，包含新的颜色方案、字体系统和间距规范
// }}

// Google Gemini 风格的颜色方案
const primaryColor = {
  main: '#1a73e8', // Google Blue - 更柔和的蓝色
  light: '#4285f4',
  dark: '#1557b0',
  contrastText: '#ffffff',
};

const secondaryColor = {
  main: '#34a853', // Google Green - 辅助色
  light: '#5bb974',
  dark: '#137333',
  contrastText: '#ffffff',
};

// Gemini 风格的中性色调
const neutralColors = {
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#eeeeee',
  300: '#e0e0e0',
  400: '#bdbdbd',
  500: '#9e9e9e',
  600: '#757575',
  700: '#616161',
  800: '#424242',
  900: '#212121',
};

// 创建 Google Gemini 风格主题
export const theme = createTheme({
  palette: {
    primary: primaryColor,
    secondary: secondaryColor,
    background: {
      default: '#fafafa', // 更柔和的背景色
      paper: '#ffffff',
    },
    text: {
      primary: '#202124', // Google 标准文字颜色
      secondary: '#5f6368', // 更柔和的次要文字颜色
    },
    grey: neutralColors,
    divider: 'rgba(0, 0, 0, 0.06)', // 更淡的分割线
    action: {
      hover: 'rgba(0, 0, 0, 0.04)', // 更淡的悬停效果
      selected: 'rgba(26, 115, 232, 0.08)', // 选中状态
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
    },
  },
  typography: {
    fontFamily: [
      'Google Sans',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    // Google Gemini 风格的标题系统
    h1: {
      fontSize: '2.25rem', // 36px
      fontWeight: 400, // Google 使用较轻的字重
      lineHeight: 1.25,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontSize: '1.875rem', // 30px
      fontWeight: 400,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.5rem', // 24px
      fontWeight: 400,
      lineHeight: 1.33,
      letterSpacing: '0',
    },
    h4: {
      fontSize: '1.25rem', // 20px
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.01em',
    },
    h5: {
      fontSize: '1.125rem', // 18px
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.01em',
    },
    h6: {
      fontSize: '1rem', // 16px
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    body1: {
      fontSize: '1rem', // 16px
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.875rem', // 14px
      fontWeight: 400,
      lineHeight: 1.43,
      letterSpacing: '0.01em',
    },
    caption: {
      fontSize: '0.75rem', // 12px
      fontWeight: 400,
      lineHeight: 1.33,
      letterSpacing: '0.03em',
    },
  },
  spacing: 8, // 基础间距单位保持8px
  shape: {
    borderRadius: 24, // Google Gemini 风格的大圆角
  },
  components: {
    // Google Gemini 风格的组件样式
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 20, // 更大的圆角
          padding: '10px 20px',
          fontWeight: 500,
          fontSize: '0.875rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          },
        },
        contained: {
          backgroundColor: '#1a73e8',
          '&:hover': {
            backgroundColor: '#1557b0',
            boxShadow: '0 2px 8px rgba(26,115,232,0.24)',
          },
        },
        outlined: {
          borderColor: 'rgba(0,0,0,0.12)',
          '&:hover': {
            borderColor: 'rgba(0,0,0,0.24)',
            backgroundColor: 'rgba(0,0,0,0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16, // 更大的圆角
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)', // 更淡的阴影
          border: '1px solid rgba(0,0,0,0.06)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 24, // 大圆角输入框
            '& fieldset': {
              borderColor: 'rgba(0,0,0,0.12)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0,0,0,0.24)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1a73e8',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontSize: '0.875rem',
          fontWeight: 400,
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
