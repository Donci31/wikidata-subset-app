WITH RECURSIVE bfs AS (
    SELECT
        src,
        dst,
        property,
        1 AS level
    FROM
        main.claims
    WHERE
        dst = {starting_node}
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
        main.claims c ON bfs.src = c.dst AND c.property = {property_id}
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
SELECT nodes.*, random() AS x, random() AS y FROM nodes;
