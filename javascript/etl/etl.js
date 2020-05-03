const low = s => s.toLowerCase();
const int = s => parseInt(s);

const transform = legacy => {
  return Object.keys(legacy).reduce((res, key) => legacy[key].reduce(
    (acc, s) => {
      acc[low(s)] = int(key);
      return acc
    }, res), {});
};

export {transform};
