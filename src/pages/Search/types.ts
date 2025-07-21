// {{CHENGQI:
// Action: Created
// Timestamp: [2025-01-20 16:00:00 +08:00]
// Reason: 创建类型定义文件，为SearchPage组件模块化重构提供统一的类型接口
// Principle_Applied: SOLID (接口隔离原则), DRY (统一类型定义)
// Optimization: 集中管理所有类型定义，提高代码可维护性和类型安全
// Architectural_Note (AR): 采用类型优先的架构设计，确保组件间接口清晰
// Documentation_Note (DW): SearchPage模块化重构的类型定义文件
// }}

// 匹配模式类型
export type MatchMode = 'comprehensive' | 'skill' | 'employment';

// 筛选条件类型
export interface FilterOptions {
  regions: string[];
  cities: string[];
  schoolLevels: string[];
}

// 专业匹配结果类型
export interface MajorMatch {
  id: string;
  schoolName: string;
  majorName: string;
  matchScore: number;
  employmentRate: number;
  salaryLevel: number;
  reportUrl: string;
  description: string;
}

// 搜索结果类型
export interface SearchResult {
  query: string;
  analysis: string; // markdown格式的分析内容
  topMajors: MajorMatch[];
  timestamp: Date;
}

// 匹配模式配置类型
export interface MatchModeConfig {
  value: MatchMode;
  label: string;
  icon: React.ReactElement;
  description: string;
}

// SearchBox组件Props
export interface SearchBoxProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearch: (query: string) => void;
  onClear: () => void;
  matchMode: MatchMode;
  onMatchModeChange: (mode: MatchMode) => void;
  filterOptions: FilterOptions;
  onFilterDialogOpen: () => void;
  getAppliedFiltersCount: () => number;
  mode: 'center' | 'top'; // 居中模式或顶部模式
  placeholder?: string;
  disabled?: boolean;
}

// SearchResults组件Props
export interface SearchResultsProps {
  searchResults: SearchResult | null;
  streamingContent: string;
  isSearching: boolean;
}

// MajorCard组件Props
export interface MajorCardProps {
  major: MajorMatch;
  onClick?: (major: MajorMatch) => void;
}

// FilterDialog组件Props
export interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  filterOptions: FilterOptions;
  onFilterChange: (type: keyof FilterOptions, value: string, checked: boolean) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  getAppliedFiltersCount: () => number;
  isMobile: boolean;
}

// StreamingText组件Props
export interface StreamingTextProps {
  content: string;
  speed?: number; // 每个字符的显示间隔（毫秒）
  onComplete?: () => void;
  className?: string;
}

// D3Chart组件Props（为后续D3.js图表准备）
export interface D3ChartProps {
  data: MajorMatch[];
  width?: number;
  height?: number;
  onBarClick?: (major: MajorMatch) => void;
}

// MessageBubble组件Props
export interface MessageBubbleProps {
  type: 'user' | 'ai';
  content: string | React.ReactNode;
  timestamp?: Date;
  isStreaming?: boolean;
}

// AIResponse组件Props
export interface AIResponseProps {
  searchResults: SearchResult | null;
  isStreaming?: boolean;
}

// 常量定义
export const REGIONS = ['华北', '华东', '华南', '华中', '西北', '西南', '东北'];
export const CITIES = ['北京', '上海', '广州', '深圳', '杭州', '南京', '成都', '武汉', '西安', '天津'];
export const SCHOOL_LEVELS = ['985工程', '211工程', '双一流', '省重点', '普通本科'];

// 事件处理器类型
export type SearchHandler = (query: string) => void;
export type MatchModeChangeHandler = (mode: MatchMode) => void;
export type FilterChangeHandler = (type: keyof FilterOptions, value: string, checked: boolean) => void;
