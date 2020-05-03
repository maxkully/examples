//
// This is only a SKELETON file for the 'Protein Translation' exercise. It's been provided as a
// convenience to get you started writing code faster.
//
const STOP = 'STOP';

const POLYPEPTYDES = {
  AUG:	'Methionine',
  UUU: 'Phenylalanine',
  UUC: 'Phenylalanine',
  UUA: 'Leucine',
  UUG: 'Leucine',
  UCU: 'Serine',
  UCC: 'Serine',
  UCA: 'Serine',
  UCG: 'Serine',
  UAU: 'Tyrosine',
  UAC: 'Tyrosine',
  UGU: 'Cysteine',
  UGC: 'Cysteine',
  UGG: 'Tryptophan',
  UAA: STOP,
  UAG: STOP,
  UGA: STOP
};

export const translate = (RNA = '') => {
  if (RNA.length % 3 !== 0) throw new Error('Invalid codon');

  return (RNA.match(/.{3}/g) || []).reduce((proteins, codon) => {
    if (!POLYPEPTYDES[codon]) throw new Error('Invalid codon');
    return proteins.includes(STOP) ? proteins : [...proteins, POLYPEPTYDES[codon]];
  }, []).filter(protein => protein !== STOP);
};
