import { getRandomPageLanguage, getRandomRealLanguage } from "@/utility/test";
import { determineGameLanguage, determineLanguage } from "../lib";

describe("determineLanguage", () => {
  it("returns fallback language when set to auto", () => {
    const fallbackLanguage = getRandomRealLanguage();
    const result = determineLanguage("auto", fallbackLanguage);
    expect(result).toBe(fallbackLanguage);
  });
  it("returns language", () => {
    const fallbackLanguage = getRandomRealLanguage();
    let language = getRandomRealLanguage();
    while (language === fallbackLanguage) {
      language = getRandomRealLanguage();
    }
    const result = determineLanguage(language, fallbackLanguage);
    expect(result).toBe(language);
  });
});

describe("determineGameLanguage", () => {
  it("returns fallback language when set to auto", () => {
    const fallbackLanguage = getRandomRealLanguage();
    const result = determineGameLanguage(
      "auto",
      getRandomPageLanguage(),
      fallbackLanguage
    );
    expect(result).toBe(fallbackLanguage);
  });
  it("returns page language when set to follow", () => {
    const fallbackLanguage = getRandomRealLanguage();
    let pageLanguage = getRandomRealLanguage();
    while (pageLanguage === fallbackLanguage) {
      pageLanguage = getRandomRealLanguage();
    }
    const result = determineGameLanguage(
      "follow",
      pageLanguage,
      fallbackLanguage
    );
    expect(result).toBe(pageLanguage);
  });
  it("returns language", () => {
    const fallbackLanguage = getRandomRealLanguage();
    let language = getRandomRealLanguage();
    while (language === fallbackLanguage) {
      language = getRandomRealLanguage();
    }
    const result = determineGameLanguage(
      language,
      getRandomPageLanguage(),
      fallbackLanguage
    );
    expect(result).toBe(language);
  });
});
