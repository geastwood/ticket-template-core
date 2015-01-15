var Template = require('../src/templates/Base');

module.exports.bulletin = {
    setUp: function(done) {
        this.bulletin = Template.create('bulletin');
        done();
    },
    code: function(test) {
        test.equal(this.bulletin.code, 'b');
        test.done();
    },
    commentColumn: function(test) {
        test.equal(this.bulletin.commentColumn, 3);
        test.done();
    },
    autoIncrement: function(test) {
        test.equal(this.bulletin.autoIncrement.on, true);
        test.equal(this.bulletin.autoIncrement.index, 0);
        test.done();
    },
    '$parent': function(test) {
        test.deepEqual(this.bulletin.$parent, Template);
        test.done();
    }
};
module.exports.checklist = {
    setUp: function(done) {
        this.checklist = Template.create('checklist');
        done();
    },
    code: function(test) {
        test.equal(this.checklist.code, 'c');
        test.done();
    },
    commentColumn: function(test) {
        test.equal(this.checklist.commentColumn, 4);
        test.done();
    }
};
