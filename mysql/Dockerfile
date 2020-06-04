#############################################################
# MYSQL DATABASE
#############################################################

# Create mysql server based on the official image from the dockerhub
FROM mysql:latest

RUN mkdir -p /usr/src/collab/db

# Create app directory
WORKDIR /usr/src/collab/db/

# Add a database & root password
ENV MYSQL_ROOT_PASSWORD password  
ENV MYSQL_DATABASE collab-db-dev-1.0  
ENV MYSQL_USER root 
ENV MYSQL_PASSWORD password

# optionnaly, run initial scripts for creating tables 

ADD setup.sql /docker-entrypoint-initdb.d
