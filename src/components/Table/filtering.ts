import { useState } from 'react';

import { isDefined } from '../../utils/type-guards';

import { RowField, TableRow } from './Table';

export type Filter<T extends TableRow> = {
  id: string;
  field: RowField<T>;
  filterer: (value: any, filterValue: FilterValue) => boolean;
  filterComponent: React.FC<any>;
  filterComponentProps?: any;
};

export type FilterValue = any;

export type Filters<T extends TableRow> = { [key in RowField<T>]?: Filter<T> };

export type SortByProps<T extends TableRow> = {
  sortingBy: keyof T;
  sortOrder: 'asc' | 'desc';
};

export type onSortBy<T extends TableRow> = (props: SortByProps<T> | null) => void;

export type SelectedFilters<T extends TableRow> = {
  [field in RowField<T>]: Filter<T> & { value: FilterValue };
};

export const getSelectedFiltersInitialState = <T extends TableRow>(
  filters?: Filters<T>,
): SelectedFilters<T> => {
  if (!filters) {
    return {} as SelectedFilters<T>;
  }

  return Object.keys(filters).reduce<SelectedFilters<T>>((fieldAcc, fieldCur) => {
    if (!fieldAcc[fieldCur]) {
      return {
        ...fieldAcc,
        [fieldCur]: {
          ...filters[fieldCur],
          value: undefined,
        },
      };
    }

    return fieldAcc;
  }, {} as SelectedFilters<T>);
};

export const fieldFiltersPresent = <T extends TableRow>(
  tableFilters: Filters<T>,
  field: RowField<T>,
): boolean => {
  return Object.keys(tableFilters).includes(field);
};

export const isSomeFilterHasValue = <T extends TableRow>(
  selectedFilters: SelectedFilters<T>,
): boolean => {
  return Object.values(selectedFilters).some(({ value }) => isDefined(value));
};

export const filterTableData = <T extends TableRow>({
  data,
  selectedFilters,
}: {
  data: T[];
  selectedFilters: SelectedFilters<T>;
}): T[] => {
  const mutableFilteredData = [];

  for (const row of data) {
    const columnNames = Object.keys(row);
    let rowIsValid = true;

    for (const columnName of columnNames) {
      const columnFilter = selectedFilters[columnName];

      if (columnFilter && isDefined(columnFilter.value)) {
        let cellIsValid = false;

        const cellContent = row[columnName];

        if (columnFilter.filterer(cellContent, columnFilter.value)) {
          cellIsValid = true;
          break;
        }

        if (!cellIsValid) {
          rowIsValid = false;
        }
      }

      if (!rowIsValid) {
        break;
      }
    }

    if (rowIsValid) {
      mutableFilteredData.push(row);
    }
  }

  return mutableFilteredData;
};

/* istanbul ignore next */
export const useSelectedFilters = <T extends TableRow>(
  filters?: Filters<T>,
  onFiltersUpdated?: (filters: SelectedFilters<T>) => void,
): {
  selectedFilters: SelectedFilters<T>;
  updateFilterValue: (field: RowField<T>, filterValue: FilterValue) => void;
  resetSelectedFilter: (field: RowField<T>) => void;
} => {
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters<T>>(
    getSelectedFiltersInitialState(filters),
  );

  const updateFilterValue = (field: RowField<T>, filterValue: FilterValue): void => {
    const newSelectedFilters = {
      ...selectedFilters,
      [field]: { ...selectedFilters[field], value: filterValue },
    };

    setSelectedFilters(newSelectedFilters);
    onFiltersUpdated && onFiltersUpdated(newSelectedFilters);
  };

  const resetSelectedFilter = (field: RowField<T>) => {
    updateFilterValue(field, undefined);
  };

  return {
    selectedFilters,
    resetSelectedFilter,
    updateFilterValue,
  };
};
