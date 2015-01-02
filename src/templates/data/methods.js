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

module.exports = action;
