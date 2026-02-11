/**
 * Shared audio utilities for Klangkathedrale.
 * Used by fugenmaschine, orgel, partitur, and klangkathedrale pages.
 */

export function midiToFreq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/**
 * Create a procedural cathedral reverb impulse response.
 * @param {AudioContext} audioCtx
 * @param {number} decay — reverb tail in seconds (default 2.5)
 * @returns {ConvolverNode}
 */
export function createCathedralReverb(audioCtx, decay = 2.5) {
  const convolver = audioCtx.createConvolver();
  const rate = audioCtx.sampleRate;
  const length = Math.floor(rate * decay);
  const impulse = audioCtx.createBuffer(2, length, rate);
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
    }
  }
  convolver.buffer = impulse;
  return convolver;
}
