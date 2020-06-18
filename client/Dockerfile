#############################################################
# ANGULAR FRONTEND APPLICATION
#############################################################

# Create image based on the official Node image from dockerhub
FROM node:current

RUN mkdir -p /usr/src/collab/client

# Create app directory where our app will be placed
WORKDIR /usr/src/collab/client/

RUN npm install -g @angular/cli@8.3.25

# Copy dependency definitions
#COPY package.json /usr/src/app
COPY . .

# Install dependecies
RUN npm install

# Get all the code needed to run the app
#COPY . /usr/src/app

# Expose the port the app runs in
EXPOSE 4200

# Serve the app
CMD ["npm", "run", "start", "--configuration=production"]
