import { AppDataSource } from "../database";
import { CommitEntity } from "../entity/CommitEntity";
import { RepositoryEntity } from "../entity/RepositoryEntity";
import {
  getCommitsDataFromGit,
  getRepositoryData,
  seedDatabaseWithRepository,
} from "./GithubService";
import { commitRepositoryFromEntity } from "./QueryService";
import cron from "node-cron";

export const githubServiceRepository =
  AppDataSource.getRepository(RepositoryEntity);

export const initiateMonitoring = async (
  owner: string,
  repo: string,
  since: string
) => {
  // Schedule the cron job to run every 10 minutes
  const job = cron.schedule("0 * * * *", async () => {
    // const job = cron.schedule("*/10 * * * *", async () => {
    try {
      console.log(`Fetching data for ${owner}/${repo}...`);

      await seedDatabaseWithRepository(owner, repo, since);

      console.log(`Data fetch and save completed for ${owner}/${repo}`);
    } catch (error) {
      console.error(
        `Error during fetching and saving data for ${owner}/${repo}:`,
        error
      );
    }
  });

  // Start the cron job immediately
  job.start();

  console.log(
    `Monitoring started for repository ${owner}/${repo}, scheduled every 10 minutes.`
  );
};
