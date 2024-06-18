import CollectionChange from "@/components/CollectionChange/CollectionChange";
import Person from "@/components/Person/Person";
import { ExpandedGame, prismaGameToExpandedGame } from "@/datatypes/game";
import { prisma } from "@/db";
import { getGameLanguage, getTranslation } from "@/i18n";
import { getFriends } from "@/selectors/relationships";
import { getServerUser } from "@/utility/serverSession";
import { Game, GameCollection, User } from "@prisma/client";
import { Metadata } from "next";
import Link from "next/link";
import styles from "./friends.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation("friends");
  return {
    title: t("Title"),
  };
}

export default async function Friends() {
  const { t } = await getTranslation("friends");
  const user = await getServerUser();
  const myFriends = await getFriends(user.id);
  const collectionUpdates = await prisma.gameCollection.findMany({
    where: {
      OR: [{ wantToPlay: true }, { own: true }],
      userId: { in: myFriends.map((f) => f.id) },
    },
    orderBy: { updatedAt: "desc" },
    take: 20,
    include: { user: true, game: { include: { alternateNames: true } } },
  });
  let lastFriendId = "";
  return (
    <>
      <h2>{t("Activity.Title")}</h2>
      <div className="container">
        {collectionUpdates.map(async (update) => {
          const game = prismaGameToExpandedGame(update.game);
          const ret = (
            <div className="row" key={update.updatedAt?.toTimeString()}>
              <div className="col-lg-3">
                {update.userId !== lastFriendId && (
                  <Link
                    href={`/app/profile/${update.userId}`}
                    className={styles.link}
                  >
                    <Person
                      name={update.user.name!}
                      image={update.user.image || undefined}
                      className={styles.person}
                      realName={update.user.realName || undefined}
                    />
                  </Link>
                )}
              </div>
              <CollectionChange
                image={game.image!}
                operation="add"
                text={t(`Activity.Changes.${getChangeTranslationKey(update)}`, {
                  game: await getGameName(game),
                  person: update.user.name,
                })}
                own={update.own}
                wantToPlay={update.wantToPlay}
                wishlist={update.wishlist}
                className="col-lg-9"
                href={`/app/game/${update.gameId}`}
              />
            </div>
          );
          lastFriendId = update.userId;
          return ret;
        })}
      </div>
      <h2>{t("List.Title")}</h2>
      <div className={styles.friendContainer}>
        {myFriends.map((friend) => (
          <Link
            href={`/app/profile/${friend.id}`}
            className={styles.link}
            key={friend.id}
          >
            <Person
              name={friend.name!}
              image={friend.image || undefined}
              realName={friend.realName || undefined}
              className={styles.listPerson}
            />
          </Link>
        ))}
      </div>
    </>
  );
}

function getChangeTranslationKey(
  update: GameCollection & {
    user: User;
    game: Game;
  }
): string {
  const keys: string[] = [];
  if (update.own) {
    keys.push("Own");
  }
  if (update.wantToPlay) {
    keys.push("Wtp");
  }
  if (update.wishlist) {
    keys.push("Wish");
  }
  return keys.join("");
}

async function getGameName(game: ExpandedGame) {
  const language = await getGameLanguage();
  const name = game.names.find((n) => n.language === language);
  if (name) {
    return name.name;
  }
  return game.name;
}
