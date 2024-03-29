/**
 * File tree with checkboxes for selecting files and directories.
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Checkbox } from '@nextui-org/react';
import { BiVector } from 'react-icons/bi';
import { LuFileText, LuFolderClosed } from 'react-icons/lu';
import { TbDatabase, TbPhoto } from 'react-icons/tb';

export interface File {
  name: string;
  isfile: boolean;
  ischecked: CheckState;
}

export interface Directory {
  filesOrDirs: (File | Directory)[];
  name: string;
  isfile: boolean;
  ischecked: CheckState;
}

export enum CheckState {
  CHECKED = 'checked',
  UNCHECKED = 'unchecked',
  INDETERMINATED = 'indeterminated',
}

const VECTORS = new Set([
  'shp',
  'dbf',
  'shx',
  'geojson',
  'json',
  'gml',
  'kml',
  'kmz',
  'gpx',
  'vct',
  'vdc',
  'tab',
  'dat',
  'id',
  'map',
  'ind',
  'osm',
  'dlg',
  '000',
  'pdf',
]);

const RASTERS = new Set([
  'img',
  'asc',
  'tif',
  'tiff',
  'ovr',
  'rst',
  'rdc',
  'bil',
  'bip',
  'bsq',
  'pix',
  'ecw',
  'jp2',
  'sid',
  'sdw',
  'dem',
  'dt0',
  'dt1',
  'dt2',
  'grb',
  'ntif',
  'sid',
  'j2w',
  'gen',
  'toc',
  'jpg',
]);

const DATABASE = new Set([
  'gdb',
  'mdb',
  'gpkg',
  'mbtiles',
  'vmds',
  'sl3',
  'sqlite',
]);

interface FileTreeProps {
  isSelectedAll: boolean;
  setIsSelectedAll: Dispatch<SetStateAction<boolean>>;
  isDeselectedAll: boolean;
  setIsDeselectedAll: Dispatch<SetStateAction<boolean>>;
  tree: Directory;
  isCheckboxVisible?: boolean;
  selectedFile?: Dispatch<SetStateAction<string[]>>;
}

const FileTree = ({
  isSelectedAll,
  setIsSelectedAll,
  isDeselectedAll,
  setIsDeselectedAll,
  tree,
  isCheckboxVisible = true,
  selectedFile,
}: FileTreeProps) => {
  const [filetree, setFiletree] = useState<Directory>(tree);

  useEffect(() => {
    const tmp = { ...filetree };
    if (isSelectedAll) {
      setFiletree(setAll(tmp, CheckState.CHECKED));
    } else if (isDeselectedAll) {
      setFiletree(setAll(tmp, CheckState.UNCHECKED));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelectedAll, isDeselectedAll]);

  const setAll = useCallback((dir: Directory, isSelected: CheckState) => {
    for (let i = 0; i < dir.filesOrDirs.length; i++) {
      if (dir.filesOrDirs[i].isfile) {
        dir.filesOrDirs[i].ischecked = isSelected;
      } else {
        dir.filesOrDirs[i] = setAll(
          dir.filesOrDirs[i] as Directory,
          isSelected
        );
      }
    }

    dir.ischecked = isSelected;
    return dir;
  }, []);

  const onToggleSelect = useCallback(
    (
      dir: Directory,
      name: string,
      path: string[],
      index: number
    ): Directory => {
      if (index === path.length) {
        // Toggle selection for file or directory
        if (dir.name === name) {
          dir.ischecked =
            dir.ischecked === CheckState.CHECKED
              ? CheckState.UNCHECKED
              : CheckState.CHECKED;
          dir = setAll(dir, dir.ischecked);
        } else {
          const fileIndex = dir.filesOrDirs.findIndex(
            (file) => file.name === name && file.isfile
          );
          const file = dir.filesOrDirs[fileIndex];
          file.ischecked =
            file.ischecked === CheckState.CHECKED
              ? CheckState.UNCHECKED
              : CheckState.CHECKED;

          let checkedCount = 0;
          for (let i = 0; i < dir.filesOrDirs.length; i++) {
            if (dir.filesOrDirs[i].ischecked === CheckState.CHECKED) {
              checkedCount++;
            }
          }

          if (checkedCount === dir.filesOrDirs.length) {
            dir.ischecked = CheckState.CHECKED;
          } else if (checkedCount === 0) {
            dir.ischecked = CheckState.UNCHECKED;
          } else {
            dir.ischecked = CheckState.INDETERMINATED;
          }
        }
        return dir;
      }

      // Toggle selection for nested directory
      const nestedDirIndex = dir.filesOrDirs.findIndex(
        (file) => file.name === path[index] && !file.isfile
      );
      dir.filesOrDirs[nestedDirIndex] = onToggleSelect(
        dir.filesOrDirs[nestedDirIndex] as Directory,
        name,
        path,
        index + 1
      );

      let checkedCount = 0;
      for (let i = 0; i < dir.filesOrDirs.length; i++) {
        if (dir.filesOrDirs[i].ischecked === CheckState.CHECKED) {
          checkedCount++;
        } else if (dir.filesOrDirs[i].ischecked === CheckState.INDETERMINATED) {
          checkedCount += 0.5;
        }
      }

      if (checkedCount === dir.filesOrDirs.length) {
        dir.ischecked = CheckState.CHECKED;
      } else if (checkedCount === 0) {
        dir.ischecked = CheckState.UNCHECKED;
      } else {
        dir.ischecked = CheckState.INDETERMINATED;
      }

      return dir;
    },
    [setAll]
  );

  useEffect(() => {
    const tmp: string[] = [];

    const traverseDir = (dir: Directory, path: string[]) => {
      for (let i = 0; i < dir.filesOrDirs.length; i++) {
        if (dir.filesOrDirs[i].isfile) {
          if (dir.filesOrDirs[i].ischecked === CheckState.CHECKED) {
            tmp.push([...path, dir.filesOrDirs[i].name].join('/'));
          }
        } else {
          traverseDir(dir.filesOrDirs[i] as Directory, [
            ...path,
            dir.filesOrDirs[i].name,
          ]);
        }
      }
    };

    traverseDir(filetree, []);

    if (selectedFile) selectedFile(tmp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filetree]);

  const traverseDir = (dir: Directory, path: string[]) => {
    return (
      <li key={`${dir.name}`}>
        <details open>
          <summary
            className={`flex px-2.5 text-textBlack after:absolute after:left-0 after:ml-1.5 hover:bg-neutral-200 active:!bg-neutral-300 active:!text-textBlack ${
              isCheckboxVisible ? 'pl-9' : 'pl-7'
            }`}
          >
            {isCheckboxVisible && (
              <Checkbox
                radius="none"
                size="sm"
                classNames={{
                  base: 'p-0',
                  wrapper: 'after:bg-blue rounded-sm',
                }}
                isSelected={dir.ischecked === CheckState.CHECKED ? true : false}
                isIndeterminate={
                  dir.ischecked === CheckState.INDETERMINATED ? true : false
                }
                onChange={() => {
                  let tmp = { ...filetree };
                  tmp = onToggleSelect(tmp, dir.name, path, 0);
                  setFiletree(tmp);
                  if (tmp.ischecked === CheckState.CHECKED) {
                    setIsSelectedAll(true);
                  } else {
                    setIsSelectedAll(false);
                  }

                  if (tmp.ischecked === CheckState.UNCHECKED) {
                    setIsDeselectedAll(true);
                  } else {
                    setIsDeselectedAll(false);
                  }
                }}
              />
            )}
            <LuFolderClosed className="-mr-0.5 size-4" />
            <p>{dir.name}</p>
          </summary>
          <ul className="w-full before:-left-1">
            {dir.filesOrDirs?.map((each, index) => {
              return each.isfile ? (
                <li className="ml-5" key={`${index}${each.name}`}>
                  <a
                    className={`flex px-2.5 text-textBlack hover:bg-neutral-200 active:!bg-neutral-300 active:!text-textBlack ${
                      isCheckboxVisible ? 'pl-4' : 'pl-2'
                    }`}
                  >
                    {isCheckboxVisible && (
                      <Checkbox
                        radius="none"
                        size="sm"
                        classNames={{
                          base: 'p-0',
                          wrapper: 'after:bg-blue rounded-sm',
                        }}
                        isSelected={
                          each.ischecked === CheckState.CHECKED ? true : false
                        }
                        isIndeterminate={
                          each.ischecked === CheckState.INDETERMINATED
                            ? true
                            : false
                        }
                        onChange={() => {
                          let tmp = { ...filetree };
                          tmp = onToggleSelect(tmp, each.name, path, 0);
                          setFiletree(tmp);
                          if (tmp.ischecked === CheckState.CHECKED) {
                            setIsSelectedAll(true);
                          } else {
                            setIsSelectedAll(false);
                          }

                          if (tmp.ischecked === CheckState.UNCHECKED) {
                            setIsDeselectedAll(true);
                          } else {
                            setIsDeselectedAll(false);
                          }
                        }}
                      />
                    )}
                    {(() => {
                      const ext =
                        each.name.split('.').pop()?.toLowerCase() || '';
                      return (
                        <>
                          {VECTORS.has(ext) ? (
                            <BiVector className="-mr-0.5 size-4" />
                          ) : RASTERS.has(ext) ? (
                            <TbPhoto className="-mr-0.5 size-4" />
                          ) : DATABASE.has(ext) ? (
                            <TbDatabase className="-mr-0.5 size-4" />
                          ) : (
                            <LuFileText className="-mr-0.5 size-4" />
                          )}
                        </>
                      );
                    })()}
                    <p>{each.name}</p>
                  </a>
                </li>
              ) : (
                traverseDir(each as Directory, [...path, each.name])
              );
            })}
          </ul>
        </details>
      </li>
    );
  };

  return (
    <div className="-mb-[50rem] h-96">
      {/* Bad trick to set layout */}
      <ul className="menu menu-sm">{traverseDir(filetree, [])}</ul>
    </div>
  );
};

export default FileTree;
