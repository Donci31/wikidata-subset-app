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
edges AS (
    SELECT src, dst, max(property) AS property
    FROM bfs
    GROUP BY src, dst
)
INSERT INTO user_subsets.claims (subset_id, src, dst, property)
SELECT '{subset_id}', edges.src, edges.dst, edges.property FROM edges;
