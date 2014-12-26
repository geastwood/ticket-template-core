var api;

api = module.exports = function() {
    return {
        // get separator
        getIFS: function(opts) {
            return opts === 'header' ? "||" : "|";
        }
    };
};
