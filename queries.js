var promise = require('bluebird');

var options = {
    // Initialization Options
    promiseLib: promise
};

var pgp = require('pg-promise')(options);

var connectionString = process.env.DATABASE_URL || 'postgres://feedme:feedme@localhost:5432/feedme';

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


module.exports = {
    getAllRecipes: getAllRecipes
};