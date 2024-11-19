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
edges AS (
    SELECT src, dst, max(property) AS property
    FROM bfs
    GROUP BY src, dst
)
SELECT * FROM edges;
