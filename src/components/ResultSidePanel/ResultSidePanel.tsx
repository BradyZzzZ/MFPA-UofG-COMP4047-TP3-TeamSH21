/**
 * Result page after the user has drawn a polygon on the map.
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 *
 * References:
 * https://openlayers.org/en/latest/apidoc/module-ol_render_Event-RenderEvent.html
 */

import { useEffect, useRef, useState } from 'react';

import { easeInOut } from 'framer-motion';
import { Feature, MapBrowserEvent, Overlay } from 'ol';

import {
  AreaCard,
  BackButton,
  BigButton,
  CheckState,
  ConfirmationModal,
  ConfirmationModalRef,
  FileTree,
  Notify,
} from '@/components';
import { msg } from '@/constants';
import { SidePanelIndex, useMap, useSidePanel } from '@/context';
import {
  formatUnixTimestamp,
  getScreenshot,
  getTotalFilesSize,
  traverseDirectory,
} from '@/utils';
import { Checkbox } from '@nextui-org/react';
import { Polygon } from 'ol/geom';
import Draw from 'ol/interaction/Draw.js';
import { Vector as VectorLayer } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import { getArea } from 'ol/sphere';
import { FiBookmark } from 'react-icons/fi';
import { PiWarning } from 'react-icons/pi';
import { TbTransitionBottom } from 'react-icons/tb';

import { GetSelectedFileModal, GetSelectedFileModalRef } from '.';

export interface ResultSidePanelProps {
  areaName?: string;
  currentUnixTime?: number;
  img?: string;
  id?: number;
  showGetSelectedFileModal?: boolean;
}

const ResultSidePanel = ({
  areaName: an,
  currentUnixTime: cut,
  img: i,
  id,
  showGetSelectedFileModal = false,
}: ResultSidePanelProps) => {
  const [isSelectedAll, setIsSelectedAll] = useState(true);
  const [isDeselectedAll, setIsDeselectedAll] = useState(false);
  const [areaName, setAreaName] = useState(
    an === undefined
      ? 'Area ' + formatUnixTimestamp(Number(localStorage.getItem('drawnTime')))
      : an
  );
  const [currentUnixTime, setCurrentUnixTime] = useState(
    cut === undefined ? Number(localStorage.getItem('drawnTime')) : cut
  );
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [totalFileSize, setTotalFileSize] = useState('Calculating...');
  const [allFiles, setAllFiles] = useState(0);
  const confirmationModalRef = useRef<ConfirmationModalRef>(null);
  const getSelectedFileModalRef = useRef<GetSelectedFileModalRef>(null);

  const { coords, map, screenshot, setScreenshot } = useMap();
  const { setIndex } = useSidePanel();

  const [img, setImg] = useState(!i ? screenshot : i);

  if (map && !i && !screenshot) {
    map.once('moveend', () => {
      map.once('rendercomplete', () => {
        setImg(getScreenshot(map));
      });
    });
  }

  let tmp = selectedFiles.length;
  if (selectedFiles.length > allFiles) {
    setAllFiles(tmp);
  }

  const buildDirectoryTree = (input: string[]) => {
    const files = Array.from(input);

    // Build the directory tree.
    const tree = {
      name: '~/',
      isfile: false,
      ischecked: CheckState.UNCHECKED,
      filesOrDirs: [],
    };

    const pathSplitter =
      window.navigator.userAgent.indexOf('Windows') !== -1 ? '\\' : '/';
    for (let i = 0; i < files.length; i++) {
      // Split the path into an array of directories
      /*@ts-ignore*/
      const path = files[i].path.split(pathSplitter);

      // Traverse the directory tree
      traverseDirectory(path, tree);
    }

    return tree;
  };

  const getBoundaries = () => {
    const tmp = [...coords];
    const left = tmp[0][0];
    const right = tmp[1][0];
    const top = tmp[0][1];
    const bottom = tmp[2][1];

    const res = window.sqlite.getBoundaries(right, left, bottom, top);

    return buildDirectoryTree(res);
  };

  useEffect(() => {
    if (map && id !== undefined && map.getLayers().getArray().length === 1) {
      var square = new Polygon([coords]);
      var feature = new Feature(square);

      const source = new VectorSource({
        features: [feature],
      });

      const vector = new VectorLayer({
        source: source,
        style: {
          'fill-color': 'rgba(4, 18, 149, 0.1)',
          'stroke-color': '#041295',
          'stroke-width': 2,
          'circle-radius': 2,
          'circle-fill-color': '#041295',
        },
      });

      map.addLayer(vector);

      const polygon = feature.getGeometry();

      map.getView().fit(polygon!, {
        padding: [200, 200, 200, 650],
        duration: 350,
        easing: easeInOut,
      });

      if (showGetSelectedFileModal) {
        getSelectedFileModalRef.current?.openModal();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const runGetTotalFileSize = async () => {
      const size = await window.pyshell.runGetFileSize(
        JSON.stringify(selectedFiles)
      );
      setTotalFileSize(getTotalFilesSize(Number(size)));
    };

    const timeoutId = setTimeout(runGetTotalFileSize, 350);
    return () => clearTimeout(timeoutId);
  }, [selectedFiles]);

  const handleClearPolygon = () => {
    if (map) {
      const layers = map.getLayers().getArray();
      const vector = layers[layers.length - 1];
      if (vector instanceof VectorLayer) {
        map.removeLayer(vector);
      }

      // remove overlays
      for (let i = 1; i <= 4; i++) {
        const overlay = map.getOverlayById('info-' + i);
        if (overlay) {
          map.removeOverlay(overlay);
        }
      }
      const centerOverlay = map.getOverlayById('center-info');
      if (centerOverlay) {
        map.removeOverlay(centerOverlay);
      }
    }
  };

  const onPointerMove = (e: MapBrowserEvent<UIEvent>) => {
    if (!map) return;

    // get polygon
    const layers = map.getLayers().getArray();
    const vector = layers[layers.length - 1];
    if (!(vector instanceof VectorLayer)) return;

    // get features
    const source = vector.getSource();
    const features = source.getFeatures();
    if (features.length === 0) return;

    // get coordinates of polygon
    const polygon = features[0].getGeometry() as Polygon;

    // if mouse is inside polygon, show coordinates and area
    if (polygon.intersectsCoordinate(e.coordinate)) {
      // coordinates at each corner
      for (let i = 1; i <= 4; i++) {
        if (map.getOverlayById('info-' + i)) return; // if overlay already exists, don't create another one

        const info = document.createElement('p');
        const tmp = polygon.getCoordinates()[0][i];

        info.innerHTML = `(${tmp[0].toFixed(8)},${tmp[1].toFixed(8)})`;
        const overlay = new Overlay({
          element: info,
          position: polygon.getCoordinates()[0][i],
          positioning: 'top-center',
          id: 'info-' + i,
          className:
            'pointer-events-none fixed top-0.5 z-50 whitespace-nowrap text-sm font-bold text-blue backdrop-blur-[2px]',
        });
        map.addOverlay(overlay);
      }

      // area at center
      if (map.getOverlayById('center-info')) return; // if overlay already exists, don't create another one

      const centerInfo = document.createElement('p');
      centerInfo.innerHTML = `${getArea(polygon, { projection: 'EPSG:4326' })
        .toString()
        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')} sqm`;
      const centerOverlay = new Overlay({
        element: centerInfo,
        position: polygon.getInteriorPoint().getCoordinates(),
        id: 'center-info',
        className:
          'fixed -left-[88px] z-50 select-text whitespace-nowrap text-sm font-bold text-blue backdrop-blur-[2px]',
      });
      map.addOverlay(centerOverlay);
    } else {
      // if mouse is outside polygon, remove overlays
      for (let i = 1; i <= 4; i++) {
        const overlay = map.getOverlayById('info-' + i);
        if (overlay) {
          map.removeOverlay(overlay);
        }
      }
      const centerOverlay = map.getOverlayById('center-info');
      if (centerOverlay) {
        map.removeOverlay(centerOverlay);
      }
    }
  };

  map?.on('pointermove', onPointerMove);

  const handleCreate = () => {
    if (id !== undefined) {
      window.sqlite.dbArea?.updateArea(id, areaName);
    } else {
      let str = '[';
      for (let coord of coords.filter(
        (_, index) => index !== coords.length - 1
      )) {
        str += '[';
        str += coord[0].toFixed(8) + ',' + coord[1].toFixed(8);
        str += '],';
      }

      str = str.slice(0, -1);
      str += ']';

      window.sqlite.dbArea?.createArea(areaName, currentUnixTime, str, img);
    }

    setIndex(SidePanelIndex.HISTORY);
    setScreenshot('');

    if (!map) return;

    // remove interaction
    const interactions = map.getInteractions().getArray();
    const draw = interactions[interactions.length - 1];
    if (draw instanceof Draw) map.removeInteraction(draw);

    // remove polygon
    const layers = map.getLayers().getArray();
    const vector = layers[layers.length - 1];
    if (vector instanceof VectorLayer) map.removeLayer(vector);

    // remove overlays
    for (let i = 1; i <= 4; i++) {
      const overlay = map.getOverlayById('info-' + i);
      if (overlay) {
        map.removeOverlay(overlay);
      }
    }
    const centerOverlay = map.getOverlayById('center-info');
    if (centerOverlay) {
      map.removeOverlay(centerOverlay);
    }

    Notify('success', msg.SAVE_AREA_SUCCESS);
  };

  const handleGetSelectedFile = () => {
    if (selectedFiles.length === 0) {
      Notify('error', msg.NO_FILE_SELECTED, 'No File Selected');
      return;
    }
    getSelectedFileModalRef.current?.openModal();
  };

  return (
    <div className="fixed z-40 h-full w-[30rem] p-4" id="result_side_panel">
      <a id="image-download" download="map.png"></a>
      <ConfirmationModal
        ref={confirmationModalRef}
        text={msg.UNSAVED_AREA}
        icon={<PiWarning />}
        confirmText="Leave"
        confirmAction={() => setIndex(SidePanelIndex.DRAW)}
      />
      <GetSelectedFileModal
        ref={getSelectedFileModalRef}
        selectedFiles={selectedFiles}
      />
      <div className="size-full rounded-xl border border-white bg-surface shadow-md backdrop-blur-sm">
        <div className="flex h-full flex-col justify-between">
          <div className="h-auto">
            <div className="mx-4 my-2">
              <BackButton
                onClick={() => {
                  if (id === undefined) {
                    confirmationModalRef.current?.openModal();
                  } else {
                    setIndex(SidePanelIndex.HISTORY);
                    handleClearPolygon();
                  }
                }}
              />
              <h1 className="text-center text-lg text-textBlack">Results</h1>
            </div>
            <div className="h-px w-full bg-gray-200"></div>
          </div>
          <div className="flex h-full animate-fade-in flex-col justify-start gap-y-2 p-4">
            <div className="h-fit">
              <AreaCard
                id={id}
                img={img}
                name={areaName}
                timestamp={currentUnixTime}
                coord={coords
                  .map(([x, y]) => {
                    return { x: +x.toFixed(8), y: +y.toFixed(8) };
                  })
                  .filter((_, index) => index < 4)}
                showDelete={id === undefined ? false : true}
                selectable={false}
                onDelete={() => {
                  if (id !== undefined) window.sqlite.dbArea?.deleteArea(id);
                  setIndex(SidePanelIndex.HISTORY);
                  handleClearPolygon();
                }}
                onRename={setAreaName}
                onGetSelectedFile={handleGetSelectedFile}
              />
            </div>
            <div className="flex pt-2">
              <div className="flex grow gap-x-2">
                <button
                  className="btn btn-outline btn-primary h-9 min-h-0 place-content-center p-2 disabled:opacity-40"
                  onClick={() => {
                    if (!isSelectedAll && isDeselectedAll)
                      setIsDeselectedAll((prev) => !prev);
                    setIsSelectedAll((prev) => !prev);
                  }}
                  disabled={isSelectedAll}
                >
                  <Checkbox
                    radius="none"
                    size="sm"
                    className="pr-0"
                    classNames={{
                      wrapper: 'after:bg-blue rounded-sm',
                    }}
                    isSelected={isSelectedAll}
                    onChange={() => {
                      if (!isSelectedAll && isDeselectedAll) {
                        setIsDeselectedAll((prev) => !prev);
                      }
                      setIsSelectedAll((prev) => !prev);
                    }}
                  />
                  Select All
                </button>
                <button
                  className="btn btn-outline btn-primary h-9 min-h-0 place-content-center p-2 disabled:opacity-40"
                  onClick={() => {
                    if (!isDeselectedAll && isSelectedAll)
                      setIsSelectedAll((prev) => !prev);
                    setIsDeselectedAll((prev) => !prev);
                  }}
                  disabled={isDeselectedAll}
                >
                  <Checkbox
                    radius="none"
                    size="sm"
                    className="pr-0"
                    classNames={{
                      wrapper: 'after:bg-blue rounded-sm',
                    }}
                    isSelected={isDeselectedAll}
                    onChange={() => {
                      if (!isDeselectedAll && isSelectedAll) {
                        setIsSelectedAll((prev) => !prev);
                      }
                      setIsDeselectedAll((prev) => !prev);
                    }}
                  />
                  Deselect All
                </button>
              </div>
            </div>
            <div className="grow overflow-y-auto rounded">
              <FileTree
                isSelectedAll={isSelectedAll}
                setIsSelectedAll={setIsSelectedAll}
                isDeselectedAll={isDeselectedAll}
                setIsDeselectedAll={setIsDeselectedAll}
                tree={getBoundaries()}
                selectedFile={setSelectedFiles}
              />
            </div>
            <div className="flex-col justify-between">
              <p className="text-sm leading-4">
                Total files: {allFiles} ({selectedFiles.length} selected)
              </p>
              <p className="mb-2 text-sm leading-4">Size: {totalFileSize}</p>
              <div
                className={`grid gap-x-4 ${id === undefined ? 'grid-cols-2' : 'grid-cols-1'}`}
              >
                <BigButton
                  onClick={handleGetSelectedFile}
                  color="btn-secondary"
                >
                  <>
                    <TbTransitionBottom className="text-xl" />
                    <p>Get Selected Files</p>
                  </>
                </BigButton>
                {id === undefined && (
                  <BigButton onClick={handleCreate}>
                    <>
                      <FiBookmark className="text-xl" />
                      <p>Save</p>
                    </>
                  </BigButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultSidePanel;
