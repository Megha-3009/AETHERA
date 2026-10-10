
export type Point2D = {
  x: number;
  y: number;
};

export function calculateAngle(
  a: Point2D,
  b: Point2D,
  c: Point2D
): number {
  // The angle is measured at point B.
  const radians = Math.atan2(c.y - b.y, c.x - b.x) -
    Math.atan2(a.y - b.y, a.x - b.x);

  let degrees = Math.abs(radians * (180 / Math.PI));

  if (degrees > 180) {
    degrees = 360 - degrees;
  }

  return Math.round(degrees);
}
