/**
 * 分析报告相关的TypeScript类型定义
 * 基于OpenAPI规范，确保前后端一致性
 */

// 报告基础类型
export interface ReportMetadata {
  reportId: string;
  jobGroupName: string;
  majorCount: number;
  reportType: 'basic' | 'detailed' | 'comprehensive';
  fileSize?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ReportContent {
  content: string; // Markdown格式的报告内容
  createdAt: string;
  metadata: ReportMetadata;
}

// 报告生成请求类型
export interface GenerateReportRequest {
  jobGroupId: string;
  selectedMajors: string[];
  reportType?: 'basic' | 'detailed' | 'comprehensive';
  includeCharts?: boolean;
  customSections?: string[];
}

export interface GenerateReportResponse {
  reportId: string;
  status: 'generating' | 'completed' | 'failed';
  estimatedTime?: number; // 预计完成时间（秒）
  progress?: number; // 生成进度 0-100
}

// 报告目录结构
export interface TOCItem {
  id: string;
  title: string;
  level: number; // 1-6 对应 h1-h6
  anchor: string; // 锚点链接
  children?: TOCItem[];
}

export interface TableOfContents {
  items: TOCItem[];
  totalSections: number;
}

// 报告导出选项
export interface ExportOptions {
  format: 'pdf' | 'word' | 'html';
  includeImages: boolean;
  pageSize?: 'A4' | 'Letter';
  orientation?: 'portrait' | 'landscape';
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface ExportResponse {
  downloadUrl: string;
  filename: string;
  expiresAt: string;
  fileSize: number;
}

// 报告搜索和高亮
export interface SearchResult {
  sectionId: string;
  sectionTitle: string;
  matches: SearchMatch[];
  totalMatches: number;
}

export interface SearchMatch {
  text: string;
  context: string;
  position: number;
  length: number;
}

// 组件Props类型
export interface MarkdownRendererProps {
  content: string;
  onTOCGenerated?: (toc: TableOfContents) => void;
  searchTerm?: string;
  highlightMatches?: boolean;
  className?: string;
}

export interface ReportTOCProps {
  toc: TableOfContents;
  activeSection?: string;
  onSectionClick: (anchor: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export interface ExportControlsProps {
  reportId: string;
  onExport: (options: ExportOptions) => Promise<void>;
  loading?: boolean;
  disabled?: boolean;
}

export interface ReportSearchProps {
  content: string;
  onSearch: (results: SearchResult[]) => void;
  onHighlight: (term: string) => void;
  placeholder?: string;
}

export interface ReportHeaderProps {
  metadata: ReportMetadata;
  onExport?: (format: ExportOptions['format']) => void;
  onPrint?: () => void;
  onShare?: () => void;
  loading?: boolean;
}

// 报告页面状态类型
export interface ReportState {
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

// API响应类型
export interface ReportResponse {
  content: string;
  createdAt: string;
  metadata: ReportMetadata;
}

export interface ReportListItem {
  reportId: string;
  title: string;
  jobGroupName: string;
  reportType: string;
  createdAt: string;
  status: 'completed' | 'generating' | 'failed';
  fileSize?: number;
}

export interface ReportListResponse {
  reports: ReportListItem[];
  total: number;
  page: number;
  pageSize: number;
}

// 报告模板类型
export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: ReportSection[];
  defaultOptions: Partial<GenerateReportRequest>;
}

export interface ReportSection {
  id: string;
  title: string;
  description: string;
  required: boolean;
  order: number;
  template: string; // Markdown模板
}

// 报告分享类型
export interface ShareOptions {
  type: 'link' | 'email' | 'download';
  permissions: 'view' | 'edit';
  expiresAt?: string;
  password?: string;
}

export interface ShareResponse {
  shareUrl: string;
  shareId: string;
  expiresAt: string;
  permissions: string;
}
