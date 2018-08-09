let async = {};

var _toString = Object.prototype.toString;

var _isArray = Array.isArray || function (obj) {
    return _toString.call(obj) === '[object Array]';
};

function _once(fn) {
    var called = false;
    return function() {
        if (called) return;
        called = true;
        fn.apply(this, arguments);
    };
}

function noop() {}

function _baseSlice(arr, start) {
    start = start || 0;
    var index = -1;
    var length = arr.length;

    if (start) {
        length -= start;
        length = length < 0 ? 0 : length;
    }
    var result = Array(length);

    while (++index < length) {
        result[index] = arr[index + start];
    }
    return result;
}

function ensureAsync(fn) {
    return function (/*...args, callback*/) {
        var args = _baseSlice(arguments);
        var callback = args.pop();
        args.push(function () {
            var innerArgs = arguments;
            if (sync) {
                async.setImmediate(function () {
                    callback.apply(null, innerArgs);
                });
            } else {
                callback.apply(null, innerArgs);
            }
        });
        var sync = true;
        fn.apply(this, args);
        sync = false;
    };
}

async.waterfall = function (tasks, callback) {
    callback = _once(callback || noop);
    if (!_isArray(tasks)) {
        var err = new Error('First argument to waterfall must be an array of functions');
        return callback(err);
    }
    if (!tasks.length) {
        return callback();
    }
    function wrapIterator(iterator) {
        return function (err) {
            if (err) {
                callback.apply(null, arguments);
            }
            else {
                var args = _baseSlice(arguments, 1);
                var next = iterator.next();
                if (next) {
                    args.push(wrapIterator(next));
                }
                else {
                    args.push(callback);
                }
                ensureAsync(iterator).apply(null, args);
            }
        };
    }
    wrapIterator(async.iterator(tasks))();
};

export default async;