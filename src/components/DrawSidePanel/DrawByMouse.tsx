/**
 * Drawing a polygon by hand using the mouse
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 *
 * References:
 * https://openlayers.org/en/latest/examples/draw-shapes.html
 */

import { Dispatch, SetStateAction } from 'react';

import { MapBrowserEvent } from 'ol';

import { BigButton } from '@/components';
import { msg } from '@/constants';
import { useMap, useSidePanel } from '@/context';
import { getScreenshot } from '@/utils';
import Overlay from 'ol/Overlay';
import { easeOut } from 'ol/easing.js';
import { noModifierKeys } from 'ol/events/condition';
import Polygon from 'ol/geom/Polygon';
import Draw, { DrawEvent, createBox } from 'ol/interaction/Draw.js';
import { Vector as VectorLayer } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import { getArea } from 'ol/sphere.js';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { LuTrash2 } from 'react-icons/lu';
import { RxCrossCircled } from 'react-icons/rx';
import { TbDragDrop } from 'react-icons/tb';

import { drawingState } from '.';

interface DrawByMouseProps {
  disableDrawByMouse: boolean;
  setDisableDrawByCoord: Dispatch<SetStateAction<boolean>>;
  setPolygonDrawn: Dispatch<SetStateAction<boolean>>;
  drawing: drawingState;
  setDrawing: Dispatch<SetStateAction<drawingState>>;
}

const DrawByMouse = ({
  disableDrawByMouse,
  setDisableDrawByCoord,
  setPolygonDrawn,
  drawing,
  setDrawing,
}: DrawByMouseProps) => {
  const { map, setCoords, setScreenshot } = useMap();

  const { setHidden } = useSidePanel();

  const source = new VectorSource();
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

  const draw = new Draw({
    source: source,
    type: 'Circle',
    geometryFunction: createBox(),
    condition: noModifierKeys,
    style: new Style({
      fill: new Fill({
        color: 'rgba(4, 18, 149, 0.1)',
      }),
      stroke: new Stroke({
        color: 'rgba(4, 18, 149, 0.5)',
        lineDash: [10, 10],
        width: 2,
      }),
      image: new CircleStyle({
        radius: 5,
        stroke: new Stroke({
          color: 'rgba(4, 18, 149, 0.7)',
        }),
      }),
    }),
  });

  // draw polygon
  const handleDraw = () => {
    if (!map) return;

    // set drawing state to drawing
    setDrawing(drawingState.DRAWING);

    // add interaction and layer
    map.addInteraction(draw);
    map.addLayer(vector);

    // add event listener to cancel draw on ESC key
    function onEscKeyDown(evt: KeyboardEvent) {
      if (evt.key === 'Escape') {
        const state = localStorage.getItem('drawingState') || '0';
        if (parseInt(state) < 2) handleCancelDraw();
        // only cancel draw if user is not done drawing (i.e. state < 2)
      }
    }
    document.addEventListener('keydown', onEscKeyDown);

    const handleDrawEnd = (e: DrawEvent) => {
      // show side panel in case user hid it while drawing
      setHidden(false);

      // set drawing state to done
      localStorage.setItem('drawingState', '2'); // include this because setDrawing not updating if user hides side panel when drawing
      setDrawing(drawingState.DONE_BY_MOUSE);

      // remove interaction and event listener
      map.removeInteraction(draw);
      document.removeEventListener('keydown', onEscKeyDown);

      // zoom to polygon
      const polygon = e.feature.getGeometry() as Polygon;
      const coordinates = polygon.getCoordinates()[0];
      map.getView().fit(polygon, {
        padding: [200, 200, 200, 650],
        duration: 350,
        easing: easeOut,
      });

      map.once('moveend', () => {
        setScreenshot(getScreenshot(map));
      });

      const c = coordinates.reverse();
      const tmp = [c[1], c[2], c[3], c[0], c[4]];

      setCoords(tmp);
      setPolygonDrawn(true);
    };

    // when user finishes drawing
    draw.on('drawend', (e: DrawEvent) => {
      handleDrawEnd(e);
    });

    setDisableDrawByCoord(true);
  };

  // cancel drawing
  const handleCancelDraw = () => {
    if (!map) return;

    // show side panel in case user hid it while drawing
    setHidden(false);

    // set drawing state to not started
    localStorage.setItem('drawingState', '0'); // include this because setDrawing not updating if user hides side panel when drawing
    setDrawing(drawingState.NOT_STARTED);

    // remove interaction
    const interactions = map.getInteractions().getArray();
    const draw = interactions[interactions.length - 1];
    if (draw instanceof Draw) map.removeInteraction(draw);

    setDisableDrawByCoord(false);
    setPolygonDrawn(false);
  };

  // show coordinates and area when mouse hovers over polygon
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

  // clear polygon
  const handleClearPolygon = () => {
    if (!map) return;

    // set drawing state to not started
    localStorage.setItem('drawingState', '0'); // include this because setDrawing not updating if user hides side panel when drawing
    setDrawing(drawingState.NOT_STARTED);

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

    // remove map pointermove event listener
    map.un('pointermove', onPointerMove);

    setDisableDrawByCoord(false);
    setPolygonDrawn(false);
    setScreenshot('');
  };

  // show coordinates and area when mouse hovers over polygon
  map?.on('pointermove', onPointerMove);

  return (
    <div className="h-3/4 w-full p-4">
      <div className="flex h-full flex-col justify-end">
        <h1 className="text-center text-xl text-textBlack">
          {msg.DEFINE_AREA}
        </h1>
        <p className="mb-12 mt-4 whitespace-pre-line text-center text-sm text-textBlack">
          {msg.DEFINE_AREA_DESC}
        </p>
        {drawing === drawingState.NOT_STARTED ? (
          <BigButton onClick={handleDraw} disabled={disableDrawByMouse}>
            <>
              <TbDragDrop className="text-2xl" />
              <p>Draw By Hand</p>
            </>
          </BigButton>
        ) : drawing === drawingState.DONE_BY_COORDS ? (
          <BigButton onClick={handleDraw} disabled>
            <>
              <TbDragDrop className="text-2xl" />
              <p>Draw By Hand</p>
            </>
          </BigButton>
        ) : drawing === drawingState.DRAWING ? (
          <BigButton outline onClick={handleCancelDraw}>
            <>
              <RxCrossCircled className="text-xl" />
              <p>Cancel draw or press</p>
              <p className="-ml-0.5 rounded border-1.5 border-blue px-1 pb-px pt-[0.5px] text-xs">
                esc
              </p>
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
    </div>
  );
};

export default DrawByMouse;
