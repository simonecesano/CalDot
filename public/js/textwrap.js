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

function layout(nodes) {
    nodes.each(function(e, i) { e.rect = this.getBoundingClientRect() });
    nodes = nodes.sort(function(a, b){
	// if (a.rect.y != b.rect.y) return a.rect.y - b.rect.y
	// return Math.random() - 0.5;
	return a.rect.x != b.rect.x ? a.rect.x == b.rect.x : a.rect.y - b.rect.y
	// return a.task < b.task ? -1 : a.task > b.task;
    })

    var nodes_array = [];
    nodes.each(function(e, i) { delete e.rect; nodes_array.push(this) });
    var y_pos = [];

    var repeat = 1;
    var repeats = 0;

    var upper_bound = 250;
    
    while (repeat > 0 && repeats < 10) {
	repeat = 0;
	repeats++;
	nodes.each(function(e, i){
	    var rect = this.getBoundingClientRect()
	    var t = upper_bound - rect.top;

	    for (k = i + 1; k < nodes.size(); k++) {
		var n = nodes_array[k];
		if (collide(rect, n.getBoundingClientRect())) {
		    repeat = 1;
		    var d =  d3.select(n);
		    var r = d3.select(this)

		    console.log(r.datum().task.substr(0, 24));
		    console.log('> ' + d.datum().task.substr(0, 24));

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
