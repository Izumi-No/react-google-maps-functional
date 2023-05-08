import { PropsWithChildren } from "react";

interface props extends React.HTMLProps<HTMLDivElement> {
  lat: number;
  lng: number;
  isHidden?: boolean;
}

export function Marker({
  children,
  lng,
  lat,
  style,
  isHidden,
  ...rest
}: PropsWithChildren<props>) {
  return (
    <div
      style={{
        ...style,
        display: isHidden ? "none" : undefined,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
