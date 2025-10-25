/**
 * SortControls molecule component
 * @module components/molecules/SortControls
 */

import React from 'react';
import { SortField, SortOrder } from '@/enums/sort';

export interface SortControlsProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSortFieldChange: (field: SortField) => void;
  onSortOrderChange: (order: SortOrder) => void;
}

/**
 * Sort controls component for Pokemon list
 * @param {SortControlsProps} props - Sort controls properties
 * @returns {JSX.Element} Sort controls component
 */
export const SortControls: React.FC<SortControlsProps> = ({
  sortField,
  sortOrder,
  onSortFieldChange,
  onSortOrderChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex items-center gap-2">
        <label htmlFor="sort-field" className="text-sm font-medium text-gray-700">
          Sort by:
        </label>
        <select
          id="sort-field"
          value={sortField}
          onChange={(e) => onSortFieldChange(e.target.value as SortField)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={SortField.NUMBER}>Number</option>
          <option value={SortField.NAME}>Name</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="sort-order" className="text-sm font-medium text-gray-700">
          Order:
        </label>
        <select
          id="sort-order"
          value={sortOrder}
          onChange={(e) => onSortOrderChange(e.target.value as SortOrder)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={SortOrder.ASC}>
            {sortField === SortField.NAME ? 'A-Z' : 'Ascending'}
          </option>
          <option value={SortOrder.DESC}>
            {sortField === SortField.NAME ? 'Z-A' : 'Descending'}
          </option>
        </select>
      </div>
    </div>
  );
};
