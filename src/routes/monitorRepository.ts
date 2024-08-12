import { Router, Request, Response } from "express";
import {
  initiateMonitoring,
  initiateNewRecordsCheck,
  stopMonitoring,
} from "../services/MonitorRepositoryService";
import moment from "moment";

const router = Router();

router.post("/start-monitor", async (req: Request, res: Response) => {
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
    const result = await initiateMonitoring(owner, repository, startDate);

    //initiate new records check from now on
    await initiateNewRecordsCheck(owner, repository);
    if (!result.success) {
      return res.status(400).send({ status: 1, message: result.message });
    }

    res.status(200).send({
      status: 0,
      message:
        "Monitoring started for repositorysitory." + owner + " / " + repository,
    });
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
  const { owner, repository } = req.body;

  if (!owner || !repository) {
    return res.status(400).send("Missing required parameters: owner, repo.");
  }

  const result = stopMonitoring(owner, repository);

  if (!result.success) {
    return res.status(400).send({ status: 1, message: result.message });
  }

  res.status(200).send({ status: 0, message: result.message });
});
export default router;
