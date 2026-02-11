import { describe, it, expect } from 'vitest';
import { SETS, getSetKey } from '../../src/lib/quiz.js';

describe('Entdecke Bach questionnaire state flow', () => {
  const moods = ['peaceful', 'energized', 'contemplative', 'sad', 'curious'];
  const aesthetics = ['beauty', 'depth', 'drama', 'virtuosity', 'stillness'];

  it('every mood/aesthetic combination resolves to a valid set', () => {
    moods.forEach(mood => {
      aesthetics.forEach(aesthetic => {
        const key = getSetKey(mood, aesthetic);
        expect(SETS[key]).toBeDefined();
        expect(SETS[key].works).toHaveLength(3);
      });
    });
  });

  it('simulates full questionnaire flow: peaceful + beauty', () => {
    const answers = [null, null, null];
    // Q1: mood
    answers[0] = 'peaceful';
    // Q2: aesthetic
    answers[1] = 'beauty';
    // Q3: not used for set selection
    answers[2] = 'listening';

    const setKey = getSetKey(answers[0], answers[1]);
    expect(setKey).toBe('peaceful_beauty');
    const set = SETS[setKey];
    expect(set.works[0].bwv).toBe('BWV 1068');
  });

  it('simulates flow: sad + depth', () => {
    const setKey = getSetKey('sad', 'depth');
    expect(setKey).toBe('sad_depth');
    const set = SETS[setKey];
    expect(set.works).toHaveLength(3);
  });

  it('simulates flow: curious + virtuosity', () => {
    const setKey = getSetKey('curious', 'virtuosity');
    expect(setKey).toBe('curious_virtuosity');
    const set = SETS[setKey];
    expect(set.works).toHaveLength(3);
    expect(set.works[0].bwv).toBeDefined();
  });

  it('handles edge case: unknown mood falls back', () => {
    const setKey = getSetKey('angry', 'beauty');
    expect(setKey).toBe('peaceful_beauty');
  });

  it('all 25 combinations produce 3 works each', () => {
    let totalCombinations = 0;
    moods.forEach(mood => {
      aesthetics.forEach(aesthetic => {
        const key = getSetKey(mood, aesthetic);
        const set = SETS[key];
        expect(set.works).toHaveLength(3);
        set.works.forEach(work => {
          expect(work.bwv).toMatch(/^BWV/);
          expect(work.title.length).toBeGreaterThan(0);
        });
        totalCombinations++;
      });
    });
    expect(totalCombinations).toBe(25);
  });

  it('alias sets share the same reference', () => {
    expect(SETS.peaceful_stillness).toBe(SETS.contemplative_stillness);
    expect(SETS.energized_beauty).toBe(SETS.curious_beauty);
  });
});
