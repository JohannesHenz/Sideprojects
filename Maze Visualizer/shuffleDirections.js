const directions = {
  N: [-1, 0],
  E: [0, 1],
  S: [1, 0],
  W: [0, -1],
};

function shuffleDirections() {
  const directionsArray = Object.values(directions);
  for (let i = directionsArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [directionsArray[i], directionsArray[j]] = [
      directionsArray[j],
      directionsArray[i],
    ];
  }
  return directionsArray;
}

module.exports = { shuffleDirections, directions };
