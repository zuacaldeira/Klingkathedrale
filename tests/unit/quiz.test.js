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

  it('each work has bwv and title', () => {
    Object.values(SETS).forEach(set => {
      if (set && set.works) {
        set.works.forEach(work => {
          expect(work).toHaveProperty('bwv');
          expect(work).toHaveProperty('title');
          expect(work.bwv).toMatch(/^BWV/);
        });
      }
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
