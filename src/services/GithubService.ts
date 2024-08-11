import axios from "axios";
import {
  CHROMIUM_OWNER,
  CHROMIUM_REPO,
  GIT_TOKEN,
  GITHUB_BASE_URL,
} from "../lib/constant";
import { githubServiceRepository } from "./MonitorRepositoryService";
import { RepositoryEntity } from "../entity/RepositoryEntity";
import { CommitEntity } from "../entity/CommitEntity";
import cdrlogger from "../lib/logFormat";
import { commitRepositoryFromEntity } from "./QueryService";

// export class GitHubService{}

export const getRepositoryData = async (
  repoOwner: string = CHROMIUM_OWNER,
  repository: string = CHROMIUM_REPO,
  since: string
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
  since: string,
  latestSha?: any
) => {
  let paramsData;

  if (latestSha) {
    console.log("######### latest sha $$$$$$$$$$", latestSha);
    cdrlogger.info(latestSha);

    paramsData = {
      sha: latestSha, // Fetch commits after this SHA
      per_page: 10, // GitHub's max per page
      since,
    };
  } else {
    console.log("no lates sha !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

    paramsData = {
      per_page: 100,
      since,
    };
  }
  const commitResponse = await axios.get(
    `${GITHUB_BASE_URL}/${repoOwner}/${repository}/commits`,
    {
      params: paramsData,

      headers: {
        Authorization: `Bearer ${GIT_TOKEN}`,
      },
    }
  );

  return commitResponse.data;
};

export const fetchRepoDetailsAndSaveInDb = async (
  repoOwner: string = CHROMIUM_OWNER,
  repoName: string = CHROMIUM_REPO,
  since: string
) => {
  try {
    const repositoryData = await getRepositoryData(repoOwner, repoName, since);

    // const repositoryEntity = new RepositoryEntity();
    let repositoryEntity = await githubServiceRepository.findOneBy({
      name: repoName,
    });
    if (!repositoryEntity) {
      repositoryEntity = new RepositoryEntity();
      repositoryEntity.createdAt = new Date(repositoryData.created_at);
    }
    //b0e64ff9ad81b75bd70ef94a420403886fe2f11c
    repositoryEntity.name = repositoryData.name;
    repositoryEntity.description = repositoryData.description;
    repositoryEntity.url = repositoryData.html_url;
    repositoryEntity.language = repositoryData.language;
    repositoryEntity.forksCount = repositoryData.forks_count;
    repositoryEntity.starsCount = repositoryData.stargazers_count;
    repositoryEntity.openIssuesCount = repositoryData.open_issues_count;
    repositoryEntity.watchersCount = repositoryData.watchers_count;
    repositoryEntity.updatedAt = new Date();
    repositoryEntity.lastCommitSha =
      repositoryEntity.lastCommitSha || undefined;

    // Save the repository entity updating or inserting
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
  repoName: string = CHROMIUM_REPO,
  since: string
) => {
  try {
    const repositoryName = await githubServiceRepository.findOneBy({
      name: repoName,
    });

    if (!repositoryName) {
      throw new Error(`Repository with name ${repoName} not found.`);
    }

    // let page = 1;
    //log records
    cdrlogger.info(repositoryName.lastPageNumber);

    let page = repositoryName.lastPageNumber ?? 1;
    let latestSha: string | null = repositoryName.lastCommitSha || null;
    //not  fetch too many page at once
    // const pageCompare = repositoryName.lastPageNumber ?? 1;

    const rateLimit = 10;

    while (page < rateLimit) {
      //commits data fetch  from gitHub to database
      const commitsData = await getCommitsDataFromGit(
        repoOwner,
        repoName,
        since,
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
        commitEntity.sha = commitObject.sha;
        return commitEntity;
      });
      await commitRepositoryFromEntity.save(commitlist);

      latestSha = commitsData[commitsData.length - 1].sha;
      repositoryName.lastPageNumber = page; //

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
  repoOwner: string,
  repoName: string,
  since: string
) {
  await fetchRepoDetailsAndSaveInDb(repoOwner, repoName, since);
  await fetchCommitsAndSaveInDB(repoOwner, repoName, since);
}
