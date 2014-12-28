var util = require('./util');

var template = {
    table: function(data) {
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
    },
    log: function(data) {
    }
};

var generate = function(data) {
    var rst = data.filter(function(item) {
        return item.template.length > 0;
    }).map(function(data) {
        return data.template.join('\n');
    }).join('\n\n');

    return rst;
};

var print = function(data) {

    var rst, padder = util.padding();
    rst = data.sections.map(function(section) {
        return {
            type: section.type,
            template: section.data.map(function(row) {
                var ifs = '|';
                // TODO
                return row.fields.reduce(function(prev, current, i, arr) {
                    var rst = current.value;
                    if (arr.length === 4 && i === 0) {
                        rst = padder.front(rst, 3);
                    }
                    if (arr.length ===4 && i === 1) {
                        rst = padder.end(rst, 60, true);
                    }
                    if (arr.length ===4 && i === 2) {
                        rst = padder.end(rst, 5);
                    }
                    if (arr.length ===4 && i === 3) {
                        rst = padder.wrap(rst, 60);
                    }
                    if (arr.length ===1 && i === 0) {
                        rst = padder.wrap(rst, 40);
                    }
                    return prev + rst + ifs;
                }, ifs);
            })
        };
    });

    console.log(generate(rst));
    return rst;

};

// @api
module.exports.generate = generate;
module.exports.print = print;

// debug
var content = require('fs').readFile(__dirname + '/../log', 'utf8', function(err, data) {
    var json = JSON.parse(data);
    print(json);
    // console.log(generate(template.table(json)));
});
