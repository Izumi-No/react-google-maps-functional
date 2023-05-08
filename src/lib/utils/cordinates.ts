import { wrap } from "./math/wrap";

export class Cordinates {
  public x: number;
  public y: number;
  constructor(public lat: number, public lng: number) {
    this.x = this.lng;
    this.y = this.lat;
  }

  static convert(
    cordinate:
      | Cordinates
      | [number, number]
      | { lat: number; lng: number }
      | { x: number; y: number }
  ) {
    if (cordinate instanceof Cordinates) {
      return cordinate;
    }

    if (Array.isArray(cordinate)) {
      return new Cordinates(cordinate[0], cordinate[1]);
    }

    if (
      typeof cordinate === "object" &&
      "lat" in cordinate &&
      "lng" in cordinate
    ) {
      return new Cordinates(cordinate.lat, cordinate.lng);
    }

    if (typeof cordinate === "object" && "x" in cordinate && "y" in cordinate) {
      return new Cordinates(cordinate.y, cordinate.x);
    }

    throw new Error("Invalid cordinate");
  }

  wrap() {
    return new Cordinates(this.lat, wrap(this.lng, -180, 180));
  }
}
