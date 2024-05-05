// Cargar variables de entorno desde .env
require("dotenv").config();
// Importaciones
import { Resource } from "sst";
//import { drizzle } from "drizzle-orm/aws-data-api/pg";
import { migrate } from "drizzle-orm/aws-data-api/pg/migrator";
import { RDSDataClient } from "@aws-sdk/client-rds-data";
import { fromIni } from "@aws-sdk/credential-providers";
import { drizzle } from "drizzle-orm/vercel-postgres";

// Obtener el perfil de AWS desde las variables de entorno o usar 'default'
const awsProfile = process.env.AWS_PROFILE || "default";

// Configuración del cliente RDSDataClient usando el perfil de AWS
const sql = new RDSDataClient({
  credentials: fromIni({ profile: awsProfile }),
  region: "us-east-1",
});

//console.log("SQL", sql);

// Configuración de la conexión de Drizzle ORM
export const db = drizzle(sql, {
  database: Resource.Postgres.database,
  secretArn: Resource.Postgres.secretArn,
  resourceArn: Resource.Postgres.clusterArn,
});

//console.log("DB", db);

// Función principal para ejecutar migraciones
const main = async () => {
  try {
    await migrate(db, { migrationsFolder: "drizzlemigrations" });
    console.log("Migration complete");
  } catch (error) {
    // console.log(error, "Error running migrations");
  }
  process.exit(0);
};

// Ejecutar la función principal
//main();
