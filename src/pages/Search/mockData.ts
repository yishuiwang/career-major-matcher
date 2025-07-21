// {{CHENGQI:
// Action: Created
// Timestamp: [2025-01-20 16:30:00 +08:00]
// Reason: 创建模拟数据生成器，提供搜索结果的模拟数据
// Principle_Applied: SOLID (单一职责原则), DRY (集中管理模拟数据)
// Optimization: 真实的学校和专业数据，合理的得分分布，详细的分析内容
// Architectural_Note (AR): 独立的模拟数据模块，便于测试和开发
// Documentation_Note (DW): mockData.ts - 搜索结果模拟数据生成器
// }}

import type { SearchResult } from './types';

// 创建模拟搜索结果数据
export const createMockSearchResult = (query: string): SearchResult => {
  const mockMajors = [
    {
      id: '1',
      schoolName: '清华大学',
      majorName: '计算机科学与技术',
      matchScore: 95,
      employmentRate: 98,
      salaryLevel: 85000,
      reportUrl: '/reports/tsinghua-cs',
      description: '国内顶尖的计算机专业，在人工智能、软件工程等领域具有领先优势'
    },
    {
      id: '2',
      schoolName: '北京航空航天大学',
      majorName: '飞行器设计与工程',
      matchScore: 92,
      employmentRate: 96,
      salaryLevel: 75000,
      reportUrl: '/reports/buaa-aircraft',
      description: '低空经济核心专业，培养无人机、飞行器设计等领域专业人才'
    },
    {
      id: '3',
      schoolName: '上海交通大学',
      majorName: '电子信息工程',
      matchScore: 90,
      employmentRate: 95,
      salaryLevel: 78000,
      reportUrl: '/reports/sjtu-ee',
      description: '电子信息领域综合实力强，在通信、集成电路等方向表现突出'
    },
    {
      id: '4',
      schoolName: '浙江大学',
      majorName: '软件工程',
      matchScore: 88,
      employmentRate: 94,
      salaryLevel: 72000,
      reportUrl: '/reports/zju-se',
      description: '软件工程专业实力雄厚，与互联网企业合作密切'
    },
    {
      id: '5',
      schoolName: '华中科技大学',
      majorName: '机械设计制造及其自动化',
      matchScore: 85,
      employmentRate: 92,
      salaryLevel: 68000,
      reportUrl: '/reports/hust-me',
      description: '机械工程领域知名专业，在智能制造方向优势明显'
    },
    {
      id: '6',
      schoolName: '北京理工大学',
      majorName: '自动化',
      matchScore: 83,
      employmentRate: 91,
      salaryLevel: 70000,
      reportUrl: '/reports/bit-auto',
      description: '自动化专业历史悠久，在控制理论与应用方面实力强劲'
    },
    {
      id: '7',
      schoolName: '西北工业大学',
      majorName: '航空航天工程',
      matchScore: 82,
      employmentRate: 90,
      salaryLevel: 69000,
      reportUrl: '/reports/npu-aero',
      description: '航空航天领域特色鲜明，在无人机技术方面领先'
    },
    {
      id: '8',
      schoolName: '东南大学',
      majorName: '交通运输工程',
      matchScore: 80,
      employmentRate: 89,
      salaryLevel: 65000,
      reportUrl: '/reports/seu-transport',
      description: '交通运输工程专业实力突出，在智能交通领域有所建树'
    },
    {
      id: '9',
      schoolName: '大连理工大学',
      majorName: '船舶与海洋工程',
      matchScore: 78,
      employmentRate: 87,
      salaryLevel: 62000,
      reportUrl: '/reports/dlut-marine',
      description: '海洋工程领域优势专业，在海洋装备制造方面表现优秀'
    },
    {
      id: '10',
      schoolName: '中南大学',
      majorName: '材料科学与工程',
      matchScore: 76,
      employmentRate: 86,
      salaryLevel: 60000,
      reportUrl: '/reports/csu-materials',
      description: '材料科学领域实力强劲，在新材料研发方面具有优势'
    }
  ];

  const analysis = `基于您的查询"**${query}**"，我为您分析了相关的专业匹配情况。

## 🎯 核心分析

我综合考虑了以下关键因素来为您推荐最适合的专业：

- **技能匹配度** - 专业课程与岗位技能的契合程度
- **就业前景** - 行业发展趋势和市场需求
- **薪资水平** - 毕业生收入和职业发展空间
- **学校实力** - 院校在相关领域的教学科研优势

## 📊 行业趋势洞察

当前相关领域正在经历重要变革：

**🚀 技术驱动增长**
- 人工智能与机器学习需求爆发式增长
- 5G、物联网、集成电路成为核心赛道
- 数字化转型为传统行业注入新活力

**🌟 新兴机遇领域**
- 低空经济政策利好，无人机、eVTOL前景广阔
- 新能源与智能制造转型升级加速
- 跨学科融合创造更多可能性

## 💡 我的专业建议

根据当前市场趋势和您的查询，我特别推荐关注：

1. **计算机科学类专业** - 技术需求持续旺盛，就业面广
2. **航空航天类专业** - 低空经济风口，发展潜力巨大
3. **电子信息类专业** - 基础性强，适应性好，应用广泛

选择专业时，建议您优先考虑个人兴趣、发展前景、学校实力和地域因素的平衡。`;

  return {
    query,
    analysis,
    topMajors: mockMajors,
    timestamp: new Date()
  };
};

// 根据查询内容生成不同的模拟数据
export const getMockSearchResult = (query: string): SearchResult => {
  // 可以根据不同的查询关键词返回不同的模拟数据
  if (query.includes('人工智能') || query.includes('AI')) {
    return {
      ...createMockSearchResult(query),
      topMajors: [
        {
          id: '1',
          schoolName: '清华大学',
          majorName: '人工智能',
          matchScore: 98,
          employmentRate: 99,
          salaryLevel: 90000,
          reportUrl: '/reports/tsinghua-ai',
          description: '国内首批人工智能本科专业，师资力量雄厚，产学研一体化'
        },
        {
          id: '2',
          schoolName: '北京大学',
          majorName: '智能科学与技术',
          matchScore: 96,
          employmentRate: 97,
          salaryLevel: 88000,
          reportUrl: '/reports/pku-ist',
          description: '理论基础扎实，在机器学习、计算机视觉等方向有深厚积累'
        },
        // ... 其他专业
      ].concat(createMockSearchResult(query).topMajors.slice(2))
    };
  }
  
  if (query.includes('金融') || query.includes('经济')) {
    return {
      ...createMockSearchResult(query),
      topMajors: [
        {
          id: '1',
          schoolName: '北京大学',
          majorName: '金融学',
          matchScore: 97,
          employmentRate: 96,
          salaryLevel: 85000,
          reportUrl: '/reports/pku-finance',
          description: '国内金融学科顶尖专业，理论与实践并重，就业方向广泛'
        },
        {
          id: '2',
          schoolName: '上海交通大学',
          majorName: '金融科技',
          matchScore: 94,
          employmentRate: 95,
          salaryLevel: 82000,
          reportUrl: '/reports/sjtu-fintech',
          description: '金融与科技交叉学科，培养金融科技复合型人才'
        },
        // ... 其他专业
      ].concat(createMockSearchResult(query).topMajors.slice(2))
    };
  }
  
  // 默认返回通用模拟数据
  return createMockSearchResult(query);
};
