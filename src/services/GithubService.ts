import axios from "axios";
import {
  CHROMIUM_OWNER,
  CHROMIUM_REPO,
  GITHUB_API_URL,
  GITHUB_BASE_URL,
} from "../lib/constant";

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
  owner: string,
  repository: string,
  since?: string
) => {
  const commitResponse = await axios.get(`${GITHUB_API_URL}/commits`, {
    params: { since },
  });
  return commitResponse.data;
};

async function seedDatabaseWithRepository() {}
