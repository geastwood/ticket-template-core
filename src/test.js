var inquirer = require('inquirer');
var Manager = require('./manager');
var fs = require('fs');

var fileData = function() {

    return {
        load: function(fn) {
            fs.readFile(__dirname + '/../log', 'utf8', function(err, data) {
                fn(data);
            });
        }
    };
};

var m = new Manager(fileData());

m.getData().then(function(data) {
    inquirer.prompt([{
        name: 'myName',
        type: 'list',
        choices: ['fei', 'li', 'f', 'foo'],
        message: 'pls select',
        'default': 'fei'
    }, {
        name: 'myCheckbox',
        type: 'list',
        choices: data.optionList('pretty'),
        message: function(answers) {
            return 'which lang do you like the most' + answers.myName + '?';
        },
        when: function(answers) {
            return true;
        }
    }, {
        name: 'myInput',
        type: 'input',
        message: 'input test',
        default: 'this is a default string'
    }], function(answers) {
        console.log(answers);
    });
});

// debug
// require('fs').writeFileSync(__dirname + '/../log1', JSON.stringify(format(json, 'padtable'), null, 4));
