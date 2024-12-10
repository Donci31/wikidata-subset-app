import {DuckDBInstance} from '@duckdb/node-api';
import { v4 as uuidv4 } from 'uuid';
import {
    edgesQuery,
    nodesQuery,
    propertyQuery,
    metadataQuery,
    edgesQueryProperty,
    nodesQueryProperty
} from '@/sql/queries'


export async function POST(request: Request) {
    try {
        const data = await request.json();
        const subset_id = uuidv4();

        const instance = await DuckDBInstance.create("wikidata.db", {"access_mode": "READ_WRITE"});
        const connection = await instance.connect();

        console.log(data.property_id)

        if (data.property_id !== undefined) {
            const preparedEdges = await connection.prepare(edgesQueryProperty);
            preparedEdges.bindInteger(1, Number(data.starting_node))
            preparedEdges.bindInteger(2, Number(data.property_id))
            preparedEdges.bindInteger(3, data.depth)
            preparedEdges.bindVarchar(4, subset_id)

            const preparedNodes = await connection.prepare(nodesQueryProperty);
            preparedNodes.bindInteger(1, Number(data.starting_node))
            preparedNodes.bindInteger(2, Number(data.property_id))
            preparedNodes.bindInteger(3, data.depth)
            preparedNodes.bindVarchar(4, subset_id)

            await preparedEdges.run()
            await preparedNodes.run()
        } else {
            const preparedEdges = await connection.prepare(edgesQuery);
            preparedEdges.bindInteger(1, Number(data.starting_node))
            preparedEdges.bindInteger(2, data.depth)
            preparedEdges.bindVarchar(3, subset_id)

            const preparedNodes = await connection.prepare(nodesQuery);
            preparedNodes.bindInteger(1, Number(data.starting_node))
            preparedNodes.bindInteger(2, data.depth)
            preparedNodes.bindVarchar(3, subset_id)

            await preparedEdges.run()
            await preparedNodes.run()
        }

        const preparedProperties = await connection.prepare(propertyQuery);
        preparedProperties.bindVarchar(1, subset_id)

        const preparedMetadata = await connection.prepare(metadataQuery);
        preparedMetadata.bindVarchar(1, subset_id)
        preparedMetadata.bindVarchar(2, data.name)
        preparedMetadata.bindVarchar(3, 'en')

        await preparedProperties.run()
        await preparedMetadata.run()

        return Response.json({
            subset_id: subset_id,
            name: data.name,
            language: 'en',
            message: 'Subset created successfully.',
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch subset data." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
