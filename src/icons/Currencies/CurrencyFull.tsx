import { type FC } from 'react';
import { CurrencyIcon } from './Currency';

interface Props {
  className?: string;
  code: string;
  size: number;
  padding: number;
  bgColor?: string;
}

export const CurrencyFullIcon: FC<Props> = function CurrencyFullIcon({
  code,
  size,
  padding,
  className,
  bgColor = 'var(--color-gray)',
}) {
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        height: size,
        width: size,
        borderRadius: '50%',
        overflow: 'hidden',
        padding,
        color: '#ffffff',
        backgroundColor: bgColor,
      }}
    >
      <CurrencyIcon
        code={code}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </span>
  );
};
