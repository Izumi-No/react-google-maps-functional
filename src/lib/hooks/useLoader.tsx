import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google: any;
  }
}

type Props = {
  apiKey?: string;
  initialCenter?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
};

export function useGoogleMaps({
  apiKey,
  initialCenter,
  zoom,
}: Props): [React.RefObject<HTMLDivElement>, any] {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>();

  const loader = new Loader({
    apiKey: apiKey || "",
    version: "weekly",
  });

  useEffect(() => {
    loader.load().then(() => {
      setMap(
        new window.google.maps.Map(ref.current, {
          center: initialCenter,
          zoom: zoom || 8,
        })
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return [ref, map];
}
