import { describe, it, expect } from 'vitest';
import { formatDate } from '../../src/lib/date.js';

describe('formatDate', () => {
  it('formats January date correctly', () => {
    expect(formatDate('2024-01-15')).toBe('15. Jan. 2024');
  });
  it('formats March (März)', () => {
    expect(formatDate('2023-03-01')).toBe('1. März 2023');
  });
  it('formats May (Mai — no period)', () => {
    expect(formatDate('2023-05-20')).toBe('20. Mai 2023');
  });
  it('formats June (Juni)', () => {
    expect(formatDate('2024-06-30')).toBe('30. Juni 2024');
  });
  it('formats July (Juli)', () => {
    expect(formatDate('2024-07-04')).toBe('4. Juli 2024');
  });
  it('formats December (Dez.)', () => {
    expect(formatDate('2023-12-25')).toBe('25. Dez. 2023');
  });
  it('formats all 12 months', () => {
    const expected = ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'];
    for (let m = 0; m < 12; m++) {
      const iso = `2024-${String(m + 1).padStart(2, '0')}-10`;
      const formatted = formatDate(iso);
      expect(formatted).toContain(expected[m]);
    }
  });
  it('handles ISO datetime string', () => {
    const result = formatDate('2024-02-14T12:00:00Z');
    expect(result).toContain('Feb.');
    expect(result).toContain('2024');
  });
});
