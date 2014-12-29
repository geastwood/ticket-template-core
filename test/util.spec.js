var util = require('../src/util');
var helper = {
    randomElement: function(obj, start) {
        start = start || 0;
        return Math.floor(Math.random() * (obj.length - start)) + start;
    },
    randomAt: function(obj, start) {
        return obj.charAt(this.randomElement(obj, start));
    }
};
module.exports.api = {
    'pad as api': function(test) {
        test.ok(util.pad, 'pad as api');
        test.done();
    },
    'isArray as api': function(test) {
        test.ok(util.isArray);
        test.done();
    }
};

module.exports.pad = {
    setUp: function(done) {
        this.padder1 = util.pad(' ');
        this.padder2 = util.pad('=');
        done();
    },
    'deliminator': function(test) {
        var rst1 = this.padder1.pad('\u0020', 5);
        var rst2 = this.padder2.pad('', 5);
        test.deepEqual(helper.randomAt(rst1), '\u0020');
        test.deepEqual(helper.randomAt(rst2), '=');
        test.done();
    },
    'empty string': function(test) {
        var rst = this.padder1.pad('', 50);
        test.deepEqual(helper.randomAt(rst), '\u0020');
        test.done();
    },
    align: function(test) {
        var alignLeft = this.padder1.pad('padding right', 50); // default pad 'right'
        var alignCenter = this.padder1.pad('padding center', 50, 'center');
        var alignRight = this.padder1.pad('padding right', 50, 'left');

        // test align left(pad right)
        for (var i = 0, l = 30; i < l; i ++) {
            test.deepEqual(helper.randomAt(alignLeft, 14), '\u0020');
        }

        // test align center(pad left and right)
        test.deepEqual(alignCenter.charAt(18), 'p');
        test.deepEqual(alignCenter.charAt(31), 'r');

        // test align right(pad left)
        test.deepEqual(alignRight.charAt(alignRight.length - 1), 't');

        test.done();
    }

};
