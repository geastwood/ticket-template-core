// padding utility
var pad = function(deli) {

    deli = deli || ' ';

    var placeholder = function(count) {
        return Array(count < 0 ? 1 : count + 1).join(deli);
    };

    var align = function(str, length, align) {
        var leftSide,
            rightSide,
            diff = length - str.length;

        if (align === 'left') {
            return placeholder(diff) + str;
        } else if (align === 'right') {
            return str + placeholder(diff);
        } else { // center

            if (length <= str.length) {
                return str;
            }
            leftSide = Math.floor(diff / 2);
            rightSide = (diff % 2) === 1 ? leftSide + 1 : leftSide;
            return placeholder(leftSide) + str + placeholder(rightSide);
        }
    };

    var ellipsis = function(str, length) {

        if (length < 5) {
            throw '"length" cannot be less than 5';
        }

        if (str.length - length > 0) {
            str = str.substring(0, length - 3) + '...';
        }

        return str + placeholder(length - str.length);
    };

    return {
        pad: function(str, length, alignMode, guard) {
            alignMode = alignMode || 'right'; // [left|center|right]

            if (guard && alignMode === 'right') {
                str = ellipsis(str, length);
            }
            return align(str, length, alignMode);
        },
        wrap: function(str, length, alignMode) {
            var part,
                spaceIndex,
                rst = [];

            if (length >= str.length) {
                return str + placeholder(length - str.length);
            }

            do {
                spaceIndex = str.lastIndexOf(deli, length);
                part = this.pad(str.substring(0, spaceIndex), length, alignMode);
                str = str.substring(spaceIndex).trim();
                rst.push(part);
            } while (str.length > length && spaceIndex != -1);

            return rst;
        }
    };
};

module.exports = {
    pad: pad,
    isArray: function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
};
