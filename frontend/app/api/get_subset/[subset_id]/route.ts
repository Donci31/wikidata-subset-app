import {DuckDBDecimalValue, DuckDBInstance, DuckDBTypeId, DuckDBValue} from '@duckdb/node-api';


export async function GET(request: Request, { params }: { params: Promise<{ subset_id: string }> }) {
    const subset_id = (await params).subset_id;
    const instance = await DuckDBInstance.create("wikidata.db", {"access_mode": "READ_ONLY"});
    const connection = await instance.connect();

    // Function to retrieve data as JSON objects
    async function getData(query: string): Promise<{ [key: string]: DuckDBValue }[]> {
        const prepared = await connection.prepare(query);
        prepared.bindVarchar(1, subset_id);

        const result = await prepared.runAndReadAll();
        const columnNames = result.columnNames();
        const columnTypes = result.columnTypes();
        const data = result.getRows();

        return data.map((row) =>
            columnNames.reduce((obj: { [key: string]: DuckDBValue }, col, index) => {
                if (columnTypes[index].typeId === DuckDBTypeId.DECIMAL) {

                    obj[col] = (row[index] as DuckDBDecimalValue).toDouble();
                } else {
                    obj[col] = row[index];
                }
                return obj;
            }, {})
        );
    }

    try {
        // Fetch nodes
        const nodes = await getData("SELECT * FROM user_subsets.items WHERE subset_id = $1");

        // Fetch edges
        const edges = await getData("SELECT * FROM user_subsets.claims WHERE subset_id = $1");

        // Fetch colormap
        const colormap = await getData("SELECT * FROM user_subsets.property WHERE subset_id = $1");

        // Combine into subset_data
        const subset_data = {
            nodes,
            edges,
            colormap,
        };

        // Return as JSON response
        return new Response(JSON.stringify(subset_data), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch subset data." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
