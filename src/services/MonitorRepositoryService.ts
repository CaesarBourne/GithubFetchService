import { AppDataSource } from "../database";
import { RepositoryEntity } from "../entity/RepositoryEntity";
import cron from "node-cron";
import { seedDatabaseWithRepository } from "./GithubService";

const activeJobs = new Map<string, cron.ScheduledTask>();

export const githubServiceRepository =
  AppDataSource.getRepository(RepositoryEntity);

/**
 * Starts a monitoring job to periodically fetch and save data from the GitHub repository.
 * @param owner - The owner of the GitHub repository.
 * @param repo - The name of the GitHub repository.
 * @param since - The date from which to start fetching commits.
 */
export const initiateMonitoring = async (
  owner: string,
  repo: string,
  since: string
) => {
  const repoKey = `${owner}/${repo}`;

  // Check if a cron job is already running for this repository
  if (activeJobs.has(repoKey)) {
    const message = `A monitoring job is already running for ${repoKey}.`;
    console.log(message);
    return { success: false, message };
  }

  // Schedule the cron job to run every 30 minutes
  const job = cron.schedule("*/30 * * * *", async () => {
    try {
      console.log(`Fetching data for ${repoKey}...`);
      await seedDatabaseWithRepository(owner, repo, since);
      console.log(`Data fetch and save completed for ${repoKey}.`);
    } catch (error) {
      console.error(
        `Error during fetching and saving data for ${repoKey}:`,
        error
      );
    }
  });

  // Start the cron job and store it in the map
  job.start();
  activeJobs.set(repoKey, job);
  console.log(`Monitoring started for ${repoKey}, scheduled every 10 minutes.`);
  return { success: true, message: `Monitoring started for ${repoKey}.` };
};

/**
 * Stops the monitoring job for a given repository.
 * @param owner - The owner of the GitHub repository.
 * @param repo - The name of the GitHub repository.
 */
export const stopMonitoring = (owner: string, repo: string) => {
  const repoKey = `${owner}/${repo}`;

  if (activeJobs.has(repoKey)) {
    const job = activeJobs.get(repoKey);
    job?.stop();
    activeJobs.delete(repoKey);
    console.log(`Monitoring job stopped for ${repoKey}.`);
    return { success: true, message: `Monitoring job stopped for ${repoKey}.` };
  } else {
    const message = `No monitoring job found for ${repoKey}.`;
    console.log(message);
    return { success: false, message };
  }
};

/**
 * Starts a job to periodically check for new records in the GitHub repository since a given date.
 * @param owner - The owner of the GitHub repository.
 * @param repo - The name of the GitHub repository.
 * @param since - The date from which to start checking for new records.
 */
export const initiateNewRecordsCheck = async (owner: string, repo: string) => {
  const repoKey = `${owner}/${repo}/newRecords`;

  // Check if a cron job is already running for this repository
  if (activeJobs.has(repoKey)) {
    const message = `A new records check job is already running for ${repoKey}.`;
    console.log(message);
    return { success: false, message };
  }
  let prsentDate = new Date().toISOString();
  // Schedule the cron job to run every 2 minutes
  const job = cron.schedule("*/1 * * * *", async () => {
    try {
      console.log(
        `Checking for new records in ${repoKey} since ${prsentDate}...`
      );
      await seedDatabaseWithRepository(owner, repo, prsentDate, true);
      console.log(`New records check and save completed for ${repoKey}.`);
    } catch (error) {
      console.error(
        `Error during checking and saving new records for ${repoKey}:`,
        error
      );
    }
  });

  // Start the cron job and store it in the map
  job.start();
  activeJobs.set(repoKey, job);
  console.log(
    `New records check started for ${repoKey}, scheduled every 2 minutes.`
  );
  return {
    success: true,
    message: `New records check started for ${repoKey}.`,
  };
};

/**
 * Stops the job that checks for new records for a given repository.
 * @param owner - The owner of the GitHub repository.
 * @param repo - The name of the GitHub repository.
 */
export const stopNewRecordsCheck = (owner: string, repo: string) => {
  const repoKey = `${owner}/${repo}/newRecords`;

  if (activeJobs.has(repoKey)) {
    const job = activeJobs.get(repoKey);
    if (job) {
      job.stop();
      activeJobs.delete(repoKey);
      console.log(`New records check for ${repoKey} has been stopped.`);
      return {
        success: true,
        message: `New records check job stopped for ${repoKey}.`,
      };
    }
  } else {
    const message = `No active new records check job found for ${repoKey}.`;
    console.log(message);
    return { success: false, message };
  }
};
