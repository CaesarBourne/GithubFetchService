import "reflect-metadata";
import { DataSource } from "typeorm";
import { RepositoryEntity } from "./entity/RepositoryEntity";
import { CommitEntity } from "./entity/CommitEntity";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  entities: [RepositoryEntity, CommitEntity],
  synchronize: true,
  // logging : false,
});

// AppDataSource.initialize()
//   .then(() => {
//   })
//   .catch((error) => console.log(error));
