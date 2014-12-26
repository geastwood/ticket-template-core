var config      = require('../config'),
    headerIFS   = config().getIFS('header'),
    rowIFS      = config().getIFS('row');

/**
 * @public
 */
var parse = function(data) {

    var rst = {
        sections: data.split('\n\n')
    };

    rst.sections = rst.sections.map(function(section) {
        return {
            data: parseSection(section)
        };
    });

    return rst;
};

/**
 * @private
 */
var parseSection = function(section) {
    var rst = section.split('\n').filter(function(line) {
        return line.trim().length > 0;
    }).map(function(line) {
        var isHead = line.indexOf(headerIFS) >= 0;
        return {
            role: isHead ? 'header' : 'row',
            fields: line.split(isHead ? headerIFS : rowIFS).map(function(part) {
                return {value: part};
            }).filter(function(part) {
                return part.value.length > 0;
            })
        };
    });

    return rst;
};

/**
 * @api
 */
module.exports = parse;

// require('fs').readFile(require('path').join(__dirname, '../../data/dummyTicket.txt'), 'utf8', function(err, data) {
//     var text = JSON.stringify(parse(data), null, 4);
//     require('fs').writeFileSync(__dirname + '/../../data/dummyTicket.rst.json', text);
// });
