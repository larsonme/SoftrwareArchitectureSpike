var http = require('http');
var path = require("path");
var fs = require("fs");
var checkMimeType = true;
var port = process.env.PORT || 8080;


http.createServer( function(req, res) {

    var now = new Date();
    var filename = req.url || "index.html";
    filename = filename.split("?")[0];

    if(filename === "/"){
        filename = "/index.html";
    }
    var ext = path.extname(filename);

    var localPath = __dirname;
    var validExtensions = {
        ".html" : "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".txt": "text/plain",
        ".jpg": "image/jpeg",
        ".gif": "image/gif",
        ".png": "image/png",
        ".woff": "application/font-woff",
        ".woff2": "application/font-woff2"
    };

    var validMimeType = true;
    var mimeType = validExtensions[ext];
    if (checkMimeType) {
        validMimeType = validExtensions[ext] != undefined;
    }

    if (validMimeType) {
        localPath += filename;
        fs.exists(localPath, function(exists) {
            if(exists) {
                console.log("Serving file: " + localPath);
                getFile(localPath, res, mimeType);
            } else {
                console.log("File not found: " + localPath);
                res.writeHead(404);
                res.end();
            }
        });

    } else {
        console.log("Invalid file extension detected: " + ext + " (" + filename + ")")
    }

}).listen(port);

function getFile(localPath, res, mimeType) {
    fs.readFile(localPath, function(err, contents) {
        if(!err) {
            res.setHeader("Content-Length", contents.length);
            if (mimeType != undefined) {
                res.setHeader("Content-Type", mimeType);
            }
            res.statusCode = 200;
            res.end(contents);
        } else {
            res.writeHead(500);
            res.end();
        }
    });
}
console.log("Server running at http://localhost:%d", port);

console.log('Username: ' + process.env.APPSETTINGS_DB_USERNAME);
console.log('Password: ' + process.env.APPSETTINGS_DB_PASSWORD);
console.log('Username: ' + process.env.DB_USERNAME);
console.log('Password: ' + process.env.DB_PASSWORD);

//
// var server = http.createServer(function(request, response) {
//
//     response.writeHead(200, {"Content-Type": "text/html"});
//     response.write("<!DOCTYPE html>\n" +
//         "<html lang=\"en\">\n" +
//         "<head>\n" +
//         "    <meta charset=\"UTF-8\">\n" +
//         "    <title>Title</title>\n" +
//         "    <script src=\"https://apis.google.com/js/platform.js\" async defer></script>\n" +
//         "    <meta name=\"google-signin-client_id\" content=\"856195068123-g6nbu0cph9hmia7rudrfan5tc1ib0qoo.apps.googleusercontent.com\">\n" +
//         "    <meta name=\"google-site-verification\" content=\"sOePc1ausWnsUShRluGqese37YP0QAgR6lQs-wgEmtY\" />    <script>\n" +
//         "        function onSignIn(googleUser) {\n" +
//         "            var profile = googleUser.getBasicProfile();\n" +
//         "            console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.\n" +
//         "            console.log('Name: ' + profile.getName());\n" +
//         "            console.log('Image URL: ' + profile.getImageUrl());\n" +
//         "            console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.\n" +
//         "            console.log(googleUser.getAuthResponse().id_token); // This is null if the 'email' scope is not present.\n" +
//         // "            Prompt for 2FA here?  Or can we just make a requirement that all admins set up 2FA on their Google Account?" +
//         "}\n" +
//         "       </script>\n" +
//         "</head>\n" +
//         "<body>\n" +
//         "Click the button below to login\n" +
//         "<div class=\"g-signin2\" data-onsuccess=\"onSignIn\"></div>\n" +
//         "</>\n" +
//         "\n" +
//         "</html>");
//     response.end();
//
// });
//
// var port = process.env.PORT || 1337;
// server.listen(port);
//
// console.log("Server running at http://localhost:%d", port);
