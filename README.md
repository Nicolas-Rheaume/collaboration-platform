# Collaboration-Platform

## 1. Introduction

The main objective of this platform is to offer the users an opportunity to describe their perspective on a subject while seeking inspiration from the community of active writers. The goal is to provide an open-source platform to share ideas while keeping your own documents.

## 2. Application

### 2.1 Design and file Structure

The application is divided into three distinct services that run seperatly but requires eachother to function. Here are the services:

 - **Angular Client:** The Angular application generates the website that the collaboraters uses to interact with the platform. 
 - **Node.js Server:** The Node.js application is used to run the server where the Angular client communicates with to request data from the database.
 - **MySQL DB:** The MySQL database holds most of the data used by the application.

## 3. Basic Installation

The basic approach of launching the application requires that each individual services be run with their respective commands. 

### 3.1 Installing the necessary software:

Install the following software:

 - [Node.js](https://nodejs.org/en/)
 - [MySQL](https://dev.mysql.com/downloads/)

### 3.2 Clone this repository:

Use the following command to clone the collaboration platform locally to your computer.

 ```
git clone https://github.com/Nicolas-Rheaume/collaboration-platform.git
```

### 3.3 Configuring the MySQL database:

During the MySQL installation, use these following configuration values:

 - database_host: '127.0.0.1',
 - database_user: 'root',
 - database_password: 'password',
 - database_name: 'collab-db-dev-1.0',

If the MySQL Database refuses your privileges, execute:
 ```
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'
```
 ```
flush privileges;
```


### 3.4 Initializing the Node.js server:

Travel to the `./server` folder and use the following command to install all of its dependencies.

 ```
npm install
```
For ease of use, install `nodemon` which will restart the process if there's a change or if it crashes.

 ```
npm install -g nodemon
```

Run the Node.js services by using the following command.

 ```
nodemon
```

### 3.5 Initializing the Angular Client:

On the `./client` folder, use the following command to install all of Angular's dependencies.
 ```
npm install
```

Run the Angular app using the following command.
 ```
ng serve --host 0.0.0.0
```

## 4. Docker and docker-compose Installation

This is the recommended method of installing and running the application for testing or trial purposes.

### 4.1 Install Docker and Docker Desktop

The first step is to download [Docker Desktop](https://www.docker.com/products/docker-desktop) for your respective OS. It will provide all the necessary tools to start containerizing your applications.

### 4.2 Clone the repository

Use the following command to clone the collaboration platform locally to your computer.

 ```
git clone https://github.com/Nicolas-Rheaume/collaboration-platform.git
```

### 4.2 Modifying the configuration files

There are a few parameters that need to be changed for the application to work. Locate the `./.env` file containing the following parameters that need to change accordingly.

- **IP_ADDRESS:** The value of the IP address is your machine's IPv4 Address of the Ethernet adapter. ex: 192.168.0.1. This needs to be change appropriatly otherwise the app won't work.
 - **CLIENT_PORT, SERVER_PORT, DB_PORT:** The port values can be anything as long as they are not already in use. You can set the client to port 80 which is the standard HTML port.
 - **DB_DATABASE:** This is the MySQL database name. Choose any name you want.
 - **DB_USER:** This is the name of the MySQL username. Choose "root". 
 - **DB_ROOT_PASSWORD:** This is the root password of the MySQL instance. Choose any password you want.
 - **DB_PASSWORD:** This is the user's password of the MySQL instance. Choose any password you want.

The next file to change is the `./client/angular-env.ts`.

 - **host_ip_address:** Change this value to your IPv4 address, same as before.
 - **server_port:** This has to be the same port of the `SERVER_PORT` in the previous file. Otherwise, the Angular app won't be able to communicate with the Node.js server.

### 4.3 Launch the App

To launch the Collaboration Platform, while in the `./` with the `docker-compose.yml` file, use the command below to have Docker download and initialize all 3 services.
 ```
docker-compose up
```

To stop the application, use the command below.
 ```
docker-compose down
```

To delete the docker container of the collaboration platform, use the command below.
```
docker rmi $(docker images -q) -f
```

If changes are made to the code while developping or otherwise, you must completly remove the docker container by using `docker-compose down` then, `docker rmi $(docker images -q) -f`. Reload the container by using `docker-compose up` and any modification made to the code should be reflected.