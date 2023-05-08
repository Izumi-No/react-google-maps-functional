import { Cordinates } from "./cordinates";
import { wrap } from "./math/wrap";
import { Point } from "./point";

export class Transform {
  public width = 0;
  public height = 0;
  private _zoom = 0;
  public center = new Cordinates(0, 0);
  public angle = 0;
  //public latRange = [-85.05113, 85.05113];
  private _scale = 1;
  private _tileZoom?: number;
  public zoomFraction?: number;

  constructor(
    private tileSize = 512,
    private _minZoom = 0,
    private _maxZoom = 52
  ) {}

  get minZoom(): number {
    return this._minZoom;
  }

  set minZoom(zoom: number) {
    this._minZoom = zoom;
    this.zoom = Math.max(this.zoom, zoom);
  }

  get maxZoom(): number {
    return this._maxZoom;
  }

  set maxZoom(zoom: number) {
    this._maxZoom = zoom;
    this.zoom = Math.min(this.zoom, zoom);
  }

  get worldSize(): number {
    return this.tileSize * this._scale;
  }

  get centerPoint(): Point {
    return new Point(0, 0); // this.size._div(2);
  }

  get size(): Point {
    return new Point(this.width, this.height);
  }

  get bearing(): number {
    return (-this.angle / Math.PI) * 180;
  }

  set bearing(bearing: number) {
    this.angle = (-wrap(bearing, -180, 180) * Math.PI) / 180;
  }

  get zoom(): number {
    return this._zoom;
  }

  set zoom(zoom: number) {
    const zoomV = Math.min(Math.max(zoom, this.minZoom), this.maxZoom);
    this._zoom = zoomV;
    this._scale = this.zoomScale(zoomV);
    this._tileZoom = Math.floor(zoomV);
    this.zoomFraction = zoomV - this._tileZoom;
  }

  zoomScale(zoom: number): number {
    return Math.pow(2, zoom);
  }

  scaleZoom(scale: number): number {
    return Math.log(scale) / Math.LN2;
  }

  project(cordiCordinates: Cordinates, worldSize?: number): Point {
    return new Point(
      this.lngX(cordiCordinates.lng, worldSize),
      this.latY(cordiCordinates.lat, worldSize)
    );
  }

  unproject(point: Point, worldSize?: number): Cordinates {
    return new Cordinates(
      this.yLat(point.y, worldSize),
      this.xLng(point.x, worldSize)
    );
  }

  get x(): number {
    return this.lngX(this.center.lng);
  }

  get y(): number {
    return this.latY(this.center.lat);
  }

  get point(): Point {
    return new Point(this.x, this.y);
  }

  // lat/lon <-> absolute pixel coords conversion
  private lngX(lon: number, worldSize?: number): number {
    return ((180 + lon) * (worldSize || this.worldSize)) / 360;
  }

  // latitude to absolute y coord
  private latY(lat: number, worldSize?: number): number {
    const y =
      (180 / Math.PI) * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
    return ((180 - y) * (worldSize || this.worldSize)) / 360;
  }

  private xLng(x: number, worldSize?: number): number {
    return (x * 360) / (worldSize || this.worldSize) - 180;
  }

  private yLat(y: number, worldSize?: number): number {
    const y2 = 180 - (y * 360) / (worldSize || this.worldSize);
    return (360 / Math.PI) * Math.atan(Math.exp((y2 * Math.PI) / 180)) - 90;
  }

  locationPoint(coordinates: Cordinates): Point {
    const p = this.project(coordinates);
    return this.centerPoint.subtract(this.point.subtract(p).rotate(this.angle));
  }

  pointLocation(p: Point): Cordinates {
    const p2 = this.centerPoint.subtract(p).rotate(-this.angle);
    return this.unproject(this.point.subtract(p2));
  }
}
