const { seedDatabaseWithRepository } = require("../services/GithubService");
const { CHROMIUM_OWNER, CHROMIUM_REPO } = require("../lib/constant");

describe("Monitoring Service Test", () => {
  it("should successfully monitor the Chromium repository starting from 2023-08-20", async () => {
    const startDate = "2023-08-20T00:00:00Z";

    try {
      const result = await seedDatabaseWithRepository(
        CHROMIUM_OWNER,
        CHROMIUM_REPO,
        startDate
      );

      // Assuming the service returns true or some object indicating success
      expect(result).toBeTruthy();

      // Add more assertions based on the expected behavior of your function
      // For example, if the function returns an object with details:
      // expect(result.someProperty).toEqual(expectedValue);

      console.log("Monitoring service completed successfully.");
    } catch (error) {
      console.error("Error during monitoring service:", error);
      throw error; // Fail the test if an error occurs
    }
  });
});
