import { AppDataSource } from "../database";
import { CommitEntity } from "../entity/CommitEntity";
import { RepositoryEntity } from "../entity/RepositoryEntity";
import { getCommitsData, getRepositoryInfo } from "./GithubService";

export const gitRepositoryFromEntity =
  AppDataSource.getRepository(RepositoryEntity);
export const commitRepositoryFromEntity =
  AppDataSource.getRepository(CommitEntity);

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
  } = await getRepositoryInfo(repoOwner, repo);
  const commitList = await getCommitsData(repoOwner, repo, startDate);
  let repositoryName = await gitRepositoryFromEntity.findOneBy({
    name: name,
  });
  if (!repositoryName) {
    repositoryName = gitRepositoryFromEntity.create({
      name,
      description,
      language,
      forksCount,
      html_url,
      open_issues_count,
      watchers_count,
      createdAt: new Date(created_at),
      updatedAt: new Date(updated_at),
    });
    await gitRepositoryFromEntity.save(repositoryName);
  }

  for (const commitObj of commitList) {
    const commitInRepo = await commitRepositoryFromEntity.findOneBy({
      html_url: commitObj.html_url,
    });
    const commit = commitRepositoryFromEntity.create({
      html_url: commitObj.html_url,
      date: new Date(commitObj?.commit?.author?.date),
      message: commitObj.commit.message,
      repository: repositoryName,
      author: commitObj.commit.author.name,
    });
  }
};

export const initiateMonitoring = (
  repoOwner: string,
  repo: string,
  timeInterval: number,
  startDate: string
) => {
  setInterval(
    () => monitorRepositoryService(repoOwner, repo, timeInterval, startDate),
    timeInterval
  );
};

// name: name,
// description: description,
// language: language,
// forksCount: forksCount,
// html_url: html_url,
// open_issues_count: open_issues_count,
// watchers_count: watchers_count,
// created_at: new Date(created_at),
// updated_at: new Date(updated_at),
