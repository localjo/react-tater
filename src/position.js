export const detectCollision = function(a, b) {
  const isCollision = !(
    a.top > b.bottom ||
    a.right < b.left ||
    a.bottom < b.top ||
    a.left > b.right
  );
  return isCollision;
};

export const getBox = function(coordinates, grid) {
  const { xPercent, yPercent } = coordinates;
  const { height, width, space } = grid;
  const top = height * (yPercent / 100);
  const left = width * (xPercent / 100);
  const half = space / 2;
  return {
    top: top - half,
    left: left - half,
    bottom: top + half,
    right: left + half
  };
};

export const coordinatesToPercent = function({ x, y }, grid) {
  const { top, left, height, width } = grid;
  return {
    xPercent: ((x - left) / width) * 100,
    yPercent: ((y - top) / height) * 100
  };
};

function getDistance(point, from) {
  return Math.pow(from.x - point.x, 2) + Math.pow(from.y - point.y, 2);
}

export const getNearbyPoints = function(coordinates, grid) {
  const { height, space, width } = grid;
  const rows = Math.floor(height / space);
  const cols = Math.floor(width / space);
  const percent = coordinatesToPercent(coordinates, grid);
  const { gridX, gridY } = snapToGrid(percent, grid);
  const nearestGridPoints = Array(rows)
    .fill(null)
    .map((row, rowIndex) => {
      return Array(cols)
        .fill(null)
        .map((col, colIndex) => {
          return [colIndex + 1, rowIndex + 1];
        })
        .filter((cell) => {
          const [x, y] = cell;
          const xNearby = x >= gridX - 2 && x <= gridX + 2;
          const yNearby = y >= gridY - 2 && y <= gridY + 2;
          return xNearby && yNearby ? true : false;
        });
    })
    .flat()
    .map((arr) => {
      const [x, y] = arr;
      return gridToPixels({ gridX: x, gridY: y }, grid);
    });
  return nearestGridPoints.sort((a, b) => {
    return getDistance(a, coordinates) - getDistance(b, coordinates);
  });
};

export const snapToGrid = function(coordinates, grid) {
  const { xPercent, yPercent } = coordinates;
  const { height, width, space } = grid;
  const gridX = Math.round((width * (xPercent / 100)) / space);
  const gridY = Math.round((height * (yPercent / 100)) / space);
  return { gridX, gridY };
};

export const gridToPercent = function(coordinates, grid) {
  const { gridX, gridY } = coordinates;
  const { height, width, space } = grid;
  const xPercent = ((gridX * space) / width) * 100;
  const yPercent = ((gridY * space) / height) * 100;
  return { xPercent, yPercent };
};

export const gridToPixels = function(coordinates, grid) {
  const { gridX, gridY } = coordinates;
  const { space, top, left } = grid;
  const x = gridX * space + left;
  const y = gridY * space + top;
  return { x, y };
};

export const findSafePosition = function(coordinates, grid, markers, isNearby) {
  const newMarker = coordinatesToPercent(coordinates, grid);
  const newMarkerBox = getBox(newMarker, grid);
  const hasCollision = markers.some((m) => {
    const mBox = getBox(m, grid);
    return detectCollision(newMarkerBox, mBox);
  });
  if (hasCollision) {
    if (isNearby) return false; // Don't recurse if we're checking nearby
    const nearbyPoints = getNearbyPoints(coordinates, grid);
    const closestFreePoint = nearbyPoints.find((point) => {
      return findSafePosition(point, grid, markers, true);
    });
    if (closestFreePoint) {
      return coordinatesToPercent(closestFreePoint, grid);
    }
    return false;
  }
  return newMarker;
};
