var config      = require('./config'),
    headerIFS   = config().getIFS('header'),
    rowIFS      = config().getIFS('row');

/**
 * @public
 */
var parse = function(data, mode) {

    var linebreak = '\n\n', rst;

    if (mode === 'jira') {
        linebreak = '\r\n\r\n';
    }

    rst = {
        sections: data.split(linebreak),
        rest: []
    };

    rst.sections = rst.sections.filter(function(section) { // clean raw section
        return section.trim().length > 0;
    }).map(function(section) { // send to section parser to format
        return {
            data: parseSection(section.trim(), rst.rest, mode)
        };
    }).filter(function(section) {
        // section parse may return empty section
        // e.g. section is invalid, so emtpy is returned.
        return section.data.length > 0;
    });

    return rst;
};

/**
 * @private
 */
var parseSection = function(section, rest, mode) {
    var linebreak = '\n', rst;

    if (mode === 'jira') {
        linebreak = '\r\n';
    }

    rst = section.split(linebreak).filter(function(line) {
        // filter, pass if
        //  1) start with '|' or '||'
        //  2) non-empty
        line = line.trim();
        if (['|', '||'].indexOf(line.charAt(0)) < 0) {
            // remember the `non-template` line into `rest` collection
            rest.push(line);
            return false;
        }
        if (line.length === 0) {
            return false;
        }
        return true;
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
