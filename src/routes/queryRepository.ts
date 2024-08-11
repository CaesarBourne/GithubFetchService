import { Router, Request, Response } from "express";
import {
  fetchCommitsByRepository,
  fetchTopCommitAuthors,
} from "../services/QueryService";

const router = Router();

router.get("/top-authors", async (req: Request, res: Response) => {
  const { limit } = req.query;
  try {
    const authors = await fetchTopCommitAuthors(Number(limit) || 10);
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).send("Error retrieving top authors." + error);
  }
});

// Route to get commits by repository name
router.get("/commits/:repositoryName", async (req: Request, res: Response) => {
  const { repositoryName } = req.params;
  try {
    const commits = await fetchCommitsByRepository(repositoryName);
    res.status(200).json(commits);
  } catch (error) {
    res.status(500).send("Error retrieving commits.");
  }
});

export default router;
