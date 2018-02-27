var https = require('https');
var mysql = require('mysql');

var connection_mysql = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "pokecards",
    port: "3306"
});





exports.getAll = function(req, res) {

    var options = "https://pokeapi.co/api/v2/pokedex/1/"; //pokedex national

    var data = "";
    var response = [];
    var request = https.get(options, (result) => {
        result.on('data', (d) => {
        data += d;
    });
    result.on('end', function() {
        var data_pokemon = JSON.parse(data);
        for(var i=0;i<721;i++){
            var id = i+1;
            var pokemon_temp = {"id":id, "name": data_pokemon.pokemon_entries[i].pokemon_species.name, "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+id+".png"};
                response.push(pokemon_temp);
        }
            res.json(response);
        });
    });
    request.on('error', (e) => {
        console.error(e);
    });

    request.end();
}

exports.getCardsOfUser = function(req, res) {

    // console.log("params.token = "+ req.params.token);
    var list_user_pokemon = new Array();
    var response = [];
    var id_user = null;

    // GET ID USER

    connection_mysql.query("SELECT id FROM user WHERE token_facebook = " + req.params.token, function (err, result, fields) {
        if (err) throw err;
        id_user = result;
        id_user = id_user[0].id;

    // GET ALL CARDS

    connection_mysql.query("SELECT * FROM user_cards WHERE id_user = " + id_user, function (err, result, fields) {
        if (err) throw err;
        list_user_pokemon = result;

        var list_pokemon = new Array();
        for(var i=0; i<list_user_pokemon.length; i++) {

            list_pokemon.push(list_user_pokemon[i].id_pokemon);

        }

        console.log(list_pokemon);

        // REQUEST POKEMONS

        var options = "https://pokeapi.co/api/v2/pokedex/1/"; //pokedex national

        var data = "";

        var request = https.get(options, (result) => {
            result.on('data', (d) => {
            data += d;
    });
        result.on('end', function() {
            var data_pokemon = JSON.parse(data);
            for(var i=0; i<721; i++){
                var id = i + 1;
                if(list_pokemon.indexOf(id) != -1) {
                    var pokemon_temp = {
                        "id": id,
                        "name": data_pokemon.pokemon_entries[i].pokemon_species.name,
                        "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + id + ".png"
                    };
                    response.push(pokemon_temp);
                }
            }
            res.json(response);
        });
    });
        request.on('error', (e) => {
            console.error(e);
    });
        request.end();
    });
    });

}