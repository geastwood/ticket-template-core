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

methods.print = function(mode, withCategory) {
    return this.getRows(mode).map(function(row) {
        return withCategory ? row.categoryId + row.rowContent : row.rowContent;
    }).join('\n');
};

methods.output = function() {
    return this.getSections().map(function(section) {
        return section.reduce(function(prev, current) {
            return prev + current.rowContent + '\n';
        }, '');
    }).join('\n\n');
};

methods.optionList = function() {
    return this.getRows('pretty').map(function(row) {
        return {name: row.categoryId + row.rowContent, value: row.rowIndex};
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

methods.sectionMethods = function(sectionId, list) {
    return {
        finish: function() {
            console.log(sectionId, list);
        }
    };
};

methods.cmd = function(cmd) {

    var availCmds = ['finish'];
    var argumentParse;
    var categoryRegex = /^[A-Z]$/;
    var parts = cmd.trim().split(/\s+/).filter(function(part) {
        return part.length > 0;
    });
    parts.getCmd = function() {
        return this[0];
    };
    parts.getCategory = function() {
        return this[1];
    };
    parts.getArgument = function() {
        return this[2];
    };
    argumentParse = function(arg) {
        if (arg === 'all') {
            return true;
        } else if (/\d\.\.\d/.test(arg) === true) {
            return true;
        }
        return false;
    };

    return {
        validate: function() {
            if (!_.contains(availCmds, parts.getCmd())) {
                return 'Only "' + availCmds + '" is allowd.';
            }
            if (!categoryRegex.test(parts.getCategory())) {
                return '"' + parts.getCategory() + '" is invalid. Second paramenter "Category" can only be one capital letter.';
            }
            if (!argumentParse(parts.getArgument())) {
                return '"' + parts.getArgument() + '" is not valid.';
            }
            return true;
        },
        parse: function() {
            return {id: parts.getCategory(), list: parts.getArgument()};
        },
        run: function() {
            methods.sectionMethods.apply(methods, parts.slice(1))[parts.getCmd()]();
        }
    };
};

module.exports = methods;
