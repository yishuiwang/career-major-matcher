// {{CHENGQI:
// Action: Created
// Timestamp: [2025-01-20 16:20:00 +08:00]
// Reason: 创建高级筛选对话框组件，提供地区、城市、学校层次等筛选功能
// Principle_Applied: SOLID (单一职责原则), KISS (简洁的筛选界面), DRY (复用筛选逻辑)
// Optimization: 响应式设计，支持移动端全屏显示，清晰的筛选分类
// Architectural_Note (AR): 独立的筛选对话框组件，支持多维度筛选条件
// Documentation_Note (DW): FilterDialog组件 - 高级筛选对话框，支持多种筛选条件
// }}

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import type { FilterDialogProps } from '../types';
import { REGIONS, CITIES, SCHOOL_LEVELS } from '../types';

const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onClose,
  filterOptions,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
  getAppliedFiltersCount,
  isMobile,
}) => {
  const handleFilterChange = (type: keyof typeof filterOptions, value: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onFilterChange(type, value, event.target.checked);
  };

  const appliedCount = getAppliedFiltersCount();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      slotProps={{
        paper: {
          sx: {
            borderRadius: isMobile ? 0 : 2,
            maxHeight: '90vh',
            backgroundColor: '#fcfcfc',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
          borderBottom: '1px solid rgba(5, 5, 5, 0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            高级筛选
          </Typography>
          {appliedCount > 0 && (
            <Typography
              variant="caption"
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                px: 1,
                py: 0.25,
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {appliedCount}
            </Typography>
          )}
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* 地区筛选 */}
          <FormControl component="fieldset">
            <FormLabel
              component="legend"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 1.5,
                fontSize: '1rem',
              }}
            >
              地区
            </FormLabel>
            <FormGroup
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
                gap: 1,
              }}
            >
              {REGIONS.map((region) => (
                <FormControlLabel
                  key={region}
                  control={
                    <Checkbox
                      checked={filterOptions.regions.includes(region)}
                      onChange={handleFilterChange('regions', region)}
                      size="small"
                      sx={{
                        '&.Mui-checked': {
                          color: 'primary.main',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                      {region}
                    </Typography>
                  }
                  sx={{
                    margin: 0,
                    '& .MuiFormControlLabel-label': {
                      fontSize: '0.875rem',
                    },
                  }}
                />
              ))}
            </FormGroup>
          </FormControl>

          <Divider sx={{ borderColor: 'rgba(5, 5, 5, 0.1)' }} />

          {/* 城市筛选 */}
          <FormControl component="fieldset">
            <FormLabel
              component="legend"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 1.5,
                fontSize: '1rem',
              }}
            >
              重点城市
            </FormLabel>
            <FormGroup
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' },
                gap: 1,
              }}
            >
              {CITIES.map((city) => (
                <FormControlLabel
                  key={city}
                  control={
                    <Checkbox
                      checked={filterOptions.cities.includes(city)}
                      onChange={handleFilterChange('cities', city)}
                      size="small"
                      sx={{
                        '&.Mui-checked': {
                          color: 'primary.main',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                      {city}
                    </Typography>
                  }
                  sx={{
                    margin: 0,
                    '& .MuiFormControlLabel-label': {
                      fontSize: '0.875rem',
                    },
                  }}
                />
              ))}
            </FormGroup>
          </FormControl>

          <Divider sx={{ borderColor: 'rgba(5, 5, 5, 0.1)' }} />

          {/* 学校层次筛选 */}
          <FormControl component="fieldset">
            <FormLabel
              component="legend"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 1.5,
                fontSize: '1rem',
              }}
            >
              学校层次
            </FormLabel>
            <FormGroup
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 1,
              }}
            >
              {SCHOOL_LEVELS.map((level) => (
                <FormControlLabel
                  key={level}
                  control={
                    <Checkbox
                      checked={filterOptions.schoolLevels.includes(level)}
                      onChange={handleFilterChange('schoolLevels', level)}
                      size="small"
                      sx={{
                        '&.Mui-checked': {
                          color: 'primary.main',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                      {level}
                    </Typography>
                  }
                  sx={{
                    margin: 0,
                    '& .MuiFormControlLabel-label': {
                      fontSize: '0.875rem',
                    },
                  }}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid rgba(5, 5, 5, 0.1)',
          gap: 1,
        }}
      >
        <Button
          onClick={onResetFilters}
          variant="outlined"
          sx={{
            borderRadius: '20px',
            textTransform: 'none',
            fontSize: '0.875rem',
            fontWeight: 500,
            border: '1px solid rgba(5, 5, 5, 0.1)',
            color: '#1d1c1b',
            '&:hover': {
              backgroundColor: 'rgba(5, 5, 5, 0.05)',
              borderColor: 'rgba(5, 5, 5, 0.15)',
            },
          }}
        >
          重置
        </Button>
        <Button
          onClick={onApplyFilters}
          variant="contained"
          sx={{
            borderRadius: '20px',
            textTransform: 'none',
            fontSize: '0.875rem',
            fontWeight: 500,
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          应用筛选 {appliedCount > 0 && `(${appliedCount})`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;
