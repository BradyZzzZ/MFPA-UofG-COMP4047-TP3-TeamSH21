/**
 * Large button component
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

import { MouseEventHandler } from 'react';

interface BigButtonProps {
  children: JSX.Element | string;
  color?: string;
  outline?: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
}

const BigButton = ({
  children,
  color,
  outline,
  onClick,
  className,
  disabled = false,
}: BigButtonProps) => {
  return (
    <button
      className={`btn w-full ${!color ? 'btn-primary disabled:bg-blue-200 disabled:text-white' : color} ${
        outline && 'btn-outline'
      } ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default BigButton;
