import "reflect-metadata";

import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import monitorRepository from "./routes/monitorRepository";
import queryRepository from "./routes/queryRepository";
import { initializeDatabase } from "./database";

import { port } from "./lib/constant";

const app = express();

// const dbFilePath = path.resolve(__dirname, "database.sqlite");
app.use(bodyParser.json());

app.use("/api/monitor", monitorRepository);
app.use("/api/query", queryRepository);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
