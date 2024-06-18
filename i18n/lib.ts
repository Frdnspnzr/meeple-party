import { GameLanguage, PageLanguage, RealLanguage } from "./types";

/**
 * Determines what language to use for the page given the user-selected page language and the fallback language.
 * @param pageLanguage The language the user selected as page language
 * @param fallbackLanguage The fallback language to use
 * @returns
 */
export function determineLanguage(
  pageLanguage: PageLanguage,
  fallbackLanguage: RealLanguage
) {
  if (pageLanguage === "auto") {
    return fallbackLanguage;
  } else {
    return pageLanguage;
  }
}

/**
 * Determines what language to use for game names given the user-selected game and page languages and the fallback language.
 * @param gameLanguage The language the user selected as game language
 * @param pageLanguage The language the user selected as page language
 * @param fallbackLanguage The fallback language to use
 * @returns
 */
export function determineGameLanguage(
  gameLanguage: GameLanguage,
  pageLanguage: PageLanguage,
  fallbackLanguage: RealLanguage
) {
  if (gameLanguage === "auto") {
    return fallbackLanguage;
  } else if (gameLanguage === "follow") {
    return determineLanguage(pageLanguage, fallbackLanguage);
  } else {
    return gameLanguage;
  }
}
