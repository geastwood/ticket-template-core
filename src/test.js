var inquirer = require('inquirer');
var Manager = require('./data/manager');
var provider = require('./data/provider');

var m = Manager.create(provider.create('local', 'id'));

var rowSession = function session(data, templateAnswers, fn) {
    inquirer.prompt([{
        name: 'action',
        type: 'expand',
        choices: [{
            key: 'u', name: 'Update', value: 'update'
        }, {
            key: 'i', name: 'Insert', value: 'insert'
        }, {
            key: 'a', name: 'Append', value: 'append'
        }, {
            key: 'd', name: 'Delete', value: 'delete'
        }, {
            key: 'x', name: 'Exit', value: 'exit'
        }],
        message: 'Please select an action for this record',
    }, {
        name: 'insert',
        type: 'input',
        message: 'Please specify record',
        when: function(answers) {
            return answers.action === 'insert';
        }
    }, {
        name: 'append',
        type: 'input',
        message: 'Please specify record',
        when: function(answers) {
            return answers.action === 'append';
        }
    }, {
        name: 'delete',
        type: 'confirm',
        message: 'Sure to delete?',
        when: function(answers) {
            return answers.action === 'delete';
        },
        'default': false
    }, {
        name: 'column',
        type: 'list',
        choices: data.getFieldOptions(templateAnswers.row),
        message: 'Please select column to update',
        when: function(answers) {
            return answers.action === 'update';
        }
    }, {
        name: 'updatedValue', // TODO add validate
        type: 'input',
        message: 'Please give the replace value',
        when: function(answers) {
            return typeof answers.column !== 'undefined';
        }
    }], function(answers) {
        if (answers.action === 'exit') {
            fn({exit: true});
        } else { // if not `exit` repeat
            if (answers.action === 'update') {
                data.update(templateAnswers.row, answers.column, answers.updatedValue);
            } else if (answers.action === 'insert') {
                data.insert(templateAnswers.row, answers.insert);
            } else if (answers.action === 'append') {
                data.append(templateAnswers.row, answers.append);
            } else if (answers.action === 'delete') {
                // jshint expr: true
                answers['delete'] && data['delete'](templateAnswers.row);
            }
            if (answers.action === 'delete') {
                fn({exit: true});
            } else {
                session(data, templateAnswers, fn);
            }
        }
    });
};

var recordSession = function session(data) {

    inquirer.prompt([{
        name: 'templateAction',
        type: 'expand',
        choices: [{
            key: 'e', name: 'Edit', value: 'edit'
        }, {
            key: 'p', name: 'Print', value: 'print'
        }, {
            key: 'x', name: 'Exit', value: 'exit'
        }],
        message: 'Please select action for this template',
    }, {
        name: 'row',
        type: 'list',
        choices: data.optionList(),
        message: 'Please select record to edit',
        when: function(answers) {
            return answers.templateAction === 'edit';
        }
    }], function(answers) {
        if (answers.templateAction === 'edit') {
            rowSession(data, answers, function(rst) {
                if (rst.exit) {
                    session(data);
                }
            });
        } else if (answers.templateAction === 'print') {
            console.log(data.print('pretty'));
            session(data);
        } else if (answers.templateAction === 'exit') {
            console.log('Exit triggered');
        }
    });
};

m.getData().then(function(data) {
    recordSession(data);
});

// debug
// require('fs').writeFileSync(__dirname + '/../log1', JSON.stringify(format(json, 'padtable'), null, 4));

