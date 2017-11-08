DROP DATABASE IF EXISTS feedme;
CREATE DATABASE feedme;

\c feedme;

CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  username VARCHAR UNIQUE ,
  token VARCHAR,
  admin BOOLEAN,
  deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE recipes (
  ID SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users (ID),
  name VARCHAR UNIQUE,
  description VARCHAR,
  recipe_text VARCHAR,
  duration FLOAT,
  easy BOOLEAN,
  link VARCHAR,
  deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE brands (
  ID SERIAL PRIMARY KEY,
  name VARCHAR,
  deleted BOOLEAN DEFAULT FALSE
);

-- as chain
CREATE TABLE shops (
  ID SERIAL PRIMARY KEY,
  name VARCHAR,
  deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE countries (
  ID SERIAL PRIMARY KEY,
  name VARCHAR UNIQUE,
  deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE cities (
  ID SERIAL PRIMARY KEY,
  name VARCHAR,
  country_id INTEGER REFERENCES countries (ID),
  deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE ingredients (
  ID SERIAL PRIMARY KEY,
  name VARCHAR,
  city_id INTEGER REFERENCES cities (ID),
  vegan BOOLEAN,
  vegetarian BOOLEAN,
  gluten_free BOOLEAN,
  low_carb BOOLEAN,
  protein_rich BOOLEAN,
  dairy_free BOOLEAN,
  low_fat BOOLEAN,
  ethnicity VARCHAR,
  brand_id INTEGER REFERENCES brands (ID),
  shop_id INTEGER REFERENCES shops (ID),
  deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE recipe_ingredients (
  ID SERIAL PRIMARY KEY,
  recipe_id INTEGER REFERENCES recipes (ID),
  ingredient_id INTEGER REFERENCES ingredients (ID),
  quantity FLOAT,
  unit VARCHAR
);

CREATE TABLE shop_city (
  ID SERIAL PRIMARY KEY,
  shop_id INTEGER REFERENCES shops (ID),
  city_id INTEGER REFERENCES cities (ID)
);


INSERT INTO shops (ID, name)
  VALUES (1 ,'K-market');

INSERT INTO countries (ID, name)
  VALUES (1, 'Finland');

INSERT INTO cities (ID, name, country_id)
  VALUES (1, 'Helsinki', 1);

INSERT INTO users (ID, username, admin)
  VALUES (1, 'm3hrad@gmail.com', TRUE );

INSERT INTO brands (ID, name)
  VALUES (1, 'PIRKKA');

INSERT INTO shop_city (ID,shop_id, city_id)
  VALUES (1,1,1);

INSERT INTO recipes ( ID, user_id, name, description, duration, easy)
  VALUES (1, 1, 'Fried Eggs', 'easy and yummy!', 5, TRUE );

INSERT INTO ingredients (ID, name, city_id, vegan, vegetarian, gluten_free, low_carb, protein_rich, dairy_free, low_fat, brand_id, shop_id)
  VALUES (1, 'egg', 1, FALSE , FALSE , TRUE , FALSE , TRUE , TRUE , FALSE , 1, 1);

INSERT INTO recipe_ingredients (ID,recipe_id, ingredient_id, quantity)
  VALUES (1, 1, 1, 4);