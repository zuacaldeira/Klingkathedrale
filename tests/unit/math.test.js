import { describe, it, expect } from 'vitest';
import { lerp, clamp, mulberry32, normalizePitches } from '../../src/lib/math.js';

describe('lerp', () => {
  it('returns a when t=0', () => {
    expect(lerp(10, 20, 0)).toBe(10);
  });
  it('returns b when t=1', () => {
    expect(lerp(10, 20, 1)).toBe(20);
  });
  it('returns midpoint when t=0.5', () => {
    expect(lerp(0, 100, 0.5)).toBe(50);
  });
  it('extrapolates beyond 0-1', () => {
    expect(lerp(0, 10, 2)).toBe(20);
    expect(lerp(0, 10, -1)).toBe(-10);
  });
  it('works with negative numbers', () => {
    expect(lerp(-10, 10, 0.5)).toBe(0);
  });
});

describe('clamp', () => {
  it('returns value when within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });
  it('clamps to min when below', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });
  it('clamps to max when above', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
  it('returns min when value equals min', () => {
    expect(clamp(0, 0, 10)).toBe(0);
  });
  it('returns max when value equals max', () => {
    expect(clamp(10, 0, 10)).toBe(10);
  });
  it('works with negative ranges', () => {
    expect(clamp(-15, -10, -5)).toBe(-10);
    expect(clamp(-3, -10, -5)).toBe(-5);
  });
});

describe('mulberry32', () => {
  it('returns a function', () => {
    const rng = mulberry32(42);
    expect(typeof rng).toBe('function');
  });
  it('produces numbers between 0 and 1', () => {
    const rng = mulberry32(123);
    for (let i = 0; i < 100; i++) {
      const val = rng();
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(1);
    }
  });
  it('is deterministic — same seed gives same sequence', () => {
    const rng1 = mulberry32(42);
    const rng2 = mulberry32(42);
    for (let i = 0; i < 50; i++) {
      expect(rng1()).toBe(rng2());
    }
  });
  it('different seeds produce different sequences', () => {
    const rng1 = mulberry32(1);
    const rng2 = mulberry32(2);
    const seq1 = Array.from({ length: 5 }, () => rng1());
    const seq2 = Array.from({ length: 5 }, () => rng2());
    expect(seq1).not.toEqual(seq2);
  });
  it('works with seed 0', () => {
    const rng = mulberry32(0);
    const val = rng();
    expect(val).toBeGreaterThanOrEqual(0);
    expect(val).toBeLessThan(1);
  });
});

describe('normalizePitches', () => {
  it('normalizes to 0-1 range', () => {
    const result = normalizePitches([60, 70, 80]);
    expect(result[0]).toBe(0);
    expect(result[1]).toBe(0.5);
    expect(result[2]).toBe(1);
  });
  it('handles single value', () => {
    const result = normalizePitches([60]);
    expect(result).toEqual([0]);
  });
  it('handles identical values', () => {
    const result = normalizePitches([50, 50, 50]);
    expect(result).toEqual([0, 0, 0]);
  });
  it('handles negative pitches', () => {
    const result = normalizePitches([-10, 0, 10]);
    expect(result[0]).toBe(0);
    expect(result[1]).toBe(0.5);
    expect(result[2]).toBe(1);
  });
  it('preserves array length', () => {
    const input = [1, 2, 3, 4, 5];
    expect(normalizePitches(input)).toHaveLength(5);
  });
});
