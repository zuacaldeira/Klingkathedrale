const MONTHS = ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'];

export function formatDate(isoStr) {
  const d = new Date(isoStr);
  return d.getDate() + '. ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
}
