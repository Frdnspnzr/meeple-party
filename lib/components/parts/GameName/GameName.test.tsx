import { gameToExpandedGame } from "@/datatypes/game";
import usePreferredGameLanguage from "@/lib/hooks/usePreferredGameLanguage";
import { generateGame } from "@/utility/test";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import GameName from "./GameName";

jest.mock("@/lib/hooks/usePreferredGameLanguage");

describe("Part: GameName", () => {
  it("matches the snapshot for game without additional names", async () => {
    jest
      .mocked(usePreferredGameLanguage)
      .mockReturnValueOnce({ loading: false, preferredGameLanguage: "en" });
    const game = gameToExpandedGame(generateGame(1));
    game.name = "Static game name";
    const { container } = render(<GameName game={game} />);

    expect(container).toMatchSnapshot();
  });
  it("matches the snapshot for game without fitting alternate name", async () => {
    jest
      .mocked(usePreferredGameLanguage)
      .mockReturnValueOnce({ loading: false, preferredGameLanguage: "en" });
    const game = gameToExpandedGame(generateGame(1));
    game.name = "Static game name";
    game.names.push({ language: "de", name: "Alternate static game name" });
    const { container } = render(<GameName game={game} />);

    expect(container).toMatchSnapshot();
  });
  it("matches the snapshot for game with alternate name", async () => {
    jest
      .mocked(usePreferredGameLanguage)
      .mockReturnValueOnce({ loading: false, preferredGameLanguage: "de" });
    const game = gameToExpandedGame(generateGame(1));
    game.name = "Static game name";
    game.names.push({ language: "de", name: "Alternate static game name" });
    const { container } = render(<GameName game={game} />);

    expect(container).toMatchSnapshot();
  });
});
