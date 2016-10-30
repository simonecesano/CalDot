function wrap(text, width) {
    text.each(function() {
	var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
	    x = text.attr("x"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
	
	while (word = words.pop()) {
	    line.push(word);
	    tspan.text(line.join(" "));
	    if (tspan.node().getComputedTextLength() > width) {
		line.pop();
		tspan.text(line.join(" "));
		line = [word];
		tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
	    }
	}
    });
}

function rect_around(text) {
    text.each(function() {
	// var bbox = this.getBoundingClientRect();
	var bbox = this.getBBox();
	var group = d3.select(this);
	var t = group.attr('transform');
	var group_node = this;
	group.append('rect')
	    .attr("x", bbox.x)
	    .attr("y", bbox.y)
	    .attr("width", bbox.width)
	    .attr("height", bbox.height)
	    .style("stroke", "white")
	    .style("stroke-width", 2)
	    .style('fill-opacity', "1")
	    .style('fill', "#eeeeee")

	// console.log(this.parentNode);
	group.selectAll('text').each(function(e, i){
	    var t = this.cloneNode(true); this.remove()
	    group_node.appendChild(t);
	});
	var p = this.parentNode;
	var g = this.cloneNode(true);
	console.log(this);
	this.remove(); p.appendChild(g);
    })
}

function getRoot(el){
    var t = el;
    if (el instanceof SVGElement) {
	while (!t.tagName.match(/^svg$/i)) { t = t.parentNode }
	return t;
    }
}


function layout_03(nodes) {
    var left_point = 0; var top_point = 0; var right_limit;
    var placed = 0; var placed_idx = {};
    var margin = 6;
    var nodes_array = [];

    nodes.each(function(e, i) {
	delete e.rect;
	nodes_array.push(this);
	placed_idx[i] = 0;
    });


    
    var b_left = 0; // left boundary
    var b_top = nodes_array[0].getBoundingClientRect().top;
    
    // repeat until there are no nodes in the array to be placed
    while (placed < nodes_array.length) {
	var i = 0; // current node
	var max_height = 0;

	// get the first node whose left is >= than left_point and place it
	// repeat until you have tried to place all nodes
	while (i < nodes_array.length) {
	    if (!placed_idx[i] && nodes_array[i].getBoundingClientRect().x > b_left) {
		var t = b_top - nodes_array[i].getBoundingClientRect().top;
		var d = d3.select(nodes_array[i])

		var o = d.attr('transform')
		var transform = o ? o + ' translate(0,' + t + ')' : 'translate(0,' + t + ')'
		
		d.attr('transform', transform)

		// console.log(nodes_array[i].getBoundingClientRect());
		b_left = nodes_array[i].getBoundingClientRect().right
		max_height = max_height > nodes_array[i].getBoundingClientRect().height ? max_height : nodes_array[i].getBoundingClientRect().height;
		// tag the node as placed
		placed_idx[i] = 1;
		
		placed++;
		// console.log(nodes_array[i].parentNode);
	    } else {
	    }
	    i++
	}
	// move top point down
	b_top += (max_height + margin);

	// and left point to 0
	b_left = 0;
    }

}
