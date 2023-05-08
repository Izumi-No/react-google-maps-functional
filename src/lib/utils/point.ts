export class Point {
  constructor(public x: number, public y: number) {}

  static convert(point: Point | [number, number] | { x: number; y: number }) {
    if (point instanceof Point) {
      return point;
    }

    if (Array.isArray(point)) {
      return new Point(point[0], point[1]);
    }

    if (typeof point === "object" && "x" in point && "y" in point) {
      return new Point(point.x, point.y);
    }

    throw new Error("Invalid point");
  }

  add(other: Point): Point {
    return new Point(this.x + other.x, this.y + other.y);
  }

  subtract(other: Point): Point {
    return new Point(this.x - other.x, this.y - other.y);
  }

  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize(): Point {
    const mag = this.magnitude();
    return new Point(this.x / mag, this.y / mag);
  }
  rotate(angle: number): Point {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Point(cos * this.x - sin * this.y, sin * this.x + cos * this.y);
  }

  dot(other: Point): number {
    return this.x * other.x + this.y * other.y;
  }
}
