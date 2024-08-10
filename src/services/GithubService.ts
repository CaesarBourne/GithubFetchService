import axios from "axios";
import {
  CHROMIUM_OWNER,
  CHROMIUM_REPO,
  GITHUB_BASE_URL,
} from "../lib/constant";
import {
  commitRepositoryFromEntity,
  githubServiceRepository,
} from "./MonitorRepositoryService";
import { RepositoryEntity } from "../entity/RepositoryEntity";
import { CommitEntity } from "../entity/CommitEntity";

export const getRepositoryData = async (
  repoOwner: string = CHROMIUM_OWNER,
  repository: string = CHROMIUM_REPO
) => {
  const repoResponse = await axios.get(
    `${GITHUB_BASE_URL}/${repoOwner}/${repository}`
  );
  //   const repoResponse = await axios.get(GITHUB_API_URL);
  return repoResponse.data;
};

export const getCommitsData = async (
  repoOwner: string = CHROMIUM_OWNER,
  repository: string = CHROMIUM_REPO,
  since?: string
) => {
  const commitResponse = await axios.get(
    `${GITHUB_BASE_URL}/${repoOwner}/${repository}/commits`,
    {
      params: { since },
    }
  );

  return commitResponse.data;
};

export async function seedDatabaseWithRepository() {
  const repositoryData = await getRepositoryData();

  console.log("^^^^^^^^^^ repo LIST FRO DATABASE ", repositoryData);

  const repositoryEntity = new RepositoryEntity();
  repositoryEntity.name = repositoryData.name;
  repositoryEntity.description = repositoryData.description;
  repositoryEntity.url = repositoryData.html_url;
  repositoryEntity.language = repositoryData.language;
  repositoryEntity.forksCount = repositoryData.forks_count;
  repositoryEntity.starsCount = repositoryData.stargazers_count;
  repositoryEntity.openIssuesCount = repositoryData.open_issues_count;
  repositoryEntity.watchersCount = repositoryData.watchers_count;
  repositoryEntity.createdAt = new Date(repositoryData.created_at);
  repositoryEntity.updatedAt = new Date(repositoryData.updated_at);

  await githubServiceRepository.save(repositoryEntity);
  try {
    //commits data fetch and save to database
    const commitsData = await getCommitsData();
    // console.log("@@@@@@@ COMMIT LIST FRO DATABASE ", commitsData);

    const commitEntity = new CommitEntity();
    const commitlist = commitsData.map((commitObject: any) => {
      commitEntity.repositoryId = repositoryEntity.id;
      commitEntity.message = commitObject.commit.message;
      commitEntity.author = commitObject.commit.author.name;
      commitEntity.date = new Date(commitObject.commit.author.date);
      commitEntity.url = commitObject.html_url;
      return commitEntity;
    });
    await commitRepositoryFromEntity.save(commitlist);
    console.log("seeded the database with data from chromium");
  } catch (error) {
    console.error("Failed to seed the database with repository data:", error);
    throw error; //
  }
}
// seedDatabaseWithRepository().catch((error) =>
//   console.error("error seeding database ", error)
// );
