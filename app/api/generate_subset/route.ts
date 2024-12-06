import {DuckDBInstance} from '@duckdb/node-api';
import { v4 as uuidv4 } from 'uuid';
import {edgesQuery, nodesQuery, propertyQuery, metadataQuery} from '@/sql/queries'


export async function POST(request: Request) {
    const data = await request.json();
    const subset_id = uuidv4();

    const instance = await DuckDBInstance.create("wikidata.db", {"access_mode": "READ_WRITE"});
    const connection = await instance.connect();

    const preparedEdges = await connection.prepare(edgesQuery);
    preparedEdges.bindInteger(1, Number(data.starting_node))
    preparedEdges.bindInteger(2, Number(data.property_id))
    preparedEdges.bindInteger(3, data.depth)
    preparedEdges.bindVarchar(4, subset_id)

    const preparedNodes = await connection.prepare(nodesQuery);
    preparedNodes.bindInteger(1, Number(data.starting_node))
    preparedNodes.bindInteger(2, Number(data.property_id))
    preparedNodes.bindInteger(3, data.depth)
    preparedNodes.bindVarchar(4, subset_id)

    const preparedProperties = await connection.prepare(propertyQuery);
    preparedProperties.bindVarchar(1, subset_id)

    const preparedMetadata = await connection.prepare(metadataQuery);
    preparedMetadata.bindVarchar(1, subset_id)
    preparedMetadata.bindVarchar(2, data.name)
    preparedMetadata.bindVarchar(3, 'en')

    await preparedEdges.run()
    await preparedNodes.run()
    await preparedProperties.run()
    await preparedMetadata.run()

    connection.interrupt()

    return Response.json({
        subset_id: subset_id,
        name: data.name,
        language: 'en',
        message: 'Subset created successfully.',
    });
}
