import { GameCollectionStatus, StatusByUser } from "@/datatypes/collection";
import { Game } from "@/datatypes/game";

export default interface GameboxProps {
  game: Game;
  myCollection: GameCollectionStatus;
  friendCollections: StatusByUser;
  updateStatus?: (status: Partial<GameCollectionStatus>) => void;
}
