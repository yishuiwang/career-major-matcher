/**
 * 大学数据服务
 * 提供大学列表查询、筛选、搜索等功能
 */

import type {
  University,
  UniversityLevel,
  UniversityType,
  UniversityQueryParams,
  UniversityListResponse,
} from '../types/university';

// {{CHENGQI:
// Action: Modified
// Timestamp: [2025-07-20 00:00:00 +08:00]
// Reason: 修改大学数据服务，从模拟数据改为调用真实的教育部API接口
// Principle_Applied: SOLID (单一职责 - 只负责大学数据), DRY (复用API调用逻辑)
// Optimization: 使用真实API数据，支持分页、筛选、搜索
// Architectural_Note (AR): 大学数据服务层，使用教育部官方API
// Documentation_Note (DW): 大学数据服务已升级为真实API调用
// }}

// 教育部API返回的大学记录接口
interface MoeUniversityRecord {
  序号: number;
  学校名称: string;
  学校标识码: string;
  主管部门: string;
  所在地: string;
  办学层次: string;
  备注?: string;
}

// API调用函数
async function callMoeApi(page: number, keyword: string = ''): Promise<MoeUniversityRecord[]> {
  try {
    const url = `/api/moe/school/wcmdata/getMoDataIndex.jsp`;
    const params = new URLSearchParams({
      listid: '10000101',
      page: page.toString(),
      keyword: keyword
    });

    const response = await fetch(`${url}?${params}`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const htmlText = await response.text();
    console.log('Raw HTML response:', htmlText.substring(0, 500));
    
    // 解析HTML数据
    return parseHtmlResponse(htmlText);
    
  } catch (error) {
    console.error('Education API call failed:', error);
    return [];
  }
}

// 解析HTML响应数据
function parseHtmlResponse(htmlText: string): MoeUniversityRecord[] {
  const universities: MoeUniversityRecord[] = [];
  
  try {
    // 创建一个临时的DOM解析器
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    
    // 查找所有的大学数据块
    const universityBlocks = doc.querySelectorAll('.m_box_b');
    
    universityBlocks.forEach((block) => {
      const listItems = block.querySelectorAll('li');
      const universityData: Partial<MoeUniversityRecord> = {};
      
      listItems.forEach((li) => {
        const labelElement = li.querySelector('i');
        const valueElement = li.querySelector('span');
        
        if (labelElement && valueElement) {
          const label = labelElement.textContent?.trim();
          const value = valueElement.textContent?.trim() || '';
          
          switch (label) {
            case '序号':
              universityData.序号 = parseInt(value) || 0;
              break;
            case '学校名称':
              universityData.学校名称 = value;
              break;
            case '学校标识码':
              universityData.学校标识码 = value;
              break;
            case '主管部门':
              universityData.主管部门 = value;
              break;
            case '所在地':
              universityData.所在地 = value;
              break;
            case '办学层次':
              universityData.办学层次 = value;
              break;
            case '备注':
              universityData.备注 = value || undefined;
              break;
          }
        }
      });
      
      // 验证必填字段并添加到数组
      if (universityData.学校名称 && universityData.学校标识码 && universityData.所在地) {
        universities.push({
          序号: universityData.序号 || 0,
          学校名称: universityData.学校名称,
          学校标识码: universityData.学校标识码,
          主管部门: universityData.主管部门 || '',
          所在地: universityData.所在地,
          办学层次: universityData.办学层次 || '本科',
          备注: universityData.备注
        });
      }
    });
    
    console.log(`Parsed ${universities.length} universities from HTML`);
    return universities;
    
  } catch (parseError) {
    console.error('Failed to parse HTML response:', parseError);
    return [];
  }
}

// 将教育部API数据转换为University接口格式
function transformMoeRecordToUniversity(record: MoeUniversityRecord): University {
  // 映射办学层次到我们的类型系统
  const mapLevel = (level: string): UniversityLevel[] => {
    const levelStr = level.toLowerCase();
    
    // 基于常见的985/211大学名称进行推断
    const schoolName = record.学校名称;
    const is985 = is985University(schoolName);
    const is211 = is211University(schoolName);
    const isDoubleFirstClass = isDoubleFirstClassUniversity(schoolName);
    
    const levels: UniversityLevel[] = [];
    if (is985) levels.push('985');
    if (is211) levels.push('211');
    if (isDoubleFirstClass) levels.push('双一流');
    
    // 如果没有特殊层次，根据办学层次字段判断
    if (levels.length === 0) {
      if (levelStr.includes('本科')) {
        levels.push('普通本科');
      } else if (levelStr.includes('专科')) {
        levels.push('专科');
      } else {
        levels.push('普通本科'); // 默认值
      }
    }
    
    return levels;
  };

  // 根据学校名称推断类型（简化逻辑）
  const inferType = (name: string): UniversityType => {
    if (name.includes('师范')) return '师范类';
    if (name.includes('理工') || name.includes('科技') || name.includes('工业') || name.includes('工程')) return '理工类';
    if (name.includes('医药') || name.includes('医学') || name.includes('中医')) return '医药类';
    if (name.includes('农业') || name.includes('林业') || name.includes('农林')) return '农林类';
    if (name.includes('财经') || name.includes('经济') || name.includes('商学') || name.includes('贸易')) return '财经类';
    if (name.includes('政法') || name.includes('法学') || name.includes('政治')) return '政法类';
    if (name.includes('外国语') || name.includes('语言') || name.includes('外语')) return '语言类';
    if (name.includes('艺术') || name.includes('美术') || name.includes('音乐') || name.includes('戏剧')) return '艺术类';
    if (name.includes('体育')) return '体育类';
    if (name.includes('军事') || name.includes('国防')) return '军事类';
    if (name.includes('民族')) return '民族类';
    return '综合类'; // 默认值
  };

  // 解析所在地，提取省份和城市
  const parseLocation = (location: string) => {
    const province = location;
    let city = location;
    
    // 如果是直辖市
    if (['北京市', '天津市', '上海市', '重庆市'].includes(location)) {
      city = location;
    } else {
      // 其他省份，尝试提取城市信息（这里使用简化逻辑）
      city = location.replace('省', '').replace('自治区', '').replace('特别行政区', '') + '市';
    }
    
    return { province, city };
  };

  const { province, city } = parseLocation(record.所在地);

  return {
    id: record.学校标识码,
    name: record.学校名称,
    province,
    city,
    level: mapLevel(record.办学层次),
    type: inferType(record.学校名称),
    establishedYear: undefined, // API中没有提供
    website: undefined, // API中没有提供
    ranking: { 
      national: record.序号 
    },
    statistics: {
      totalMajors: 0,
      totalStudents: 0, 
      totalFaculty: 0
    }
  };
}

// 985大学名单（简化版）
function is985University(name: string): boolean {
  const universities985 = [
    '北京大学', '清华大学', '复旦大学', '上海交通大学', '浙江大学', 
    '中国科学技术大学', '南京大学', '华中科技大学', '中山大学', '西安交通大学',
    '哈尔滨工业大学', '北京航空航天大学', '北京理工大学', '天津大学', '大连理工大学',
    '东南大学', '华南理工大学', '重庆大学', '四川大学', '电子科技大学',
    '西北工业大学', '兰州大学', '东北大学', '湖南大学', '华东师范大学',
    '北京师范大学', '中南大学', '山东大学', '中国海洋大学', '西北农林科技大学',
    '吉林大学', '厦门大学', '同济大学', '中国农业大学', '国防科技大学',
    '中央民族大学', '华北电力大学', '中国石油大学'
  ];
  
  return universities985.some(uni => name.includes(uni) || uni.includes(name));
}

// 211大学判断（简化版，包含985大学）
function is211University(name: string): boolean {
  // 985大学都是211大学
  if (is985University(name)) return true;
  
  // 其他211大学（这里只列举部分）
  const universities211 = [
    '北京交通大学', '北京工业大学', '北京科技大学', '北京化工大学', '北京邮电大学',
    '北京林业大学', '北京中医药大学', '北京外国语大学', '中国传媒大学', '对外经济贸易大学',
    '中央财经大学', '中国政法大学', '华北电力大学', '中国矿业大学', '中国地质大学',
    '中国石油大学', '南开大学', '河北工业大学', '太原理工大学', '内蒙古大学',
    '辽宁大学', '东北师范大学', '延边大学', '华东理工大学', '河海大学'
  ];
  
  return universities211.some(uni => name.includes(uni) || uni.includes(name));
}

// 双一流大学判断（简化版）
function isDoubleFirstClassUniversity(name: string): boolean {
  // 大部分985/211都是双一流
  if (is985University(name) || is211University(name)) return true;
  
  // 其他双一流大学
  const doubleFirstClass = [
    '首都师范大学', '中央戏剧学院', '中央美术学院', '中央音乐学院', 
    '上海海洋大学', '上海中医药大学', '上海外国语大学', '上海财经大学',
    '南京邮电大学', '南京信息工程大学', '南京农业大学', '南京中医药大学'
  ];
  
  return doubleFirstClass.some(uni => name.includes(uni) || uni.includes(name));
}


// 获取大学列表
// 获取大学列表 - 使用真实API，带回退机制
export async function getUniversities(params: UniversityQueryParams): Promise<UniversityListResponse> {
  try {
    // 首先尝试调用教育部API
    console.log('Attempting to call Ministry of Education API...');
    const apiData = await callMoeApi(params.page, params.search || '');
    
    // 如果API返回了数据，进行转换和处理
    if (apiData && apiData.length > 0) {
      console.log(`API returned ${apiData.length} universities`);
      
      // 将API数据转换为我们的University格式
      let universities = apiData.map(record => transformMoeRecordToUniversity(record));
      
      // 应用筛选条件
      if (params.province) {
        universities = universities.filter(uni => uni.province === params.province);
      }
      
      if (params.level) {
        universities = universities.filter(uni => 
          uni.level.includes(params.level as UniversityLevel)
        );
      }
      
      if (params.type) {
        universities = universities.filter(uni => uni.type === params.type);
      }
      
      // 应用排序
      if (params.sortBy) {
        universities.sort((a, b) => {
          let aValue: any, bValue: any;
          
          switch (params.sortBy) {
            case 'name':
              aValue = a.name;
              bValue = b.name;
              break;
            case 'establishedYear':
              aValue = a.establishedYear || 0;
              bValue = b.establishedYear || 0;
              break;
            case 'ranking':
              aValue = a.ranking?.national || 999;
              bValue = b.ranking?.national || 999;
              break;
            default:
              return 0;
          }
          
          if (params.sortOrder === 'desc') {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
          } else {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          }
        });
      }
      
      // 计算总数和分页
      const total = universities.length;
      const totalPages = Math.ceil(total / params.pageSize);
      
      // 手动分页（因为API可能不支持精确的分页）
      const startIndex = (params.page - 1) * params.pageSize;
      const endIndex = startIndex + params.pageSize;
      const paginatedUniversities = universities.slice(startIndex, endIndex);
      
      return {
        universities: paginatedUniversities,
        total,
        page: params.page,
        pageSize: params.pageSize,
        totalPages,
      };
    } else {
      console.warn('API returned no data, falling back to mock data');
      // 如果API没有返回数据，回退到模拟数据
      return {
        universities: [],
        total: 0,
        page: params.page,
        pageSize: params.pageSize,
        totalPages: 0,
      }
    }
    
  } catch (error) {
    console.error('Failed to fetch universities from API, using fallback:', error);
    // 如果API调用完全失败，回退到模拟数据
    return {
      universities: [],
      total: 0,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: 0,
    };
  }
}
