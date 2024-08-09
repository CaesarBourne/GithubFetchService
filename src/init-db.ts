import { initializeDatabase } from "./database";

initializeDatabase()
  .then(() => {
    console.log("Database initialization script completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error during database initialization:", error);
    process.exit(1);
  });
