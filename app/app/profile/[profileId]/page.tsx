import Avatar from "@/components/Avatar/Avatar";
import GameBoxMedium from "@/components/GameBox/components/GameBoxMedium/GameBoxMedium";
import GameCollection from "@/components/GameCollection/GameCollection";
import Role from "@/components/Role/Role";
import ShareProfile from "@/components/ShareProfile/ShareProfile";
import { prisma } from "@/db";
import { getTranslation } from "@/i18n";
import { cleanUserDetails } from "@/pages/api/user";
import { getServerUser } from "@/utility/serverSession";
import {
  Game,
  GameCollection as PrismaGameCollection,
  Relationship,
  RelationshipType,
  User,
} from "@prisma/client";
import classNames from "classnames";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next/types";
import ProfileRelationship from "./components/relationship";
import styles from "./profilepage.module.css";

export async function generateMetadata({
  params,
}: {
  params: { profileId: string };
}): Promise<Metadata> {
  const user = await getUser(params.profileId);
  if (!user || !user.profileComplete) {
    notFound();
  }
  return {
    title: user.name,
  };
}

type UserWithRelationships = User & {
  sentRelationships: Relationship[];
  receivedRelationships: Relationship[];
};

export default async function ProfilePage({
  params,
}: {
  params: { profileId: string };
}) {
  const { t } = await getTranslation("profile");

  const loggedInUser = await getServerUser();
  const isMe = loggedInUser.id === params.profileId;

  const user = await getUser(params.profileId, loggedInUser.id);
  if (!user || !user.profileComplete) {
    notFound();
  }

  user.games.sort((a, b) => (a.game.name > b.game.name ? 1 : -1));
  const isFriend = getAllFriendIds(user).includes(loggedInUser.id);

  const myCollectionStatus = await prisma.gameCollection.findMany({
    where: {
      userId: loggedInUser.id,
      gameId: { in: user.games.map((g) => g.gameId) },
    },
  });

  return (
    <div className="container-md">
      <div className={classNames("row align-items-center pt-2", styles.header)}>
        <div
          className={classNames(
            "col-md-2 pt-2 ml-2 d-flex flex-md-column align-items-center",
            styles.avatar
          )}
        >
          <Avatar
            image={user.image}
            name={user.name || ""}
            className={styles.avatar}
          />
          <Role role={user.role} />
          {isMe && (
            <span className="badge text-bg-light">
              <i className="bi bi-person-circle"></i> {t("Badges.You")}
            </span>
          )}
          {isFriend && (
            <span className="badge text-bg-dark">
              <i className="bi bi-person-fill"></i> {t("Badges.Friend")}
            </span>
          )}
        </div>
        <div className="col">
          <div className="row mt-1">
            {isMe && (
              <div className="col-md-2 order-md-2">
                <ShareProfile profileId={user.id} />
                <Link
                  className="btn btn-primary"
                  href="/app/profile/edit"
                  role="button"
                >
                  {t("Edit")}
                </Link>
              </div>
            )}
            <div className="col order-md-1">
              <h1 className={styles.name}>{user.name}</h1>
              {user.realName && (
                <h2 className={styles.realName}>{user.realName}</h2>
              )}
            </div>
          </div>
          <div className={classNames("row")}>
            <ul className={styles.moreHeaders}>
              {user.place && (
                <li>{t("Header.Place", { place: user.place })}</li>
              )}
              {user.bggName && (
                <li>
                  <Link
                    href={`https://boardgamegeek.com/user/${user.bggName}`}
                    target="_blank"
                  >
                    {t("Header.BggName", { name: user.bggName })}
                  </Link>
                </li>
              )}
            </ul>
          </div>
          {!isMe && !isFriend && (
            <div className={styles.action}>
              <ProfileRelationship targetUserId={user.id} />
            </div>
          )}
        </div>
      </div>
      <div className="row py-2">
        <div className="col-md-9">
          {!!user.about && (
            <>
              <p>{user.about}</p>
            </>
          )}
        </div>
        {user.favorites.length > 0 && (
          <div className="col-md-3">
            <h3>{t("FavoriteGames")}</h3>
            {user.favorites.slice(0, 6).map((g) => {
              const { updatedAt, ...cleanGame } = g;
              return (
                <GameBoxMedium
                  game={cleanGame}
                  key={g.id}
                  showFriendCollection={false}
                />
              );
            })}
          </div>
        )}
      </div>
      {(isFriend || isMe) && (
        <div className="row py2">
          <div className="col">
            <GameCollection
              games={user.games.map(({ game }) => ({
                game: cleanGame(game),
                status: getStatus(game.id, myCollectionStatus),
              }))}
              showFriendCollection={false}
              showFilter={false}
            >
              <h3>{t("UserCollection", { name: user.name })}</h3>
            </GameCollection>
          </div>
        </div>
      )}
    </div>
  );
}

function getStatus(gameId: number, myCollection: PrismaGameCollection[]) {
  const relatedGame = myCollection.find((c) => c.gameId === gameId);
  if (!relatedGame) {
    return { own: false, wantToPlay: false, wishlist: false };
  } else {
    return {
      own: relatedGame.own,
      wantToPlay: relatedGame.wantToPlay,
      wishlist: relatedGame.wishlist,
    };
  }
}

function getAllFriendIds(user: UserWithRelationships): string[] {
  const sentFriendships = user.sentRelationships
    .filter((r) => r.type === RelationshipType.FRIENDSHIP)
    .map((r) => r.recipientId);
  const receivedFriendships = user.receivedRelationships
    .filter((r) => r.type === RelationshipType.FRIENDSHIP)
    .map((r) => r.senderId);
  return [...sentFriendships, ...receivedFriendships];
}

function cleanGame(game: Game) {
  const { updatedAt, ...cleanGame } = game;
  return cleanGame;
}

const getUser = async (id: string, loggedInUserId?: string) => {
  const extendedUserData = await prisma.user.findUnique({
    where: { id },
    include: {
      receivedRelationships: true,
      sentRelationships: true,
      favorites: true,
      games: {
        where: {
          own: true,
        },
        include: {
          game: true,
        },
      },
    },
  });

  if (extendedUserData) {
    const {
      receivedRelationships,
      sentRelationships,
      favorites,
      games,
      ...userData
    } = extendedUserData;

    const isFriend =
      loggedInUserId &&
      getAllFriendIds(extendedUserData).includes(loggedInUserId);
    const isMe = loggedInUserId && extendedUserData.id === loggedInUserId;

    const clean = isMe || isFriend ? userData : cleanUserDetails(userData);

    return {
      receivedRelationships,
      sentRelationships,
      favorites,
      games,
      ...clean,
    };
  }

  return null;
};
