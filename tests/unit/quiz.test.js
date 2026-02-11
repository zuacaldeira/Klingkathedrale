import { describe, it, expect } from 'vitest';
import { SETS, getSetKey } from '../../src/lib/quiz.js';

describe('SETS data integrity', () => {
  it('has 10 base sets', () => {
    const baseSets = ['peaceful_beauty', 'peaceful_depth', 'energized_drama', 'energized_virtuosity',
      'contemplative_depth', 'sad_stillness', 'curious_beauty', 'curious_virtuosity',
      'sad_beauty', 'contemplative_stillness'];
    baseSets.forEach(key => {
      expect(SETS).toHaveProperty(key);
    });
  });

  it('each base set has exactly 3 works', () => {
    const baseSets = ['peaceful_beauty', 'peaceful_depth', 'energized_drama', 'energized_virtuosity',
      'contemplative_depth', 'sad_stillness', 'curious_beauty', 'curious_virtuosity',
      'sad_beauty', 'contemplative_stillness'];
    baseSets.forEach(key => {
      expect(SETS[key].works).toHaveLength(3);
    });
  });

  it('each work has all required fields', () => {
    const requiredFields = ['bwv', 'title', 'desc', 'why', 'recording', 'tip', 'deep'];
    Object.values(SETS).forEach(set => {
      if (set && set.works) {
        set.works.forEach(work => {
          requiredFields.forEach(field => {
            expect(work).toHaveProperty(field);
            expect(typeof work[field]).toBe('string');
            expect(work[field].length).toBeGreaterThan(0);
          });
          expect(work.bwv).toMatch(/^BWV/);
        });
      }
    });
  });

  it('desc, why, recording, tip, deep are non-trivial strings', () => {
    const baseSets = ['peaceful_beauty', 'peaceful_depth', 'energized_drama', 'energized_virtuosity',
      'contemplative_depth', 'sad_stillness', 'curious_beauty', 'curious_virtuosity',
      'sad_beauty', 'contemplative_stillness'];
    baseSets.forEach(key => {
      SETS[key].works.forEach(work => {
        expect(work.desc.length).toBeGreaterThan(10);
        expect(work.why.length).toBeGreaterThan(10);
        expect(work.recording.length).toBeGreaterThan(10);
        expect(work.tip.length).toBeGreaterThan(10);
        expect(work.deep.length).toBeGreaterThan(30);
      });
    });
  });

  it('has aliases that point to base sets', () => {
    expect(SETS.peaceful_stillness).toBe(SETS.contemplative_stillness);
    expect(SETS.peaceful_drama).toBe(SETS.energized_drama);
    expect(SETS.sad_drama).toBe(SETS.energized_drama);
    expect(SETS.curious_depth).toBe(SETS.contemplative_depth);
  });

  it('all aliases are valid references', () => {
    const aliases = ['peaceful_stillness', 'peaceful_drama', 'peaceful_virtuosity',
      'energized_beauty', 'energized_depth', 'energized_stillness',
      'contemplative_beauty', 'contemplative_drama', 'contemplative_virtuosity',
      'sad_drama', 'sad_depth', 'sad_virtuosity',
      'curious_depth', 'curious_drama', 'curious_stillness'];
    aliases.forEach(key => {
      expect(SETS[key]).toBeDefined();
      expect(SETS[key].works).toBeDefined();
    });
  });
});

describe('getSetKey', () => {
  it('returns matching key for valid combo', () => {
    expect(getSetKey('peaceful', 'beauty')).toBe('peaceful_beauty');
  });
  it('returns matching key for energized_drama', () => {
    expect(getSetKey('energized', 'drama')).toBe('energized_drama');
  });
  it('returns matching key for alias', () => {
    expect(getSetKey('sad', 'drama')).toBe('sad_drama');
  });
  it('returns fallback for unknown combo', () => {
    expect(getSetKey('unknown', 'mood')).toBe('peaceful_beauty');
  });
  it('returns fallback for empty strings', () => {
    expect(getSetKey('', '')).toBe('peaceful_beauty');
  });
  it('returns correct key for all mood x aesthetic combos', () => {
    const moods = ['peaceful', 'energized', 'contemplative', 'sad', 'curious'];
    const aesthetics = ['beauty', 'depth', 'drama', 'virtuosity', 'stillness'];
    moods.forEach(mood => {
      aesthetics.forEach(aesthetic => {
        const key = getSetKey(mood, aesthetic);
        expect(SETS[key]).toBeDefined();
      });
    });
  });
});
