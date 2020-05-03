//
// This is only a SKELETON file for the 'Nucleotide-Count' exercise. It's been provided as a
// convenience to get you started writing code faster.
//

export class NucleotideCounts {
  static parse(dna) {
    return Object.values([...(dna || '')].reduce(
      (acc, ch) => {
        if (Object.keys(acc).indexOf(ch) === -1) throw new Error('Invalid nucleotide in strand');

        acc[ch] = acc[ch] + 1;
        return acc;
      },
      { A: 0, C: 0, G: 0, T: 0 }
    )).join(' ');
  }
}
