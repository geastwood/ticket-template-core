var action = {};
var _ = require('lodash');

action.getRows = function(mode) {
    return _.flatten(this.templates.map(function(t) {
        return t.$parent.format(t.organize(mode), mode);
    }));
};

action.print = function(mode) {
    return this.getRows(mode).map(function(row) {
        return row.rowContent;
    }).join('\n');
};

action.optionList = function(mode) {
    return this.getRows(mode).map(function(row) {
        return {name: row.rowContent, value: row.rowIndex};
    });
};

module.exports = action;
