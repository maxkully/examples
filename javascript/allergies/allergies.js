//
// This is only a SKELETON file for the 'Allergies' exercise. It's been provided as a
// convenience to get you started writing code faster.
//
const ALLERGENS = [
  'eggs',
  'peanuts',
  'shellfish',
  'strawberries',
  'tomatoes',
  'chocolate',
  'pollen',
  'cats'
];

export class Allergies {
  constructor(score) {
    this.score = score;
  }

  list() {
    return ALLERGENS.filter(item => this.allergicTo(item))
  }

  allergicTo(item) {
    return (1 << ALLERGENS.indexOf(item) & this.score) === (1 << ALLERGENS.indexOf(item))
  }
}
