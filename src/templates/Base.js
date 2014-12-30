var util = require('../util');
var Template = function() {};
var chalk = require('chalk');

Template.prototype.print = function() {
    console.log('print');
};

Template.prototype.generate = function() {
    console.log('generate');
};

Template.prototype.organize = function(mode) {
    var pad = util.pad(),
        rowIndex = 0,
        that = this,
        rowData = null;

    rowData = this.sectionData.data.map(function(row) {
        var fieldCount = row.fields.length;
        return {
            role: row.role,
            rowIndex: that.code + rowIndex++,
            ifs: (row.role === 'header') ? '||' : '|',
            fieldCount: fieldCount,
            fields: row.fields.map(function(field, i) {
                var config = that.columnDefinitions[i],
                align = row.role === 'header' ? 'center' : config.pad,
                padMode = row.role === 'header' ? 'pad' : config.mode,
                rst = {};

                if (mode === 'pretty') {
                    rst.value = pad[padMode](field.value, config.strLength, align, config.ellip);
                } else {
                    rst.value = field.value;
                }

                return rst;
            })
        };
    });

    return {
        rowData: rowData
    };
};

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
