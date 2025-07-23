import { create } from 'zustand';
// 定义数据类型
interface StatisticsData {
  totalUniversities: number;
  totalMajors: number;
  totalJobGroups: number;
  lastUpdateTime: string;
}

interface SankeyNode {
  id: string;
  name: string;
  category: 'university' | 'major' | 'jobGroup';
  value?: number;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

interface HeatMapPoint {
  lat: number;
  lng: number;
  value: number;
  region?: string;
}

interface HeatMapData {
  data: HeatMapPoint[];
  maxValue: number;
  minValue: number;
}

interface DashboardState {
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

interface DashboardFilters {
  majorCategory?: string;
  year?: number;
  region?: string;
}
import {
  getStatistics,
  getSankeyData,
  getHeatMapData,
} from '../services/dashboardService';

// {{CHENGQI:
// Action: Added
// Timestamp: [2025-01-19 17:45:00 +08:00]
// Reason: 创建Dashboard状态管理，使用Zustand管理Dashboard数据和状态
// Principle_Applied: SOLID (单一职责 - 只负责Dashboard状态管理), DRY (复用状态逻辑)
// Optimization: 集中管理Dashboard状态，支持异步数据加载和错误处理
// Architectural_Note (AR): 使用Zustand轻量级状态管理，支持TypeScript类型安全
// Documentation_Note (DW): Dashboard状态管理已创建，包含数据加载和错误处理逻辑
// }}

interface DashboardStore extends DashboardState {
  // Actions
  loadStatistics: () => Promise<void>;
  loadSankeyData: (limit?: number) => Promise<void>;
  loadHeatMapData: (filters?: DashboardFilters) => Promise<void>;
  loadAllData: (filters?: DashboardFilters) => Promise<void>;
  clearError: (type: keyof DashboardState['error']) => void;
  reset: () => void;
}

const initialState: DashboardState = {
  statistics: null,
  sankeyData: null,
  heatMapData: null,
  loading: {
    statistics: false,
    sankey: false,
    heatMap: false,
  },
  error: {
    statistics: null,
    sankey: null,
    heatMap: null,
  },
};

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  ...initialState,

  // 加载统计数据
  loadStatistics: async () => {
    set(state => ({
      loading: { ...state.loading, statistics: true },
      error: { ...state.error, statistics: null },
    }));

    try {
      const statistics = await getStatistics();
      set(state => ({
        statistics,
        loading: { ...state.loading, statistics: false },
      }));
    } catch (error) {
      console.error('Failed to load statistics:', error);
      set(state => ({
        loading: { ...state.loading, statistics: false },
        error: {
          ...state.error,
          statistics: error instanceof Error ? error.message : '加载统计数据失败',
        },
      }));
    }
  },

  // 加载桑基图数据
  loadSankeyData: async () => {
    set(state => ({
      loading: { ...state.loading, sankey: true },
      error: { ...state.error, sankey: null },
    }));

    try {
      const sankeyData = await getSankeyData();
      set(state => ({
        sankeyData,
        loading: { ...state.loading, sankey: false },
      }));
    } catch (error) {
      console.error('Failed to load sankey data:', error);
      set(state => ({
        loading: { ...state.loading, sankey: false },
        error: {
          ...state.error,
          sankey: error instanceof Error ? error.message : '加载桑基图数据失败',
        },
      }));
    }
  },

  // 加载热力图数据
  loadHeatMapData: async (_filters?: DashboardFilters) => {
    set(state => ({
      loading: { ...state.loading, heatMap: true },
      error: { ...state.error, heatMap: null },
    }));

    try {
      const heatMapData = await getHeatMapData();
      set(state => ({
        heatMapData,
        loading: { ...state.loading, heatMap: false },
      }));
    } catch (error) {
      console.error('Failed to load heatmap data:', error);
      set(state => ({
        loading: { ...state.loading, heatMap: false },
        error: {
          ...state.error,
          heatMap: error instanceof Error ? error.message : '加载热力图数据失败',
        },
      }));
    }
  },

  // 加载所有数据
  loadAllData: async (filters?: DashboardFilters) => {
    const { loadStatistics, loadSankeyData, loadHeatMapData } = get();
    
    // 并行加载所有数据
    await Promise.allSettled([
      loadStatistics(),
      loadSankeyData(),
      loadHeatMapData(filters),
    ]);
  },

  // 清除错误
  clearError: (type: keyof DashboardState['error']) => {
    set(state => ({
      error: { ...state.error, [type]: null },
    }));
  },

  // 重置状态
  reset: () => {
    set(initialState);
  },
}));

// 选择器函数，用于获取特定的状态片段
export const selectStatistics = (state: DashboardStore) => state.statistics;
export const selectSankeyData = (state: DashboardStore) => state.sankeyData;
export const selectHeatMapData = (state: DashboardStore) => state.heatMapData;
export const selectLoading = (state: DashboardStore) => state.loading;
export const selectError = (state: DashboardStore) => state.error;

// 计算属性选择器
export const selectIsAnyLoading = (state: DashboardStore) =>
  Object.values(state.loading).some(loading => loading);

export const selectHasAnyError = (state: DashboardStore) =>
  Object.values(state.error).some(error => error !== null);

export const selectIsDataReady = (state: DashboardStore) =>
  state.statistics !== null &&
  state.sankeyData !== null &&
  state.heatMapData !== null &&
  !selectIsAnyLoading(state);
