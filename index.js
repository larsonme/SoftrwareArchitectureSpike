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
app.get('/homepage.html', function (req, res) {
    console.log(req.query.user);
    // checkForUser(req.query.user);
    fs.readFile('./homepage.html', function (err, data) {
        if (err) {
            throw err;
        }
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write(data);
        res.end();
    });
});

app.get('/permissionedPage.html', function (req, res) {
    //Check database for userid and if they have the right permission for this page
    //If they do, return permissionedPage
    console.log(req.query);
    fs.readFile('./permissionedPage.html', function (err, data) {
        if (err) {
            throw err;
        }
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write(data);
        res.end();
    });
    //If they don't have the permissioned, return this
    // fs.readFile('./errorPage.html', function (err, data) {
    //     if (err) {
    //         throw err;
    //     }
    //     res.writeHead(200, {"Content-Type": "text/html"});
    //     res.write(data);
    //     res.end();
    // });
});
app.listen(port);

console.log("Server running at http://localhost:%d", port);

// var config =
//     {
//         authentication:
//             {
//                 type: 'default',
//                 options:
//                     {
//                         userName: '',
//                         password: '',
//                     }
//             },
//         server: 'softwarearchitecture2019.database.windows.net',
//         options:
//             {
//                 database: 'spikedatabase',
//                 encrypt: true
//             }
//     };
// var connection = new Connection(config);
// //
// // Attempt to connect and execute queries if connection goes through
// connection.on('connect', function (err) {
//         if (err) {
//             console.log(err)
//         }
//         else {
//             console.log("Successfully connected");
//         }
//     }
// );
// function createUser(user){
//     var request = new Request(
//         //Need to return the userid here
//         "INSERT INTO [USER] (username, displayName, email, token) VALUES('" + user.getEmail() + "'" +
//         ", '" + user.getName() + "', '" + user.getEmail() + "', '"+ user.getToken() + "'",
//         function(err, rowCount, rows)
//         {
//             console.log(rowCount + ' row(s) returned');
//
//             process.exit();
//         }
//     );
// }
// function checkForUser(user) {
//     console.log('Check for User...');
//
//     // Read all rows from table
//     var request = new Request(
//         //Need to return userid from this
//         "SELECT * FROM [USER] WHERE email = '" + user.getEmail() +"'",
//         function(err, rowCount, rows)
//         {
//             console.log(rowCount + ' row(s) returned');
//             if(rowCount == 0){
//                 createUser(user);
//             }
//             process.exit();
//         }
//     );
//
//     request.on('row', function(columns) {
//         columns.forEach(function(column) {
//             console.log("%s\t%s", column.metadata.colName, column.value);
//         });
//     });
//     connection.execSql(request);
//
// }