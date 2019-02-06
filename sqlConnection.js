var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

// Create connection to database
var config =
    {
        authentication:
            {
                type: 'default',
                options:
                    {
                        userName: 'USERNAME HERE',
                        password: 'PASSWORD HERE',
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
function createUser(user){
    var request = new Request(
        "INSERT INTO [USER] (username, displayName, email, token) VALUES('" + user.getEmail() + "'" +
        ", '" + user.getName() + "', '" + user.getEmail() + "', '"+ user.getToken() + "'",
        function(err, rowCount, rows)
        {
            console.log(rowCount + ' row(s) returned');

            process.exit();
        }
    );
}
function checkForUser(user) {
    console.log('Check for User...');

    // Read all rows from table
    var request = new Request(
        "SELECT * FROM [USER] WHERE email = ''" + user.getEmail() +"'",
        function(err, rowCount, rows)
        {
            console.log(rowCount + ' row(s) returned');
            if(rowCount == 0){
                createUser();
            }
            process.exit();
        }
    );

    request.on('row', function(columns) {
        columns.forEach(function(column) {
            console.log("%s\t%s", column.metadata.colName, column.value);
        });
    });
    connection.execSql(request);

}