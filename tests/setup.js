import { vi } from 'vitest';

// Mock AudioContext
class MockAudioContext {
  constructor() {
    this.currentTime = 0;
    this.state = 'running';
  }
  createOscillator() {
    return {
      frequency: { setValueAtTime: vi.fn() },
      detune: { setValueAtTime: vi.fn() },
      setPeriodicWave: vi.fn(),
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      type: 'sine'
    };
  }
  createGain() {
    return {
      gain: { value: 1, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
      connect: vi.fn(),
      disconnect: vi.fn()
    };
  }
  createPeriodicWave() { return {}; }
  get destination() { return {}; }
  resume() { return Promise.resolve(); }
}

globalThis.AudioContext = MockAudioContext;
globalThis.webkitAudioContext = MockAudioContext;

// Mock requestAnimationFrame
globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 16);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);

// Mock IntersectionObserver
globalThis.IntersectionObserver = class {
  constructor(cb) { this.cb = cb; }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock matchMedia
globalThis.matchMedia = globalThis.matchMedia || function() {
  return { matches: false, addListener: vi.fn(), removeListener: vi.fn() };
};
