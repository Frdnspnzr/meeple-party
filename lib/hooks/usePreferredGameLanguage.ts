import { useUserPreferences } from "@/hooks/useUserPreferences";
import { determineGameLanguage } from "@/i18n/lib";
import { fallbackLng } from "@/i18n/settings";

//TODO Test, document
export default function usePreferredGameLanguage() {
  const { loading, preferences } = useUserPreferences();

  if (loading) {
    return {
      loading,
      preferredGameLanguage: fallbackLng,
    };
  } else {
    const preferredGameLanguage = determineGameLanguage(
      preferences.gameLanguage,
      preferences.pageLanguage,
      fallbackLng
    );
    return {
      loading,
      preferredGameLanguage,
    };
  }
}
