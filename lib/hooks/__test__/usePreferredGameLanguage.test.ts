import { defaultUserPreferences } from "@/datatypes/userProfile";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { determineGameLanguage } from "@/i18n/lib";
import { fallbackLng } from "@/i18n/settings";
import {
  getRandomGameLanguage,
  getRandomPageLanguage,
  getRandomRealLanguage,
} from "@/utility/test";
import usePreferredGameLanguage from "../usePreferredGameLanguage";

jest.mock("@/hooks/useUserPreferences");
jest.mock("@/i18n/lib");

describe("Hook: usePreferredGameLanguage", () => {
  it("returns fallback language during load", () => {
    jest.mocked(useUserPreferences).mockReturnValue({
      loading: true,
      preferences: undefined,
      update: async (_) => {},
    });
    const result = usePreferredGameLanguage();
    expect(result.loading).toBeTruthy();
    expect(result.preferredGameLanguage).toBe(fallbackLng);
  });
  it("lets utility function decide the result", () => {
    const gameLanguage = getRandomGameLanguage();
    const pageLanguage = getRandomPageLanguage();
    const resultLanguage = getRandomRealLanguage();
    jest.mocked(useUserPreferences).mockReturnValue({
      loading: false,
      preferences: { ...defaultUserPreferences, gameLanguage, pageLanguage },
      update: async (_) => {},
    });
    const utilityMock = jest
      .mocked(determineGameLanguage)
      .mockReturnValue(resultLanguage);
    const result = usePreferredGameLanguage();
    expect(result.loading).toBeFalsy();
    expect(result.preferredGameLanguage).toBe(resultLanguage);
    expect(utilityMock).toHaveBeenCalledWith(
      gameLanguage,
      pageLanguage,
      fallbackLng
    );
  });
});
