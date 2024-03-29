/**
 * Render OpenLayers map and zoom to UK
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 *
 * References:
 * https://gis.stackexchange.com/q/444829
 * https://codesandbox.io/s/openlayers-react-ts-jlejq4?file=/src/map.ts
 * https://github.com/openlayers/openlayers
 * https://www.bricks-platform.com/BlogPost/OpenLayers%20and%20React%20-%20Interact%20with%20the%20map
 * https://openlayers.org/en/latest/examples/load-events.html
 */

import { useEffect, useState } from 'react';

import { dbCountries } from '@/constants';
import { useMap } from '@/context';
import { Spinner } from '@nextui-org/react';
import Map from 'ol/Map';
import View from 'ol/View';
import {
  Attribution,
  FullScreen,
  MousePosition,
  Rotate,
  ScaleLine,
  Zoom,
} from 'ol/control';
import { inAndOut } from 'ol/easing';
import {
  DragRotateAndZoom,
  defaults as defaultInteractions,
} from 'ol/interaction';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';

import 'ol/ol.css';

const OLMap = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const { map, setMap, setView } = useMap();

  useEffect(() => {
    if (map) return; // prevent reinitialization of map

    const initialView = new View({
      projection: 'EPSG:4326',
      center: fromLonLat([0, 0], 'EPSG:4326'),
      extent: [-180, -90, 180, 90],
      zoom: 2,
      maxZoom: 20,
    });

    const initialMap = new Map({
      target: 'map',
      controls: [
        new Zoom(),
        new ScaleLine(),
        new FullScreen(),
        new MousePosition(),
        new Rotate(),
        new Attribution({
          collapsed: false,
          collapsible: false,
        }),
      ],
      interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
      view: initialView,
      layers: [
        new TileLayer({
          preload: Infinity,
          source: new OSM({
            maxZoom: 20,
          }),
        }),
      ],
    });

    setMap(initialMap);
    setView(initialView);
  }, [map, setMap, setView]);

  useEffect(() => {
    if (!map) return;

    map.once('loadend', () => {
      setIsMapLoaded(true);
    });

    // Zoom to UK
    map.getView().fit(
      dbCountries.find((country) => country.name === 'United Kingdom')?.bbox ||
        [],
      {
        padding: [100, 100, 100, 100],
        duration: 1250,
        easing: inAndOut,
      } // https://stackoverflow.com/a/42393506/17302377
    );
  }, [map]);

  return (
    <div id="map" className="h-screen w-screen">
      {!isMapLoaded && (
        <div className="absolute inset-0 flex animate-fade-in items-center justify-center bg-black/40">
          <Spinner
            size="lg"
            label="Loading Map..."
            className="[&>span]:text-white"
            classNames={{
              circle1: 'border-b-white',
              circle2: 'border-b-white',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default OLMap;
