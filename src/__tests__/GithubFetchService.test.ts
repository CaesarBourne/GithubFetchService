import { initiateMonitoring } from "../services/MonitorRepositoryService"; // Adjust the path to where your service is located
import { AppDataSource } from "../database"; // Adjust the path to your database config

describe("initiateMonitoring", () => {
  beforeAll(async () => {
    // Initialize the database before tests run
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    // Close the database connection after all tests have run
    await AppDataSource.destroy();
  });

  it("should start monitoring for the given repository", async () => {
    const owner = "CaesarBourne";
    const repository = "GithubFetchService";
    const startDate = "2024-03-01T00:00:00Z";

    const result = await initiateMonitoring(owner, repository, startDate);

    // Expect the result to be defined and successful
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.message).toBe(
      `Monitoring started for ${owner}/${repository}.`
    );
  });

  it("should not start monitoring if a job is already running", async () => {
    const owner = "CaesarBourne";
    const repository = "GithubFetchService";
    const startDate = "2024-03-01T00:00:00Z";

    // First, start the monitoring job
    await initiateMonitoring(owner, repository, startDate);

    // Attempt to start the monitoring job again
    const result = await initiateMonitoring(owner, repository, startDate);

    // Expect the second attempt to fail because the job is already running
    expect(result).toBeDefined();
    expect(result.success).toBe(false);
    expect(result.message).toBe(
      `A monitoring job is already running for ${owner}/${repository}.`
    );
  });
});
