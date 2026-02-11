const LINK_COLORS = {
  founded: 'rgba(201,168,76,0.4)',
  led: 'rgba(201,168,76,0.3)',
  taught: 'rgba(201,168,76,0.25)',
  teacher: 'rgba(212,114,92,0.35)',
  influence: 'rgba(139,126,200,0.25)',
  colleague: 'rgba(200,149,110,0.25)',
  successor: 'rgba(201,168,76,0.35)',
  studied: 'rgba(107,144,128,0.25)',
  member: 'rgba(107,144,128,0.3)'
};

export function linkColor(d) {
  return LINK_COLORS[d.type] || 'rgba(245,240,232,0.1)';
}

export function linkWidth(d) {
  return Math.max(1, d.weight * 0.8);
}

export function isNodeVisible(d, currentFilter) {
  if (currentFilter === 'all') return true;
  if (d.id === 'rilling') return true;
  if (d.institutions && d.institutions.includes(currentFilter)) return true;
  return false;
}

export function isLinkVisible(l, nodes, currentFilter) {
  const sid = typeof l.source === 'object' ? l.source.id : l.source;
  const tid = typeof l.target === 'object' ? l.target.id : l.target;
  const sNode = nodes.find(n => n.id === sid);
  const tNode = nodes.find(n => n.id === tid);
  return isNodeVisible(sNode, currentFilter) && isNodeVisible(tNode, currentFilter);
}

export function debounce(fn, ms) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}
