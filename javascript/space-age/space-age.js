//
// This is only a SKELETON file for the 'Space Age' exercise. It's been provided as a
// convenience to get you started writing code faster.
//

// Earth years, 365.25 Earth days, or 31,557,600 seconds
const EARTH_YEAR = 31557600

const ORBITAL = {
  mercury: 0.2408467,
  venus:   0.61519726,
  earth:   1.0,
  mars:    1.8808158,
  jupiter: 11.862615,
  saturn:  29.447498,
  uranus:  84.016846,
  neptune: 164.79132,
}

export const age = (planet, seconds) => {
  let age = parseInt(seconds) / EARTH_YEAR;
  if (isNaN(age)) throw new Error('Invalid age in seconds')

  age /= ORBITAL[planet.toLowerCase()];
  if (isNaN(age)) throw new Error('Unknown planet')

  return Math.round(age * 100 + Number.EPSILON) / 100;
}
