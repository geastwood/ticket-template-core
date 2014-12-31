var Base    = require('./Base');
var _       = require('lodash');

// Userstory
var Userstory = function(data) {
    this.columnCount = 1;
    this.columnDefinitions = [{
        mode: 'pad', strLength: 138, pad: 'right', ellip: true
    }];
    Base.apply(this, arguments);
};

Userstory.prototype = _.create(Base.prototype, {
    name: 'userstory',
    code: 'u',
    $parent: Base
});

module.exports = Userstory;
