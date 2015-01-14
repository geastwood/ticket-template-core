var util        = require('../util');
var chalk       = require('chalk');
var _           = require('lodash');
var definition  = require('./definition');

/**
 * @param data  data
 * @param id    identification for the template
 * @constructor
 */
var Template = function(code, data, id) {
    this.id = [code, id].join('-');
    this.categoryId = String.fromCharCode(65 + Number(id));
    this.sectionData = data || [];
};

/**
 * Inject more data to the `data` structure
 *
 * @param mode
 * @returns {{id: (string|*), shortCode: *, type: *, categoryId: (string|*), data: *}}
 */
Template.prototype.organize = function(mode) {

    var pad = util.pad(),
        rowIndex = 0,
        that = this,
        rowData = null,
        counter = 0;

    rowData = this.sectionData.data.map(function(row) {
        var fieldCount = row.fields.length;
        return {
            role: row.role,
            rowIndex: [that.id, rowIndex++].join('-'),
            ifs: (row.role === 'header') ? '||' : '|',
            fieldCount: fieldCount,
            fields: row.fields.map(function(field, i) {
                var config = that.columnDefinitions[i],
                    align = row.role === 'header' ? 'center' : config.pad,
                    padMode = row.role === 'header' ? 'pad' : config.mode,
                    rst = {},
                    fieldValue = field.value;

                // if auto increment column
                if (that.autoIncrement.on === true && i === that.autoIncrement.index && row.role !== 'header') {
                    counter += 1;
                    fieldValue = '' + counter;
                    rst.autoIncement = true;
                }

                if (mode === 'pretty') {
                    rst.value = pad[padMode](fieldValue, config.strLength, align, config.ellip);
                } else {
                    rst.value = fieldValue;
                }

                return rst;
            })
        };
    });

    return {
        id: that.id,
        shortCode: that.code,
        type: that.name,
        categoryId: that.categoryId,
        data: rowData
    };
};

Template.prototype.getField = function(rowIndex, fieldIndex) {
    return this.sectionData.data[rowIndex].fields[fieldIndex];
};

Template.prototype.getFields = function(rowIndex) {
    var that = this;
    return this.sectionData.data[rowIndex].fields.map(function(field, index) {
        return {name: field.value, value: index};
    }).filter(function(field, index) { // filter out to auto increment column
        if (that.autoIncrement.on && index === that.autoIncrement.index) {
            return false;
        }
        return true;
    });
};

Template.prototype.update = function(rowIndex, fieldIndex, v) {
    this.sectionData.data[rowIndex].fields.forEach(function(field, index) {
        if (index === fieldIndex) {
            field.value = v;
        }
    });
};

Template.prototype.insert = function(rowIndex, content) {
    this.sectionData.data.splice(rowIndex, 0, Template.buildRow(content));
};

Template.prototype.append = function(content) {
    this.sectionData.data.push(Template.buildRow(content));
};

Template.prototype['delete'] = function(rowIndex) {
    this.sectionData.data.splice(rowIndex, 1);
};

Template.prototype.finish = function(range) {
    var check = range === 'all' ?
        function(v, i) {
            return i !== 0;
        } :
        function(v, i) {
            return _.contains(range, i);
        };
    if (this.checkColumn > 0) {
        this.sectionData.data.filter(check).filter(function(row) {
            row.fields[this.checkColumn - 1].value = '(/)';
        }.bind(this));
    }
};

Template.prototype.comment = function(range, comment) {
    var check = range === 'all' ?
        function(v, i) {
            console.log(v);
            return i !== 0;
        } :
        function(v, i) {
            return _.contains(range, i);
        };
    if (this.commentColumn > 0) {
        this.sectionData.data.filter(check).filter(function(row) {
            row.fields[this.commentColumn - 1].value = comment;
        }.bind(this));
    }
};

/**
 * build row structure from string content
 *
 * @param content
 * @returns {{role: string, fields: Array}}
 */
Template.buildRow = function(content) {
    var fields;

    fields = content.split('|').map(function(field) {
        var v = field.trim();
        return {
            value: _.isEmpty(v) ? ' ' : v
        };
    });

    return {
        role: 'row',
        fields: fields
    };
};

/**
 * @static format json
 */
Template.format = function(section, mode) {
    var rst = [], categoryId = section.categoryId;

    if (mode === 'pretty') {
        categoryId = chalk.yellow.bold(categoryId);
    }

    section.data.forEach(function(row) {
        var ifs = '|', rowStr;

        if (mode !== 'pretty') {
            ifs = row.role === 'header' ? '||' : '|';
        }

        rowStr = row.fields.reduce(function(prev, current) {
            var v = current.value;
            if (mode === 'pretty') {
                v = (row.role === 'header') ? chalk.yellow.underline.bold(current.value) : current.value;
            }
            return prev + v + ifs;
        }, ifs);

        rst.push({
            rowIndex: row.rowIndex,
            rowContent: rowStr,
            categoryId: categoryId
        });
    });

    return rst;
};

Template.create = function(type, data, id) {
    var json = definition;
    var def = _.first(json.definitions.filter(function(def) {
        return def.name === type;
    }));
    var instance = new Template(def.code, data, id);

    instance.name = def.name;
    instance.code = def.code;
    instance.commentColumn = def.columns.reduce(function(init, curr, i) {
        return curr.isComment ? i + 1 : init;
    }, null);
    instance.autoIncrement = def.columns.reduce(function(init, curr, i) {
        return curr.autoIncrement ? {on: true, index: i} : init;
    }, null) || {on: false};
    instance.columnDefinitions = def.columns.map(function(column) {
        return {
            mode: 'pad',
            strLength: column.length,
            pad: column.pad,
            ellip: column.ellip || true
        };
    });
    instance.checkColumn = def.columns.reduce(function(init, curr, i) {
        return curr.isCheckColumn ? i + 1 : init;
    }, null);
    instance.$parent = Template;
    return instance;
};

module.exports = Template;
