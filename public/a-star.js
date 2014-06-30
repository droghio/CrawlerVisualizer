
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXX  XXX     XXX XXX XXX  XX XXX
//XXXXXX  XXX XXX XXX     XXX X X XXX
//XXX XX  XXX XXX XXX XXX XXX XX  XXX
//XXX     XXX     XXX XXX XXX XXX XXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//
//
//-------------------------------
//D3 compliant a* search implementation.
//
//Used to find paths between nodes.
//--------------------------------

// June 26, 2013
// John Drogo



//Uses Bucket Library for data-structures.
//      --> https://github.com/mauriciosantos/buckets

//var buckets = require("./buckets.js"); //Uncomment to use with nodejs.
//Otherwise just include this file and the ./buckets.js file in your html file. (buckets first)

//A star class.
function aStar(rootnode, endnode, nodecompare, edges, edgehash, edgeequal){
    this.openset = new buckets.PriorityQueue(nodecompare);
    this.openset.add(rootnode)
    rootnode.aStarDepth = 0; //References.
    this.connections = this.d3listToMulti(edges, edgehash, edgeequal)
    this.currentnode = {};
    this.goalnode = endnode;
}


aStar.prototype = {
    openset: null,      //Priority Queue
    closedset: [],      //Array
    connections: null,  //MultiDictionary
    startnode: null,    //Node
    currentnode: null,  //Node
    goalnode: null,     //Node
    traceBack: function(distance){ console.log("GOOAAALLL!!!!!!! Distance: " + String(distance)); return false; },
    //Should make this actually trace back the path.
    
    
    d3listToMulti: function (list, keyhash, valueequal){
        var returnvalue = new buckets.MultiDictionary(keyhash, valueequal)

        for (var index=0, length=list.length; index<length; index++){
            returnvalue.set(list[index].source, list[index].target)
        }
        
        ///*DEBUG1*/ console.log("Edges: " + JSON.stringify(returnvalue))
        return returnvalue;
    },
    

    queueChildren: function (){
        
        for (var index=0,children=this.connections.get(this.currentnode); index<children.length; index++){
            ///*DEBUG1*/console.log("Children: " + JSON.stringify(children) + " Index: " + index)
            
            //Could cause issues in complex cases or if you are doing something really weird with your nodes, but should be fine 98% of the time.
            if (children[index].aStarDepth === null || children[index].aStarDepth === undefined){ children[index].aStarDepth = this.currentnode.aStarDepth+1 }
            
            children[index].aStarDepth = (children[index].aStarDepth>(this.currentnode.aStarDepth+1)
                ? this.currentnode.aStarDepth+1 : children[index].aStarDepth)
                //It is one link to go from a parent to a child.
                //Eventually I should develop a heuristic function to make this really an A* search.
            
            //Equation:
                //f(x) = g(x) + h(x), I'm not using h(x) (it is a heuristic function)
                //g(x) is the distance from the start, and f(x) if our refined/guess distance/priority in the queue.
                //
                //f(x) = children[index].aStarDepth
                //g(x) = this.currentnode.aStarDepth+1, we move one layer deeper each time.
                //
                //If you do use a heuristic makesure it never underestimates the distance.
            
            //Don't add a child twice, just update its values.
            //Loving JS references right now.
            if (!(this.openset.contains(children[index]) || this.closedset.indexOf(children[index]) != -1))
                this.openset.add(children[index])
        }
        
    },
    

    searchTick: function(){

        //If the search is done.
        if (this.openset.isEmpty() || this.currentnode == this.goalnode){
            distance = this.currentnode.aStarDepth
            while (this.closedset.length){ this.closedset.pop().aStarDepth = null; } //Clean the closed set.
            this.openset.clear()
            return this.currentnode == this.goalnode ? this.traceBack(distance) : false; //Failure!
        }

        //Reset the depth if we are preforming another search on this data.
        this.currentnode.aStarDepth = null;

        this.currentnode = this.openset.dequeue()
        
        if (this.currentnode.aStarDepth === null)
            this.currentnode.aStarDepth = Infinity;

        //Adds children to the prioity queue.
        this.queueChildren()

        this.closedset.push(this.currentnode)
        
        //If true, keep going.
        return true;
    },
    
    
    start: function(){
        while (this.searchTick());
    }

    
}

/*
(search = new aStar(nodes["http://syr.edu/"], nodes["http://news.syr.edu/"], function (l, r){ return (l.aStarDepth < r.aStarDepth) ? 1 : -1 }, d3.values(edges), function(val){ return val.name; }, function(l, r){return (l.name === r.name);})).start()

console.log("Closed: " + JSON.stringify(search.closedset))
console.log("Open " + JSON.stringify(search.openset))
*/