import { Cordinates } from "./cordinates";
import { Point } from "./point";
import { Transform } from "./transform";

export default class Geo {
  private _hasSize = false;
  private _hasView = false;
  private _transform: Transform;

  private _maps?: any;
  private _mapCanvasProjection?: any;

  constructor(tileSize = 512) {
    this._transform = new Transform(tileSize);
  }

  public setView(center: Cordinates, zoom: number, bearing: number): void {
    this._transform.center = Cordinates.convert(center);
    this._transform.zoom = +zoom;
    this._transform.bearing = +bearing;
    this._hasView = true;
  }

  public setViewSize(width: number, height: number): void {
    this._transform.width = width;
    this._transform.height = height;
    this._hasSize = true;
  }

  public setMapCanvasProjection(maps: any, mapCanvasProjection: any): void {
    this._maps = maps;
    this._mapCanvasProjection = mapCanvasProjection;
  }

  public canProject(): boolean {
    return this._hasSize && this._hasView;
  }

  public hasSize(): boolean {
    return this._hasSize;
  }

  /** Returns the pixel position relative to the map center. */
  public fromCordinatesToCenterPixel(ptCordinates: Cordinates): Point {
    return this._transform.locationPoint(Cordinates.convert(ptCordinates));
  }

  /**
   * Returns the pixel position relative to the map panes,
   * or relative to the map center if there are no panes.
   */
  public fromCordinatesToDivPixel(ptCordinates: Cordinates): Point {
    if (this._mapCanvasProjection) {
      const corCordinates = new this._maps.Cordinates(
        ptCordinates.lat,
        ptCordinates.lng
      );
      return this._mapCanvasProjection.fromCordinatesToDivPixel(corCordinates);
    }
    return this.fromCordinatesToCenterPixel(ptCordinates);
  }

  /** Returns the pixel position relative to the map top-left. */
  public fromCordinatesToContainerPixel(ptCordinates: Cordinates): Point {
    if (this._mapCanvasProjection) {
      const corCordinates = new this._maps.Cordinates(
        ptCordinates.lat,
        ptCordinates.lng
      );
      return this._mapCanvasProjection.fromCordinatesToContainerPixel(
        corCordinates
      );
    }

    const pt = this.fromCordinatesToCenterPixel(ptCordinates);
    pt.x -=
      this._transform.worldSize * Math.round(pt.x / this._transform.worldSize);

    pt.x += this._transform.width / 2;
    pt.y += this._transform.height / 2;

    return pt;
  }

  /** Returns the Cordinates for the given offset from the map top-left. */
  public fromContainerPixelToCordinates(ptXY: Point): Cordinates {
    if (this._mapCanvasProjection) {
      const corCordinates =
        this._mapCanvasProjection.fromContainerPixelToCordinates(ptXY);
      return new Cordinates(corCordinates.lat(), corCordinates.lng());
    }

    const ptxy = { ...ptXY };
    ptxy.x -= this._transform.width / 2;
    ptxy.y -= this._transform.height / 2;
    const ptRes = this._transform.pointLocation(Point.convert(ptxy));

    ptRes.lng -= 360 * Math.round(ptRes.lng / 360); // convert 2 google format
    return ptRes;
  }

  public getWidth(): number {
    return this._transform.width;
  }

  public getHeight(): number {
    return this._transform.height;
  }

  public getZoom(): number {
    return this._transform.zoom;
  }

  public getCenter(): Cordinates {
    const ptRes = this._transform.pointLocation(new Point(0, 0));

    return ptRes;
  }

  getBounds(margins: number[] | undefined, roundFactor: number): number[] {
    const bndT = (margins && margins[0]) || 0;
    const bndR = (margins && margins[1]) || 0;
    const bndB = (margins && margins[2]) || 0;
    const bndL = (margins && margins[3]) || 0;

    if (
      this.getWidth() - bndR - bndL > 0 &&
      this.getHeight() - bndT - bndB > 0
    ) {
      const topLeftCorner = this._transform.pointLocation(
        Point.convert({
          x: bndL - this.getWidth() / 2,
          y: bndT - this.getHeight() / 2,
        })
      );
      const bottomRightCorner = this._transform.pointLocation(
        Point.convert({
          x: this.getWidth() / 2 - bndR,
          y: this.getHeight() / 2 - bndB,
        })
      );

      let res = [
        topLeftCorner.lat,
        topLeftCorner.lng, // NW
        bottomRightCorner.lat,
        bottomRightCorner.lng, // SE
        bottomRightCorner.lat,
        topLeftCorner.lng, // SW
        topLeftCorner.lat,
        bottomRightCorner.lng, // NE
      ];

      if (roundFactor) {
        res = res.map((r) => Math.round(r * roundFactor) / roundFactor);
      }
      return res;
    }

    return [0, 0, 0, 0];
  }
}
