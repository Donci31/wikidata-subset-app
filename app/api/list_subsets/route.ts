import {DuckDBInstance, DuckDBValue} from '@duckdb/node-api';


export async function GET() {
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
}
