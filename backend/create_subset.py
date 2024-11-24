import uuid

import duckdb


def create_subset(subset_id: str, name: str, starting_node: int, property_id: int, depth: int):
    with duckdb.connect('wikidata.db') as conn:
        with open('sql_queries/edges_query.sql', 'r') as file:
            edges_query = file.read().format(
                subset_id=subset_id,
                starting_node=starting_node,
                property_id=property_id,
                depth=depth
            )
            conn.execute(edges_query)

        with open('sql_queries/nodes_query.sql', 'r') as file:
            nodes_query = file.read().format(
                subset_id=subset_id,
                starting_node=starting_node,
                property_id=property_id,
                depth=depth
            )
            conn.execute(nodes_query)

        with open('sql_queries/property_query.sql', 'r') as file:
            property_query = file.read().format(
                subset_id=subset_id
            )
            conn.execute(property_query)

        with open('sql_queries/metadata_query.sql', 'r') as file:
            metadata_query = file.read().format(
                subset_id=subset_id,
                name=name,
                language='en'
            )
            conn.execute(metadata_query)


if __name__ == '__main__':
    subset_ids = str(uuid.uuid4())

    create_subset(subset_ids, 'Hello', 5, 279, 6)
