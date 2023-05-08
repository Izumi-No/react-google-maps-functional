import { useGoogleMaps } from "../hooks/useLoader";
import { Props as UseGoogleMapsProps } from "../hooks/useLoader";

interface Props extends React.HTMLProps<HTMLDivElement> {
  width?: string;
  height?: string;
  mapProps?: UseGoogleMapsProps;
}

export function Map({ height, width, mapProps, ...rest }: Props) {
  const [mapRef, map] = useGoogleMaps(mapProps || {});

  return (
    <div
      style={{ width: width || "100%", height: height || "100%" }}
      ref={mapRef}
      {...rest}
    ></div>
  );
}
