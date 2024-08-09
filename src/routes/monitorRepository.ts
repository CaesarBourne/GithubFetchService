import { Router, Request, Response } from "express";
import { initiateMonitoring } from "../services/MonitorRepositoryService";

const router = Router();

router.post("/monitor", async (req: Request, res: Response) => {
  const { owner, repo, interval, startDate } = req.body;
  try {
    await initiateMonitoring(owner, repo, interval, startDate);
    res.status(200).send("Monitoring started for repository.");
  } catch (error) {
    res.status(500).send("Error starting monitoring service.");
  }
});

export default router;
