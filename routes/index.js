var express = require('express');
var router = express.Router();

var db = require('../queries');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/recipes', db.getAllRecipes);
router.get('/api/recipes/:id', db.getSingleRecipe);
// router.post('/api/recipes', db.createRecipe);
// router.put('/api/recipes/:id', db.updateRecipe);
// router.delete('/api/recipes/:id', db.removeRecipe);
//
// router.get('/api/ingredients', db.getAllIngredients);
// router.get('/api/ingredients/:id', db.getSingleIngredient);
// router.post('/api/ingredients', db.createIngredient);
// router.put('/api/ingredients/:id', db.updateIngredient);
// router.delete('/api/ingredients/:id', db.removeIngredient);

module.exports = router;
