var methods = {};
var _ = require('lodash');

methods.getRows = function(mode) {
    return _.flatten(this.templates.map(function(t) {
        return t.$parent.format(t.organize(mode), mode);
    }));
};

methods.print = function(mode) {
    return this.getRows(mode).map(function(row) {
        return row.rowContent;
    }).join('\n');
};

methods.optionList = function(mode) {
    return this.getRows(mode).map(function(row) {
        return {name: row.rowContent, value: row.rowIndex};
    });
};

method.parseUniqueKey = function(key) {
    var parts = key.trim().split('-');

    return {
        key: [parts[0], parts[1]].join('-'),
        index: parstInt(parts[2], 10)
    };
};

module.exports = action;
