// src/__tests__/GitHubService.test.ts
import axios from "axios";
import { getRepositoryInfo } from "../services/GithubService";

jest.mock("axios");

describe("GitHubService", () => {
  it("fetches repository data", async () => {
    // Mock repository data to be returned by axios
    const repoData = {
      name: "react",
      description:
        "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
      html_url: "https://github.com/facebook/react",
      language: "JavaScript",
      forks_count: 30000,
      stargazers_count: 150000,
      open_issues_count: 500,
      watchers_count: 200000,
      created_at: "2013-05-24T16:15:54Z",
      updated_at: "2024-08-01T15:22:07Z",
    };

    // Mock the axios.get call to return the above data
    (axios.get as jest.Mock).mockResolvedValue({ data: repoData });

    // Call the function under test
    const data = await getRepositoryInfo("facebook", "react");

    // Verify that the data returned by fetchRepositoryData matches the mock data
    expect(data).toEqual({
      name: "react",
      description:
        "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
      url: "https://github.com/facebook/react",
      language: "JavaScript",
      forksCount: 30000,
      starsCount: 150000,
      openIssuesCount: 500,
      watchersCount: 200000,
      createdAt: new Date("2013-05-24T16:15:54Z"),
      updatedAt: new Date("2024-08-01T15:22:07Z"),
    });

    // Verify that axios.get was called with the correct URL
    expect(axios.get).toHaveBeenCalledWith(
      "https://api.github.com/repos/facebook/react"
    );
  });
});
