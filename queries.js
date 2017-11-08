var promise = require('bluebird');

var options = {
    // Initialization Options
    promiseLib: promise
};

var pgp = require('pg-promise')(options);

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/feedme';

var db = pgp(connectionString);

// add query functions

function getAllRecipes(req, res, next) {
    const pattern = '%' + req.query.name + '%' || '%';
    db.any('select * from recipes where deleted = false and name LIKE $1', pattern)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ALL recipes'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function getAllIngredients(req, res, next) {
    const pattern = '%' + req.query.name + '%' || '%';
    db.any('select * from ingredients where deleted = false and name LIKE $1', pattern)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ALL ingredients'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function getSingleRecipe(req, res, next) {
    //get the recipe info
    db.any('select * from recipes where id = $1 and deleted = false', parseInt(req.params.id))
        .then(function (recipeData) {
            if (recipeData.length > 0) {
            //get the ingredients list
                db.any('select ingredient_id from recipe_ingredients where recipe_id = $1', parseInt(req.params.id))
                    .then(function (ingredientsIDs) {
                        var ingredientIdsArray = [];
                        for (var i = 0; i < ingredientsIDs.length; i++) {
                            ingredientIdsArray.push(ingredientsIDs[i].ingredient_id);
                        }
                        //get the ingredients
                        db.any("select i.name, i.vegan, i.vegetarian, i.gluten_free, i.low_carb, i.protein_rich, i.dairy_free," +
                            "i.low_fat, i.ethnicity, b.name as brand_name, sh.name as shop_name, c.name as city_name from ingredients i" +
                            " INNER JOIN shops sh ON i.shop_id = sh.id JOIN brands b ON i.brand_id = b.id JOIN cities c ON " +
                            "i.city_id = c.ID where i.ID = ANY($1::int[])", [ingredientIdsArray])
                            .then(function (ingredients) {
                                recipeData[0].ingredients = ingredients;
                                res.status(200)
                                    .json({
                                        status: 'success',
                                        data: recipeData,
                                        message: 'Retrieved the recipe'
                                    });
                            })
                            .catch(function (err) {
                                return next(err);
                            });
                    })
                    .catch(function (err) {
                        return next(err);
                    });
            } else {
                res.status(404)
                    .json({
                        status: 'not found',
                        message: 'The requested recipe does not exist'
                    });
            }
        })
        .catch(function (err) {
            return next(err);
        });
}


function getSingleIngredient(req, res, next) {
    //get the ingredient info
    db.any('select * from ingredients where id = $1 AND deleted = false', parseInt(req.params.id))
        .then(function (ingredientData) {
            if (ingredientData.length > 0) {
            //get the recipes list having the ingredient
            db.any('select recipe_id from recipe_ingredients where ingredient_id = $1', parseInt(req.params.id))
                .then(function (recipesIDs) {
                    var recipesIDsArray = [];
                    for (var i = 0; i < recipesIDs.length; i++) {
                        recipesIDsArray.push(recipesIDs[i].recipe_id);
                    }
                    //get the recipes
                    db.any("select id, name FROM recipes WHERE ID = ANY($1::int[])", [recipesIDsArray])
                        .then(function (recipes) {
                            ingredientData[0].recipes = recipes;
                            res.status(200)
                                .json({
                                    status: 'success',
                                    data: ingredientData,
                                    message: 'Retrieved the ingredient'
                                });
                        })
                        .catch(function (err) {
                            return next(err);
                        });
                })
                .catch(function (err) {
                    return next(err);
                });
            } else {
                res.status(404)
                    .json({
                        status: 'not found',
                        message: 'The requested ingredient does not exist'
                    });
            }
        })
        .catch(function (err) {
            return next(err);
        });
}

function createRecipe(req, res ,next){
    var user_id = parseInt(req.body.user_id);
    var name = req.body.name;
    var description = req.body.description || '';
    var recipe_text = req.body.recipe_text || '';
    var duration = req.body.duration || null;
    var easy = req.body.easy || false;
    var link = req.body.link || null;

    db.any('INSERT into recipes (user_id, name, description, recipe_text, duration, easy, link) VALUES' +
        '($1, $2, $3, $4, $5, $6, $7)',[user_id, name, description, recipe_text, duration, easy, link])
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Recipe created.'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createIngredient(req, res ,next){
    var name = req.body.name;
    var city_id = parseInt(req.body.city_id) || 1;
    var vegan = req.body.vegan || false;
    var vegetarian = req.body.vegetarian || false;
    var gluten_free = req.body.gluten_free || false;
    var low_carb = req.body.low_carb || false;
    var dairy_free = req.body.dairy_free || null;
    var low_fat = req.body.low_fat || null;
    var ethnicity = req.body.ethnicity || null;
    var brand_id = parseInt(req.body.brand_id) || 1;
    var shop_id = parseInt(req.body.shop_id) || 1;

    db.any('INSERT into ingredients (name, city_id, vegan, vegetarian, gluten_free, low_carb, dairy_free, low_fat, ' +
        'ethnicity, brand_id, shop_id ) VALUES' +
        '($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',[name, city_id, vegan, vegetarian, gluten_free, low_carb,
        dairy_free, low_fat,ethnicity, brand_id, shop_id])
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Ingredient created.'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function removeRecipe(req, res, next){
    db.any('UPDATE recipes SET deleted = true WHERE id = $1', parseInt(req.params.id))
        .then(function (data) {
            db.any('DELETE FROM recipe_ingredients WHERE recipe_id = $1', parseInt(req.params.id))
                .then(function (data) {
                    res.status(200)
                        .json({
                            status: 'success',
                            data: data,
                            message: 'Recipe deleted.'
                        });
                }).catch(function (err) {
                return next(err);
            });
        })
        .catch(function (err) {
        return next(err);
    });
}

function removeIngredient(req, res, next){
    db.any('UPDATE ingredients SET deleted = true WHERE id = $1', parseInt(req.params.id))
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Ingredient deleted.'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

//supports only adding ingredients
function updateRecipe(req, res, next){
    const ingredient_id = req.body.ingredient_id;
    const quantity = req.body.quantity || null;
    const unit = req.body.unit || null;
    db.any('INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES ($1, $2, $3, $4)',
        [parseInt(req.params.id), parseInt(ingredient_id), quantity, unit])
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Ingredient added to the recipe.'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

module.exports = {
    getAllRecipes: getAllRecipes,
    getSingleRecipe: getSingleRecipe,
    createRecipe: createRecipe,
    removeRecipe: removeRecipe,
    updateRecipe: updateRecipe,
    createIngredient: createIngredient,
    getAllIngredients: getAllIngredients,
    getSingleIngredient: getSingleIngredient,
    removeIngredient: removeIngredient
};