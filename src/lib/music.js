export const NOTE_SEMI = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

export function pitchToY(noteStr, config = {}) {
  const {
    lineSpacing = 10,
    staffYTreble = 120,
    trebleBottom = null
  } = config;
  const refY = trebleBottom !== null ? trebleBottom : staffYTreble + 4 * lineSpacing;

  const match = noteStr.match(/^([A-G])(#|b)?(\d)$/);
  if (!match) return staffYTreble + 20;
  const [, letter, , octStr] = match;
  const oct = parseInt(octStr);
  const noteOrder = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
  const refOct = 4, refNote = 2; // E4 = bottom line of treble
  const stepsFromRef = (oct - refOct) * 7 + (noteOrder[letter] - refNote);
  return refY - stepsFromRef * (lineSpacing / 2);
}

export function pitchToFreq(noteStr) {
  const match = noteStr.match(/^([A-G])(#|b)?(\d)$/);
  if (!match) return 440;
  const [, letter, acc, octStr] = match;
  const oct = parseInt(octStr);
  let semi = NOTE_SEMI[letter];
  if (acc === '#') semi++;
  if (acc === 'b') semi--;
  const semiFromA4 = (oct - 4) * 12 + (semi - 9);
  return 440 * Math.pow(2, semiFromA4 / 12);
}
