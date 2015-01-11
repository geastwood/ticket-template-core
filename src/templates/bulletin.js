var Base    = require('./Base');
var _       = require('lodash');

// Bulletin
var Bulletin = function() {
    this.columnCount = 3;
    this.autoIncrement = true;
    this.commentColumn = 3;
    this.columnDefinitions = [
        {mode: 'pad', strLength: 3, pad: 'left', ellip: false},
        {mode: 'pad', strLength: 88, pad: 'right', ellip: true},
        {mode: 'pad', strLength: 45, pad: 'right', ellip: true}
    ];

    Base.apply(this, arguments);
};

Bulletin.prototype = _.create(Base.prototype, {
    name: 'bulletin',
    code: 'b',
    $parent: Base
});

module.exports = Bulletin;
