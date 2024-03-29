/**
 * History page allowing users to view their saved areas and manage
 * layers
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

import { useEffect, useRef } from 'react';

import { BigButton } from '@/components';
import { SidePanelIndex, useSidePanel } from '@/context';
import { Tooltip } from '@nextui-org/react';
import { LuInfo, LuLayers } from 'react-icons/lu';
import { PiSelectionPlusDuotone } from 'react-icons/pi';

import {
  About,
  AboutRef,
  AreaCardList,
  AreaCardListRef,
  Search,
  Sort,
} from '.';

const HistorySidePanel = () => {
  const areaCardListRef = useRef<AreaCardListRef>(null);
  const aboutRef = useRef<AboutRef>(null);

  const { setIndex } = useSidePanel();

  // Set drawing state to 0 (not drawing) if user reloads page while drawing or finishes drawing
  useEffect(() => {
    localStorage.setItem('drawingState', '0');
    localStorage.setItem('drawingState2', '0');
    localStorage.setItem('topLeft', ',');
    localStorage.setItem('botRight', ',');
  }, []);

  return (
    <div
      className="fixed z-40 h-full w-[30rem] p-4 will-change-auto"
      id="history_side_panel"
    >
      <About ref={aboutRef} />
      <div className="flex size-full flex-col gap-y-4 rounded-xl border border-white bg-surface shadow-md backdrop-blur-sm">
        <div>
          <div className="mx-4 my-2">
            <Tooltip content="About" delay={400} closeDelay={0}>
              <button
                className="btn btn-ghost absolute top-0 mt-[7px] h-fit min-h-0 p-1"
                onClick={() => aboutRef.current?.openModal()}
              >
                <LuInfo className="my-auto text-xl text-neutral-600" />
              </button>
            </Tooltip>
            <h1 className="text-center text-lg text-textBlack">My Area</h1>
            <div className="absolute right-4 top-2">
              <Sort areaCardListRef={areaCardListRef} />
            </div>
          </div>
          <div className="h-px w-full bg-gray-200"></div>
        </div>
        <div className="mx-4 flex h-full animate-fade-in flex-col gap-y-2">
          <Search areaCardListRef={areaCardListRef} />
          <AreaCardList ref={areaCardListRef} />
          <div className="grid grid-cols-2 gap-x-4 pb-4">
            <BigButton
              onClick={() => {
                setIndex(SidePanelIndex.MANAGE_LAYERS);
                const layers = localStorage.getItem('layers');
                localStorage.setItem('layersTemp', layers || '{}');
              }}
              color="btn-secondary"
            >
              <>
                <LuLayers className="text-xl" />
                <p>Manage Layers</p>
              </>
            </BigButton>
            <BigButton onClick={() => setIndex(SidePanelIndex.DRAW)}>
              <>
                <PiSelectionPlusDuotone className="text-2xl" />
                <p>New Area</p>
              </>
            </BigButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorySidePanel;
