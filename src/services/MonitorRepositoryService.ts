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

export const monitorRepositoryService = async (
  repoOwner: string,
  repo: string,
  timeInterval: number,
  startDate: string
) => {
  const {
    name,
    description,
    html_url,
    language,
    forksCount,
    stargazers_count,
    open_issues_count,
    watchers_count,
    created_at,
    updated_at,
  } = await getRepositoryData(repoOwner, repo);
  const commitList = await getCommitsDataFromGit(
    repoOwner,
    repo,
    12,
    null,
    100
  );
  let repositoryName = await githubServiceRepository.findOneBy({
    name: name,
  });
  if (!repositoryName) {
    repositoryName = githubServiceRepository.create({
      name,
      description,
      language,
      forksCount,
      url: html_url,
      starsCount: stargazers_count,
      openIssuesCount: open_issues_count,
      watchersCount: watchers_count,
      createdAt: new Date(created_at),
      updatedAt: new Date(updated_at),
    });
    await githubServiceRepository.save(repositoryName);
  }

  for (const commitObj of commitList) {
    const commitInRepo = await commitRepositoryFromEntity.findOneBy({
      url: commitObj.html_url,
    });
    const commit = commitRepositoryFromEntity.create({
      url: commitObj.html_url,
      date: new Date(commitObj?.commit?.author?.date),
      message: commitObj.commit.message,
      repository: repositoryName,
      author: commitObj.commit.author.name,
    });
  }
};

// export const initiateMonitoring = (
//   repoOwner: string,
//   repo: string,
//   timeInterval: number,
//   startDate: string
// ) => {
//   setInterval(
//     () => monitorRepositoryService(repoOwner, repo, timeInterval, startDate),
//     timeInterval
//   );
// };

export const initiateMonitoring = async (
  owner: string,
  repo: string,
  since: string
) => {
  // Schedule the cron job to run every 10 minutes
  const job = cron.schedule("*/10 * * * *", async () => {
    try {
      console.log(`Fetching data for ${owner}/${repo}...`);
      // Start the process and limit it to a maximum of 20 requests
      await seedDatabaseWithRepository(owner, repo, since); // Pass the since parameter
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
