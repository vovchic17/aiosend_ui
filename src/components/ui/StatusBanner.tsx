import type { ReactNode } from "react";

type StatusBannerVariant = "network" | "suspended";

type StatusBannerProps = {
  variant: StatusBannerVariant;
  title: string;
  subtitle: string;
  className?: string;
};

function NetworkIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M23.3499 21.9834L28.7999 25.1334"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <path
        d="M28.7999 14.9668L23.3499 18.1168"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <path
        d="M20 11.7832V16.1665"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <path
        d="M20 23.9336V28.0669"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <path
        d="M28.8166 14.9665V12.1999L23.3666 9.04987V9.99987L19.9999 11.9332L16.6333 9.99987V9.0332L11.1833 12.1832V14.9665L8.7666 16.3665V23.7665L11.1833 25.1499V27.8999L16.6333 31.0499V29.9999L19.9999 28.0665L23.3666 29.9999V31.0165L28.8166 27.8832V25.1499L31.1833 23.7832V16.3332L28.8166 14.9665Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <path
        d="M16.6333 21.9834L11.2 25.1334"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <path
        d="M10.8833 14.7832L16.6333 18.0999"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <path
        d="M23.3666 30.0007L20 28.0674L16.6333 30.0007V33.9007L20 35.834L23.3666 33.9007V30.0007Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <path
        d="M23.3666 30L20 31.95L16.6333 30"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <path
        d="M20 35.8335V31.9502"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <path
        d="M11.1832 11.0837L7.83322 9.15039L4.46655 11.0837V14.9671L7.83322 16.9171L11.1832 14.9671V11.0837Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <path
        d="M11.1832 11.084L7.83322 13.034L4.46655 11.084"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <path
        d="M7.83325 16.9165V13.0332"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <path
        d="M28.8167 11.0837L32.1666 9.15039L35.5333 11.0837V14.9671L32.1666 16.9171L28.8167 14.9671V11.0837Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <path
        d="M28.8167 11.084L32.1666 13.034L35.5333 11.084"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <path
        d="M32.1665 16.9165V13.0332"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <path
        d="M11.1832 25.1501L7.83322 23.2168L4.46655 25.1501V29.0335L7.83322 30.9835L11.1832 29.0335V25.1501Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <path
        d="M11.1832 25.1504L7.83322 27.1004L4.46655 25.1504"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <path
        d="M7.83325 30.9839V27.1006"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <path
        d="M28.8167 25.1501L32.1666 23.2168L35.5333 25.1501V29.0335L32.1666 30.9835L28.8167 29.0335V25.1501Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <path
        d="M28.8167 25.1504L32.1666 27.1004L35.5333 25.1504"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <path
        d="M32.1665 30.9839V27.1006"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <path
        d="M23.3666 6.11699L20 4.16699L16.6333 6.11699V10.0003L20 11.9337L23.3666 10.0003V6.11699Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <path
        d="M23.3666 6.11719L20 8.05052L16.6333 6.11719"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <path
        d="M20 11.9341V8.05078"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <path
        d="M23.3666 18.117L20 16.167L16.6333 18.117V22.0003L20 23.9337L23.3666 22.0003V18.117Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <path
        d="M23.3666 18.1172L20 20.0505L16.6333 18.1172"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <path
        d="M20 23.9341V20.0508"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SuspendedIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20.0002 28V35M20.0002 28L15.8676 32M20.0002 28L24.1327 32M20.0002 28V12M20.0002 5V12M20.0002 12L15.8676 8M20.0002 12L24.1327 8M12.8422 23.9993L6.57906 27.4993M12.8422 23.9993L7.19696 22.5352M12.8422 23.9993L11.3295 29.4634M12.8422 23.9993L27.1578 15.9993M33.421 12.4993L27.1578 15.9993M27.1578 15.9993L28.6705 10.5352M27.1578 15.9993L32.8031 17.4634M27.1576 23.9993L33.4208 27.4993M27.1576 23.9993L32.8029 22.5352M27.1576 23.9993L28.6703 29.4634M27.1576 23.9993L12.842 15.9993M6.57886 12.4993L12.842 15.9993M12.842 15.9993L11.3293 10.5352M12.842 15.9993L7.19676 17.4634"
        stroke="currentColor"
        strokeOpacity="0.8"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const variants = {
  network: {
    Icon: NetworkIcon,
    background: "bg-status-blue-surface",
    titleColor: "text-status-blue",
    subtitleColor: "text-content-muted",
  },

  suspended: {
    Icon: SuspendedIcon,
    background: "bg-status-grey-surface",
    titleColor: "text-status-grey",
    subtitleColor: "text-content-muted-light",
  },
} satisfies Record<
  StatusBannerVariant,
  {
    Icon: () => ReactNode;
    background: string;
    titleColor: string;
    subtitleColor: string;
  }
>;

export function StatusBanner({
  variant,
  title,
  subtitle,
  className = "",
}: StatusBannerProps) {
  const { Icon, background, titleColor, subtitleColor } = variants[variant];

  return (
    <div
      className={`
        w-full
        px-4 py-5 sm:px-6 lg:px-8 lg:py-6
        flex items-start gap-3 sm:items-center
        rounded-[20px] sm:rounded-3xl
        ${background}
        ${className}
      `}
    >
      <div
        className={`
          w-10 h-10 shrink-0
          flex items-center justify-center
          ${titleColor}
        `}
      >
        <Icon />
      </div>

      <div className="flex flex-col gap-1">
        <p className={`text-body-accent ${titleColor}`}>{title}</p>

        <p className={`text-body ${subtitleColor}`}>{subtitle}</p>
      </div>
    </div>
  );
}
