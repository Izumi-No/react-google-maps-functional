import { Cordinates } from "./cordinates";
import CordinatesBounds from "./cordinatesBonds";
import log2 from "./math/log2";
import { Point } from "./point";

export default class MapUtils {
  private static readonly GOOGLE_TILE_SIZE: number = 256;

  private static cordinates2World({ lat, lng }: Cordinates): Cordinates {
    const sin = Math.sin((lat * Math.PI) / 180);
    const x = lng / 360 + 0.5;
    let y = 0.5 - (0.25 * Math.log((1 + sin) / (1 - sin))) / Math.PI;

    y =
      y < 0 // eslint-disable-line
        ? 0
        : y > 1
        ? 1
        : y;
    return new Cordinates(x, y);
  }

  private static cordinatesCordinates2World(
    cordinatesCordinates: Cordinates
  ): Cordinates {
    const sin: number = Math.sin((cordinatesCordinates.lat * Math.PI) / 180);
    const x: number = cordinatesCordinates.lng / 360 + 0.5;
    let y: number = 0.5 - (0.25 * Math.log((1 + sin) / (1 - sin))) / Math.PI;

    y = y < 0 ? 0 : y > 1 ? 1 : y;
    return new Cordinates(x, y);
  }

  private static world2Cordinates({ x, y }: Cordinates): Cordinates;

  private static world2Cordinates(world: Cordinates): Cordinates {
    const n: number = Math.PI - 2 * Math.PI * world.y;
    return new Cordinates(
      (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))),
      world.lat * 360 - 180
    );
  }

  private static cordinatesCordinates2MetersPerDegree(
    cordinatesCordinates: Cordinates
  ): { metersPerLatDegree: number; metersPerLngDegree: number } {
    const phi: number = (cordinatesCordinates.lat * Math.PI) / 180;
    const metersPerLatDegree: number =
      111132.92 -
      559.82 * Math.cos(2 * phi) +
      1.175 * Math.cos(4 * phi) -
      0.0023 * Math.cos(6 * phi);
    const metersPerLngDegree: number =
      111412.84 * Math.cos(phi) -
      93.5 * Math.cos(3 * phi) +
      0.118 * Math.cos(5 * phi);
    return { metersPerLatDegree, metersPerLngDegree };
  }

  private static meters2CordinatesBounds(
    meters: number,
    center: Cordinates
  ): CordinatesBounds {
    const { metersPerLatDegree, metersPerLngDegree } =
      MapUtils.cordinatesCordinates2MetersPerDegree(center);

    const latDelta: number = (0.5 * meters) / metersPerLatDegree;
    const lngDelta: number = (0.5 * meters) / metersPerLngDegree;

    return new CordinatesBounds(
      new Cordinates(center.lat - latDelta, center.lng - lngDelta),
      new Cordinates(center.lat + latDelta, center.lng + lngDelta)
    );
  }

  private static meters2WorldSize(
    meters: number,
    center: Cordinates
  ): { w: number; h: number } {
    const { nw, se } = MapUtils.meters2CordinatesBounds(meters, center);
    const nwWorld: Cordinates = MapUtils.cordinatesCordinates2World(nw!);
    const seWorld: Cordinates = MapUtils.cordinatesCordinates2World(se!);
    const w: number = Math.abs(seWorld.x - nwWorld.x);
    const h: number = Math.abs(seWorld.y - nwWorld.y);

    return { w, h };
  }

  static fitNwSe(
    nw: Cordinates,
    se: Cordinates,
    width: number,
    height: number
  ) {
    const EPS = 0.000000001;
    const nwWorld = this.cordinates2World(nw);
    const seWorld = this.cordinates2World(se);
    const dx =
      nwWorld.x < seWorld.x ? seWorld.x - nwWorld.x : 1 - nwWorld.x + seWorld.x;
    const dy = seWorld.y - nwWorld.y;

    if (dx <= 0 && dy <= 0) {
      return null;
    }

    const zoomX = log2(width / this.GOOGLE_TILE_SIZE / Math.abs(dx));
    const zoomY = log2(height / this.GOOGLE_TILE_SIZE / Math.abs(dy));
    const zoom = Math.floor(EPS + Math.min(zoomX, zoomY));

    // TODO find center just unproject middle world point
    const middle = {
      x:
        nwWorld.x < seWorld.x // eslint-disable-line
          ? 0.5 * (nwWorld.x + seWorld.x)
          : nwWorld.x + seWorld.x - 1 > 0
          ? 0.5 * (nwWorld.x + seWorld.x - 1)
          : 0.5 * (1 + nwWorld.x + seWorld.x),
      y: 0.5 * (nwWorld.y + seWorld.y),
    };

    const scale = Math.pow(2, zoom);
    const halfW = width / scale / this.GOOGLE_TILE_SIZE / 2;
    const halfH = height / scale / this.GOOGLE_TILE_SIZE / 2;

    const newNW = this.world2Cordinates(
      Cordinates.convert({
        x: middle.x - halfW,
        y: middle.y - halfH,
      })
    );

    const newSE = this.world2Cordinates(
      Cordinates.convert({
        x: middle.x + halfW,
        y: middle.y + halfH,
      })
    );

    return {
      center: this.world2Cordinates(Cordinates.convert(middle)),
      zoom,
      newBounds: {
        nw: newNW,
        se: newSE,
      },
    };
  }

  static convertNeSwToNwSe({ ne, sw }: CordinatesBounds): CordinatesBounds {
    return new CordinatesBounds(
      Cordinates.convert({
        lat: ne.lat,
        lng: sw.lng,
      }),
      Cordinates.convert({
        lat: sw.lat,
        lng: ne.lng,
      })
    );
  }

  private static convertNwSeToNeSw({
    nw,
    se,
  }: CordinatesBounds): CordinatesBounds {
    return new CordinatesBounds(
      Cordinates.convert({
        lat: nw.lat,
        lng: se.lng,
      }),
      Cordinates.convert({
        lat: se.lat,
        lng: nw.lng,
      })
    );
  }

  staticconvertNwSeToNeSw({ nw, se }: CordinatesBounds): CordinatesBounds {
    return new CordinatesBounds(
      Cordinates.convert({
        lat: nw.lat,
        lng: se.lng,
      }),
      Cordinates.convert({
        lat: se.lat,
        lng: nw.lng,
      })
    );
  }

  static fitBounds(
    { nw, se, ne, sw }: CordinatesBounds,
    { width, height }: { width: number; height: number }
  ) {
    let fittedData;

    if (nw && se) {
      fittedData = this.fitNwSe(nw, se, width, height);
    } else {
      const calculatedNwSe = this.convertNeSwToNwSe(
        new CordinatesBounds(ne, sw)
      );
      fittedData = this.fitNwSe(
        calculatedNwSe.nw,
        calculatedNwSe.se,
        width,
        height
      );
    }

    return {
      ...fittedData,
      newBounds: {
        ...fittedData?.newBounds,
        ...this.convertNwSeToNeSw(
          new CordinatesBounds(
            fittedData?.newBounds.nw,
            fittedData?.newBounds.se
          )
        ),
      },
    };
  }

  // -------------------------------------------------------------------
  // Helpers to calc some markers size

  static meters2ScreenPixels(
    meters: number,
    { lat, lng }: Cordinates,
    zoom: number
  ) {
    const { w, h } = this.meters2WorldSize(
      meters,
      Cordinates.convert({ lat, lng })
    );
    const scale = Math.pow(2, zoom);
    const wScreen = w * scale * this.GOOGLE_TILE_SIZE;
    const hScreen = h * scale * this.GOOGLE_TILE_SIZE;
    return {
      w: wScreen,
      h: hScreen,
    };
  }

  // --------------------------------------------------
  // Helper functions for working with svg tiles, (examples coming soon)

  static tile2Cordinates({ x, y }: Point, zoom: number): Cordinates {
    const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, zoom);

    return new Cordinates(
      (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))),
      (x / Math.pow(2, zoom)) * 360 - 180
    );
  }

  static cordinates2Tile({ lat, lng }: Cordinates, zoom: number): Point {
    const worldCoords = this.cordinates2World(Cordinates.convert({ lat, lng }));
    const scale = Math.pow(2, zoom);

    return Point.convert({
      x: Math.floor(worldCoords.x * scale),
      y: Math.floor(worldCoords.y * scale),
    });
  }

  static getTilesIds({ from, to }: { from: Point; to: Point }, zoom: number) {
    const scale = Math.pow(2, zoom);

    const ids = [];
    for (let x = from.x; x !== (to.x + 1) % scale; x = (x + 1) % scale) {
      for (let y = from.y; y !== (to.y + 1) % scale; y = (y + 1) % scale) {
        ids.push([zoom, x, y]);
      }
    }

    return ids;
  }
}
