// import axios from "axios";
// import {
//   CHROMIUM_OWNER,
//   CHROMIUM_REPO,
//   GIT_TOKEN,
//   GITHUB_BASE_URL,
// } from "../lib/constant";
// import { githubServiceRepository } from "./MonitorRepositoryService";
// import { RepositoryEntity } from "../entity/RepositoryEntity";
// import { CommitEntity } from "../entity/CommitEntity";
// import cdrlogger from "../lib/logFormat";
// import { commitRepositoryFromEntity } from "./QueryService";

// // export class GitHubService{}

// export const getRepositoryData = async (
//   repoOwner: string = CHROMIUM_OWNER,
//   repository: string = CHROMIUM_REPO,
//   since: string
// ) => {
//   const repoResponse = await axios.get(
//     `${GITHUB_BASE_URL}/${repoOwner}/${repository}`,
//     {
//       headers: {
//         Authorization: `Bearer ${GIT_TOKEN}`,
//       },
//     }
//   );
//   return repoResponse.data;
// };

// export const getCommitsDataFromGit = async (
//   repoOwner: string = CHROMIUM_OWNER,
//   repository: string = CHROMIUM_REPO,
//   since: string,
//   latestSha?: any
// ) => {
//   let paramsData;

//   if (latestSha) {
//     console.log("######### latest sha $$$$$$$$$$", latestSha);
//     cdrlogger.info(latestSha);

//     paramsData = {
//       sha: latestSha, // Fetch commits after this SHA
//       per_page: 10, // GitHub's max per page
//       since,
//     };
//   } else {
//     console.log("no lates sha !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

//     paramsData = {
//       per_page: 100,
//       since,
//     };
//   }
//   const commitResponse = await axios.get(
//     `${GITHUB_BASE_URL}/${repoOwner}/${repository}/commits`,
//     {
//       params: paramsData,

//       headers: {
//         Authorization: `Bearer ${GIT_TOKEN}`,
//       },
//     }
//   );

//   return commitResponse.data;
// };

// export const fetchRepoDetailsAndSaveInDb = async (
//   repoOwner: string = CHROMIUM_OWNER,
//   repoName: string = CHROMIUM_REPO,
//   since: string
// ) => {
//   try {
//     const repositoryData = await getRepositoryData(repoOwner, repoName, since);

//     // const repositoryEntity = new RepositoryEntity();
//     let repositoryEntity = await githubServiceRepository.findOneBy({
//       name: repoName,
//     });
//     if (!repositoryEntity) {
//       repositoryEntity = new RepositoryEntity();
//       repositoryEntity.createdAt = new Date(repositoryData.created_at);
//     }
//     //b0e64ff9ad81b75bd70ef94a420403886fe2f11c
//     repositoryEntity.name = repositoryData.name;
//     repositoryEntity.description = repositoryData.description;
//     repositoryEntity.url = repositoryData.html_url;
//     repositoryEntity.language = repositoryData.language;
//     repositoryEntity.forksCount = repositoryData.forks_count;
//     repositoryEntity.starsCount = repositoryData.stargazers_count;
//     repositoryEntity.openIssuesCount = repositoryData.open_issues_count;
//     repositoryEntity.watchersCount = repositoryData.watchers_count;
//     repositoryEntity.updatedAt = new Date();
//     repositoryEntity.lastCommitSha =
//       repositoryEntity.lastCommitSha || undefined;

//     // Save the repository entity updating or inserting
//     const savedResponse = await githubServiceRepository.save(repositoryEntity);

//     console.debug("&&&&&&&&& saved  ", savedResponse);
//     return savedResponse;
//   } catch (error) {
//     console.error("Failed to seed the database with commits data:", error);
//     throw error; //
//   }
// };

// export const fetchCommitsAndSaveInDB = async (
//   repoOwner: string = CHROMIUM_OWNER,
//   repoName: string = CHROMIUM_REPO,
//   since: string
// ) => {
//   try {
//     const repositoryName = await githubServiceRepository.findOneBy({
//       name: repoName,
//     });

//     if (!repositoryName) {
//       throw new Error(`Repository with name ${repoName} not found.`);
//     }

//     let page = 1;
//     //log records
//     cdrlogger.info(repositoryName.lastPageNumber);

//     // let page = repositoryName.lastPageNumber ?? 1;
//     let latestSha: string | null = repositoryName.lastCommitSha || null;
//     //not  fetch too many page at once
//     // const pageCompare = repositoryName.lastPageNumber ?? 1;

//     const rateLimit = 10;

//     while (page < rateLimit) {
//       //commits data fetch  from gitHub to database
//       const commitsData = await getCommitsDataFromGit(
//         repoOwner,
//         repoName,
//         since,
//         latestSha
//       );
//       if (commitsData.length === 0) break;

//       //bulk saving of commit list less expensive
//       const commitlist = commitsData.map((commitObject: any) => {
//         const commitEntity = new CommitEntity();
//         commitEntity.repositoryId = repositoryName.id;
//         commitEntity.message = commitObject.commit.message;
//         commitEntity.author = commitObject.commit.author.name;
//         commitEntity.date = new Date(commitObject.commit.author.date);
//         commitEntity.url = commitObject.html_url;
//         commitEntity.sha = commitObject.sha;
//         return commitEntity;
//       });
//       await commitRepositoryFromEntity.save(commitlist);

//       latestSha = commitsData[commitsData.length - 1].sha;
//       //   repositoryName.lastPageNumber = page; //

//       page++;
//     }

//     // console.log("@@@@@@@ COMMIT LIST FRO DATABASE ", commitsData);
//     //last commit sha saved for reference
//     if (latestSha) {
//       repositoryName.lastCommitSha = latestSha;
//       await githubServiceRepository.save(repositoryName);
//     }

//     console.log("seeded the database with data from commits");
//   } catch (error) {
//     console.error("Failed to seed the database with commits data:", error);
//     throw error; //
//   }
// };

// export async function seedDatabaseWithRepository(
//   repoOwner: string,
//   repoName: string,
//   since: string
// ) {
//   await fetchRepoDetailsAndSaveInDb(repoOwner, repoName, since);
//   await fetchCommitsAndSaveInDB(repoOwner, repoName, since);
// }

import axios from "axios";
import {
  CHROMIUM_OWNER,
  CHROMIUM_REPO,
  GIT_TOKEN,
  GITHUB_BASE_URL,
} from "../lib/constant";
import {
  githubServiceRepository,
  stopMonitoring,
} from "./MonitorRepositoryService";
import { RepositoryEntity } from "../entity/RepositoryEntity";
import { CommitEntity } from "../entity/CommitEntity";
import cdrlogger from "../lib/logFormat";
import { commitRepositoryFromEntity } from "./QueryService";

// Get repository data from GitHub
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

// Get commits data from GitHub
export const getCommitsDataFromGit = async (
  repoOwner: string = CHROMIUM_OWNER,
  repository: string = CHROMIUM_REPO,
  since: string,
  latestSha?: string | null
) => {
  const paramsData = latestSha
    ? {
        since,
        sha: latestSha, // Fetch commits after this SHA
        per_page: 100, // GitHub's max per page
      }
    : {
        since,
        per_page: 100,
      };

  const commitResponse = await axios.get(
    `${GITHUB_BASE_URL}/${repoOwner}/${repository}/commits`,
    {
      params: paramsData,
      headers: {
        Authorization: `Bearer ${GIT_TOKEN}`,
      },
    }
  );
  const commitsData = latestSha
    ? commitResponse.data.filter((commit: any) => commit.sha !== latestSha)
    : commitResponse.data;

  return commitsData;
};

// Fetch repository details and save in the database
export const fetchRepoDetailsAndSaveInDb = async (
  repoOwner: string = CHROMIUM_OWNER,
  repoName: string = CHROMIUM_REPO
) => {
  try {
    const repositoryData = await getRepositoryData(repoOwner, repoName);

    let repositoryEntity = await githubServiceRepository.findOneBy({
      name: repoName,
    });

    if (!repositoryEntity) {
      repositoryEntity = new RepositoryEntity();
      repositoryEntity.createdAt = new Date(repositoryData.created_at);
    }

    repositoryEntity.name = repositoryData.name;
    repositoryEntity.description = repositoryData.description;
    repositoryEntity.url = repositoryData.html_url;
    repositoryEntity.language = repositoryData.language;
    repositoryEntity.forksCount = repositoryData.forks_count;
    repositoryEntity.starsCount = repositoryData.stargazers_count;
    repositoryEntity.openIssuesCount = repositoryData.open_issues_count;
    repositoryEntity.watchersCount = repositoryData.watchers_count;
    repositoryEntity.updatedAt = new Date();

    const savedResponse = await githubServiceRepository.save(repositoryEntity);

    console.debug("Repository details saved: ", savedResponse);
    return savedResponse;
  } catch (error) {
    console.error("Failed to seed the database with commits data:", error);
    throw error;
  }
};

// Fetch commits and save in the database
export const fetchCommitsAndSaveInDB = async (
  repoOwner: string = CHROMIUM_OWNER,
  repoName: string = CHROMIUM_REPO,
  since: string,
  backgroundservice?: boolean
) => {
  try {
    const repository = await githubServiceRepository.findOneBy({
      name: repoName,
    });

    if (!repository) {
      throw new Error(`Repository with name ${repoName} not found.`);
    }

    let page = 1;
    let latestSha: string | null = backgroundservice
      ? null
      : repository.lastCommitSha || null;
    const rateLimit = 4000;

    while (page < rateLimit) {
      const commitsData = await getCommitsDataFromGit(
        repoOwner,
        repoName,
        since,
        latestSha
      );

      //only stop monitoring background service
      if (commitsData.length === 0) {
        console.error("gotten to the limit break now ", commitsData);
        cdrlogger.info(commitsData);
        if (backgroundservice) {
          console.log("its background service, no sha", commitsData);
        } else {
          stopMonitoring(repoOwner, repoName);
        }
        break;
      }

      const commitEntities = commitsData.map((commitObject: any) => {
        const commitEntity = new CommitEntity();
        commitEntity.repositoryId = repository.id;
        commitEntity.message = commitObject.commit.message;
        commitEntity.author = commitObject.commit.author.name;
        commitEntity.date = new Date(commitObject.commit.author.date);
        commitEntity.url = commitObject.html_url;
        commitEntity.sha = commitObject.sha;
        return commitEntity;
      });

      await commitRepositoryFromEntity.save(commitEntities);

      // Update the latest SHA to the last commit in this batch
      latestSha = commitsData[commitsData.length - 1].sha;

      page++;
    }

    if (latestSha) {
      // Update the lastCommitSha in the repository
      repository.lastCommitSha = latestSha;
      await githubServiceRepository.save(repository);
    }

    console.log("Database successfully updated with commit data.");
  } catch (error) {
    console.error("Failed to seed the database with commits data:", error);
    throw error;
  }
};

// Seed database with repository data and commits
export async function seedDatabaseWithRepository(
  repoOwner: string,
  repoName: string,
  since: string,
  backgroundservice?: boolean
) {
  await fetchRepoDetailsAndSaveInDb(repoOwner, repoName);
  await fetchCommitsAndSaveInDB(repoOwner, repoName, since, backgroundservice);
}
