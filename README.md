<!-- # GithubFetchService

## Getting Started

Follow these steps below to start application:

1. Install dependencies:

   ```bash
   docker compose
   ```

   This project is one that pulls data froma git repository and pushes toa sqlite database

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Docker
- Docker Compose and postman agent
- Postman or Postman Web

## Getting Started

### Clone the Repository

First, clone this repository to your local machine:

```sh
git clone https://github.com/yourusername/yourrepository.git
cd yourrepository
```

Build and start the containers

```sh
docker-compose up --build
```

Start the containers

````sh
docker-compose up
```
```` -->

# GithubFetchService

## Overview

`GithubFetchService` is a TypeScript-based service designed to fetch data from GitHub's public APIs, including repository information and commit details. It saves this data into a persistent SQLite database and continuously monitors the repository for changes.

## Features

- **Fetch GitHub Commits:** Retrieve commit messages, authors, dates, and URLs from GitHub repositories.
- **Continuous Monitoring:** Monitor repositories and fetch new commits at regular intervals.
- **Configurable Start Date:** Start fetching commits from a specified date.
- **Pagination Support:** Paginate through commits efficiently.
- **API Endpoints:** Query the stored data using provided API endpoints.

## Prerequisites

Before running this application, ensure that you have the following installed on your machine:

- **Docker**
- **Docker Compose**
- **Node.js** (if running locally)
- **Yarn** (if running locally)

## Setup

### Clone the Repository

First, clone this repository to your local machine:

```bash
git clone https://github.com/CaesarBourne/GithubFetchService.git
cd GithubFetchService
```

## Environment Variables Setup

This project requires certain environment variables to function correctly. A .env.example file is provided for reference.
• Step 1: Copy .env.example to create your own .env file:

```bash
cp .env.example .env
```

Step 2: Open the .env file and fill in the required values, especially the GIT_TOKEN.

```bash
# .env

# GitHub Personal Access Token (required)
GIT_TOKEN=your_actual_github_personal_access_token_here

# Base URL for GitHub API
GITHUB_BASE_URL=https://api.github.com/repos

# GitHub Repository Owner and Name
CHROMIUM_OWNER=chromium
CHROMIUM_REPO=chromium

# Application Port
PORT=3000

# Utility configurations
NODE_NAME=node1
CRYPTO_KEY=363627dhgska
```

## Install Dependencies

```bash
yarn install
```

## Build and Start Containers

You can use Docker Compose to build and start the necessary containers:

```bash
docker-compose up --build
```

To start the containers:

```bash
docker-compose up
```

If you prefer to run the application locally without Docker, use the following command:

```bash
yarn start
```

## Generating a GitHub Personal Access Token

To interact with GitHub’s API, you may need a Personal Access Token (PAT). Follow these steps to generate one:

    1.	Log in to GitHub: Visit https://github.com and log in to your account.
    2.	Navigate to Settings: Click on your profile picture in the top-right corner and select “Settings”.
    3.	Access Developer Settings: Scroll down and click on “Developer settings” in the left-hand menu.
    4.	Create a New Token: Click “Personal access tokens” and then “Generate new token”.
    5.	Select Scopes: Choose the necessary scopes, such as repo, to allow the token to access repositories.
    6.	Generate and Copy: Click “Generate token” and copy the token. Store it securely.

Update your .env file with the generated token:

```bash
GIT_TOKEN=your_personal_access_token
```

## How the Application Works

1. Fetch Commits: The service fetches commits from the specified GitHub repository and saves them into an SQLite database. 2. Monitor Repository: A cron job can be set up to monitor the repository, fetching new commits periodically. 3. API Endpoints: Use provided API endpoints to query commit data and manage the monitoring process.

<!-- Running the Application -->

Starting the Application

To start the application, use:

```bash
yarn start
```

This will initialize the service and prepare it for handling requests.

## API Endpoints

You can interact with the service using the following API endpoints.

    1.	Start Monitoring a Repository:

    the repository can only start a proceess for a job at a time

```bash
POST /monitor/start-monitor
```

Example:

```bash
curl -X POST "http://localhost:3000/api/monitor/start-monitor" -H "Content-Type: application/json" -d '{
  "owner": "chromium",
  "repository": "chromium",
  "startDate": "2023-08-20T00:00:00Z"
}'
```

Response:

```bash
{
  "status": 0,
  "message": "Monitoring started for repository chromium/chromium."
}
```

Explanation:

This API endpoint is used to initiate a monitoring process for a specific GitHub repository. The monitoring process will periodically fetch and store commits from the specified repository starting from a given date.

    •	Endpoint: /monitor/start-monitor
    •	Method: POST
    •	Description: Starts a background job to monitor a repository for new commits, fetching data from GitHub and storing it in the database.

Request Body Parameters:

    •	owner: (required) The owner of the GitHub repository. For example, “chromium”.
    •	repository: (required) The name of the GitHub repository. For example, “chromium”.
    •	startDate: (optional) The date from which to start monitoring commits. If not provided, the service will start monitoring from the latest commit.

Important Note:

    •	Single Job Limitation: The repository can only start one monitoring process at a time. If a monitoring job is already running for a repository, you cannot start another one until the current job is stopped. This ensures that resources are not duplicated, and data integrity is maintained.

1.  Fetch All Commits of a Repository:

```bash
GET /commits/:repositoryName?page=1&limit=10
```

Example

```bash
curl "http://localhost:3000/api/query/commits/chromium?limit=10&page=1"
```

Response :

```bash
{
  "status": 0,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "message": "Initial commit",
      "author": "JEmma",
      "date": "2023-08-20T00:00:00Z",
      "url": "https://github.com/chromium/chromium/commit/1",
      "sha": "abcdef1234567890",
      "repository": {
        "id": 1,
        "name": "chromium",
        "url": "https://github.com/chromium/chromium"
      }
    },
    ...
  ]
}
```

Explanation:

This API endpoint allows you to retrieve a paginated list of commits from the database for a specified repository.

    •	Endpoint: /commits/:repositoryName
    •	repositoryName: The name of the repository for which you want to fetch commits. For example, “chromium”.
    •	page: The page number of the results you want to retrieve. Pagination helps in managing large datasets by dividing them into pages. The default value is 1.
    •	limit: The number of commits to return per page. The default value is 10.

Query Parameters:

    •	page (optional): The page number to retrieve. It defaults to 1 if not provided.
    •	limit (optional): The number of commits per page. It defaults to 10 if not provided.

Response:

    •	status: 0 indicates success.
    •	message: “Success” indicates the operation was successful.


    3.	Stop Monitoring a Repository:

```bash
POST /monitor/stop-monitor
```

Example:

```bash
curl -X POST "http://localhost:3000/api/monitor/stop-monitor" -H "Content-Type: application/json" -d '{
  "owner": "chromium",
  "repository": "chromium"
}'
```

Response:

```bash
{
  "status": 0,
  "message": "Monitoring job stopped for chromium/chromium."
}
```

Explanation:

This API endpoint is used to stop an active monitoring process for a specific GitHub repository. The monitoring process, once started, runs as a cron job that periodically checks for new commits and updates the database. This API allows you to gracefully stop the job if it’s no longer needed or if you want to start a new monitoring session with different parameters.

    •	Endpoint: /monitor/stop-monitor
    •	Method: POST
    •	Description: Stops the cron job that monitors a repository for new commits.

Request Body Parameters:

    •	owner: (required) The owner of the GitHub repository. For example, “chromium”.
    •	repository: (required) The name of the GitHub repository. For example, “chromium”.

Response:

    •	status: 0 indicates success.
    •	message: A message confirming that the monitoring job has been stopped for the specified repository.

4. Retreive paginated commits repsonse from the databse by the repository name

   • Endpoint: /query/commits/:repositoryName
   • Method: GET
   • Description: Fetch a paginated list of commits from the database for a specific repository.
   • URL Example: http://localhost:3000/api/query/commits/chromium?page=1&limit=10
   • Parameters:
   • repositoryName (path parameter): The name of the repository (e.g., “chromium”).
   • page (query parameter): The page number for pagination (default is 1).
   • limit (query parameter): The number of commits per page (default is 10).
   • Response:
   • Status: 200 OK
   • Body: A JSON object containing the list of commits.
   • Example:

```bash
http://localhost:3000/api/query/commits/chromium?page=1&limit=10
```

5. Fetch Top Commit Authors

```bash
GET /query/top-authors
```

Example:

```bash
curl -X GET "http://localhost:3000/api/query/top-authors?limit=30" -H "Content-Type: application/json"
```

Query Parameters:

• limit : The number of top authors to return. If not provided, a default value will be used.

Response :

```bash
{
  "status": 0,
  "data": [
    {
      "author": "Emma",
      "commitCount": 150
    },
    {
      "author": "Ola",
      "commitCount": 120
    },
    ...
  ]
}
```

Error Responses:

    •	400 Bad Request: If the limit parameter is invalid.
    •	500 Internal Server Error: If there was an error retrieving the data.

Explanation:

    •	Endpoint: This API allows you to fetch the top commit authors from the database, sorted by the number of commits they’ve made.
    •	Limit: The limit query parameter controls how many authors to return. If not specified, it will default to a predefined limit.
    •	Response: The response includes a status field indicating success (0 for success) and a data array containing the top authors and their respective commit counts.

This documentation provides the necessary details for developers to interact with the API and retrieve the top commit authors from your database

5. Stop Background servie mirroing new commits from repo

```bash
POST /monitor/stop-background-monitor
```

Example :

```bash
curl -X POST "http://localhost:3000/api/monitor/stop-background-monitor" -H "Content-Type: application/json" -d '{
  "owner": "chromium",
  "repository": "chromium"
}'
```

Explanation:

This API endpoint is used to stop the background monitoring process that checks for new commits in a specific GitHub repository. The background monitoring job runs periodically to fetch new commits from the repository and update the database accordingly. This API allows you to stop this background process when it’s no longer needed.

    •	Endpoint: /monitor/stop-background-monitor
    •	Method: POST
    •	Description: Stops the cron job that monitors a repository for new commits.

Request Body Parameters:

    •	owner: (required) The owner of the GitHub repository. For example, “chromium”.
    •	repository: (required) The name of the GitHub repository. For example, “chromium”.

Response:

    •	status: 0 indicates success.
    •	message: A message confirming that the background monitoring job has been stopped for the specified repository.

Example Response:

```bash
{
  "status": 0,
  "message": "Background monitoring job stopped for chromium/chromium."
}
```

Explanation of Response:

    •	Success Message: The response confirms that the background monitoring process for the specified repository has been successfully stopped. This means that the cron job that was checking for new commits will no longer run.

Error Handling:

    •	No Active Job: If there is no active background monitoring job for the specified repository, the API will return a message indicating that no such job was found. This ensures that you don’t attempt to stop a job that isn’t running.

Use Case:

This endpoint is particularly useful when you want to stop the background process that checks for new commits after the initial monitoring or if you want to pause the process temporarily. Stopping the job prevents unnecessary resource usage and ensures that the system only performs tasks that are required.

## THE POSTMAN COLLECTION FOR This SOLUTION IS ALSO IN THE ROOT DIRECTORY, it can be imported to run the application
