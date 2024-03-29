/**
 * Search input field for the area card list
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

import { RefObject, useEffect, useState } from 'react';

import { Input } from '@nextui-org/react';
import { IoSearch } from 'react-icons/io5';

import { AreaCardListRef } from '.';

interface SearchProps {
  areaCardListRef: RefObject<AreaCardListRef>;
}

const Search = ({ areaCardListRef }: SearchProps) => {
  const [search, setSearch] = useState('');

  useEffect(() => {
    areaCardListRef.current?.search(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <Input
      isClearable
      autoFocus
      variant="bordered"
      size="lg"
      radius="sm"
      placeholder="Search for area"
      value={search}
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes('Files')) {
          e.dataTransfer.dropEffect = 'none';
          e.preventDefault();
        }
      }}
      onValueChange={(e) => {
        setSearch(e);
      }}
      onClear={() => setSearch('')}
      startContent={
        <IoSearch className="pointer-events-none flex-shrink-0 text-xl text-default-400" />
      }
      classNames={{
        inputWrapper:
          'bg-white shadow-none data-[hover=true]:border-blue-200 group-data-[focus=true]:border-blue',
        input: 'caret-blue',
      }}
    />
  );
};

export default Search;
