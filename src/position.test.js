import {
  detectCollision,
  getBox,
  coordinatesToPercent,
  getNearbyPoints,
  snapToGrid,
  gridToPercent,
  gridToPixels
} from './position.js';

describe('detectCollision', () => {
  const box1 = {
    top: 0,
    right: 50,
    bottom: 50,
    left: 0
  };
  const box2 = {
    top: 25,
    right: 75,
    bottom: 75,
    left: 25
  };
  const box3 = {
    top: 100,
    right: 150,
    bottom: 150,
    left: 100
  };
  it('detects overlapping boxes', () => {
    expect(detectCollision(box1, box2)).toBeTruthy();
  });
  it('returns false when boxes not overlapping', () => {
    expect(detectCollision(box1, box3)).toBeFalsy();
  });
});

describe('getBox', () => {
  it('gets centered box with correct values', () => {
    expect(
      getBox(
        {
          xPercent: 50,
          yPercent: 50
        },
        {
          height: 100,
          width: 100,
          space: 10
        }
      )
    ).toStrictEqual({ top: 45, left: 45, bottom: 55, right: 55 });
  });
});

describe('coordinatesToPercent', () => {
  it('converts center point to percentages from origin', () => {
    expect(
      coordinatesToPercent(
        {
          x: 500,
          y: 500
        },
        {
          height: 1000,
          width: 1000,
          left: 0,
          top: 0
        }
      )
    ).toStrictEqual({ xPercent: 50, yPercent: 50 });
  });
  it('converts center point to percentages from 100x100', () => {
    expect(
      coordinatesToPercent(
        {
          x: 600,
          y: 600
        },
        {
          height: 1000,
          width: 1000,
          left: 100,
          top: 100
        }
      )
    ).toStrictEqual({ xPercent: 50, yPercent: 50 });
  });
});

describe('snapToGrid', () => {
  it('finds the nearest grid point from a set of percent coordinates', () => {
    const coordinates = { xPercent: 49, yPercent: 49 };
    const grid = {
      height: 100,
      width: 100,
      space: 10
    };
    expect(snapToGrid(coordinates, grid)).toEqual({ gridX: 5, gridY: 5 });
  });
  it('finds the nearest grid point from a set of percent coordinates', () => {
    const coordinates = { xPercent: 63, yPercent: 12 };
    const grid = {
      height: 500,
      width: 500,
      space: 10
    };
    expect(snapToGrid(coordinates, grid)).toEqual({ gridX: 32, gridY: 6 });
  });
});

describe('gridToPercent', () => {
  it('gets percent coordinates from grid point', () => {
    const coordinates = { gridX: 3, gridY: 6 };
    const grid = {
      height: 100,
      width: 100,
      space: 10
    };
    expect(gridToPercent(coordinates, grid)).toEqual({
      xPercent: 30,
      yPercent: 60
    });
  });
});

describe('gridToPixels', () => {
  it('gets percent coordinates from grid point', () => {
    const coordinates = { gridX: 3, gridY: 6 };
    const grid = {
      height: 100,
      width: 100,
      space: 10,
      left: 100,
      top: 100
    };
    expect(gridToPixels(coordinates, grid)).toEqual({
      x: 130,
      y: 160
    });
  });
});

describe('getNearbyPoints', () => {
  it('returns 24 nearby points', () => {
    const coordinates = { x: 150, y: 150 };
    const grid = {
      height: 100,
      width: 100,
      space: 10,
      left: 100,
      top: 100
    };
    expect(getNearbyPoints(coordinates, grid).length).toEqual(24);
  });
  it('returns points sorted by distance from origin', () => {
    const coordinates = { x: 150, y: 150 };
    const grid = {
      height: 100,
      width: 100,
      space: 10,
      left: 100,
      top: 100
    };
    expect(getNearbyPoints(coordinates, grid)).toStrictEqual([
      { x: 150, y: 140 },
      { x: 140, y: 150 },
      { x: 160, y: 150 },
      { x: 150, y: 160 },
      { x: 140, y: 140 },
      { x: 160, y: 140 },
      { x: 140, y: 160 },
      { x: 160, y: 160 },
      { x: 150, y: 130 },
      { x: 130, y: 150 },
      { x: 170, y: 150 },
      { x: 150, y: 170 },
      { x: 140, y: 130 },
      { x: 160, y: 130 },
      { x: 130, y: 140 },
      { x: 170, y: 140 },
      { x: 130, y: 160 },
      { x: 170, y: 160 },
      { x: 140, y: 170 },
      { x: 160, y: 170 },
      { x: 130, y: 130 },
      { x: 170, y: 130 },
      { x: 130, y: 170 },
      { x: 170, y: 170 }
    ]);
  });
});
