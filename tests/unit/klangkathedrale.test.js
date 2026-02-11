import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Particle } from '../../src/lib/klangkathedrale.js';

describe('Particle', () => {
  let mathRandomSpy;

  beforeEach(() => {
    mathRandomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  it('initializes with reset', () => {
    const p = new Particle(800, 600);
    expect(p.w).toBe(800);
    expect(p.h).toBe(600);
    expect(p.x).toBe(400); // 0.5 * 800
    expect(p.y).toBe(300); // 0.5 * 600
  });

  it('sets velocity from random', () => {
    const p = new Particle(800, 600);
    expect(p.vx).toBe(0); // (0.5 - 0.5) * 0.3 = 0
    expect(p.vy).toBe(0);
  });

  it('sets size from random', () => {
    const p = new Particle(800, 600);
    expect(p.size).toBe(1.5); // 0.5 * 2 + 0.5
  });

  it('sets alpha from random', () => {
    const p = new Particle(800, 600);
    expect(p.alpha).toBeCloseTo(0.3); // 0.5 * 0.4 + 0.1
  });

  it('sets life from random', () => {
    const p = new Particle(800, 600);
    expect(p.life).toBe(200); // 0.5 * 200 + 100
    expect(p.maxLife).toBe(200);
  });

  it('update decrements life', () => {
    const p = new Particle(800, 600);
    const initialLife = p.life;
    p.update();
    expect(p.life).toBe(initialLife - 1);
  });

  it('update moves position by velocity', () => {
    mathRandomSpy.mockReturnValue(0.8);
    const p = new Particle(800, 600);
    const initX = p.x;
    const initY = p.y;
    p.update();
    expect(p.x).toBe(initX + p.vx);
  });

  it('resets when life reaches 0', () => {
    const p = new Particle(800, 600);
    p.life = 1;
    p.update(); // life becomes 0
    // After reset, life should be freshly generated
    expect(p.life).toBe(200); // reset re-calls Math.random which returns 0.5
  });

  it('resets when going off screen left', () => {
    const p = new Particle(800, 600);
    p.x = -11;
    p.update();
    // Should have been reset
    expect(p.x).toBe(400); // reset position
  });

  it('resets when going off screen right', () => {
    const p = new Particle(800, 600);
    p.x = 811;
    p.update();
    expect(p.x).toBe(400);
  });

  it('resets when going off screen top', () => {
    const p = new Particle(800, 600);
    p.y = -11;
    p.update();
    expect(p.y).toBe(300);
  });

  it('resets when going off screen bottom', () => {
    const p = new Particle(800, 600);
    p.y = 611;
    p.update();
    expect(p.y).toBe(300);
  });

  it('draw calls canvas arc', () => {
    const p = new Particle(800, 600);
    const ctx = {
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      fillStyle: ''
    };
    const color = [201, 168, 76];
    p.draw(ctx, color);
    expect(ctx.beginPath).toHaveBeenCalled();
    expect(ctx.arc).toHaveBeenCalledWith(400, 300, 1.5, 0, Math.PI * 2);
    expect(ctx.fill).toHaveBeenCalled();
  });

  it('draw uses correct rgba color with fade', () => {
    const p = new Particle(800, 600);
    p.life = 100;
    p.maxLife = 200;
    const ctx = {
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      fillStyle: ''
    };
    p.draw(ctx, [201, 168, 76]);
    expect(ctx.fillStyle).toMatch(/^rgba\(201,168,76,/);
  });

  it('fade is 1 in the middle of life', () => {
    const p = new Particle(800, 600);
    p.life = 100;
    p.maxLife = 200;
    // fade = min(1, 100/30, (200-100)/30) = min(1, 3.33, 3.33) = 1
    const ctx = { beginPath: vi.fn(), arc: vi.fn(), fill: vi.fn(), fillStyle: '' };
    p.draw(ctx, [201, 168, 76]);
    // alpha = 0.3, fade = 1, so fillStyle should contain 0.3
    expect(ctx.fillStyle).toContain('0.3');
  });

  it('fade decreases near end of life', () => {
    const p = new Particle(800, 600);
    p.life = 15;
    p.maxLife = 200;
    // fade = min(1, 15/30, (200-15)/30) = min(1, 0.5, 6.17) = 0.5
    const ctx = { beginPath: vi.fn(), arc: vi.fn(), fill: vi.fn(), fillStyle: '' };
    p.draw(ctx, [201, 168, 76]);
    expect(ctx.fillStyle).toContain('0.15'); // 0.3 * 0.5
  });
});
