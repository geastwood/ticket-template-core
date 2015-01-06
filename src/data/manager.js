var Q = require('q');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var parser = require('../parser');

/**
 * @constructor
 * @param {Object} dataProvider must provide `load` method
 *
 * @return {this}
 */
var Manager = function(dataProvider, parseMode) {
    this.dataProvider = dataProvider;
    this.parseMode = parseMode || 'normal';
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
Manager.prototype.getRawData = function() {

    if (!this.dataPromise) {
        this.load();
    }

    return this.dataPromise.then(function(data) {
        return data;
    });
};

Manager.prototype.parse = function(data) {
    return parser(data, this.parseMode);
};

/**
 * @return {Promise.thenable}
 */
Manager.prototype.getData = function() {
    var that = this;

    return this.getRawData().then(function(data) {
        var config = require('../config'),
            mixinMethods = require('./methods'),
            counter = 0,
            rst = {
                templates: [],
            };

        data = that.parse(data);

        data.sections.forEach(function(section) {
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
Manager.create = function(dataProvider, parseMode) {
    return new Manager(dataProvider, parseMode);
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
