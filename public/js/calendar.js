// this

var Calendar = function (data, options) {
    options = options || {};
    
    data = _.chain(data)
	.each(function(e, i){
	    e.date = e[options['date'] || 'finish'];
	    e.name = e[options['task'] || 'task'];
	})
    	.filter(function(e){ return !(e.date.match(/invalid/i)) })
    	.sortBy(function(e){ return moment(e.date).unix() });
    
    this.min_date = data.first().value().date;
    this.max_date = data.last().value().date;
    this._data = data.value();
};

Calendar.prototype.people = function() {
    var data = this._data
    var people = _.flatten(_.map(data, function(e, i){
	var p = [];
	if (e.owner) {  p.push(e.owner.split(/;\s*|,\s*/)) }
	if (e.participants) { p.push(e.participants.split(/;\s*|,\s*/)) }
	return _.flatten(p);
    }));

    people = _.sortBy(people);
    return _.uniq(people);
}

Calendar.prototype.data = function() {
    return this._data;
}
