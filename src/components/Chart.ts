const NS = 'http://www.w3.org/2000/svg';

function svgEl<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {}
): SVGElementTagNameMap[K] {
  const node = document.createElementNS(NS, tag);
  for (const [key, value] of Object.entries(attrs)) {
    node.setAttribute(key, String(value));
  }
  return node;
}

export interface LineChartOptions {
  width?: number;
  height?: number;
  color?: string;
  fillGradientId?: string;
  padding?: number;
}

/** Gráfico de linha simples com preenchimento em gradiente, para tendências. */
export function LineChart(data: number[], options: LineChartOptions = {}): SVGElement {
  const width = options.width ?? 320;
  const height = options.height ?? 96;
  const padding = options.padding ?? 8;
  const color = options.color ?? 'var(--accent-cyan)';
  const gradId = options.fillGradientId ?? `lg-${Math.random().toString(36).slice(2, 9)}`;

  const svg = svgEl('svg', { viewBox: `0 0 ${width} ${height}`, width: '100%', height });
  svg.setAttribute('preserveAspectRatio', 'none');

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return [x, y] as const;
  });

  const linePath = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1][0]},${height - padding} L${points[0][0]},${height - padding} Z`;

  const defs = svgEl('defs');
  const gradient = svgEl('linearGradient', { id: gradId, x1: '0', y1: '0', x2: '0', y2: '1' });
  const stop1 = svgEl('stop', { offset: '0%', 'stop-color': color, 'stop-opacity': 0.35 });
  const stop2 = svgEl('stop', { offset: '100%', 'stop-color': color, 'stop-opacity': 0 });
  gradient.append(stop1, stop2);
  defs.append(gradient);

  const area = svgEl('path', { d: areaPath, fill: `url(#${gradId})`, stroke: 'none' });
  const line = svgEl('path', { d: linePath, fill: 'none', stroke: color, 'stroke-width': 2.4 });
  line.setAttribute('stroke-linecap', 'round');
  line.setAttribute('stroke-linejoin', 'round');

  svg.append(defs, area, line);

  const [lastX, lastY] = points[points.length - 1];
  const dot = svgEl('circle', { cx: lastX, cy: lastY, r: 3.5, fill: color });
  svg.append(dot);

  return svg;
}

export interface BarSeries {
  label: string;
  value: number;
  color?: string;
}

export interface BarChartOptions {
  width?: number;
  height?: number;
  maxValue?: number;
  barColor?: string;
}

/** Gráfico de barras verticais simples, com rótulos abaixo de cada barra. */
export function BarChart(series: BarSeries[], options: BarChartOptions = {}): SVGElement {
  const width = options.width ?? 320;
  const height = options.height ?? 160;
  const padding = 24;
  const labelHeight = 20;
  const chartHeight = height - labelHeight;
  const maxValue = options.maxValue ?? Math.max(...series.map((s) => Math.abs(s.value)), 1);

  const svg = svgEl('svg', { viewBox: `0 0 ${width} ${height}`, width: '100%', height });
  svg.setAttribute('preserveAspectRatio', 'none');

  const barWidth = (width - padding * 2) / series.length - 10;

  series.forEach((s, i) => {
    const x = padding + i * ((width - padding * 2) / series.length);
    const barHeight = Math.max(4, (Math.abs(s.value) / maxValue) * (chartHeight - 20));
    const y = chartHeight - barHeight;
    const color = s.color ?? 'var(--accent-blue)';

    const rect = svgEl('rect', {
      x,
      y,
      width: Math.max(barWidth, 8),
      height: barHeight,
      rx: 6,
      fill: color,
      opacity: 0.9,
    });
    svg.append(rect);

    const valueText = svgEl('text', {
      x: x + Math.max(barWidth, 8) / 2,
      y: y - 6,
      'text-anchor': 'middle',
      fill: 'var(--text-secondary)',
      'font-size': 10.5,
    });
    valueText.textContent = s.label;
    svg.append(valueText);

    const numText = svgEl('text', {
      x: x + Math.max(barWidth, 8) / 2,
      y: height - 4,
      'text-anchor': 'middle',
      fill: 'var(--text-muted)',
      'font-size': 10,
    });
    numText.textContent = `${s.value > 0 ? '+' : ''}${s.value}%`;
    svg.append(numText);
  });

  return svg;
}

export interface RadarAxis {
  label: string;
  a: number; // valor 0-100 série A
  b: number; // valor 0-100 série B
}

/** Gráfico radar simples de duas séries (situação atual vs cenário recomendado). */
export function RadarChart(axes: RadarAxis[], size = 280): SVGElement {
  const center = size / 2;
  const radius = size / 2 - 34;
  const angleStep = (Math.PI * 2) / axes.length;

  const svg = svgEl('svg', { viewBox: `0 0 ${size} ${size}`, width: '100%', height: size });

  const rings = [0.25, 0.5, 0.75, 1];
  for (const ring of rings) {
    const pts = axes.map((_, i) => pointOnCircle(center, center, radius * ring, i * angleStep));
    const path = svgEl('polygon', {
      points: pts.map((p) => p.join(',')).join(' '),
      fill: 'none',
      stroke: 'var(--border-subtle)',
      'stroke-width': 1,
    });
    svg.append(path);
  }

  axes.forEach((axis, i) => {
    const [x, y] = pointOnCircle(center, center, radius, i * angleStep);
    const line = svgEl('line', { x1: center, y1: center, x2: x, y2: y, stroke: 'var(--border-subtle)' });
    svg.append(line);

    const [lx, ly] = pointOnCircle(center, center, radius + 20, i * angleStep);
    const text = svgEl('text', {
      x: lx,
      y: ly,
      'text-anchor': 'middle',
      'dominant-baseline': 'middle',
      fill: 'var(--text-secondary)',
      'font-size': 11,
    });
    text.textContent = axis.label;
    svg.append(text);
  });

  const seriesA = axes.map((a, i) => pointOnCircle(center, center, (a.a / 100) * radius, i * angleStep));
  const seriesB = axes.map((a, i) => pointOnCircle(center, center, (a.b / 100) * radius, i * angleStep));

  const polyA = svgEl('polygon', {
    points: seriesA.map((p) => p.join(',')).join(' '),
    fill: 'rgba(155,107,255,0.18)',
    stroke: 'var(--accent-purple)',
    'stroke-width': 2,
  });
  const polyB = svgEl('polygon', {
    points: seriesB.map((p) => p.join(',')).join(' '),
    fill: 'rgba(47,224,216,0.16)',
    stroke: 'var(--accent-cyan)',
    'stroke-width': 2,
  });

  svg.append(polyA, polyB);

  return svg;
}

function pointOnCircle(cx: number, cy: number, r: number, angle: number): [number, number] {
  const a = angle - Math.PI / 2;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}
