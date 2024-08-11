import axios from "axios";
import {
  CHROMIUM_OWNER,
  CHROMIUM_REPO,

  GIT_TOKEN,

  GITHUB_BASE_URL,
} from "../lib/constant";
import {
  commitRepositoryFromEntity,
  githubServiceRepository,
} from "./MonitorRepositoryService";
import { RepositoryEntity } from "../entity/RepositoryEntity";
import { CommitEntity } from "../entity/CommitEntity";
import cdrlogger from "../lib/logFormat";

// export class GitHubService{}

export const getRepositoryData = async (
  repoOwner: string = CHROMIUM_OWNER,
  repository: string = CHROMIUM_REPO
) => {
  const repoResponse = await axios.get(

    `${GITHUB_BASE_URL}/${repoOwner}/${repository}`,
    {
      headers: {
        Authorization: `Bearer ${GIT_TOKEN}`,
      },
    }

  );
  return repoResponse.data;
};

export const getCommitsDataFromGit = async (
  repoOwner: string = CHROMIUM_OWNER,
  repository: string = CHROMIUM_REPO,
  page: number,
  lastSha: string | null,
  per_page: number = 100,
  since?: string
) => {
  const commitResponse = await axios.get(
    `${GITHUB_BASE_URL}/${repoOwner}/${repository}/commits`,
    {
      params: {
        sha: lastSha, // Fetch commits after this SHA
        per_page, // GitHub's max per page
        page: page,
        since,
      },

      headers: {
        Authorization: `Bearer ${GIT_TOKEN}`,
      },

    }
  );

  cdrlogger.info(
    commitResponse.data.length + "\n" + JSON.stringify(commitResponse.data)
  );
  return commitResponse.data;
};

export const fetchRepoDetailsAndSaveInDb = async (
  repoOwner: string = CHROMIUM_OWNER,
  repoName: string = CHROMIUM_REPO
) => {
  try {
    const repositoryData = await getRepositoryData(repoOwner, repoName);

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
    repositoryEntity.lastCommitSha = undefined;

    const savedResponse = await githubServiceRepository.save(repositoryEntity);

    console.debug("&&&&&&&&& saved  ", savedResponse);
    return savedResponse;
  } catch (error) {
    console.error("Failed to seed the database with commits data:", error);
    throw error; //
  }
};

export const fetchCommitsAndSaveInDB = async (
  repoOwner: string = CHROMIUM_OWNER,
  repoName: string = CHROMIUM_REPO
) => {
  try {
    const repositoryName = await githubServiceRepository.findOneBy({
      name: repoName,
    });

    if (!repositoryName) {
      throw new Error(`Repository with name ${repoName} not found.`);
    }

    let page = 1;
    let latestSha: string | null = null;

    while (page < 3) {

      //commits data fetch  from gitHub to database
      const commitsData = await getCommitsDataFromGit(
        repoOwner,
        repoName,
        page,
        latestSha
      );
      if (commitsData.length === 0) break;

      //bulk saving of commit list less expensive
      const commitlist = commitsData.map((commitObject: any) => {
        const commitEntity = new CommitEntity();
        commitEntity.repositoryId = repositoryName.id;
        commitEntity.message = commitObject.commit.message;
        commitEntity.author = commitObject.commit.author.name;
        commitEntity.date = new Date(commitObject.commit.author.date);
        commitEntity.url = commitObject.html_url;
        return commitEntity;
      });
      await commitRepositoryFromEntity.save(commitlist);

      //   if (!latestSha) {
      //     latestSha = commitsData.sha;
      //   }
      latestSha = commitsData[commitsData.length - 1].sha;
n
      page++;
    }

    // console.log("@@@@@@@ COMMIT LIST FRO DATABASE ", commitsData);
    //last commit sha saved for reference
    if (latestSha) {
      repositoryName.lastCommitSha = latestSha;
      await githubServiceRepository.save(repositoryName);
    }

    console.log("seeded the database with data from commits");
  } catch (error) {
    console.error("Failed to seed the database with commits data:", error);
    throw error; //
  }
};

export async function seedDatabaseWithRepository(
  repoOwner?: string,
  repoName?: string
) {
  await fetchRepoDetailsAndSaveInDb(repoName);


  await fetchCommitsAndSaveInDB(repoName);
}
