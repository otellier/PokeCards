var https = require('https');
var mysql = require('mysql');
const util = require('util');

var connection_mysql = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "pokecards",
    port: "3306"
});

const SOURCE_OBTENTION_BOOSTER = "booster";
const SOURCE_OBTENTION_ECHANGE = "echange";
const SOURCE_OBTENTION_EVOLVE = "evolution";


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


exports.getBooster = function(req, res) {

    // console.log("params.token = "+ req.params.token);
    var listPokemon = new Array();
    var listBooster = new Array();
    var response = [];
    var generation = req.params.generation;
    var tokenFacebook_user = req.params.token;
    // REQUEST POKEMONS

    var options = "https://pokeapi.co/api/v2/generation/"+generation+"/"; //pokedex national

    var data = "";

    var request = https.get(options, (result) => {
        result.on('data', (d) => {
        data += d;
    });
    result.on('end', function() {
        var data_pokemon = JSON.parse(data);

        var regexIdPokemon =/\/([0-9]+)\//;


        for(var i=0; i < data_pokemon.pokemon_species.length; i++){
            // console.log(i+" POK "+data_pokemon.pokemon_species[i].url);

            idPokemon = regexIdPokemon.exec(data_pokemon.pokemon_species[i].url)[1];

            // console.log(idPokemon);
            var pokemon_temp = {
                "id": idPokemon,
                "name": data_pokemon.pokemon_species[i].name,
                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + idPokemon + ".png"
            };
            listPokemon.push(pokemon_temp);
        }

        for(var i=0; i < 5; i++){
            var randId = Math.floor(Math.random() * listPokemon.length );
            console.log("RAND ID = "+randId);
            listBooster.push(listPokemon[randId]);
        }

        // GET ID USER

        console.log("// GET ID USER");
        // console.log("tokenFacebook_user = "+tokenFacebook_user);
        connection_mysql.query("SELECT id FROM user WHERE token_facebook = " + tokenFacebook_user, function (err, result, fields) {
            if (err) throw err;
            id_user = result;
            if(!id_user){
                console.log("user is null");
                res.json({
                    success: false,
                    message: "The token is incorrect"
                });
            }
            id_user = id_user[0].id;
            // console.log("user = "+id_user);
            // ADD ALL CARDS
            console.log("// ADD ALL CARDS");
            // for(var i=0; i<listBooster.length; i++) {
            listBooster.forEach(function(card){

                // console.log("cardid = "+card.id);
                connection_mysql.query("SELECT iteration FROM user_cards WHERE id_user = " + id_user + " AND id_pokemon = " + card.id, function (err, result, fields) {


                    // console.log("iteration = "+util.inspect(result, false, null));
                    // console.log("iteration test "+isEmptyObject(result));
                    var iteration = 1;

                    if(!isEmptyObject(result)){
                        console.log("UPDATE START");
                        iteration = result[0].iteration;
                        console.log(iteration);
                        iteration++;
                        connection_mysql.query("UPDATE user_cards SET iteration = " + iteration + " WHERE id_user = " + id_user + " AND id_pokemon = " + card.id, function (err, result, fields) {
                            console.log("UPDATE END");
                            if (err) throw err;
                        });
                    }else {
                        var current_date = new Date(Date.now()).YYYYMMDDhhmmss();
                        console.log("INSERT START");
                        console.log("iteration = "+iteration);
                        console.log("card.id = "+ card.id);
                        console.log("current_date = "+ current_date);
                        connection_mysql.query("INSERT INTO user_cards (id_pokemon, iteration, date_obtention,  id_user) VALUES (" +card.id + "," + iteration + ",'" + current_date + "',"+id_user+")", function (err, result, fields) {
                            console.log("INSERT END");
                            if (err) throw err;
                        });
                    }
                });
            });
        });

        res.json(listBooster);
    });

});
    request.on('error', (e) => {
        console.error(e);
});
    request.end();
}

Date.prototype.YYYYMMDDhhmmss = function() {
    var YYYY = this.getFullYear().toString(),
        MM = (this.getMonth()+1).toString(),
        DD  = this.getDate().toString(),
        hh = this.getUTCHours().toString(),
        mm = this.getUTCMinutes().toString(),
        ss = this.getUTCSeconds().toString();
    return YYYY + "-" + (MM[1]?MM:"0"+MM[0]) + "-" + (DD[1]?DD:"0"+DD[0]) + " " + (hh[1]?hh:"0"+hh[0]) + ":" + (mm[1]?mm:"0"+mm[0]) + ":" + (ss[1]?ss:"0"+ss[0]);
};

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}