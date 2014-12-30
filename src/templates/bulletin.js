var Base    = require('./Base');
var _       = require('lodash');

module.exports = Bulletin;

// Bulletin
var Bulletin = function(data) {
    this.columnCount = 1;
    this.columnDefinitions = [
        {mode: 'pad', strLength: 3, pad: 'left', ellip: false},
        {mode: 'pad', strLength: 86, pad: 'right', ellip: true},
        {mode: 'pad', strLength: 47, pad: 'right', ellip: true}
    ];
    this.sectionData = data;
};

Bulletin.prototype = _.create(Base.prototype, {
    name: 'bulletin',
    code: 'b'
});

// debug
// var content = require('fs').readFile(__dirname + '/../../log', 'utf8', function(err, data) {
//     var json = JSON.parse(data);
//     var u = new Bulletin(json.sections[1]);
//     // console.log(u.organize('pretty'));
//     console.log(Base.format(u.organize('pretty')));
//     // console.log(u.format('pretty'));
//     // var formatedData = format(json, 'pretty');
//
//     // console.log(generator('choice').pretty(json));
//     // require('fs').writeFileSync(__dirname + '/../../log1-us', JSON.stringify(u.format('pretty'), null, 4));
// });
