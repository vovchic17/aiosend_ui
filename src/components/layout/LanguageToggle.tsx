import ruIcon from "../../assets/ru.svg";
import usIcon from "../../assets/us.svg";
import { useLanguage } from "../../i18n";
import { dictionaries } from "../../i18n/dictionaries";

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  const isRussian = language === "ru";
  const nextLanguageLabel = isRussian
    ? dictionaries.en.accessibility.switchToEnglish
    : dictionaries.ru.accessibility.switchToRussian;

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={nextLanguageLabel}
      title={nextLanguageLabel}
      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition hover:opacity-80 lg:h-6 lg:w-6"
    >
      <img
        src={isRussian ? ruIcon : usIcon}
        alt=""
        aria-hidden="true"
        className="h-6 w-6 object-contain"
      />
    </button>
  );
}
