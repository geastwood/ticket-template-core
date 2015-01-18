var _           = require('lodash');
var Command     = require('../command');
var methods     = {};

var parseUniqueKey = function(key) {
    var parts = key.trim().split('-');

    return {
        id: [parts[0], parts[1]].join('-'),
        index: parseInt(parts[2], 10)
    };
};

/**
 * @private
 * @param mode 'pretty'|anything else
 * @returns {Array}
 */
methods.getRows = function(mode) {
    return _.flatten(this.getSections(mode));
};

methods.getSections = function(mode) {
    return this.templates.map(function(t) {
        return t.$parent.format(t.organize(mode), mode);
    });
};

/**
 * @public
 * @param mode 'pretty'|anything else
 * @param {Boolean} withCategory specify whether to print together Category info e.g. A, B ...
 * @returns {string}
 */
methods.print = function(mode, withCategory) {
    return this.getRows(mode).map(function(row) {
        return withCategory ? row.categoryId + row.rowContent : row.rowContent;
    }).join('\n');
};

/**
 * Used when export to files
 * @returns {string}
 */
methods.output = function() {
    return this.getSections().map(function(section) {
        return section.reduce(function(prev, current) {
            return prev + current.rowContent + '\n';
        }, '');
    }).join('\n\n');
};

/**
 * Get Option list for prompt choices array
 * @returns {Array}
 */
methods.optionList = function() {
    return this.getRows('pretty').map(function(row) {
        return {name: row.categoryId + row.rowContent, value: row.rowIndex};
    });
};

/**
 * Get fields from a row
 * @param {String} key customized key
 * @returns {String}
 */
methods.getFieldOptions = function(key) {
    var rowIndex = parseUniqueKey(key).index;
    return this.getTemplateByKey(key).getFields(rowIndex).map(function(field) {
        field.name = field.name.trim();
        field.name = (field.name.length === 0 ?  '(!this field is empty)' : field.name);
        return field;
    });
};

/**
 * Search the right template from `this.templates` array with a key
 * @param {String} key customized key
 * @returns {*}
 */
methods.getTemplateByKey = function(key) {
    return _.first(this.templates.filter(function(t) {
        return t.id === parseUniqueKey(key).id;
    }));
};

/**
 * Search the right template from `this.templates` array with category id like `A`, `B`
 * @param key
 * @returns {*}
 */
methods.getTemplateByCategory = function(key) {
    return _.first(this.templates.filter(function(t) {
        return t.categoryId === key;
    }));
};

/**
 * update action
 * @param key           customize key
 * @param fieldIndex    The field index
 * @param v             value to update
 */
methods.update = function(key, fieldIndex, v) {
    var rowIndex = parseUniqueKey(key).index,
        template = this.getTemplateByKey(key),
        regex = /\{&}/;

    if (regex.test(v)) {
        v = v.replace(regex, template.getField(rowIndex, fieldIndex).value);
    }

    template.update(rowIndex, fieldIndex, v);
};

/**
 * insert action, handle multiple insert by receive a counter
 * @param key       customized key
 * @param content   input content
 * @param counter   counter
 */
methods.insert = function(key, content, counter) {
    counter = counter || 1; // counter for handling multiple insert
    var rowIndex = parseUniqueKey(key).index;
    this.getTemplateByKey(key).insert(rowIndex + counter, content, counter);
};

/**
 * append action, like insert without counter, insert always at end
 * @param key       customized key
 * @param content   input content
 */
methods.append = function(key, content) {
    this.getTemplateByKey(key).append(content);
};

/**
 * delete action, delete an record
 * @param key customized key
 */
methods['delete'] = function(key) {
    var rowIndex = parseUniqueKey(key).index;
    this.getTemplateByKey(key)['delete'](rowIndex);
};

methods.isCommandValid = function(cmd) {
    var cmd = new Command(cmd);
    return cmd.validate(cmd);
};

methods.command = function(cmd) {
    var command = new Command(cmd);
    var template = this.getTemplateByCategory(command.category);

    template[command.command].apply(template, command.getArguments());
};

module.exports = methods;
