/**
 * 搜索结果API服务
 * 处理专业匹配搜索、筛选、排序等功能
 */

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
  location?: string | string[];
  universityTier?: string | ('985' | '211' | '双一流' | '普通')[];
  majorCategory?: string | string[];
  degreeLevel?: string | ('本科' | '硕士' | '博士')[];
  sortBy?: 'skillsMatch' | 'employmentMatch' | 'finalScore' | string;
  sortOrder?: 'asc' | 'desc' | string;
  minScore?: number;
}

interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface SearchResponse {
  data: Major[];
  pagination: PaginationInfo;
  filters: SearchFilters;
  searchTime: number;
}

interface SearchParams {
  query: string;
  page?: number;
  pageSize?: number;
  location?: string | string[];
  universityTier?: string | string[];
  majorCategory?: string | string[];
  degreeLevel?: string | string[];
  sortBy?: string;
  sortOrder?: string;
  minScore?: number;
}

interface ExportOptions {
  format: 'pdf' | 'excel';
  includeDetails: boolean;
  selectedMajors?: string[];
}

interface ExportResponse {
  downloadUrl: string;
  filename: string;
  expiresAt: string;
}

const cache = new Map<string, { data: any; timestamp: number }>();



// 搜索专业
export async function searchMajors(params: SearchParams): Promise<SearchResponse> {
  // 模拟数据（实际项目中会调用真实API）
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData = generateMockSearchResults(params);
      resolve(mockData);
    }, 800 + Math.random() * 400); // 模拟网络延迟
  });
}

// 生成模拟搜索结果
function generateMockSearchResults(params: SearchParams): SearchResponse {
  const {  page = 1, pageSize = 20, sortBy = 'finalScore', sortOrder = 'desc' } = params;
  
  // 模拟大学数据
  const universities = [
    { id: 'univ_001', name: '清华大学', tier: '985' as const, location: { province: '北京', city: '北京', coordinates: [116.3974, 39.9093] as [number, number] } },
    { id: 'univ_002', name: '北京大学', tier: '985' as const, location: { province: '北京', city: '北京', coordinates: [116.3105, 39.9927] as [number, number] } },
    { id: 'univ_003', name: '上海交通大学', tier: '985' as const, location: { province: '上海', city: '上海', coordinates: [121.4737, 31.2304] as [number, number] } },
    { id: 'univ_004', name: '浙江大学', tier: '985' as const, location: { province: '浙江', city: '杭州', coordinates: [120.1551, 30.2741] as [number, number] } },
    { id: 'univ_005', name: '华中科技大学', tier: '985' as const, location: { province: '湖北', city: '武汉', coordinates: [114.2881, 30.5872] as [number, number] } },
    { id: 'univ_006', name: '北京理工大学', tier: '985' as const, location: { province: '北京', city: '北京', coordinates: [116.3447, 39.9634] as [number, number] } },
    { id: 'univ_007', name: '华东师范大学', tier: '985' as const, location: { province: '上海', city: '上海', coordinates: [121.3997, 31.2303] as [number, number] } },
    { id: 'univ_008', name: '北京邮电大学', tier: '211' as const, location: { province: '北京', city: '北京', coordinates: [116.3598, 39.9629] as [number, number] } },
  ];

  // 模拟专业数据
  const majors = [
    {
      id: 'major_001',
      name: '计算机科学与技术',
      code: '080901',
      category: '工学',
      degree: '本科' as const,
      description: '培养具有良好的科学素养，系统地掌握计算机科学与技术的基本理论、基本知识和基本技能的高级专门人才。',
      skillsMatch: 92.5,
      employmentMatch: 89.3,
      finalScore: 90.9,
    },
    {
      id: 'major_002',
      name: '软件工程',
      code: '080902',
      category: '工学',
      degree: '本科' as const,
      description: '培养适应计算机应用学科的发展，特别是软件产业的发展，具备计算机软件的基础理论、基本知识和基本技能。',
      skillsMatch: 94.2,
      employmentMatch: 91.7,
      finalScore: 92.9,
    },
    {
      id: 'major_003',
      name: '数据科学与大数据技术',
      code: '080910T',
      category: '工学',
      degree: '本科' as const,
      description: '培养具有大数据思维、运用大数据思维及分析应用技术的高层次大数据人才。',
      skillsMatch: 88.7,
      employmentMatch: 85.4,
      finalScore: 87.1,
    },
    {
      id: 'major_004',
      name: '人工智能',
      code: '080717T',
      category: '工学',
      degree: '本科' as const,
      description: '培养具备人工智能基础理论、基本知识、基本技能，能够在相关领域从事智能系统设计、开发、应用的专门人才。',
      skillsMatch: 90.1,
      employmentMatch: 87.8,
      finalScore: 88.9,
    },
    {
      id: 'major_005',
      name: '信息安全',
      code: '080904K',
      category: '工学',
      degree: '本科' as const,
      description: '培养能够从事计算机、通信、电子商务、电子政务、电子金融等领域的信息安全高级专门人才。',
      skillsMatch: 86.3,
      employmentMatch: 88.9,
      finalScore: 87.6,
    },
  ];

  // 生成完整的专业数据
  const fullMajors = majors.flatMap(major => 
    universities.map((university) => ({
      ...major,
      id: `${major.id}_${university.id}`,
      university,
      skills: [
        { name: 'Java编程', category: '编程语言', matchScore: 90 + Math.random() * 10, importance: 85 },
        { name: 'Python编程', category: '编程语言', matchScore: 85 + Math.random() * 10, importance: 80 },
        { name: '数据结构与算法', category: '基础理论', matchScore: 88 + Math.random() * 10, importance: 90 },
        { name: '数据库设计', category: '技术技能', matchScore: 82 + Math.random() * 10, importance: 75 },
        { name: '系统设计', category: '架构能力', matchScore: 78 + Math.random() * 15, importance: 85 },
      ],
      employmentData: {
        totalGraduates: 200 + Math.floor(Math.random() * 300),
        employmentRate: 92 + Math.random() * 6,
        relatedFieldRate: 85 + Math.random() * 10,
        averageSalary: 12000 + Math.floor(Math.random() * 8000),
        topEmployers: ['腾讯', '阿里巴巴', '字节跳动', '华为', '百度'].slice(0, 3 + Math.floor(Math.random() * 2)),
      },
      // 添加一些随机性到评分
      skillsMatch: major.skillsMatch + (Math.random() - 0.5) * 10,
      employmentMatch: major.employmentMatch + (Math.random() - 0.5) * 8,
      finalScore: major.finalScore + (Math.random() - 0.5) * 6,
    }))
  );

  // 应用筛选
  let filteredMajors = fullMajors.filter(major => {
    if (params.location && !params.location.includes(major.university.location.province)) {
      return false;
    }
    if (params.universityTier && !params.universityTier.includes(major.university.tier)) {
      return false;
    }
    if (params.majorCategory && !params.majorCategory.includes(major.category)) {
      return false;
    }
    if (params.degreeLevel && !params.degreeLevel.includes(major.degree)) {
      return false;
    }
    if (params.minScore && major.finalScore < params.minScore) {
      return false;
    }
    return true;
  });

  // 应用排序
  filteredMajors.sort((a, b) => {
    const aValue = a[sortBy as keyof typeof a] as number;
    const bValue = b[sortBy as keyof typeof b] as number;
    return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
  });

  // 应用分页
  const total = filteredMajors.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedMajors = filteredMajors.slice(startIndex, endIndex);

  return {
    data: paginatedMajors,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
    filters: {
      sortBy: sortBy as 'skillsMatch' | 'employmentMatch' | 'finalScore' | string,
      sortOrder: sortOrder as 'asc' | 'desc' | string,
      location: params.location,
      universityTier: params.universityTier as string | ('985' | '211' | '双一流' | '普通')[],
      majorCategory: params.majorCategory,
      degreeLevel: params.degreeLevel as string | ('本科' | '硕士' | '博士')[],
      minScore: params.minScore,
    },
    searchTime: 150 + Math.floor(Math.random() * 100),
  };
}

// 导出搜索结果
export async function exportSearchResults(options: ExportOptions): Promise<ExportResponse> {
  // 模拟导出功能
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        downloadUrl: `/api/exports/search-results-${Date.now()}.${options.format}`,
        filename: `专业匹配结果_${new Date().toISOString().split('T')[0]}.${options.format}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24小时后过期
      });
    }, 2000);
  });
}

// 获取筛选选项
export async function getFilterOptions() {
  return {
    locations: ['北京', '上海', '广东', '浙江', '江苏', '湖北', '陕西', '四川', '山东', '天津'],
    categories: ['工学', '理学', '管理学', '经济学', '文学', '法学', '教育学', '医学', '农学', '艺术学'],
    tiers: ['985', '211', '双一流', '普通'],
  };
}

// 清除缓存
export function clearSearchCache(): void {
  cache.clear();
}

// 获取缓存信息
export function getSearchCacheInfo(): { size: number; keys: string[] } {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  };
}
