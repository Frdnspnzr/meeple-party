import { ExpandedGame } from "./game";
import { UserProfile } from "./userProfile";

export interface StatusByUser {
  own: UserProfile[];
  wishlist: UserProfile[];
  wantToPlay: UserProfile[];
}

export type GameCollectionStatus = {
  own: boolean;
  wantToPlay: boolean;
  wishlist: boolean;
};

export interface GameCollection {
  game: ExpandedGame;
  status: GameCollectionStatus;
}

export interface UserGameCollection extends GameCollection {
  user: UserProfile;
}

export interface ExtendedGameCollection extends GameCollection {
  friendCollections: StatusByUser;
}
