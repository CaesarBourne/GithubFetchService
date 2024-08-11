import { Router, Request, Response } from "express";
import { initiateMonitoring } from "../services/MonitorRepositoryService";

const router = Router();

router.post("/monitor", async (req: Request, res: Response) => {
  const { owner, repo, since } = req.body;

  if (!owner || !repo || !since) {
    return res
      .status(400)
      .send("Missing required parameters: owner, repo, since.");
  }

  // Validate the 'since' parameter if provided
  if (since && isNaN(Date.parse(since))) {
    return res.status(400).send("Invalid date format for 'since' parameter.");
  }

  try {
    await initiateMonitoring(owner, repo, since);
    res.status(200).send("Monitoring started for repository.");
  } catch (error) {
    console.error("Error starting monitoring service:", error);
    res.status(500).send("Error starting monitoring service.");
  }
});

export default router;
