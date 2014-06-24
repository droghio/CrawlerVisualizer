//Var is a local declaration.
//Code modified from example make by D3noob:
// -> http://www.d3noob.org/2013/03/d3js-force-directed-graph-example-basic.html


force = 0;
nodes = {};
edges = {}

maxnumberlinks = 0;


function determineCharge(d, index){
    if (d.value)
        return -100*(d.value+5)
    return -200;
}

function determineDistance(d, index){
    if (d.value)
        return (d.value+1)*200
    return d.target.value;
}




gradients = [
             '<radialGradient id="red" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">\
             <stop style="stop-color:#D00;stop-opacity:1;" offset="0" id="stop3757" />\
             <stop id="stop3763" offset="0.5" style="stop-color:#C00;stop-opacity:1;" />\
             <stop style="stop-color:#A00;stop-opacity:1;" offset="1" id="stop3759" />\
             </radialGradient>',
             '<radialGradient id="green" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">\
             <stop style="stop-color:#0D0;stop-opacity:1;" offset="0" id="stop3757" />\
             <stop id="stop3763" offset="0.5" style="stop-color:#0C0;stop-opacity:1;" />\
             <stop style="stop-color:#0A0;stop-opacity:1;" offset="1" id="stop3759" />\
             </radialGradient>',
]




//Borrowed from:
//  -> http://stackoverflow.com/questions/13057606/jquery-ui-tooltip-manual-open-close
$.widget( "custom.tooltipX", $.ui.tooltip, {
    options: {
        autoShow: false,
        autoHide: false
    },
     
    _create: function() {
        this._super();
        if(!this.options.autoShow){
            this._off(this.element, "mouseover focusin");
        }
    },
         
    _open: function( event, target, content ) {
        this._superApply(arguments);
         
        if(!this.options.autoHide){
            this._off(target, "mouseleave focusout");
        }
    }
});



$.widget( "custom.tooltipNum", $.ui.tooltip, {
    options: {
        autoShow: false,
        autoHide: false
    },
     
    _create: function() {
        this._super();
        if(!this.options.autoShow){
            this._off(this.element, "mouseover focusin");
        }
    },
         
    _open: function( event, target, content ) {
        this._superApply(arguments);
         
        if(!this.options.autoHide){
            this._off(target, "mouseleave focusout");
        }
    }
});



$( document ).ready(function(){
    $("#svg-scale").change(function(){
        $("svg").css("transform", "scale("+$("#svg-scale").val()/750+")");
    })
})


function resetVisualize(){
    
    nodes = {}
    edges = {}
    maxnumberlinks = 0
    
    var rainbow = ["gray", "violet", "blue", "green", "#DD0", "orange", "red"]
    $("#modalview").fadeIn();
    
    
    // get the data
    d3.json("/data?limit="+document.getElementById("linklimit").value, function(error, links) {
        
        //Stop animation if it is running.
        if (force){ force.stop(); }
        
        //Remove existing svg object.
        d3.select("body").select("svg").remove()
            
        // Compute the distinct nodes from the links.
        links.forEach(function(link) {
                      
            //Create all nodes and edges refering to this link (if they don't exist already), so every edge is drawn.
            for (index = 0; index < link.referers.length; index++){
                      
                selectedLinkUrl = link.referers[index]

                //Ensures we don't draw edges that already exist, prevents duplicate edges and nodes.
                edge = edges[ [link.url,  selectedLinkUrl] ] ||
                      (edges[ [link.url,  selectedLinkUrl] ] = {
                  
                       target: nodes[link.url] ||
                           (nodes[link.url] = { name: link.url }),
                       
                       source: nodes[selectedLinkUrl] ||
                            (nodes[selectedLinkUrl] = { name: selectedLinkUrl, placeholder: true })
                       
                })
                      
                //Since we don't know if the target was created just now or before as a placeholder, it is more reliable to just set it now.
                edge.target.value = link.referers.length
                edge.target.placeholder = false;
   
            }
                  
            //Count the number of links comming to me, we do it outside the loop since this won't change.
            if (link.referers.length > maxnumberlinks){ maxnumberlinks = link.referers.length; }

        })
        
        var width = 30000;
        var height = 10000;
        
        force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(d3.values(edges))
        .size([width, height])
        .linkDistance(determineDistance)
        .charge(determineCharge)
        //.chargeDistance(maxnumberlinks)
        .gravity(.5)
        .friction(.5)
        .on("tick", tick)
        .on("end", drawpaths)
        .on("start", hidedetails)
        .start();
        
        var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);
        
        //Scale the svg element according to scale.
        $("svg").css("transform", "scale("+$("#svg-scale").val()/750+")");
            
        //Center window in view.
        window.scrollTo((width-window.innerWidth)/2, (height-window.innerHeight)/2)
        
        // build the arrow.
        svg.append("svg:defs").selectAll("marker")
        .data(["end"])      // Different link/path types can be defined here
        .enter().append("svg:marker")    // This section adds in the arrows
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 10)
        .attr("refY", -1)
        .attr("markerWidth", 10)
        .attr("markerHeight", 10)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M 0,-3  L 5,0  L 0,3");

        // add the links and the arrows
        var path = svg.append("svg:g").selectAll("path")
        .data(force.links())
        .enter().append("svg:path")
        .attr("class", "link")
        .attr("marker-end", "url(#end)");
            
        // define the nodes
        var node = svg.selectAll(".node")
        .data(force.nodes())
        .enter().append("circle")
        .attr("class", "node")
        .call(force.drag)
        .on("drag", function(){  d3.event.sourceEvent.stopPropagation(); })
        .on("click", function(d){  if (!d3.event.defaultPrevented){ window.open(d.name); }  })

        .on("mouseover", function(d){

            $(this).tooltipX({
                items: $(this),
                content: this.attributes.getNamedItem("data-url").value,
                position: {
                    my: "left top",
                    at: "center+"+(r=(2*this.attributes.getNamedItem("r").value*$("#svg-scale").val()/750))+" center+"+r
                }
            });
            
            $(this).tooltipX("open");
            
            //Note these are strings.
            var position = $(this).attr("transform").replace("translate(", "").replace(")", "").split(",")
            var x = (Number(position[0])-width/2)*$("#svg-scale").val()/750+width/2
            var y = (Number(position[1])-height/2)*$("#svg-scale").val()/750+height/2

            $("body").append("<div id='numlinks' data-url='" +
                this.attributes.getNamedItem("data-url").value +
                "' style='\
                    left: "+x+"px;\
                    top: "+y+"px;\
                    margin-left: -25px;\
                    margin-top: -9px;\
                    text-align: center;\
                    color: white;\
                    width: 50px;\
                    height: 18px;\
                    box-shadow: none;\
                    border: none;\
                ' class='ui-tooltip'>"+
                    this.attributes.getNamedItem("data-numlinks").value+
                "</div>"
            )

        })
        .on("mouseout", function(){ $(this).tooltipX("close"); $("#numlinks[data-url='"+this.attributes.getNamedItem("data-url").value+"']").fadeOut(function(){$(this).remove()}) })

        // add the nodes
        //Links that were not directly loaded are black.
        //node.append("circle")
        node.attr("r", function(d){ return d.value && d.value > 5 ? (d.value/5)+5 : 5; })
        .attr("fill", function(d){
            return d.placeholder ? "black" : rainbow[Math.floor(d.value*(rainbow.length-1)/maxnumberlinks)]
        })
        .attr("class", function (d){ return d.placeholder ? "vanish" : "path" })
        

        // store the url as a data attribute
        node
        .attr("data-url", function(d) { return d.name; })
        .attr("data-numlinks", function(d) { return d.value; })
        .attr("data-partialnode", function(d){ return d.placeholder })

        
        // add the curvy lines
        function tick() { node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; }); }
        
        function drawpaths(){
            
            path.attr("d", function(d) {
                //Only bother drawing a path if we have something to draw from.
                var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);

                if (dr == 0){ shoulddelete = true; }

                return "M" + d.source.x + "," +
                d.source.y + "A" +
                dr + "," + dr + " 0 0,1 " +
                d.target.x + "," +
                d.target.y;
            }).attr("class", "link").style("opacity", 1)
            
            //Show the black nodes.
            node.attr("class", "path").style("opacity", 1)
            
        }

        //Hides elements we don't need to animate (helps speed rendering), and closes modal view.
        function hidedetails(){
            $("#modalview").fadeOut();
            d3.selectAll("path").attr("class", "vanish").style("opacity", 0);
            d3.selectAll("[data-partialnode=true]").attr("class", "vanish").style("opacity", 0);
        }
        
            
    });
}