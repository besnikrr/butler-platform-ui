import i18n, { Resource } from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";

/**
 * @param resources: {{lang: { translation: file }}}
 */
function initLocalization(resources: Resource) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: { default: ["en"] },
    interpolation: {
      escapeValue: false,
    },
  });
}

export { useTranslation, initReactI18next, initLocalization };
