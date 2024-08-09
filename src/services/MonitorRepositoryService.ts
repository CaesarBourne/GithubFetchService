import { AppDataSource } from "../database";
import { CommitEntity } from "../entity/CommitEntity";
import { RepositoryEntity } from "../entity/RepositoryEntity";
import { getRepositoryInfo } from "./GithubService";

export const monitorRepositoryService = async (
  repoOwner: string,
  repo: string,
  timeInterval: number,
  startDate: string
) => {
  const gitRepositoryFromEntity = AppDataSource.getRepository(RepositoryEntity);
  const commitRepositoryFromEntity = AppDataSource.getRepository(CommitEntity);

  const {
    name,
    description,
    html_url,
    language,
    forksCount,
    starsCount,
    open_issues_count,
    watchers_count,
    created_at,
    updated_at,
  } = await getRepositoryInfo(repoOwner, repo);

  let repositoryName = await gitRepositoryFromEntity.findOne({
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
      created_at: new Date(created_at),
      updated_at: new Date(updated_at),
    });
  }
};
