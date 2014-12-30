var util = require('./util');
var chalk = require('chalk');
var inquirer = require('inquirer');

// TODO move to definition
var matrix = {
    '4': [
        {mode: 'pad', strLength: 3, pad: 'left', ellip: false},
        {mode: 'pad', strLength: 80, pad: 'right', ellip: true},
        {mode: 'pad', strLength: 5, pad: 'center', ellip: false},
        {mode: 'pad', strLength: 47, pad: 'right', ellip: true}
    ],
    '3': [
        {mode: 'pad', strLength: 3, pad: 'left', ellip: false},
        {mode: 'pad', strLength: 86, pad: 'right', ellip: true},
        {mode: 'pad', strLength: 47, pad: 'right', ellip: true}
    ],
    '1': [{mode: 'pad', strLength: 138, pad: 'right', ellip: true}]
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

            rst.push({rowIndex: row.rowIndex, rowContent: rowStr});
        });

        return rst;
    });

    return rst;
};

var format = function(data, mode) {
    var rst,
        pad = util.pad(), rowIndex = 0;

    rst = data.sections.map(function(section) {
        return {
            data: section.data.map(function(row) {
                var fieldCount = row.fields.length;
                return {
                    role: row.role,
                    rowIndex: rowIndex++,
                    ifs: (row.role === 'header') ? '||' : '|',
                    fieldCount: fieldCount,
                    fields: row.fields.map(function(field, i, arr) {
                        var config = matrix[fieldCount][i],
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
            })
        };
    });

    return rst;
};

var generator = function(outputType) {

    outputType = outputType || 'line';

    var type = {
        line: function(data) {
            return data.map(function(section) {
                return section.map(function(line) {
                    return line.rowContent;
                }).join('\n');
            }).join('\n\n');
        },
        choice: function(data) {
            var rst = [];
            data.forEach(function(section) {
                return section.forEach(function(line) {
                    rst.push({name: line.rowContent, value: line.rowIndex});
                });
            });
            return rst;
        }
    };
    return {
        jira: function(data) {
            return type.line(print(format(data)));
        },
        pretty: function(data) {
            var borderPad = util.pad('=');
            return type[outputType](print(format(data, 'pretty'), 'pretty'));
        }
    };
};

// @api
module.exports.generator = generator;

// debug
var content = require('fs').readFile(__dirname + '/../log', 'utf8', function(err, data) {
    var json = JSON.parse(data);
    // console.log(generator('choice').pretty(json));
    inquirer.prompt([{
        name: 'myName',
        type: 'list',
        choices: ['fei', 'li', 'f', 'foo'],
        message: 'pls select',
        'default': 'fei'
    }, {
        name: 'myCheckbox',
        type: 'list',
        choices: generator('choice').pretty(json),
        message: function(answers) {
            return 'which lang do you like the most' + answers.myName + '?';
        },
        when: function(answers) {
            return answers.myName === 'fei';
        }
    }, {
        name: 'myInput',
        type: 'input',
        message: 'input test',
        default: 'this is a default string'
    }], function(answers) {
        console.log(answers);
    });
    // require('fs').writeFileSync(__dirname + '/../log1', JSON.stringify(format(json, 'padtable'), null, 4));
});
