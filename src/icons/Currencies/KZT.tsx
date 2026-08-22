import { type FC } from 'react';
import {
  SVGIconContainer,
  type SVGIconContainerProps,
} from '../SVGIconContainer';

export const KZTIcon: FC<SVGIconContainerProps> = function KZTIcon(props) {
  return (
    <SVGIconContainer
      height={32}
      width={32}
      {...props}
    >
      <title>KZT</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.8785 6.78607C23.8785 7.53314 23.2715 8.10901 22.5556 8.10901H9.66864C8.93713 8.10901 8.3457 7.53314 8.3457 6.78607C8.3457 6.05457 8.93713 5.46313 9.66864 5.46313H22.5556C23.2715 5.46313 23.8785 6.05457 23.8785 6.78607ZM17.8708 13.3696V25.1204C17.8708 26.0854 17.0771 26.8792 16.1121 26.8792C15.1316 26.8792 14.3378 26.0854 14.3378 25.1204V13.3696H9.66864C8.93713 13.3696 8.3457 12.7782 8.3457 12.0467C8.3457 11.2996 8.93713 10.7238 9.66864 10.7238H22.5556C23.2715 10.7238 23.8785 11.2996 23.8785 12.0467C23.8785 12.7782 23.2715 13.3696 22.5556 13.3696H17.8708Z"
        fill="currentColor"
      />
    </SVGIconContainer>
  );
};
