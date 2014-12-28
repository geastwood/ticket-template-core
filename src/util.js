var padding = function(deli) {

    deli = deli || ' ';

    var pad = function(count) {
        return Array(count < 0 ? 1 : count + 1).join(deli);
    };

    return {
        front: function(str, length) {
            return pad(length - str.length) + str;
        },
        end: function(str, length, guard) {
            if (guard && str.length - length > 0) {
                str = str.substring(0, length - 3) + '...';
            }
            return str + pad(length - str.length);
        },
        wrap: function(str, length) {
            var part, spaceIndex, rst = [];
            if (length >= str.length) {
                return str + pad(length - str.length);
            }

            do {
                spaceIndex = str.lastIndexOf(deli, length);
                part = this.end(str.substring(0, spaceIndex), length);
                str = str.substring(spaceIndex);
                rst.push(part);
            } while (str.length > length && spaceIndex != -1);

            return rst.join('\n');
        }
    };
};

module.exports = {
    padding: padding
};
