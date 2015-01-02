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

methods.optionList = function() {
    return this.getRows('pretty').map(function(row) {
        return {name: row.rowContent, value: row.rowIndex};
    });
};

methods.getFieldOptions = function(key) {
    var rst = [], rowIndex = this.parseUniqueKey(key).index;
    this.getTemplateByKey(key).forEach(function(t) {
        rst = t.getFields(rowIndex);
    });

    return rst.map(function(field, index) {
        return {name: field, value: index};
    });
};

methods.parseUniqueKey = function(key) {
    var parts = key.trim().split('-');

    return {
        id: [parts[0], parts[1]].join('-'),
        index: parseInt(parts[2], 10)
    };
};

methods.getTemplateByKey = function(key) {
    var that = this;
    return this.templates.filter(function(t) {
        return t.id === that.parseUniqueKey(key).id;
    });
};

methods.update = function(key, fieldIndex, v) {
    var rowIndex = this.parseUniqueKey(key).index;
    this.getTemplateByKey(key).forEach(function(t) {
        t.update(rowIndex, fieldIndex, v);
    });
};

methods.insert = function(key, content) {
    var rowIndex = this.parseUniqueKey(key).index;
    this.getTemplateByKey(key).forEach(function(t) {
        t.insert(rowIndex, content);
    });
};

methods.append = function(key, content) {
    this.getTemplateByKey(key).forEach(function(t) {
        t.append(content);
    });
};

methods['delete'] = function(key) {
    var rowIndex = this.parseUniqueKey(key).index;
    this.getTemplateByKey(key).forEach(function(t) {
        t['delete'](rowIndex);
    });
};

module.exports = methods;
