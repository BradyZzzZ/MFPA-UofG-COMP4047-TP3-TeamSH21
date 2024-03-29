/**
 * Draw page that allows the user to draw a polygon on the map.
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

import { useEffect, useState } from 'react';

import { BackButton, BigButton } from '@/components';
import { SidePanelIndex, useMap, useSidePanel } from '@/context';
import Draw from 'ol/interaction/Draw.js';
import { Vector as VectorLayer } from 'ol/layer';
import { FiArrowRight } from 'react-icons/fi';

import { DrawByCoords, DrawByMouse } from '.';

export enum drawingState {
  NOT_STARTED,
  DRAWING,
  DONE_BY_MOUSE,
  DONE_BY_COORDS,
}

const DrawSidePanel = () => {
  const [disableDrawByMouse, setDisableDrawByMouse] = useState(false);
  const [disableDrawByCoord, setDisableDrawByCoord] = useState(false);
  const [polygonDrawn, setPolygonDrawn] = useState(false);
  const [drawing, setDrawing] = useState<drawingState>(() => {
    const storedDrawingState = localStorage.getItem('drawingState'); // 0 = not started, 1 = drawing, 2 & 3 = done (only use 0, 2 and 3)

    return storedDrawingState
      ? parseInt(storedDrawingState)
      : drawingState.NOT_STARTED;
  });

  const { map, setScreenshot } = useMap();
  const { setIndex, setResultSidePanelProps } = useSidePanel();

  useEffect(() => {
    localStorage.setItem('drawingState', drawing.toString());

    if (
      drawing === drawingState.DONE_BY_COORDS ||
      drawing === drawingState.DONE_BY_MOUSE
    ) {
      setPolygonDrawn(true);
    }
  }, [drawing]);

  const handleGoBack = () => {
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
    setScreenshot('');
    setIndex(SidePanelIndex.HISTORY);
  };

  const handleContinue = () => {
    setResultSidePanelProps({});
    localStorage.setItem('drawnTime', ((Date.now() / 1000) | 0).toString());
    setIndex(SidePanelIndex.RESULT);
  };

  return (
    <div className="fixed z-40 h-full w-[30rem] p-4" id="draw_side_panel">
      <div className="size-full rounded-xl border border-white bg-surface shadow-md backdrop-blur-sm">
        <div className="flex h-full flex-col justify-between">
          <div className="mx-4 my-2">
            <BackButton onClick={handleGoBack} />
            <h1 className="text-center text-lg text-textBlack">Define Area</h1>
          </div>
          <div className="h-px w-full bg-gray-200"></div>
          <div className="flex h-full animate-fade-in flex-col items-center overflow-y-auto">
            <DrawByMouse
              disableDrawByMouse={disableDrawByMouse}
              setDisableDrawByCoord={setDisableDrawByCoord}
              setPolygonDrawn={setPolygonDrawn}
              drawing={drawing}
              setDrawing={setDrawing}
            />
            <div className="relative flex w-full [&>div]:absolute [&>div]:top-2 [&>div]:h-px [&>div]:w-[47%] [&>div]:bg-gray-200">
              <div></div>
              <p className="mx-auto text-center text-sm">OR</p>
              <div className="right-0"></div>
            </div>
            <DrawByCoords
              setDisableDrawByMouse={setDisableDrawByMouse}
              disableDrawByCoord={disableDrawByCoord}
              setPolygonDrawn={setPolygonDrawn}
              drawing={drawing}
              setDrawing={setDrawing}
            />
            <div className="w-full px-4 pb-4">
              <BigButton onClick={handleContinue} disabled={!polygonDrawn}>
                <>
                  <p>Continue</p>
                  <FiArrowRight className="text-xl" />
                </>
              </BigButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawSidePanel;
