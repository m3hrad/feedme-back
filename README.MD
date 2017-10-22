# Feed Me

The backend system of the Feed Me project. The backend is live on the url:
https://feedme-backend.herokuapp.com

supported endpoints are:
- get all the recipes: /api/recipes
- get one recipe: /api/recipes/:id 
example: https://feedme-backend.herokuapp.com/api/recipes/1


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development.


## Prerequisites

Using Homebrew on Mac systems: 

Node:
    
    brew install node
    
Postgres:

    brew install postgres



## Installing

#### local

setup the database cluster: 

    initdb /usr/local/var/feedme_postgres
    
start the postgres server:

    postgres -D /usr/local/var/feedme_postgres
    
Login to the server:

    psql postgres

Create the database :

    create database feedme;
    
Execute the sql commands in feedme.sql file:

    psql feedme -f feedme.sql
    
install the server:

    npm install
    

#### Heroku

connect to the remote databse: 
    
    heroku pg:psql -a feedme-backend
    
Then you need to execute the commands in feedme.sql
    

## Deployment

#### local

start the postgres server:
    
    postgres -D /usr/local/var/feedme_postgres
    
run the server:

    npm start

At this point the server should be executed on http://localhost:3000/ .

#### Heroku

push the changes to Heroku:

    git push heroku master


## Built With

* [Express application generator](https://expressjs.com/en/starter/generator.html)
