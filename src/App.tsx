import { useGoogleMaps } from "./lib/hooks/useLoader";

function App() {
  const [mapRef, map] = useGoogleMaps({});

  return <div style={{ width: "100vw", height: "100vh" }} ref={mapRef}></div>;
}

export default App;
