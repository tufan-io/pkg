"use strict";
/* eslint-disable complexity */
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = __importDefault(require("assert"));
var fs = __importStar(require("fs-extra"));
var path = __importStar(require("path"));
var common_1 = require("./common");
var log_1 = require("./log");
var version = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8')).version;
var bootstrapText = fs
    .readFileSync(require.resolve('../prelude/bootstrap.js'), 'utf8')
    .replace('%VERSION%', version);
var commonText = fs.readFileSync(require.resolve('./common'), 'utf8');
var diagnosticText = fs.readFileSync(require.resolve('../prelude/diagnostic.js'), 'utf8');
function itemsToText(items) {
    var len = items.length;
    return len.toString() + (len % 10 === 1 ? ' item' : ' items');
}
function hasAnyStore(record) {
    var e_1, _a;
    try {
        // discarded records like native addons
        for (var _b = __values([common_1.STORE_BLOB, common_1.STORE_CONTENT, common_1.STORE_LINKS, common_1.STORE_STAT]), _c = _b.next(); !_c.done; _c = _b.next()) {
            var store = _c.value;
            if (record[store])
                return true;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return false;
}
function packer(_a) {
    var e_2, _b;
    var records = _a.records, entrypoint = _a.entrypoint, bytecode = _a.bytecode;
    var stripes = [];
    for (var snap in records) {
        if (records[snap]) {
            var record = records[snap];
            var file = record.file;
            if (!hasAnyStore(record)) {
                continue;
            }
            assert_1.default(record[common_1.STORE_STAT], 'packer: no STORE_STAT');
            assert_1.default(record[common_1.STORE_BLOB] ||
                record[common_1.STORE_CONTENT] ||
                record[common_1.STORE_LINKS] ||
                record[common_1.STORE_STAT]);
            if (record[common_1.STORE_BLOB] && !bytecode) {
                delete record[common_1.STORE_BLOB];
                if (!record[common_1.STORE_CONTENT]) {
                    // TODO make a test for it?
                    throw log_1.wasReported('--no-bytecode and no source breaks final executable', [
                        file,
                        'Please run with "-d" and without "--no-bytecode" first, and make',
                        'sure that debug log does not contain "was included as bytecode".',
                    ]);
                }
            }
            try {
                for (var _c = (e_2 = void 0, __values([
                    common_1.STORE_BLOB,
                    common_1.STORE_CONTENT,
                    common_1.STORE_LINKS,
                    common_1.STORE_STAT,
                ])), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var store = _d.value;
                    var value = record[store];
                    if (!value) {
                        continue;
                    }
                    if (store === common_1.STORE_BLOB || store === common_1.STORE_CONTENT) {
                        if (record.body === undefined) {
                            stripes.push({ snap: snap, store: store, file: file });
                        }
                        else if (Buffer.isBuffer(record.body)) {
                            stripes.push({ snap: snap, store: store, buffer: record.body });
                        }
                        else if (typeof record.body === 'string') {
                            stripes.push({ snap: snap, store: store, buffer: Buffer.from(record.body) });
                        }
                        else {
                            assert_1.default(false, 'packer: bad STORE_BLOB/STORE_CONTENT');
                        }
                    }
                    else if (store === common_1.STORE_LINKS) {
                        if (Array.isArray(value)) {
                            var dedupedValue = __spreadArray([], __read(new Set(value)));
                            log_1.log.debug('files & folders deduped = ', dedupedValue);
                            var buffer = Buffer.from(JSON.stringify(dedupedValue));
                            stripes.push({ snap: snap, store: store, buffer: buffer });
                        }
                        else {
                            assert_1.default(false, 'packer: bad STORE_LINKS');
                        }
                    }
                    else if (store === common_1.STORE_STAT) {
                        if (typeof value === 'object') {
                            var newStat = __assign({}, value);
                            var buffer = Buffer.from(JSON.stringify(newStat));
                            stripes.push({ snap: snap, store: store, buffer: buffer });
                        }
                        else {
                            assert_1.default(false, 'packer: unknown store');
                        }
                    }
                    if (record[common_1.STORE_CONTENT]) {
                        var disclosed = common_1.isDotJS(file) || common_1.isDotJSON(file);
                        log_1.log.debug(disclosed
                            ? 'The file was included as DISCLOSED code (with sources)'
                            : 'The file was included as asset content', file);
                    }
                    else if (record[common_1.STORE_BLOB]) {
                        log_1.log.debug('The file was included as bytecode (no sources)', file);
                    }
                    else if (record[common_1.STORE_LINKS]) {
                        var link = record[common_1.STORE_LINKS];
                        log_1.log.debug("The directory files list was included (" + itemsToText(link) + ")", file);
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    }
    var prelude = "return (function (REQUIRE_COMMON, VIRTUAL_FILESYSTEM, DEFAULT_ENTRYPOINT, SYMLINKS, DICT, DOCOMPRESS) { \n        " + bootstrapText + (log_1.log.debugMode ? diagnosticText : '') + "\n})(function (exports) {\n" + commonText + "\n},\n" +
        "%VIRTUAL_FILESYSTEM%" +
        "\n,\n" +
        "%DEFAULT_ENTRYPOINT%" +
        "\n,\n" +
        "%SYMLINKS%" +
        '\n,\n' +
        '%DICT%' +
        '\n,\n' +
        '%DOCOMPRESS%' +
        "\n);";
    return { prelude: prelude, entrypoint: entrypoint, stripes: stripes };
}
exports.default = packer;
//# sourceMappingURL=packer.js.map