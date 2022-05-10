import * as React from 'react';
import { FC } from 'react';
import { Button, Card, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { PageInfo, Pokemon, PokemonEdge, PokemonsData } from '../lib/types';

const CustomTable: FC<{ items: PokemonEdge[], data: { pokemons?: PokemonsData, pokemonsByType?: PokemonsData }, loading: boolean, loadMoreData: Function }> = ({ items, data, loading, loadMoreData }) => {
    const dataSource: Pokemon[] = items?.map(item => {
        return { key: item.node.id, ...item.node }
    }) || [];
    const pageInfo: PageInfo = data?.pokemons?.pageInfo || data?.pokemonsByType?.pageInfo;

    const columns: ColumnsType<Pokemon> = [{
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: 'Type',
        dataIndex: 'types',
        key: 'types',
        render: (types: string[]) => (
            <>
                {types.map(type => {
                    let color;
                    switch (type) {
                        case 'Grass':
                            color = 'green'
                            break;
                        case 'Water':
                            color = 'blue'
                            break;
                        case 'Fire':
                            color = 'red'
                            break;
                        case 'Flying':
                            color = 'geekblue'
                            break;
                        case 'Poison':
                        case 'Ghost':
                            color = 'purple'
                            break;
                        case 'Bug':
                            color = 'lime'
                            break;
                        case 'Electric':
                            color = 'yellow'
                            break;
                        case 'Ground':
                            color = 'gold'
                            break;
                        case 'Fairy':
                        case 'Psychic':
                            color = 'magenta'
                            break;
                        case 'Fighting':
                            color = 'orange'
                            break;
                        case 'Ice':
                            color = 'cyan'
                            break;
                        case 'Dragon':
                            color = 'volcano'
                            break;
                        case 'Rock':
                        case 'Steel':
                            color = 'gray'
                            break;

                        default: 'default'
                            break;
                    }
                    return (
                        <Tag color={color} key={type}>
                            {type.toUpperCase()}
                        </Tag>
                    );
                })}
            </>
        ),
    },
    {
        title: 'Classification',
        dataIndex: 'classification',
        key: 'classification'
    }];

    const onLoadMore = () => {
        loadMoreData(pageInfo.endCursor)
    }
    return (
        <>
            <Card className='table-wrapper'>
                <Table<Pokemon> dataSource={dataSource} columns={columns} loading={loading} pagination={false} sticky scroll={{ y: 555 }} />
            </Card>
            {pageInfo?.hasNextPage && <Button disabled={loading} onClick={onLoadMore} type="primary" loading={loading}>Load More</Button>}
        </>
        // <Table<Pokemon> dataSource={dataSource} columns={columns} pagination={{ position: ['bottomRight'], hideOnSinglePage: !pageInfo?.hasNextPage, onChange: onChangePage, total: 80 }} loading={loading} />
    )
}

export default CustomTable