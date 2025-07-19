import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  getReport,
  generateReport,
  exportReport,
  checkReportStatus,
} from '../services/reportService';

/**
 * 报告页面状态管理
 * 使用Zustand管理报告内容、生成状态、导出等功能
 */

// 定义数据类型
interface ReportMetadata {
  reportId: string;
  jobGroupName: string;
  majorCount: number;
  reportType: 'basic' | 'detailed' | 'comprehensive';
  fileSize?: number;
  createdAt: string;
  updatedAt?: string;
}

interface ReportContent {
  content: string;
  createdAt: string;
  metadata: ReportMetadata;
}

interface TOCItem {
  id: string;
  title: string;
  level: number;
  anchor: string;
  children?: TOCItem[];
}

interface TableOfContents {
  items: TOCItem[];
  totalSections: number;
}

interface SearchResult {
  sectionId: string;
  sectionTitle: string;
  matches: SearchMatch[];
  totalMatches: number;
}

interface SearchMatch {
  text: string;
  context: string;
  position: number;
  length: number;
}

interface GenerateReportRequest {
  jobGroupId: string;
  selectedMajors: string[];
  reportType?: 'basic' | 'detailed' | 'comprehensive';
  includeCharts?: boolean;
  customSections?: string[];
}

interface ExportOptions {
  format: 'pdf' | 'word' | 'html';
  includeImages: boolean;
  pageSize?: 'A4' | 'Letter';
  orientation?: 'portrait' | 'landscape';
}

interface ReportState {
  report: ReportContent | null;
  toc: TableOfContents | null;
  loading: boolean;
  generating: boolean;
  error: string | null;
  searchResults: SearchResult[];
  activeSection: string | null;
  searchTerm: string;
  exportLoading: boolean;
}

interface ReportStore extends ReportState {
  // 报告获取Actions
  loadReport: (reportId: string) => Promise<void>;
  generateNewReport: (request: GenerateReportRequest) => Promise<string>;
  checkGenerationStatus: (reportId: string) => Promise<void>;
  
  // 目录和导航Actions
  setTOC: (toc: TableOfContents) => void;
  setActiveSection: (section: string | null) => void;
  navigateToSection: (anchor: string) => void;
  
  // 搜索Actions
  searchInReport: (term: string) => void;
  clearSearch: () => void;
  
  // 导出Actions
  exportReport: (reportId: string, options: ExportOptions) => Promise<string>;
  
  // 错误处理
  clearError: () => void;
  
  // 重置状态
  reset: () => void;
}

const initialState: ReportState = {
  report: null,
  toc: null,
  loading: false,
  generating: false,
  error: null,
  searchResults: [],
  activeSection: null,
  searchTerm: '',
  exportLoading: false,
};

export const useReportStore = create<ReportStore>((set, get) => ({
      ...initialState,

      // 加载报告
      loadReport: async (reportId: string) => {
        set({ loading: true, error: null });

        try {
          const report = await getReport(reportId);
          set({
            report,
            loading: false,
          });
        } catch (error) {
          console.error('Failed to load report:', error);
          set({
            loading: false,
            error: error instanceof Error ? error.message : '加载报告失败',
          });
        }
      },

      // 生成新报告
      generateNewReport: async (request: GenerateReportRequest) => {
        set({ generating: true, error: null });

        try {
          const response = await generateReport(request);
          
          // 如果报告立即完成，直接加载
          if (response.status === 'completed') {
            await get().loadReport(response.reportId);
          }
          
          set({ generating: false });
          return response.reportId;
        } catch (error) {
          console.error('Failed to generate report:', error);
          set({
            generating: false,
            error: error instanceof Error ? error.message : '生成报告失败',
          });
          throw error;
        }
      },

      // 检查生成状态
      checkGenerationStatus: async (reportId: string) => {
        try {
          const status = await checkReportStatus(reportId);
          
          if (status.status === 'completed') {
            await get().loadReport(reportId);
            set({ generating: false });
          } else if (status.status === 'failed') {
            set({
              generating: false,
              error: '报告生成失败，请重试',
            });
          }
          // 如果还在生成中，保持generating状态
        } catch (error) {
          console.error('Failed to check report status:', error);
          set({
            generating: false,
            error: error instanceof Error ? error.message : '检查报告状态失败',
          });
        }
      },

      // 设置目录
      setTOC: (toc: TableOfContents) => {
        set({ toc });
      },

      // 设置当前活动章节
      setActiveSection: (section: string | null) => {
        set({ activeSection: section });
      },

      // 导航到指定章节
      navigateToSection: (anchor: string) => {
        set({ activeSection: anchor });
        
        // 滚动到目标元素
        const element = document.getElementById(anchor);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      },

      // 在报告中搜索
      searchInReport: (term: string) => {
        const { report } = get();
        if (!report || !term.trim()) {
          set({ searchResults: [], searchTerm: '' });
          return;
        }

        const searchTerm = term.trim().toLowerCase();
        const content = report.content;
        const results: SearchResult[] = [];

        // 简单的搜索实现
        const lines = content.split('\n');
        let currentSection = '';
        let sectionId = '';

        lines.forEach((line, index) => {
          // 检测标题行
          const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
          if (headingMatch) {
            currentSection = headingMatch[2];
            sectionId = currentSection
              .toLowerCase()
              .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
              .replace(/\s+/g, '-');
          }

          // 搜索匹配
          const lowerLine = line.toLowerCase();
          const matchIndex = lowerLine.indexOf(searchTerm);
          
          if (matchIndex !== -1 && currentSection) {
            const existingResult = results.find(r => r.sectionId === sectionId);
            
            const match: SearchMatch = {
              text: term,
              context: line.trim(),
              position: matchIndex,
              length: term.length,
            };

            if (existingResult) {
              existingResult.matches.push(match);
              existingResult.totalMatches++;
            } else {
              results.push({
                sectionId,
                sectionTitle: currentSection,
                matches: [match],
                totalMatches: 1,
              });
            }
          }
        });

        set({
          searchResults: results,
          searchTerm: term,
        });
      },

      // 清除搜索
      clearSearch: () => {
        set({
          searchResults: [],
          searchTerm: '',
        });
      },

      // 导出报告
      exportReport: async (reportId: string, options: ExportOptions) => {
        set({ exportLoading: true });

        try {
          const response = await exportReport(reportId, options);
          set({ exportLoading: false });
          
          // 触发下载
          const link = document.createElement('a');
          link.href = response.downloadUrl;
          link.download = response.filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          return response.downloadUrl;
        } catch (error) {
          console.error('Failed to export report:', error);
          set({
            exportLoading: false,
            error: error instanceof Error ? error.message : '导出报告失败',
          });
          throw error;
        }
      },

      // 清除错误
      clearError: () => {
        set({ error: null });
      },

      // 重置状态
      reset: () => {
        set(initialState);
      },
    }));

// 选择器函数
export const selectReport = (state: ReportStore) => state.report;
export const selectTOC = (state: ReportStore) => state.toc;
export const selectLoading = (state: ReportStore) => state.loading;
export const selectGenerating = (state: ReportStore) => state.generating;
export const selectError = (state: ReportStore) => state.error;
export const selectSearchResults = (state: ReportStore) => state.searchResults;
export const selectActiveSection = (state: ReportStore) => state.activeSection;
export const selectSearchTerm = (state: ReportStore) => state.searchTerm;
export const selectExportLoading = (state: ReportStore) => state.exportLoading;

// 计算属性选择器
export const selectHasReport = (state: ReportStore) => state.report !== null;
export const selectHasSearchResults = (state: ReportStore) => state.searchResults.length > 0;
export const selectTotalSearchMatches = (state: ReportStore) =>
  state.searchResults.reduce((total, result) => total + result.totalMatches, 0);
