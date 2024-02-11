# Use an official Node runtime as a parent image
FROM node:20

# Set the working directory to /app/client
WORKDIR /app/client

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose port 3000
EXPOSE 3000

# Define the command to run your client
CMD ["npm", "run", "dev"]
