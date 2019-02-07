var fs = require("fs");
var port = process.env.PORT || 8080;
var express = require('express');
var app = express();
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

app.get('/', function (req, res) {
    fs.readFile('./index.html', function (err, data) {
        if (err) {
            throw err;
        }
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write(data);
        res.end();
    });
});
app.get('/index.html', function (req, res) {
    fs.readFile('./index.html', function (err, data) {
        if (err) {
            throw err;
        }
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write(data);
        res.end();
    });
});
app.get('/userId', function (req, res) {
    checkForUser(req.query.userEmail,req.query.userName,req.query.userToken,res);

});
app.get('/homepage.html', function(req,res){
    fs.readFile('./homepage.html', function (err, data) {
        if (err) {
            throw err;
        }
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write(data);
        res.end();
    });
});
// app.get('/permissionedPage.html', function (req, res) {
//     //Check database for userid and if they have the right permission for this page
//     //If they do, return permissionedPage
//     console.log(req.query);
//     fs.readFile('./permissionedPage.html', function (err, data) {
//         if (err) {
//             throw err;
//         }
//         res.writeHead(200, {"Content-Type": "text/html"});
//         res.write(data);
//         res.end();
//     });
    //If they don't have the permissioned, return this
    // fs.readFile('./errorPage.html', function (err, data) {
    //     if (err) {
    //         throw err;
    //     }
    //     res.writeHead(200, {"Content-Type": "text/html"});
    //     res.write(data);
    //     res.end();
    // });
// });
app.listen(port);

console.log("Server running at http://localhost:%d", port);

var config =
    {
        authentication:
            {
                type: 'default',
                options:
                    {
                        userName: 'USERNAME',
                        password: 'PASSWORD',
                    }
            },
        server: 'softwarearchitecture2019.database.windows.net',
        options:
            {
                database: 'spikedatabase',
                encrypt: true
            }
    };
var connection = new Connection(config);
//
// Attempt to connect and execute queries if connection goes through
connection.on('connect', function (err) {
        if (err) {
            console.log(err)
        }
        else {
            console.log("Successfully connected");
        }
    }
);
function createUser(email,name,token){
    var request = new Request(
        //Need to return the userid here
        "INSERT INTO [USER] (username, displayName, email, token) VALUES('" + email + "'" +
        ", '" + name + "', '" + email + "', '"+ token + "'",
        function(err, rowCount, rows)
        {
            console.log(rowCount + ' row(s) returned');

            process.exit();
        }
    );

    var getUserRequest = new Request(
        //Need to return userid from this
        "SELECT * FROM [USER] WHERE email = '" + email +"'",
        function(err, rowCount, rows)
        {
            var userId = 0;
            console.log(rowCount + ' row(s) returned');
            if(rowCount === 0){
                userId = createUser(email,name,token);
            }
            process.exit();
        }
    );

    getUserRequest.on('row', function(columns) {
        columns.forEach(function(column) {
            console.log("%s\t%s", column.metadata.colName, column.value);
            if(column.metadata.colName == 'id'){
                res.write(column.value.toString());
                res.end();
                console.log("Wrote out: " + column.value.toString());
            }
        });
    });

    connection.execSql(request);
    connection.execSql(getUserRequest);

}
function checkForUser(email,name,token,res) {
    console.log('Check for User...');

    // Read all rows from table
    var request = new Request(
        //Need to return userid from this
        "SELECT * FROM [USER] WHERE email = '" + email +"'",
        function(err, rowCount, rows)
        {
            var userId = 0;
            console.log(rowCount + ' row(s) returned');
            if(rowCount === 0){
                userId = createUser(email,name,token,res);
            }
            process.exit();
        }
    );

    request.on('row', function(columns) {
        columns.forEach(function(column) {
            console.log("%s\t%s", column.metadata.colName, column.value);
            if(column.metadata.colName == 'id'){
                res.write(column.value.toString());
                res.end();
                console.log("Wrote out: " + column.value.toString());
            }
        });
    });
    connection.execSql(request);

}