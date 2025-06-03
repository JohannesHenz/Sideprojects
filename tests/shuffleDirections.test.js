const { shuffleDirections, directions } = require('../Maze Visualizer/shuffleDirections');

test('shuffleDirections returns all directions', () => {
  const expected = Object.values(directions);
  const result = shuffleDirections();
  expect(result).toEqual(expect.arrayContaining(expected));
  expect(result.length).toBe(expected.length);
});

test('shuffleDirections returns varying order', () => {
  const orders = new Set();
  for (let i = 0; i < 10; i++) {
    const res = shuffleDirections().map(d => d.join(','));
    orders.add(res.join('|'));
  }
  // there should be more than one unique order
  expect(orders.size).toBeGreaterThan(1);
});
