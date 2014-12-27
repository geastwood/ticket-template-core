var config = require('../src/config');

exports.getIFS = function(test){
    test.ok(config().getIFS, "has `getIFS` function");
    test.equal(config().getIFS('header'), '||', 'if opt === header return `||`');
    test.equal(config().getIFS(), '|', 'if nothing is passed, return `|`');
    test.equal(config().getIFS('other'), '|', 'if something else is passed, return `|`');
    test.done();
};
