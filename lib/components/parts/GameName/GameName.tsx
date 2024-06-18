"use client";

import { ExpandedGame } from "@/datatypes/game";
import usePreferredGameLanguage from "@/lib/hooks/usePreferredGameLanguage";

interface GameNameProps {
  game: ExpandedGame;
}

//TODO Test, document
export default function GameName({ game }: GameNameProps) {
  const { loading, preferredGameLanguage } = usePreferredGameLanguage();

  const translatedName = game.names.find(
    (n) => n.language === preferredGameLanguage
  );

  if (loading || !translatedName) {
    return <>{game.name}</>;
  } else {
    return <>{translatedName.name}</>;
  }
}
