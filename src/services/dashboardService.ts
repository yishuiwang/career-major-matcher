// {{CHENGQI:
// Action: Added
// Timestamp: [2025-01-19 17:32:00 +08:00]
// Reason: 创建Dashboard API服务层，处理数据获取和缓存
// Principle_Applied: SOLID (单一职责 - 只负责Dashboard数据服务), DRY (复用API调用逻辑)
// Optimization: 实现数据缓存策略，提升性能
// Architectural_Note (AR): 服务层设计，分离数据获取逻辑和UI组件
// Documentation_Note (DW): Dashboard API服务已创建，包含缓存机制
// }}

// 定义数据类型
interface StatisticsResponse {
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

interface SankeyDataResponse {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

interface HeatMapPoint {
  lat: number;
  lng: number;
  value: number;
  region?: string;
}

interface HeatMapDataResponse {
  data: HeatMapPoint[];
  maxValue: number;
  minValue: number;
}



// 缓存配置
const cache = new Map<string, { data: any; timestamp: number }>();


// 获取统计数据
export async function getStatistics(): Promise<StatisticsResponse> {
  // 模拟数据（实际项目中会调用真实API）
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalUniversities: 2856,
        totalMajors: 15420,
        totalJobGroups: 1250,
        lastUpdateTime: new Date().toISOString(),
      });
    }, 800);
  });
}

// 获取桑基图数据
export async function getSankeyData(): Promise<SankeyDataResponse> {
  // 模拟数据（实际项目中会调用真实API）
  return new Promise((resolve) => {
    setTimeout(() => {
      const nodes = [
        // 大学节点
        { id: 'univ_1', name: '清华大学', category: 'university' as const },
        { id: 'univ_2', name: '北京大学', category: 'university' as const },
        { id: 'univ_3', name: '上海交通大学', category: 'university' as const },
        { id: 'univ_4', name: '浙江大学', category: 'university' as const },
        
        // 专业节点
        { id: 'major_1', name: '计算机科学与技术', category: 'major' as const },
        { id: 'major_2', name: '软件工程', category: 'major' as const },
        { id: 'major_3', name: '数据科学与大数据技术', category: 'major' as const },
        { id: 'major_4', name: '人工智能', category: 'major' as const },
        { id: 'major_5', name: '电子信息工程', category: 'major' as const },
        
        // 岗位群节点
        { id: 'job_1', name: '软件工程师', category: 'jobGroup' as const },
        { id: 'job_2', name: '数据分析师', category: 'jobGroup' as const },
        { id: 'job_3', name: 'AI工程师', category: 'jobGroup' as const },
        { id: 'job_4', name: '产品经理', category: 'jobGroup' as const },
      ];

      const links = [
        // 大学到专业的连接
        { source: 'univ_1', target: 'major_1', value: 300 },
        { source: 'univ_1', target: 'major_2', value: 250 },
        { source: 'univ_1', target: 'major_4', value: 200 },
        { source: 'univ_2', target: 'major_1', value: 280 },
        { source: 'univ_2', target: 'major_3', value: 220 },
        { source: 'univ_3', target: 'major_1', value: 260 },
        { source: 'univ_3', target: 'major_2', value: 240 },
        { source: 'univ_3', target: 'major_5', value: 180 },
        { source: 'univ_4', target: 'major_1', value: 270 },
        { source: 'univ_4', target: 'major_3', value: 200 },
        
        // 专业到岗位群的连接
        { source: 'major_1', target: 'job_1', value: 400 },
        { source: 'major_1', target: 'job_3', value: 300 },
        { source: 'major_1', target: 'job_4', value: 150 },
        { source: 'major_2', target: 'job_1', value: 350 },
        { source: 'major_2', target: 'job_4', value: 140 },
        { source: 'major_3', target: 'job_2', value: 300 },
        { source: 'major_3', target: 'job_3', value: 200 },
        { source: 'major_4', target: 'job_3', value: 180 },
        { source: 'major_5', target: 'job_1', value: 120 },
      ];

      resolve({ nodes, links });
    }, 1200);
  });
}

// 获取热力图数据
export async function getHeatMapData(): Promise<HeatMapDataResponse> {
  // 模拟数据（实际项目中会调用真实API）
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = [
        { lat: 39.9042, lng: 116.4074, value: 1200, region: '北京' },
        { lat: 31.2304, lng: 121.4737, value: 980, region: '上海' },
        { lat: 22.3193, lng: 114.1694, value: 850, region: '深圳' },
        { lat: 23.1291, lng: 113.2644, value: 720, region: '广州' },
        { lat: 30.2741, lng: 120.1551, value: 680, region: '杭州' },
        { lat: 32.0603, lng: 118.7969, value: 620, region: '南京' },
        { lat: 39.3434, lng: 117.3616, value: 580, region: '天津' },
        { lat: 22.5431, lng: 114.0579, value: 520, region: '东莞' },
        { lat: 30.5728, lng: 104.0668, value: 480, region: '成都' },
        { lat: 38.0428, lng: 114.5149, value: 450, region: '石家庄' },
        { lat: 36.6512, lng: 117.1201, value: 420, region: '济南' },
        { lat: 29.5647, lng: 106.5507, value: 400, region: '重庆' },
        { lat: 34.3416, lng: 108.9398, value: 380, region: '西安' },
        { lat: 41.8057, lng: 123.4315, value: 360, region: '沈阳' },
        { lat: 26.0745, lng: 119.2965, value: 340, region: '福州' },
        { lat: 36.0611, lng: 120.3785, value: 320, region: '青岛' },
        { lat: 45.7536, lng: 126.6480, value: 300, region: '哈尔滨' },
        { lat: 28.2282, lng: 112.9388, value: 280, region: '长沙' },
        { lat: 30.5872, lng: 114.2881, value: 260, region: '武汉' },
        { lat: 24.4797, lng: 118.0819, value: 240, region: '厦门' },
      ];

      resolve({
        data,
        maxValue: 1200,
        minValue: 240,
      });
    }, 1000);
  });
}

// 清除缓存
export function clearDashboardCache(): void {
  cache.clear();
}

// 获取缓存状态
export function getCacheInfo(): { size: number; keys: string[] } {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  };
}
