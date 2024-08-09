import { commitRepositoryFromEntity } from "./MonitorRepositoryService";

export const fetchTopCommitAuthors = async (limit: number) => {
  return await commitRepositoryFromEntity
    .createQueryBuilder("commit")
    .select("commit.author")
    .addSelect("COUNT(commit.id)", "commitCount")
    .groupBy("commit.author")
    .orderBy("commitCount", "DESC")
    .limit(limit)
    .getRawMany();
};

export const fetchCommitsByRepository = async (repoName: string) => {
  return await commitRepositoryFromEntity
    .createQueryBuilder("commit")
    .innerJoinAndSelect("commit.repository", "repository")
    .where("repository.name = :repoName", { repoName })
    .getMany();
};
