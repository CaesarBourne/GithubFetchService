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
const activeJobs = new Map<string, cron.ScheduledTask>();

export const githubServiceRepository =
  AppDataSource.getRepository(RepositoryEntity);

export const initiateMonitoring = async (
  owner: string,
  repo: string,
  since: string
) => {
  const repoKey = `${owner}/${repo}`;

  // Check if the cron job is already running for this repository
  if (activeJobs.has(repoKey)) {
    console.log(`A monitoring job is already running for ${repoKey}.`);
    return {
      success: false,
      message: `Monitoring job already running for ${repoKey}.`,
    };
  }

  // Schedule the cron job to run every 10 minutes
  //   const job = cron.schedule("0 * * * *", async () => {
  const job = cron.schedule("*/1 * * * *", async () => {
    try {
      console.log(`Fetching data for ${repoKey}...`);

      await seedDatabaseWithRepository(owner, repo, since);

      console.log(`Data fetch and save completed for ${owner}/${repo}`);
    } catch (error) {
      console.error(
        `Error during fetching and saving data for ${owner}/${repo}:`,
        error
      );
    }
  });

  // Start the cron job immediately store in map to validate its running
  await job.start();
  activeJobs.set(repoKey, job);
  console.log(`Monitoring started for ${repoKey}, scheduled every hour.`);
  return { success: true, message: `Monitoring started for ${repoKey}.` };
};

export const stopMonitoring = (owner: string, repo: string) => {
  const repoKey = `${owner}/${repo}`;

  if (activeJobs.has(repoKey)) {
    const job = activeJobs.get(repoKey);
    job?.stop();
    activeJobs.delete(repoKey); // Remove it from the active jobs map
    console.log(`Monitoring job stopped for ${repoKey}.`);
    return { success: true, message: `Monitoring job stopped for ${repoKey}.` };
  } else {
    return {
      success: false,
      message: `No monitoring job found for ${repoKey}.`,
    };
  }
};

//background service to check for new records

export const initiateNewRecordsCheck = async (
  owner: string,
  repo: string,
  since: string
) => {
  const repoKey = `${owner}/${repo}/newRecords`;

  // Check if a cron job is already running for this repository
  if (activeJobs.has(repoKey)) {
    console.log(`A new records check job is already running for ${repoKey}.`);
    return {
      success: false,
      message: `New records check job already running for ${repoKey}.`,
    };
  }

  const job = cron.schedule("*/1 * * * *", async () => {
    // const job = cron.schedule("0 * * * *", async () => {
    try {
      console.log(`Checking for new records in ${repoKey} since ${since}...`);

      await seedDatabaseWithRepository(owner, repo, since, true);

      console.log(`New records check and save completed for ${owner}/${repo}`);
    } catch (error) {
      console.error(
        `Error during checking and saving new records for ${owner}/${repo}:`,
        error
      );
    }
  });

  await job.start();
  activeJobs.set(repoKey, job);
  console.log(
    `New records check started for ${repoKey}, scheduled every hour.`
  );
  return {
    success: true,
    message: `New records check started for ${repoKey}.`,
  };
};

// Function to stop the job if needed
export const stopNewRecordsCheck = (owner: string, repo: string) => {
  const repoKey = `${owner}/${repo}`;

  if (activeJobs.has(repoKey)) {
    const job = activeJobs.get(repoKey);
    if (job) {
      job.stop();
      activeJobs.delete(repoKey);
      console.log(`New records check for ${repoKey} has been stopped.`);
      return { success: true, message: `Job for ${repoKey} stopped.` };
    }
  } else {
    console.log(`No active job found for ${repoKey}.`);
    return { success: false, message: `No active job found for ${repoKey}.` };
  }
};
