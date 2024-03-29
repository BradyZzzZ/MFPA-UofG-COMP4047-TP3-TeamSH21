/**
 * Main page of the application
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

import { useEffect, useState } from 'react';

import { Toaster } from 'react-hot-toast';

import { Notify, OLMap, Searchbar, SidePanel } from '@/components';
import { msg } from '@/constants';
import { MapProvider, useSidePanel } from '@/context';
import { Tooltip } from '@nextui-org/react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { RxCross1 } from 'react-icons/rx';

const Index = () => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  const { hidden, setHidden } = useSidePanel();

  useEffect(() => {
    setIsSidePanelOpen(true);
    (async () => {
      try {
        await window.pyshell.runUpdateDatabase();
        // Notify('success', 'Successfully Updated Database');
      } catch (err) {
        Notify('error', (err as Error).message, 'Failed To Update Database');
      }
    })();
  }, []);

  useEffect(() => {
    if (
      typeof window.sqlite === 'undefined' ||
      typeof window.pyshell === 'undefined'
    ) {
      setIsSupported(false);
      return;
    }

    // Save page to local storage
    localStorage.setItem('areaListPage', '1');
    localStorage.setItem('sortOption', JSON.stringify('timestamp_desc'));
    localStorage.setItem('destPath', '');
  }, []);

  return isSupported ? (
    <MapProvider>
      <Toaster />
      <Searchbar sidepanelHidden={hidden} />
      <div className="fixed z-40 h-full">
        <Tooltip
          content={hidden ? 'Open side panel' : 'Close side panel'}
          delay={400}
          closeDelay={0}
          placement="right"
        >
          <button
            className={`btn btn-square btn-primary absolute bottom-4 shadow-md *:text-2xl ${hidden ? 'left-4' : 'left-[30rem]'}`}
            onClick={() => setHidden((prev) => !prev)}
          >
            {hidden ? <FiArrowRight /> : <FiArrowLeft />}
          </button>
        </Tooltip>
      </div>
      <div
        className={`fixed z-40 h-full will-change-auto ${!hidden ? 'animate-show-side-panel' : 'animate-hide-side-panel'} `}
      >
        {isSidePanelOpen && <SidePanel />}
      </div>
      <OLMap />
    </MapProvider>
  ) : (
    <div className="flex h-screen flex-col items-center justify-center">
      <RxCross1 className="text-7xl text-warning" />
      <p className="whitespace-pre-line text-pretty text-center text-xl">
        {msg.UNSUPPORTED}
      </p>
    </div>
  );
};

export default Index;
