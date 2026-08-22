import githubIcon from "../../assets/github.svg";
import pypiIcon from "../../assets/pypi.svg";
import rtdIcon from "../../assets/rtd.svg";

const footerLinks = [
  {
    href: "https://pypi.org/p/aiosend/",
    label: "PyPI",
    icon: pypiIcon,
  },
  {
    href: "https://aiosend.rtfd.io",
    label: "Docs",
    icon: rtdIcon,
  },
  {
    href: "https://github.com/vovchic17/aiosend",
    label: "GitHub",
    icon: githubIcon,
  },
];

export function AppFooter() {
  return (
    <footer className="flex min-h-12 flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-subtle-border px-4 py-4 text-small text-content-muted sm:gap-8 sm:px-6">
      {footerLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <img src={link.icon} alt="" aria-hidden="true" className="h-4 w-4" />
          <span>{link.label}</span>
        </a>
      ))}
    </footer>
  );
}
