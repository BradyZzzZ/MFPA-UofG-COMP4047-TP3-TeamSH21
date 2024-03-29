/**
 * Display the area image, name, timestamp, and coordinates of the area.
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 *
 * References:
 * https://clubmate.fi/base64-encoded-1px-gifs-black-gray-and-transparent
 */

import { Dispatch, SetStateAction, useRef, useState } from 'react';

import {
  ConfirmationModal,
  ConfirmationModalRef,
  InputModal,
  InputModalRef,
  Notify,
} from '@/components';
import { msg } from '@/constants';
import { formatUnixTimestamp } from '@/utils';
import { Tooltip, Skeleton } from '@nextui-org/react';
import Image from 'next/image';
import { LuPencil, LuTrash2 } from 'react-icons/lu';
import {
  RxCornerBottomLeft,
  RxCornerBottomRight,
  RxCornerTopLeft,
  RxCornerTopRight,
} from 'react-icons/rx';
import { TbTransitionBottom } from 'react-icons/tb';

import { CopyButton } from '.';

interface AreaCardProps {
  id?: number;
  img: string;
  name: string;
  timestamp: number;
  coord: { x: number; y: number }[];
  callback?: () => void;
  onRename?: Dispatch<SetStateAction<string>>;
  onDelete?: () => void;
  onGetSelectedFile?: () => void;
  onClickImage?: () => void;
  showDelete?: boolean;
  selectable?: boolean;
  animation?: string;
}

const AreaCard = ({
  id,
  img,
  name,
  timestamp,
  coord,
  callback: refetch,
  onRename,
  onDelete,
  onGetSelectedFile = () => {},
  onClickImage = () => {},
  showDelete = true,
  selectable = true,
  animation,
}: AreaCardProps) => {
  const [tmpName, setTmpName] = useState(name);

  const confirmationModalRef = useRef<ConfirmationModalRef>(null);
  const inputModalRef = useRef<InputModalRef>(null);

  const corners = [
    RxCornerTopLeft,
    RxCornerTopRight,
    RxCornerBottomRight,
    RxCornerBottomLeft,
  ];

  const handleRename = (newName: string) => {
    inputModalRef.current!.closeModal();
    Notify('success', msg.RENAME_SUCCESS);
    if (name !== newName) window.sqlite.dbArea?.updateArea(id, newName);
    if (refetch) refetch();
  };

  const handleDelete = () => {
    confirmationModalRef.current!.closeModal();
    Notify('success', msg.DELETE_SUCCESS);

    if (!refetch) return;

    window.sqlite.dbArea?.deleteArea(id);
    refetch();
  };

  return (
    <div
      className={`h-fit min-h-0 w-full justify-start rounded-md p-2 text-start ${animation} ${
        selectable &&
        'duration-100 hover:bg-neutral-200/60 hover:shadow focus:outline-blue-300'
      }`}
    >
      <div className="flex gap-x-2">
        <div
          className={`${selectable && 'cursor-pointer duration-150 active:scale-95'}`}
          onClick={onClickImage}
        >
          <Tooltip
            content="Go to results"
            delay={400}
            closeDelay={0}
            isOpen={selectable ? undefined : false}
          >
            <Skeleton isLoaded={img ? true : false} className="rounded">
              <Image
                src={
                  img
                    ? img
                    : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
                }
                alt="Card image"
                width={255}
                height={255}
              />
            </Skeleton>
          </Tooltip>
        </div>
        <div className="-mt-0.5 flex w-full flex-col">
          <Tooltip
            content={name}
            delay={400}
            closeDelay={0}
            offset={5}
            classNames={{
              base: 'max-w-96 max-h-96 overflow-y-auto rounded-xl shadow-small',
              content: 'break-words text-pretty text-center',
            }}
          >
            <h1 className="w-[240px] truncate font-semibold text-textBlack">
              {tmpName}
            </h1>
          </Tooltip>
          <div className="flex items-center">
            <p className="text-sm text-textBlack">
              {formatUnixTimestamp(timestamp)}
            </p>
          </div>
          <div className="flex grow flex-col">
            {coord?.map((c, index) => {
              const CornerIcon = corners[index];
              return (
                <div
                  key={index}
                  className="flex items-center gap-x-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CornerIcon className="stroke-[0.3px] text-lg text-textBlack" />
                  <p className="w-full text-sm/3 text-textBlack">{`${c.x.toFixed(8)} ${c.y.toFixed(8)}`}</p>
                  <CopyButton text={`${c.x.toFixed(8)},${c.y.toFixed(8)}`} />
                </div>
              );
            })}
          </div>
          <div className="flex gap-x-1" onClick={(e) => e.stopPropagation()}>
            <InputModal
              ref={inputModalRef}
              text={
                <>
                  <p>{msg.RENAME_AREA}</p>
                  <p className="my-1 font-semibold">&quot;{tmpName}&quot;</p>
                </>
              }
              confirmText="Rename"
              defaultValue={tmpName}
              placeholder="Enter a new name"
              icon={<LuPencil />}
              setTextInput={
                onRename
                  ? (newName) => {
                      onRename(newName);
                      setTmpName(newName);
                    }
                  : setTmpName
              }
              errorMessage={msg.EMPTY_NAME}
              confirmAction={(newName) => handleRename(newName)}
            />
            <Tooltip content="Rename" delay={400} closeDelay={0}>
              <button
                className="btn btn-ghost h-fit min-h-0 p-0.5"
                onClick={() => {
                  inputModalRef.current?.openModal();
                }}
              >
                <LuPencil className="text-lg text-blue" />
              </button>
            </Tooltip>
            <ConfirmationModal
              ref={confirmationModalRef}
              text={
                <>
                  <p>{msg.DELETE_AREA_CONFIRMATION}</p>
                  <p className="my-1 font-semibold">&quot;{tmpName}&quot;</p>
                  <p>{msg.NO_UNDONE}</p>
                </>
              }
              icon={<LuTrash2 />}
              confirmText="Delete"
              confirmAction={
                onDelete
                  ? () => {
                      handleDelete();
                      onDelete();
                    }
                  : handleDelete
              }
            />
            {showDelete && (
              <Tooltip content="Delete" delay={400} closeDelay={0}>
                <button
                  className="btn btn-ghost h-fit min-h-0 p-0.5"
                  onClick={() => {
                    confirmationModalRef.current?.openModal();
                  }}
                >
                  <LuTrash2 className="text-lg text-blue" />
                </button>
              </Tooltip>
            )}
            <Tooltip
              content="Get Intersecting Files"
              delay={400}
              closeDelay={0}
            >
              <button
                className="btn btn-ghost h-fit min-h-0 p-0.5"
                onClick={onGetSelectedFile}
              >
                <TbTransitionBottom className="text-lg text-blue" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaCard;
