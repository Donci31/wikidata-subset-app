import {DuckDBInstance, DuckDBValue} from '@duckdb/node-api';


export async function GET() {
    try {
        const instance = await DuckDBInstance.create("wikidata.db", {"access_mode": "READ_ONLY"});
        const connection = await instance.connect();
        const subsets = await connection.runAndReadAll("SELECT * FROM user_subsets.metadata");

        const columnNames = subsets.columnNames()
        const data = subsets.getRows()

        const result: { [key: string]: DuckDBValue }[] = data.map((row) =>
            columnNames.reduce((obj: { [key: string]: DuckDBValue }, col, index) => {
                obj[col] = row[index];
                return obj;
            }, {} as { [key: string]: string })
        );

        return Response.json(result);
    } catch (error) {
        console.error("Error fetching data:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch subset data." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
