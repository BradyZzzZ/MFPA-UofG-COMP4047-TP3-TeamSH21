/**
 * Search bar in the map view.
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 *
 * References:
 * https://openlayers.org/en/latest/examples/overlay.html
 * https://stackoverflow.com/a/31197743/17302377
 */

import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { Notify } from '@/components';
import {
  coordPattern,
  dbCountries,
  dbUKCity,
  dbUKHamlet,
  dbUKTown,
  dbUKVillage,
  msg,
} from '@/constants';
import { useMap } from '@/context';
import { ScrollShadow, Tooltip } from '@nextui-org/react';
import Overlay from 'ol/Overlay.js';
import { inAndOut } from 'ol/easing';
import { Point } from 'ol/geom';
import { IoSearch } from 'react-icons/io5';

import { Backdrop } from '.';

interface SearchbarProps {
  sidepanelHidden: boolean;
}

interface resultsProps {
  name: string;
  bbox?: number[];
}

const Searchbar = ({ sidepanelHidden }: SearchbarProps) => {
  const [hiddenInput, setHiddenInput] = useState(true);
  const [hiddenAutocomplete, setHiddenAutocomplete] = useState(true);
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState<resultsProps[]>([]);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);

  const autocompleteRef = useRef<HTMLUListElement>(null);

  const { map } = useMap();

  const fetchCountries = () => {
    const allLocations = [
      ...dbUKCity,
      ...dbUKTown,
      ...dbUKVillage,
      ...dbUKHamlet,
      ...dbCountries,
    ];

    const filteredLocations = allLocations.filter((location) =>
      location.name.toLowerCase().includes(inputText.toLowerCase())
    );

    setResults(filteredLocations.slice(0, 50));
  };

  const handleCoordEnter = () => {
    if (!map) return;

    const tmp = inputText.split(',');
    if (tmp.length !== 2) {
      Notify('error', msg.INVALID_COORDINATES, 'Invalid Coordinates');
      return;
    }
    let x;
    let y;
    if (
      coordPattern.long.isDD.test(tmp[0]) &&
      coordPattern.lat.isDD.test(tmp[1])
    ) {
      x = parseFloat(tmp[0]);
      y = parseFloat(tmp[1]);
    } else if (
      coordPattern.long.isDMS.test(tmp[0]) &&
      coordPattern.lat.isDMS.test(tmp[1])
    ) {
      let tmp1 = tmp[0].split(' ').map((each) => parseFloat(each));
      let tmp2 = tmp[1].split(' ').map((each) => parseFloat(each));

      x = tmp1[0] + tmp1[1] / 60.0 + tmp1[2] / 3600.0;
      y = tmp2[0] + tmp2[1] / 60.0 + tmp2[2] / 3600.0;
    } else if (
      coordPattern.long.isDMM.test(tmp[0]) &&
      coordPattern.lat.isDMM.test(tmp[1])
    ) {
      let tmp1 = tmp[0].split(' ').map((each) => parseFloat(each));
      let tmp2 = tmp[1].split(' ').map((each) => parseFloat(each));
      x = tmp1[0] + tmp1[1] / 60.0;
      y = tmp2[0] + tmp2[1] / 60.0;
    } else {
      Notify('error', msg.INVALID_COORDINATES, 'Invalid Coordinates');
      return;
    }

    const point = new Point([x, y]);
    map.getView().fit(point, {
      padding: sidepanelHidden ? [100, 100, 100, 100] : [100, 100, 100, 550],
      duration: 500,
      easing: inAndOut,
      maxZoom: 17.25,
    });

    const pin = document.createElement('img');
    pin.src = 'https://maps.google.com/mapfiles/ms/micons/red-dot.png';
    pin.style.width = '32px';
    pin.style.height = '32px';

    const marker = new Overlay({
      position: [x, y],
      positioning: 'center-center',
      element: pin,
      stopEvent: false,
    });

    pin.onmouseover = () => {
      pin.style.cursor = 'pointer';
    };

    pin.onclick = () => {
      map.removeOverlay(marker);
    };

    map.addOverlay(marker);
  };

  const handleCountryClick = (country: resultsProps) => {
    if (!map || !country) return;

    setInputText(country.name);
    setSelectedResultIndex(-1);
    map.getView().fit(country.bbox!, {
      padding: sidepanelHidden ? [100, 100, 100, 100] : [100, 100, 100, 550],
      duration: 500,
      easing: inAndOut,
    });
  };

  useEffect(() => {
    fetchCountries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputText]);

  useEffect(() => {
    if (autocompleteRef.current && selectedResultIndex !== -1) {
      const itemElement = autocompleteRef.current.children[selectedResultIndex];
      if (itemElement) {
        itemElement.scrollIntoView({
          block: 'nearest',
          inline: 'nearest',
        });
      }
    }
  }, [selectedResultIndex]);

  return (
    <>
      <div
        className={`fixed top-4 z-40 flex items-center ${sidepanelHidden ? 'left-4' : 'left-[30rem]'}`}
      >
        <Tooltip content="Search" delay={400} closeDelay={0}>
          <button
            className={`btn btn-square btn-primary shadow-md ${hiddenInput ? '' : 'rounded-r-none'}`}
            onClick={() => {
              setHiddenInput((prev) => !prev);
              setHiddenAutocomplete(true);
            }}
          >
            <IoSearch className="text-2xl" />
          </button>
        </Tooltip>
        {!hiddenInput && (
          <div className="bg-actionPrimary pl-2">
            <input
              type="text"
              value={inputText}
              autoFocus
              onDragOver={(e) => {
                if (e.dataTransfer.types.includes('Files')) {
                  e.dataTransfer.dropEffect = 'none';
                  e.preventDefault();
                }
              }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setInputText(e.target.value);
                setHiddenAutocomplete(false);
              }}
              placeholder="Search for places or coordinates (long,lat)"
              className={`input input-sm my-1 ml-0 mr-2 box-border h-10 w-80 rounded-sm text-base caret-blue placeholder:text-sm ${
                !hiddenAutocomplete && results.length > 0 && 'rounded-b-none'
              }`}
              onClick={() => setHiddenAutocomplete(false)}
              onKeyDown={
                !hiddenAutocomplete && results.length > 0
                  ? (e) => {
                      if (e.key === 'Enter') {
                        setHiddenAutocomplete(true);
                        handleCountryClick(
                          results[
                            selectedResultIndex === -1 ? 0 : selectedResultIndex
                          ]
                        );
                      } else if (e.key === 'ArrowUp') {
                        setSelectedResultIndex((prevIndex) =>
                          prevIndex > 0 ? prevIndex - 1 : results.length - 1
                        );
                      } else if (e.key === 'ArrowDown') {
                        setSelectedResultIndex((prevIndex) =>
                          prevIndex < results.length - 1 ? prevIndex + 1 : 0
                        );
                      }
                    }
                  : (e) => {
                      if (e.key === 'Enter') {
                        setHiddenAutocomplete(true);
                        handleCoordEnter();
                      }
                    }
              }
            />
            {!hiddenAutocomplete && results.length > 0 && (
              <div className="fixed z-50 -mt-1 w-80 rounded-lg rounded-t-none border-t bg-base-100 p-1 shadow-md">
                <ScrollShadow
                  ref={autocompleteRef}
                  as="ul"
                  className="max-h-80 overflow-y-auto scroll-auto p-1 text-base text-textBlack"
                >
                  {results.map((country, index) => (
                    <li
                      key={index}
                      className={`cursor-pointer rounded px-2 py-1 hover:bg-blue hover:text-white ${
                        selectedResultIndex === index
                          ? 'bg-blue text-white'
                          : ''
                      }`}
                      onClick={() => {
                        setHiddenAutocomplete(true);
                        handleCountryClick(country);
                      }}
                    >
                      <p className="rounded-none">{country.name}</p>
                    </li>
                  ))}
                </ScrollShadow>
              </div>
            )}
          </div>
        )}
      </div>
      {!hiddenAutocomplete && (
        <Backdrop onClick={() => setHiddenAutocomplete(true)} />
      )}
    </>
  );
};

export default Searchbar;
