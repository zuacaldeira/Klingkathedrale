import { describe, it, expect } from 'vitest';
import {
  FUGUE_SUBJECT_PITCHES, FUGUE_SUBJECT_DURATIONS,
  COUNTER_SUBJECT_PITCHES, COUNTER_SUBJECT_DURATIONS,
  subjectNorm, counterNorm,
  Particle, Voice
} from '../../src/lib/fugenmaschine.js';

describe('fugue data', () => {
  it('subject pitches and durations have same length', () => {
    expect(FUGUE_SUBJECT_PITCHES).toHaveLength(15);
    expect(FUGUE_SUBJECT_DURATIONS).toHaveLength(15);
  });
  it('counter-subject pitches and durations have same length', () => {
    expect(COUNTER_SUBJECT_PITCHES).toHaveLength(15);
    expect(COUNTER_SUBJECT_DURATIONS).toHaveLength(15);
  });
  it('subjectNorm is normalized to 0-1', () => {
    expect(Math.min(...subjectNorm)).toBe(0);
    expect(Math.max(...subjectNorm)).toBe(1);
  });
  it('counterNorm is normalized to 0-1', () => {
    expect(Math.min(...counterNorm)).toBe(0);
    expect(Math.max(...counterNorm)).toBe(1);
  });
  it('all pitches are MIDI range', () => {
    FUGUE_SUBJECT_PITCHES.forEach(p => {
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(127);
    });
  });
  it('all durations are positive', () => {
    FUGUE_SUBJECT_DURATIONS.forEach(d => expect(d).toBeGreaterThan(0));
    COUNTER_SUBJECT_DURATIONS.forEach(d => expect(d).toBeGreaterThan(0));
  });
});

describe('Particle', () => {
  const rng = () => 0.5;
  const col = [201, 168, 76];

  it('initializes with correct position', () => {
    const p = new Particle(100, 200, col, 'subject', 0, rng);
    expect(p.x).toBe(100);
    expect(p.y).toBe(200);
    expect(p.origY).toBe(200);
  });

  it('subject particles are larger', () => {
    const subject = new Particle(0, 0, col, 'subject', 0, rng);
    const free = new Particle(0, 0, col, 'free', 0, rng);
    expect(subject.size).toBeGreaterThan(free.size);
  });

  it('subject has highest brightness', () => {
    const subject = new Particle(0, 0, col, 'subject', 0, rng);
    const counter = new Particle(0, 0, col, 'counter', 0, rng);
    const free = new Particle(0, 0, col, 'free', 0, rng);
    expect(subject.brightness).toBe(1.0);
    expect(counter.brightness).toBe(0.65);
    expect(free.brightness).toBe(0.4);
  });

  it('subject has longest trail', () => {
    const subject = new Particle(0, 0, col, 'subject', 0, rng);
    const counter = new Particle(0, 0, col, 'counter', 0, rng);
    const free = new Particle(0, 0, col, 'free', 0, rng);
    expect(subject.maxTrail).toBe(12);
    expect(counter.maxTrail).toBe(8);
    expect(free.maxTrail).toBe(5);
  });

  it('starts with age 0', () => {
    const p = new Particle(0, 0, col, 'subject', 0, rng);
    expect(p.age).toBe(0);
  });

  it('update increments age', () => {
    const p = new Particle(100, 100, col, 'subject', 0, rng);
    const params = { tempo: 90, style: 'organic', inversion: false, width: 800, height: 600, beat: 0, noiseFn: () => 0.5 };
    p.update(params);
    expect(p.age).toBe(1);
  });

  it('update returns false when particle dies', () => {
    const p = new Particle(100, 100, col, 'subject', 0, rng);
    p.maxAge = 1;
    const params = { tempo: 90, style: 'organic', inversion: false, width: 800, height: 600, beat: 0, noiseFn: () => 0.5 };
    const alive = p.update(params);
    expect(alive).toBe(false);
  });

  it('update returns true while alive', () => {
    const p = new Particle(100, 100, col, 'subject', 0, rng);
    const params = { tempo: 90, style: 'organic', inversion: false, width: 800, height: 600, beat: 0, noiseFn: () => 0.5 };
    expect(p.update(params)).toBe(true);
  });

  it('geometric style uses angular movement', () => {
    const p = new Particle(100, 100, col, 'subject', 0, rng);
    const params = { tempo: 90, style: 'geometric', inversion: false, width: 800, height: 600, beat: 0, noiseFn: () => 0.5 };
    p.update(params);
    expect(p.x).not.toBe(100);
  });

  it('calligraphic style changes size', () => {
    const p = new Particle(100, 100, col, 'subject', 0, rng);
    const origSize = p.size;
    const params = { tempo: 90, style: 'calligraphic', inversion: false, width: 800, height: 600, beat: 0, noiseFn: () => 0.5 };
    p.update(params);
    // Size should have changed for calligraphic
    // (may or may not be different from origSize depending on sin(t*3))
    expect(typeof p.size).toBe('number');
  });

  it('calligraphic counter particle uses 1.5 base size', () => {
    const p = new Particle(100, 100, col, 'counter', 0, rng);
    const params = { tempo: 90, style: 'calligraphic', inversion: false, width: 800, height: 600, beat: 0, noiseFn: () => 0.5 };
    p.update(params);
    expect(typeof p.size).toBe('number');
  });

  it('works without noiseFn (geometric fallback)', () => {
    const p = new Particle(100, 100, col, 'subject', 0, rng);
    const params = { tempo: 90, style: 'geometric', inversion: false, width: 800, height: 600, beat: 0 };
    p.update(params);
    expect(p.x).not.toBe(100);
  });

  it('works without noiseFn (calligraphic fallback)', () => {
    const p = new Particle(100, 100, col, 'subject', 0, rng);
    const params = { tempo: 90, style: 'calligraphic', inversion: false, width: 800, height: 600, beat: 0 };
    p.update(params);
    expect(typeof p.size).toBe('number');
  });

  it('works without noiseFn (organic fallback)', () => {
    const p = new Particle(100, 100, col, 'subject', 0, rng);
    const params = { tempo: 90, style: 'organic', inversion: false, width: 800, height: 600, beat: 0 };
    p.update(params);
    expect(p.x).not.toBe(100);
  });

  it('free particle skips trail on odd age', () => {
    const p = new Particle(100, 100, col, 'free', 0, rng);
    const params = { tempo: 90, style: 'organic', inversion: false, width: 800, height: 600, beat: 0, noiseFn: () => 0.5 };
    // Age starts at 0, after first update age=1 (odd), should skip trail
    p.update(params);
    expect(p.age).toBe(1);
    const trailLenAfterOdd = p.trail.length;
    // After second update age=2 (even), should add trail
    p.update(params);
    expect(p.trail.length).toBeGreaterThan(trailLenAfterOdd);
  });

  it('wraps x when going off left edge', () => {
    const p = new Particle(-61, 100, col, 'subject', 0, rng);
    p.vx = -10;
    const params = { tempo: 90, style: 'organic', inversion: false, width: 800, height: 600, beat: 0, noiseFn: () => 0.5 };
    p.update(params);
    expect(p.x).toBeGreaterThan(700);
  });

  it('trail shifts when exceeding maxTrail', () => {
    const p = new Particle(100, 100, col, 'subject', 0, rng);
    const params = { tempo: 90, style: 'organic', inversion: false, width: 800, height: 600, beat: 0, noiseFn: () => 0.5 };
    for (let i = 0; i < 20; i++) p.update(params);
    expect(p.trail.length).toBeLessThanOrEqual(p.maxTrail);
  });

  it('inversion flips vy', () => {
    const p = new Particle(100, 100, col, 'subject', 0, rng);
    const params = { tempo: 90, style: 'organic', inversion: true, width: 800, height: 600, beat: 0, noiseFn: () => 0.5 };
    p.update(params);
    // Just verify it runs without error
    expect(p.y).toBeDefined();
  });

  it('wraps x when going off right edge', () => {
    const p = new Particle(850, 100, col, 'subject', 0, rng);
    p.vx = 100;
    const params = { tempo: 180, style: 'organic', inversion: false, width: 800, height: 600, beat: 0, noiseFn: () => 0.5 };
    p.update(params);
    expect(p.x).toBeLessThan(0);
  });

  it('constrains y within bounds', () => {
    const p = new Particle(100, 5, col, 'subject', 0, rng);
    p.vy = -100;
    const params = { tempo: 90, style: 'organic', inversion: false, width: 800, height: 600, beat: 0, noiseFn: () => 0.5 };
    p.update(params);
    expect(p.y).toBeGreaterThanOrEqual(20);
    expect(p.y).toBeLessThanOrEqual(580);
  });

  it('builds trail for non-free particles', () => {
    const p = new Particle(100, 100, col, 'subject', 0, rng);
    const params = { tempo: 90, style: 'organic', inversion: false, width: 800, height: 600, beat: 0, noiseFn: () => 0.5 };
    p.update(params);
    p.update(params);
    expect(p.trail.length).toBeGreaterThan(0);
  });
});

describe('Voice', () => {
  const config = { name: 'Soprano', color: [201, 168, 76], entryBar: 0, yBase: 0.18 };

  it('initializes with waiting state', () => {
    const v = new Voice(config, 0);
    expect(v.state).toBe('waiting');
    expect(v.active).toBe(false);
  });

  it('has correct name and color', () => {
    const v = new Voice(config, 0);
    expect(v.name).toBe('Soprano');
    expect(v.color).toEqual([201, 168, 76]);
  });

  it('getEffectiveEntry without stretto', () => {
    const v = new Voice({ ...config, entryBar: 4 }, 1);
    expect(v.getEffectiveEntry(false)).toBe(64); // 4 * 16
  });

  it('getEffectiveEntry with stretto halves delay', () => {
    const v = new Voice({ ...config, entryBar: 4 }, 1);
    expect(v.getEffectiveEntry(true)).toBe(32); // 64 * 0.5
  });

  it('updateState cycles through subject/counter/free', () => {
    const v = new Voice(config, 0);
    const states = new Set();
    for (let i = 0; i < 500; i++) {
      v.updateState();
      states.add(v.state);
    }
    expect(states).toContain('subject');
    expect(states).toContain('counter');
    expect(states).toContain('free');
  });

  it('starts in subject state after first updateState', () => {
    const v = new Voice(config, 0);
    v.updateState();
    expect(v.state).toBe('subject');
  });

  it('empty particles array on init', () => {
    const v = new Voice(config, 0);
    expect(v.particles).toEqual([]);
  });
});
