import * as dotenv from "dotenv";
dotenv.config();

export const GITHUB_BASE_URL = "https://api.github.com/repos";
export const CHROMIUM_OWNER = "chromium";
export const CHROMIUM_REPO = "chromium";
export const GITHUB_API_URL = `https://api.github.com/repos/${CHROMIUM_OWNER}/${CHROMIUM_REPO}`;
export const port = 3000;
export const utilities = {
  nodeName: "node1",
  CRYPTO_KEY: "363627dhgska",
};
export const GIT_TOKEN = process.env.GIT_TOKEN;
