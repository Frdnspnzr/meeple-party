import { GameId } from "@/datatypes/game";
import { AlternateGameName } from "@prisma/client";
import axios from "axios";
import { distinct } from "./array";

const ENDPOINT_BASE = "https://query.wikidata.org/sparql?format=json&query=";

export interface WikiDataInfo {
  gameId: GameId;
  wikidataId?: string;
  names: Omit<AlternateGameName, "gameId">[];
}

/**
 * Gets game information from WikiData.
 *
 * @param gameIds List of IDs of the games to fetch data for
 * @returns List with all gameIds, available alternate names with languages (may be empty) and, if available, a wikidata ID
 */
export async function getWikidataInfo(
  gameIds: GameId[]
): Promise<WikiDataInfo[]> {
  if (gameIds.length === 0) {
    return [];
  }

  //TODO Add tests
  const query = getQuery(gameIds);
  console.log("WikiData query", query);
  const uri = ENDPOINT_BASE + encodeURI(query);
  return axios
    .get(uri)
    .then((response) => response.data)
    .then(parseResult)
    .then(consolidateData)
    .catch((error) => {
      if (!error.response || error.response.status !== 429) {
        console.error("Error fetching WikiData data", error);
      }
      return [];
    });
}

type ParsedResult = {
  bggId: number;
  wikidataId: string;
  language: string;
  name: string;
};

function consolidateData(data: ParsedResult[]): WikiDataInfo[] {
  const gameIds = distinct(data.map((d) => d.bggId));
  return gameIds.map((id) => ({
    gameId: id,
    wikidataId: data.find((d) => d.bggId === id)?.wikidataId,
    names: data
      .filter((d) => d.bggId === id)
      .map((d) => ({ language: d.language, name: d.name })),
  }));
}

function parseResult(data: any): ParsedResult[] {
  if (data?.results?.bindings && Array.isArray(data.results.bindings)) {
    if (data.results.bindings.length === 0) {
      return [];
    }
    return data.results.bindings
      .map(parseLine)
      .filter((d: ParsedResult | undefined) => d !== undefined);
  } else {
    console.warn(
      "Wrong format encountered when parsing WikiData response.",
      data
    );
    return [];
  }
}

function parseLine(data: any): ParsedResult | undefined {
  if (
    !data.game?.value ||
    !data.id?.value ||
    !data.name?.value ||
    !data.language?.value
  ) {
    console.warn(
      "Wrong format encountered when parsing WikiData response.",
      data
    );
    return undefined;
  }
  return {
    bggId: Number.parseInt(data.id.value), //TODO This conversion to number is important at runtime and needs to be testet
    language: data.language.value,
    name: data.name.value,
    wikidataId: data.game.value,
  };
}

function getQuery(bggIds: number[]): string {
  return `SELECT ?game ?id ?name (lang(?name) as ?language) WHERE { ?game wdt:P31 wd:Q131436 ; rdfs:label ?name ; wdt:P2339 ?id. FILTER (?id IN (${bggIds.map((id) => `"${id}"`).join(",")}))}`;
}
