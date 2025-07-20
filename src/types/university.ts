/**
 * 大学相关的TypeScript类型定义
 * 用于大学列表展示和筛选功能
 */

// {{CHENGQI:
// Action: Added
// Timestamp: [2025-01-19 19:30:00 +08:00]
// Reason: 创建大学相关类型定义，支持大学列表功能
// Principle_Applied: SOLID (单一职责 - 只负责大学数据类型), DRY (避免重复定义)
// Optimization: 完整的类型定义，支持筛选和搜索功能
// Architectural_Note (AR): 大学数据类型定义，确保类型安全
// Documentation_Note (DW): 大学类型定义已创建
// }}

// 办学层次类型
export type UniversityLevel = 
  | '985'
  | '211'
  | '双一流'
  | '省重点'
  | '普通本科'
  | '专科';

// 大学类型
export type UniversityType =
  | '综合类'
  | '理工类'
  | '师范类'
  | '农林类'
  | '医药类'
  | '财经类'
  | '政法类'
  | '语言类'
  | '艺术类'
  | '体育类'
  | '军事类'
  | '民族类';

// 大学基础信息
export interface University {
  id: string;
  name: string;
  englishName?: string;
  province: string;
  city: string;
  level: UniversityLevel[];
  type: UniversityType;
  establishedYear?: number;
  website?: string;
  description?: string;
  logoUrl?: string;
  ranking?: {
    national?: number;
    qs?: number;
    times?: number;
  };
  statistics?: {
    totalMajors: number;
    totalStudents: number;
    totalFaculty: number;
    campusArea?: number; // 校园面积（亩）
  };
}

// 大学列表查询参数
export interface UniversityQueryParams {
  page: number;
  pageSize: number;
  search?: string;
  province?: string;
  level?: UniversityLevel;
  type?: UniversityType;
  sortBy?: 'name' | 'establishedYear' | 'ranking';
  sortOrder?: 'asc' | 'desc';
}

// 大学列表响应
export interface UniversityListResponse {
  universities: University[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 省份列表
export const PROVINCES = [
  '北京市', '天津市', '河北省', '山西省', '内蒙古自治区',
  '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省',
  '浙江省', '安徽省', '福建省', '江西省', '山东省',
  '河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区',
  '海南省', '重庆市', '四川省', '贵州省', '云南省',
  '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区',
  '新疆维吾尔自治区', '香港特别行政区', '澳门特别行政区', '台湾省'
];

// 大学筛选器状态
export interface UniversityFilters {
  search: string;
  province: string;
  level: string;
  type: string;
}

// 大学列表模态框Props
export interface UniversityListModalProps {
  open: boolean;
  onClose: () => void;
  initialFilters?: Partial<UniversityFilters>;
}

// 大学表格Props
export interface UniversityTableProps {
  universities: University[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

// 大学筛选面板Props
export interface UniversityFilterPanelProps {
  filters: UniversityFilters;
  onFiltersChange: (filters: UniversityFilters) => void;
  onReset: () => void;
  loading?: boolean;
}

// 大学详情Props
export interface UniversityDetailProps {
  university: University;
  onClose: () => void;
}

// 大学统计信息
export interface UniversityStatistics {
  totalUniversities: number;
  by985: number;
  by211: number;
  byDoubleFirstClass: number;
  byProvince: Record<string, number>;
  byType: Record<string, number>;
  byLevel: Record<string, number>;
}
