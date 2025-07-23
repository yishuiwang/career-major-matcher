
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Layout from './components/layout/Layout';
import SearchPage from './pages/Search/SearchPage';
import ResultsPage from './pages/Results/ResultsPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ReportPage from './pages/Report/ReportPage';
import { theme } from './constants/theme';


// {{CHENGQI:
// Action: Modified
// Timestamp: [2025-01-19 16:45:00 +08:00]
// Reason: 重构App组件，集成路由系统、主题系统和布局组件
// Principle_Applied: SOLID (单一职责 - App只负责应用根级配置), DRY (复用Layout组件)
// Optimization: 使用React Router进行页面路由管理，Material-UI主题系统
// Architectural_Note (AR): 应用根组件，整合所有系统级配置
// Documentation_Note (DW): App组件已重构，集成完整的应用架构
// }}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/report/:reportId" element={<ReportPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/" element={<SearchPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
