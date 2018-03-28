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


    if(req.body == null){
        res.json({
            success: false,
            message: "The token is null"
        });

    }else {
        console.log(req.body.token);
        connection_mysql.query("SELECT * FROM user WHERE token_facebook = " + req.body.token, function (err, result, fields) {
            if (err) throw err;
            var user = result;
            console.log(user.length);
            if (user.length  > 0) {
                res.json({
                    success: false,
                    message: "This user is already registered"
                });
            } else {
                console.log("NOT IN DB");
                connection_mysql.query("INSERT INTO user (username, coins, token_facebook) VALUES ('" + req.body.username + "', 50," + req.body.token + ")", function (err, result, fields) {
                    if (err) throw err;
                    res.json({
                        success: true,
                        message: "User has been registered"
                    });
                });
            }
        });
    }
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
            res.json(user[0]);

        }
        console.log(user);


    });

    // RETURN A USER ELSE NOTHING

}

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}
