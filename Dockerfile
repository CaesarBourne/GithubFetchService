
# FROM node:20.11.1 as build

# # Set the working directory
# WORKDIR /app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# RUN npm cache clean --force
# # Install dependencies
# RUN npm install

# # Copy the rest of the application code
# COPY . .

# # Build the application
# RUN npm run build


# # Expose the port the app runs on
# EXPOSE 3000

# # Command to run the database initialization and seed it
# CMD ["npm", "run", "start:prod"]

# Start from a Node.js base image
FROM node:20.11.1 as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./


# Install dependencies

RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the database initialization and seed it
CMD ["npm", "run", "start:prod"]