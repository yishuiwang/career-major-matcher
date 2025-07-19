// {{CHENGQI:
// Action: Added
// Timestamp: [2025-01-19 16:42:00 +08:00]
// Reason: 定义应用路由常量，集中管理路由配置
// Principle_Applied: DRY (避免重复的路由字符串), SOLID (单一职责 - 只负责路由定义)
// Optimization: 类型安全的路由定义，便于维护
// Architectural_Note (AR): 路由常量定义，支持类型检查
// Documentation_Note (DW): 路由常量文档已创建
// }}

export const ROUTES = {
  HOME: '/',
  SEARCH: '/',
  RESULTS: '/results',
  DASHBOARD: '/dashboard',
  REPORT: '/report',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
