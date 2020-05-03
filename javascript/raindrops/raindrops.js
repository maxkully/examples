//
// This is only a SKELETON file for the 'Raindrops' exercise. It's been provided as a
// convenience to get you started writing code faster.
//

const SOUNDS = { 3: 'Pling', 5: 'Plang', 7: 'Plong' };
export const convert = (num) => Object.keys(SOUNDS).filter(factor => num % factor === 0).map(key => SOUNDS[key]).join('') || num.toString();
