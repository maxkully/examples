//
// This is only a SKELETON file for the 'Gigasecond' exercise. It's been provided as a
// convenience to get you started writing code faster.
//
const GIGA_SECOND = 10 ** 9;
const toMilliseconds = seconds => seconds * 10 ** 3;

export const gigasecond = ($moment) => {
  // date.getTime() return time in milliseconds
  // Date obj constructor accept time in milliseconds
  return new Date($moment.getTime() + toMilliseconds(GIGA_SECOND));
};
