import { type FC } from "react";
import {
  SVGIconContainer,
  type SVGIconContainerProps,
} from "../SVGIconContainer";

export const MDLIcon: FC<SVGIconContainerProps> = function MDLIcon(props) {
  return (
    <SVGIconContainer height={32} width={32} {...props}>
      <title>MDL</title>
      <path
        d="M23.7342 24.4294C23.7342 25.3217 23.0839 25.9115 22.1311 25.9115H13.6013C11.8167 25.9115 11 25.1553 11 23.4614V6.99168C11 5.81203 11.6352 5.11633 12.7241 5.11633C13.7979 5.11633 14.4331 5.81203 14.4331 6.99168V22.9321H22.1311C23.0839 22.9321 23.7342 23.5371 23.7342 24.4294Z"
        fill="currentColor"
      />
    </SVGIconContainer>
  );
};
