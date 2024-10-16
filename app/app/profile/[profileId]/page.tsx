import GameCollection from "@/components/GameCollection/GameCollection";
import GamePill from "@/components/GamePill/GamePill";
import ProfileHeader from "@/components/Profile/ProfileHeader/ProfileHeader";
import { prismaGameToExpandedGame } from "@/datatypes/game";
import { prisma } from "@/db";
import { getTranslation } from "@/i18n";
import { cleanUserDetails } from "@/pages/api/user";
import { getServerUser } from "@/utility/serverSession";
import { Grid, GridCol, Stack, Text, Title } from "@mantine/core";
import {
  GameCollection as PrismaGameCollection,
  Relationship,
  RelationshipType,
  User,
} from "@prisma/client";
import { notFound } from "next/navigation";
import { Metadata } from "next/types";

export async function generateMetadata({
  params,
}: {
  params: { profileId: string };
}): Promise<Metadata> {
  const user = await getUser(params.profileId);
  if (!user?.profileComplete) {
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
}: Readonly<{
  params: { profileId: string };
}>) {
  const { t } = await getTranslation("profile");

  const loggedInUser = await getServerUser();
  const isMe = loggedInUser.id === params.profileId;

  const user = await getUser(params.profileId, loggedInUser.id);
  if (!user?.profileComplete) {
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

  const favorites = user.favorites;
  const collection = user.games.map(({ game }) => ({
    game: prismaGameToExpandedGame(game),
    status: getStatus(game.id, myCollectionStatus),
  }));

  return (
    <Grid>
      <GridCol span={12}>
        <ProfileHeader user={user} friend={isFriend} myself={isMe} />
      </GridCol>
      <GridCol span={9}>
        {user.about && user.about.length > 0 && (
          <>
            <Title order={3}>{t("About", { name: user.name })}</Title>
            <Text>{user.about}</Text>
          </>
        )}
      </GridCol>
      <GridCol span={3}>
        {favorites.length > 0 && (
          <Stack align="flex-start">
            <Title order={3}>{t("FavoriteGames")}</Title>
            {favorites?.map((f) => <GamePill gameId={f.id} key={f.id} />)}
          </Stack>
        )}
      </GridCol>
      <GridCol span={12}>
        {collection.length > 0 && (
          <Stack>
            <Title order={3}>{t("UserCollection", { name: user.name })}</Title>
            <GameCollection games={collection} />
          </Stack>
        )}
      </GridCol>
    </Grid>
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
          game: {
            include: {
              alternateNames: true,
            },
          },
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
