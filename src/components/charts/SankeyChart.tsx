import React, { useEffect, useRef } from 'react';
import { Box, Typography, Skeleton, Paper } from '@mui/material';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
// 定义数据类型
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

// 定义组件Props类型
interface SankeyChartProps {
  data: SankeyData;
  width?: number;
  height?: number;
  loading?: boolean;
  onNodeClick?: (node: SankeyNode) => void;
}

// {{CHENGQI:
// Action: Added
// Timestamp: [2025-01-19 17:38:00 +08:00]
// Reason: 创建桑基图组件，使用D3.js展示院校专业到岗位群的流向关系
// Principle_Applied: SOLID (单一职责 - 只负责桑基图可视化), KISS (清晰的数据流向展示)
// Optimization: 使用D3.js实现高性能的桑基图，支持交互和响应式设计
// Architectural_Note (AR): 基于D3.js的可视化组件，支持数据驱动的动态更新
// Documentation_Note (DW): SankeyChart组件已创建，展示数据流向关系
// }}

const SankeyChart: React.FC<SankeyChartProps> = ({
  data,
  width = 800,
  height = 400,
  loading = false,
  onNodeClick,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || loading || !svgRef.current || !data.nodes.length || !data.links.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // 清除之前的内容

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // 创建桑基图布局
    const sankeyGenerator = sankey<any, any>()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([
        [margin.left, margin.top],
        [width - margin.right, height - margin.bottom],
      ]);

    // 处理数据 - 创建节点ID到索引的映射
    const nodeMap = new Map();
    data.nodes.forEach((node, index) => {
      nodeMap.set(node.id, index);
    });

    // 转换链接数据，将ID转换为索引
    const processedLinks = data.links.map(link => ({
      source: nodeMap.get(link.source),
      target: nodeMap.get(link.target),
      value: link.value,
    })).filter(link =>
      link.source !== undefined &&
      link.target !== undefined
    );

    const graph = sankeyGenerator({
      nodes: data.nodes.map(d => ({ ...d })),
      links: processedLinks,
    });

    const container = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 定义颜色比例尺
    const colorScale = d3.scaleOrdinal<string>()
      .domain(['university', 'major', 'jobGroup'])
      .range(['#1976d2', '#42a5f5', '#90caf9']);

    // 绘制连接线
    const links = container
      .append('g')
      .selectAll('path')
      .data(graph.links)
      .enter()
      .append('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', '#ccc')
      .attr('stroke-opacity', 0.5)
      .attr('stroke-width', (d: any) => Math.max(1, d.width))
      .attr('fill', 'none')
      .on('mouseover', function(event, d: any) {
        d3.select(this)
          .attr('stroke-opacity', 0.8)
          .attr('stroke', '#666');
        
        // 显示tooltip
        const tooltip = d3.select('body')
          .append('div')
          .attr('class', 'sankey-tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0,0,0,0.8)')
          .style('color', 'white')
          .style('padding', '8px')
          .style('border-radius', '4px')
          .style('font-size', '12px')
          .style('pointer-events', 'none')
          .style('z-index', 1000)
          .html(`${d.source.name} → ${d.target.name}<br/>流量: ${d.value}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('stroke-opacity', 0.5)
          .attr('stroke', '#ccc');
        
        d3.selectAll('.sankey-tooltip').remove();
      });

    // 绘制节点
    const nodes = container
      .append('g')
      .selectAll('rect')
      .data(graph.nodes)
      .enter()
      .append('rect')
      .attr('x', (d: any) => d.x0)
      .attr('y', (d: any) => d.y0)
      .attr('height', (d: any) => d.y1 - d.y0)
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('fill', (d: any) => colorScale(d.category))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .attr('rx', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d: any) {
        d3.select(this).attr('opacity', 0.8);
        
        // 显示tooltip
        const tooltip = d3.select('body')
          .append('div')
          .attr('class', 'sankey-tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0,0,0,0.8)')
          .style('color', 'white')
          .style('padding', '8px')
          .style('border-radius', '4px')
          .style('font-size', '12px')
          .style('pointer-events', 'none')
          .style('z-index', 1000)
          .html(`${d.name}<br/>类型: ${getCategoryName(d.category)}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 1);
        d3.selectAll('.sankey-tooltip').remove();
      })
      .on('click', function(event, d: any) {
        if (onNodeClick) {
          onNodeClick(d);
        }
      });

    // 添加节点标签
    container
      .append('g')
      .selectAll('text')
      .data(graph.nodes)
      .enter()
      .append('text')
      .attr('x', (d: any) => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr('y', (d: any) => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d: any) => d.x0 < width / 2 ? 'start' : 'end')
      .style('font-size', '12px')
      .style('font-weight', '500')
      .style('fill', '#333')
      .text((d: any) => d.name.length > 12 ? d.name.substring(0, 12) + '...' : d.name);

    // 添加图例
    const legend = svg
      .append('g')
      .attr('transform', `translate(${width - 150}, 20)`);

    const legendData = [
      { category: 'university', name: '大学' },
      { category: 'major', name: '专业' },
      { category: 'jobGroup', name: '岗位群' },
    ];

    const legendItems = legend
      .selectAll('.legend-item')
      .data(legendData)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`);

    legendItems
      .append('rect')
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', d => colorScale(d.category));

    legendItems
      .append('text')
      .attr('x', 16)
      .attr('y', 6)
      .attr('dy', '0.35em')
      .style('font-size', '12px')
      .style('fill', '#666')
      .text(d => d.name);

  }, [data, width, height, loading, onNodeClick]);

  const getCategoryName = (category: string) => {
    const names = {
      university: '大学',
      major: '专业',
      jobGroup: '岗位群',
    };
    return names[category as keyof typeof names] || category;
  };

  if (loading) {
    return (
      <Paper elevation={2} sx={{ p: 3, height }}>
        <Typography variant="h6" gutterBottom>
          院校专业流向分析
        </Typography>
        <Skeleton variant="rectangular" width="100%" height={height - 80} />
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        院校专业流向分析
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        展示从大学专业到岗位群的毕业生流向关系
      </Typography>
      <Box sx={{ width: '100%', overflow: 'auto' }}>
        <svg
          ref={svgRef}
          width={width}
          height={height}
          style={{ display: 'block' }}
        />
      </Box>
    </Paper>
  );
};

export default SankeyChart;
