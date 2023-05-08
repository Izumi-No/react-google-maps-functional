import { PropsWithChildren } from "react";

type props = {
  lat: number;
  lng: number;
};

export function Marker({ children }: PropsWithChildren<props>) {
  return <>{children}</>;
}
