var Base    = require('./Base');
var _       = require('lodash');

// Bulletin
var Bulletin = function(data) {
    this.columnCount = 1;
    this.columnDefinitions = [
        {mode: 'pad', strLength: 3, pad: 'left', ellip: false},
        {mode: 'pad', strLength: 86, pad: 'right', ellip: true},
        {mode: 'pad', strLength: 47, pad: 'right', ellip: true}
    ];

    Base.apply(this, arguments);
};

Bulletin.prototype = _.create(Base.prototype, {
    name: 'bulletin',
    code: 'b',
    $parent: Base
});

module.exports = Bulletin;
