/**
 * @jest-environment node
 */
import { defaultUserPreferences } from "@/datatypes/userProfile";
import { getServerUser } from "@/utility/serverSession";
import {
  generatePrismaUser,
  getRandomGameLanguage,
  getRandomPageLanguage,
  getRandomRealLanguage,
} from "@/utility/test";
import { getUserPreferences } from "@/utility/userProfile";
import { mockReset } from "jest-mock-extended";
import { getGameLanguage, getLanguage } from "..";

const myUser = generatePrismaUser();

jest.mock("@/utility/serverSession");
jest.mock("@/utility/userProfile");

const getUserMock = jest.mocked(getServerUser);
const userPreferencesMock = jest.mocked(getUserPreferences);

describe("language settinges", () => {
  beforeEach(() => {
    mockReset(getUserMock);
    mockReset(userPreferencesMock);
    getUserMock.mockResolvedValue(myUser);
  });
  describe("getLanguage", () => {
    it("returns the current selected language", async () => {
      const language = getRandomRealLanguage();
      userPreferencesMock.mockReturnValue({
        ...defaultUserPreferences,
        pageLanguage: language,
      });
      const result = await getLanguage();
      expect(result).toBe(language);
    });
    it("always returns English when set to 'auto'", async () => {
      //As there's currently no implementation to auto-select a language auto always defaults to English.
      userPreferencesMock.mockReturnValue({
        ...defaultUserPreferences,
        pageLanguage: "auto",
      });
      const result = await getLanguage();
      expect(result).toBe("en");
    });
    it("returns English when there is an error", async () => {
      userPreferencesMock.mockReturnValue({
        ...defaultUserPreferences,
        pageLanguage: getRandomPageLanguage(),
      });
      getUserMock.mockRejectedValue({});
      const result = await getLanguage();
      expect(result).toBe("en");
    });
  });

  describe("getGameLanguage", () => {
    it("returns the current selected language", async () => {
      const language = getRandomRealLanguage();
      userPreferencesMock.mockReturnValue({
        ...defaultUserPreferences,
        gameLanguage: language,
      });
      const result = await getGameLanguage();
      expect(result).toBe(language);
    });
    it("returns the page language when set to follow", async () => {
      const language = getRandomRealLanguage();
      userPreferencesMock.mockReturnValue({
        ...defaultUserPreferences,
        gameLanguage: "follow",
        pageLanguage: language,
      });
      const result = await getGameLanguage();
      expect(result).toBe(language);
    });
    it("always returns English when set to 'auto'", async () => {
      //As there's currently no implementation to auto-select a language auto always defaults to English.
      userPreferencesMock.mockReturnValue({
        ...defaultUserPreferences,
        gameLanguage: "auto",
      });
      const result = await getGameLanguage();
      expect(result).toBe("en");
    });
    it("returns English when there is an error", async () => {
      userPreferencesMock.mockReturnValue({
        ...defaultUserPreferences,
        gameLanguage: getRandomGameLanguage(),
      });
      getUserMock.mockRejectedValue({});
      const result = await getGameLanguage();
      expect(result).toBe("en");
    });
  });
});
