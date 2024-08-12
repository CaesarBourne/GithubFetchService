import { seedDatabaseWithRepository } from "../services/GithubService";
import { CHROMIUM_OWNER, CHROMIUM_REPO } from "../lib/constant";

describe("Monitoring Service Test", () => {
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
