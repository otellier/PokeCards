var https = require('https');
var mysql = require('mysql');

var connection_mysql = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "pokecards",
    port: "3306"
});





exports.newUser = function(req, res) {
    connection_mysql.query("SELECT * FROM user WHERE token_facebook = " + req.params.token, function (err, result, fields) {
        if (err) throw err;
        var user = result;

        console.log(user);

        res.json(list_pokemon);
    });
// RETURN A USER ELSE NOTHING

}

exports.connectUser = function(req, res) {

    connection_mysql.query("SELECT * FROM user WHERE token_facebook = " + req.params.token, function (err, result, fields) {
        if (err) throw err;
        var user = result;

        console.log(user);

        res.json(list_pokemon);
    });

    // RETURN A USER ELSE NOTHING

}