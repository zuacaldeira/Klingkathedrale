export function quadBezier(x1, y1, x2, y2) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const bulge = Math.min(dist * 0.25, 60);
  const angle = Math.atan2(y2 - y1, x2 - x1) - Math.PI / 2;
  const cx = mx + Math.cos(angle) * bulge;
  const cy = my + Math.sin(angle) * bulge;
  return `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
}
