export default function distance2D(p1x, p1y, p2x, p2y) {
  const a = p2x - p1x;
  const b = p2y - p1y;

  return Math.sqrt(a * a + b * b);
}