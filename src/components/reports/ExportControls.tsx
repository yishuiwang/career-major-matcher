import React, { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Switch,
  Typography,
  CircularProgress,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  Description as WordIcon,
  Code as HtmlIcon,
  Print as PrintIcon,
  Share as ShareIcon,
} from '@mui/icons-material';

// {{CHENGQI:
// Action: Added
// Timestamp: [2025-01-19 18:40:00 +08:00]
// Reason: 创建报告导出控制组件，支持多种格式导出和打印功能
// Principle_Applied: SOLID (单一职责 - 只负责导出控制), KISS (简洁的导出界面)
// Optimization: 支持多种导出格式、自定义选项、进度显示
// Architectural_Note (AR): 可复用的导出控制组件，支持异步导出
// Documentation_Note (DW): ExportControls组件已创建，用于报告导出功能
// }}

// 定义类型
interface ExportOptions {
  format: 'pdf' | 'word' | 'html';
  includeImages: boolean;
  pageSize?: 'A4' | 'Letter';
  orientation?: 'portrait' | 'landscape';
}

interface ExportControlsProps {
  reportId: string;
  onExport: (options: ExportOptions) => Promise<void>;
  loading?: boolean;
  disabled?: boolean;
}

const ExportControls: React.FC<ExportControlsProps> = ({
  reportId,
  onExport,
  loading = false,
  disabled = false,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeImages: true,
    pageSize: 'A4',
    orientation: 'portrait',
  });
  const [exporting, setExporting] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleQuickExport = async (format: ExportOptions['format']) => {
    handleMenuClose();
    setExporting(true);
    
    try {
      await onExport({
        ...exportOptions,
        format,
      });
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const handleCustomExport = () => {
    handleMenuClose();
    setExportDialogOpen(true);
  };

  const handleExportConfirm = async () => {
    setExportDialogOpen(false);
    setExporting(true);
    
    try {
      await onExport(exportOptions);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const handlePrint = () => {
    handleMenuClose();
    window.print();
  };

  const handleShare = () => {
    handleMenuClose();
    // 实现分享功能
    if (navigator.share) {
      navigator.share({
        title: '专业匹配分析报告',
        text: '查看我的专业匹配分析报告',
        url: window.location.href,
      });
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href);
      // 这里可以显示一个提示消息
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return <PdfIcon />;
      case 'word':
        return <WordIcon />;
      case 'html':
        return <HtmlIcon />;
      default:
        return <DownloadIcon />;
    }
  };

  const getFormatLabel = (format: string) => {
    switch (format) {
      case 'pdf':
        return 'PDF文档';
      case 'word':
        return 'Word文档';
      case 'html':
        return 'HTML网页';
      default:
        return format.toUpperCase();
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1 }}>
        {/* 主导出按钮 */}
        <Button
          variant="contained"
          startIcon={exporting ? <CircularProgress size={16} /> : <DownloadIcon />}
          onClick={handleMenuOpen}
          disabled={disabled || loading || exporting}
          sx={{ minWidth: 120 }}
        >
          {exporting ? '导出中...' : '导出报告'}
        </Button>

        {/* 打印按钮 */}
        <Button
          variant="outlined"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          disabled={disabled || loading}
        >
          打印
        </Button>

        {/* 分享按钮 */}
        <Button
          variant="outlined"
          startIcon={<ShareIcon />}
          onClick={handleShare}
          disabled={disabled || loading}
        >
          分享
        </Button>
      </Box>

      {/* 导出菜单 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 200 },
        }}
      >
        <MenuItem onClick={() => handleQuickExport('pdf')}>
          <PdfIcon sx={{ mr: 2, color: 'error.main' }} />
          <Box>
            <Typography variant="body2">PDF文档</Typography>
            <Typography variant="caption" color="text.secondary">
              适合打印和分享
            </Typography>
          </Box>
        </MenuItem>

        <MenuItem onClick={() => handleQuickExport('word')}>
          <WordIcon sx={{ mr: 2, color: 'info.main' }} />
          <Box>
            <Typography variant="body2">Word文档</Typography>
            <Typography variant="caption" color="text.secondary">
              可编辑格式
            </Typography>
          </Box>
        </MenuItem>

        <MenuItem onClick={() => handleQuickExport('html')}>
          <HtmlIcon sx={{ mr: 2, color: 'success.main' }} />
          <Box>
            <Typography variant="body2">HTML网页</Typography>
            <Typography variant="caption" color="text.secondary">
              在线查看
            </Typography>
          </Box>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleCustomExport}>
          <Box sx={{ ml: 4 }}>
            <Typography variant="body2" color="primary">
              自定义导出...
            </Typography>
          </Box>
        </MenuItem>
      </Menu>

      {/* 自定义导出对话框 */}
      <Dialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>自定义导出设置</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            {/* 导出格式 */}
            <FormControl fullWidth>
              <InputLabel>导出格式</InputLabel>
              <Select
                value={exportOptions.format}
                label="导出格式"
                onChange={(e) =>
                  setExportOptions({
                    ...exportOptions,
                    format: e.target.value as ExportOptions['format'],
                  })
                }
              >
                <MenuItem value="pdf">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PdfIcon color="error" />
                    PDF文档
                  </Box>
                </MenuItem>
                <MenuItem value="word">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WordIcon color="info" />
                    Word文档
                  </Box>
                </MenuItem>
                <MenuItem value="html">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HtmlIcon color="success" />
                    HTML网页
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            {/* 页面设置（仅PDF和Word） */}
            {(exportOptions.format === 'pdf' || exportOptions.format === 'word') && (
              <>
                <FormControl fullWidth>
                  <InputLabel>页面大小</InputLabel>
                  <Select
                    value={exportOptions.pageSize}
                    label="页面大小"
                    onChange={(e) =>
                      setExportOptions({
                        ...exportOptions,
                        pageSize: e.target.value as 'A4' | 'Letter',
                      })
                    }
                  >
                    <MenuItem value="A4">A4 (210 × 297 mm)</MenuItem>
                    <MenuItem value="Letter">Letter (8.5 × 11 in)</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>页面方向</InputLabel>
                  <Select
                    value={exportOptions.orientation}
                    label="页面方向"
                    onChange={(e) =>
                      setExportOptions({
                        ...exportOptions,
                        orientation: e.target.value as 'portrait' | 'landscape',
                      })
                    }
                  >
                    <MenuItem value="portrait">纵向</MenuItem>
                    <MenuItem value="landscape">横向</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

            {/* 其他选项 */}
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={exportOptions.includeImages}
                    onChange={(e) =>
                      setExportOptions({
                        ...exportOptions,
                        includeImages: e.target.checked,
                      })
                    }
                  />
                }
                label="包含图片和图表"
              />
              <Typography variant="caption" color="text.secondary" display="block">
                包含报告中的所有图片和图表（可能增加文件大小）
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>
            取消
          </Button>
          <Button
            onClick={handleExportConfirm}
            variant="contained"
            startIcon={getFormatIcon(exportOptions.format)}
          >
            导出{getFormatLabel(exportOptions.format)}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExportControls;
