import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// 定义数据类型
interface University {
  id: string;
  name: string;
  location: {
    province: string;
    city: string;
    coordinates: [number, number];
  };
  tier: '985' | '211' | '双一流' | '普通';
  logo?: string;
  establishedYear?: number;
}

interface Skill {
  name: string;
  category: string;
  matchScore: number;
  importance: number;
}

interface EmploymentData {
  totalGraduates: number;
  employmentRate: number;
  relatedFieldRate: number;
  averageSalary?: number;
  topEmployers?: string[];
}

interface Major {
  id: string;
  name: string;
  code: string;
  category: string;
  degree: '本科' | '硕士' | '博士';
  university: University;
  description?: string;
  skillsMatch: number;
  employmentMatch: number;
  finalScore: number;
  skills: Skill[];
  employmentData: EmploymentData;
}

interface SearchFilters {
  location?: string[];
  universityTier?: ('985' | '211' | '双一流' | '普通')[];
  majorCategory?: string[];
  degreeLevel?: ('本科' | '硕士' | '博士')[];
  sortBy?: 'skillsMatch' | 'employmentMatch' | 'finalScore';
  sortOrder?: 'asc' | 'desc';
  minScore?: number;
}

interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface SearchParams {
  query: string;
  page?: number;
  pageSize?: number;
  location?: string;
  universityTier?: string;
  majorCategory?: string;
  degreeLevel?: string;
  sortBy?: string;
  sortOrder?: string;
  minScore?: number;
}

interface ResultsState {
  results: Major[];
  pagination: PaginationInfo | null;
  filters: SearchFilters;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  favorites: string[];
  comparison: string[];
  expandedCards: string[];
}
import { searchMajors, getFilterOptions, exportSearchResults } from '../services/searchService';

/**
 * 结果页面状态管理
 * 使用Zustand管理搜索结果、筛选、排序、收藏等状态
 */

interface ResultsStore extends ResultsState {
  // 搜索相关Actions
  searchMajors: (query: string, params?: Partial<SearchParams>) => Promise<void>;
  loadMore: () => Promise<void>;
  applyFilters: (filters: SearchFilters) => Promise<void>;
  clearResults: () => void;
  
  // 筛选和排序Actions
  updateFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  
  // 收藏和对比Actions
  toggleFavorite: (majorId: string) => void;
  addToComparison: (majorId: string) => void;
  removeFromComparison: (majorId: string) => void;
  clearComparison: () => void;
  
  // 卡片展开Actions
  toggleCardExpansion: (majorId: string) => void;
  expandAllCards: () => void;
  collapseAllCards: () => void;
  
  // 分页Actions
  changePage: (page: number) => Promise<void>;
  changePageSize: (pageSize: number) => Promise<void>;
  
  // 导出Actions
  exportResults: (format: 'pdf' | 'excel', selectedMajors?: string[]) => Promise<string>;
  
  // 错误处理
  clearError: () => void;
  
  // 筛选选项
  filterOptions: {
    locations: string[];
    categories: string[];
    tiers: string[];
  };
  loadFilterOptions: () => Promise<void>;
}

const initialFilters: SearchFilters = {
  sortBy: 'finalScore',
  sortOrder: 'desc',
};

const initialState: ResultsState = {
  results: [],
  pagination: null,
  filters: initialFilters,
  loading: false,
  error: null,
  searchQuery: '',
  favorites: [],
  comparison: [],
  expandedCards: [],
};

export const useResultsStore = create<ResultsStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      filterOptions: {
        locations: [],
        categories: [],
        tiers: [],
      },

      // 搜索专业
      searchMajors: async (query: string, params?: Partial<SearchParams>) => {
        set({ loading: true, error: null, searchQuery: query });

        try {
          const searchParams: SearchParams = {
            query,
            page: 1,
            pageSize: 20,
            ...get().filters,
            ...params,
          };

          const response = await searchMajors(searchParams);
          
          set({
            results: response.data,
            pagination: response.pagination,
            filters: { ...get().filters, ...response.filters },
            loading: false,
          });
        } catch (error) {
          console.error('Failed to search majors:', error);
          set({
            loading: false,
            error: error instanceof Error ? error.message : '搜索失败，请重试',
          });
        }
      },

      // 加载更多结果
      loadMore: async () => {
        const { pagination, searchQuery, filters, results } = get();
        if (!pagination || pagination.page >= pagination.totalPages) return;

        set({ loading: true });

        try {
          const searchParams: SearchParams = {
            query: searchQuery,
            page: pagination.page + 1,
            pageSize: pagination.pageSize,
            ...filters,
          };

          const response = await searchMajors(searchParams);
          
          set({
            results: [...results, ...response.data],
            pagination: response.pagination,
            loading: false,
          });
        } catch (error) {
          console.error('Failed to load more results:', error);
          set({
            loading: false,
            error: error instanceof Error ? error.message : '加载更多失败',
          });
        }
      },

      // 应用筛选
      applyFilters: async (filters: SearchFilters) => {
        const { searchQuery } = get();
        if (!searchQuery) return;

        set({ loading: true, error: null, filters });

        try {
          const searchParams: SearchParams = {
            query: searchQuery,
            page: 1,
            pageSize: 20,
            ...filters,
          };

          const response = await searchMajors(searchParams);
          
          set({
            results: response.data,
            pagination: response.pagination,
            loading: false,
          });
        } catch (error) {
          console.error('Failed to apply filters:', error);
          set({
            loading: false,
            error: error instanceof Error ? error.message : '筛选失败',
          });
        }
      },

      // 清除结果
      clearResults: () => {
        set({
          results: [],
          pagination: null,
          searchQuery: '',
          error: null,
        });
      },

      // 更新筛选条件
      updateFilters: (newFilters: Partial<SearchFilters>) => {
        set(state => ({
          filters: { ...state.filters, ...newFilters },
        }));
      },

      // 重置筛选条件
      resetFilters: () => {
        set({ filters: initialFilters });
      },

      // 切换收藏
      toggleFavorite: (majorId: string) => {
        set(state => ({
          favorites: state.favorites.includes(majorId)
            ? state.favorites.filter(id => id !== majorId)
            : [...state.favorites, majorId],
        }));
      },

      // 添加到对比
      addToComparison: (majorId: string) => {
        set(state => {
          if (state.comparison.includes(majorId)) return state;
          if (state.comparison.length >= 4) {
            // 最多对比4个专业
            return {
              comparison: [...state.comparison.slice(1), majorId],
            };
          }
          return {
            comparison: [...state.comparison, majorId],
          };
        });
      },

      // 从对比中移除
      removeFromComparison: (majorId: string) => {
        set(state => ({
          comparison: state.comparison.filter(id => id !== majorId),
        }));
      },

      // 清空对比
      clearComparison: () => {
        set({ comparison: [] });
      },

      // 切换卡片展开状态
      toggleCardExpansion: (majorId: string) => {
        set(state => ({
          expandedCards: state.expandedCards.includes(majorId)
            ? state.expandedCards.filter(id => id !== majorId)
            : [...state.expandedCards, majorId],
        }));
      },

      // 展开所有卡片
      expandAllCards: () => {
        set(state => ({
          expandedCards: state.results.map(major => major.id),
        }));
      },

      // 收起所有卡片
      collapseAllCards: () => {
        set({ expandedCards: [] });
      },

      // 切换页面
      changePage: async (page: number) => {
        const { searchQuery, filters } = get();
        if (!searchQuery) return;

        set({ loading: true });

        try {
          const searchParams: SearchParams = {
            query: searchQuery,
            page,
            pageSize: get().pagination?.pageSize || 20,
            ...filters,
          };

          const response = await searchMajors(searchParams);
          
          set({
            results: response.data,
            pagination: response.pagination,
            loading: false,
          });
        } catch (error) {
          console.error('Failed to change page:', error);
          set({
            loading: false,
            error: error instanceof Error ? error.message : '切换页面失败',
          });
        }
      },

      // 切换每页大小
      changePageSize: async (pageSize: number) => {
        const { searchQuery, filters } = get();
        if (!searchQuery) return;

        set({ loading: true });

        try {
          const searchParams: SearchParams = {
            query: searchQuery,
            page: 1,
            pageSize,
            ...filters,
          };

          const response = await searchMajors(searchParams);
          
          set({
            results: response.data,
            pagination: response.pagination,
            loading: false,
          });
        } catch (error) {
          console.error('Failed to change page size:', error);
          set({
            loading: false,
            error: error instanceof Error ? error.message : '更改页面大小失败',
          });
        }
      },

      // 导出结果
      exportResults: async (format: 'pdf' | 'excel', selectedMajors?: string[]) => {
        try {
          const response = await exportSearchResults({
            format,
            includeDetails: true,
            selectedMajors,
          });
          return response.downloadUrl;
        } catch (error) {
          console.error('Failed to export results:', error);
          throw error;
        }
      },

      // 清除错误
      clearError: () => {
        set({ error: null });
      },

      // 加载筛选选项
      loadFilterOptions: async () => {
        try {
          const options = await getFilterOptions();
          set({ filterOptions: options });
        } catch (error) {
          console.error('Failed to load filter options:', error);
        }
      },
    }),
    {
      name: 'results-store',
      partialize: (state) => ({
        favorites: state.favorites,
        comparison: state.comparison,
        filters: state.filters,
      }),
    }
  )
);

// 选择器函数
export const selectResults = (state: ResultsStore) => state.results;
export const selectPagination = (state: ResultsStore) => state.pagination;
export const selectFilters = (state: ResultsStore) => state.filters;
export const selectLoading = (state: ResultsStore) => state.loading;
export const selectError = (state: ResultsStore) => state.error;
export const selectFavorites = (state: ResultsStore) => state.favorites;
export const selectComparison = (state: ResultsStore) => state.comparison;
export const selectExpandedCards = (state: ResultsStore) => state.expandedCards;

// 计算属性选择器
export const selectHasResults = (state: ResultsStore) => state.results.length > 0;
export const selectCanLoadMore = (state: ResultsStore) => 
  state.pagination ? state.pagination.page < state.pagination.totalPages : false;
export const selectComparisonCount = (state: ResultsStore) => state.comparison.length;
