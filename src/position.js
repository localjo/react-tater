export const detectCollision = function(a, b) {
  const isCollision = !(
    a.top >= b.bottom ||
    a.right <= b.left ||
    a.bottom <= b.top ||
    a.left >= b.right
  );
  const overlap = {
    bottom: a.bottom > b.top && a.bottom < b.bottom ? a.bottom - b.top : 0,
    left: a.left > b.left && a.left < b.right ? b.right - a.left : 0,
    top: a.top > b.top && a.top < b.bottom ? b.bottom - a.top : 0,
    right: a.right > b.left && a.right < b.right ? a.right - b.left : 0
  };
  const x = overlap.left - overlap.right;
  const y = overlap.top - overlap.bottom;
  const smallerX = Math.abs(x) < Math.abs(y);
  const adjustment = {
    ...(smallerX ? { x: x || 1 } : { y: y || 1 })
  };
  return isCollision ? adjustment : false;
};

const getBox = function({ x, y, height, width, space }) {
  const top = height * (y / 100);
  const left = width * (x / 100);
  return {
    top,
    left,
    bottom: top + space,
    right: left + space
  };
};

export const findSafePosition = function(
  coordinates,
  grid,
  markers,
  depth = 0
) {
  const { height, width, space, left, top } = grid;
  const { x, y } = coordinates;
  const marker = {
    x: ((x - left) / width) * 100,
    y: ((y - top) / height) * 100
  }
  const markerTop = height * (marker.y / 100);
  const markerLeft = width * (marker.x / 100);
  const newMarker = { ...marker };
  if (markerLeft + space > width) {
    newMarker.x = ((width - space) / width) * 100;
  }
  if (markerTop + space > height) {
    newMarker.y = ((height - space) / height) * 100;
  }
  const markerBox = getBox({
    ...newMarker,
    ...grid
  });
  const adjustments = markers
    .map(m => {
      const box = getBox({
        ...m,
        ...grid,
        space: marker.space
      });
      return detectCollision(markerBox, box);
    })
    .filter(n => n);
  if (adjustments.length > 0) {
    const percentX = adjustments[0].x ? (adjustments[0].x / width) * 100 : 0;
    const percentY = adjustments[0].y ? (adjustments[0].y / height) * 100 : 0;
    const adjustedMarker = {
      x: newMarker.x + percentX + depth,
      y: newMarker.y + percentY + depth,
      space
    };
    depth += 1;
    return depth < 3
      ? findSafePosition(adjustedMarker, grid, markers, depth)
      : false;
  }
  return { x: newMarker.x, y: newMarker.y };
};
