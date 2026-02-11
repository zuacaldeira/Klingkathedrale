import { describe, it, expect } from 'vitest';
import { quadBezier } from '../../src/lib/geo.js';

describe('quadBezier', () => {
  it('returns SVG path starting with M', () => {
    const path = quadBezier(0, 0, 100, 100);
    expect(path).toMatch(/^M/);
  });
  it('contains Q command for quadratic bezier', () => {
    const path = quadBezier(0, 0, 100, 0);
    expect(path).toContain(' Q');
  });
  it('starts at first point', () => {
    const path = quadBezier(10, 20, 100, 200);
    expect(path).toMatch(/^M10,20/);
  });
  it('ends at second point', () => {
    const path = quadBezier(10, 20, 100, 200);
    expect(path).toMatch(/100,200$/);
  });
  it('produces an arc (control point differs from midpoint)', () => {
    const path = quadBezier(0, 0, 100, 0);
    // Midpoint is (50,0); control should have different y
    const match = path.match(/Q([\d.-]+),([\d.-]+)/);
    expect(match).not.toBeNull();
    const cy = parseFloat(match[2]);
    expect(cy).not.toBe(0); // bulge creates offset
  });
  it('caps bulge at 60', () => {
    // Very large distance should cap bulge
    const path = quadBezier(0, 0, 10000, 0);
    const match = path.match(/Q([\d.-]+),([\d.-]+)/);
    const cy = parseFloat(match[2]);
    // bulge = min(dist * 0.25, 60) => 60 here, angle = -PI/2, so cy = 0 + sin(-PI/2)*60 = -60
    expect(cy).toBeCloseTo(-60, 0);
  });
  it('handles same start and end point', () => {
    const path = quadBezier(50, 50, 50, 50);
    expect(path).toMatch(/^M50,50 Q/);
  });
  it('handles negative coordinates', () => {
    const path = quadBezier(-10, -20, -100, -200);
    expect(path).toMatch(/^M-10,-20/);
  });
});
