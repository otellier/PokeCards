module.exports = function (app) {

    var pokemonController = require('../controller/pokemonController');
    var userController = require('../controller/userController');



    app.route('/pokemon/list').get(pokemonController.getAll);
    app.route('/pokemon/list/:token').get(pokemonController.getCardsOfUser);


    app.route('/user/new').get(userController.newUser);
    app.route('/user/{token}').get(userController.connectUser);


}