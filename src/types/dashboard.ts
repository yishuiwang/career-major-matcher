/**
 * Dashboard相关的TypeScript类型定义
 * 基于OpenAPI规范，确保前后端一致性
 */

// 基础统计数据
export interface StatisticsData {
  totalUniversities: number;
  totalMajors: number;
  totalJobGroups: number;
  lastUpdateTime: string;
}

// 桑基图数据结构
export interface SankeyNode {
  id: string;
  name: string;
  category: 'university' | 'major' | 'jobGroup';
  value?: number;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

// 热力图数据结构
export interface HeatMapPoint {
  lat: number;
  lng: number;
  value: number;
  region?: string;
}

export interface HeatMapData {
  data: HeatMapPoint[];
  maxValue: number;
  minValue: number;
}

// API响应类型
export interface StatisticsResponse {
  totalUniversities: number;
  totalMajors: number;
  totalJobGroups: number;
  lastUpdateTime: string;
}

export interface SankeyDataResponse {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

export interface HeatMapDataResponse {
  data: HeatMapPoint[];
  maxValue: number;
  minValue: number;
}

// 组件Props类型
export interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  loading?: boolean;
}

export interface SankeyChartProps {
  data: SankeyData;
  width?: number;
  height?: number;
  loading?: boolean;
  onNodeClick?: (node: SankeyNode) => void;
}

export interface HeatMapProps {
  data: HeatMapData;
  height?: number;
  loading?: boolean;
  title?: string;
}

// Dashboard状态类型
export interface DashboardState {
  statistics: StatisticsData | null;
  sankeyData: SankeyData | null;
  heatMapData: HeatMapData | null;
  loading: {
    statistics: boolean;
    sankey: boolean;
    heatMap: boolean;
  };
  error: {
    statistics: string | null;
    sankey: string | null;
    heatMap: string | null;
  };
}

// 筛选参数类型
export interface DashboardFilters {
  majorCategory?: string;
  year?: number;
  region?: string;
}
