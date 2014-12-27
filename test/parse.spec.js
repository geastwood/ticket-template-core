var fs      = require('fs'),
    path    = require('path'),
    chalk   = require('chalk'),
    parse   = require('../src/parser');

module.exports = {
    setUp: function(done) {
        var that = this, file = path.join(__dirname, 'data/dummyTicket.txt');
        console.log(chalk.cyan('\u0009parsing "%s"'), file);
        fs.readFile(file, 'utf8', function(err, data) {
            that.data = parse(data);
            done();
        });
    },
    'parse basic': function(test) {
        test.ok(this.data, 'should return data');
        test.done();
    },
    'count of section': function(test) {
        var sections = this.data.sections;
        test.equal(sections.length, 3, 'parse result correct.');
        test.done();
    },
    // here test all not-template texts, they should be collected in to `rest` collection
    'rest': function(test) {
        var rest = this.data.rest;
        test.equal(rest.length, 4, 'count of `non-ticket-template` text is 4');
        test.done();
    }
};
