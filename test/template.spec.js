var Template = require('../src/templates/Base');

module.exports.bulletin = {
    setUp: function(done) {
        this.bulletin = Template.create('bulletin');
        done();
    },
    code: function(test) {
        this.bulletin.then(function(instance) {
            test.equal(instance.code, 'b');
            test.done();
        });
    },
    columnCount: function(test) {
        this.bulletin.then(function(instance) {
            test.equal(instance.commentColumn, 3);
            test.done();
        });
    },
    autoIncrement: function(test) {
        this.bulletin.then(function(instance) {
            test.equal(instance.autoIncrement.on, true);
            test.equal(instance.autoIncrement.index, 0);
            test.done();
        });
    },
    '$parent': function(test) {
        this.bulletin.then(function(instance) {
            test.deepEqual(instance.$parent, Template);
            test.done();
        });
    }
};
module.exports.checklist = {
    setUp: function(done) {
        this.checklist = Template.create('checklist');
        done();
    },
    code: function(test) {
        this.checklist.then(function(instance) {
            test.equal(instance.code, 'c');
            test.done();
        });
    },
    columnCount: function(test) {
        this.checklist.then(function(instance) {
            test.equal(instance.commentColumn, 4);
            test.done();
        });
    }
};
