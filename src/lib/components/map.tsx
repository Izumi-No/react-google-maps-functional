import { useGoogleMaps } from "../hooks/useLoader";

export function Map() {
  const [mapRef, map] = useGoogleMaps({});

  return <div style={{ width: "100vw", height: "100vh" }} ref={mapRef}></div>;
}
