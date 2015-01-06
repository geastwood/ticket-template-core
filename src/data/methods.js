var methods = {};
var _ = require('lodash');

methods.getRows = function(mode) {
    return _.flatten(this.getSections(mode));
};

methods.getSections = function(mode) {
    return this.templates.map(function(t) {
        return t.$parent.format(t.organize(mode), mode);
    });
};

methods.print = function(mode) {

    if (mode === 'jira') {
        return this.getSections().map(function(section) {
            return section.reduce(function(prev, current) {
                return prev + current.rowContent + '\r\n';
            }, '');
        }).join('\r\n\r\n');
    }

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
    var rowIndex = this.parseUniqueKey(key).index;
    return this.getTemplateByKey(key).getFields(rowIndex).map(function(field) {
        field.name = field.name.trim();
        field.name = (field.name.length === 0 ?  '(!this field is empty)' : field.name);
        return field;
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
    return _.first(this.templates.filter(function(t) {
        return t.id === that.parseUniqueKey(key).id;
    }));
};

methods.update = function(key, fieldIndex, v) {
    var rowIndex = this.parseUniqueKey(key).index,
        template = this.getTemplateByKey(key),
        regex = /\{&}/;

    if (regex.test(v)) {
        v = v.replace(regex, template.getField(rowIndex, fieldIndex).value);
    }

    template.update(rowIndex, fieldIndex, v);
};

methods.insert = function(key, content, counter) {
    counter = counter || 1; // counter for handling multiple insert
    var rowIndex = this.parseUniqueKey(key).index;
    this.getTemplateByKey(key).insert(rowIndex + counter, content, counter);
};

methods.append = function(key, content) {
    this.getTemplateByKey(key).append(content);
};

methods['delete'] = function(key) {
    var rowIndex = this.parseUniqueKey(key).index;
    this.getTemplateByKey(key)['delete'](rowIndex);
};

module.exports = methods;
