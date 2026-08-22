import { type FC, type SVGAttributes } from "react";

export interface SVGIconContainerProps extends SVGAttributes<SVGElement> {
  height?: number;
  width?: number;
}

export const SVGIconContainer: FC<SVGIconContainerProps> =
  function SVGIconContainer({ height = 16, width = 16, children, ...props }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        stroke="none"
        viewBox={`0 0 ${width} ${height}`}
        height="1em"
        width={`${width / height}em`}
        {...props}
        style={{ pointerEvents: "none", flexShrink: 0, ...props.style }}
      >
        {children}
      </svg>
    );
  };
