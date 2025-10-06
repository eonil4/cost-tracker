import React from 'react';
import { Box, Typography, Button, ButtonGroup } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import 'dayjs/locale/en';

// Extend dayjs with week plugin
dayjs.extend(weekOfYear);

interface TimePeriodSelectorProps {
  title: string;
  currentValue: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
  pickerType: 'week' | 'month' | 'year';
}

const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({
  title,
  currentValue,
  onSelect,
  disabled = false,
  pickerType
}) => {
  const currentDate = dayjs(currentValue);

  const handleDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      onSelect(newValue.toISOString());
    }
  };

  const handleTodayClick = () => {
    onSelect(dayjs().toISOString());
  };

  const handleCurrentMonthClick = () => {
    onSelect(dayjs().startOf('month').toISOString());
  };

  const handleCurrentYearClick = () => {
    onSelect(dayjs().startOf('year').toISOString());
  };

  const renderPicker = () => {
    switch (pickerType) {
      case 'week':
        return (
          <DatePicker
            value={currentDate}
            onChange={handleDateChange}
            disabled={disabled}
            views={['year', 'month', 'day']}
            format="YYYY-MM-DD"
            slotProps={{
              textField: {
                size: 'small',
                fullWidth: true,
                variant: 'outlined'
              }
            }}
          />
        );
      case 'month':
        return (
          <DatePicker
            value={currentDate}
            onChange={handleDateChange}
            disabled={disabled}
            views={['month', 'year']}
            format="YYYY-MM"
            slotProps={{
              textField: {
                size: 'small',
                fullWidth: true,
                variant: 'outlined'
              }
            }}
          />
        );
      case 'year':
        return (
          <DatePicker
            value={currentDate}
            onChange={handleDateChange}
            disabled={disabled}
            views={['year']}
            format="YYYY"
            slotProps={{
              textField: {
                size: 'small',
                fullWidth: true,
                variant: 'outlined'
              }
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" align="center" gutterBottom>
        {title}
      </Typography>
      
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
        <Box sx={{ mb: 2 }}>
          {renderPicker()}
        </Box>
      </LocalizationProvider>

      {/* Quick navigation buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
        <ButtonGroup size="small" variant="outlined">
          {pickerType === 'week' && (
            <Button onClick={handleTodayClick} disabled={disabled}>
              Today
            </Button>
          )}
          {pickerType === 'month' && (
            <Button onClick={handleCurrentMonthClick} disabled={disabled}>
              Current Month
            </Button>
          )}
          {pickerType === 'year' && (
            <Button onClick={handleCurrentYearClick} disabled={disabled}>
              Current Year
            </Button>
          )}
        </ButtonGroup>
      </Box>

    </Box>
  );
};

export default TimePeriodSelector;
