/**
 * Get screenshot of map
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 *
 * References:
 * https://openlayers.org/en/latest/examples/export-map.html
 * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
 */

import Map from 'ol/Map';

/**
 * Get screenshot of map
 * @param map OpenLayers map
 * @returns base64 encoded image
 */
export const getScreenshot = (map: Map): string => {
  // Create a new canvas element that will be the image
  const mapCanvas = document.createElement('canvas');

  // Resize the canvas
  mapCanvas.width = 256;
  mapCanvas.height = 256;

  // Get all the map's layers and draw them on the canvas
  const mapContext = mapCanvas.getContext('2d');
  if (!mapContext) return '';

  Array.prototype.forEach.call(
    map.getViewport().querySelectorAll('.ol-layer canvas, canvas.ol-layer'),
    function (canvas) {
      if (canvas.width > 0) {
        const opacity = canvas.parentNode.style.opacity || canvas.style.opacity;
        mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
        let matrix;
        const transform = canvas.style.transform;
        if (transform) {
          // Get the transform parameters from the style's transform matrix
          matrix = transform
            .match(/^matrix\(([^\(]*)\)$/)[1]
            .split(',')
            .map(Number);
        } else {
          matrix = [
            parseFloat(canvas.style.width) / canvas.width,
            0,
            0,
            parseFloat(canvas.style.height) / canvas.height,
            0,
            0,
          ];
        }
        // Apply the transform to the export map context
        CanvasRenderingContext2D.prototype.setTransform.apply(
          mapContext,
          matrix
        );
        const backgroundColor = canvas.parentNode.style.backgroundColor;
        if (backgroundColor) {
          mapContext.fillStyle = backgroundColor;
          mapContext.fillRect(0, 0, canvas.width, canvas.height);
        }
        mapContext.drawImage(
          canvas,
          canvas.width * 0.339,
          0,
          canvas.width,
          canvas.height,
          0,
          0,
          mapCanvas.width * 2.57,
          mapCanvas.height * 1.5
        );
      }
    }
  );
  mapContext.globalAlpha = 1;
  mapContext.setTransform(1, 0, 0, 1, 0, 0);

  return mapCanvas.toDataURL();
};
