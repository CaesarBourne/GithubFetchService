import "reflect-metadata";

import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import monitorRepository from "./routes/monitorRepository";
import queryRepository from "./routes/queryRepository";
import { connectDatabase } from "./database";

const app = express();
const port = 3000;

app.use(bodyParser.json());

connectDatabase();

app.use("/api/monitor", monitorRepository);
app.use("/api/query", queryRepository);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
