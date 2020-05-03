//
// This is only a SKELETON file for the 'Triangle' exercise. It's been provided as a
// convenience to get you started writing code faster.
//

export class Triangle {
  constructor(...sides) {
    if (sides.length < 3) throw new Error('Triangle must have three sides');

    this.sides = Array.from(new Set(sides.slice(0, 3)));
    this.triangleInequality = (sides[0] + sides[1] >= sides[2])
      && (sides[1] + sides[2] >= sides[0])
      && (sides[0] + sides[2] >= sides[1])
  }

  isEquilateral() {
    return this.sides.length === 1 && this.sides[0] !== 0
  }

  isIsosceles() {
    return this.triangleInequality && this.sides.length < 3
  }

  isScalene() {
    return this.triangleInequality && this.sides.length === 3
  }
}
