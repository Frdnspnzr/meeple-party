import Avatar from "@/components/Avatar/Avatar";
import CollectionStatusButtons from "@/components/CollectionStatusButtons/CollectionStatusButtons";
import { getTranslation } from "@/i18n";
import GamePageHeader from "@/lib/components/structures/game/GamePageHeader/GamePageHeader";
import { getCollectionStatusOfFriends } from "@/selectors/collections";
import { getBggGame } from "@/utility/bgg";
import { getGameData } from "@/utility/games";
import { getServerUser } from "@/utility/serverSession";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next/types";
import styles from "./gamepage.module.css";

export async function generateMetadata({
  params,
}: {
  params: { gameId: string };
}): Promise<Metadata> {
  const id = Number.parseInt(params.gameId);
  if (!Number.isInteger(id)) {
    notFound();
  }
  const game = await getBggGame(id);
  return {
    title: game.name,
  };
}

export default async function Game({ params }: { params: { gameId: string } }) {
  const { t } = await getTranslation("game");
  const id = Number.parseInt(params.gameId);
  if (!Number.isInteger(id)) {
    notFound();
  }
  try {
    const user = await getServerUser();
    const bggGame = await getBggGame(id);
    const game = (await getGameData([id]))[0];
    const friendCollections = await getCollectionStatusOfFriends(id, user.id);

    return (
      <div className={styles.container}>
        <GamePageHeader game={game} className={styles.header} />
        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: bggGame.description }}
        ></div>
        <div className={styles.meta}>
          <h3>{t("Page.Collections.YourCollection")}</h3>
          <div className={styles.group}>
            <CollectionStatusButtons gameId={bggGame.id} />
          </div>
          {friendCollections.own.length > 0 && (
            <div className={styles.group}>
              <h3>{t("Page.Collections.FriendsOwn")}</h3>
              {friendCollections.own.map((c) => (
                <Link href={`/app/profile/${c.id}`} key={c.id}>
                  <Avatar
                    name={c.name || ""}
                    image={c.image}
                    className={styles.avatar}
                  />
                </Link>
              ))}
            </div>
          )}
          {friendCollections.wantToPlay.length > 0 && (
            <div className={styles.group}>
              <h3>{t("Page.Collections.FriendsWantToPlay")}</h3>
              {friendCollections.wantToPlay.map((c) => (
                <Link href={`/app/profile/${c.id}`} key={c.id}>
                  <Avatar
                    name={c.name || ""}
                    image={c.image}
                    className={styles.avatar}
                  />
                </Link>
              ))}
            </div>
          )}
          {friendCollections.wishlist.length > 0 && (
            <div className={styles.group}>
              <h3>{t("Page.Collections.FriendsWishlist")}</h3>
              {friendCollections.wishlist.map((c) => (
                <Link href={`/app/profile/${c.id}`} key={c.id}>
                  <Avatar
                    name={c.name || ""}
                    image={c.image}
                    className={styles.avatar}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (e) {
    console.error("Error fetching game data", e);
    notFound();
  }
}
