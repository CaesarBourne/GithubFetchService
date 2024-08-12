// import axios from "axios";
// import {
//   CHROMIUM_OWNER,
//   CHROMIUM_REPO,
//   GIT_TOKEN,
//   GITHUB_BASE_URL,
// } from "../lib/constant";
// import {
//   githubServiceRepository,
//   stopMonitoring,
// } from "./MonitorRepositoryService";
// import { RepositoryEntity } from "../entity/RepositoryEntity";
// import { CommitEntity } from "../entity/CommitEntity";
// import cdrlogger from "../lib/logFormat";
// import { commitRepositoryFromEntity } from "./QueryService";

// // Get repository data from GitHub
// export const getRepositoryData = async (
//   repoOwner: string = CHROMIUM_OWNER,
//   repository: string = CHROMIUM_REPO
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

// // Get commits data from GitHub
// export const getCommitsDataFromGit = async (
//   repoOwner: string = CHROMIUM_OWNER,
//   repository: string = CHROMIUM_REPO,
//   since: string,
//   latestSha?: string | null,
//   backgroundservice?: boolean
// ) => {
//   if (backgroundservice) {
//     since = new Date().toISOString();
//   }
//   const paramsData = latestSha
//     ? {
//         since,
//         sha: latestSha, // Fetch commits after this SHA
//         per_page: 100, // GitHub's max per page
//       }
//     : {
//         since,
//         per_page: 100,
//       };

//   const commitResponse = await axios.get(
//     `${GITHUB_BASE_URL}/${repoOwner}/${repository}/commits`,
//     {
//       params: paramsData,
//       headers: {
//         Authorization: `Bearer ${GIT_TOKEN}`,
//       },
//     }
//   );
//   const commitsData = latestSha
//     ? commitResponse.data.filter((commit: any) => commit.sha !== latestSha)
//     : commitResponse.data;

//   return commitsData;
// };

// // Fetch repository details and save in the database
// export const fetchRepoDetailsAndSaveInDb = async (
//   repoOwner: string = CHROMIUM_OWNER,
//   repoName: string = CHROMIUM_REPO
// ) => {
//   try {
//     const repositoryData = await getRepositoryData(repoOwner, repoName);

//     let repositoryEntity = await githubServiceRepository.findOneBy({
//       name: repoName,
//     });

//     if (!repositoryEntity) {
//       repositoryEntity = new RepositoryEntity();
//       repositoryEntity.createdAt = new Date(repositoryData.created_at);
//     }

//     repositoryEntity.name = repositoryData.name;
//     repositoryEntity.description = repositoryData.description;
//     repositoryEntity.url = repositoryData.html_url;
//     repositoryEntity.language = repositoryData.language;
//     repositoryEntity.forksCount = repositoryData.forks_count;
//     repositoryEntity.starsCount = repositoryData.stargazers_count;
//     repositoryEntity.openIssuesCount = repositoryData.open_issues_count;
//     repositoryEntity.watchersCount = repositoryData.watchers_count;
//     repositoryEntity.updatedAt = new Date();

//     const savedResponse = await githubServiceRepository.save(repositoryEntity);

//     console.debug("Repository details saved: ", savedResponse);
//     return savedResponse;
//   } catch (error) {
//     console.error("Failed to seed the database with commits data:", error);
//     throw error;
//   }
// };

// // Fetch commits and save in the database
// export const fetchCommitsAndSaveInDB = async (
//   repoOwner: string = CHROMIUM_OWNER,
//   repoName: string = CHROMIUM_REPO,
//   since: string,
//   backgroundservice?: boolean
// ) => {
//   try {
//     const repository = await githubServiceRepository.findOneBy({
//       name: repoName,
//     });

//     if (!repository) {
//       throw new Error(`Repository with name ${repoName} not found.`);
//     }

//     let page = 1;
//     let latestSha: string | null = backgroundservice
//       ? null
//       : repository.lastCommitSha || null;
//     const rateLimit = 4000;

//     while (page < rateLimit) {
//       const commitsData = await getCommitsDataFromGit(
//         repoOwner,
//         repoName,
//         since,
//         latestSha
//       );

//       //only stop monitoring background service
//       if (commitsData.length === 0) {
//         console.error("gotten to the limit break now ", commitsData);
//         cdrlogger.info(commitsData);
//         if (backgroundservice) {
//           console.log("its background service, no sha", commitsData);
//         } else {
//           stopMonitoring(repoOwner, repoName);
//         }
//         break;
//       }

//       const commitEntities = commitsData.map((commitObject: any) => {
//         const commitEntity = new CommitEntity();
//         commitEntity.repositoryId = repository.id;
//         commitEntity.message = commitObject.commit.message;
//         commitEntity.author = commitObject.commit.author.name;
//         commitEntity.date = new Date(commitObject.commit.author.date);
//         commitEntity.url = commitObject.html_url;
//         commitEntity.sha = commitObject.sha;
//         return commitEntity;
//       });

//       await commitRepositoryFromEntity.save(commitEntities);

//       // Update the latest SHA to the last commit in this batch
//       latestSha = commitsData[commitsData.length - 1].sha;

//       page++;
//     }

//     if (latestSha) {
//       // Update the lastCommitSha in the repository
//       repository.lastCommitSha = latestSha;
//       await githubServiceRepository.save(repository);
//     }

//     console.log("Database successfully updated with commit data.");
//   } catch (error) {
//     console.error("Failed to seed the database with commits data:", error);
//     throw error;
//   }
// };

// // Seed database with repository data and commits
// export async function seedDatabaseWithRepository(
//   repoOwner: string,
//   repoName: string,
//   since: string,
//   backgroundservice?: boolean
// ) {
//   await fetchRepoDetailsAndSaveInDb(repoOwner, repoName);
//   await fetchCommitsAndSaveInDB(repoOwner, repoName, since, backgroundservice);
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
  latestSha?: string | null,
  backgroundservice?: boolean
) => {
  // If it's a background service, set 'since' to the current date
  if (backgroundservice) {
    since = new Date().toISOString();
  }

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

  // If 'latestSha' is provided, exclude the first commit if it matches 'latestSha'
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
        latestSha,
        backgroundservice
      );

      // Stop monitoring if all commits have been fetched
      if (commitsData.length === 0) {
        console.error("No more commits to fetch, stopping...", commitsData);
        cdrlogger.info(commitsData);
        if (backgroundservice) {
          console.log(
            "It's a background service, no more commits.",
            commitsData
          );
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
