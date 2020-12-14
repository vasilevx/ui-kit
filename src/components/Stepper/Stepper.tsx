import './Stepper.css';

import React from 'react';

import { useChoiceGroup } from '../../hooks/useChoiceGroup/useChoiceGroup';
import { IconPropSize } from '../../icons/Icon/Icon';
import { cn } from '../../utils/bem';
import { getSizeByMap } from '../../utils/getSizeByMap';
import { PropsWithHTMLAttributesAndRef } from '../../utils/types/PropsWithHTMLAttributes';

import { Step } from './Step/Step';

export const stepperSizes = ['m', 'l'] as const;
export type StepperPropSize = typeof stepperSizes[number];
export const stepperDefaultSize: StepperPropSize = stepperSizes[0];

export type StepperPropGetLabel<ITEM> = (item: ITEM) => string;
export type StepperPropGetCommon<ITEM> = (item: ITEM) => boolean;
export type StepperPropOnChange<ITEM> = (props: {
  e: React.MouseEvent;
  value: ITEM | null;
}) => void;

type Props<ITEM> = {
  size?: StepperPropSize;
  items: ITEM[];
  value: ITEM;
  getLabel: StepperPropGetLabel<ITEM>;
  getDisabled?: StepperPropGetCommon<ITEM>;
  getCompleted?: StepperPropGetCommon<ITEM>;
  getSkipped?: StepperPropGetCommon<ITEM>;
  onChange: StepperPropOnChange<ITEM>;
  className?: string;
};

type Stepper = <ITEM>(
  props: PropsWithHTMLAttributesAndRef<Props<ITEM>, HTMLDivElement>,
) => React.ReactElement | null;

export const cnStepper = cn('Stepper');
const sizeMap: Record<StepperPropSize, IconPropSize> = {
  m: 'xs',
  l: 's',
};

export const Stepper: Stepper = React.forwardRef((props, ref) => {
  const {
    size = stepperDefaultSize,
    items,
    value,
    getLabel,
    getDisabled,
    getCompleted,
    getSkipped,
    onChange,
    className,
    ...otherProps
  } = props;

  const { getOnChange, getChecked } = useChoiceGroup({
    value,
    getKey: getLabel,
    callBack: onChange,
    multiple: false,
  });
  const iconSize = getSizeByMap(sizeMap, size);
  const stepperStyle: React.CSSProperties = {
    gridTemplateColumns: `repeat(${items.length}, minmax(min-content, 1fr))`,
  };

  return (
    <div
      ref={ref}
      className={cnStepper({ size }, [className])}
      style={stepperStyle}
      {...otherProps}
    >
      {items.map((item, index) => (
        <Step
          key={index}
          className={cnStepper('Item')}
          label={getCompleted?.(item) ? getLabel(item) : `${index + 1} ${getLabel(item)}`}
          iconSize={iconSize}
          active={getChecked(item)}
          onChange={getOnChange(item)}
          completed={getCompleted?.(item)}
          skipped={getSkipped?.(item)}
          disabled={getDisabled?.(item)}
        />
      ))}
    </div>
  );
});
