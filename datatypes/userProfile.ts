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
  pageLanguage: string;
  gameLanguage: string;
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
