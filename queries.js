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
    db.any('select * from recipes')
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

function getSingleRecipe(req, res, next) {
    //get the recipe info
    db.any('select * from recipes where id = $1', parseInt(req.params.id))
        .then(function (recipeData) {
            //get the ingredients list
            db.any('select ingredient_id from recipe_ingredients where recipe_id = $1', parseInt(req.params.id))
                .then(function(ingredientsIDs){
                    var ingredientIdsArray = [];
                    for(var i = 0; i < ingredientsIDs.length; i++) {
                        ingredientIdsArray.push(ingredientsIDs[i].ingredient_id);
                    }
                    //get the ingredients
                    db.any("select i.name, i.vegan, i.vegetarian, i.gluten_free, i.low_carb, i.protein_rich, i.dairy_free," +
                        "i.low_fat, i.ethnicity, b.name as brand_name, sh.name as shop_name, c.name as city_name from ingredients i" +
                        " INNER JOIN shops sh ON i.shop_id = sh.id JOIN brands b ON i.brand_id = b.id JOIN cities c ON " +
                        "i.city_id = c.ID where i.ID = ANY($1::int[])", [ingredientIdsArray])
                        .then(function(ingredients){
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
                    message: 'Retrieved ALL recipes'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

module.exports = {
    getAllRecipes: getAllRecipes,
    getSingleRecipe: getSingleRecipe,
    createRecipe: createRecipe
};