var Q = require('q');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');

/**
 * @constructor
 * @param {Object} dataProvider must provide `load` method
 *
 * @return {this}
 */
var Manager = function(dataProvider) {
    this.dataProvider = dataProvider;
};

/**
 * assign dataPromise to object
 */
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
Manager.prototype.getRawData = function(mode) {

    if (!this.dataPromise) {
        this.load();
    }

    return this.dataPromise.then(function(data) {
        // only convert parse string
        if (typeof data === 'string' && mode !== 'parse') {
            return JSON.parse(data);
        }
        return data;
    });
};

/**
 * @return {Promise.thenable}
 */
Manager.prototype.getData = function(mode) {

    return this.getRawData(mode).then(function(json) {
        var config = require('../config'),
            mixinMethods = require('./methods'),
            parser = null,
            counter = 0,
            rst = {
                templates: [],
            };

        if (mode === 'parse') {
            parser = require('../parser');
            json = parser(json);
        }

        json.sections.forEach(function(section) {
            var type = config().guessDefinition(section), Template;

            if (type === 'unknown') {
                throw 'cannot handle unknown template type';
            }

            Template = require('../templates/' + type);

            rst.templates.push(new Template(section, counter++));
        });

        return _.extend(rst, mixinMethods);
    });
};

/**
 * @static
 */
Manager.create = function(dataProvider) {
    return new Manager(dataProvider);
};

/**
 * @static
 */
Manager.getPresets = function() {
    var filepath = path.join(__dirname, '../../templates/');
    return {
        files: fs.readdirSync(filepath).map(_.identity),
        filepath: filepath
    };
};

module.exports = Manager;
