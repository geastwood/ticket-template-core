var util = require('../util');
var chalk = require('chalk');

var Template = function(data, id) {
    this.id = [this.code, id].join('-');
    this.sectionData = data || [];
};

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
                if (that.autoIncrement === true && i === 0 && row.role !== 'header') {
                    counter += 1;
                    fieldValue = '' + counter;
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
        rowData: rowData
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
        if (that.autoIncrement && index === 0) {
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

/**
 * @static build row from text
 */
Template.buildRow = function(content) {
    var fields;

    fields = content.split('|').map(function(field) {
        return {
            value: field.trim()
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
    var rst = [];

    section.rowData.forEach(function(row) {
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

        rst.push({rowIndex: row.rowIndex, rowContent: rowStr});
    });

    return rst;
};

module.exports = Template;
