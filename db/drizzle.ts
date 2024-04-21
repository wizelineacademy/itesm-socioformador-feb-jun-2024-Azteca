import { Resource } from "sst";
import { drizzle } from "drizzle-orm/aws-data-api/pg";
import { RDSDataClient } from "@aws-sdk/client-rds-data"; // Fix: Import RDSDataClient from "@aws-sdk/client-rds-data-node"
import { migrate as migratePostgres } from "drizzle-orm/aws-data-api/pg/migrator";
import { fromIni } from '@aws-sdk/credential-providers';


const rdsClient = new RDSDataClient({
    credentials: fromIni({ profile: process.env['PROFILE'] }),
    region: 'us-east-2',
});


export async function migrate(path: string): Promise<void> {
    console.log("Running migrations...");
    try {
        await migratePostgres(db, { migrationsFolder: path });
        console.log("Migrations done.");
    } catch (error) {
        console.error("Error during migration:", error);
    }
}


export const db = drizzle(new RDSDataClient({}), {
    database: Resource.feedbackFlowdb.databaseName,
    secretArn: Resource.feedbackFlowdb.secretArn,
    resourceArn: Resource.feedbackFlowdb.clusterArn
});

  