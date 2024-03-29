/**
 * Display a list of area cards with pagination, search, and sort functionality.
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 *
 * References:
 * https://stackoverflow.com/a/48087482/17302377
 */

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { AreaCard } from '@/components';
import { SidePanelIndex, useMap, useSidePanel } from '@/context';
import { parseCoordinates } from '@/utils';
import {
  PiCaretDoubleLeftBold,
  PiCaretDoubleRightBold,
  PiCaretLeftBold,
  PiCaretRightBold,
} from 'react-icons/pi';
import { TbMapQuestion } from 'react-icons/tb';
import { LuSearchX } from 'react-icons/lu';

import { PaginationButton } from '.';

export interface AreaCardListRef {
  refetch: () => void;
  search: (search: string) => void;
}

type Area = {
  id?: number;
  name: string;
  timestamp?: number;
  coordinates: string;
  image: string;
};

const AreaCardList = forwardRef<AreaCardListRef>((props, ref) => {
  const { setIndex, setResultSidePanelProps } = useSidePanel();
  const { setCoords } = useMap();

  const [areaList, setAreaList] = useState<Area[]>([]);
  const [areaListLength, setAreaListLength] = useState<number>(0);
  const [page, setPage] = useState(
    Number(localStorage.getItem('areaListPage')) || 1
  );
  const [animation, setAnimation] = useState('animate-slide-in-left');
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [screenHeight, setScreenHeight] = useState(screen.height);

  const cardHeight = 180;
  const cardPerPage = Math.floor(screenHeight / cardHeight);
  const maxPage = Math.ceil(areaListLength / cardPerPage);

  const forceUpdate = useRef<number>(0);

  const fetchAreaList = (search: string = '') => {
    const sortOption = JSON.parse(
      localStorage.getItem('sortOption') || 'timestamp_desc'
    ).split('_');

    // If search is empty, fetch all areas. Otherwise, fetch areas that match the search term.
    const searchArgs = [
      sortOption[0],
      sortOption[1],
      cardPerPage * (page - 1),
      cardPerPage,
    ];

    search = search.replace(/\'/g, "''"); // https://stackoverflow.com/a/48087482/17302377
    const data = search
      ? window.sqlite.dbArea?.searchArea(search, ...searchArgs)
      : window.sqlite.dbArea?.readArea(...searchArgs);

    // If search is empty, get the total number of areas. Otherwise, get the total number of areas that match the search term.
    const dataLength = search
      ? window.sqlite.dbArea?.getSearchAreaCount(search)
      : window.sqlite.dbArea?.getAreaCount();

    setAreaList(data);
    setAreaListLength(dataLength);
  };

  const handleSearch = (search: string) => {
    setIsSearching(!!search);
    setAnimation('animate-scale-up-top');
    setSearchTerm(search);
    fetchAreaList(search);
    if (search && page !== 1) setPage(1);
  };

  const getResult = (area: Area, showGetSelectedFileModal: boolean = false) => {
    setResultSidePanelProps({
      areaName: area.name,
      currentUnixTime: area.timestamp,
      img: area.image,
      id: area.id,
      showGetSelectedFileModal: showGetSelectedFileModal,
    });

    const tmp = parseCoordinates(area.coordinates).map((each) => [
      each.x,
      each.y,
    ]);
    tmp.push(tmp[0]);

    setCoords(tmp);
    setIndex(SidePanelIndex.RESULT);
  };

  // Fetch area list when component is mounted and when forceUpdate is incremented
  useLayoutEffect(() => {
    fetchAreaList(searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceUpdate.current, searchTerm, page]);

  // Reset page when area list changes
  useEffect(() => {
    if (!isSearching && areaListLength > 0 && page > maxPage) setPage(maxPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaListLength, page, maxPage]);

  // Save page to local storage
  useEffect(() => {
    localStorage.setItem('areaListPage', page.toString());
  }, [page]);

  // Reset animation when component is mounted and update card per page when screen height changes
  useEffect(() => {
    setAnimation('');

    const handleResize = () => {
      setScreenHeight(screen.height);
      forceUpdate.current += 1; // Increment forceUpdate to trigger re-render
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useImperativeHandle(ref, () => ({
    refetch: () => {
      setAnimation('');
      fetchAreaList(searchTerm);
    },
    search: (search: string) => handleSearch(search),
  }));

  return (
    <>
      <div className="flex gap-x-1">
        <div className="grow truncate text-textBlack">
          Showing {areaListLength > 0 ? cardPerPage * (page - 1) + 1 : 0} -{' '}
          {areaListLength < cardPerPage
            ? areaListLength
            : page !== maxPage
              ? cardPerPage * page
              : areaListLength}{' '}
          of {areaListLength}
        </div>
        <div className="flex gap-x-1">
          <PaginationButton
            tooltip="First page"
            icon={<PiCaretDoubleLeftBold />}
            onClick={() => {
              setPage(1);
              setAnimation('animate-slide-in-left');
            }}
            disabled={page === 1}
            reverse
          />
          <PaginationButton
            tooltip="Previous page"
            icon={<PiCaretLeftBold />}
            onClick={() => {
              setPage((prev) => prev - 1);
              setAnimation('animate-slide-in-left');
            }}
            disabled={page === 1}
            reverse
          />
          <p className="truncate text-center text-textBlack">
            {page}/{maxPage === 0 ? 1 : maxPage}
          </p>
          <PaginationButton
            tooltip="Next page"
            icon={<PiCaretRightBold />}
            onClick={() => {
              setPage((prev) => prev + 1);
              setAnimation('animate-slide-in-right');
            }}
            disabled={page >= maxPage}
          />
          <PaginationButton
            tooltip="Last page"
            icon={<PiCaretDoubleRightBold />}
            onClick={() => {
              setPage(maxPage);
              setAnimation('animate-slide-in-right');
            }}
            disabled={page >= maxPage}
          />
        </div>
      </div>
      <div className="grow overflow-y-auto overflow-x-clip rounded">
        <div className="-mb-[50rem] flex h-full flex-col divide-y will-change-auto">
          {areaListLength > 0 ? (
            areaList.map((area) => (
              <div key={area.id}>
                <AreaCard
                  id={area.id!}
                  name={area.name}
                  timestamp={area.timestamp!}
                  coord={parseCoordinates(area.coordinates)}
                  img={area.image}
                  callback={fetchAreaList}
                  animation={animation}
                  onGetSelectedFile={() => getResult(area, true)}
                  onClickImage={() => getResult(area)}
                />
              </div>
            ))
          ) : (
            <div className="flex h-full animate-fade-in items-center justify-center duration-1000">
              <div className="flex flex-col items-center gap-y-2 *:text-textBlack">
                {isSearching ? (
                  <>
                    <LuSearchX className="text-5xl" />
                    <p>No results found</p>
                  </>
                ) : (
                  <>
                    <TbMapQuestion className="text-5xl" />
                    <p>You have no saved areas</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
});

AreaCardList.displayName = 'AreaCardList';

export default AreaCardList;
