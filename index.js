var http = require('http');
var fs = require("fs");
var port = process.env.PORT || 8080;



http.createServer( function(req, res) {

    var now = new Date();
    var filename = (req.url || "index.html");
    if(filename === "/"){
        filename = "/index.html";
    }
    //Inspiration for this code is taken from https://stackoverflow.com/questions/4720343/loading-basic-html-in-node-js
    fs.readFile('.'+filename, function (err, data) {
        if(err){
            throw err;
        }
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write(data);
        res.end();
    })
}).listen(port);

console.log("Server running at http://localhost:%d", port);

