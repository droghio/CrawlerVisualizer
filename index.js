/*
	John Drogo
	June 6, 2014

    Crawling Specter
	
    Crawles a webpage looking for links.
    Saves links in a MongoDB, and then processes the next link.
    Continues until all links have been exhausted.

    This file initiates children processes that actually preform the crawl.
*/

var server = require("./server.js")

server.start();