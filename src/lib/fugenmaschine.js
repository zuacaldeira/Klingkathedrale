import { normalizePitches } from './math.js';

export const FUGUE_SUBJECT_PITCHES = [
  67, 74, 72, 70, 69, 70, 72, 69, 67, 66, 67, 69, 70, 74, 67
];

export const FUGUE_SUBJECT_DURATIONS = [
  4, 4, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 4, 8
];

export const COUNTER_SUBJECT_PITCHES = [
  72, 70, 69, 67, 65, 64, 65, 67, 69, 70, 72, 74, 72, 70, 69
];

export const COUNTER_SUBJECT_DURATIONS = [
  2, 2, 2, 4, 2, 2, 4, 2, 2, 2, 2, 4, 2, 2, 4
];

export const subjectNorm = normalizePitches(FUGUE_SUBJECT_PITCHES);
export const counterNorm = normalizePitches(COUNTER_SUBJECT_PITCHES);

export class Particle {
  constructor(x, y, col, type, voice, rng) {
    this.x = x;
    this.y = y;
    this.origY = y;
    this.col = col;
    this.type = type;
    this.voice = voice;
    this.vx = 0;
    this.vy = 0;
    this.age = 0;
    this.maxAge = 200 + rng() * 300;
    this.size = type === 'subject' ? 3 + rng() * 3 :
                type === 'counter' ? 2 + rng() * 2 :
                1.5 + rng() * 2;
    this.noiseOff = rng() * 10000;
    this.brightness = type === 'subject' ? 1.0 :
                      type === 'counter' ? 0.65 : 0.4;
    this.trail = [];
    this.maxTrail = type === 'subject' ? 12 : type === 'counter' ? 8 : 5;
  }

  update(params) {
    this.age++;
    const life = 1 - (this.age / this.maxAge);
    if (life <= 0) return false;

    const speedFactor = mapRange(params.tempo, 60, 180, 0.5, 2.0);
    const t = this.age * 0.01 * speedFactor;

    if (params.style === 'geometric') {
      const noiseVal = params.noiseFn ? params.noiseFn(this.noiseOff + t, params.beat * 0.01) : 0.5;
      const angle = Math.floor(noiseVal * 8) * (Math.PI / 4);
      this.vx += Math.cos(angle) * 0.3;
      this.vy += Math.sin(angle) * 0.15;
    } else if (params.style === 'calligraphic') {
      const noiseVal = params.noiseFn ? params.noiseFn(this.noiseOff + t * 0.7, params.beat * 0.005) : 0.5;
      const angle = noiseVal * Math.PI * 2 * 2;
      this.vx += Math.cos(angle) * 0.5;
      this.vy += Math.sin(angle) * 0.2;
      this.size = (this.type === 'subject' ? 2 : 1.5) + Math.abs(Math.sin(t * 3)) * 4;
    } else {
      const noiseVal = params.noiseFn ? params.noiseFn(this.noiseOff + t, this.y * 0.003) : 0.5;
      const angle = noiseVal * Math.PI * 2 * 2;
      this.vx += Math.cos(angle) * 0.25;
      this.vy += Math.sin(angle) * 0.12;
    }

    const targetY = this.origY;
    this.vy += (targetY - this.y) * 0.002;
    this.vx += 0.15 * speedFactor;
    this.vx *= 0.96;
    this.vy *= 0.95;

    if (params.inversion) {
      this.vy *= -0.5;
      const centerY = params.height * 0.5;
      this.vy += (centerY + (centerY - this.origY) - this.y) * 0.003;
    }

    this.x += this.vx;
    this.y += this.vy;

    if (this.type !== 'free' || this.age % 2 === 0) {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > this.maxTrail) this.trail.shift();
    }

    if (this.x > params.width + 50) this.x = -50;
    if (this.x < -60) this.x = params.width + 40;

    this.y = Math.max(20, Math.min(this.y, params.height - 20));

    return life > 0;
  }
}

export class Voice {
  constructor(config, index) {
    this.name = config.name;
    this.color = config.color;
    this.entryBar = config.entryBar;
    this.yBase = config.yBase;
    this.index = index;
    this.particles = [];
    this.active = false;
    this.subjectPhase = 0;
    this.state = 'waiting';
    this.stateTimer = 0;
    this.subjectLength = subjectNorm.length;
    this.noteIndex = 0;
    this.noteTimer = 0;
  }

  getEffectiveEntry(stretto) {
    const barLength = 16;
    const entryBeat = this.entryBar * barLength;
    return stretto ? entryBeat * 0.5 : entryBeat;
  }

  updateState() {
    this.stateTimer++;
    const cycleDuration = this.subjectLength * 6;
    const pos = this.stateTimer % (cycleDuration * 3);
    if (pos < cycleDuration) {
      this.state = 'subject';
    } else if (pos < cycleDuration * 2) {
      this.state = 'counter';
    } else {
      this.state = 'free';
    }
  }
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}
