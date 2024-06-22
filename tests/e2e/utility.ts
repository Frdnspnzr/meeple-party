import { GameId } from "@/datatypes/game";
import { prisma } from "@/db";
import { generateString } from "@/utility/test";
import { faker } from "@faker-js/faker";
import { BrowserContext } from "@playwright/test";
import { Role, User } from "@prisma/client";

export async function addGamesToCollection(userId: string, gameIds: GameId[]) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw Error("User not found");
  }
  await prisma.gameCollection.createMany({
    data: gameIds.map((gameId) => ({
      gameId,
      own: true,
      userId: user.id,
      wantToPlay: false,
      wishlist: false,
    })),
  });
}

export async function removeGamesFromCollection(
  userId: string,
  gameIds: GameId[]
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw Error("User not found");
  }
  await prisma.gameCollection.deleteMany({
    where: { userId: user.id, gameId: { in: gameIds } },
  });
}

export async function clearCollection(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw Error("User not found");
  }
  await prisma.gameCollection.deleteMany({
    where: { userId: user.id },
  });
}

export async function logInAsNewUser(
  context: BrowserContext,
  role: Role = Role.USER
): Promise<User> {
  const user = await prisma.user.create({
    data: {
      email: faker.internet.email(),
      emailVerified: new Date(),
      name: faker.internet.displayName(),
      place: faker.location.city(),
      realName: faker.person.fullName(),
      profileComplete: true,
      role,
    },
  });
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      sessionToken: generateString(),
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });
  context.addCookies([
    {
      name: "next-auth.session-token",
      value: session.sessionToken,
      url: "http://127.0.0.1:3000",
      httpOnly: true,
    },
  ]);
  return user;
}

export async function deleteUser(id: string) {
  await prisma.user.delete({ where: { id } });
}
