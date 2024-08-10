// import "reflect-metadata";
import { DataSource } from "typeorm";
import { RepositoryEntity } from "./entity/RepositoryEntity";
import { CommitEntity } from "./entity/CommitEntity";
// import { initiateMonitoring } from "./services/MonitorRepositoryService";
import * as fs from "fs";
import * as path from "path";

const dbFilePath = path.resolve(__dirname, "../database.sqlite");
export const AppDataSource = new DataSource({
  type: "sqlite",
  //   database: dbFilePath,
  database: "database.sqlite",
  entities: [RepositoryEntity, CommitEntity],
  synchronize: true,
  logging: true,
  migrations: [],
  subscribers: [],
});

export const initializeDatabase = async () => {
  if (fs.existsSync(dbFilePath)) {
    console.log("Database already exists. Skipping creation.");
    return;
  }

  console.log("Database does not exist. Creating now...");

  try {
    await AppDataSource.initialize();
    console.log("Database created and connected successfully.");
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
};
