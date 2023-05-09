import { useGoogleMaps } from "../hooks/useLoader";
import { Props as UseGoogleMapsProps } from "../hooks/useLoader";

interface Props extends React.HTMLProps<HTMLDivElement> {
  mapProps?: UseGoogleMapsProps;
}

export function Map({ mapProps, ...rest }: Props) {
  const [mapRef] = useGoogleMaps(mapProps || {});

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
      ref={mapRef}
      {...rest}
    ></div>
  );
}
