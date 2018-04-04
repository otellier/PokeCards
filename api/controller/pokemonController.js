var https = require('https');
var sync_request = require('sync-request');
var sync_mysql = require('sync-mysql');
var mysql = require('mysql');
const util = require('util');

var connection_mysql = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "pokecards",
    port: "3306"
});

sync_mysql_connection = new sync_mysql({
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
    var request = https.get(options, function(result){
        result.on('data', function(d){
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
    request.on('error', function(e){
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
    console.log(req.params.token);
    connection_mysql.query("SELECT id FROM user WHERE token_facebook = " + req.params.token, function (err, result, fields) {
        if (err) throw err;
        id_user = result;
        console.log(id_user.length);
        if(id_user.length > 0){
            id_user = id_user[0].id;
            console.log(id_user);
            // GET ALL CARDS
            connection_mysql.query("SELECT * FROM user_cards WHERE id_user = " + id_user, function (err, result, fields) {
                if (err) throw err;
                list_user_pokemon = result;
                console.log(list_user_pokemon);
                var list_pokemon = new Array();
                for (var i = 0; i < list_user_pokemon.length; i++) {

                    list_pokemon.push({"id": list_user_pokemon[i].id_pokemon, "iteration": list_user_pokemon[i].iteration});

                }

                //console.log(util.inspect(list_pokemon, false, null));

                // REQUEST POKEMONS

                var options = "https://pokeapi.co/api/v2/pokedex/1/"; //pokedex national

                var data = "";

                var request = https.get(options, function(result){
                    result.on('data', function(d){
                    data += d;
            });
                result.on('end', function () {
                    var data_pokemon = JSON.parse(data);
                    for (var i = 0; i < 721; i++) {
                        var id = i + 1;

                        var found = false;
                        var index = null;

                        for (var j = 0; j < list_pokemon.length; j++) {
                            if (list_pokemon[j].id == id) {
                                found = true;
                                index = j;
                                break;
                            }
                        }
                        if (found) {
                            var pokemon_temp = {
                                "id": id,
                                "name": data_pokemon.pokemon_entries[i].pokemon_species.name,
                                "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + id + ".png",
                                "iteration": list_pokemon[index].iteration
                            };
                            // console.log(util.inspect(pokemon_temp, false, null));
                            response.push(pokemon_temp);
                        }
                    }
                    res.json(response);
                });
            });
                request.on('error', function(e){
                    console.error(e);
            });
                request.end();
            });
        }else{
            res.json({
                success: false,
                message: "This token is incorrect"
            });
        }
    });

}

exports.getBooster = function(req, res) {

    var listPokemon = new Array();
    var listBooster = new Array();
    var response = [];
    var generation = req.params.generation;
    var tokenFacebook_user = req.params.token;
    // REQUEST POKEMONS

    var options = "https://pokeapi.co/api/v2/generation/"+generation+"/"; //pokedex national

    var data = "";

    var request = https.get(options, function(result){
        result.on('data', function(d){
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

        // console.log("tokenFacebook_user = "+tokenFacebook_user);
        connection_mysql.query("SELECT id, coins FROM user WHERE token_facebook = " + tokenFacebook_user, function (err, result, fields) {
            if (err) throw err;
            _user = result;
            if(!_user){
                console.log("user is null");
                res.json({
                    success: false,
                    message: "The token is incorrect"
                });
            }
            id_user = _user[0].id;
            coins_user = _user[0].coins;
            if(coins_user < 1){
                console.log("ok");
                res.json({
                    success: false,
                    message: "Need more coins"
                });

            }else {

                coins_user--;
                connection_mysql.query("UPDATE user SET coins = " + coins_user + " WHERE token_facebook = " + tokenFacebook_user, function (err, result, fields) {
                    if (err) throw err;
                    console.log(coins_user);
                });

                // console.log("user = "+id_user);
                // ADD ALL CARDS
                console.log("// ADD ALL CARDS");
                // for(var i=0; i<listBooster.length; i++) {
                listBooster.forEach(function (card) {

                    var current_date = new Date(Date.now()).YYYYMMDDhhmmss();
                    console.log("INSERT START");
                    console.log("card.id = " + card.id);
                    console.log("current_date = " + current_date);
                    connection_mysql.query("INSERT INTO user_cards (id_pokemon,  date_obtention, source_obtention,  id_user) VALUES (" + card.id + ",'" + current_date + "','BOOSTER'," + id_user + ")", function (err, result, fields) {
                        console.log("INSERT END");
                        if (err) throw err;
                    });
                });
                res.json(listBooster);
            }
        });
    });
});
    request.on('error', function(e){
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



exports.getExchange = function(req, res) {
    connection_mysql.query("SELECT * FROM exchange", function (err, result, fields) {
        if (err) throw err;
        if(result.length > 0){
            var response = new Array();
            var promises = new Array();
            for (var i = 0; i < result.length; i++) {


                var id_user = result[i].id_user;
                var id= result[i].id;
                var pokemon1 = result[i].id_pokemon1;
                var pokemon2 = result[i].id_pokemon2;
                var pokemon_temp1 = null;
                var pokemon_temp2 = null;
                var exchange = null;
                var username;
                var pokemon_name1;
                var pokemon_name2;

                // REQUEST POKEMONS
                promises.push(new Promise( function (resolve, reject) {

                    // var options = "https://pokeapi.co/api/v2/pokemon/" + pokemon1 + "/";
                    // var data = "";
                    // var request = https.get(options, function (result) {
                    //     result.on('data', function (d) {
                    //         data += d;
                    //     });
                    //     result.on('end', function () {
                    //         var data_pokemon = JSON.parse(data);
                    //         pokemon_name1 = data_pokemon.name;
                    //     });
                    // });
                    //
                    // var options2 = "https://pokeapi.co/api/v2/pokemon/" + pokemon1 + "/";
                    // var data2 = "";
                    // var request = https.get(options2, function (result) {
                    //     result.on('data', function (d) {
                    //         data2 += d;
                    //     });
                    //     result.on('end', function () {
                    //         var data_pokemon = JSON.parse(data2);
                    //         pokemon_name2 = data_pokemon.name;
                    //     });
                    // });

                    var request1 = sync_request('GET', "https://pokeapi.co/api/v2/pokemon/" + pokemon1 + "/");
                    var data_pokemon1 = JSON.parse(request1.getBody());
                    pokemon_name1 = data_pokemon1.name;

                    var request2 = sync_request('GET', "https://pokeapi.co/api/v2/pokemon/" + pokemon2 + "/");
                    var data_pokemon2 = JSON.parse(request2.getBody());
                    pokemon_name2 = data_pokemon2.name;


                    pokemon_temp1 = {
                        "id": pokemon1,
                        "name": pokemon_name1,
                        "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + pokemon1 + ".png"
                    };
                    pokemon_temp2 = {
                        "id": pokemon2,
                        "name": pokemon_name2,
                        "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + pokemon2 + ".png"
                    };
                    var result_username = sync_mysql_connection.query("SELECT * FROM user WHERE id = " + id_user);
                    username = result_username[0].username;

                    exchange = {
                        "id": id,
                        "username": username,
                        "pokemon_proposed": pokemon_temp1,
                        "pokemon_wanted": pokemon_temp2
                    };

                    resolve(exchange);
                }));

                response.push(exchange);
            }

        Promise.all(promises).then(function (response){
            res.json(response);
        });

        }else {
            res.json("There is no exchanges");
        }
    });
}

exports.postExchange = function(req, res) {

    // console.log("params.token = "+ req.params.token);

    var tokenFacebook_user = req.body.token;
    var pokemon1 = req.body.pokemon_proposed;
    var pokemon2 = req.body.pokemon_wanted;
    connection_mysql.query("SELECT * FROM user WHERE token_facebook = " + tokenFacebook_user, function (err, result, fields) {
        if (err) throw err;

        var id_user = result[0].id;

        connection_mysql.query("INSERT INTO exchange (id_user, id_pokemon1, id_pokemon2) VALUES (" + id_user + "," + pokemon1 + "," + pokemon2 + ")", function (err, result, fields) {
            if (err) throw err;
            res.json("Exchange has been created");
        });
    });
}

exports.postExchangeAccept = function(req, res) {

    var tokenFacebook_user = req.body.token;
    var id_exchange = req.body.id_exchange;
    var current_date = new Date(Date.now()).YYYYMMDDhhmmss();

    connection_mysql.query("SELECT * FROM exchange WHERE id = " + id_exchange, function (err, result, fields) {
        if (err) throw err;
        if(result.length > 0) {
            var id_user_exchange = result[0].id_user;
            var pokemon1 = result[0].id_pokemon1;
            var pokemon2 = result[0].id_pokemon2;
            var id_user_cards1;
            var id_user_cards2;
            connection_mysql.query("SELECT * FROM user WHERE token_facebook = " + tokenFacebook_user , function (err, result, fields) {
                if (err) throw err;
                if(result.length > 0) {
                    var user_accept_exchange = result[0].id;
                    connection_mysql.query("SELECT * FROM user_cards WHERE id_user = " + user_accept_exchange + " AND id_pokemon = " + pokemon2, function (err, result, fields) {
                        if (err) throw err;
                        if(result.length > 0) {
                            id_user_cards2 = result[0].id;
                            connection_mysql.query("SELECT * FROM user_cards WHERE id_user = " + id_user_exchange + " AND id_pokemon = " + pokemon1, function (err, result, fields) {
                                if (err) throw err;
                                if (result.length > 0) {
                                    id_user_cards1 = result[0].id;

                                    console.log("1 : "+id_user_cards1);
                                    console.log("2 : "+id_user_cards2);

                                    connection_mysql.query("UPDATE user_cards SET  id_user = "+id_user_exchange+", date_obtention = "+current_date+", source_obtention = 'EXCHANGE' WHERE id = " + id_user_cards2 , function (err, result, fields) {
                                        if (err) throw err;
                                        connection_mysql.query("UPDATE user_cards SET  id_user = "+user_accept_exchange+", date_obtention = "+current_date+", source_obtention = 'EXCHANGE' WHERE id = " + id_user_cards1, function (err, result, fields) {
                                            if (err) throw err;
                                            connection_mysql.query("DELETE FROM exchange WHERE id = " + id_exchange , function (err, result, fields) {
                                                if (err) throw err;
                                                res.json("Exchange has been done");
                                            });

                                        });
                                    });
                                }
                                else {
                                    connection_mysql.query("DELETE FROM exchange WHERE id = " + id_exchange , function (err, result, fields) {
                                        if (err) throw err;
                                        res.json("The user who proposed this exchange don't have the pokemon now");
                                    });
                                }
                            });
                        }else {
                            res.json("You don't have the pokemon for the exchange");
                        }
                    });
                }else {
                res.json("Token is invalid");
            }
        });
        }else{
            res.json("There is no exchange with this id");
        }
    });


}

exports.getCardsOfPokemon= function(req, res) {
    var id = req.params.id;

    var request1 = sync_request('GET', "https://api.pokemontcg.io/v1/cards?nationalPokedexNumber="+ id );
    var data_pokemon = JSON.parse(request1.getBody());

    var request2 = sync_request('GET', "https://pokeapi.co/api/v2/pokemon/" + id + "/");
    var data_pokemon2 = JSON.parse(request2.getBody());

    var pokemon_card = data_pokemon.cards[0].imageUrl;

var pokemon = {
    "id": id,
    "name": data_pokemon2.name,
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + id + ".png",
    "card": pokemon_card
};
    res.json(pokemon);


}
exports.getCardsPokemonOfUser= function(req, res) {
    var id = req.params.id;
    var token_user = req.params.token;

    var request1 = sync_request('GET', "https://api.pokemontcg.io/v1/cards?nationalPokedexNumber="+ id );
    var data_pokemon = JSON.parse(request1.getBody());

    var request2 = sync_request('GET', "https://pokeapi.co/api/v2/pokemon/" + id + "/");
    var data_pokemon2 = JSON.parse(request2.getBody());

    var pokemon_card = data_pokemon.cards[0].imageUrl;

    var result_id_user = sync_mysql_connection.query("SELECT * FROM user WHERE token_facebook = " + token_user);

    var id_user = result_id_user[0].id;
    var result_count = sync_mysql_connection.query("SELECT COUNT(*) as c  FROM user_cards WHERE id_user = " + id_user+" AND id_pokemon = "+id);

    var iteration = result_count[0].c;

var pokemon = {
    "id": id,
    "name": data_pokemon2.name,
    "iteration": iteration,
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + id + ".png",
    "card": pokemon_card
};
    res.json(pokemon);


}