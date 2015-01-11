var Base    = require('./Base');
var _       = require('lodash');

// Checklist
var Checklist = function() {
    this.columnCount = 4;
    this.autoIncrement = true;
    this.checkColumn = 3;
    this.commentColumn = 4;
    this.columnDefinitions = [
        {mode: 'pad', strLength: 3, pad: 'left', ellip: false},
        {mode: 'pad', strLength: 80, pad: 'right', ellip: true},
        {mode: 'pad', strLength: 7, pad: 'center', ellip: false},
        {mode: 'pad', strLength: 45, pad: 'right', ellip: true}
    ];
    Base.apply(this, arguments);
};

Checklist.prototype = _.create(Base.prototype, {
    name: 'checklist',
    code: 'c',
    $parent: Base
});

module.exports = Checklist;
