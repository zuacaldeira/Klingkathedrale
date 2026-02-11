import { describe, it, expect } from 'vitest';
import { NOTES, KEY_MAP, midiToFreq, NOTE_NAMES, generateNotes } from '../../src/lib/orgel.js';

describe('NOTE_NAMES', () => {
  it('has 12 note names', () => {
    expect(NOTE_NAMES).toHaveLength(12);
  });
  it('starts with C', () => {
    expect(NOTE_NAMES[0]).toBe('C');
  });
  it('ends with B', () => {
    expect(NOTE_NAMES[11]).toBe('B');
  });
  it('contains all chromatic notes', () => {
    expect(NOTE_NAMES).toContain('C#');
    expect(NOTE_NAMES).toContain('F#');
    expect(NOTE_NAMES).toContain('A#');
  });
});

describe('NOTES', () => {
  it('has 25 notes (MIDI 48-72)', () => {
    expect(NOTES).toHaveLength(25);
  });
  it('first note is C3 (MIDI 48)', () => {
    expect(NOTES[0].midi).toBe(48);
    expect(NOTES[0].name).toBe('C3');
    expect(NOTES[0].isBlack).toBe(false);
  });
  it('last note is C5 (MIDI 72)', () => {
    expect(NOTES[24].midi).toBe(72);
    expect(NOTES[24].name).toBe('C5');
  });
  it('marks black keys correctly', () => {
    const c3sharp = NOTES[1]; // MIDI 49
    expect(c3sharp.isBlack).toBe(true);
    expect(c3sharp.noteName).toBe('C#');
  });
  it('marks white keys correctly', () => {
    const d3 = NOTES[2]; // MIDI 50
    expect(d3.isBlack).toBe(false);
    expect(d3.noteName).toBe('D');
  });
  it('each note has all required properties', () => {
    NOTES.forEach(note => {
      expect(note).toHaveProperty('midi');
      expect(note).toHaveProperty('name');
      expect(note).toHaveProperty('noteName');
      expect(note).toHaveProperty('octave');
      expect(note).toHaveProperty('isBlack');
      expect(note).toHaveProperty('freq');
    });
  });
  it('A4 (MIDI 69) has freq ~440', () => {
    const a4 = NOTES.find(n => n.midi === 69);
    expect(a4.freq).toBeCloseTo(440, 1);
  });
});

describe('generateNotes', () => {
  it('generates custom range', () => {
    const notes = generateNotes(60, 72);
    expect(notes).toHaveLength(13);
    expect(notes[0].midi).toBe(60);
    expect(notes[12].midi).toBe(72);
  });
  it('single note range', () => {
    const notes = generateNotes(69, 69);
    expect(notes).toHaveLength(1);
    expect(notes[0].freq).toBeCloseTo(440, 1);
  });
});

describe('KEY_MAP', () => {
  it('maps a to C3 (MIDI 48)', () => {
    expect(KEY_MAP['a']).toBe(48);
  });
  it('maps k to C4 (MIDI 60)', () => {
    expect(KEY_MAP['k']).toBe(60);
  });
  it('maps both y and z to G#3 (MIDI 56)', () => {
    expect(KEY_MAP['y']).toBe(56);
    expect(KEY_MAP['z']).toBe(56);
  });
  it('has 14 key mappings', () => {
    expect(Object.keys(KEY_MAP)).toHaveLength(14);
  });
  it('all values are valid MIDI numbers in range', () => {
    Object.values(KEY_MAP).forEach(midi => {
      expect(midi).toBeGreaterThanOrEqual(48);
      expect(midi).toBeLessThanOrEqual(60);
    });
  });
});

describe('midiToFreq', () => {
  it('returns 440 for MIDI 69 (A4)', () => {
    expect(midiToFreq(69)).toBeCloseTo(440, 1);
  });
  it('returns ~261.63 for MIDI 60 (C4)', () => {
    expect(midiToFreq(60)).toBeCloseTo(261.63, 0);
  });
  it('doubles frequency per octave', () => {
    expect(midiToFreq(69 + 12) / midiToFreq(69)).toBeCloseTo(2, 4);
  });
  it('halves frequency per octave down', () => {
    expect(midiToFreq(69) / midiToFreq(69 - 12)).toBeCloseTo(2, 4);
  });
  it('semitone ratio is 2^(1/12)', () => {
    const ratio = midiToFreq(70) / midiToFreq(69);
    expect(ratio).toBeCloseTo(Math.pow(2, 1 / 12), 6);
  });
});
