import axios from "axios";
import { GITHUB_BASE_URL } from "../lib/constant";

export const getRepositoryInfo = async (
  repoOwner: string,
  repository: string
) => {
  const repoResponse = await axios.get(
    `${GITHUB_BASE_URL}/${repoOwner}/${repository}`
  );
  return repoResponse.data;
};

export const getCommitsData = async (
  owner: string,
  repository: string,
  since?: string
) => {
  const commitResponse = await axios.get(
    `${GITHUB_BASE_URL}/${owner}/${repository}/commiots`,
    { params: { since } }
  );
  return commitResponse.data;
};
