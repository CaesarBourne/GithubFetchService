import {
  seedDatabaseWithRepository,
  getRepositoryData,
} from "../services/GithubService";
import { CHROMIUM_OWNER, CHROMIUM_REPO } from "../lib/constant";

describe("GitHubService Tests", () => {
  it("fetches repository data", async () => {
    const data = await getRepositoryData(CHROMIUM_OWNER, CHROMIUM_REPO);

    // Adjusted to match the GitHub API response format
    expect(data).toEqual({
      name: "react", // Adjust according to the actual repo you're testing
      description:
        "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
      html_url: "https://github.com/facebook/react", // Adjust according to the actual repo you're testing
      language: "JavaScript",
      forks_count: 30000,
      stargazers_count: 150000,
      open_issues_count: 500,
      watchers_count: 200000,
      created_at: "2013-05-24T16:15:54Z",
      updated_at: "2024-08-01T15:22:07Z",
    });
  });

  it("should successfully monitor the Chromium repository starting from 2024-08-10", async () => {
    const startDate = "2024-08-10T00:00:00Z";

    try {
      const result = await seedDatabaseWithRepository(
        CHROMIUM_OWNER,
        CHROMIUM_REPO,
        startDate
      );

      expect(result).toBeTruthy();
      console.log("Monitoring service completed successfully.");
    } catch (error) {
      console.error("Error during monitoring service:", error);
      throw error; // Fail the test if an error occurs
    }
  });
});
