var _ = require('lodash');

/**
 * @param {String} cmd command like `finish A 1..3`
 * @constructor
 */
var Command = function (cmd) {
    this.cmd = cmd;
    this.parse();
};

Command.prototype.parse = function() {
    var parts = this.cmd.trim().split(/\s+/).filter(function(part) {
        return part.length > 0;
    });
    this.command = parts[0];
    this.category = parts[1];
    this.range = this.parseRange(parts[2]);

    // TODO, may think moving to subclass
    if (this.command === 'comment') {
        this.comment = parts.slice(3).join(' ') || 'not applicable';
    }
};

/**
 * Parse different kind of range
 *
 * Accept four kind of ranges
 *   1) all -> return 'all'
 *   2) single number -> return 1 element array, e.g. 1 -> [1]
 *   3) comma based -> return multiple elements array e.g. 1,3,5 -> [1, 3, 5]
 *   4) short-hand list -> return multiple elements array e.g. 1..4 -> [1, 2, 3, 4]
 *
 * @param   {String}    range  range like 1,3,4 1..6, all
 * @returns {Array|String}
 */
Command.prototype.parseRange = function(range) {
    var rst = [], rangeReg = /^\d\.{2,2}\d$/, rangeArr = [];
    if (/^\d$/.test(range)) {
        rst.push(Number(range));
    } else if (rangeReg.test(range)) {
        rangeArr = range.split('..').map(Number).sort();
        for (var i = _.first(rangeArr), len = _.last(rangeArr); i <= len; i++) {
            rst.push(i);
        }
    } else if (range.indexOf(',') >= 0) {
        rst = range.split(',').filter(function(v) {
            return v.trim().length > 0;
        }).filter(Number).map(function(n) {
            return parseInt(n, 10);
        });
    } else if (_.isString(range) && range === 'all') {
        return 'all';
    }

    // if array based, make unique and sort
    if (_.isArray(rst)) {
        rst = _.uniq(rst).sort();
    }

    return rst;
};

Command.prototype.validate = function() {
    var categoryReg = /^[A-Z]$/;
    if (!_.contains(Command.availableCmds, this.command)) {
        return 'Only "' + Command.availableCmds + '" is allowed.';
    }
    if (!categoryReg.test(this.category)) {
        return '"' + this.category + '" is invalid. Second parameter "Category" can only be one capital letter.';
    }
    if ((_.isArray(this.range) && this.range.length === 0) ||
        _.isString(this.range) && this.range !== 'all') {
        return 'The parsed range is not valid, either it products an empty array, or it\'s not "all".';
    }
    return true;
};

/**
 * since different command has different arguments, the must be an methods handling this.
 * there is currently only two comments, if more, consider make subclass
 * @returns {Array}
 */
Command.prototype.getArguments = function() {
    if (this.command === 'finish') {
        return [this.range];
    }

    // comment command
    return [this.range, this.comment];
};

Command.availableCmds = ['finish', 'comment'];

module.exports = Command;
