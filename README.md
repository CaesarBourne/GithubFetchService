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
