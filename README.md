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
git clone https://github.com/yourusername/yourrepository.git
cd yourrepository
```
