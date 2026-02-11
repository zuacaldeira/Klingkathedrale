import { describe, it, expect } from 'vitest';
import { NOTE_SEMI, pitchToY, pitchToFreq } from '../../src/lib/music.js';

describe('NOTE_SEMI', () => {
  it('has all 7 natural notes', () => {
    expect(Object.keys(NOTE_SEMI)).toHaveLength(7);
  });
  it('C=0, D=2, E=4, F=5, G=7, A=9, B=11', () => {
    expect(NOTE_SEMI.C).toBe(0);
    expect(NOTE_SEMI.D).toBe(2);
    expect(NOTE_SEMI.E).toBe(4);
    expect(NOTE_SEMI.F).toBe(5);
    expect(NOTE_SEMI.G).toBe(7);
    expect(NOTE_SEMI.A).toBe(9);
    expect(NOTE_SEMI.B).toBe(11);
  });
});

describe('pitchToY', () => {
  const config = { lineSpacing: 10, staffYTreble: 120, trebleBottom: 160 };

  it('returns default Y for invalid note string', () => {
    expect(pitchToY('X9', config)).toBe(140); // staffYTreble + 20
  });
  it('returns valid Y for E4 (bottom treble line)', () => {
    // E4 is the reference, so stepsFromRef = 0
    expect(pitchToY('E4', config)).toBe(160);
  });
  it('higher notes have lower Y (up on screen)', () => {
    const yC4 = pitchToY('C4', config);
    const yC5 = pitchToY('C5', config);
    expect(yC5).toBeLessThan(yC4);
  });
  it('handles sharps and flats', () => {
    // Sharps and flats affect frequency but not Y position (same letter = same position)
    const yF4 = pitchToY('F4', config);
    const yFs4 = pitchToY('F#4', config);
    expect(yF4).toBe(yFs4);
  });
  it('uses default config when none given', () => {
    const y = pitchToY('C4');
    expect(typeof y).toBe('number');
  });
});

describe('pitchToFreq', () => {
  it('returns 440 for A4', () => {
    expect(pitchToFreq('A4')).toBeCloseTo(440, 1);
  });
  it('returns ~261.63 for C4 (middle C)', () => {
    expect(pitchToFreq('C4')).toBeCloseTo(261.63, 0);
  });
  it('returns 440 for invalid input', () => {
    expect(pitchToFreq('invalid')).toBe(440);
  });
  it('sharp raises by one semitone', () => {
    const aSharp = pitchToFreq('A#4');
    const a = pitchToFreq('A4');
    expect(aSharp / a).toBeCloseTo(Math.pow(2, 1 / 12), 4);
  });
  it('flat lowers by one semitone', () => {
    const aFlat = pitchToFreq('Ab4');
    const a = pitchToFreq('A4');
    expect(a / aFlat).toBeCloseTo(Math.pow(2, 1 / 12), 4);
  });
  it('octave doubles frequency', () => {
    const a4 = pitchToFreq('A4');
    const a5 = pitchToFreq('A5');
    expect(a5 / a4).toBeCloseTo(2, 4);
  });
  it('returns correct frequency for B3', () => {
    // B3 = 246.94 Hz
    expect(pitchToFreq('B3')).toBeCloseTo(246.94, 0);
  });
});
