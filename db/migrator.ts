import {migrate} from "./drizzle";

async function runMigrations() {
    console.log("Iniciando migraciones...");
    try {
        await migrate("./drizzlemigrations"); 
        console.log("Migraciones completadas exitosamente.");
    } catch (error) {
        console.error("Error al ejecutar migraciones:", error);
    }
}

runMigrations();








