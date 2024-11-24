WITH RECURSIVE bfs AS (
    SELECT
        src,
        dst,
        property,
        1 AS level
    FROM
        main.claims
    WHERE
        src = {starting_node}
    AND
        property = {property_id}

    UNION ALL

    SELECT
        c.src,
        c.dst,
        c.property,
        bfs.level + 1 AS level
    FROM
        bfs
    JOIN
        main.claims c ON bfs.dst = c.src AND c.property = {property_id}
    WHERE
        bfs.level < {depth}
),
node_ids AS (
    SELECT bfs.src AS id, bfs.level
    FROM bfs
    UNION
    SELECT bfs.dst AS id, bfs.level
    FROM bfs
    UNION
    SELECT {starting_node}, 0
),
node_ids_grouped AS (
    SELECT id, MIN(level) as level
    FROM node_ids
    GROUP BY id
),
nodes AS (
    SELECT
        node_ids_grouped.id,
        items_dst.label,
        items_dst.description,
        node_ids_grouped.level
    FROM
        node_ids_grouped
    LEFT JOIN
        en.items AS items_dst ON node_ids_grouped.id = items_dst.id
)
INSERT INTO user_subsets.items (subset_id, id, label, description, level, x, y)
SELECT '{subset_id}', nodes.id, nodes.label, nodes.description, nodes.level, random() AS x, random() AS y
FROM nodes;
