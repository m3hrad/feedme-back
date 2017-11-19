# Feed Me

The backend system of the Feed Me project. The backend is live on the url:
https://feedme-backend.herokuapp.com

## Endpoints:

#### recipes

* get all the recipes: /api/recipes (get)

* get one recipe: /api/recipes/:id (get)

    example: https://feedme-backend.herokuapp.com/api/recipes/1
    
* search for the recipes by different parameters:
    parameters:
    * name
    * vegetarina
    * vegan
    * gluten_free
    * low_carb
    * protein_rich
    * dairy_free
    * low_fat
    * ethnicity

/api/recipes?name='name'&veagan=true

    example /api/recipes?name='name'&veagan=true

* create a recipe: /api/recipes (post)

    fields: 
    * user_id (mandatory)
    * name (mandatory)
    * description
    * recipe_text
    * duration
    * easy
    * link
   
* delete a recipe: /api/recipes/:id (delete)

#### ingredients

* get all the ingredients: /api/ingredients (get)

* get one ingredient: /api/ingredients/:id (get)

* search for the ingredients by name: /api/ingredients?name='name'

    example /api/ingredients?name=egg

* create an ingredient: /api/ingredients (post)

    fields:
    * name (mandatory)
    * city_id
    * vegan
    * vegetarian
    * gluten_free
    * low_carb
    * dairy_free
    * low_fat
    * ethnicity
    * brand_id
    * shop_id
    
* add an ingredient to a recipe: /api/recipes/:id (put)

    example: https://feedme-backend.herokuapp.com/api/recipes/1
    
    fields:
    * ingredient_id (mandatory)
    * quantity
    * unit
    
* delete and ingredient: /api/ingredients/:id (delete)

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
