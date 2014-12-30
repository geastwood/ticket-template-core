var Base    = require('./Base');
var _       = require('lodash');

module.exports = Checklist;

// Checklist
var Checklist = function(data) {
    this.columnCount = 1;
    this.columnDefinitions = [
        {mode: 'pad', strLength: 3, pad: 'left', ellip: false},
        {mode: 'pad', strLength: 80, pad: 'right', ellip: true},
        {mode: 'pad', strLength: 5, pad: 'center', ellip: false},
        {mode: 'pad', strLength: 47, pad: 'right', ellip: true}
    ];
    this.sectionData = data;
};

Checklist.prototype = _.create(Base.prototype, {
    name: 'checklist',
    code: 'c'
});

// debug
var content = require('fs').readFile(__dirname + '/../../log', 'utf8', function(err, data) {
    var json = JSON.parse(data);
    var u = new Checklist(json.sections[2]);
    // console.log(u.organize('pretty'));
    console.log(Base.format(u.organize('pretty')));
    // console.log(u.format('pretty'));
    // var formatedData = format(json, 'pretty');

    // console.log(generator('choice').pretty(json));
    // require('fs').writeFileSync(__dirname + '/../../log1-us', JSON.stringify(u.format('pretty'), null, 4));
});
