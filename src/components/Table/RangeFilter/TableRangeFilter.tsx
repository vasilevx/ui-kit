import './TableRangeFilter.css';

import React, { useEffect, useMemo, useState } from 'react';

import { cn } from '../../../utils/bem';
import { isDefined } from '../../../utils/type-guards';
import { TextField } from '../../TextField/TextField';
import {
  TableFilterTooltip,
  TableFilterTooltipProps,
  TableFilterTooltipTextProps,
} from '../FilterTooltip/TableFilterTooltip';

const cnRangeFilter = cn('TableRangeFilter');

type Props = TableFilterTooltipProps & {
  onConfirm: (
    field: string,
    value: { min: string | null | undefined; max: string | null | undefined } | undefined,
  ) => void;
  savedValue: { min: null | string | undefined; max: null | string | undefined };
};

export type TableRangeFilterProps = TableFilterTooltipTextProps;

export const TableRangeFilter: React.FC<Props> = ({
  isOpened,
  className,
  onToggle,
  onConfirm,
  confirmButtonLabel,
  resetButtonLabel,
  savedValue,
  title = 'Фильтровать по диапазону значений',
  field,
}) => {
  const [minValue, setMinValue] = useState<string | undefined | null>();
  const [maxValue, setMaxValue] = useState<string | undefined | null>();

  useEffect(() => {
    if (savedValue) {
      setMinValue(savedValue.min);
      setMaxValue(savedValue.max);
    } else {
      setMinValue(undefined);
      setMaxValue(undefined);
    }
  }, [savedValue, isOpened]);

  const isActive = useMemo(
    () => savedValue && (isDefined(savedValue.min) || isDefined(savedValue.max)),
    [savedValue],
  );

  const confirmHandler = () => {
    if (isDefined(minValue) || isDefined(maxValue)) {
      onConfirm(field, {
        min: minValue,
        max: maxValue,
      });
    } else {
      onConfirm(field, undefined);
    }

    onToggle();
  };

  const resetHandler = () => {
    setMinValue(undefined);
    setMaxValue(undefined);
  };

  return (
    <TableFilterTooltip
      field={field}
      isActive={isActive}
      title={title}
      isOpened={isOpened}
      className={className}
      onToggle={onToggle}
      onReset={resetHandler}
      onConfirm={confirmHandler}
      confirmButtonLabel={confirmButtonLabel}
      resetButtonLabel={resetButtonLabel}
    >
      <div className={cnRangeFilter('Inputs')}>
        <TextField
          placeholder="от"
          value={minValue}
          onChange={(e) => setMinValue(e.value)}
          form="defaultBrick"
          size="s"
        />
        <TextField
          placeholder="до"
          value={maxValue}
          onChange={(e) => setMaxValue(e.value)}
          form="clearDefault"
          size="s"
        />
      </div>
    </TableFilterTooltip>
  );
};
