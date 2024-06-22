import { prisma } from "@/db";
import { getGameData } from "@/utility/games";
import { FullConfig } from "@playwright/test";
import { Role } from "@prisma/client";

export const AVAILABLE_GAMES = [
  224517, 161936, 174430, 342942, 233078, 316554, 167791, 115746, 187645,
  291457, 162886, 220308, 12333, 182028, 193738, 84876, 169786, 246900, 173346,
  28720, 167355, 266507, 177736, 124361, 205637, 266192, 341169, 120677, 312484,
  295770, 237182, 164928, 192135, 96848, 199792, 251247, 324856, 183394, 175914,
  366013, 285774, 256960, 247763, 3076, 295947, 521, 102794, 284378, 185343,
  170216, 184267, 314040, 31260, 255984, 221107, 161533, 205059, 253344, 126163,
  276025,
];

export default async function globalSetup(config: FullConfig) {
  await Promise.all([createGames(), setFeatureFlags()]);
}

async function createGames() {
  await getGameData(AVAILABLE_GAMES);
}

async function setFeatureFlags() {
  const current = await prisma.featureFlag.findFirst({
    where: { name: "show_app" },
  });
  if (!current) {
    await prisma.featureFlag.create({
      data: {
        name: "show_app",
        roles: {
          set: [Role.USER, Role.ADMIN, Role.FRIENDS_FAMILY, Role.PREMIUM],
        },
      },
    });
  }
}
