# Use an official Node.js runtime as a parent image
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /var/www/topbar

# Copy the rest of the application code to the working directory
COPY . .

# Install dependencies
RUN npm install

# Expose the port the app runs on
EXPOSE 7000

# Define the command to start the application
CMD ["node", "ace", "serve", "--watch"]
