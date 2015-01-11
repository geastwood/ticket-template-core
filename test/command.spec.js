var Command = require('../src/command');
var _ = require('lodash');

module.exports = {
    'only two commands supported': function(test) {
        test.ok(Command.availableCmds.length === 2, 'only two commands available')
        test.ok(Command.availableCmds[0] === 'finish', 'finish command');
        test.ok(Command.availableCmds[1] === 'comment', 'comment command');
        test.done();
    },
    'test command': function(test) {
        var cmd = new Command('finish A 1..3');
        test.ok(cmd.command === 'finish');
        test.ok(cmd.validate() === true);
        test.done();
    },
    'test category': function(test) {
        var cmd = new Command('comment B 1');
        test.ok(cmd.command === 'comment');
        test.ok(cmd.validate() === true);
        test.done();
    }
};

module.exports.range = {
    setUp: function(done) {
        this.cmd1 = new Command('finish A all');
        this.cmd2 = new Command('finish B 1,3,4');
        this.cmd3 = new Command('finish B 1..3');
        this.cmd4 = new Command('finish B 2..5');
        this.cmd5 = new Command('finish B 1,3,4,5,6');
        this.cmd6 = new Command('finish B 1,3,4,5,4,1');
        this.cmd7 = new Command('finish B 4');
        done();
    },
    'all': function(test) {
        var range = this.cmd1.range;
        test.equal(range, 'all');
        test.done();
    },
    'single value': function(test) {
        var range = this.cmd7.range;
        test.equal(_.reduce(range, function(prev, curr) {
            return prev + curr;
        }), 4);
        test.done();
    },
    'comma based': function(test) {
        var range = this.cmd2.range;
        test.equal(_.reduce(range, function(prev, curr) {
            return prev + curr;
        }), 8);
        test.done();
    },
    'comma based 1': function(test) {
        var range = this.cmd5.range;
        test.equal(_.reduce(range, function(prev, curr) {
            return prev + curr;
        }), 19);
        test.done();
    },
    'comma based 2': function(test) {
        var range = this.cmd6.range;
        test.equal(_.reduce(range, function(prev, curr) {
            return prev + curr;
        }), 13);
        test.done();
    },
    'short hand array': function(test) {
        var range = this.cmd3.range;
        test.equal(_.reduce(range, function(prev, curr) {
            return prev + curr;
        }), 6);
        test.done();
    },
    'short hand array 1': function(test) {
        var range = this.cmd4.range;
        test.equal(_.reduce(range, function(prev, curr) {
            return prev + curr;
        }), 14);
        test.done();
    }
};
