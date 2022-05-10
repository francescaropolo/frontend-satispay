import { IResolvers } from "graphql-tools";
import * as pokemons from "./models/pokemons";
import * as pokemonTypes from "./models/pokemonsTypes";

export const resolvers: IResolvers = {
  Query: {
    pokemons: (_source, args) => pokemons.query(args),
    pokemonsByType: (_source, args) => pokemons.queryByType(args),
    pokemonTypes: (_source, args) => pokemonTypes.query()
  }
};