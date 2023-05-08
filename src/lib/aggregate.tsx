import { PropsWithChildren, ReactNode } from "react";
import { Map } from "./components/map";
import { MarkersContainer } from "./components/markersContainer";

export function MapAggregate({ children }: PropsWithChildren) {
  return (
    <>
      <Map />
      <MarkersContainer
        markers={
          children
            ? Array.isArray(children)
              ? (children as ReactNode[])
              : [children]
            : ([] as ReactNode[])
        }
      />
    </>
  );
}
