var fs = require("fs");
var port = process.env.PORT || 8080;
var express = require('express');
var app = express();
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var running = false;
var config =
    {
        authentication:
            {
                type: 'default',
                options:
                    {
                        userName: '',
                        password: ''
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

function createUser(email, name, res) {
    request = new Request("INSERT INTO dbo.[User] (username, displayName, email) OUTPUT INSERTED.id VALUES (@email, @name, @email);", function (err) {
        if (err) {
            console.log(err);
        }
    });
    request.addParameter('email', TYPES.NVarChar, email);
    request.addParameter('name', TYPES.NVarChar, name);
    request.on('row', function (columns) {
        columns.forEach(function (column) {
            if (column.value === null) {
                console.log('NULL');
            } else {
                res.write(column.value.toString());
                res.end();
            }
        });
    });
    request.on('requestCompleted', function () {
        running = false;
    });

    running = true;
    connection.execSql(request);

}

function checkForUser(email, name, res) {

    // Read all rows from table
    var request = new Request(
        //Need to return userid from this
        "SELECT * FROM [USER] WHERE email = '" + email + "'",
        function (err, rowCount, rows) {
            if (rowCount === 0) {
                createUser(email, name, res);
            }
            process.exit();
        }
    );

    request.on('row', function (columns) {
        columns.forEach(function (column) {
            console.log("%s\t%s", column.metadata.colName, column.value);
            if (column.metadata.colName == 'id') {
                res.write(column.value.toString());
                res.end();
            }
        });
    });
    request.on('requestCompleted', function () {
        running = false;
    });
    running = true;
    connection.execSql(request);
}

function checkUserForPermission(permissionName, userId, res) {

    // Read all rows from table
    var request = new Request(
        //Need to return userid from this
        "SELECT userId FROM UserToPermission userToPermission " +
        "JOIN Permission permission " +
        "ON permission.id = userToPermission.permissionId " +
        "WHERE permission.name = '" + permissionName + "'"
    );

    request.on('row', function (columns) {
        var written = false;
        columns.forEach(function (column) {
            console.log("%s\t%s", column.metadata.colName, column.value);
            if (column.metadata.colName == 'userId') {
                if (column.value == userId) {
                    res.write("true");
                    written = true;
                }

            }
        });
        if (!written) {
            res.write(column.value.toString());
        }
        res.end();
    });
    request.on('requestCompleted', function () {
        running = false;
    });
    running = true;
    connection.execSql(request);
}


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
    checkForUser(req.query.userEmail, req.query.userName, res);

});
app.get('/homepage.html', function (req, res) {
    fs.readFile('./homepage.html', function (err, data) {
        if (err) {
            throw err;
        }
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write(data);
        res.end();
    });
});
app.get('/permission', function (req, res) {
    checkUserForPermission(req.query.permissionName, req.query.userId, res);

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
// });
app.listen(port);

console.log("Server running at http://localhost:%d", port);

