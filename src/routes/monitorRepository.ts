import { Router, Request, Response } from "express";
import {
  initiateMonitoring,
  stopMonitoring,
} from "../services/MonitorRepositoryService";
import moment from "moment";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { owner, repository, startDate } = req.body;

  if (!owner || !repository || !startDate) {
    return res.status(400).send({
      status: 1,
      message:
        "Missing one of the required parameters: owner, repository, startDate.",
    });
  }

  if (startDate && !isValidGitDate(startDate)) {
    return res.status(400).send({
      status: 1,
      message: "Invalid date format for 'startDate' parameter.",
    });
  }

  try {
    await initiateMonitoring(owner, repository, startDate);
    res.status(200).send("Monitoring started for repositorysitory.");
  } catch (error) {
    console.error("Error starting monitoring service:", error);
    res.status(500).send("Error starting monitoring service.");
  }
});

function isValidGitDate(startDate: string) {
  // Check if the date is in ISO 8601 format and is valid
  return moment(startDate, moment.ISO_8601, true).isValid();
}

router.post("/stop-monitor", async (req: Request, res: Response) => {
  const { owner, repo } = req.body;

  if (!owner || !repo) {
    return res.status(400).send("Missing required parameters: owner, repo.");
  }

  const result = stopMonitoring(owner, repo);

  if (!result.success) {
    return res.status(400).send(result.message);
  }

  res.status(200).send(result.message);
});
export default router;
