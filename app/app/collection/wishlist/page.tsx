import GameBox from "@/components/GameBox/GameBox";
import { prisma } from "@/db";
import { getServerUser } from "@/utility/serverSession";

export default async function Collection() {
  const user = await getServerUser();
  const gameCollection = await prisma.gameCollection.findMany({
    where: { userId: user.id, wishlist: true },
    include: { game: true },
  });
  return (
    <>
      {gameCollection.map((g) => {
        const { updatedAt, ...cleanGame } = g.game;
        const { game, ...cleanStatus } = g;
        return (
          <GameBox game={cleanGame} status={cleanStatus} key={cleanGame.id} />
        );
      })}
    </>
  );
}