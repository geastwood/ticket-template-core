var Q = require('q');
var _ = require('lodash');

/**
 * @constructor
 * @param {Object} dataProvider must provide `load` method
 *
 * @return {this}
 */
var Manager = function(dataProvider) {
    this.dataProvider = dataProvider;
};

Manager.create = function(dataProvider) {
    return new Manager(dataProvider);
};

Manager.prototype.load = function() {
    var defer = Q.defer();
    this.dataProvider.load(function(data) {
        defer.resolve(data);
    });

    this.dataPromise = defer.promise;
};

/**
 * @return {Promise.thenable}
 */
Manager.prototype.getRawData = function() {

    if (!this.dataPromise) {
        this.load();
    }

    return this.dataPromise.then(function(data) {
        return JSON.parse(data);
    });
};

/**
 * @return {Promise.thenable}
 */
Manager.prototype.getData = function() {
    return this.getRawData().then(function(json) {
        var config = require('../config');
        var mixinMethods = require('./methods');
        var rst;
        var counter = 0;

        rst = {
            templates: [],
        };
        json.sections.forEach(function(section) {
            var type = config().guessDefinition(section),
                Template = require('../templates/' + type);

            rst.templates.push(new Template(section, counter++));
        });

        return _.extend(rst, mixinMethods);
    });
};

module.exports = Manager;
