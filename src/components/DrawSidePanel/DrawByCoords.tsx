/**
 * Drawing a polygon by entering coordinates
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

import { MapBrowserEvent } from 'ol';

import { BigButton, Notify } from '@/components';
import { coordPattern, msg } from '@/constants';
import { useMap } from '@/context';
import { getScreenshot } from '@/utils';
import { Select, SelectItem } from '@nextui-org/react';
import Feature from 'ol/Feature';
import Overlay from 'ol/Overlay';
import { easeOut } from 'ol/easing';
import Polygon from 'ol/geom/Polygon';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { getArea } from 'ol/sphere';
import { LuTrash2 } from 'react-icons/lu';
import { RiShapeLine } from 'react-icons/ri';
import { RxInput } from 'react-icons/rx';

import { CoordInput, drawingState } from '.';

const coordFmt = [
  {
    value: 'dd',
    label: 'Decimal Degrees (DD)',
  },
  {
    value: 'dms',
    label: 'Degrees, Minutes and Seconds (DMS)',
  },
  {
    value: 'dmm',
    label: 'Degrees and Decimal Minutes (DMM)',
  },
];

interface DrawByCoordsProps {
  disableDrawByCoord: boolean;
  setDisableDrawByMouse: Dispatch<SetStateAction<boolean>>;
  setPolygonDrawn: Dispatch<SetStateAction<boolean>>;
  drawing: drawingState;
  setDrawing: Dispatch<SetStateAction<drawingState>>;
}

const DrawByCoords = ({
  disableDrawByCoord,
  setDisableDrawByMouse,
  setPolygonDrawn,
  drawing,
  setDrawing,
}: DrawByCoordsProps) => {
  const [coordFormat, setCoordFormat] = useState<string>(coordFmt[0].value);
  const [topleft, setTopleft] = useState(() => {
    const tl = localStorage.getItem('topLeft');
    return tl ? tl.split(',') : ['', ''];
  });
  const [botright, setBotright] = useState(() => {
    const tl = localStorage.getItem('botRight');
    return tl ? tl.split(',') : ['', ''];
  });

  const [isInputInvalid, setIsInputInValid] = useState<boolean[]>(
    Array(4).fill(false)
  );

  // Bulk update isInputInvalid
  const updateIsInputInvalid = (index: number, isInvalid: boolean = true) => {
    setIsInputInValid((prev) => {
      const tmp = [...prev];
      tmp[index] = isInvalid;
      return tmp;
    });
  };

  const { map, setCoords, setScreenshot } = useMap();

  const handleDraw = () => {
    if (!map) return;

    setIsInputInValid([false, false, false, false]);

    // Check if inputs are empty
    let tl1 = topleft[1];
    if (!tl1) updateIsInputInvalid(0);
    let tl2 = topleft[0];
    if (!tl2) updateIsInputInvalid(1);
    let br1 = botright[1];
    if (!br1) updateIsInputInvalid(2);
    let br2 = botright[0];
    if (!br2) updateIsInputInvalid(3);
    if (!tl1 || !tl2 || !br1 || !br2) {
      Notify('error', msg.EMPTY_COORDINATES, 'Empty Coordinates');
      return;
    }

    let tl: number[];
    let br: number[];
    if (coordFormat === 'dd') {
      let tl1 = coordPattern.long.isDD.test(topleft[1]);
      if (!tl1) updateIsInputInvalid(0);
      let tl2 = coordPattern.lat.isDD.test(topleft[0]);
      if (!tl2) updateIsInputInvalid(1);
      let br1 = coordPattern.long.isDD.test(botright[1]);
      if (!br1) updateIsInputInvalid(2);
      let br2 = coordPattern.lat.isDD.test(botright[0]);
      if (!br2) updateIsInputInvalid(3);
      if (!tl1 || !tl2 || !br1 || !br2) {
        Notify('error', msg.INVALID_COORDINATES, 'Invalid Coordinates');
        return;
      }
      tl = [parseFloat(topleft[1]), parseFloat(topleft[0])];
      br = [parseFloat(botright[1]), parseFloat(botright[0])];
    } else if (coordFormat === 'dms') {
      let tl1 = coordPattern.long.isDMS.test(topleft[1]);
      if (!tl1) updateIsInputInvalid(0);
      let tl2 = coordPattern.lat.isDMS.test(topleft[0]);
      if (!tl2) updateIsInputInvalid(1);
      let br1 = coordPattern.long.isDMS.test(botright[1]);
      if (!br1) updateIsInputInvalid(2);
      let br2 = coordPattern.lat.isDMS.test(botright[0]);
      if (!br2) updateIsInputInvalid(3);
      if (!tl1 || !tl2 || !br1 || !br2) {
        Notify('error', msg.INVALID_COORDINATES, 'Invalid Coordinates');
        return;
      }

      // 35 30 00N, 051 30 00E
      // Decimal degrees = Degrees + Minutes/60 + Seconds/3600
      let tmp1 = topleft[1].split(' ').map((each) => parseFloat(each));
      let tmp2 = topleft[0].split(' ').map((each) => parseFloat(each));
      tl = [
        tmp1[0] + tmp1[1] / 60.0 + tmp1[2] / 3600.0,
        tmp2[0] + tmp2[1] / 60.0 + tmp2[2] / 3600.0,
      ];

      tmp1 = botright[1].split(' ').map((each) => parseFloat(each));
      tmp2 = botright[0].split(' ').map((each) => parseFloat(each));
      br = [
        tmp1[0] + tmp1[1] / 60.0 + tmp1[2] / 3600.0,
        tmp2[0] + tmp2[1] / 60.0 + tmp2[2] / 3600.0,
      ];
    } else {
      let tl1 = coordPattern.long.isDMM.test(topleft[1]);
      if (!tl1) updateIsInputInvalid(0);
      let tl2 = coordPattern.lat.isDMM.test(topleft[0]);
      if (!tl2) updateIsInputInvalid(1);
      let br1 = coordPattern.long.isDMM.test(botright[1]);
      if (!br1) updateIsInputInvalid(2);
      let br2 = coordPattern.lat.isDMM.test(botright[0]);
      if (!br2) updateIsInputInvalid(3);
      if (!tl1 || !tl2 || !br1 || !br2) {
        Notify('error', msg.INVALID_COORDINATES, 'Invalid Coordinates');
        return;
      }

      // 35 30.0000N, 051 30.0000E
      // DD = Degrees + Decimal minutes / 60
      let tmp1 = topleft[1].split(' ').map((each) => parseFloat(each));
      let tmp2 = topleft[0].split(' ').map((each) => parseFloat(each));
      tl = [tmp1[0] + tmp1[1] / 60.0, tmp2[0] + tmp2[1] / 60.0];
      4;
      tmp1 = botright[1].split(' ').map((each) => parseFloat(each));
      tmp2 = botright[0].split(' ').map((each) => parseFloat(each));
      br = [tmp1[0] + tmp1[1] / 60.0, tmp2[0] + tmp2[1] / 60.0];
    }

    // Inverted coordinates
    if (tl[0] > br[0] || tl[1] < br[1]) {
      setIsInputInValid([true, true, true, true]);
      Notify('error', msg.INVERTED_COORDINATES, 'Inverted Coordinates');
      return;
    }

    localStorage.setItem('topLeft', topleft.toString());
    localStorage.setItem('botRight', botright.toString());

    const tr = [tl[0], br[1]];
    const bl = [br[0], tl[1]];
    const points = [[tl, tr, br, bl, tl]];

    var square = new Polygon(points);
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
    const coordinates = polygon!.getCoordinates()[0];

    map.getView().fit(polygon!, {
      padding: [200, 200, 200, 650],
      duration: 350,
      easing: easeOut,
    });

    map.once('moveend', () => {
      setScreenshot(getScreenshot(map));
    });

    setCoords(coordinates.reverse());
    setDrawing(drawingState.DONE_BY_COORDS);
    localStorage.setItem('drawingState', '3');
    setDisableDrawByMouse(true);
    setPolygonDrawn(true);
  };

  const topleft1 = topleft[1];
  const topleft0 = topleft[0];
  const botright1 = botright[1];
  const botright0 = botright[0];

  useEffect(() => {
    updateIsInputInvalid(0, false);
  }, [topleft1]);

  useEffect(() => {
    updateIsInputInvalid(1, false);
  }, [topleft0]);

  useEffect(() => {
    updateIsInputInvalid(2, false);
  }, [botright1]);

  useEffect(() => {
    updateIsInputInvalid(3, false);
  }, [botright0]);

  const handleClearPolygon = () => {
    if (!map) return;

    // set drawing state to not started
    setDrawing(drawingState.NOT_STARTED);
    localStorage.setItem('drawingState', '0');

    // remove polygon
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

    setDisableDrawByMouse(false);
    setPolygonDrawn(false);
    setScreenshot('');
  };

  const onPointerMove = (e: MapBrowserEvent<UIEvent>) => {
    if (
      !map ||
      (drawing !== drawingState.DONE_BY_COORDS &&
        drawing !== drawingState.DONE_BY_MOUSE)
    )
      return;

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

  return (
    <>
      <div className="size-full p-4">
        <div className="flex flex-col justify-between gap-y-8">
          <Select
            label="Coordinate format"
            placeholder="Select a coordinate format"
            size="sm"
            id="coord-select"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={[coordFormat]}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setCoordFormat(e.target.value)
            }
            classNames={{
              trigger:
                'rounded-md bg-neutral-200 shadow-none duration-200 hover:!bg-neutral-300 data-[open=true]:bg-neutral-300',
              popoverContent: 'rounded-md',
            }}
            listboxProps={{
              itemClasses: {
                base: 'rounded-sm hover:!bg-blue hover:!text-white selected:!bg-blue focus:!bg-blue focus:!text-white',
                selectedIcon: 'focus:text-white',
              },
            }}
          >
            {coordFmt.map((format) => (
              <SelectItem key={format.value} value={format.value}>
                {format.label}
              </SelectItem>
            ))}
          </Select>
          <div className="flex flex-col gap-y-2">
            <div className="flex">
              <div className="flex flex-col items-end gap-y-2 *:mr-1 *:h-full *:text-sm/7 *:text-textBlack">
                <p>Long: </p>
                <p>Lat: </p>
              </div>
              <div className="flex flex-col gap-y-2">
                <CoordInput
                  value={topleft[1]}
                  onValueChange={(e) => {
                    const tmp = [...topleft];
                    tmp[1] = e;
                    setTopleft(tmp);
                  }}
                  isInvalid={isInputInvalid[0]}
                />
                <CoordInput
                  value={topleft[0]}
                  onValueChange={(e) => {
                    const tmp = [...topleft];
                    tmp[0] = e;
                    setTopleft(tmp);
                  }}
                  isInvalid={isInputInvalid[1]}
                />
              </div>
            </div>
            <div className="relative [&>div]:absolute [&>div]:size-6 [&>div]:rounded-full [&>div]:bg-blue">
              <RiShapeLine className="mx-auto text-[100px] text-[#DADADA]" />
              <div className="left-[40%] top-[8%]" />
              <div className="bottom-[9%] right-[40%]" />
            </div>
            <div className="flex justify-end">
              <div className="flex flex-col items-end gap-y-2 *:mr-1 *:h-full *:text-sm/7 *:text-textBlack">
                <p>Long: </p>
                <p>Lat: </p>
              </div>
              <div className="flex flex-col gap-y-2">
                <CoordInput
                  value={botright[1]}
                  onValueChange={(e) => {
                    const tmp = [...botright];
                    tmp[1] = e;
                    setBotright(tmp);
                  }}
                  isInvalid={isInputInvalid[2]}
                />
                <CoordInput
                  value={botright[0]}
                  onValueChange={(e) => {
                    const tmp = [...botright];
                    tmp[0] = e;
                    setBotright(tmp);
                  }}
                  isInvalid={isInputInvalid[3]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full px-4 pb-2">
        {drawing === drawingState.NOT_STARTED ? (
          <BigButton disabled={disableDrawByCoord} onClick={handleDraw}>
            <>
              <RxInput className="text-xl" />
              <p>Draw From Coordinates</p>
            </>
          </BigButton>
        ) : drawing === drawingState.DONE_BY_MOUSE ||
          drawing === drawingState.DRAWING ? (
          <BigButton disabled onClick={handleDraw}>
            <>
              <RxInput className="text-xl" />
              <p>Draw From Coordinates</p>
            </>
          </BigButton>
        ) : (
          <BigButton color="btn-warning" onClick={handleClearPolygon}>
            <>
              <LuTrash2 className="text-xl" />
              <p>Clear Polygon</p>
            </>
          </BigButton>
        )}
      </div>
    </>
  );
};

export default DrawByCoords;
