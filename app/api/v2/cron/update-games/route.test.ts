/**
 * @jest-environment node
 */

import { gameToExpandedGame } from "@/datatypes/game";
import { getGameData } from "@/utility/games";
import { prismaMock } from "@/utility/prismaMock";
import {
  generateArray,
  generateGame,
  generateNumber,
  generateString,
} from "@/utility/test";
import { mockDeep, mockReset } from "jest-mock-extended";
import { getCronAuthToken } from "../../utility";
import { PATCH } from "./route";

const requestMock = mockDeep<Request>();

jest.mock("../../utility");
jest.mock("@/utility/games");

describe("PATCH cron/update-games", () => {
  beforeEach(() => {
    mockReset(requestMock);
  });
  it("returns error when no authentication header is set", async () => {
    const result = await PATCH(requestMock);
    const value = await result.json();

    expect(result.status).toBe(403);
    expect(value.success).toBeFalsy();
    expect(value.games.length).toBe(0);
  });
  it("returns error when wrong authentication header is set", async () => {
    const expectedHeader = generateString();
    jest.mocked(getCronAuthToken).mockReturnValue(expectedHeader);

    const givenHeader = generateString();
    requestMock.headers.has.mockImplementation((name) => name === "CronAuth");
    requestMock.headers.get.mockImplementation((name) =>
      name === "CronAuth" ? givenHeader : generateString()
    );

    const result = await PATCH(requestMock);
    const value = await result.json();

    expect(result.status).toBe(403);
    expect(value.success).toBeFalsy();
    expect(value.games.length).toBe(0);
  });
  it("updates game data", async () => {
    const expectedHeader = generateString();
    jest.mocked(getCronAuthToken).mockReturnValue(expectedHeader);
    requestMock.headers.has.mockImplementation((name) => name === "CronAuth");
    requestMock.headers.get.mockImplementation((name) =>
      name === "CronAuth" ? expectedHeader : generateString()
    );

    const games = generateArray(() => generateGame(generateNumber()));

    prismaMock.game.findMany.mockResolvedValue(games);
    const gameDataMock = jest
      .mocked(getGameData)
      .mockResolvedValue(games.map(gameToExpandedGame));

    const result = await PATCH(requestMock);
    const value = await result.json();

    expect(result.status).toBe(200);
    expect(value.success).toBeTruthy();
    expect(value.games).toEqual(games.map((g) => ({ id: g.id, name: g.name })));
    expect(gameDataMock).toHaveBeenCalledWith(
      games.map((g) => g.id),
      "always"
    );
  });
});
