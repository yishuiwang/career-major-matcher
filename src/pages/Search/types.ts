// {{CHENGQI:
// Action: Created
// Timestamp: [2025-01-21 15:15:00 +08:00]
// Reason: 创建SearchPage相关的TypeScript类型定义文件，确保类型安全和代码可维护性
// Principle_Applied: SOLID (接口隔离原则), DRY (统一的类型定义), KISS (简洁的类型系统)
// Optimization: 完整的类型定义，支持Google Gemini风格的搜索功能
// Architectural_Note (AR): 类型定义文件，为SearchPage组件系统提供类型安全保障
// Documentation_Note (DW): SearchPage类型定义文件已创建，包含所有必要的接口和类型
// }}

import type { ReactNode } from 'react';

// 匹配模式类型
export type MatchMode = 'comprehensive' | 'skill' | 'employment';

// 匹配模式配置接口
export interface MatchModeConfig {
  value: MatchMode;
  label: string;
  icon: ReactNode;
  description: string;
}

// 筛选选项类型
export interface FilterOptions {
  regions: string[];
  cities: string[];
  schoolLevels: string[];
}

// 筛选条件变更处理函数类型
export type FilterChangeHandler = (
  type: keyof FilterOptions,
  value: string,
  checked: boolean
) => void;

// 搜索结果接口 (匹配现有mockData结构)
export interface SearchResult {
  query: string;
  timestamp: Date;
  analysis: string; // AI分析内容
  topMajors: TopMajor[]; // 推荐专业列表
}

// 推荐专业接口 (匹配现有mockData结构)
export interface TopMajor {
  id: string;
  schoolName: string;
  majorName: string;
  matchScore: number;
  employmentRate: number;
  salaryLevel: number;
  reportUrl: string;
  description: string;
}

// SearchResults 组件属性接口
export interface SearchResultsProps {
  searchResults: SearchResult | null;
  streamingContent: string | null;
  isSearching: boolean;
}

// SearchBox 组件属性接口
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
  mode: 'center' | 'top';
  placeholder?: string;
  disabled?: boolean;
}

// FilterDialog 组件属性接口
export interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  filterOptions: FilterOptions;
  onFilterChange: FilterChangeHandler;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  getAppliedFiltersCount: () => number;
  isMobile: boolean;
}

// AIResponse 组件属性接口
export interface AIResponseProps {
  searchResults: SearchResult | null;
  isStreaming: boolean;
}

// 搜索历史项接口
export interface SearchHistoryItem {
  query: string;
  timestamp: Date;
  matchMode: MatchMode;
  filterOptions: FilterOptions;
}

// 页面状态类型
export type PageState = 'initial' | 'searching' | 'results';

// 错误状态接口
export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string;
}

// 加载状态接口
export interface LoadingState {
  isSearching: boolean;
  isLoadingMore: boolean;
  isRefreshing: boolean;
}

// 筛选选项常量
export const REGIONS = [
  '华北地区',
  '东北地区',
  '华东地区',
  '华中地区',
  '华南地区',
  '西南地区',
  '西北地区',
  '港澳台地区',
];

export const CITIES = [
  '北京',
  '上海',
  '广州',
  '深圳',
  '杭州',
  '南京',
  '武汉',
  '成都',
  '西安',
  '天津',
  '重庆',
  '苏州',
  '青岛',
  '大连',
  '宁波',
  '厦门',
  '无锡',
  '福州',
  '济南',
  '长沙',
];

export const SCHOOL_LEVELS = [
  '985工程',
  '211工程',
  '双一流',
  '省重点',
  '普通本科',
  '专科院校',
];