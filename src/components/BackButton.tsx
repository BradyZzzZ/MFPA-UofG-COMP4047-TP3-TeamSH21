/**
 * Button to go back to the previous page.
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

import { Tooltip } from '@nextui-org/react';
import { FiArrowLeft } from 'react-icons/fi';

interface BackButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const BackButton = ({ onClick, disabled }: BackButtonProps) => {
  return (
    <Tooltip content="Go back" delay={400} closeDelay={0}>
      <button
        className="btn btn-ghost absolute top-0 mt-[7px] h-fit min-h-0 p-0.5 pl-0 disabled:!cursor-not-allowed disabled:bg-transparent disabled:text-neutral-400"
        onClick={onClick}
        disabled={disabled}
      >
        <FiArrowLeft className="my-auto text-2xl" />
      </button>
    </Tooltip>
  );
};

export default BackButton;
