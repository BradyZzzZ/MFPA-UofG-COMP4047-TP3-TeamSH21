/**
 * Context for the OpenLayers map and its view
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

import Map from 'ol/Map';
import View from 'ol/View';
import { Coordinate } from 'ol/coordinate';

export type MapContextProps = {
  map: Map | null;
  setMap: Dispatch<SetStateAction<Map | null>>;
  view: View | null;
  setView: Dispatch<SetStateAction<View | null>>;
  coords: Coordinate[];
  setCoords: Dispatch<SetStateAction<Coordinate[]>>;
  screenshot: string;
  setScreenshot: Dispatch<SetStateAction<string>>;
};

export const MapContext = createContext<MapContextProps | undefined>(undefined);

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};

type Props = {
  children: ReactNode;
};

export function MapProvider({ children }: Props) {
  const [map, setMap] = useState<Map | null>(null);
  const [view, setView] = useState<View | null>(null);
  const [coords, setCoords] = useState<Coordinate[]>([]);
  const [screenshot, setScreenshot] = useState<string>('');

  return (
    <MapContext.Provider
      value={{
        map,
        setMap,
        view,
        setView,
        coords,
        setCoords,
        screenshot,
        setScreenshot,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}
