import axios from "axios";
import { GITHUB_API_URL } from "../lib/constant";

export const getRepositoryInfo = async (
  repoOwner: string,
  repository: string
) => {
  const repoResponse = await axios.get(GITHUB_API_URL);
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
