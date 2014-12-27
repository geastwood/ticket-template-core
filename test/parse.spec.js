var fs = require('fs'),
    path = require('path'),
    parse = require('../src/parser');

module.exports = {
    setUp: function(done) {
        var that = this;
        fs.readFile(path.join(__dirname, 'data/dummyTicket.txt'), 'utf8', function(err, data) {
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
        test.equal(sections.length, 3, 'parse correct.');
        test.done();
    }
};
