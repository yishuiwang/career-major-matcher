import React, { useEffect, useState, useMemo } from 'react';
import { Box, useTheme } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

// {{CHENGQI:
// Action: Added
// Timestamp: [2025-01-19 18:30:00 +08:00]
// Reason: 创建Markdown渲染组件，支持报告内容展示、目录生成、搜索高亮
// Principle_Applied: SOLID (单一职责 - 只负责Markdown渲染), KISS (清晰的渲染逻辑)
// Optimization: 支持语法高亮、表格、目录自动生成等功能
// Architectural_Note (AR): 可复用的Markdown渲染组件，支持自定义样式
// Documentation_Note (DW): MarkdownRenderer组件已创建，用于报告内容渲染
// }}

// 定义类型
interface TOCItem {
  id: string;
  title: string;
  level: number;
  anchor: string;
  children?: TOCItem[];
}

interface TableOfContents {
  items: TOCItem[];
  totalSections: number;
}

interface MarkdownRendererProps {
  content: string;
  onTOCGenerated?: (toc: TableOfContents) => void;
  searchTerm?: string;
  highlightMatches?: boolean;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  onTOCGenerated,
  searchTerm,
  highlightMatches = false,
  className,
}) => {
  const theme = useTheme();
  const [processedContent, setProcessedContent] = useState(content);

  // 生成目录
  const generateTOC = useMemo(() => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const items: TOCItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const title = match[2].trim();
      const anchor = title
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
        .replace(/\s+/g, '-');

      items.push({
        id: `heading-${items.length}`,
        title,
        level,
        anchor,
      });
    }

    return {
      items,
      totalSections: items.length,
    };
  }, [content]);

  // 处理搜索高亮
  useEffect(() => {
    if (searchTerm && highlightMatches) {
      const highlightedContent = content.replace(
        new RegExp(`(${searchTerm})`, 'gi'),
        '<mark style="background-color: #ffeb3b; padding: 2px 4px; border-radius: 2px;">$1</mark>'
      );
      setProcessedContent(highlightedContent);
    } else {
      setProcessedContent(content);
    }
  }, [content, searchTerm, highlightMatches]);

  // 通知父组件目录生成完成
  useEffect(() => {
    if (onTOCGenerated) {
      onTOCGenerated(generateTOC);
    }
  }, [generateTOC, onTOCGenerated]);

  // 自定义渲染组件
  const components = {
    // 标题渲染，添加锚点
    h1: ({ children, ...props }: any) => {
      const text = children?.toString() || '';
      const anchor = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
        .replace(/\s+/g, '-');
      
      return (
        <Box
          component="h1"
          id={anchor}
          sx={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: theme.palette.primary.main,
            mt: 4,
            mb: 2,
            pb: 1,
            borderBottom: `2px solid ${theme.palette.primary.main}`,
            scrollMarginTop: '80px', // 为固定导航栏留出空间
          }}
          {...props}
        >
          {children}
        </Box>
      );
    },

    h2: ({ children, ...props }: any) => {
      const text = children?.toString() || '';
      const anchor = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
        .replace(/\s+/g, '-');
      
      return (
        <Box
          component="h2"
          id={anchor}
          sx={{
            fontSize: '2rem',
            fontWeight: 600,
            color: theme.palette.text.primary,
            mt: 3,
            mb: 2,
            scrollMarginTop: '80px',
          }}
          {...props}
        >
          {children}
        </Box>
      );
    },

    h3: ({ children, ...props }: any) => {
      const text = children?.toString() || '';
      const anchor = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
        .replace(/\s+/g, '-');
      
      return (
        <Box
          component="h3"
          id={anchor}
          sx={{
            fontSize: '1.5rem',
            fontWeight: 600,
            color: theme.palette.text.primary,
            mt: 2.5,
            mb: 1.5,
            scrollMarginTop: '80px',
          }}
          {...props}
        >
          {children}
        </Box>
      );
    },

    h4: ({ children, ...props }: any) => {
      const text = children?.toString() || '';
      const anchor = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
        .replace(/\s+/g, '-');
      
      return (
        <Box
          component="h4"
          id={anchor}
          sx={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: theme.palette.text.primary,
            mt: 2,
            mb: 1,
            scrollMarginTop: '80px',
          }}
          {...props}
        >
          {children}
        </Box>
      );
    },

    // 段落渲染
    p: ({ children, ...props }: any) => (
      <Box
        component="p"
        sx={{
          fontSize: '1rem',
          lineHeight: 1.7,
          color: theme.palette.text.primary,
          mb: 2,
          textAlign: 'justify',
        }}
        {...props}
      >
        {children}
      </Box>
    ),

    // 表格渲染
    table: ({ children, ...props }: any) => (
      <Box
        sx={{
          width: '100%',
          overflowX: 'auto',
          mb: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
        }}
      >
        <Box
          component="table"
          sx={{
            width: '100%',
            borderCollapse: 'collapse',
            '& th': {
              backgroundColor: theme.palette.grey[100],
              color: theme.palette.text.primary,
              fontWeight: 600,
              padding: '12px 16px',
              textAlign: 'left',
              borderBottom: `1px solid ${theme.palette.divider}`,
            },
            '& td': {
              padding: '12px 16px',
              borderBottom: `1px solid ${theme.palette.divider}`,
              color: theme.palette.text.primary,
            },
            '& tr:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
          {...props}
        >
          {children}
        </Box>
      </Box>
    ),

    // 代码块渲染
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      
      if (!inline && match) {
        return (
          <Box sx={{ mb: 2 }}>
            <SyntaxHighlighter
              style={tomorrow}
              language={match[1]}
              PreTag="div"
              customStyle={{
                borderRadius: theme.shape.borderRadius,
                fontSize: '0.875rem',
              }}
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </Box>
        );
      }

      return (
        <Box
          component="code"
          sx={{
            backgroundColor: theme.palette.grey[100],
            color: theme.palette.error.main,
            padding: '2px 6px',
            borderRadius: 1,
            fontSize: '0.875rem',
            fontFamily: 'monospace',
          }}
          {...props}
        >
          {children}
        </Box>
      );
    },

    // 引用块渲染
    blockquote: ({ children, ...props }: any) => (
      <Box
        component="blockquote"
        sx={{
          borderLeft: `4px solid ${theme.palette.primary.main}`,
          backgroundColor: theme.palette.grey[50],
          margin: '16px 0',
          padding: '16px 20px',
          fontStyle: 'italic',
          color: theme.palette.text.secondary,
          '& p': {
            mb: 0,
          },
        }}
        {...props}
      >
        {children}
      </Box>
    ),

    // 列表渲染
    ul: ({ children, ...props }: any) => (
      <Box
        component="ul"
        sx={{
          mb: 2,
          pl: 3,
          '& li': {
            mb: 0.5,
            color: theme.palette.text.primary,
            lineHeight: 1.6,
          },
        }}
        {...props}
      >
        {children}
      </Box>
    ),

    ol: ({ children, ...props }: any) => (
      <Box
        component="ol"
        sx={{
          mb: 2,
          pl: 3,
          '& li': {
            mb: 0.5,
            color: theme.palette.text.primary,
            lineHeight: 1.6,
          },
        }}
        {...props}
      >
        {children}
      </Box>
    ),

    // 分割线渲染
    hr: ({ ...props }: any) => (
      <Box
        component="hr"
        sx={{
          border: 'none',
          height: 1,
          backgroundColor: theme.palette.divider,
          my: 4,
        }}
        {...props}
      />
    ),

    // 链接渲染
    a: ({ children, href, ...props }: any) => (
      <Box
        component="a"
        href={href}
        sx={{
          color: theme.palette.primary.main,
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        }}
        {...props}
      >
        {children}
      </Box>
    ),
  };

  return (
    <Box
      className={className}
      sx={{
        '& .markdown-content': {
          maxWidth: '100%',
          wordBreak: 'break-word',
        },
        // 搜索高亮样式
        '& mark': {
          backgroundColor: theme.palette.warning.light,
          color: theme.palette.warning.contrastText,
          padding: '2px 4px',
          borderRadius: 1,
        },
      }}
    >
      <div className="markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeRaw]}
          components={components}
        >
          {processedContent}
        </ReactMarkdown>
      </div>
    </Box>
  );
};

export default MarkdownRenderer;
