'use client';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder?: string;
  className?: string;
}

export const FilterSelect = ({ value, onChange, options, placeholder = 'All', className }: FilterSelectProps) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`premium-input h-11 px-4 text-sm bg-white dark:bg-gray-900 cursor-pointer min-w-[140px]${className ? ` ${className}` : ''}`}
  >
    <option value="">{placeholder}</option>
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);
