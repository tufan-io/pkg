"use strict";
/* eslint-disable require-atomic-updates */
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var fs_extra_1 = __importDefault(require("fs-extra"));
var globby_1 = __importDefault(require("globby"));
var path_1 = __importDefault(require("path"));
var chalk_1 = __importDefault(require("chalk"));
var common_1 = require("./common");
var follow_1 = require("./follow");
var log_1 = require("./log");
var detector = __importStar(require("./detector"));
// Note: as a developer, you can set the PKG_STRICT_VER variable.
//       this will turn on some assertion in the walker code below
//       to assert that each file content/state that we appending
//       to the virtual file system applies to  a real file,
//       not a symlink.
//       By default assertion are disabled as they can have a
//       performance hit.
var strictVerify = Boolean(process.env.PKG_STRICT_VER);
var win32 = process.platform === 'win32';
function unlikelyJavascript(file) {
    return ['.css', '.html', '.json'].includes(path_1.default.extname(file));
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isPublic(_config) {
    // tufan.io: force all modules to be private
    return false;
    // if (config.private) {
    //   return false;
    // }
    // const { licenses } = config;
    // let { license } = config;
    // if (licenses) {
    //   license = licenses;
    // }
    // if (license && !Array.isArray(license)) {
    //   license = typeof license === 'string' ? license : license.type;
    // }
    // if (Array.isArray(license)) {
    //   license = license.map((c) => String(c.type || c)).join(',');
    // }
    // if (!license) {
    //   return false;
    // }
    // if (/^\(/.test(license)) {
    //   license = license.slice(1);
    // }
    // if (/\)$/.test(license)) {
    //   license = license.slice(0, -1);
    // }
    // license = license.toLowerCase();
    // const allLicenses = Array.prototype.concat(
    //   license.split(' or '),
    //   license.split(' and '),
    //   license.split('/'),
    //   license.split(',')
    // );
    // let result = false;
    // const foss = [
    //   'isc',
    //   'mit',
    //   'apache-2.0',
    //   'apache 2.0',
    //   'public domain',
    //   'bsd',
    //   'bsd-2-clause',
    //   'bsd-3-clause',
    //   'wtfpl',
    //   'cc-by-3.0',
    //   'x11',
    //   'artistic-2.0',
    //   'gplv3',
    //   'mpl',
    //   'mplv2.0',
    //   'unlicense',
    //   'apache license 2.0',
    //   'zlib',
    //   'mpl-2.0',
    //   'nasa-1.3',
    //   'apache license, version 2.0',
    //   'lgpl-2.1+',
    //   'cc0-1.0',
    // ];
    // for (const c of allLicenses) {
    //   result = foss.indexOf(c) >= 0;
    //   if (result) {
    //     break;
    //   }
    // }
    // return result;
}
function upon(p, base) {
    if (typeof p !== 'string') {
        throw log_1.wasReported('Config items must be strings. See examples');
    }
    var negate = false;
    if (p[0] === '!') {
        p = p.slice(1);
        negate = true;
    }
    p = path_1.default.join(base, p);
    if (win32) {
        p = p.replace(/\\/g, '/');
    }
    if (negate) {
        p = "!" + p;
    }
    return p;
}
function collect(ps) {
    return globby_1.default.sync(ps, { dot: true });
}
function expandFiles(efs, base) {
    if (!Array.isArray(efs)) {
        efs = [efs];
    }
    efs = collect(efs.map(function (p) { return upon(p, base); }));
    return efs;
}
function stepRead(record) {
    return __awaiter(this, void 0, void 0, function () {
        var body, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (strictVerify) {
                        assert_1.default(record.file === common_1.toNormalizedRealPath(record.file));
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fs_extra_1.default.readFile(record.file)];
                case 2:
                    body = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    log_1.log.error("Cannot read file, " + error_1.code, record.file);
                    throw log_1.wasReported(error_1);
                case 4:
                    record.body = body;
                    return [2 /*return*/];
            }
        });
    });
}
function stepStrip(record) {
    var body = (record.body || '').toString('utf8');
    if (/^\ufeff/.test(body)) {
        body = body.replace(/^\ufeff/, '');
    }
    if (/^#!/.test(body)) {
        body = body.replace(/^#![^\n]*\n/, '\n');
    }
    record.body = body;
}
function stepDetect(record, marker, derivatives) {
    var _a = record.body, body = _a === void 0 ? '' : _a;
    if (body instanceof Buffer) {
        body = body.toString();
    }
    try {
        detector.detect(body, function (node, trying) {
            var toplevel = marker.toplevel;
            var d = detector.visitor_SUCCESSFUL(node);
            if (d) {
                if (d.mustExclude) {
                    return false;
                }
                d.mayExclude = d.mayExclude || trying;
                derivatives.push(d);
                return false;
            }
            d = detector.visitor_NONLITERAL(node);
            if (d) {
                if (typeof d === 'object' && d.mustExclude) {
                    return false;
                }
                var debug = !toplevel || d.mayExclude || trying;
                var level = debug ? 'debug' : 'warn';
                log_1.log[level]("Cannot resolve '" + d.alias + "'", [
                    record.file,
                    'Dynamic require may fail at run time, because the requested file',
                    'is unknown at compilation time and not included into executable.',
                    "Use a string literal as an argument for 'require', or leave it",
                    "as is and specify the resolved file name in 'scripts' option.",
                ]);
                return false;
            }
            d = detector.visitor_MALFORMED(node);
            if (d) {
                // there is no 'mustExclude'
                var debug = !toplevel || trying;
                var level = debug ? 'debug' : 'warn'; // there is no 'mayExclude'
                log_1.log[level]("Malformed requirement for '" + d.alias + "'", [record.file]);
                return false;
            }
            d = detector.visitor_USESCWD(node);
            if (d) {
                // there is no 'mustExclude'
                var level = 'debug'; // there is no 'mayExclude'
                log_1.log[level]("Path.resolve(" + d.alias + ") is ambiguous", [
                    record.file,
                    "It resolves relatively to 'process.cwd' by default, however",
                    "you may want to use 'path.dirname(require.main.filename)'",
                ]);
                return false;
            }
            return true; // can i go inside?
        });
    }
    catch (error) {
        log_1.log.error(error.message, record.file);
        throw log_1.wasReported(error);
    }
}
function findCommonJunctionPoint(file, realFile) {
    // find common denominator => where the link changes
    while (common_1.toNormalizedRealPath(path_1.default.dirname(file)) === path_1.default.dirname(realFile)) {
        file = path_1.default.dirname(file);
        realFile = path_1.default.dirname(realFile);
    }
    return { file: file, realFile: realFile };
}
function blobOrContent(fname) {
    return common_1.isDotJS(fname) ? common_1.STORE_BLOB : common_1.STORE_CONTENT;
}
var Walker = /** @class */ (function () {
    function Walker() {
        this.tasks = [];
        this.records = {};
        this.dictionary = {};
        this.patches = {};
        this.params = {};
        this.symLinks = {};
    }
    Walker.prototype.appendRecord = function (_a) {
        var file = _a.file, store = _a.store;
        if (this.records[file]) {
            return;
        }
        if (store === common_1.STORE_BLOB ||
            store === common_1.STORE_CONTENT ||
            store === common_1.STORE_LINKS) {
            // make sure we have a real file
            if (strictVerify) {
                assert_1.default(file === common_1.toNormalizedRealPath(file));
            }
        }
        this.records[file] = { file: file };
    };
    Walker.prototype.append = function (task) {
        var _a;
        if (strictVerify) {
            assert_1.default(typeof task.file === 'string');
            assert_1.default(task.file === common_1.normalizePath(task.file));
        }
        this.appendRecord(task);
        this.tasks.push(task);
        var what = (_a = {},
            _a[common_1.STORE_BLOB] = 'Bytecode of',
            _a[common_1.STORE_CONTENT] = 'Content of',
            _a[common_1.STORE_LINKS] = 'Directory',
            _a[common_1.STORE_STAT] = 'Stat info of',
            _a)[task.store];
        if (task.reason) {
            log_1.log.debug(what + " " + task.file + " is added to queue. It was required from " + task.reason);
        }
        else {
            log_1.log.debug(what + " " + task.file + " is added to queue.");
        }
    };
    Walker.prototype.appendSymlink = function (file, realFile) {
        var a = findCommonJunctionPoint(file, realFile);
        file = a.file;
        realFile = a.realFile;
        if (!this.symLinks[file]) {
            var dn = path_1.default.dirname(file);
            this.appendFileInFolder({
                file: dn,
                store: common_1.STORE_LINKS,
                data: path_1.default.basename(file),
            });
            log_1.log.debug("adding symlink " + file + "  => " + path_1.default.relative(file, realFile));
            this.symLinks[file] = realFile;
            this.appendStat({
                file: realFile,
                store: common_1.STORE_STAT,
            });
            this.appendStat({
                file: dn,
                store: common_1.STORE_STAT,
            });
            this.appendStat({
                file: file,
                store: common_1.STORE_STAT,
            });
        }
    };
    Walker.prototype.appendStat = function (task) {
        assert_1.default(task.store === common_1.STORE_STAT);
        this.append(task);
    };
    Walker.prototype.appendFileInFolder = function (task) {
        if (strictVerify) {
            assert_1.default(task.store === common_1.STORE_LINKS);
            assert_1.default(typeof task.file === 'string');
        }
        var realFile = common_1.toNormalizedRealPath(task.file);
        if (realFile === task.file) {
            this.append(task);
            return;
        }
        this.append(__assign(__assign({}, task), { file: realFile }));
        this.appendStat({
            file: task.file,
            store: common_1.STORE_STAT,
        });
        this.appendStat({
            file: path_1.default.dirname(task.file),
            store: common_1.STORE_STAT,
        });
    };
    Walker.prototype.appendBlobOrContent = function (task) {
        if (strictVerify) {
            assert_1.default(task.file === common_1.normalizePath(task.file));
        }
        assert_1.default(task.store === common_1.STORE_BLOB || task.store === common_1.STORE_CONTENT);
        assert_1.default(typeof task.file === 'string');
        var realFile = common_1.toNormalizedRealPath(task.file);
        if (realFile === task.file) {
            this.append(task);
            return;
        }
        this.append(__assign(__assign({}, task), { file: realFile }));
        this.appendSymlink(task.file, realFile);
        this.appendStat({
            file: task.file,
            store: common_1.STORE_STAT,
        });
    };
    Walker.prototype.appendFilesFromConfig = function (marker) {
        return __awaiter(this, void 0, void 0, function () {
            var config, configPath, base, pkgConfig, scripts, scripts_1, scripts_1_1, script, stat, e_1_1, assets, assets_1, assets_1_1, asset, stat, e_2_1, files, files_1, files_1_1, file, stat, e_3_1;
            var e_1, _a, e_2, _b, e_3, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        config = marker.config, configPath = marker.configPath, base = marker.base;
                        pkgConfig = config === null || config === void 0 ? void 0 : config.pkg;
                        if (!pkgConfig) return [3 /*break*/, 17];
                        scripts = pkgConfig.scripts;
                        if (!scripts) return [3 /*break*/, 8];
                        scripts = expandFiles(scripts, base);
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 8]);
                        scripts_1 = __values(scripts), scripts_1_1 = scripts_1.next();
                        _d.label = 2;
                    case 2:
                        if (!!scripts_1_1.done) return [3 /*break*/, 5];
                        script = scripts_1_1.value;
                        return [4 /*yield*/, fs_extra_1.default.stat(script)];
                    case 3:
                        stat = _d.sent();
                        if (stat.isFile()) {
                            if (!common_1.isDotJS(script) && !common_1.isDotJSON(script) && !common_1.isDotNODE(script)) {
                                log_1.log.warn("Non-javascript file is specified in 'scripts'.", [
                                    'Pkg will probably fail to parse. Specify *.js in glob.',
                                    script,
                                ]);
                            }
                            this.appendBlobOrContent({
                                file: common_1.normalizePath(script),
                                marker: marker,
                                store: common_1.STORE_BLOB,
                                reason: configPath,
                            });
                        }
                        _d.label = 4;
                    case 4:
                        scripts_1_1 = scripts_1.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (scripts_1_1 && !scripts_1_1.done && (_a = scripts_1.return)) _a.call(scripts_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 8:
                        assets = pkgConfig.assets;
                        if (!assets) return [3 /*break*/, 16];
                        assets = expandFiles(assets, base);
                        _d.label = 9;
                    case 9:
                        _d.trys.push([9, 14, 15, 16]);
                        assets_1 = __values(assets), assets_1_1 = assets_1.next();
                        _d.label = 10;
                    case 10:
                        if (!!assets_1_1.done) return [3 /*break*/, 13];
                        asset = assets_1_1.value;
                        log_1.log.debug(' Adding asset : .... ', asset);
                        return [4 /*yield*/, fs_extra_1.default.stat(asset)];
                    case 11:
                        stat = _d.sent();
                        if (stat.isFile()) {
                            this.appendBlobOrContent({
                                file: common_1.normalizePath(asset),
                                marker: marker,
                                store: common_1.STORE_CONTENT,
                                reason: configPath,
                            });
                        }
                        _d.label = 12;
                    case 12:
                        assets_1_1 = assets_1.next();
                        return [3 /*break*/, 10];
                    case 13: return [3 /*break*/, 16];
                    case 14:
                        e_2_1 = _d.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 16];
                    case 15:
                        try {
                            if (assets_1_1 && !assets_1_1.done && (_b = assets_1.return)) _b.call(assets_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 16: return [3 /*break*/, 25];
                    case 17:
                        if (!config) return [3 /*break*/, 25];
                        files = config.files;
                        if (!files) return [3 /*break*/, 25];
                        files = expandFiles(files, base);
                        _d.label = 18;
                    case 18:
                        _d.trys.push([18, 23, 24, 25]);
                        files_1 = __values(files), files_1_1 = files_1.next();
                        _d.label = 19;
                    case 19:
                        if (!!files_1_1.done) return [3 /*break*/, 22];
                        file = files_1_1.value;
                        file = common_1.normalizePath(file);
                        return [4 /*yield*/, fs_extra_1.default.stat(file)];
                    case 20:
                        stat = _d.sent();
                        if (stat.isFile()) {
                            // 1) remove sources of top-level(!) package 'files' i.e. ship as BLOB
                            // 2) non-source (non-js) files of top-level package are shipped as CONTENT
                            // 3) parsing some js 'files' of non-top-level packages fails, hence all CONTENT
                            if (marker.toplevel) {
                                this.appendBlobOrContent({
                                    file: file,
                                    marker: marker,
                                    store: blobOrContent(file),
                                    reason: configPath,
                                });
                            }
                            else {
                                this.appendBlobOrContent({
                                    file: file,
                                    marker: marker,
                                    store: blobOrContent(file),
                                    reason: configPath,
                                });
                            }
                        }
                        _d.label = 21;
                    case 21:
                        files_1_1 = files_1.next();
                        return [3 /*break*/, 19];
                    case 22: return [3 /*break*/, 25];
                    case 23:
                        e_3_1 = _d.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 25];
                    case 24:
                        try {
                            if (files_1_1 && !files_1_1.done && (_c = files_1.return)) _c.call(files_1);
                        }
                        finally { if (e_3) throw e_3.error; }
                        return [7 /*endfinally*/];
                    case 25: return [2 /*return*/];
                }
            });
        });
    };
    Walker.prototype.stepActivate = function (marker, derivatives) {
        return __awaiter(this, void 0, void 0, function () {
            var config, base, name, d, dependencies, dependency, pkgConfig, patches, key, p, deployFiles, deployFiles_1, deployFiles_1_1, deployFile, type;
            var e_4, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!marker) {
                            assert_1.default(false);
                        }
                        if (marker.activated) {
                            return [2 /*return*/];
                        }
                        config = marker.config, base = marker.base;
                        if (!config) {
                            assert_1.default(false);
                        }
                        name = config.name;
                        if (name) {
                            d = this.dictionary[name];
                            if (d) {
                                if (typeof config.dependencies === 'object' &&
                                    typeof d.dependencies === 'object') {
                                    Object.assign(config.dependencies, d.dependencies);
                                    delete d.dependencies;
                                }
                                Object.assign(config, d);
                                marker.hasDictionary = true;
                            }
                        }
                        dependencies = config.dependencies;
                        if (typeof dependencies === 'object') {
                            for (dependency in dependencies) {
                                // it may be `undefined` - overridden
                                // in dictionary (see publicsuffixlist)
                                if (dependencies[dependency]) {
                                    derivatives.push({
                                        alias: dependency,
                                        aliasType: common_1.ALIAS_AS_RESOLVABLE,
                                        fromDependencies: true,
                                    });
                                    derivatives.push({
                                        alias: dependency + "/package.json",
                                        aliasType: common_1.ALIAS_AS_RESOLVABLE,
                                        fromDependencies: true,
                                    });
                                }
                            }
                        }
                        pkgConfig = config.pkg;
                        if (pkgConfig) {
                            patches = pkgConfig.patches;
                            if (patches) {
                                for (key in patches) {
                                    if (patches[key]) {
                                        p = path_1.default.join(base, key);
                                        this.patches[p] = patches[key];
                                    }
                                }
                            }
                            deployFiles = pkgConfig.deployFiles;
                            if (deployFiles) {
                                marker.hasDeployFiles = true;
                                try {
                                    for (deployFiles_1 = __values(deployFiles), deployFiles_1_1 = deployFiles_1.next(); !deployFiles_1_1.done; deployFiles_1_1 = deployFiles_1.next()) {
                                        deployFile = deployFiles_1_1.value;
                                        type = deployFile[2] || 'file';
                                        log_1.log.warn("Cannot include " + type + " %1 into executable.", [
                                            "The " + type + " must be distributed with executable as %2.",
                                            "%1: " + path_1.default.relative(process.cwd(), path_1.default.join(base, deployFile[0])),
                                            "%2: path-to-executable/" + deployFile[1],
                                        ]);
                                    }
                                }
                                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                                finally {
                                    try {
                                        if (deployFiles_1_1 && !deployFiles_1_1.done && (_a = deployFiles_1.return)) _a.call(deployFiles_1);
                                    }
                                    finally { if (e_4) throw e_4.error; }
                                }
                            }
                            if (pkgConfig.log) {
                                pkgConfig.log(log_1.log, { packagePath: base });
                            }
                        }
                        return [4 /*yield*/, this.appendFilesFromConfig(marker)];
                    case 1:
                        _b.sent();
                        marker.public = isPublic(config);
                        if (!marker.public && marker.toplevel) {
                            marker.public = this.params.publicToplevel;
                        }
                        if (!marker.public && !marker.toplevel && this.params.publicPackages) {
                            marker.public =
                                this.params.publicPackages[0] === '*' ||
                                    (!!name && this.params.publicPackages.indexOf(name) !== -1);
                        }
                        marker.activated = true;
                        // assert no further work with config
                        delete marker.config;
                        return [2 /*return*/];
                }
            });
        });
    };
    Walker.prototype.hasPatch = function (record) {
        var patch = this.patches[record.file];
        if (!patch) {
            return;
        }
        return true;
    };
    Walker.prototype.stepPatch = function (record) {
        var patch = this.patches[record.file];
        if (!patch) {
            return;
        }
        var body = (record.body || '').toString('utf8');
        for (var i = 0; i < patch.length; i += 2) {
            if (typeof patch[i] === 'object') {
                if (patch[i].do === 'erase') {
                    body = patch[i + 1];
                }
                else if (patch[i].do === 'prepend') {
                    body = patch[i + 1] + body;
                }
                else if (patch[i].do === 'append') {
                    body += patch[i + 1];
                }
            }
            else if (typeof patch[i] === 'string') {
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
                // function escapeRegExp
                var esc = patch[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                var regexp = new RegExp(esc, 'g');
                body = body.replace(regexp, patch[i + 1]);
            }
        }
        record.body = body;
    };
    Walker.prototype.stepDerivatives_ALIAS_AS_RELATIVE = function (record, marker, derivative) {
        return __awaiter(this, void 0, void 0, function () {
            var file, stat, error_2, toplevel, debug, level;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        file = common_1.normalizePath(path_1.default.join(path_1.default.dirname(record.file), derivative.alias));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs_extra_1.default.stat(file)];
                    case 2:
                        stat = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        toplevel = marker.toplevel;
                        debug = !toplevel && error_2.code === 'ENOENT';
                        level = debug ? 'debug' : 'warn';
                        log_1.log[level]("Cannot stat, " + error_2.code, [
                            file,
                            "The file was required from '" + record.file + "'",
                        ]);
                        return [3 /*break*/, 4];
                    case 4:
                        if (stat && stat.isFile()) {
                            this.appendBlobOrContent({
                                file: file,
                                marker: marker,
                                store: blobOrContent(file),
                                reason: record.file,
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Walker.prototype.stepDerivatives_ALIAS_AS_RESOLVABLE = function (record, marker, derivative) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var newPackages, catchReadFile, catchPackageFilter, newFile, failure, basedir, error_3, toplevel, mainNotFound, debug, level, message, newPackageForNewRecords, newPackages_1, newPackages_1_1, newPackage, newFile2, _1, e_5_1;
            var e_5, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        newPackages = [];
                        catchReadFile = function (file) {
                            assert_1.default(common_1.isPackageJson(file), "walker: " + file + " must be package.json");
                            newPackages.push({ packageJson: file });
                        };
                        catchPackageFilter = function (config, base) {
                            var newPackage = newPackages[newPackages.length - 1];
                            newPackage.marker = { config: config, configPath: newPackage.packageJson, base: base };
                        };
                        newFile = '';
                        basedir = path_1.default.dirname(record.file);
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, follow_1.follow(derivative.alias, {
                                basedir: basedir,
                                // default is extensions: ['.js'], but
                                // it is not enough because 'typos.json'
                                // is not taken in require('./typos')
                                // in 'normalize-package-data/lib/fixer.js'
                                extensions: ['.js', '.json', '.node'],
                                readFile: catchReadFile,
                                packageFilter: catchPackageFilter,
                            })];
                    case 2:
                        newFile = _d.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _d.sent();
                        failure = error_3;
                        return [3 /*break*/, 4];
                    case 4:
                        if (failure) {
                            toplevel = marker.toplevel;
                            mainNotFound = newPackages.length > 0 && !((_b = (_a = newPackages[0].marker) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.main);
                            debug = !toplevel ||
                                derivative.mayExclude ||
                                (mainNotFound && derivative.fromDependencies);
                            level = debug ? 'debug' : 'warn';
                            if (mainNotFound) {
                                message = "Entry 'main' not found in %1";
                                log_1.log[level](message, [
                                    "%1: " + newPackages[0].packageJson,
                                    "%2: " + record.file,
                                ]);
                            }
                            else {
                                log_1.log[level](chalk_1.default.yellow(failure.message) + "  in " + record.file);
                            }
                            return [2 /*return*/];
                        }
                        _d.label = 5;
                    case 5:
                        _d.trys.push([5, 13, 14, 15]);
                        newPackages_1 = __values(newPackages), newPackages_1_1 = newPackages_1.next();
                        _d.label = 6;
                    case 6:
                        if (!!newPackages_1_1.done) return [3 /*break*/, 12];
                        newPackage = newPackages_1_1.value;
                        newFile2 = void 0;
                        _d.label = 7;
                    case 7:
                        _d.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, follow_1.follow(derivative.alias, {
                                basedir: path_1.default.dirname(record.file),
                                extensions: ['.js', '.json', '.node'],
                                ignoreFile: newPackage.packageJson,
                            })];
                    case 8:
                        newFile2 = _d.sent();
                        if (strictVerify) {
                            assert_1.default(newFile2 === common_1.normalizePath(newFile2));
                        }
                        return [3 /*break*/, 10];
                    case 9:
                        _1 = _d.sent();
                        return [3 /*break*/, 10];
                    case 10:
                        if (newFile2 !== newFile) {
                            newPackageForNewRecords = newPackage;
                            return [3 /*break*/, 12];
                        }
                        _d.label = 11;
                    case 11:
                        newPackages_1_1 = newPackages_1.next();
                        return [3 /*break*/, 6];
                    case 12: return [3 /*break*/, 15];
                    case 13:
                        e_5_1 = _d.sent();
                        e_5 = { error: e_5_1 };
                        return [3 /*break*/, 15];
                    case 14:
                        try {
                            if (newPackages_1_1 && !newPackages_1_1.done && (_c = newPackages_1.return)) _c.call(newPackages_1);
                        }
                        finally { if (e_5) throw e_5.error; }
                        return [7 /*endfinally*/];
                    case 15:
                        if (newPackageForNewRecords) {
                            if (strictVerify) {
                                assert_1.default(newPackageForNewRecords.packageJson ===
                                    common_1.normalizePath(newPackageForNewRecords.packageJson));
                            }
                            // link to package.json
                            this.appendBlobOrContent({
                                file: newPackageForNewRecords.packageJson,
                                marker: newPackageForNewRecords.marker,
                                store: blobOrContent(newPackageForNewRecords.packageJson),
                                reason: record.file,
                            });
                        }
                        this.appendBlobOrContent({
                            file: newFile,
                            marker: newPackageForNewRecords ? newPackageForNewRecords.marker : marker,
                            store: common_1.STORE_BLOB,
                            reason: record.file,
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Walker.prototype.stepDerivatives = function (record, marker, derivatives) {
        return __awaiter(this, void 0, void 0, function () {
            var derivatives_1, derivatives_1_1, derivative, _a, e_6_1;
            var e_6, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 9, 10, 11]);
                        derivatives_1 = __values(derivatives), derivatives_1_1 = derivatives_1.next();
                        _c.label = 1;
                    case 1:
                        if (!!derivatives_1_1.done) return [3 /*break*/, 8];
                        derivative = derivatives_1_1.value;
                        if (follow_1.natives[derivative.alias])
                            return [3 /*break*/, 7];
                        _a = derivative.aliasType;
                        switch (_a) {
                            case common_1.ALIAS_AS_RELATIVE: return [3 /*break*/, 2];
                            case common_1.ALIAS_AS_RESOLVABLE: return [3 /*break*/, 4];
                        }
                        return [3 /*break*/, 6];
                    case 2: return [4 /*yield*/, this.stepDerivatives_ALIAS_AS_RELATIVE(record, marker, derivative)];
                    case 3:
                        _c.sent();
                        return [3 /*break*/, 7];
                    case 4: return [4 /*yield*/, this.stepDerivatives_ALIAS_AS_RESOLVABLE(record, marker, derivative)];
                    case 5:
                        _c.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        assert_1.default(false, "walker: unknown aliasType " + derivative.aliasType);
                        _c.label = 7;
                    case 7:
                        derivatives_1_1 = derivatives_1.next();
                        return [3 /*break*/, 1];
                    case 8: return [3 /*break*/, 11];
                    case 9:
                        e_6_1 = _c.sent();
                        e_6 = { error: e_6_1 };
                        return [3 /*break*/, 11];
                    case 10:
                        try {
                            if (derivatives_1_1 && !derivatives_1_1.done && (_b = derivatives_1.return)) _b.call(derivatives_1);
                        }
                        finally { if (e_6) throw e_6.error; }
                        return [7 /*endfinally*/];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    Walker.prototype.step_STORE_ANY = function (record, marker, store) {
        return __awaiter(this, void 0, void 0, function () {
            var derivatives1, derivatives2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // eslint-disable-line camelcase
                        if (strictVerify) {
                            assert_1.default(record.file === common_1.toNormalizedRealPath(record.file));
                        }
                        if (record[store] !== undefined)
                            return [2 /*return*/];
                        record[store] = false; // default is discard
                        this.appendStat({
                            file: record.file,
                            store: common_1.STORE_STAT,
                        });
                        derivatives1 = [];
                        return [4 /*yield*/, this.stepActivate(marker, derivatives1)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.stepDerivatives(record, marker, derivatives1)];
                    case 2:
                        _a.sent();
                        if (store === common_1.STORE_BLOB) {
                            if (unlikelyJavascript(record.file) || common_1.isDotNODE(record.file)) {
                                this.appendBlobOrContent({
                                    file: record.file,
                                    marker: marker,
                                    store: blobOrContent(record.file),
                                });
                                return [2 /*return*/]; // discard
                            }
                            if (marker.public || marker.hasDictionary) {
                                this.appendBlobOrContent({
                                    file: record.file,
                                    marker: marker,
                                    store: blobOrContent(record.file),
                                });
                            }
                        }
                        if (!(store === common_1.STORE_BLOB || this.hasPatch(record))) return [3 /*break*/, 6];
                        if (!!record.body) return [3 /*break*/, 4];
                        return [4 /*yield*/, stepRead(record)];
                    case 3:
                        _a.sent();
                        this.stepPatch(record);
                        if (store === common_1.STORE_BLOB) {
                            stepStrip(record);
                        }
                        _a.label = 4;
                    case 4:
                        if (!(store === common_1.STORE_BLOB)) return [3 /*break*/, 6];
                        derivatives2 = [];
                        stepDetect(record, marker, derivatives2);
                        return [4 /*yield*/, this.stepDerivatives(record, marker, derivatives2)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        record[store] = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    Walker.prototype.step_STORE_LINKS = function (record, data) {
        if (strictVerify) {
            assert_1.default(record.file === common_1.toNormalizedRealPath(record.file), ' expecting real file !!!');
        }
        if (record[common_1.STORE_LINKS]) {
            record[common_1.STORE_LINKS].push(data);
            return;
        }
        record[common_1.STORE_LINKS] = [data];
        if (record[common_1.STORE_STAT]) {
            return;
        }
        this.appendStat({
            file: record.file,
            store: common_1.STORE_STAT,
        });
    };
    Walker.prototype.step_STORE_STAT = function (record) {
        return __awaiter(this, void 0, void 0, function () {
            var realPath, valueStat, value, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (record[common_1.STORE_STAT])
                            return [2 /*return*/];
                        realPath = common_1.toNormalizedRealPath(record.file);
                        if (realPath !== record.file) {
                            this.appendStat({
                                file: realPath,
                                store: common_1.STORE_STAT,
                            });
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs_extra_1.default.stat(record.file)];
                    case 2:
                        valueStat = _a.sent();
                        value = {
                            mode: valueStat.mode,
                            size: valueStat.isFile() ? valueStat.size : 0,
                            isFileValue: valueStat.isFile(),
                            isDirectoryValue: valueStat.isDirectory(),
                            isSocketValue: valueStat.isSocket(),
                            isSymbolicLinkValue: valueStat.isSymbolicLink(),
                        };
                        record[common_1.STORE_STAT] = value;
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        log_1.log.error("Cannot stat, " + error_4.code, record.file);
                        throw log_1.wasReported(error_4);
                    case 4:
                        if (path_1.default.dirname(record.file) !== record.file) {
                            // root directory
                            this.appendFileInFolder({
                                file: path_1.default.dirname(record.file),
                                store: common_1.STORE_LINKS,
                                data: path_1.default.basename(record.file),
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Walker.prototype.step = function (task) {
        return __awaiter(this, void 0, void 0, function () {
            var file, store, data, record, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        file = task.file, store = task.store, data = task.data;
                        record = this.records[file];
                        _a = store;
                        switch (_a) {
                            case common_1.STORE_BLOB: return [3 /*break*/, 1];
                            case common_1.STORE_CONTENT: return [3 /*break*/, 1];
                            case common_1.STORE_LINKS: return [3 /*break*/, 3];
                            case common_1.STORE_STAT: return [3 /*break*/, 4];
                        }
                        return [3 /*break*/, 6];
                    case 1: 
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    return [4 /*yield*/, this.step_STORE_ANY(record, task.marker, store)];
                    case 2:
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 3:
                        this.step_STORE_LINKS(record, data);
                        return [3 /*break*/, 7];
                    case 4: return [4 /*yield*/, this.step_STORE_STAT(record)];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        assert_1.default(false, "walker: unknown store " + store);
                        _b.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Walker.prototype.readDictionary = function (marker) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var dd, files, files_2, files_2_1, file, name_1, config, pkgConfig, dictionary, name_2;
            var e_7, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        dd = path_1.default.join(__dirname, '../dictionary');
                        return [4 /*yield*/, fs_extra_1.default.readdir(dd)];
                    case 1:
                        files = _c.sent();
                        try {
                            for (files_2 = __values(files), files_2_1 = files_2.next(); !files_2_1.done; files_2_1 = files_2.next()) {
                                file = files_2_1.value;
                                if (/\.js$/.test(file)) {
                                    name_1 = file.slice(0, -3);
                                    config = require(path_1.default.join(dd, file));
                                    this.dictionary[name_1] = config;
                                }
                            }
                        }
                        catch (e_7_1) { e_7 = { error: e_7_1 }; }
                        finally {
                            try {
                                if (files_2_1 && !files_2_1.done && (_b = files_2.return)) _b.call(files_2);
                            }
                            finally { if (e_7) throw e_7.error; }
                        }
                        pkgConfig = (_a = marker.config) === null || _a === void 0 ? void 0 : _a.pkg;
                        if (pkgConfig) {
                            dictionary = pkgConfig.dictionary;
                            if (dictionary) {
                                for (name_2 in dictionary) {
                                    if (dictionary[name_2]) {
                                        this.dictionary[name_2] = { pkg: dictionary[name_2] };
                                    }
                                }
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Walker.prototype.start = function (marker, entrypoint, addition, params) {
        return __awaiter(this, void 0, void 0, function () {
            var tasks, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.params = params;
                        this.symLinks = {};
                        return [4 /*yield*/, this.readDictionary(marker)];
                    case 1:
                        _a.sent();
                        entrypoint = common_1.normalizePath(entrypoint);
                        this.appendBlobOrContent({
                            file: entrypoint,
                            marker: marker,
                            store: common_1.STORE_BLOB,
                        });
                        if (addition) {
                            addition = common_1.normalizePath(addition);
                            this.appendBlobOrContent({
                                file: addition,
                                marker: marker,
                                store: blobOrContent(addition),
                            });
                        }
                        tasks = this.tasks;
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < tasks.length)) return [3 /*break*/, 5];
                        // NO MULTIPLE WORKERS! THIS WILL LEAD TO NON-DETERMINISTIC
                        // ORDER. one-by-one fifo is the only way to iterate tasks
                        return [4 /*yield*/, this.step(tasks[i])];
                    case 3:
                        // NO MULTIPLE WORKERS! THIS WILL LEAD TO NON-DETERMINISTIC
                        // ORDER. one-by-one fifo is the only way to iterate tasks
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i += 1;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, {
                            symLinks: this.symLinks,
                            records: this.records,
                            entrypoint: common_1.normalizePath(entrypoint),
                        }];
                }
            });
        });
    };
    return Walker;
}());
function walker() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return __awaiter(this, void 0, void 0, function () {
        var w;
        return __generator(this, function (_a) {
            w = new Walker();
            return [2 /*return*/, w.start.apply(w, __spreadArray([], __read(args)))];
        });
    });
}
exports.default = walker;
//# sourceMappingURL=walker.js.map