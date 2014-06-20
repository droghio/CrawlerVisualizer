CrawlerVisualizer
===============

***Simple web visualizer using d3.js and node.js.***

###PREREQUISITES

You must have nodejs installed and access to a mongodb.
I use MongoHQ but any mongo database should work.

This program is intended as a companion to my CrawlingSpecter program.
If you point this program to the same MongoDB used to store crawl data you will get a nice visualization of the site.



###SETUP

After you have installed node run:
  ```npm install```
  
This will load all of the project dependencies.
To set up the web ui and mongo bindings you'll need to set a few environment variables.

For mongodb:
  
      export MONGO_USER="your_mongo_username"
      export MONGO_PASSWORD="your_mongo_password"
      export MONGO_URL="your_mongo_URL/the_database" #(Do not include mongodb://.)
  

Then for express:
  ```export PORT=8000```
  
  Where you replace the 8000 with whatever port you want the webui to be forwarded to.
  
  
  
  
###RUNNING

Move to the CrawlingSpecter install directory and run:
  ```node index.js```
  
  You should see a message on the console saying:
  
  ```Static Server Listening on 8000```
  
  With whatever port you chose.
  Open the webui in your browser (http://localhost:8000 by default), and you should be ready to crawl.
 
**NOTE:** You will need the port your chose for the webui to be open. This means that by default this program and the Crawler Visualizer cannot be one at the same time since they both use the same PORT variable to listen on.
  
  
  
  
###CONFIGURATION

Once you specify the mongo credentials you should be greeted with a visualization of your site on openning the webui.
It might take a second or two to load the initial json file from your db.

By default ten pages are loaded. You can change the number of pages in the control text box in the top right.
Hit the "Reload" button to update the visualization.




###DETAILS

Each page is represented by a circle.
The size and color of the circle depend on the the number of times the page was linked to.
The more links pointing to a page, the larger and warmer the corisponding circle.

The number inside the circle is the number of times the page was linked to.
Mousing over a circle will display the url of the page it represents, and clicking the circle will open that url in a new window.

Again this is a companion app to my CrawlingSpecter crawler. In order to visualize a site you must crawl it using this program.
It is not necessary to completely crawl the site.

Make sure that once you have crawled the site you first quit the crawler (Cntrl+C), point the CrawlerVisualizer to the same MongoDB (should be done by default if you followed my instructions, and launch the program.

Enjoy!
