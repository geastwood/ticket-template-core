var util = require('./util');
var chalk = require('chalk');

// TODO move to definition
var matrix = {
    '4': [
        {mode: 'pad', strLength: 3, align: 'left', ellip: false},
        {mode: 'pad', strLength: 80, align: 'left', ellip: true},
        {mode: 'pad', strLength: 5, align: 'center', ellip: false},
        {mode: 'pad', strLength: 47, align: 'left', ellip: true}
    ],
    '3': [
        {mode: 'pad', strLength: 3, align: 'left', ellip: false},
        {mode: 'pad', strLength: 86, align: 'left', ellip: true},
        {mode: 'pad', strLength: 47, align: 'left', ellip: true}
    ],
    '1': [{mode: 'pad', strLength: 138, align: 'left', ellip: true}]
};

var print = function(sections, mode) {

    var rst = [];

    rst = sections.map(function(section) {
        var rst = [];

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
            rst.push(rowStr);
        });

        return rst;
    });

    rst = rst.map(function(section) {
        return section.join('\n');
    }).join('\n\n');

    return rst;
};

var format = function(data, mode) {
    var rst,
        pad = util.pad();

    rst = data.sections.map(function(section) {
        return {
            data: section.data.map(function(row) {
                var fieldCount = row.fields.length;
                return {
                    role: row.role,
                    ifs: (row.role === 'header') ? '||' : '|',
                    fieldCount: fieldCount,
                    fields: row.fields.map(function(field, i, arr) {
                        var config = matrix[fieldCount][i],
                            align = row.role === 'header' ? 'center' : config.align,
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
            })
        };
    });

    return rst;
};

var generate = function(data, mode) {
    var borderPad = util.pad('=');
    if (mode === 'pretty') {
        return chalk.blue(borderPad.pad('', 140)) + '\n' +
               print(format(data, 'pretty'), 'pretty') + '\n' +
               chalk.blue(borderPad.pad('', 140));
    }
    return print(format(data));
};

// @api
module.exports.generate = generate;

// debug
// var content = require('fs').readFile(__dirname + '/../log', 'utf8', function(err, data) {
//     var json = JSON.parse(data);
//     console.log(generate(json, 'pretty'));
//     // require('fs').writeFileSync(__dirname + '/../log1', JSON.stringify(format(json, 'padtable'), null, 4));
// });
