var Q = require('q');
var _ = require('lodash');

var Manager = function(dataProvider) {
    this.dataProvider = dataProvider;
};

Manager.prototype.load = function() {
    var defer = Q.defer();
    this.dataProvider.load(function(data) {
        defer.resolve(data);
    });
    this.dataPromise = defer.promise;
};

Manager.prototype.getRawData = function() {

    if (!this.dataPromise) {
        this.load();
    }

    return this.dataPromise.then(function(data) {
        return JSON.parse(data);
    });
};

Manager.prototype.getData = function() {
    return this.getRawData().then(function(json) {
        var config = require('./config'), rst, action = require('./action');

        rst = {
            templates: [],
        };

        json.sections.forEach(function(section) {
            var type = config().guessDefinition(section),
                Template = require('./templates/' + type);

            rst.templates.push(new Template(section));
        });

        return _.extend(rst, action);
    });
};

module.exports = Manager;
