var Base    = require('./Base');
var _       = require('lodash');

module.exports = Userstory;

// Userstory
var Userstory = function(data) {
    this.columnCount = 1;
    this.columnDefinitions = [{
        mode: 'pad', strLength: 138, pad: 'right', ellip: true
    }];
    this.sectionData = data;
};

Userstory.prototype = _.create(Base.prototype, {
    name: 'userstory',
    code: 'u'
});

// debug
var content = require('fs').readFile(__dirname + '/../../log-us', 'utf8', function(err, data) {
    var json = JSON.parse(data);
    var u = new Userstory(json.sections[0]);
    // console.log(u.organize('pretty'));
    console.log(Base.format(u.organize('pretty')));
    // console.log(u.format('pretty'));
    // var formatedData = format(json, 'pretty');

    // console.log(generator('choice').pretty(json));
    // require('fs').writeFileSync(__dirname + '/../../log1-us', JSON.stringify(u.format('pretty'), null, 4));
});
