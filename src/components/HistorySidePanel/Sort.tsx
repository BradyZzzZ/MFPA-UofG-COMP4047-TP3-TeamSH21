/**
 * Sort options menu
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

import { RefObject, useEffect, useState } from 'react';

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Selection,
  Tooltip,
} from '@nextui-org/react';
import { BsFilterLeft, BsSortAlphaDown, BsSortAlphaUp } from 'react-icons/bs';
import { TbCalendarDown, TbCalendarUp } from 'react-icons/tb';

import { AreaCardListRef } from '.';

const enum SortOption {
  TIMESTAMP_DESC = 'timestamp_desc', // Sort by date (newest)
  TIMESTAMP_ASC = 'timestamp_asc', // Sort by date (oldest)
  NAME_ASC = 'name_asc', // Sort by name (A-Z)
  NAME_DESC = 'name_desc', // Sort by name (Z-A)
}

interface SortProps {
  areaCardListRef: RefObject<AreaCardListRef>;
}

const Sort = ({ areaCardListRef }: SortProps) => {
  const [sortOption, setSortOption] = useState<SortOption[]>(() => {
    const savedSortOption =
      localStorage.getItem('sortOption') || 'timestamp_desc';
    return savedSortOption
      ? [JSON.parse(savedSortOption)]
      : [SortOption.TIMESTAMP_DESC];
  });
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    if (typeof sortOption === 'string') {
      localStorage.setItem('sortOption', sortOption);
    } else {
      sortOption.forEach((option) => {
        if (option) {
          localStorage.setItem('sortOption', JSON.stringify(option));
          areaCardListRef.current!.refetch();
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOption]);

  return (
    <Dropdown
      classNames={{
        content: 'rounded-md',
      }}
      onClose={() => setIsOpened(false)}
      onOpenChange={(open) => setIsOpened(open)}
    >
      <DropdownTrigger>
        <button
          className="btn btn-ghost absolute right-0 top-0 -mt-[2.5px] h-fit min-h-0 p-0 pt-0.5"
          onClick={() => setIsOpened(true)}
          disabled={isOpened}
        >
          <Tooltip
            content="Sort options"
            delay={400}
            closeDelay={0}
            onOpenChange={(open) => {
              if (!open) setIsOpened(false);
            }}
            classNames={{
              base: 'fixed left-[383px] top-[60.7px]',
            }}
          >
            <BsFilterLeft className="stroke-[0.2] text-3xl text-neutral-600" />
          </Tooltip>
        </button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Sort options"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={sortOption}
        onSelectionChange={(keys: Selection) => {
          setSortOption(keys as unknown as SortOption[]);
        }}
        itemClasses={{
          base: 'rounded-sm hover:!bg-blue hover:!text-white selected:!bg-blue focus:!bg-blue focus:!text-white',
          selectedIcon: 'focus:text-white',
        }}
      >
        <DropdownItem
          key={SortOption.TIMESTAMP_DESC}
          startContent={<TbCalendarDown className="text-xl" />}
        >
          Sort by date (newest)
        </DropdownItem>
        <DropdownItem
          key={SortOption.TIMESTAMP_ASC}
          startContent={<TbCalendarUp className="text-xl" />}
        >
          Sort by date (oldest)
        </DropdownItem>
        <DropdownItem
          key={SortOption.NAME_ASC}
          startContent={<BsSortAlphaDown className="text-xl" />}
        >
          Sort by name (A-Z)
        </DropdownItem>
        <DropdownItem
          key={SortOption.NAME_DESC}
          startContent={<BsSortAlphaUp className="text-xl" />}
        >
          Sort by name (Z-A)
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default Sort;
