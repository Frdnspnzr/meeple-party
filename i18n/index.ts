import { getServerUser } from "@/utility/serverSession";
import { getUserPreferences } from "@/utility/userProfile";
import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";
import { determineGameLanguage, determineLanguage } from "./lib";
import { fallbackLng, getOptions } from "./settings";

const initI18next = async (ns?: string) => {
  const lng = await getLanguage();
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (lng: string, ns: string) => import(`./locales/${lng}/${ns}.json`)
      )
    )
    .init(getOptions(lng, ns));
  return i18nInstance;
};

export async function getTranslation(ns?: string, options: any = {}) {
  const lng = await getLanguage();
  const i18nextInstance = await initI18next(ns);
  return {
    t: i18nextInstance.getFixedT(
      lng,
      Array.isArray(ns) ? ns[0] : ns,
      options.keyPrefix
    ),
    i18n: i18nextInstance,
  };
}

/**
 * Reads the current users prefered page language.
 * @returns The two-letter language code of the selected language.
 */
export async function getLanguage() {
  try {
    const user = await getServerUser();
    const preferences = getUserPreferences(user);
    return determineLanguage(preferences.pageLanguage, fallbackLng);
  } catch {
    return fallbackLng;
  }
}

/**
 * Reads the current users prefered language for game names.
 * @returns The two-letter language code of the selected language.
 */
export async function getGameLanguage() {
  try {
    const user = await getServerUser();
    const preferences = getUserPreferences(user);
    return determineGameLanguage(
      preferences.gameLanguage,
      preferences.pageLanguage,
      fallbackLng
    );
  } catch {
    return fallbackLng;
  }
}
