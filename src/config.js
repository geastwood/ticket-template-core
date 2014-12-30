var definition = require('../definition/template.json');
var api;

api = module.exports = function() {
    return {
        // get separator
        getIFS: function(opts) {
            return opts === 'header' ? "||" : "|";
        },
        // guess definition by column count
        guessDefinition: function(section) {
            var sectionSize = section.data[0].fields.length;
            var def = 'unknown';
            definition.definitions.some(function(item) {
                if (item.columns.length === sectionSize) {
                    def = item.name;
                    return true;
                }
            });

            return def;
        }
    };
};
