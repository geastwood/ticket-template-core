var _ = require('lodash');
var fs = require('fs');

var providerFactory = {
    // immediately resolve
    direct: function(data) {
        return {
            load: function(fn) {
                fn(data);
            }
        };
    },
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
        var user = [opts.user, ':', opts.password].join('');
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
                return _.first(json.issues).fields.description;
            }
        };
    }
};

/**
 * @param {String} type local|jira
 */
module.exports.create = function(type) {
    var args = _.rest(arguments);
    if (!_.contains(['local', 'jira', 'direct'], type)) {
        throw 'unsupported type: "' + type + '"';
    }
    return providerFactory[type].apply(providerFactory, args);
};
