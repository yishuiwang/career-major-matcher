import React, { useEffect, useRef } from 'react';
import { Box, Typography, Skeleton, Paper } from '@mui/material';
import * as echarts from 'echarts';
// 定义数据类型
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

// 定义组件Props类型
interface HeatMapProps {
  data: HeatMapData;
  height?: number;
  loading?: boolean;
  title?: string;
}

// 注册中国地图数据（简化版本，实际项目中应该使用完整的地图数据）
const chinaGeoJson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: '中国' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [73.66, 53.56], [134.77, 53.56], [134.77, 18.16], [73.66, 18.16], [73.66, 53.56]
        ]]
      }
    }
  ]
};

// {{CHENGQI:
// Action: Added
// Timestamp: [2025-01-19 17:42:00 +08:00]
// Reason: 创建热力图组件，使用ECharts展示毕业生就业地理分布
// Principle_Applied: SOLID (单一职责 - 只负责热力图可视化), KISS (清晰的地理数据展示)
// Optimization: 使用ECharts实现高性能的地理热力图，支持交互和响应式设计
// Architectural_Note (AR): 基于ECharts的地理可视化组件，支持数据驱动的动态更新
// Documentation_Note (DW): HeatMap组件已创建，展示地理分布数据
// }}

const HeatMap: React.FC<HeatMapProps> = ({
  data,
  height = 400,
  loading = false,
  title = '毕业生就业地理分布',
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!data || loading || !chartRef.current) return;

    // 初始化图表
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
      // 注册地图数据
      echarts.registerMap('china', chinaGeoJson);
    }

    const chart = chartInstance.current;

    // 准备数据
    const maxValue = data.maxValue;
    const minValue = data.minValue;

    // 转换数据格式为ECharts需要的格式
    const heatmapData = data.data.map(point => [
      point.lng,
      point.lat,
      point.value,
      point.region || '',
    ]);

    // 配置图表选项
    const option: echarts.EChartsOption = {
      title: {
        text: title,
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#333',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: function(params: any) {
          const data = params.data;
          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 4px;">${data[3] || '未知地区'}</div>
              <div>就业人数: ${data[2]}</div>
              <div>坐标: ${data[0].toFixed(2)}, ${data[1].toFixed(2)}</div>
            </div>
          `;
        },
      },
      geo: {
        map: 'china',
        roam: true,
        zoom: 1.2,
        center: [104.0, 37.5],
        itemStyle: {
          areaColor: '#f3f3f3',
          borderColor: '#999',
          borderWidth: 0.5,
        },
        emphasis: {
          itemStyle: {
            areaColor: '#e6f3ff',
          },
        },
      },
      visualMap: {
        min: minValue,
        max: maxValue,
        calculable: true,
        inRange: {
          color: ['#50a3ba', '#eac736', '#d94e5d'],
        },
        textStyle: {
          color: '#333',
        },
        orient: 'horizontal',
        left: 'center',
        bottom: '10%',
      },
      series: [
        {
          name: '就业分布',
          type: 'heatmap',
          coordinateSystem: 'geo',
          data: heatmapData,
          pointSize: 20,
          blurSize: 35,
        },
        {
          name: '就业热点',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: heatmapData,
          symbolSize: function(val: number[]) {
            return Math.max(8, Math.min(30, val[2] / maxValue * 30));
          },
          itemStyle: {
            color: 'rgba(255, 50, 50, 0.8)',
            shadowBlur: 10,
            shadowColor: 'rgba(255, 50, 50, 0.5)',
          },
          emphasis: {
            itemStyle: {
              color: 'rgba(255, 50, 50, 1)',
            },
          },
        },
      ],
    };

    // 设置图表选项
    chart.setOption(option, true);

    // 处理窗口大小变化
    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data, height, loading, title]);

  // 组件卸载时销毁图表
  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, []);

  if (loading) {
    return (
      <Paper elevation={2} sx={{ p: 3, height }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Skeleton variant="rectangular" width="100%" height={height - 80} />
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        基于真实就业数据的地理分布热力图，颜色深浅表示就业人数多少
      </Typography>
      <Box
        ref={chartRef}
        sx={{
          width: '100%',
          height: height - 80,
          '& canvas': {
            borderRadius: 1,
          },
        }}
      />
    </Paper>
  );
};

export default HeatMap;
