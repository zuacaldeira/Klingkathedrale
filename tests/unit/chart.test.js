import { describe, it, expect } from 'vitest';
import { yearToX, valToY, getSectionProgress, buildAreaPath } from '../../src/lib/chart.js';

describe('yearToX', () => {
  const config = { padLeft: 80, padRight: 40, width: 1000, startYear: 1970, endYear: 2000 };

  it('returns padLeft for startYear', () => {
    expect(yearToX(1970, config)).toBe(80);
  });
  it('returns width - padRight for endYear', () => {
    expect(yearToX(2000, config)).toBe(1000 - 40);
  });
  it('returns midpoint for mid year', () => {
    const mid = yearToX(1985, config);
    expect(mid).toBe(80 + ((1985 - 1970) / 30) * (1000 - 80 - 40));
  });
  it('uses default config when none provided', () => {
    const result = yearToX(1970);
    expect(result).toBe(80);
  });
  it('handles custom config', () => {
    const custom = { padLeft: 0, padRight: 0, width: 100, startYear: 0, endYear: 100 };
    expect(yearToX(50, custom)).toBe(50);
  });
});

describe('valToY', () => {
  const config = { padTop: 40, padBot: 70, height: 500, maxY: 172 };

  it('returns bottom position for value 0', () => {
    expect(valToY(0, config)).toBe(500 - 70);
  });
  it('returns top position for maxY', () => {
    expect(valToY(172, config)).toBe(40);
  });
  it('returns midpoint for half maxY', () => {
    const mid = valToY(86, config);
    const expected = 500 - 70 - (86 / 172) * (500 - 40 - 70);
    expect(mid).toBeCloseTo(expected);
  });
  it('uses default config', () => {
    expect(valToY(0)).toBe(500 - 70);
  });
});

describe('getSectionProgress', () => {
  it('returns 0 when section top is at viewport bottom', () => {
    const rect = { top: 800 };
    expect(getSectionProgress(rect, 800)).toBe(0);
  });
  it('returns 1 when section top is at viewport top', () => {
    const rect = { top: 0 };
    expect(getSectionProgress(rect, 800)).toBe(1);
  });
  it('returns 0.5 for midpoint', () => {
    const rect = { top: 400 };
    expect(getSectionProgress(rect, 800)).toBeCloseTo(0.5);
  });
  it('clamps to 0 when section is below viewport', () => {
    const rect = { top: 1600 };
    expect(getSectionProgress(rect, 800)).toBe(0);
  });
  it('clamps to 1 when section is above viewport', () => {
    const rect = { top: -500 };
    expect(getSectionProgress(rect, 800)).toBe(1);
  });
});

describe('buildAreaPath', () => {
  const stackedData = [
    { year: 1970, layers: [{ y0: 0, y1: 10 }] },
    { year: 1980, layers: [{ y0: 0, y1: 20 }] },
    { year: 1990, layers: [{ y0: 0, y1: 30 }] }
  ];
  const toX = (year) => year - 1970;
  const toY = (val) => 100 - val;

  it('returns a valid SVG path string', () => {
    const path = buildAreaPath(stackedData, 0, 1, toX, toY);
    expect(path).toMatch(/^M /);
    expect(path).toMatch(/ Z$/);
  });
  it('starts with M command', () => {
    const path = buildAreaPath(stackedData, 0, 1, toX, toY);
    expect(path.startsWith('M ')).toBe(true);
  });
  it('contains C (cubic bezier) commands', () => {
    const path = buildAreaPath(stackedData, 0, 1, toX, toY);
    expect(path).toContain(' C ');
  });
  it('scales with progress', () => {
    const pathFull = buildAreaPath(stackedData, 0, 1, toX, toY);
    const pathHalf = buildAreaPath(stackedData, 0, 0.5, toX, toY);
    expect(pathFull).not.toBe(pathHalf);
  });
  it('returns flat path when progress is 0', () => {
    const path = buildAreaPath(stackedData, 0, 0, toX, toY);
    // When progress=0, y0 and y1 are both 0, so all Y coords should be toY(0) = 100
    expect(path).toContain('100');
  });
});
