# Use an official Node runtime as a parent image
FROM node:20

# Set the working directory to /app/server
WORKDIR /app/server

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

ENV PORT=3001

# Expose port 3001
EXPOSE 3001

# Define the command to run your server
CMD ["npm", "start"]
