import Avatar from "@/components/Avatar/Avatar";
import { useModal } from "@/context/modalContext";
import { GameCollectionStatus, StatusByUser } from "@/datatypes/collection";
import { Game } from "@/datatypes/game";
import {
  generateArray,
  generateBoolean,
  generateUserProfile,
  render,
} from "@/utility/test";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GameboxBig from "./GameboxBig";

jest.mock("@/i18n/client");
jest.mock("@/hooks/api/useCollectionStatus");
jest.mock("@/components/Avatar/Avatar", () => ({
  __esModule: true,
  namedExport: jest.fn(),
  default: jest.fn(),
}));
jest.mock("@/context/modalContext");

const game: Game = {
  id: 123,
  name: "Test game",
  BGGRank: 23,
  BGGRating: 8.4,
  minPlayers: 1,
  maxPlayers: 5,
  playingTime: 120,
  weight: 3.8,
  year: 2018,
  image: "testimage",
  thumbnail: "testthumbnail",
};
const friendCollections: StatusByUser = {
  own: generateArray(generateUserProfile),
  wantToPlay: generateArray(generateUserProfile),
  wishlist: generateArray(generateUserProfile),
};
const myCollection: GameCollectionStatus = {
  own: true,
  wantToPlay: false,
  wishlist: true,
};

describe("GameBoxBig", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    jest.mocked(Avatar).mockImplementation(() => <>Avatar</>);
  });
  beforeEach(() => {
    jest.mocked(useModal).mockImplementation(() => ({
      open: () => {},
      close: () => {},
    }));
  });
  it("Matches snapshot", async () => {
    const { container: rendered } = render(
      <GameboxBig
        game={game}
        friendCollections={friendCollections}
        myCollection={myCollection}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
  it("Matches snapshot for precise weight", async () => {
    const { container: rendered } = render(
      <GameboxBig
        game={{ ...game, weight: Math.PI }}
        friendCollections={friendCollections}
        myCollection={myCollection}
      />
    );
    expect(rendered).toMatchSnapshot("default game");
  });
  test.each(["own", "wanttoplay", "wishlist"])(
    "calls update callback when status button for %s is clicked",
    async (status) => {
      const user = userEvent.setup();
      let actualStatus = null;
      const callback = (status: Partial<GameCollectionStatus>) => {
        actualStatus = status;
      };
      const randomCollection = {
        own: generateBoolean(),
        wantToPlay: generateBoolean(),
        wishlist: generateBoolean(),
      };

      render(
        <GameboxBig
          game={game}
          friendCollections={friendCollections}
          myCollection={randomCollection}
          updateStatus={callback}
        />
      );
      const button = screen.getByRole("button", {
        name:
          status === "own"
            ? "States.Own"
            : status === "wanttoplay"
              ? "States.WantToPlay"
              : "States.Wishlist",
      });
      await user.click(button);

      expect(actualStatus).not.toBeNull();

      if (status === "own") {
        expect(actualStatus!.own).toBe(!randomCollection.own);
      } else if (status === "wanttoplay") {
        expect(actualStatus!.wantToPlay).toBe(!randomCollection.wantToPlay);
      } else if (status === "wishlist") {
        expect(actualStatus!.wishlist).toBe(!randomCollection.wishlist);
      }
    }
  );
});
