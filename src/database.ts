import "reflect-metadata";
import { DataSource } from "typeorm";
import { Repository } from "./entity/Repository";
import { CommitEntity } from "./entity/CommitEntity";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  entities: [Repository, CommitEntity],
  synchronize: true,
  // logging : false,
});

// AppDataSource.initialize()
//   .then(() => {
//   })
//   .catch((error) => console.log(error));
