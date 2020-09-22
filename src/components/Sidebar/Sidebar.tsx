import './Sidebar.css';

import React, { useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';

import { useClickOutside } from '../../hooks/useClickOutside/useClickOutside';
import { cn } from '../../utils/bem';
import { cnForCssTransition } from '../../utils/cnForCssTransition';
import { PortalWithTheme } from '../PortalWithTheme/PortalWithTheme';
import { useTheme } from '../Theme/Theme';

type DivProps = JSX.IntrinsicElements['div'];

const sidebarPropPosition = ['right', 'left'] as const;
type SidebarPropPosition = typeof sidebarPropPosition[number];
const sidebarPropPositionDefault: SidebarPropPosition = sidebarPropPosition[0];

const sidebarPropWidth = ['auto'] as const;
type SidebarPropWidth = typeof sidebarPropWidth[number];
const sidebarPropWidthDefault: SidebarPropWidth = sidebarPropWidth[0];

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  hasOverlay?: boolean;
  onOverlayClick?: (event: MouseEvent) => void;
  position?: SidebarPropPosition;
  width?: SidebarPropWidth;
  className?: string;
  children?: React.ReactNode;
  container?: HTMLDivElement | undefined;
};

type SidebarContentProps = {
  className?: string;
  children: React.ReactNode;
};

type SidebarActionsProps = {
  className?: string;
  children: React.ReactNode;
};

const cnSidebar = cn('Sidebar');

const SidebarContent: React.FC<SidebarContentProps> = ({ className, children, ...rest }) => (
  <div className={cnSidebar('Content', null, [className])} {...rest}>
    {children}
  </div>
);

const SidebarActions: React.FC<SidebarActionsProps> = ({ className, children, ...rest }) => (
  <div className={cnSidebar('Actions', null, [className])} {...rest}>
    {children}
  </div>
);

interface SidebarComponent extends React.FC<SidebarProps>, DivProps {
  Content: typeof SidebarContent;
  Actions: typeof SidebarActions;
}

export const Sidebar: SidebarComponent = (props) => {
  const {
    isOpen,
    onClose,
    onOpen,
    hasOverlay = true,
    onOverlayClick,
    position = sidebarPropPositionDefault,
    width = sidebarPropWidthDefault,
    className,
    children,
    container = window.document.body,
    ...rest
  } = props;
  const ref = React.useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();

  useClickOutside({
    isActive: !!onOverlayClick,
    ignoreClicksInsideRefs: [ref],
    handler: (event: MouseEvent) => onOverlayClick?.(event),
  });

  useEffect(() => {
    if (isOpen) {
      onOpen?.();
    } else {
      onClose?.();
    }
  }, [isOpen]);

  return (
    <CSSTransition
      in={isOpen}
      unmountOnExit
      classNames={cnForCssTransition(cnSidebar)}
      timeout={200}
    >
      <PortalWithTheme preset={theme} container={container}>
        {hasOverlay && <div className={cnSidebar('Overlay')} aria-label="Оверлэй" />}
        <div className={cnSidebar('Window', { width, position }, [className])} ref={ref} {...rest}>
          {children}
        </div>
      </PortalWithTheme>
    </CSSTransition>
  );
};

Sidebar.Content = SidebarContent;
Sidebar.Actions = SidebarActions;
