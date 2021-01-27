import './TableCheckboxGroupFilter.css';

import React, { useMemo, useState } from 'react';

import { IconSearch } from '../../../icons/IconSearch/IconSearch';
import { cn } from '../../../utils/bem';
import { Checkbox } from '../../Checkbox/Checkbox';
import { CheckboxGroup } from '../../CheckboxGroup/CheckboxGroup';
import { TextField } from '../../TextField/TextField';
import {
  TableFilterTooltip,
  TableFilterTooltipProps,
  TableFilterTooltipTextProps,
} from '../FilterTooltip/TableFilterTooltip';

const cnCheckboxGroupFilter = cn('TableCheckboxGroupFilter');

type Item = {
  name: string;
};

type Props = TableFilterTooltipProps & {
  withSearch: boolean;
  items: Item[];
  searchbarPlaceholder?: string;
  allSelectLabel?: string;
  savedValue: null | Item[];
  onConfirm: (field: string, value: Item[] | null) => void;
};

export type TableCheckboxGroupFilterProps = TableFilterTooltipTextProps &
  Pick<Props, 'withSearch' | 'items' | 'searchbarPlaceholder' | 'allSelectLabel'>;

export const TableCheckboxGroupFilter: React.FC<Props> = ({
  isOpened,
  className,
  onToggle,
  onConfirm,
  withSearch,
  items,
  confirmButtonLabel,
  resetButtonLabel,
  savedValue,
  field,
  title,
  searchbarPlaceholder = 'Найти в списке',
  allSelectLabel = 'Выбрать все',
}) => {
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [checkboxGroupValue, setCheckboxGroupValue] = useState<Item[] | null>(items);

  const confirmHandler = () => {
    setSearchValue(null);
    onConfirm(field, checkboxGroupValue === null ? [] : checkboxGroupValue);
    onToggle();
  };

  const resetHandler = () => {
    setSearchValue(null);
    setCheckboxGroupValue(items);
  };

  const filteredItems = useMemo(() => {
    if (!searchValue) {
      return items;
    }

    return items.filter(({ name }) => {
      return name.match(new RegExp(`${searchValue}`, 'i'));
    });
  }, [searchValue, items]);

  const allSelected = useMemo(() => items.length === checkboxGroupValue?.length, [
    items,
    checkboxGroupValue,
  ]);

  return (
    <TableFilterTooltip
      isActive={Boolean(savedValue && savedValue.length === items.length)}
      confirmButtonLabel={confirmButtonLabel}
      resetButtonLabel={resetButtonLabel}
      field={field}
      title={title}
      isOpened={isOpened}
      className={className}
      onToggle={onToggle}
      onReset={resetHandler}
      onConfirm={confirmHandler}
    >
      {withSearch && (
        <TextField
          value={searchValue}
          onChange={({ value }) => setSearchValue(value)}
          leftSide={IconSearch}
          size="s"
          placeholder={searchbarPlaceholder}
          width="full"
          className={cnCheckboxGroupFilter('Searchbar')}
        />
      )}

      <Checkbox
        className={cnCheckboxGroupFilter('AllCheckbox')}
        checked={allSelected}
        label={allSelectLabel}
        onChange={() => {
          setCheckboxGroupValue(allSelected ? null : items);
        }}
      />

      <CheckboxGroup
        className={cnCheckboxGroupFilter('Checkboxes')}
        items={filteredItems}
        value={checkboxGroupValue}
        getLabel={(item) => item.name}
        onChange={({ value }) => {
          setCheckboxGroupValue(value);
        }}
        name={field}
      />
    </TableFilterTooltip>
  );
};
