import * as React from 'react';
import { FC } from 'react';
import { Layout, Input, message, Row, Col } from 'antd';
import { Content, Footer, Header } from 'antd/lib/layout/layout';
import { Typography } from 'antd';
import { Select } from 'antd';

import './styles.less';
import CustomTable from './components/CustomTable';
import { gql, useLazyQuery } from '@apollo/client';
import { PokemonEdge } from './lib/types';
import { HeartOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

const POKEMONS = gql`
    query Query($after: ID, $q: String, $limit: Int) {
        pokemons(after: $after, q: $q, limit: $limit) {
            edges {
                cursor
                node {
                    id
                    name
                    types
                    classification
                }
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
`
const POKEMONSBYTYPE = gql`
    query Query($after: ID, $type: String!, $limit: Int) {
        pokemonsByType(after: $after, type: $type, limit: $limit) {
            edges {
                cursor
                node {
                    id
                    name
                    types
                    classification
                }
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
`
const POKEMONTYPES = gql`
    query Query {
        pokemonTypes {
            id
            name
        }
    }
`

const App: FC = () => {
    const [loadPokemons, { called, error, loading, data }] = useLazyQuery(POKEMONS);
    const [loadTypes, { called: calledTypes, error: errorTypes, loading: loadingTypes, data: dataTypes }] = useLazyQuery(POKEMONTYPES);
    const [loadPokemonsByTypes, { called: calledPByType, error: errorPByType, loading: loadingPByType, data: dataPByType }] = useLazyQuery(POKEMONSBYTYPE);
    const [pokemons, setPokemons] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState(null);
    const [filterValue, setFilterValue] = React.useState(null);

    React.useEffect(() => {
        getData();
        loadTypes();
    }, [])

    React.useEffect(() => {
        if (data && !filterValue) {
            const newPokemons: PokemonEdge[] = [...data.pokemons.edges];
            const oldPokemons: PokemonEdge[] = [...pokemons];
            setPokemons(oldPokemons.concat(newPokemons));
        } else if (filterValue && dataPByType) {
            const newPokemons: PokemonEdge[] = [...dataPByType.pokemonsByType.edges];
            const oldPokemons: PokemonEdge[] = [...pokemons];
            setPokemons(oldPokemons.concat(newPokemons));
        }
    }, [data, dataPByType, filterValue])

    const getData = (options?: { after?: string, q?: string, limit?: number }) => {
        const variables: { [key: string]: any } = options ? {
            after: options.after,
            q: options.q,
            limit: options.limit,
        } : null;
        loadPokemons({ variables })
    }

    const getDataByType = (options?: { after?: string, type: string, limit?: number }) => {
        const variables: { [key: string]: any } = options ? {
            after: options.after,
            type: options.type,
            limit: options.limit,
        } : null;

        loadPokemonsByTypes({ variables })
    }

    const onSearch = (value: string) => {
        setPokemons([]);
        setFilterValue(null);
        getData({ q: value })
    }

    const loadMoreItems = (lastItem: string) => {
        if (filterValue) {
            const options = { after: lastItem, type: filterValue }
            getDataByType(options)
        } else {
            const options = { after: lastItem, q: searchValue || '' }
            getData(options)
        }
    }

    const handleChangeSelect = (value: string) => {
        setPokemons([]);
        setSearchValue(null);
        if (value) {
            setFilterValue(value);
            getDataByType({ type: value })
        } else {
            setFilterValue(null);
            getData()
        }
    }

    if (error || errorPByType || errorTypes) {
        message.error('Something went wrong');
    }
    return (
        <Layout className='site-wrapper'>
            <Content className="site-content">
                <section className="page-container">
                    <Title level={1} className="page-title">Pokedex</Title>
                    <Text type="secondary">Search for a Pokemon by name or by type</Text>

                    <section className="filter-container">
                        <Row gutter={[16, 16]} justify="end" align="middle">
                            <Col className="gutter-row" xs={24} md={6} lg={4}>
                                <Search placeholder="Search Pokemon by Name" onSearch={onSearch} loading={loading} allowClear value={searchValue} onChange={(e) => setSearchValue(e.target.value)} enterButton />
                            </Col>
                            <Col className="gutter-row" xs={24} md={2} lg={1}>
                                <Text>or</Text>
                            </Col>
                            <Col className="gutter-row" xs={24} md={6} lg={4}>
                                <Select
                                    allowClear
                                    style={{ width: "100%" }}
                                    placeholder="Filter for Type"
                                    onChange={handleChangeSelect}
                                    value={filterValue}
                                >
                                    {(dataTypes?.pokemonTypes || []).map((item: { id: string, name: string }, i: number) => <Option key={i} value={item.id}>{item.name}</Option>)}
                                </Select>
                            </Col>
                        </Row>
                    </section>
                    <section className="table-container">
                        <CustomTable items={pokemons} data={filterValue ? dataPByType : data} loading={filterValue ? loadingPByType : loading} loadMoreData={loadMoreItems} />
                    </section>
                </section>
            </Content>
            <Footer className='site-footer'>Made with <HeartOutlined /> by Francesca Ropolo</Footer>
        </Layout>
    )
}

export default App