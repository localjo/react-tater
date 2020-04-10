import { detectCollision } from './position.js';

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

describe('detectCollision', () => {
  it('detects overlapping boxes', () => {
    expect(detectCollision(box1, box2)).toBeTruthy();
  });
});
