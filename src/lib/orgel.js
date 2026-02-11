export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function generateNotes(midiStart = 48, midiEnd = 72) {
  const notes = [];
  for (let midi = midiStart; midi <= midiEnd; midi++) {
    const octave = Math.floor(midi / 12) - 1;
    const noteIndex = midi % 12;
    const name = NOTE_NAMES[noteIndex];
    const isBlack = [1, 3, 6, 8, 10].includes(noteIndex);
    const freq = midiToFreq(midi);
    notes.push({ midi, name: name + octave, noteName: name, octave, isBlack, freq });
  }
  return notes;
}

export const NOTES = generateNotes(48, 72);

export const KEY_MAP = {
  'a': 48,
  'w': 49,
  's': 50,
  'e': 51,
  'd': 52,
  'f': 53,
  't': 54,
  'g': 55,
  'y': 56,
  'z': 56,
  'h': 57,
  'u': 58,
  'j': 59,
  'k': 60,
};

export function midiToFreq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}
