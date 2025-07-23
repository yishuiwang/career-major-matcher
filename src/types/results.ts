/**
 * 匹配结果相关的TypeScript类型定义
 * 基于OpenAPI规范，确保前后端一致性
 */

// 基础数据类型
export interface University {
  id: string;
  name: string;
  location: Location;
  tier: '985' | '211' | '双一流' | '普通';
  logo?: string;
  establishedYear?: number;
}

export interface Location {
  province: string;
  city: string;
  coordinates: [number, number]; // [经度, 纬度]
}

export interface Skill {
  name: string;
  category: string;
  matchScore: number; // 0-100
  importance: number; // 0-100
}

export interface EmploymentData {
  totalGraduates: number;
  employmentRate: number; // 百分比
  relatedFieldRate: number; // 百分比
  averageSalary?: number;
  topEmployers?: string[];
  geographicDistribution?: GeographicData[];
}

export interface GeographicData {
  region: string;
  count: number;
  percentage: number;
}

export interface Major {
  id: string;
  name: string;
  code: string;
  category: string;
  degree: '本科' | '硕士' | '博士';
  university: University;
  description?: string;
  skillsMatch: number; // 0-100
  employmentMatch: number; // 0-100
  finalScore: number; // 0-100
  skills: Skill[];
  employmentData: EmploymentData;
}

// 搜索和筛选相关类型
export interface SearchFilters {
  location?: string | string[];
  universityTier?: string | ('985' | '211' | '双一流' | '普通')[];
  majorCategory?: string | string[];
  degreeLevel?: string | ('本科' | '硕士' | '博士')[];
  sortBy?: 'skillsMatch' | 'employmentMatch' | 'finalScore' | string;
  sortOrder?: 'asc' | 'desc' | string;
  minScore?: number;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface SearchResponse {
  data: Major[];
  pagination: PaginationInfo;
  filters: SearchFilters;
  searchTime: number; // 毫秒
}

// 组件Props类型
export interface MatchResultCardProps {
  major: Major;
  onViewDetails: (majorId: string) => void;
  onToggleFavorite?: (majorId: string) => void;
  onAddToCompare?: (majorId: string) => void;
  isFavorited?: boolean;
  isInComparison?: boolean;
  expanded?: boolean;
  onToggleExpand?: (majorId: string) => void;
}

export interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  availableOptions: {
    locations: string[];
    categories: string[];
    tiers: string[];
  };
  loading?: boolean;
}

export interface SortControlsProps {
  sortBy: SearchFilters['sortBy'];
  sortOrder: SearchFilters['sortOrder'];
  onSortChange: (sortBy: SearchFilters['sortBy'], sortOrder: SearchFilters['sortOrder']) => void;
}

export interface PaginationControlsProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

// 结果页面状态类型
export interface ResultsState {
  results: Major[];
  pagination: PaginationInfo | null;
  filters: SearchFilters;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  favorites: string[]; // 收藏的专业ID列表
  comparison: string[]; // 对比的专业ID列表
  expandedCards: string[]; // 展开的卡片ID列表
}

// API请求参数类型
export interface SearchParams {
  query: string;
  page?: number;
  pageSize?: number;
  location?: string | string[];
  universityTier?: string | string[];
  majorCategory?: string | string[];
  degreeLevel?: string | string[];
  sortBy?: 'skillsMatch' | 'employmentMatch' | 'finalScore' | string;
  sortOrder?: 'asc' | 'desc' | string;
  minScore?: number;
}

// 导出功能类型
export interface ExportOptions {
  format: 'pdf' | 'excel';
  includeDetails: boolean;
  selectedMajors?: string[];
}

export interface ExportResponse {
  downloadUrl: string;
  filename: string;
  expiresAt: string;
}
