import './Step.css';

import React from 'react';

import { IconPropSize } from '../../../icons/Icon/Icon';
import { IconCheck } from '../../../icons/IconCheck/IconCheck';
import { cn } from '../../../utils/bem';

export const cnStep = cn('Step');

type Props = {
  iconSize: IconPropSize;
  label: string;
  active?: boolean;
  disabled?: boolean;
  completed?: boolean;
  skipped?: boolean;
  onChange: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

export const Step = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const {
    iconSize,
    label,
    active = false,
    disabled = false,
    completed = false,
    skipped = false,
    onChange,
    className,
  } = props;

  const clickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    !active && !disabled && onChange?.(e);
  };

  return (
    <button
      ref={ref}
      className={cnStep({ active, disabled, completed, skipped }, [className])}
      type="button"
      title={label}
      onClick={clickHandler}
    >
      {completed && <IconCheck className={cnStep('Icon')} size={iconSize} />}
      {label}
    </button>
  );
});
