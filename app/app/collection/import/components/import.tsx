"use client";

import {
  CollectionUpdate,
  CollectionStatus,
} from "@/pages/api/collection/[gameId]";
import { useEffect, useState } from "react";
import { ImportConfiguration } from "../page";
import validator from "validator";
import { Game, GameCollection } from "@prisma/client";
import styles from "./import.module.css";
import Image from "next/image";
import classNames from "classnames";

export interface ImportProps {
  configuration: ImportConfiguration;
  bggObject: any;
}

export interface ImportStepDefinition {
  text: string;
  lists: {
    wishlist: boolean;
    wantToPlay: boolean;
    own: boolean;
  };
  operation: "add" | "remove" | "change";
  image: string | null;
}

type GameCollectionFromDatabase = GameCollection & {
  game: Game;
};

interface GameCollectionStatus extends CollectionStatus {
  gameId: number;
}

const Import: React.FC<ImportProps> = ({ configuration, bggObject }) => {
  const [itemsToImport, setItemsToImport] = useState<GameCollectionStatus[]>(
    []
  );
  const [currentCollection, setCurrentCollection] =
    useState<GameCollectionStatus[]>();
  const [importSteps, setImportSteps] = useState<ImportStepDefinition[]>([]);
  const [totalNumberOfImports, setTotalNumberOfImports] = useState(0);

  useEffect(() => {
    async function readCollections() {
      //TODO Error handling
      const currentCollection: GameCollectionStatus[] = await fetch(
        "/api/collection"
      )
        .then((response) => response.json())
        .then((collection) =>
          collection.map((c: GameCollectionFromDatabase) => ({
            gameId: c.gameId,
            own: c.own,
            wantToPlay: c.wantToPlay,
            wishlist: c.wishlist,
          }))
        );

      const bggCollection: GameCollectionStatus[] = bggObject.items.item.map(
        (i: any) => ({
          gameId: validator.toInt(i["@_objectid"]),
          own: i.status["@_own"] === "1",
          wantToPlay: i.status["@_wanttoplay"] === "1",
          wishlist:
            i.status["@_wishlist"] === "1" || i.status["@_wanttobuy"] === "1",
        })
      );

      setCurrentCollection(currentCollection);
      const changeSet = mergeToChangeset(currentCollection, bggCollection);
      setTotalNumberOfImports(changeSet.length);
      setItemsToImport(changeSet);
    }
    readCollections();
  }, [bggObject.items.item]);

  useEffect(() => {
    async function importNext(
      toImport: GameCollectionStatus[],
      current: GameCollectionStatus[]
    ) {
      const [head, ...tail] = toImport;
      setItemsToImport(tail);
      const importStep = await changeCollectionStatus(head, current);
      if (!!importStep) {
        setImportSteps((i) => [...i, importStep]);
      }
    }
    if (!!currentCollection && itemsToImport.length > 0) {
      setTimeout(() => importNext(itemsToImport, currentCollection), 500);
    }
  }, [itemsToImport, currentCollection]);

  return (
    <>
      <div
        className="progress"
        role="progressbar"
        aria-label="Number of games to import"
        aria-valuenow={itemsToImport.length}
        aria-valuemin={0}
        aria-valuemax={totalNumberOfImports}
      >
        <div
          className="progress-bar"
          style={{
            width: `${
              ((totalNumberOfImports - itemsToImport.length) /
                totalNumberOfImports) *
              100
            }%`,
          }}
        >
          {totalNumberOfImports - itemsToImport.length} / {totalNumberOfImports}
        </div>
      </div>
      <div className={styles.importSteps}>
        {[...importSteps].reverse().map((s) => (
          <ImportStep step={s} key={s.text} />
        ))}
      </div>
    </>
  );
};

export interface ImportStepProps {
  step: ImportStepDefinition;
}

const ImportStep: React.FC<ImportStepProps> = ({ step }) => {
  return (
    <div
      className={classNames({
        [styles.importStep]: true,
        [styles.add]: step.operation === "add",
        [styles.change]: step.operation === "change",
        [styles.remove]: step.operation === "remove",
      })}
    >
      <div className={styles.lists}>
        <i
          className={classNames([
            "bi bi-box-seam-fill",
            { [styles.own]: step.lists.own },
          ])}
        ></i>
        <i
          className={classNames([
            "bi bi-dice-3-fill",
            { [styles.wantToPlay]: step.lists.wantToPlay },
          ])}
        ></i>
        <i
          className={classNames([
            "bi bi-gift-fill",
            { [styles.wishlist]: step.lists.wishlist },
          ])}
        ></i>
      </div>
      <Image
        src={step.image!}
        width={100}
        height={100}
        alt={step.text}
        className={styles.picture}
      />
      {step.text}
    </div>
  );
};

export default Import;

async function changeCollectionStatus(
  newStatus: GameCollectionStatus,
  currentCollection: GameCollectionStatus[]
): Promise<ImportStepDefinition | undefined> {
  if (newStatus.own || newStatus.wantToPlay || newStatus.wishlist) {
    //TODO Better error handling
    const result: CollectionUpdate = await fetch(
      `/api/collection/${newStatus.gameId}`,
      {
        method: "POST",
        body: JSON.stringify({
          own: newStatus.own,
          wantToPlay: newStatus.wantToPlay,
          wishlist: newStatus.wishlist,
        } as CollectionStatus),
      }
    ).then((response) => response.json());
    if (!result.success) {
      return;
    }
    return createImportStep(result, currentCollection);
  }
  return;
}

function createImportStep(
  collectionUpdate: CollectionUpdate,
  currentCollection: GameCollectionStatus[]
): ImportStepDefinition | undefined {
  const current = currentCollection.find(
    (c) => c.gameId === collectionUpdate.game.id
  );
  if (!!current) {
    return {
      operation: "change",
      lists: {
        wishlist: !!collectionUpdate.status.wishlist && !current.wishlist,
        wantToPlay: !!collectionUpdate.status.wantToPlay && !current.wantToPlay,
        own: !!collectionUpdate.status.own && !current.own,
      },
      text: `${collectionUpdate.game.name} updated in your collection.`,
      image: collectionUpdate.game.thumbnail,
    };
  } else {
    return {
      operation: "add",
      lists: {
        wishlist: !!collectionUpdate.status.wishlist,
        wantToPlay: !!collectionUpdate.status.wantToPlay,
        own: !!collectionUpdate.status.own,
      },
      text: `${collectionUpdate.game.name} added to your collection.`,
      image: collectionUpdate.game.thumbnail,
    };
  }
}

function mergeToChangeset(
  currentCollection: GameCollectionStatus[],
  bggCollection: GameCollectionStatus[]
): GameCollectionStatus[] {
  const changeSet: GameCollectionStatus[] = [];
  bggCollection.forEach((bgg) => {
    const current = currentCollection.find((c) => c.gameId === bgg.gameId);
    if (!current) {
      if (bgg.own || bgg.wishlist || bgg.wantToPlay) {
        changeSet.push({ ...bgg });
      }
    } else if (
      (bgg.own && !current.own) ||
      (bgg.wantToPlay && !current.wantToPlay) ||
      (bgg.wishlist && !current.wishlist)
    ) {
      changeSet.push({
        gameId: bgg.gameId,
        own: bgg.own,
        wantToPlay: bgg.wantToPlay,
        wishlist: bgg.wishlist,
      });
    }
  });
  return changeSet;
}
