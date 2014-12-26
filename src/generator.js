var format = function(data) {
    var rst;
    rst = data.sections.map(function(section) {
        return {
            type: section.type,
            template: (section.data || []).map(function(row) {
                var ifs = row.role === 'header' ? '||' : '|';
                return row.fields.reduce(function(prev, current) {
                    return prev + current.value + ifs;
                }, ifs);
            })
        };
    });
    return rst;
};

var generate = function(data) {
    var rst = data.filter(function(item) {
        return item.template.length > 0;
    }).map(function(data) {
        return data.template.join('\n');
    }).join('\n\n');

    return rst;
};

// @api
module.exports = generate;

// debug
// var content = require('fs').readFile(__dirname + '/../../data/dummyTicket.rst.json', 'utf8', function(err, data) {
//     var json = JSON.parse(data);
//     console.log(generate(format(json)));
// });
