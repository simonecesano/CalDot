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
	var bbox = this.getBoundingClientRect();
	var root_el = getRoot(this)
	var x_off = root_el.getBoundingClientRect().x
	var y_off = root_el.getBoundingClientRect().y

	d3.select(this)
	    .append('rect')
	    .attr("x", bbox.x - x_off)
	    .attr("y", bbox.y - y_off )
	    .attr("width", bbox.width)
	    .attr("height", bbox.height)
	    .style('fill-opacity', "0.1")
	    .style('fill', "grey")
	    .style("stroke", "#eeeeee" )
	    .style("stroke-width", 2)

    })
}

function getRoot(el){
    var t = el;
    if (el instanceof SVGElement) {
	while (!t.tagName.match(/^svg$/i)) { t = t.parentNode }
	return t;
    }
}

function layout_01(nodes) {
    nodes.each(function(e, i) { e.rect = this.getBoundingClientRect() });
    nodes = nodes.sort(function(a, b){
	// if (a.rect.y != b.rect.y) return a.rect.y - b.rect.y
	// return Math.random() - 0.5;
	return a.rect.x != b.rect.x ? a.rect.x == b.rect.x : a.rect.y - b.rect.y
	// return a.task < b.task ? -1 : a.task > b.task;
    })

    var nodes_array = [];
    nodes.each(function(e, i) {
	delete e.rect;
	console.log(i + ' ' + e.task); 
	nodes_array.push(this) });
    var y_pos = [];

    var repeat = 1;
    var repeats = 0;

    var upper_bound = nodes_array[0].getBoundingClientRect().top;
    
    while (repeat > 0 && repeats < 4) {
	repeat = 0;
	repeats++;
	nodes.each(function(e, i){
	    var rect = this.getBoundingClientRect()

	    for (k = i + 1; k < nodes.size(); k++) {
		if (k == i) continue;
		var n = nodes_array[k];
		if (collide(rect, n.getBoundingClientRect())) {
		    repeat = 1;
		    var d =  d3.select(n);
		    var r = d3.select(this)

		    // console.log(r.datum().task.substr(0, 24));
		    // console.log('> ' + d.datum().task.substr(0, 24));

		    var t = rect.bottom - n.getBoundingClientRect().top;

		    // push it down
		    if (d.attr('transform')) {
			var o = d.attr('transform')
			d.attr('transform', o + ' translate(0,' + t + ')')
		    } else {
			d.attr('transform', 'translate(0,' + t + ')')
		    }
		}
	    }
	});
    }
}

function collide(r1, r2){
    return !(r2.left > r1.right || 
	     r2.right < r1.left || 
	     r2.top > r1.bottom ||
	     r2.bottom < r1.top);
}

function layout_02(nodes) {
    nodes.each(function(e, i) { e.rect = this.getBoundingClientRect() });
    nodes = nodes.sort(function(a, b){
	return a.rect.x != b.rect.x ? a.rect.x - b.rect.x : a.rect.y - b.rect.y
	// return a.rect.x - b.rect.x;
    })

    var nodes_array = [];
    nodes.each(function(e, i) {
	delete e.rect;
	console.log(i + ' ' + e.task); 
	nodes_array.push(this)
    });
    var y_pos = [];

    var repeat = 1;
    var repeats = 0;

    var upper_bound = nodes_array[0].getBoundingClientRect().top;
    
    while (repeat > 0 && repeats < 1) {
	repeat = 0;
	repeats++;
	nodes.each(function(e, i){
	    var rect = this.getBoundingClientRect()
	    
	    // put the rectangle at the top
	    // if it collides with any preceding one, push it down
	    // then take all following ones
	    // and if they conflict with this one, push them down
	    // take item to upper bound

	    // put the rectangle at the top

	    // console.log(d.attr('transform'));
	    // console.log(this.getBoundingClientRect())
	    
	    rect = this.getBoundingClientRect()

	    for (k = i + 1; k < nodes.size(); k++) {
		if (i == k) {  continue }
		var n = nodes_array[k];
		if (collide(rect, n.getBoundingClientRect())) {
		    var d =  d3.select(n);
		    var t = rect.bottom - n.getBoundingClientRect().top;

		    // console.log(d3.select(this).text().substring(0, 24));
		    // console.log(d.text().substring(0, 24));
		    // console.log('++++++++++++++++++++')

		    // push it down
		    if (d.attr('transform')) {
			var o = d.attr('transform')
			d.attr('transform', o + ' translate(0,' + t + ')')
		    } else {
			d.attr('transform', 'translate(0,' + t + ')')
		    }
		    // console.log(d.attr('transform'));
		}
	    }
	    // console.log(d.attr('transform'));
	    // console.log(this.getBoundingClientRect())
	    var t = upper_bound - this.getBoundingClientRect().top;
	    var d = d3.select(this)

	    // console.log(this.getBoundingClientRect())

	    var o = d.attr('transform')
	    var transform = o ? o + ' translate(0,' + t + ')' : 'translate(0,' + t + ')'

	    d.attr('transform', transform)
	    // console.log(d.attr('transform'));
	    // console.log(this.getBoundingClientRect())

	    // if it collides with any preceding one, push it down

	    for (k = 0; k < i; k++) {
		var rect = this.getBoundingClientRect()
		var n = nodes_array[k];
		if (d.text().match(/art/i) || i == 11 || k == 11) {
		    console.log(d.text().substring(0, 24));
		    console.log(d3.select(n).text().substring(0, 24));
		    console.log(rect)
		    console.log(n.getBoundingClientRect())
		    console.log(collide(rect, n.getBoundingClientRect()))
		    console.log('---------------------')
		}
		if (collide(rect, n.getBoundingClientRect())) {
		    var t = n.getBoundingClientRect().bottom - rect.top;
		    if (d.attr('transform')) {
			var o = d.attr('transform')
			d.attr('transform', o + ' translate(0,' + t + ')')
		    } else {
			d.attr('transform', 'translate(0,' + t + ')')
		    }
		}		
	    }
	    
	    console.log('#############################')
	});
    }
}


function layout_03(nodes) {
    nodes.each(function(e, i) { e.rect = this.getBoundingClientRect() });

    // sort the nodes left to right
    nodes_sorted = nodes.sort(function(a, b){ return a.rect.x != b.rect.x ? a.rect.x - b.rect.x : a.rect.y - b.rect.y })

    var left_point = 0; var top_point = 0; var right_limit;
    var placed = 0; var margin = 6;
    var nodes_array = [];
    nodes_sorted.each(function(e, i) { delete e.rect; nodes_array.push(this) });

    var b_left = 0; // left boundary
    var b_top = nodes_array[0].getBoundingClientRect().top;;
    
    // repeat until there are no nodes in the array to be placed
    while (placed < nodes_array.length) {
	var i = 0; // current node
	var max_height = 0;

	// get the first node whose left is >= than left_point and place it
	// repeat until you have tried to place all nodes
	while (i < nodes_array.length) {
	    if (nodes_array[i] && nodes_array[i].getBoundingClientRect().x > b_left) {
		// console.log(nodes_array[i].getBoundingClientRect());

		var t = b_top - nodes_array[i].getBoundingClientRect().top;
		var d = d3.select(nodes_array[i])

		var o = d.attr('transform')
		var transform = o ? o + ' translate(0,' + t + ')' : 'translate(0,' + t + ')'
		
		d.attr('transform', transform)

		// console.log(nodes_array[i].getBoundingClientRect());
		b_left = nodes_array[i].getBoundingClientRect().right
		max_height = max_height > nodes_array[i].getBoundingClientRect().height ? max_height : nodes_array[i].getBoundingClientRect().height;
		console.log(max_height);
		// delete the node from the array
		nodes_array[i] = undefined;
		
		placed++;
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
