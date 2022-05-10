export interface Pokemon {
    key: number;
    id: string;
    name: string;
    types: string[];
    classification: string;
}
export interface PageInfo {
    endCursor: string;
    hasNextPage: boolean;
}
export interface PokemonEdge {
    cursor: string;
    node: Pokemon
}
export interface PokemonsData {
    edges: PokemonEdge[],
    pageInfo: PageInfo
}