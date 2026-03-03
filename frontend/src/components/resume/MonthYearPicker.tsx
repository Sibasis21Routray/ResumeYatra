import React from 'react';

interface MonthYearPickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  endYear?: number;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const currentYear = new Date().getFullYear();
const startYear = currentYear - 74;
const endYear = currentYear;
const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => endYear - i);

export function MonthYearPicker({ value, onChange, placeholder, className, endYear }: MonthYearPickerProps) {
  const [month, year] = value ? value.split(' ') : ['', ''];

  const currentYear = new Date().getFullYear();
  const finalEndYear = endYear || currentYear;
  const startYear = currentYear - 74;
  const years = Array.from({ length: finalEndYear - startYear + 1 }, (_, i) => finalEndYear - i);

  const handleMonthChange = (newMonth: string) => {
    const newValue = newMonth && year ? `${newMonth} ${year}` : newMonth;
    onChange(newValue);
  };

  const handleYearChange = (newYear: string) => {
    const newValue = month && newYear ? `${month} ${newYear}` : newYear;
    onChange(newValue);
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <select
        value={month}
        onChange={(e) => {
          e.stopPropagation();
          handleMonthChange(e.target.value);
        }}
        className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      >
        <option value="">Month</option>
        {months.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
      <select
        value={year}
        onChange={(e) => {
          e.stopPropagation();
          handleYearChange(e.target.value);
        }}
        className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      >
        <option value="">Year</option>
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
}
