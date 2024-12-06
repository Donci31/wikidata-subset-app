export const edgesQuery = `
WITH RECURSIVE bfs AS (
    SELECT
        src,
        dst,
        property,
        1 AS level
    FROM
        main.claims
    WHERE
        src = $1
    AND
        property = $2

    UNION ALL

    SELECT
        c.src,
        c.dst,
        c.property,
        bfs.level + 1 AS level
    FROM
        bfs
    JOIN
        main.claims c ON bfs.dst = c.src AND c.property = $2
    WHERE
        bfs.level < $3
),
edges AS (
    SELECT src, dst, max(property) AS property
    FROM bfs
    GROUP BY src, dst
)
INSERT INTO user_subsets.claims (subset_id, src, dst, property)
SELECT $4, edges.src, edges.dst, edges.property FROM edges;
`;

export const nodesQuery = `
WITH RECURSIVE bfs AS (
    SELECT
        src,
        dst,
        property,
        1 AS level
    FROM
        main.claims
    WHERE
        src = $1
    AND
        property = $2

    UNION ALL

    SELECT
        c.src,
        c.dst,
        c.property,
        bfs.level + 1 AS level
    FROM
        bfs
    JOIN
        main.claims c ON bfs.dst = c.src AND c.property = $2
    WHERE
        bfs.level < $3
),
node_ids AS (
    SELECT bfs.src AS id, bfs.level
    FROM bfs
    UNION
    SELECT bfs.dst AS id, bfs.level
    FROM bfs
    UNION
    SELECT $1, 0
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
SELECT $4, nodes.id, nodes.label, nodes.description, nodes.level, random() AS x, random() AS y
FROM nodes;
`;

export const propertyQuery = `
INSERT INTO user_subsets.property (subset_id, id, label, description, color, hidden)
select $1, id, label, description, '#' || LPAD(TO_HEX(FLOOR(RANDOM() * 16777216)::INT), 6, '0'), False
from en.property
where id in (
    select distinct c.property from user_subsets.claims c where subset_id = $1
)

`;

export const metadataQuery = `
INSERT INTO user_subsets.metadata (subset_id, name, language)
VALUES ($1, $2, $3)
`;