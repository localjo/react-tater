import { detectCollision, getBox, coordinatesToPercent } from './position.js';

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
