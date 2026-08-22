import moonIcon from "../../assets/moon.svg";
import sunIcon from "../../assets/sun.svg";
import { useLanguage } from "../../i18n";
import { useTheme } from "../../theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  const isDark = theme === "dark";
  const label = isDark
    ? t.accessibility.switchToLightTheme
    : t.accessibility.switchToDarkTheme;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition hover:opacity-80 lg:h-6 lg:w-6"
    >
      <img
        src={isDark ? moonIcon : sunIcon}
        alt=""
        aria-hidden="true"
        className={[
          "h-6 w-6 transition",
          isDark ? "brightness-100" : "brightness-0",
        ].join(" ")}
      />
    </button>
  );
}
