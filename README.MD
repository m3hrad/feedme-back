# Feed Me

The backend system of the Feed Me project.

### Getting Started

These instructions will get you a copy of the project up and running on your local machine for development.

###Prerequisites

Using Homebrew on Mac systems: 

Node:
    
    brew install node
    
Postgres:

    brew install postgres


###Installing

setup the database cluster: 

    initdb /usr/local/var/feedme_postgres
    
start the postgres server:

    postgres -D /usr/local/var/feedme_postgres
    
Login to the server:

    psql postgres

Create the database :

    create database feedme;
    
    
install the server:

    npm install


###Deployment

start the postgres server:
    
    postgres -D /usr/local/var/feedme_postgres
    
run the server:

    npm start
   
  

###Built With

* [Express application generator](https://expressjs.com/en/starter/generator.html)
