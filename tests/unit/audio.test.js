import { describe, it, expect } from 'vitest';
import { midiToFreq, createCathedralReverb } from '../../src/lib/audio.js';

describe('midiToFreq', () => {
  it('converts A4 (MIDI 69) to 440 Hz', () => {
    expect(midiToFreq(69)).toBeCloseTo(440);
  });

  it('converts middle C (MIDI 60) correctly', () => {
    expect(midiToFreq(60)).toBeCloseTo(261.626, 2);
  });

  it('converts A3 (MIDI 57) to 220 Hz', () => {
    expect(midiToFreq(57)).toBeCloseTo(220);
  });

  it('octave doubles the frequency', () => {
    const f1 = midiToFreq(60);
    const f2 = midiToFreq(72);
    expect(f2).toBeCloseTo(f1 * 2, 1);
  });

  it('handles low MIDI values', () => {
    expect(midiToFreq(21)).toBeCloseTo(27.5, 1);
  });

  it('handles high MIDI values', () => {
    expect(midiToFreq(108)).toBeCloseTo(4186.01, 0);
  });
});

describe('createCathedralReverb', () => {
  it('returns a ConvolverNode with buffer set', () => {
    const sampleRate = 44100;
    const buffers = [];
    const mockCtx = {
      sampleRate,
      createConvolver: () => {
        const node = { buffer: null };
        return node;
      },
      createBuffer: (channels, length, rate) => {
        const channelData = [];
        for (let ch = 0; ch < channels; ch++) {
          channelData.push(new Float32Array(length));
        }
        return {
          numberOfChannels: channels,
          length,
          sampleRate: rate,
          getChannelData: (ch) => channelData[ch]
        };
      }
    };

    const convolver = createCathedralReverb(mockCtx, 2.0);
    expect(convolver.buffer).not.toBeNull();
    expect(convolver.buffer.numberOfChannels).toBe(2);
    expect(convolver.buffer.length).toBe(Math.floor(sampleRate * 2.0));
  });

  it('uses default decay of 2.5', () => {
    const sampleRate = 44100;
    const mockCtx = {
      sampleRate,
      createConvolver: () => ({ buffer: null }),
      createBuffer: (channels, length, rate) => {
        const channelData = [];
        for (let ch = 0; ch < channels; ch++) {
          channelData.push(new Float32Array(length));
        }
        return {
          numberOfChannels: channels,
          length,
          sampleRate: rate,
          getChannelData: (ch) => channelData[ch]
        };
      }
    };

    const convolver = createCathedralReverb(mockCtx);
    expect(convolver.buffer.length).toBe(Math.floor(sampleRate * 2.5));
  });

  it('generates non-zero impulse data', () => {
    const sampleRate = 44100;
    const mockCtx = {
      sampleRate,
      createConvolver: () => ({ buffer: null }),
      createBuffer: (channels, length, rate) => {
        const channelData = [];
        for (let ch = 0; ch < channels; ch++) {
          channelData.push(new Float32Array(length));
        }
        return {
          numberOfChannels: channels,
          length,
          sampleRate: rate,
          getChannelData: (ch) => channelData[ch]
        };
      }
    };

    const convolver = createCathedralReverb(mockCtx, 1.0);
    const data = convolver.buffer.getChannelData(0);
    const hasNonZero = data.some(v => v !== 0);
    expect(hasNonZero).toBe(true);
  });
});
