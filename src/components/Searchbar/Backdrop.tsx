/**
 * Backdrop for the searchbar
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

import { MouseEventHandler } from 'react';

interface BackdropProps {
  onClick: MouseEventHandler<HTMLDivElement>;
}

const Backdrop = ({ onClick }: BackdropProps) => {
  return <div className="absolute z-30 h-screen w-screen " onClick={onClick} />;
};

export default Backdrop;
