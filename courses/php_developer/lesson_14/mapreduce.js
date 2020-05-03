/* global db */
/* global emit */

var maxHits = 1000;
var countPages = 30;

var randomValue = function(max) {
    return Math.floor(Math.random() * max) + 1;
};

var generateHits = function () {
    db.hits.remove({});
    db.hits_stats.remove({});
    
    for (var year = 2017; year < 2018; year++) {
        for (var month = 1; month < 13; month++) {
            for (var day=1; day < 32; day++) {
                for (var i = 0; i < randomValue(maxHits); i++) {
                    db.hits.insert({resource: randomValue(countPages), date: new Date(year, month, day, 0, 0, 0)});
                }
            }
        }
    }
};

generateHits();

var map = function() {
	var key = {resource: this.resource, year: this.date.getFullYear(), month: this.date.getMonth(), day: this.date.getDate()};
	emit(key, {count: 1}); 
};

//resource: 30, date: 2017-02-22
//resource: 30, date: 2017-02-22
//30 2017-02-22

//{resource: 30, year: 2017, month: 02, day: 22} [{count:1},{count: 1},{count:1}]
//{resource: 30, year: 2017, month: 02, day: 23} [{count:1}]
var reduce = function(key, values) {
	var sum = 0;
	values.forEach(function(value) {
		sum += value['count'];
	});
	return {count: sum};
};

db.hits.mapReduce(map, reduce, {out: 'hit_stats'});
/*
db.hits.aggregate([ { $match: { date: { $gte: new Date(2017-06-01) } } }, { $group: { _id: "$resource", total: {$sum: 1} } } ])
ISODate("2012-01-12T20:15:31Z")
db.hits.aggregate([ { $match: { date: { $gte: new ISODate("2017-04-12T00:00:00Z") } } }, { $group: { _id: "$resource", total: {$sum: 1} } } ])
*/