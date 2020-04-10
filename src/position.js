export const detectCollision = function(a, b) {
  const isCollision = !(
    a.top > b.bottom ||
    a.right < b.left ||
    a.bottom < b.top ||
    a.left > b.right
  );
  console.log(a, b);
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

export const findSafePosition = function(coordinates, grid, markers) {
  const newMarker = coordinatesToPercent(coordinates, grid);
  const newMarkerBox = getBox(newMarker, grid);
  const hasCollision = markers.some((m) => {
    const mBox = getBox(m, grid);
    return detectCollision(newMarkerBox, mBox);
  });
  if (hasCollision) {
    return false;
    // TODO: make this recursive after finding new coordinates
    // findSafePosition(newCoordinates, grid, markers);
  }
  return newMarker;
};
