import json
import uuid

import duckdb
import pandas as pd
import random


def create_subset(starting_node: int, property_id: int, depth: int):
    with duckdb.connect('wikidata.db') as conn:
        with open('sql_queries/edges_query.sql', 'r') as file:
            edges_query = file.read().format(
                starting_node=starting_node,
                property_id=property_id,
                depth=depth
            )

        edge_df: pd.DataFrame = conn.execute(edges_query).fetchdf()

        with open('sql_queries/nodes_query.sql', 'r') as file:
            nodes_query = file.read().format(
                starting_node=starting_node,
                property_id=property_id,
                depth=depth
            )

        node_df: pd.DataFrame = conn.execute(nodes_query).fetchdf()

        unique_properties = edge_df['property'].unique()
        colormap = [
            {
                "property": str(prop),
                "color": "#{:06x}".format(random.randint(0, 0xFFFFFF)),
                "hidden": False
            }
            for prop in unique_properties
        ]

        subset_data = {
            "nodes": node_df.to_dict(orient="records"),
            "edges": edge_df.to_dict(orient="records"),
            "colormap": colormap
        }

        return subset_data


if __name__ == '__main__':
    subset_id = str(uuid.uuid4())

    data = create_subset(144, 279, 2)

    with open(f'subsets/{subset_id}.json', 'w') as f:
        json.dump(data, f, indent=4)
