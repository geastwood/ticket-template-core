var _ = require('lodash');
var fs = require('fs');

var providerFactory = {
    local: function(id) {
        var filepath = __dirname + '/../../log'; // todo delete
        return {
            load: function(fn) {
                fs.readFile(filepath, 'utf8', function(err, data) {
                    if (err) {
                        throw err;
                    }
                    fn(data);
                });
            }
        };
    },
    jira: function(id) {
        return {
            load: function(fn) {
                var child;
                child = require('child_process').spawn('curl', [
                    '-u', 'fliu:E4NTUyL8', '-X', 'GET', '-H', 'Content-Type: application/json',
                    'http://jira.muc.intelliad.de/rest/api/2/search?jql=key=' + 'FR-5452'
                ]);
            }
        };
    }
};

/**
 * @param {String} type local|jira
 */
module.exports.create = function(type) {
    var args = _.rest(arguments);
    if (!_.contains(['local', 'jira'], type)) {
        throw 'unsupported type: "' + type + '"';
    }
    return providerFactory[type].apply(providerFactory, args);
};
