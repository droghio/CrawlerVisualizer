var express = require("express")
var logfmt = require("logfmt");
var links = require("./links");

var app = express();

//Fixes caching issues with Safai.
//  ->http://stackoverflow.com/questions/18811286/nodejs-express-cache-and-304-status-code

app.use(logfmt.requestLogger());


//Serve static content, and starts links webui to backend. 

module.exports = {

    start: function (){
        var port = Number(process.env.PORT);
        
        app.use(function(req, res, next){ res.setHeader('Last-Modified', (new Date()).toUTCString()); next(); });
        app.use(express.static(__dirname + "/public"));

        //I'm making the assumption that the first page request won't happen until the database establishes a connection.
        links.loadConnection()

        app.use('/data', function(req, res) { links.getHundredLinks(function(json){ res.send(json)}, req.query.limit) });
        app.listen(port, function() { console.log("Static Server Listening on " + port); });
    },
}
