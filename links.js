/*
	John Drogo
	June 6, 2014

    Crawling Specter Mongo interface
	
    Saves visited links and links found in a MongoDB.

	(Make sure you put in your MongoDB credentials. Three values to update.)
*/


var mongoose = require('mongoose');
var models = require("./models/link.js");

var mongouser = process.env.MONGO_USER
var mongopassword = process.env.MONGO_PASSWORD
var mongourl = process.env.MONGO_URL

module.exports = {

    loadConnection: function(callBack){
        mongoose.connect("mongodb://" + mongouser + ":" + mongopassword + "@" + mongourl);
        mongoose.connection.on("error", console.error.bind(console, "ERROR: Quiting due to MongoDB connection error: "));
        if (callBack){ mongoose.connection.once("open", callBack); }
    },

    
    closeConnection: function(callBack){
        if (callBack){ mongoose.connection.on("close", callBack); }
        mongoose.connection.close()
    },


    countDocuments: function(callBack){
        var db = mongoose.connection;
        var Links = mongoose.model('Links', models.linkscheme);

        Links.find({ visited: false }).count().exec(function (err, count){
            if (err){ return console.log("ERROR: MongoDB counting error."); }
            return callBack(count)
        });
    },



    getHundredLinks: function(callback, limit){
        if (!limit){ limit = 10; }
        var Links = mongoose.model('Links', models.linkscheme);
        Links.find().sort("date").limit(limit).exec(function(err, links){return callback(links)})
    },


    getDeadLinks: function(callback){
        var Links = mongoose.model('Links', models.linkscheme);
        console.log("Finding dead links.")
        Links.find({ visited: true, valid: false }).select("url -_id").exec(function(err, deadlinks){ if (deadlinks){callback(deadlinks)} })
    }

}
