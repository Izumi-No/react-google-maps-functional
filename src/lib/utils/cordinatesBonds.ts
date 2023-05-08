import { Cordinates } from "./cordinates";

export default class CordinatesBounds {
  private _sw!: Cordinates;
  private _ne!: Cordinates;

  static convert(
    a: CordinatesBounds | Cordinates
  ): CordinatesBounds | Cordinates {
    if (!a || a instanceof CordinatesBounds) return a;
    return new CordinatesBounds(a);
  }

  constructor(sw?: Cordinates, ne?: Cordinates) {
    if (!sw) return;
    const cordCordinatess = ne ? [sw, ne] : sw;

    if (Array.isArray(cordCordinatess)) {
      for (let i = 0, len = cordCordinatess.length; i < len; i++) {
        this.extend(cordCordinatess[i]);
      }
    }
  }

  extend(obj: CordinatesBounds | Cordinates): this {
    const sw = this._sw;
    const ne = this._ne;
    let sw2: Cordinates;
    let ne2: Cordinates;

    if (obj instanceof Cordinates) {
      sw2 = obj;
      ne2 = obj;
    } else if (obj instanceof CordinatesBounds) {
      sw2 = obj._sw;
      ne2 = obj._ne;

      if (!sw2 || !ne2) return this;
    } else {
      return obj
        ? this.extend(Cordinates.convert(obj) || CordinatesBounds.convert(obj))
        : this;
    }

    if (!sw && !ne) {
      this._sw = new Cordinates(sw2.lat, sw2.lng);
      this._ne = new Cordinates(ne2.lat, ne2.lng);
    } else {
      sw.lat = Math.min(sw2.lat, sw.lat);
      sw.lng = Math.min(sw2.lng, sw.lng);
      ne.lat = Math.max(ne2.lat, ne.lat);
      ne.lng = Math.max(ne2.lng, ne.lng);
    }

    return this;
  }

  getCenter(): Cordinates {
    return new Cordinates(
      (this._sw.lat + this._ne.lat) / 2,
      (this._sw.lng + this._ne.lng) / 2
    );
  }

  get sw(): Cordinates {
    return this._sw;
  }

  get ne(): Cordinates {
    return this._ne;
  }

  get nw(): Cordinates {
    if (!this._sw) return new Cordinates(0, 0);
    return new Cordinates(this.north, this.west);
  }

  get se(): Cordinates {
    if (!this._sw) return new Cordinates(0, 0);
    return new Cordinates(this.south, this.east);
  }

  get west(): number {
    return this._sw?.lng;
  }

  get south(): number {
    return this._sw?.lat;
  }

  get east(): number {
    return this._ne?.lng;
  }

  get north(): number {
    return this._ne?.lat;
  }
}
