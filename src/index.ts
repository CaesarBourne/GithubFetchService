import "reflect-metadata";

import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import monitorRepository from "./routes/monitorRepository";
import queryRepository from "./routes/queryRepository";

import { port } from "./lib/constant";
// import { initializeDatabase } from "./database";
import { initAndSeedDatabase } from "./init-seed-db";
// import { initializeDatabase } from "./database";

const app = express();

// const dbFilePath = path.resolve(__dirname, "database.sqlite");
app.use(bodyParser.json());

app.use((err: any, req: any, res: any, next: any) => {
  console.error("!!!!!!!!!!!!!server errror!!!!! ", err);
});

app.use("/api/monitor", monitorRepository);
app.use("/api/query", queryRepository);

const startServer = async () => {
  await initAndSeedDatabase();
  // "prestart:prod": "node dist/init-seed-db.js",initAndSeedDatabase
  // "prestart": "ts-node src/init-seed-db.ts",

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};
startServer();
