import DeleteAccount from "@/components/DeleteAccount/DeleteAccount";
import LanguagePicker from "@/components/LanguagePicker/LanguagePicker";
import { getTranslation } from "@/i18n";
import { PropsWithChildren } from "react";

export default async function Page() {
  const { t } = await getTranslation("settings");

  return (
    <div className="grid">
      <Row>
        <h2>{t("Language.Title")}</h2>
      </Row>
      <Row>
        <h3>{t("Language.Page")}</h3>
        <LanguagePicker availableLanguages={["auto", "en", "de"]} type="page" />
      </Row>
      <Row>
        <h3>{t("Language.Games")}</h3>
        <LanguagePicker
          availableLanguages={["follow", "auto", "en"]}
          type="game"
        />
      </Row>
      <Row>
        <h2>{t("DangerZone.Title")}</h2>
      </Row>
      <Row>
        <h3>{t("DangerZone.AccountDeletion")}</h3>
      </Row>
      <Row>
        <DeleteAccount />
      </Row>
    </div>
  );
}

const Row: React.FC<PropsWithChildren<{ spacing?: boolean }>> = ({
  children,
  spacing = true,
}) => {
  return (
    <div className="row mt-2">
      <div className="col-md-8 offset-md-2">{children}</div>
    </div>
  );
};
