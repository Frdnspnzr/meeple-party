"use client";

import CriticalError from "@/components/CriticalError/CriticalError";
import GamePill from "@/components/GamePill/GamePill";
import GameSearch, {
  GameSearchChildren,
} from "@/components/GameSearch/GameSearch";
import Spinner from "@/components/Spinner/Spinner";
import { Game } from "@/datatypes/game";
import { useGameQuery } from "@/hooks/api/useGame";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import useUserProfile from "@/hooks/useUserProfile";
import { useTranslation } from "@/i18n/client";
import classNames from "classnames";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Trans } from "react-i18next";

const EditProfile: React.FC = () => {
  const { t } = useTranslation("profile");

  const {
    isLoading,
    userProfile,
    invalidate,
    update: updateUserProfile,
  } = useUserProfile();
  const { preferences, loading: preferencesLoading } = useUserPreferences();

  if (!isLoading && !userProfile) {
    throw new Error("Could not load user");
  }

  const [profileName, setProfileName] = useState("");
  const [profileNameError, setProfileNameError] = useState<string | false>(
    false
  );

  const [realName, setRealName] = useState("");
  const [realNameError, setRealNameError] = useState<string | false>(false);

  const [place, setPlace] = useState("");
  const [placeError, setPlaceError] = useState<string | false>(false);

  const [about, setAbout] = useState("");
  const [aboutError, setAboutError] = useState<string | false>(false);

  const [favorites, setFavorites] = useState<Game[] | false>(false);

  const [sending, setSending] = useState(false);

  const [apiError, setApiError] = useState<string | false>(false);
  const [apiErrorDetail, setApiErrorDetail] = useState<string>();

  const getGame = useGameQuery();

  const addToFavorites = useCallback(
    (gameId: number) => {
      getGame(gameId)
        .then((game) => {
          setFavorites(favorites ? [...favorites, game] : [game]);
        })
        .catch((error) => {
          setApiError(t("EditScreen.Errors.GameData", { gameId }));
          setApiErrorDetail(error);
        });
    },
    [favorites, getGame]
  );

  const FavoriteGameResult = useMemo(
    () => bindFavoriteGameResult(addToFavorites),
    [addToFavorites]
  );

  const updateUser = () => {
    setSending(true);
    updateUserProfile({
      name: profileName,
      realName,
      place,
      about,
      favorites: favorites ? favorites : [],
    })
      .then(() => {
        setSending(false);
        invalidate();
      })
      .catch((error) => {
        setApiError(`Error updating profile data.`);
        setApiErrorDetail(error);
      });
  };

  useEffect(() => {
    if (!profileName || profileName.length === 0) {
      setProfileNameError(t("EditScreen.Errors.ProfileNameMandatory"));
    } else if (profileName.length > 30) {
      setProfileNameError(t("EditScreen.Errors.ProfileNameLength"));
    } else {
      setProfileNameError(false);
    }
  }, [profileName]);

  useEffect(() => {
    if (realName.length > 60) {
      setRealNameError(t("EditScreen.Errors.RealNameLength"));
    } else {
      setRealNameError(false);
    }
  }, [realName]);

  useEffect(() => {
    if (place.length > 30) {
      setPlaceError(t("EditScreen.Errors.PlaceLength"));
    } else {
      setPlaceError(false);
    }
  }, [place]);

  useEffect(() => {
    if (about.length > 3000) {
      setAboutError(t("EditScreen.Errors.AboutLength"));
    } else {
      setAboutError(false);
    }
  }, [about]);

  useEffect(() => {
    if (userProfile) {
      setProfileName(userProfile?.name || "");
      setRealName(userProfile?.realName || "");
      setPlace(userProfile?.place || "");
      setAbout(userProfile?.about || "");
      setFavorites(userProfile?.favorites);
    }
  }, [userProfile]);

  return (
    <>
      {apiError && (
        <CriticalError message={apiError} details={apiErrorDetail} />
      )}
      <form className="grid gap-3" noValidate>
        <div className="row">
          <div className="col-12">
            <h1>{t("EditScreen.Header")}</h1>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-4">
            <label htmlFor="profileName" className="form-label">
              {t("EditScreen.ProfileName")}
            </label>
            <input
              type="text"
              className={classNames({
                "form-control": true,
                "border-danger": !!profileNameError,
              })}
              id="profileName"
              placeholder={t("EditScreen.ProfileName")}
              aria-describedby="profileNameHelp"
              value={profileName}
              onChange={(e) => setProfileName(e.currentTarget.value)}
            />
            <div
              id="profileNameHelp"
              className={classNames({
                "form-text": true,
                "text-danger": profileNameError,
              })}
            >
              {profileNameError ||
                `${t("EditScreen.Visibility.Everybody")} ${t(
                  "EditScreen.Mandatory"
                )}`}
            </div>
          </div>

          <div className="col-md-4">
            <label htmlFor="realName" className="form-label">
              {t("EditScreen.RealName")}
            </label>
            <input
              type="text"
              className={classNames({
                "form-control": true,
                "border-danger": !!realNameError,
              })}
              id="realName"
              placeholder={t("EditScreen.RealName")}
              aria-describedby="realNameHelp"
              value={realName}
              onChange={(e) => setRealName(e.currentTarget.value)}
            />
            <div
              id="profileNameHelp"
              className={classNames({
                "form-text": true,
                "text-danger": realNameError,
              })}
            >
              {realNameError ||
                getPrivacyStatement(!preferences?.showRealNameInProfile)}
            </div>
          </div>

          <div className="col-md-4">
            <label htmlFor="place" className="form-label">
              {t("EditScreen.Place")}
            </label>
            <input
              type="text"
              className={classNames({
                "form-control": true,
                "border-danger": !!placeError,
              })}
              id="place"
              placeholder={t("EditScreen.PlacePlaceholder")}
              aria-describedby="placeHelp"
              value={place}
              onChange={(e) => setPlace(e.currentTarget.value)}
            />
            <div
              id="profileNameHelp"
              className={classNames({
                "form-text": true,
                "text-danger": placeError,
              })}
            >
              {placeError ||
                getPrivacyStatement(!preferences?.showPlaceInProfile)}
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <label htmlFor="place" className="form-label">
              {t("EditScreen.About")}
            </label>
            <textarea
              className={classNames({
                "form-control": true,
                "border-danger": !!aboutError,
              })}
              id="place"
              rows={10}
              value={about}
              onChange={(e) => setAbout(e.currentTarget.value)}
              placeholder={t("AboutPlaceholder")}
            ></textarea>
            <div
              id="profileNameHelp"
              className={classNames({
                "form-text": true,
                "text-danger": aboutError,
              })}
            >
              {aboutError || t("EditScreen.Visibility.Everybody")}
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-12">
            <label className="form-label">{t("EditScreen.Favorites")}</label>
            <br />
            {favorites ? (
              <>
                {favorites.map((f) => (
                  <GamePill gameId={f.id} key={f.id}>
                    &nbsp;
                    <i
                      className="bi bi-x"
                      style={{ cursor: "pointer" }}
                      onClick={(_) =>
                        setFavorites(favorites.filter((g) => g.id !== f.id))
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Delete") {
                          setFavorites(favorites.filter((g) => g.id !== f.id));
                        }
                      }}
                    ></i>
                  </GamePill>
                ))}
                <br />
                <br />
                <button
                  className="btn btn-secondary btn-sm"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseGameSearch"
                  type="button"
                  aria-expanded="false"
                  aria-controls="collapseGameSearch"
                >
                  {t("EditScreen.AddGames")}
                </button>
                <div className="collapse" id="collapseGameSearch">
                  <GameSearch resultView={FavoriteGameResult} />
                </div>
              </>
            ) : (
              <Spinner />
            )}
          </div>
        </div>

        <div className="row mb-4">
          <div className="alert alert-info col-md-8 order-md-2" role="alert">
            <i className="bi bi-info-circle"></i>{" "}
            <Trans i18nKey="EditScreen.ChangeInformation" ns="profile">
              For some things you can change what&apos;s shown to everybody in
              your <a href="/app/profile/edit/privacy">privacy settings</a>.
            </Trans>
          </div>
          <div className="col-4">
            <button
              type="button"
              className="btn btn-primary"
              disabled={
                sending ||
                !!profileNameError ||
                !!realNameError ||
                !!placeError ||
                !!aboutError
              }
              onClick={(e) => updateUser()}
            >
              {sending && (
                <>
                  <Spinner size="small" />
                  &nbsp;
                </>
              )}
              {t("EditScreen.Save")}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

function bindFavoriteGameResult(
  addToFavorites: (gameId: number) => void
): React.FC<GameSearchChildren> {
  const FavoriteGameResult: React.FC<GameSearchChildren> = ({
    searchResult,
  }) => {
    return (
      <>
        {searchResult.map(({ game }) => (
          <GamePill gameId={game.id} key={game.id}>
            &nbsp;
            <i
              className="bi bi-plus"
              style={{ cursor: "pointer" }}
              onClick={(_) => addToFavorites(game.id)}
              onKeyUp={(event) => {
                if (event.key === "Enter") {
                  addToFavorites(game.id);
                }
              }}
            ></i>
          </GamePill>
        ))}
      </>
    );
  };
  return FavoriteGameResult;
}

function getPrivacyStatement(privateInformation: boolean) {
  if (privateInformation) {
    return <PrivacyStatementPrivate />;
  } else {
    return <PrivacyStatementPublic />;
  }
}

const PrivacyStatementPrivate: React.FC = () => {
  const { t } = useTranslation("profile");
  return (
    <>
      {t("EditScreen.Visibility.Friends")}{" "}
      <Link href="/app/profile/edit/privacy">
        {t("EditScreen.Visibility.Change")}
      </Link>
    </>
  );
};

const PrivacyStatementPublic: React.FC = () => {
  const { t } = useTranslation("profile");
  return (
    <>
      {t("EditScreen.Visibility.Everybody")}{" "}
      <Link href="/app/profile/edit/privacy">
        {t("EditScreen.Visibility.Change")}
      </Link>
    </>
  );
};

export default EditProfile;
