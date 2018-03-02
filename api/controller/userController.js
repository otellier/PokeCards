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

console.log(req.body.token);

    // if(req.body == null){
    //     res.json({
    //         success: false,
    //         message: "The token is null"
    //     });
    //
    // }else {
    //
    //     connection_mysql.query("SELECT * FROM user WHERE token_facebook = " + req.body.token, function (err, result, fields) {
    //         if (err) throw err;
    //         var user = result;
    //         if (user.length < 1) {
    //             res.json({
    //                 success: false,
    //                 message: "This user is already registered"
    //             });
    //         } else {
    //             console.log("NOT IN DB");
    //         }
    //         console.log(user);
    //
    //         res.json(list_pokemon);
    //     });
    // }
}

exports.connectUser = function(req, res) {

    if(req.params.token == null){
        res.json({
            success: false,
            message: "The token is null"
        });
    }

    connection_mysql.query("SELECT * FROM user WHERE token_facebook = " + req.params.token, function (err, result, fields) {
        if (err) throw err;
        var user = result;
        console.log(user);
        if(user.length  < 1){
            res.json({
                success: false,
                message: "This user is not registered"
            });
        }else{
            res.json(user);

        }
        console.log(user);


    });

    // RETURN A USER ELSE NOTHING

}