import { Router, Request, Response } from "express";
import {
  fetchCommitsByRepository,
  fetchTopCommitAuthors,
} from "../services/QueryService";
import { debug } from "console";
import { githubServiceRepository } from "../services/MonitorRepositoryService";

const router = Router();

router.get("/top-authors", async (req: Request, res: Response) => {
  const { limit } = req.query;

  console.debug("limit data %%%%%%%%%% ", limit);
  try {
    const authors = await fetchTopCommitAuthors(Number(limit) || 10);
    res.status(200).json(authors);
  } catch (error) {
    console.error("!!!!!! error  for top authors data ", error);
    res.status(500).send("Error retrieving top authors." + error);
  }
});

// Route to get commits by repository name
// router.get("/commits/:repositoryName", async (req: Request, res: Response) => {
//   const { repositoryName } = req.params;
//   try {
//     const commits = await fetchCommitsByRepository(repositoryName);
//     res.status(200).json(commits);
//   } catch (error) {
//     res.status(500).send("Error retrieving commits.");
//   }
// });

router.get("/commits/:repositoryName", async (req: Request, res: Response) => {
  const { repositoryName } = req.params;
  const page = parseInt(req.query.page as string);
  const limit = parseInt(req.query.limit as string);

  // Validate repositoryName
  if (!repositoryName || typeof repositoryName !== "string") {
    return res.status(400).json({
      status: 1,
      message: "Invalid or missing 'repositoryName' parameter.",
    });
  }

  // Validate page
  if (isNaN(page) || page < 1) {
    return res.status(400).json({
      status: 1,
      message: "Invalid 'page' parameter. It must be a positive integer.",
    });
  }

  // Validate limit
  if (isNaN(limit) || limit < 1) {
    return res.status(400).json({
      status: 1,
      message: "Invalid 'limit' parameter. It must be a positive integer.",
    });
  }

  try {
    //  Check if the repository exists in the database
    const repositoryExists = await githubServiceRepository.findOneBy({
      name: repositoryName,
    });
    if (!repositoryExists) {
      return res.status(404).json({
        status: 1,
        message: "Repository not found.",
      });
    }

    // Fetch commits with pagination
    const commits = await fetchCommitsByRepository(repositoryName, page, limit);

    return res.status(200).json({
      status: 0,
      message: "Success",
      data: commits,
    });
  } catch (error: any) {
    console.error("Error retrieving commits:", error);
    return res.status(500).json({
      status: 1,
      message: "Error retrieving commits.",
      error: error.message,
    });
  }
});

export default router;
