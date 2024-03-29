/**
 * Button for the pagination
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

import { Tooltip } from '@nextui-org/react';

interface AreaCardListProps {
  tooltip: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  reverse?: boolean;
}

const PaginationButton = ({
  tooltip,
  icon,
  onClick,
  disabled,
  reverse = false,
}: AreaCardListProps) => {
  return (
    <Tooltip content={tooltip} delay={400} closeDelay={0}>
      <button
        className={`btn btn-ghost h-full min-h-0 p-0 px-px text-lg text-neutral-600 *:size-full *:h-5 *:p-px *:duration-100 disabled:bg-transparent disabled:text-neutral-300 ${reverse ? 'active:*:!-translate-x-0.5' : 'active:*:!translate-x-0.5'}`}
        onClick={onClick}
        disabled={disabled}
      >
        {icon}
      </button>
    </Tooltip>
  );
};

export default PaginationButton;
