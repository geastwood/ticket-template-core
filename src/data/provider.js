var _ = require('lodash');
var fs = require('fs');
var parser = require('../parser');

var providerFactory = {
    local: function(filepath) {
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
    jira: function(opts) {
        var user = [opts.user, ':', user.password].join('');
        return {
            load: function(fn) {
                var child, data = '', that = this;

                child = require('child_process').spawn('curl', [
                    '-u', user, '-X', 'GET', '-H', 'Content-Type: application/json',
                    'http://jira.muc.intelliad.de/rest/api/2/search?jql=key=' + opts.id
                ]);
                child.stdout.on('data', function(chunk) {
                    data += chunk;
                });
                child.stdout.on('end', function() {
                    fn(that.getDescription(data));
                });
            },
            getDescription: function(data) {
                var json = JSON.parse(data);
                return parser(json.issues[0].fields.description, 'jira');
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
