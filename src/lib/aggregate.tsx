import { Map } from "./components/map";
import { MarkerElement, MarkersContainer } from "./components/markersContainer";

function markerAsArray(marker: MarkerElement | MarkerElement[]) {
  return Array.isArray(marker) ? marker : [marker];
}

export function MapAggregate({
  children,
}: {
  children?: MarkerElement | MarkerElement[];
}) {
  return (
    <>
      <Map />
      <MarkersContainer markers={children ? markerAsArray(children) : []} />
    </>
  );
}
