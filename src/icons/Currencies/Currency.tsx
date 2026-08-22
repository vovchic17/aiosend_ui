import { type FC } from 'react';
import { AEDIcon } from './AED';
import { AMDIcon } from './AMD';
import { AZNIcon } from './AZN';
import { BRLIcon } from './BRL';
import { BYNIcon } from './BYN';
import { CNYIcon } from './CNY';
import { EURIcon } from './EUR';
import { GBPIcon } from './GBP';
import { GELIcon } from './GEL';
import { IDRIcon } from './IDR';
import { ILSIcon } from './ILS';
import { INRIcon } from './INR';
import { KGSIcon } from './KGS';
import { KZTIcon } from './KZT';
import { PLNIcon } from './PLN';
import { RUBIcon } from './RUB';
import { THBIcon } from './THB';
import { TJSIcon } from './TJS';
import { TRYIcon } from './TRY';
import { MDLIcon } from './MDL';
import { UAHIcon } from './UAH';
import { USDIcon } from './USD';
import { UZSIcon } from './UZS';
import { LKRIcon } from './LKR';
import { BTCIcon } from './BTC';
import { USDTIcon } from './USDT';
import { type SVGIconContainerProps } from '../SVGIconContainer';

interface Props extends SVGIconContainerProps {
  code: string;
}

export const CurrencyIcon: FC<Props> = ({ code, ...props }) => {
  if (code === 'AED') return <AEDIcon {...props} />;
  if (code === 'AMD') return <AMDIcon {...props} />;
  if (code === 'AZN') return <AZNIcon {...props} />;
  if (code === 'BRL') return <BRLIcon {...props} />;
  if (code === 'BYN') return <BYNIcon {...props} />;
  if (code === 'CNY') return <CNYIcon {...props} />;
  if (code === 'EUR') return <EURIcon {...props} />;
  if (code === 'GBP') return <GBPIcon {...props} />;
  if (code === 'GEL') return <GELIcon {...props} />;
  if (code === 'IDR') return <IDRIcon {...props} />;
  if (code === 'ILS') return <ILSIcon {...props} />;
  if (code === 'INR') return <INRIcon {...props} />;
  if (code === 'KGS') return <KGSIcon {...props} />;
  if (code === 'KZT') return <KZTIcon {...props} />;
  if (code === 'PLN') return <PLNIcon {...props} />;
  if (code === 'RUB') return <RUBIcon {...props} />;
  if (code === 'THB') return <THBIcon {...props} />;
  if (code === 'TJS') return <TJSIcon {...props} />;
  if (code === 'TRY') return <TRYIcon {...props} />;
  if (code === 'MDL') return <MDLIcon {...props} />;
  if (code === 'UAH') return <UAHIcon {...props} />;
  if (code === 'USD') return <USDIcon {...props} />;
  if (code === 'UZS') return <UZSIcon {...props} />;
  if (code === 'LKR') return <LKRIcon {...props} />;
  if (code === 'BTC') return <BTCIcon {...props} />;
  if (code === 'USDT') return <USDTIcon {...props} />;

  return (
    <span
      className={props.className}
      style={{
        width: '1em',
        height: '1em',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: props.fontSize ?? '1em',
        color: 'currentColor',
        fontWeight: 500,
        lineHeight: 1,
        userSelect: 'none',
        ...props.style,
      }}
    >
      {code}
    </span>
  );
};
