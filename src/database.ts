import "reflect-metadata";
import { DataSource } from "typeorm";
import { RepositoryEntity } from "./entity/RepositoryEntity";
import { CommitEntity } from "./entity/CommitEntity";
import { initiateMonitoring } from "./services/MonitorRepositoryService";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  entities: [RepositoryEntity, CommitEntity],
  synchronize: true,
  // logging : false,
});

initiateMonitoring("facebook", "react", 36000, "2024-01-01T00:00:00Z");

// AppDataSource.initialize()
//   .then(() => {
//   })
//   .catch((error) => console.log(error));
