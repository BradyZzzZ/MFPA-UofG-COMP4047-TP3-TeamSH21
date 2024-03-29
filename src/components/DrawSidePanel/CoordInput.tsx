/**
 * Input field for the coordinates in the DrawSidePanel
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

import { Input } from '@nextui-org/react';

interface CoordInputProps {
  value: string;
  onValueChange: (value: string) => void;
  isInvalid: boolean;
}

const CoordInput = ({ value, onValueChange, isInvalid }: CoordInputProps) => {
  return (
    <Input
      variant="bordered"
      size="sm"
      value={value}
      onValueChange={onValueChange}
      isInvalid={isInvalid}
      classNames={{
        inputWrapper:
          'h-4 w-40 rounded-md bg-white shadow-none data-[hover=true]:border-blue-200 group-data-[focus=true]:border-blue',
        input: 'caret-blue',
      }}
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes('Files')) {
          e.dataTransfer.dropEffect = 'none';
          e.preventDefault();
        }
      }}
    />
  );
};

export default CoordInput;
