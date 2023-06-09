import React, { ReactElement } from "react";

export type MarkerElement = ReactElement<{ lat: number; lng: number }>;

type Props = {
  markers: MarkerElement[];
};

export function MarkersContainer({ markers }: Props) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        left: "0",
        top: "0",
        margin: "0",
        padding: "0",
      }}
    ></div>
  );
}
