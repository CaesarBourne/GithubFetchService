import { initializeDatabase } from "./database";
import { seedDatabaseWithRepository } from "./services/GithubService";

// initializeDatabase()
//   .then(() => {
//     console.log("Database initialization script completed.");
//     process.exit(0);
//   })
//   .catch((error) => {
//     console.error("Error during database initialization:", error);
//     process.exit(1);
//   });

export async function initAndSeedDatabase() {
  try {
    // Initialize the database
    await initializeDatabase();
    console.log("Database initialized successfully.");

    // Seed the database
    await seedDatabaseWithRepository();
    console.log("Database seeded with repository data successfully.");
  } catch (error) {
    // Handle and log any errors during initialization or seeding
    console.error("Error during database seeding:", error);

    // Exit the process with a non-zero exit code to indicate failure
    process.exit(1);
  }
}

// Example usage
initAndSeedDatabase().catch((error) => {
  console.error("Critical failure in initAndSeedDatabase:", error);
  process.exit(1);
});
