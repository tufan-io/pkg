"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var zlib_1 = require("zlib");
var multistream_1 = __importDefault(require("multistream"));
var assert_1 = __importDefault(require("assert"));
var child_process_1 = require("child_process");
var fs_1 = __importDefault(require("fs"));
var into_stream_1 = __importDefault(require("into-stream"));
var path_1 = __importDefault(require("path"));
var stream_meter_1 = __importDefault(require("stream-meter"));
var common_1 = require("./common");
var log_1 = require("./log");
var fabricator_1 = require("./fabricator");
var types_1 = require("./types");
var compress_type_1 = require("./compress_type");
function discoverPlaceholder(binaryBuffer, searchString, padder) {
    var placeholder = Buffer.from(searchString);
    var position = binaryBuffer.indexOf(placeholder);
    if (position === -1) {
        return { notFound: true };
    }
    return { position: position, size: placeholder.length, padder: padder };
}
function injectPlaceholder(fd, placeholder, value, cb) {
    if ('notFound' in placeholder) {
        assert_1.default(false, 'Placeholder for not found');
    }
    var position = placeholder.position, size = placeholder.size, padder = placeholder.padder;
    var stringValue = Buffer.from('');
    if (typeof value === 'number') {
        stringValue = Buffer.from(value.toString());
    }
    else if (typeof value === 'string') {
        stringValue = Buffer.from(value);
    }
    else {
        stringValue = value;
    }
    var padding = Buffer.from(padder.repeat(size - stringValue.length));
    stringValue = Buffer.concat([stringValue, padding]);
    fs_1.default.write(fd, stringValue, 0, stringValue.length, position, cb);
}
function discoverPlaceholders(binaryBuffer) {
    return {
        BAKERY: discoverPlaceholder(binaryBuffer, "\0" + '// BAKERY '.repeat(20), '\0'),
        PAYLOAD_POSITION: discoverPlaceholder(binaryBuffer, '// PAYLOAD_POSITION //', ' '),
        PAYLOAD_SIZE: discoverPlaceholder(binaryBuffer, '// PAYLOAD_SIZE //', ' '),
        PRELUDE_POSITION: discoverPlaceholder(binaryBuffer, '// PRELUDE_POSITION //', ' '),
        PRELUDE_SIZE: discoverPlaceholder(binaryBuffer, '// PRELUDE_SIZE //', ' '),
    };
}
function injectPlaceholders(fd, placeholders, values, cb) {
    injectPlaceholder(fd, placeholders.BAKERY, values.BAKERY, function (error) {
        if (error) {
            return cb(error);
        }
        injectPlaceholder(fd, placeholders.PAYLOAD_POSITION, values.PAYLOAD_POSITION, function (error2) {
            if (error2) {
                return cb(error2);
            }
            injectPlaceholder(fd, placeholders.PAYLOAD_SIZE, values.PAYLOAD_SIZE, function (error3) {
                if (error3) {
                    return cb(error3);
                }
                injectPlaceholder(fd, placeholders.PRELUDE_POSITION, values.PRELUDE_POSITION, function (error4) {
                    if (error4) {
                        return cb(error4);
                    }
                    injectPlaceholder(fd, placeholders.PRELUDE_SIZE, values.PRELUDE_SIZE, cb);
                });
            });
        });
    });
}
function makeBakeryValueFromBakes(bakes) {
    var parts = [];
    if (bakes.length) {
        for (var i = 0; i < bakes.length; i += 1) {
            parts.push(Buffer.from(bakes[i]));
            parts.push(Buffer.alloc(1));
        }
        parts.push(Buffer.alloc(1));
    }
    return Buffer.concat(parts);
}
function replaceDollarWise(s, sf, st) {
    return s.replace(sf, function () { return st; });
}
function makePreludeBufferFromPrelude(prelude) {
    return Buffer.from("(function(process, require, console, EXECPATH_FD, PAYLOAD_POSITION, PAYLOAD_SIZE) { " + prelude + "\n})" // dont remove \n
    );
}
function findPackageJson(nodeFile) {
    var dir = nodeFile;
    while (dir !== '/') {
        dir = path_1.default.dirname(dir);
        if (fs_1.default.existsSync(path_1.default.join(dir, 'package.json'))) {
            break;
        }
    }
    if (dir === '/') {
        throw new Error("package.json not found for \"" + nodeFile + "\"");
    }
    return dir;
}
function nativePrebuildInstall(target, nodeFile) {
    var prebuild = path_1.default.join(__dirname, '../node_modules/.bin/prebuild-install');
    var dir = findPackageJson(nodeFile);
    // parse the target node version from the binaryPath
    var nodeVersion = path_1.default.basename(target.binaryPath).split('-')[1];
    if (!/^v[0-9]+\.[0-9]+\.[0-9]+$/.test(nodeVersion)) {
        throw new Error("Couldn't find node version, instead got: " + nodeVersion);
    }
    // prebuild-install will overwrite the target .node file. Instead, we're
    // going to:
    //  * Take a backup
    //  * run prebuild
    //  * move the prebuild to a new name with a platform/version extension
    //  * put the backed up file back
    var nativeFile = nodeFile + "." + target.platform + "." + nodeVersion;
    if (fs_1.default.existsSync(nativeFile)) {
        return nativeFile;
    }
    if (!fs_1.default.existsSync(nodeFile + ".bak")) {
        fs_1.default.copyFileSync(nodeFile, nodeFile + ".bak");
    }
    child_process_1.execSync(prebuild + " -t " + nodeVersion + " --platform " + types_1.platform[target.platform] + " --arch " + target.arch, { cwd: dir });
    fs_1.default.copyFileSync(nodeFile, nativeFile);
    fs_1.default.copyFileSync(nodeFile + ".bak", nodeFile);
    return nativeFile;
}
var fileDictionary = {};
var counter = 0;
function replace(k) {
    var existingKey = fileDictionary[k];
    if (!existingKey) {
        var newkey = counter;
        counter += 1;
        existingKey = newkey.toString(36);
        fileDictionary[k] = existingKey;
    }
    return existingKey;
}
var separator = '$';
function makeKey(filename, slash) {
    var a = filename.split(slash).map(replace).join(separator);
    return a;
}
function producer(_a) {
    var backpack = _a.backpack, bakes = _a.bakes, slash = _a.slash, target = _a.target, symLinks = _a.symLinks, doCompress = _a.doCompress;
    return new Promise(function (resolve, reject) {
        var e_1, _a, e_2, _b;
        if (!Buffer.alloc) {
            throw log_1.wasReported('Your node.js does not have Buffer.alloc. Please upgrade!');
        }
        var prelude = backpack.prelude;
        var entrypoint = backpack.entrypoint, stripes = backpack.stripes;
        entrypoint = common_1.snapshotify(entrypoint, slash);
        stripes = stripes.slice();
        var vfs = {};
        try {
            for (var stripes_1 = __values(stripes), stripes_1_1 = stripes_1.next(); !stripes_1_1.done; stripes_1_1 = stripes_1.next()) {
                var stripe = stripes_1_1.value;
                var snap = stripe.snap;
                snap = common_1.snapshotify(snap, slash);
                var vfsKey = makeKey(snap, slash);
                if (!vfs[vfsKey])
                    vfs[vfsKey] = {};
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (stripes_1_1 && !stripes_1_1.done && (_a = stripes_1.return)) _a.call(stripes_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var snapshotSymLinks = {};
        try {
            for (var _c = __values(Object.entries(symLinks)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var _e = __read(_d.value, 2), key = _e[0], value = _e[1];
                var k = common_1.snapshotify(key, slash);
                var v = common_1.snapshotify(value, slash);
                var vfsKey = makeKey(k, slash);
                snapshotSymLinks[vfsKey] = makeKey(v, slash);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
            }
            finally { if (e_2) throw e_2.error; }
        }
        var meter;
        var count = 0;
        function pipeToNewMeter(s) {
            meter = stream_meter_1.default();
            return s.pipe(meter);
        }
        function pipeMayCompressToNewMeter(s) {
            if (doCompress === compress_type_1.CompressType.GZip) {
                return pipeToNewMeter(s.pipe(zlib_1.createGzip()));
            }
            if (doCompress === compress_type_1.CompressType.Brotli) {
                return pipeToNewMeter(s.pipe(zlib_1.createBrotliCompress()));
            }
            return pipeToNewMeter(s);
        }
        function next(s) {
            count += 1;
            return pipeToNewMeter(s);
        }
        var binaryBuffer = fs_1.default.readFileSync(target.binaryPath);
        var placeholders = discoverPlaceholders(binaryBuffer);
        var track = 0;
        var prevStripe;
        var payloadPosition;
        var payloadSize;
        var preludePosition;
        var preludeSize;
        new multistream_1.default(function (cb) {
            if (count === 0) {
                return cb(null, next(into_stream_1.default(binaryBuffer)));
            }
            if (count === 1) {
                payloadPosition = meter.bytes;
                return cb(null, next(into_stream_1.default(Buffer.alloc(0))));
            }
            if (count === 2) {
                if (prevStripe && !prevStripe.skip) {
                    var store = prevStripe.store;
                    var snap = prevStripe.snap;
                    snap = common_1.snapshotify(snap, slash);
                    var vfsKey = makeKey(snap, slash);
                    vfs[vfsKey][store] = [track, meter.bytes];
                    track += meter.bytes;
                }
                if (stripes.length) {
                    // clone to prevent 'skip' propagate
                    // to other targets, since same stripe
                    // is used for several targets
                    var stripe_1 = __assign({}, stripes.shift());
                    prevStripe = stripe_1;
                    if (stripe_1.buffer) {
                        if (stripe_1.store === common_1.STORE_BLOB) {
                            var snap = common_1.snapshotify(stripe_1.snap, slash);
                            return fabricator_1.fabricateTwice(bakes, target.fabricator, snap, stripe_1.buffer, function (error, buffer) {
                                if (error) {
                                    log_1.log.warn(error.message);
                                    stripe_1.skip = true;
                                    return cb(null, into_stream_1.default(Buffer.alloc(0)));
                                }
                                cb(null, pipeMayCompressToNewMeter(into_stream_1.default(buffer || Buffer.from(''))));
                            });
                        }
                        return cb(null, pipeMayCompressToNewMeter(into_stream_1.default(stripe_1.buffer)));
                    }
                    if (stripe_1.file) {
                        if (stripe_1.file === target.output) {
                            return cb(log_1.wasReported('Trying to take executable into executable', stripe_1.file), null);
                        }
                        assert_1.default.strictEqual(stripe_1.store, common_1.STORE_CONTENT); // others must be buffers from walker
                        if (common_1.isDotNODE(stripe_1.file)) {
                            try {
                                var platformFile = nativePrebuildInstall(target, stripe_1.file);
                                if (fs_1.default.existsSync(platformFile)) {
                                    return cb(null, pipeMayCompressToNewMeter(fs_1.default.createReadStream(platformFile)));
                                }
                            }
                            catch (err) {
                                log_1.log.debug("prebuild-install failed[" + stripe_1.file + "]:", err);
                            }
                        }
                        return cb(null, pipeMayCompressToNewMeter(fs_1.default.createReadStream(stripe_1.file)));
                    }
                    assert_1.default(false, 'producer: bad stripe');
                }
                else {
                    payloadSize = track;
                    preludePosition = payloadPosition + payloadSize;
                    return cb(null, next(into_stream_1.default(makePreludeBufferFromPrelude(replaceDollarWise(replaceDollarWise(replaceDollarWise(replaceDollarWise(replaceDollarWise(prelude, '%VIRTUAL_FILESYSTEM%', JSON.stringify(vfs)), '%DEFAULT_ENTRYPOINT%', JSON.stringify(entrypoint)), '%SYMLINKS%', JSON.stringify(snapshotSymLinks)), '%DICT%', JSON.stringify(fileDictionary)), '%DOCOMPRESS%', JSON.stringify(doCompress))))));
                }
            }
            else {
                return cb(null, null);
            }
        })
            .on('error', function (error) {
            reject(error);
        })
            .pipe(fs_1.default.createWriteStream(target.output))
            .on('error', function (error) {
            reject(error);
        })
            .on('close', function () {
            preludeSize = meter.bytes;
            fs_1.default.open(target.output, 'r+', function (error, fd) {
                if (error)
                    return reject(error);
                injectPlaceholders(fd, placeholders, {
                    BAKERY: makeBakeryValueFromBakes(bakes),
                    PAYLOAD_POSITION: payloadPosition,
                    PAYLOAD_SIZE: payloadSize,
                    PRELUDE_POSITION: preludePosition,
                    PRELUDE_SIZE: preludeSize,
                }, function (error2) {
                    if (error2)
                        return reject(error2);
                    fs_1.default.close(fd, function (error3) {
                        if (error3)
                            return reject(error3);
                        resolve();
                    });
                });
            });
        });
    });
}
exports.default = producer;
//# sourceMappingURL=producer.js.map