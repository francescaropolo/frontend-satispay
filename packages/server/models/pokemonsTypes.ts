import { pipe } from "fp-ts/lib/pipeable";
import * as O from "fp-ts/lib/Option";
import * as A from "fp-ts/lib/Array";
import { identity } from "fp-ts/lib/function";
import { data } from "../data/pokemons";
import { toConnection, slice } from "../functions";
import { Connection } from "../types";
import { addResolveFunctionsToSchema } from "apollo-server";

interface PokemonType {
  id: string
  name: string
}

export function query(): PokemonType[] {
  const results: PokemonType[] = [];

  for (let i = 0; i < data.length; i++) {
    for (let x = 0; x < data[i].types.length; x++) {
      if (!results.find(r => r.name === data[i].types[x])) {
        const newType: PokemonType = {
          id: data[i].types[x],
          name: data[i].types[x]
        }
        results.push(newType)
      }
    }
  }

  return results
}
