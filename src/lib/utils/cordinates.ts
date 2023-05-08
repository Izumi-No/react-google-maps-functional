import { wrap } from "./math/wrap";

export class Cordinates {
  constructor(public lat: number, public lng: number) {}

  static convert(
    cordinate: Cordinates | [number, number] | { lat: number; lng: number }
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

    throw new Error("Invalid cordinate");
  }

  wrap() {
    return new Cordinates(this.lat, wrap(this.lng, -180, 180));
  }
}
