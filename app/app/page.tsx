import GameCollection from "@/components/GameCollection/GameCollection";
import {
  GameCollectionStatus,
  GameCollection as GameCollectionType,
  StatusByUser,
  UserGameCollection,
} from "@/datatypes/collection";
import { ExpandedGame } from "@/datatypes/game";
import { UserProfile } from "@/datatypes/userProfile";
import { getTranslation } from "@/i18n";
import { getAllGamesOfFriends, getCollection } from "@/selectors/collections";
import { emptyFilter } from "@/utility/filter";
import { getServerUser } from "@/utility/serverSession";
import styles from "./dashboard.module.css";

export const metadata = {
  title: "Dashboard",
};

export default async function App() {
  const user = await getServerUser();
  const myGameCollection = await getCollection(user.id);
  const friendCollections = await getAllGamesOfFriends(user.id);
  const collectedGames = myGameCollection.map((g) =>
    collectGames(g, friendCollections)
  );
  const gamesThatEnoughPeopleWantToPlay = collectedGames.filter(
    enoughPeopleWantToPlay
  );
  const { t } = await getTranslation();
  const { t: dt } = await getTranslation("dashboard");
  return (
    <>
      <GameCollection
        games={gamesThatEnoughPeopleWantToPlay
          .filter(atLeastOnePersonOwns)
          .map(uncollectGames)}
        showFriendCollection
        filterPresets={[
          {
            name: t("Filters.Preset.GamesYouOwn"),
            filter: { ...emptyFilter, collectionStatus: { own: true } },
          },
          {
            name: t("Filters.Preset.GamesYouDontOwn"),
            filter: { ...emptyFilter, collectionStatus: { own: false } },
          },
          {
            name: t("Filters.Preset.NoSolo"),
            filter: {
              ...emptyFilter,
              friends: { ...emptyFilter.friends, wantToPlay: { min: 1 } },
            },
          },
          {
            name: t("Filters.Preset.GamesYouOwnNoSolo"),
            filter: {
              ...emptyFilter,
              collectionStatus: { own: true },
              friends: { ...emptyFilter.friends, wantToPlay: { min: 1 } },
            },
          },
          {
            name: t("Filters.Preset.GamesYouDontOwnNoSolo"),
            filter: {
              ...emptyFilter,
              collectionStatus: { own: false },
              friends: { ...emptyFilter.friends, wantToPlay: { min: 1 } },
            },
          },
        ]}
        defaultFilter={{
          ...emptyFilter,
          friends: { ...emptyFilter.friends, wantToPlay: { min: 1 } },
        }}
        className={styles.collection}
      >
        <h2>{dt("PlayRightNow")}</h2>
      </GameCollection>
      <GameCollection
        games={gamesThatEnoughPeopleWantToPlay
          .filter(somebodyWantsToBuy)
          .filter(nobodyOwns)
          .map(uncollectGames)}
        showFriendCollection
        filterPresets={[
          {
            name: t("Filters.Preset.YourWishlist"),
            filter: { ...emptyFilter, collectionStatus: { wishlist: true } },
          },
          {
            name: t("Filters.Preset.NoSolo"),
            filter: {
              ...emptyFilter,
              friends: { ...emptyFilter.friends, wantToPlay: { min: 1 } },
            },
          },
          {
            name: t("Filters.Preset.YourWishlistNoSolo"),
            filter: {
              ...emptyFilter,
              collectionStatus: { wishlist: true },
              friends: { ...emptyFilter.friends, wantToPlay: { min: 1 } },
            },
          },
        ]}
        className={styles.collection}
        defaultFilter={{
          ...emptyFilter,
          friends: { ...emptyFilter.friends, wantToPlay: { min: 1 } },
        }}
      >
        <h2>{dt("SomebodyShouldBuy")}</h2>
      </GameCollection>
    </>
  );
}

type CollectedGame = {
  friendCollections: UserGameCollection[] | undefined;
  game: ExpandedGame;
  status: {
    own: boolean;
    wantToPlay: boolean;
    wishlist: boolean;
  };
};

function collectGames(
  myGame: GameCollectionType,
  friendCollections: UserGameCollection[]
) {
  return {
    ...myGame,
    friendCollections: friendCollections.filter(
      (g) => g.game.id === myGame.game.id
    ),
  };
}

function uncollectGames(collectedGame: CollectedGame): {
  game: ExpandedGame;
  status?: GameCollectionStatus;
  friendCollections?: StatusByUser;
} {
  return {
    game: collectedGame.game,
    status: collectedGame.status,
    friendCollections: {
      own: collectedGame.friendCollections
        ? collectedGame.friendCollections
            .filter((c) => c.status.own)
            .map((c) => c.user as UserProfile)
        : [],
      wishlist: collectedGame.friendCollections
        ? collectedGame.friendCollections
            .filter((c) => c.status.wishlist)
            .map((c) => c.user as UserProfile)
        : [],
      wantToPlay: collectedGame.friendCollections
        ? collectedGame.friendCollections
            .filter((c) => c.status.wantToPlay)
            .map((c) => c.user as UserProfile)
        : [],
    },
  };
}

function atLeastOnePersonOwns({
  game,
  status,
  friendCollections,
}: CollectedGame) {
  return (
    status.own ||
    (friendCollections &&
      friendCollections.find((f) => f.game.id === game.id && f.status.own))
  );
}

function nobodyOwns({ game, status, friendCollections }: CollectedGame) {
  return (
    !status.own &&
    friendCollections &&
    !friendCollections.find((f) => f.game.id === game.id && f.status.own)
  );
}

function enoughPeopleWantToPlay({
  game,
  status,
  friendCollections,
}: CollectedGame) {
  let count = 0;
  if (status.wantToPlay) {
    count++;
  }
  friendCollections?.forEach((c) => {
    if (c.status.wantToPlay) {
      count++;
    }
  });
  return count >= game.minPlayers;
}

function somebodyWantsToBuy({
  game,
  status,
  friendCollections,
}: CollectedGame) {
  return (
    status.wishlist ||
    (friendCollections &&
      friendCollections.find((f) => f.game.id === game.id && f.status.wishlist))
  );
}
