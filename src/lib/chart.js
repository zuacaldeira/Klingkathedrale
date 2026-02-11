import { clamp } from './math.js';

export function yearToX(year, config = {}) {
  const {
    padLeft = 80,
    padRight = 40,
    width = 1000,
    startYear = 1970,
    endYear = 2000
  } = config;
  return padLeft + ((year - startYear) / (endYear - startYear)) * (width - padLeft - padRight);
}

export function valToY(val, config = {}) {
  const {
    padTop = 40,
    padBot = 70,
    height = 500,
    maxY = 172
  } = config;
  return height - padBot - (val / maxY) * (height - padTop - padBot);
}

export function getSectionProgress(rect, viewportHeight) {
  const progress = 1 - (rect.top / viewportHeight);
  return clamp(progress, 0, 1);
}

export function buildAreaPath(stackedData, layerIdx, progress, yearToXFn, valToYFn) {
  const pts = stackedData.map((d) => {
    const x = yearToXFn(d.year);
    const animatedY1 = d.layers[layerIdx].y1 * progress;
    const animatedY0 = d.layers[layerIdx].y0 * progress;
    return { x, y0: valToYFn(animatedY0), y1: valToYFn(animatedY1) };
  });

  let path = `M ${pts[0].x},${pts[0].y0}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const cpx = (pts[i].x + pts[i + 1].x) / 2;
    path += ` C ${cpx},${pts[i].y1} ${cpx},${pts[i + 1].y1} ${pts[i + 1].x},${pts[i + 1].y1}`;
  }
  for (let i = pts.length - 1; i > 0; i--) {
    const cpx = (pts[i].x + pts[i - 1].x) / 2;
    path += ` C ${cpx},${pts[i].y0} ${cpx},${pts[i - 1].y0} ${pts[i - 1].x},${pts[i - 1].y0}`;
  }
  path += ' Z';
  return path;
}
