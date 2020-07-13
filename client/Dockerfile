#############################################################
# ANGULAR FRONTEND APPLICATION
#############################################################

# Create image based on the official Node image from dockerhub
FROM node:current

RUN mkdir -p /usr/src/collab/client

# Create app directory where our app will be placed
WORKDIR /usr/src/collab/client/

# Install globally the angular/cli
RUN npm install -g @angular/cli

# Copy over the package.js file
COPY package.json ./

# Install all the dependencies
RUN npm install

# Copy dependency definitions
#COPY package.json /usr/src/app
COPY . .

# Get all the code needed to run the app
#COPY . /usr/src/app

# Expose the port the app runs in
#EXPOSE 4200

# Serve the app
CMD ["npm", "run", "start", "--configuration=production"]
