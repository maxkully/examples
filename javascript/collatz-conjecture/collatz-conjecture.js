//
// This is only a SKELETON file for the 'Collatz Conjecture' exercise. It's been provided as a
// convenience to get you started writing code faster.
//

export const steps = n => {
  if (n === 1) return 0;

  n = parseInt(n);
  if (n < 1) throw new Error('Only positive numbers are allowed');

  return steps(n % 2 === 0 ? n / 2 : 3 * n + 1) + 1;
};
