import * as dotenv from "dotenv";
dotenv.config();

export const GITHUB_BASE_URL =
  process.env.GITHUB_BASE_URL || "https://api.github.com/repos";
export const CHROMIUM_OWNER = "chromium";
export const CHROMIUM_REPO = "chromium";
export const GITHUB_API_URL = `https://api.github.com/repos/${CHROMIUM_OWNER}/${CHROMIUM_REPO}`;
export const port = process.env.PORT || 3000;
export const CRON_BACKGROUND_TIME = 2;
export const CRON_OLDRECORDS_TIME = 59;
export const utilities = {
  nodeName: process.env.NODE_NAME || "node1",
  CRYPTO_KEY: process.env.CRYPTO_KEY || "363627dhgska",
};

export const GIT_TOKEN = process.env.GIT_TOKEN;
