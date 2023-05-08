import { ReactNode, useState } from "react";
import { Marker } from "./marker";

type Props = {
  markers: (typeof Marker)[];
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
