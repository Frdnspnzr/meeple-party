import { GameLanguage, PageLanguage } from "@/i18n/types";
import { User } from "@prisma/client";

export type UserProfile = Omit<
  User,
  "email" | "emailVerified" | "profileComplete" | "preferences"
>;

export type UserPreferences = {
  sendAnalyticsData: boolean;
  showRealNameInProfile: boolean;
  showPlaceInProfile: boolean;
  allowSearchByPlace: boolean;
  hideProfile: boolean;
  pageLanguage: PageLanguage;
  gameLanguage: GameLanguage;
};

export const defaultUserPreferences: UserPreferences = {
  sendAnalyticsData: false,
  showRealNameInProfile: false,
  showPlaceInProfile: false,
  allowSearchByPlace: false,
  hideProfile: false,
  pageLanguage: "auto",
  gameLanguage: "follow",
};
