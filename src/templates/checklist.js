var Base    = require('./Base');
var _       = require('lodash');

// Checklist
var Checklist = function() {
    this.columnCount = 1;
    this.columnDefinitions = [
        {mode: 'pad', strLength: 3, pad: 'left', ellip: false},
        {mode: 'pad', strLength: 80, pad: 'right', ellip: true},
        {mode: 'pad', strLength: 5, pad: 'center', ellip: false},
        {mode: 'pad', strLength: 47, pad: 'right', ellip: true}
    ];
    Base.apply(this, arguments);
};

Checklist.prototype = _.create(Base.prototype, {
    name: 'checklist',
    code: 'c',
    $parent: Base
});

module.exports = Checklist;
