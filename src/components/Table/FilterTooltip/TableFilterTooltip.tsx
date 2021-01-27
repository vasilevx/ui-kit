import './TableFilterTooltip.css';

import React from 'react';

import { IconFunnel } from '../../../icons/IconFunnel/IconFunnel';
import { cn } from '../../../utils/bem';
import { Button } from '../../Button/Button';
import { Popover } from '../../Popover/Popover';
import { Text } from '../../Text/Text';

const cnTableFilterTooltip = cn('TableFilterTooltip');

export type TableFilterTooltipProps = {
  onToggle: () => void;
  onConfirm: () => void;
  onReset: () => void;
  isOpened: boolean;
  isActive?: boolean;
  title?: string;
  confirmButtonLabel?: string;
  resetButtonLabel?: string;
  className?: string;
  field: string;
};

export type TableFilterTooltipTextProps = Pick<
  TableFilterTooltipProps,
  'title' | 'confirmButtonLabel' | 'resetButtonLabel'
>;

export const TableFilterTooltip: React.FC<TableFilterTooltipProps> = ({
  isOpened,
  isActive,
  className,
  title,
  onToggle,
  onReset,
  onConfirm,
  children,
  confirmButtonLabel = 'Применить',
  resetButtonLabel = 'Сбросить фильтр',
}) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button
        ref={buttonRef}
        size="xs"
        iconSize="s"
        view="clear"
        onlyIcon
        onClick={onToggle}
        className={cnTableFilterTooltip('Button', { isOpened, isActive }, [className])}
        iconLeft={IconFunnel}
      />
      {isOpened && buttonRef.current && (
        <Popover
          anchorRef={buttonRef}
          possibleDirections={['downRight', 'downLeft']}
          direction="downCenter"
          offset={4}
          arrowOffset={12}
          onClickOutside={onToggle}
        >
          <div className={cnTableFilterTooltip('Content')}>
            {title && (
              <Text
                view="primary"
                size="m"
                className={cnTableFilterTooltip('Title')}
                lineHeight="l"
              >
                {title}
              </Text>
            )}
            {children}
            <div className={cnTableFilterTooltip('ConfirmButtons')}>
              <Button label={resetButtonLabel} size="s" view="ghost" onClick={onReset} />
              <Button label={confirmButtonLabel} size="s" view="primary" onClick={onConfirm} />
            </div>
          </div>
        </Popover>
      )}
    </>
  );
};
