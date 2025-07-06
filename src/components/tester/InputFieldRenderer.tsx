
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableColumnDefinition, TableRowData } from '@/types/lims';

interface InputFieldRendererProps {
  column: TableColumnDefinition;
  row: TableRowData;
  onUpdateValue: (value: string) => void;
}

const InputFieldRenderer: React.FC<InputFieldRendererProps> = ({
  column,
  row,
  onUpdateValue,
}) => {
  const value = row.values[column.id] || column.default || '';
  
  switch (column.type) {
    case 'select':
      return (
        <Select
          value={value}
          onValueChange={onUpdateValue}
        >
          <SelectTrigger className="border-0 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {column.options?.map((option: string) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    
    case 'readonly':
      return (
        <div className="text-center h-8 flex items-center justify-center">
          {value}
        </div>
      );
    
    case 'textarea':
      return (
        <Textarea
          className="border-0 text-center min-h-[32px] resize-none"
          placeholder={column.placeholder || ''}
          value={value}
          onChange={(e) => onUpdateValue(e.target.value)}
        />
      );
    
    case 'number':
      return (
        <Input
          type="number"
          className="border-0 text-center h-8"
          placeholder={column.placeholder || ''}
          value={value}
          min={column.validation?.min}
          max={column.validation?.max}
          onChange={(e) => onUpdateValue(e.target.value)}
        />
      );
    
    case 'date':
      return (
        <Input
          type="date"
          className="border-0 text-center h-8"
          value={value}
          onChange={(e) => onUpdateValue(e.target.value)}
        />
      );
    
    default: // text
      return (
        <Input
          className="border-0 text-center h-8"
          placeholder={column.placeholder || ''}
          value={value}
          onChange={(e) => onUpdateValue(e.target.value)}
        />
      );
  }
};

export default InputFieldRenderer;
