import { AppDataSource } from "../database";
import { CommitEntity } from "../entity/CommitEntity";
import { RepositoryEntity } from "../entity/RepositoryEntity";
import { getCommitsDataFromGit, getRepositoryData } from "./GithubService";
import { commitRepositoryFromEntity } from "./QueryService";

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
