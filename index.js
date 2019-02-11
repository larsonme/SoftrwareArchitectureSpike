var fs = require("fs");
var port = process.env.PORT || 8080;
var express = require('express');
var app = express();
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var ConnectionPool = require('tedious-connection-pool');
var poolConfig = {
    min: 2,
    max: 4,
    log: true
};
var config =
    {

                        userName: 'azureuser',
                        password: 'Cnnu7jLJ2b',

        server: 'softwarearchitecture2019.database.windows.net',
        options:
            {
                database: 'spikedatabase',
                encrypt: true
            }
    };
var pool = new ConnectionPool(poolConfig, config);

function createUser(email, name, res) {
    pool.acquire(function (err, connection) {
        if (err) {
            console.log(err);
        }
        var request = new Request("INSERT INTO dbo.[User] (username, displayName, email) OUTPUT INSERTED.id VALUES (@email, @name, @email);", function (err) {
            if (err) {
                console.log(err);
            }
            connection.release();
        });
        request.addParameter('email', TYPES.NVarChar, email);
        request.addParameter('name', TYPES.NVarChar, name);
        request.on('row', function (columns) {
            columns.forEach(function (column) {
                console.log("In foreach");
                if (column.value === null) {
                    console.log('NULL');
                } else {
                    res.write(column.value.toString());
                    res.end();
                }
            });
        });
        connection.execSql(request);
    });


}

function checkForUser(email, name, res) {

    pool.acquire(function (err, connection) {
        if (err) {
            console.log(err);
        }
        var request = new Request(
            //Need to return userid from this
            "SELECT * FROM [USER] WHERE email = '" + email + "'",
            function (err, rowCount, rows) {
                if (err) {
                    console.log(err);
                }
                if (rowCount === 0) {
                    console.log("Creating user");
                    createUser(email, name, res);
                }
                connection.release();
            }
        );

        request.on('row', function (columns) {
            columns.forEach(function (column) {
                console.log("%s\t%s", column.metadata.colName, column.value);
                if (column.metadata.colName == 'id') {
                    console.log("id is: " + column.value.toString());
                    res.write(column.value.toString());
                    res.end();
                }
            });
        });

        connection.execSql(request);
    });

}

/*
Returns true if user has permission, false if user does not have permission
 */
function checkUserForPermission(permissionName, userId, res) {

    pool.acquire(function (err, connection) {
        if (err) {
            console.log(err);
        }
        var request = new Request(
            //Need to return userid from this
            "SELECT * FROM UserToPermission userToPermission " +
            "JOIN Permission permission " +
            "ON permission.id = userToPermission.permissionId " +
            "WHERE permission.name = '" + permissionName + "' AND userToPermission.userId ='" + userId + "'", function (err, rowCount, rows) {
                if (err) {
                    console.log(err);
                }
                if (rowCount > 0) {
                    res.write("permission");
                    res.end();
                } else {
                    res.write("no");
                    res.end();
                }
                connection.release();
            });

        connection.execSql(request);
    });

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
    let userHasPermission = checkUserForPermission(req.query.permissionName, req.query.userId, res);
    console.log(userHasPermission);
    // if (userHasPermission === true) {
    //     fs.readFile('./permissionedPage.html', function (err, data) {
    //         if (err) {
    //             throw err;
    //         }
    //         res.writeHead(200, {"Content-Type": "text/html"});
    //         res.write(data);
    //         res.end();
    //     });
    // } else if (userHasPermission === false) {
    //     fs.readFile('./errorPage.html', function (err, data) {
    //         if (err) {
    //             throw err;
    //         }
    //         res.writeHead(200, {"Content-Type": "text/html"});
    //         res.write(data);
    //         res.end();
    //     });
    // }
    // TODO this should do the fs.readFile permission page if the user has permission
    // so checkForpermish should return something valuable
    // if not, render the error page
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
app.get('/errorPage.html', function (req, res) {
    //Check database for userid and if they have the right permission for this page
    //If they do, return permissionedPage
    console.log(req.query);
    fs.readFile('./errorPage.html', function (err, data) {
        if (err) {
            throw err;
        }
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write(data);
        res.end();
    });
});
app.listen(port);

console.log("Server running at http://localhost:%d", port);

