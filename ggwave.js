var ggwave_factory = (function() {
    var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
    if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
    return (
        function(ggwave_factory) {
            ggwave_factory = ggwave_factory || {};

            var Module = typeof ggwave_factory !== "undefined" ? ggwave_factory : {};
            var readyPromiseResolve, readyPromiseReject;
            Module["ready"] = new Promise(function(resolve, reject) {
                readyPromiseResolve = resolve;
                readyPromiseReject = reject
            });
            var moduleOverrides = {};
            var key;
            for (key in Module) { if (Module.hasOwnProperty(key)) { moduleOverrides[key] = Module[key] } }
            var arguments_ = [];
            var thisProgram = "./this.program";
            var quit_ = function(status, toThrow) { throw toThrow };
            var ENVIRONMENT_IS_WEB = false;
            var ENVIRONMENT_IS_WORKER = false;
            var ENVIRONMENT_IS_NODE = false;
            var ENVIRONMENT_IS_SHELL = false;
            ENVIRONMENT_IS_WEB = typeof window === "object";
            ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
            ENVIRONMENT_IS_NODE = typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node === "string";
            ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
            var scriptDirectory = "";

            function locateFile(path) { if (Module["locateFile"]) { return Module["locateFile"](path, scriptDirectory) } return scriptDirectory + path }
            var read_, readAsync, readBinary, setWindowTitle;
            var nodeFS;
            var nodePath;
            if (ENVIRONMENT_IS_NODE) {
                if (ENVIRONMENT_IS_WORKER) { scriptDirectory = require("path").dirname(scriptDirectory) + "/" } else { scriptDirectory = __dirname + "/" }
                read_ = function shell_read(filename, binary) {
                    var ret = tryParseAsDataURI(filename);
                    if (ret) { return binary ? ret : ret.toString() }
                    if (!nodeFS) nodeFS = require("fs");
                    if (!nodePath) nodePath = require("path");
                    filename = nodePath["normalize"](filename);
                    return nodeFS["readFileSync"](filename, binary ? null : "utf8")
                };
                readBinary = function readBinary(filename) {
                    var ret = read_(filename, true);
                    if (!ret.buffer) { ret = new Uint8Array(ret) }
                    assert(ret.buffer);
                    return ret
                };
                if (process["argv"].length > 1) { thisProgram = process["argv"][1].replace(/\\/g, "/") }
                arguments_ = process["argv"].slice(2);
                process["on"]("uncaughtException", function(ex) { if (!(ex instanceof ExitStatus)) { throw ex } });
                process["on"]("unhandledRejection", abort);
                quit_ = function(status) { process["exit"](status) };
                Module["inspect"] = function() { return "[Emscripten Module object]" }
            } else if (ENVIRONMENT_IS_SHELL) {
                if (typeof read != "undefined") { read_ = function shell_read(f) { var data = tryParseAsDataURI(f); if (data) { return intArrayToString(data) } return read(f) } }
                readBinary = function readBinary(f) {
                    var data;
                    data = tryParseAsDataURI(f);
                    if (data) { return data }
                    if (typeof readbuffer === "function") { return new Uint8Array(readbuffer(f)) }
                    data = read(f, "binary");
                    assert(typeof data === "object");
                    return data
                };
                if (typeof scriptArgs != "undefined") { arguments_ = scriptArgs } else if (typeof arguments != "undefined") { arguments_ = arguments }
                if (typeof quit === "function") { quit_ = function(status) { quit(status) } }
                if (typeof print !== "undefined") {
                    if (typeof console === "undefined") console = {};
                    console.log = print;
                    console.warn = console.error = typeof printErr !== "undefined" ? printErr : print
                }
            } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
                if (ENVIRONMENT_IS_WORKER) { scriptDirectory = self.location.href } else if (typeof document !== "undefined" && document.currentScript) { scriptDirectory = document.currentScript.src }
                if (_scriptDir) { scriptDirectory = _scriptDir }
                if (scriptDirectory.indexOf("blob:") !== 0) { scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf("/") + 1) } else { scriptDirectory = "" } {
                    read_ = function(url) {
                        try {
                            var xhr = new XMLHttpRequest;
                            xhr.open("GET", url, false);
                            xhr.send(null);
                            return xhr.responseText
                        } catch (err) { var data = tryParseAsDataURI(url); if (data) { return intArrayToString(data) } throw err }
                    };
                    if (ENVIRONMENT_IS_WORKER) {
                        readBinary = function(url) {
                            try {
                                var xhr = new XMLHttpRequest;
                                xhr.open("GET", url, false);
                                xhr.responseType = "arraybuffer";
                                xhr.send(null);
                                return new Uint8Array(xhr.response)
                            } catch (err) { var data = tryParseAsDataURI(url); if (data) { return data } throw err }
                        }
                    }
                    readAsync = function(url, onload, onerror) {
                        var xhr = new XMLHttpRequest;
                        xhr.open("GET", url, true);
                        xhr.responseType = "arraybuffer";
                        xhr.onload = function() {
                            if (xhr.status == 200 || xhr.status == 0 && xhr.response) { onload(xhr.response); return }
                            var data = tryParseAsDataURI(url);
                            if (data) { onload(data.buffer); return }
                            onerror()
                        };
                        xhr.onerror = onerror;
                        xhr.send(null)
                    }
                }
                setWindowTitle = function(title) { document.title = title }
            } else {}
            var out = Module["print"] || console.log.bind(console);
            var err = Module["printErr"] || console.warn.bind(console);
            for (key in moduleOverrides) { if (moduleOverrides.hasOwnProperty(key)) { Module[key] = moduleOverrides[key] } }
            moduleOverrides = null;
            if (Module["arguments"]) arguments_ = Module["arguments"];
            if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
            if (Module["quit"]) quit_ = Module["quit"];
            var tempRet0 = 0;
            var setTempRet0 = function(value) { tempRet0 = value };
            var wasmBinary;
            if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
            var noExitRuntime;
            if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];
            if (typeof WebAssembly !== "object") { abort("no native wasm support detected") }
            var wasmMemory;
            var ABORT = false;
            var EXITSTATUS;

            function assert(condition, text) { if (!condition) { abort("Assertion failed: " + text) } }
            var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;

            function UTF8ArrayToString(heap, idx, maxBytesToRead) {
                var endIdx = idx + maxBytesToRead;
                var endPtr = idx;
                while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;
                if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) { return UTF8Decoder.decode(heap.subarray(idx, endPtr)) } else {
                    var str = "";
                    while (idx < endPtr) {
                        var u0 = heap[idx++];
                        if (!(u0 & 128)) { str += String.fromCharCode(u0); continue }
                        var u1 = heap[idx++] & 63;
                        if ((u0 & 224) == 192) { str += String.fromCharCode((u0 & 31) << 6 | u1); continue }
                        var u2 = heap[idx++] & 63;
                        if ((u0 & 240) == 224) { u0 = (u0 & 15) << 12 | u1 << 6 | u2 } else { u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heap[idx++] & 63 }
                        if (u0 < 65536) { str += String.fromCharCode(u0) } else {
                            var ch = u0 - 65536;
                            str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
                        }
                    }
                }
                return str
            }

            function UTF8ToString(ptr, maxBytesToRead) { return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "" }

            function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
                if (!(maxBytesToWrite > 0)) return 0;
                var startIdx = outIdx;
                var endIdx = outIdx + maxBytesToWrite - 1;
                for (var i = 0; i < str.length; ++i) {
                    var u = str.charCodeAt(i);
                    if (u >= 55296 && u <= 57343) {
                        var u1 = str.charCodeAt(++i);
                        u = 65536 + ((u & 1023) << 10) | u1 & 1023
                    }
                    if (u <= 127) {
                        if (outIdx >= endIdx) break;
                        heap[outIdx++] = u
                    } else if (u <= 2047) {
                        if (outIdx + 1 >= endIdx) break;
                        heap[outIdx++] = 192 | u >> 6;
                        heap[outIdx++] = 128 | u & 63
                    } else if (u <= 65535) {
                        if (outIdx + 2 >= endIdx) break;
                        heap[outIdx++] = 224 | u >> 12;
                        heap[outIdx++] = 128 | u >> 6 & 63;
                        heap[outIdx++] = 128 | u & 63
                    } else {
                        if (outIdx + 3 >= endIdx) break;
                        heap[outIdx++] = 240 | u >> 18;
                        heap[outIdx++] = 128 | u >> 12 & 63;
                        heap[outIdx++] = 128 | u >> 6 & 63;
                        heap[outIdx++] = 128 | u & 63
                    }
                }
                heap[outIdx] = 0;
                return outIdx - startIdx
            }

            function stringToUTF8(str, outPtr, maxBytesToWrite) { return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite) }

            function lengthBytesUTF8(str) {
                var len = 0;
                for (var i = 0; i < str.length; ++i) {
                    var u = str.charCodeAt(i);
                    if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
                    if (u <= 127) ++len;
                    else if (u <= 2047) len += 2;
                    else if (u <= 65535) len += 3;
                    else len += 4
                }
                return len
            }
            var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : undefined;

            function UTF16ToString(ptr, maxBytesToRead) {
                var endPtr = ptr;
                var idx = endPtr >> 1;
                var maxIdx = idx + maxBytesToRead / 2;
                while (!(idx >= maxIdx) && HEAPU16[idx]) ++idx;
                endPtr = idx << 1;
                if (endPtr - ptr > 32 && UTF16Decoder) { return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr)) } else {
                    var str = "";
                    for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
                        var codeUnit = HEAP16[ptr + i * 2 >> 1];
                        if (codeUnit == 0) break;
                        str += String.fromCharCode(codeUnit)
                    }
                    return str
                }
            }

            function stringToUTF16(str, outPtr, maxBytesToWrite) {
                if (maxBytesToWrite === undefined) { maxBytesToWrite = 2147483647 }
                if (maxBytesToWrite < 2) return 0;
                maxBytesToWrite -= 2;
                var startPtr = outPtr;
                var numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
                for (var i = 0; i < numCharsToWrite; ++i) {
                    var codeUnit = str.charCodeAt(i);
                    HEAP16[outPtr >> 1] = codeUnit;
                    outPtr += 2
                }
                HEAP16[outPtr >> 1] = 0;
                return outPtr - startPtr
            }

            function lengthBytesUTF16(str) { return str.length * 2 }

            function UTF32ToString(ptr, maxBytesToRead) {
                var i = 0;
                var str = "";
                while (!(i >= maxBytesToRead / 4)) {
                    var utf32 = HEAP32[ptr + i * 4 >> 2];
                    if (utf32 == 0) break;
                    ++i;
                    if (utf32 >= 65536) {
                        var ch = utf32 - 65536;
                        str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
                    } else { str += String.fromCharCode(utf32) }
                }
                return str
            }

            function stringToUTF32(str, outPtr, maxBytesToWrite) {
                if (maxBytesToWrite === undefined) { maxBytesToWrite = 2147483647 }
                if (maxBytesToWrite < 4) return 0;
                var startPtr = outPtr;
                var endPtr = startPtr + maxBytesToWrite - 4;
                for (var i = 0; i < str.length; ++i) {
                    var codeUnit = str.charCodeAt(i);
                    if (codeUnit >= 55296 && codeUnit <= 57343) {
                        var trailSurrogate = str.charCodeAt(++i);
                        codeUnit = 65536 + ((codeUnit & 1023) << 10) | trailSurrogate & 1023
                    }
                    HEAP32[outPtr >> 2] = codeUnit;
                    outPtr += 4;
                    if (outPtr + 4 > endPtr) break
                }
                HEAP32[outPtr >> 2] = 0;
                return outPtr - startPtr
            }

            function lengthBytesUTF32(str) {
                var len = 0;
                for (var i = 0; i < str.length; ++i) {
                    var codeUnit = str.charCodeAt(i);
                    if (codeUnit >= 55296 && codeUnit <= 57343) ++i;
                    len += 4
                }
                return len
            }

            function allocateUTF8(str) { var size = lengthBytesUTF8(str) + 1; var ret = _malloc(size); if (ret) stringToUTF8Array(str, HEAP8, ret, size); return ret }

            function alignUp(x, multiple) { if (x % multiple > 0) { x += multiple - x % multiple } return x }
            var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

            function updateGlobalBufferAndViews(buf) {
                buffer = buf;
                Module["HEAP8"] = HEAP8 = new Int8Array(buf);
                Module["HEAP16"] = HEAP16 = new Int16Array(buf);
                Module["HEAP32"] = HEAP32 = new Int32Array(buf);
                Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
                Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
                Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
                Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
                Module["HEAPF64"] = HEAPF64 = new Float64Array(buf)
            }
            var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216;
            var wasmTable;
            var __ATPRERUN__ = [];
            var __ATINIT__ = [];
            var __ATMAIN__ = [];
            var __ATPOSTRUN__ = [];
            var runtimeInitialized = false;
            __ATINIT__.push({ func: function() { ___wasm_call_ctors() } });

            function preRun() {
                if (Module["preRun"]) { if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]]; while (Module["preRun"].length) { addOnPreRun(Module["preRun"].shift()) } }
                callRuntimeCallbacks(__ATPRERUN__)
            }

            function initRuntime() {
                runtimeInitialized = true;
                callRuntimeCallbacks(__ATINIT__)
            }

            function preMain() { callRuntimeCallbacks(__ATMAIN__) }

            function postRun() {
                if (Module["postRun"]) { if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]]; while (Module["postRun"].length) { addOnPostRun(Module["postRun"].shift()) } }
                callRuntimeCallbacks(__ATPOSTRUN__)
            }

            function addOnPreRun(cb) { __ATPRERUN__.unshift(cb) }

            function addOnPostRun(cb) { __ATPOSTRUN__.unshift(cb) }
            var runDependencies = 0;
            var runDependencyWatcher = null;
            var dependenciesFulfilled = null;

            function addRunDependency(id) { runDependencies++; if (Module["monitorRunDependencies"]) { Module["monitorRunDependencies"](runDependencies) } }

            function removeRunDependency(id) {
                runDependencies--;
                if (Module["monitorRunDependencies"]) { Module["monitorRunDependencies"](runDependencies) }
                if (runDependencies == 0) {
                    if (runDependencyWatcher !== null) {
                        clearInterval(runDependencyWatcher);
                        runDependencyWatcher = null
                    }
                    if (dependenciesFulfilled) {
                        var callback = dependenciesFulfilled;
                        dependenciesFulfilled = null;
                        callback()
                    }
                }
            }
            Module["preloadedImages"] = {};
            Module["preloadedAudios"] = {};

            function abort(what) {
                if (Module["onAbort"]) { Module["onAbort"](what) }
                what += "";
                err(what);
                ABORT = true;
                EXITSTATUS = 1;
                what = "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
                var e = new WebAssembly.RuntimeError(what);
                readyPromiseReject(e);
                throw e
            }

            function hasPrefix(str, prefix) { return String.prototype.startsWith ? str.startsWith(prefix) : str.indexOf(prefix) === 0 }
            var dataURIPrefix = "data:application/octet-stream;base64,";

            function isDataURI(filename) { return hasPrefix(filename, dataURIPrefix) }
            var fileURIPrefix = "file://";

            function isFileURI(filename) { return hasPrefix(filename, fileURIPrefix) }
            var wasmBinaryFile = "data:application/octet-stream;base64,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ACADIAIgBGtBfHEiBGoiAkEEayABNgIAIARBCUkNACADIAE2AgggAyABNgIEIAJBCGsgATYCACACQQxrIAE2AgAgBEEZSQ0AIAMgATYCGCADIAE2AhQgAyABNgIQIAMgATYCDCACQRBrIAE2AgAgAkEUayABNgIAIAJBGGsgATYCACACQRxrIAE2AgAgBCADQQRxQRhyIgRrIgJBIEkNACABrSIFQiCGIAWEIQUgAyAEaiEBA0AgASAFNwMYIAEgBTcDECABIAU3AwggASAFNwMAIAFBIGohASACQSBrIgJBH0sNAAsLIAALggQBA38gAkGABE8EQCAAIAEgAhAUGiAADwsgACACaiEDAkAgACABc0EDcUUEQAJAIAJBAUgEQCAAIQIMAQsgAEEDcUUEQCAAIQIMAQsgACECA0AgAiABLQAAOgAAIAFBAWohASACQQFqIgIgA08NASACQQNxDQALCwJAIANBfHEiBEHAAEkNACACIARBQGoiBUsNAANAIAIgASgCADYCACACIAEoAgQ2AgQgAiABKAIINgIIIAIgASgCDDYCDCACIAEoAhA2AhAgAiABKAIUNgIUIAIgASgCGDYCGCACIAEoAhw2AhwgAiABKAIgNgIgIAIgASgCJDYCJCACIAEoAig2AiggAiABKAIsNgIsIAIgASgCMDYCMCACIAEoAjQ2AjQgAiABKAI4NgI4IAIgASgCPDYCPCABQUBrIQEgAkFAayICIAVNDQALCyACIARPDQEDQCACIAEoAgA2AgAgAUEEaiEBIAJBBGoiAiAESQ0ACwwBCyADQQRJBEAgACECDAELIAAgA0EEayIESwRAIAAhAgwBCyAAIQIDQCACIAEtAAA6AAAgAiABLQABOgABIAIgAS0AAjoAAiACIAEtAAM6AAMgAUEEaiEBIAJBBGoiAiAETQ0ACwsgAiADSQRAA0AgAiABLQAAOgAAIAFBAWohASACQQFqIgIgA0cNAAsLIAALZQAgAkUEQCAAKAIEIAEoAgRGDwsgACABRgRAQQEPCwJ/IwBBEGsiAiAANgIIIAIgAigCCCgCBDYCDCACKAIMCwJ/IwBBEGsiACABNgIIIAAgACgCCCgCBDYCDCAAKAIMCxC7AUULFwAgAC0AAEEgcUUEQCABIAIgABBZGgsLbwEBfyMAQYACayIFJAACQCACIANMDQAg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IAAoAgAgA0dBAnRqIAE2AgAgASADNgIAIAMgATYCCCABKAIIIQILIAFBAToADCACQQA6AAwgAiACKAIAIgAoAgQiATYCACABBEAgASACNgIICyAAIAIoAgg2AgggAigCCCIBIAEoAgAgAkdBAnRqIAA2AgAgACACNgIEIAIgADYCCA8LAkAgBEUNACAELQAMDQAMAQsCQCABIAMoAgBHBEAgAyEBDAELIAMgASgCBCIANgIAIAEgAAR/IAAgAzYCCCADKAIIBSACCzYCCCADKAIIIgAgACgCACADR0ECdGogATYCACABIAM2AgQgAyABNgIIIAEoAgghAgsgAUEBOgAMIAJBADoADCACIAIoAgQiACgCACIBNgIEIAEEQCABIAI2AggLIAAgAigCCDYCCCACKAIIIgEgASgCACACR0ECdGogADYCACAAIAI2AgAgAiAANgIIDAILIARBDGohASADQQE6AAwgAiAAIAJGOgAMIAFBAToAACACIgEgAEcNAAsLC9AuAQx/IwBBEGsiDCQAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIABB9AFNBEBBjNkBKAIAIgVBECAAQQtqQXhxIABBC0kbIghBA3YiAnYiAUEDcQRAIAFBf3NBAXEgAmoiA0EDdCIBQbzZAWooAgAiBEEIaiEAAkAgBCgCCCICIAFBtNkBaiIBRgRAQYzZASAFQX4gA3dxNgIADAELQZzZASgCABogAiABNgIMIAEgAjYCCAsgBCADQQN0IgFBA3I2AgQgASAEaiIBIAEoAgRBAXI2AgQMDQsgCEGU2QEoAgAiCk0NASABBEACQEECIAJ0IgBBACAAa3IgASACdHEiAEEAIABrcUEBayIAIABBDHZBEHEiAnYiAUEFdkEIcSIAIAJyIAEgAHYiAUECdkEEcSIAciABIAB2IgFBAXZBAnEiAHIgASAAdiIBQQF2QQFxIgByIAEgAHZqIgNBA3QiAEG82QFqKAIAIgQoAggiASAAQbTZAWoiAEYEQEGM2QEgBUF+IAN3cSIFNgIADAELQZzZASgCABogASAANgIMIAAgATYCCAsgBEEIaiEAIAQgCEEDcjYCBCAEIAhqIgIgA0EDdCIBIAhrIgNBAXI2AgQgASAEaiADNgIAIAoEQCAKQQN2IgFBA3RBtNkBaiEHQaDZASgCACEEAn8gBUEB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AiwAS0EASARAQQAhAwwBCyABIQQDQCAEIgNFBEBBACEDDAILIAAgA0EBayIEai0AAEEKRw0ACyACIAAgAyACKAIkEQYAIgQgA0kNASAAIANqIQAgASADayEBIAIoAhQhBQsgBSAAIAEQIRogAiACKAIUIAFqNgIUIAEgA2ohBAsgBAtJAAJAIAFFDQAgAUHEzwAQKSIBRQ0AIAEoAgggACgCCEF/c3ENACAAKAIMIAEoAgxBABAiRQ0AIAAoAhAgASgCEEEAECIPC0EAC1IBAX8gACgCBCEEIAAoAgAiACABAn9BACACRQ0AGiAEQQh1IgEgBEEBcUUNABogAigCACABaigCAAsgAmogA0ECIARBAnEbIAAoAgAoAhwRBwALCgAgACABQQAQIgsLACAAEEMaIAAQHgsUACAAQdjLADYCACAAQQRqEGAgAAsHACAAKAIECywBAX8CfyAAKAIAQQxrIgAiASABKAIIQQFrIgE2AgggAUF/TAsEQCAAEB4LC3sCAn8BfiMAQTBrIgAkAEEBIABBIGoQFgRAQeTXASgCABoQCAALIAACfyAAQRBqIgEgADQCIDcDACABCwJ/IABBCGoiASAAQSBqQQRyNAIANwMAIAELEMUBNwMYIABBKGoiASAAKQMYNwMAIAEpAwAhAiAAQTBqJAAgAgsdACAAQZjLADYCACAAQcTLADYCACAAQQRqIAEQYws3AQJ/IAEQWCICQQ1qEB8iA0EANgIIIAMgAjYCBCADIAI2AgAgACADQQxqIAEgAkEBahAhNgIACwoAIABBzNgBEBcLCgAgAEGw2AEQGAu7AgACQCABQRRLDQACQAJAAkACQAJAAkACQAJAAkACQCABQQlrDgoAAQIDBAUGBwgJCgsgAiACKAIAIgFBBGo2AgAgACABKAIANgIADwsgAiACKAIAIgFBBGo2AgAgACABNAIANwMADwsgAiACKAIAIgFBBGo2AgAgACABNQIANwMADwsgAiACKAIAQQdqQXhxIgFBCGo2AgAgACABKQMANwMADwsgAiACKAIAIgFBBGo2AgAgACABMgEANwMADwsgAiACKAIAIgFBBGo2AgAgACABMwEANwMADwsgAiACKAIAIgFBBGo2AgAgACABMAAANwMADwsgAiACKAIAIgFBBGo2AgAgACABMQAANwMADwsgAiACKAIAQQdqQXhxIgFBCGo2AgAgACABKwMAOQMADwsgACACQQARBAALC0oBA38gACgCACwAAEEwa0EKSQRAA0AgACgCACIBLAAAIQMgACABQQFqNgIAIAMgAkEKbGpBMGshAiABLAABQTBrQQpJDQALCyACC80CAQN/IwBB0AFrIgQkACAEIAI2AswBQQAhAiAEQaABakEAQSgQIBogBCAEKALMATYCyAECQEEAIAEgBEHIAWogBEHQAGogBEGgAWogAxBGQQBIDQAgACgCTEEATiECIAAoAgAhBSAALABKQQBMBEAgACAFQV9xNgIACyAFQSBxIQYCfyAAKAIwBEAgACABIARByAFqIARB0ABqIARBoAFqIAMQRgwBCyAAQdAANgIwIAAgBEHQAGo2AhAgACAENgIcIAAgBDYCFCAAKAIsIQUgACAENgIsIAAgASAEQcgBaiAEQdAAaiAEQaABaiADEEYgBUUNABogAEEAQQAgACgCJBEGABogAEEANgIwIAAgBTYCLCAAQQA2AhwgAEEANgIQIAAoAhQaIABBADYCFEEACxogACAAKAIAIAZyNgIAIAJFDQALIARB0AFqJAALfgIBfwF+IAC9IgNCNIinQf8PcSICQf8PRwR8IAJFBEAgASAARAAAAAAAAAAAYQR/QQAFIABEAAAAAAAA8EOiIAEQaSEAIAEoAgBBQGoLNgIAIAAPCyABIAJB/gdrNgIAIANC/////////4eAf4NCgICAgICAgPA/hL8FIAALCxIAIABFBEBBAA8LIAAgARDUAQvMCQMFfwF+BHwjAEEwayIEJAACQAJAAkAgAL0iB0IgiKciAkH/////B3EiA0H61L2ABE0EQCACQf//P3FB+8MkRg0BIANB/LKLgARNBEAgB0IAWQRAIAEgAEQAAEBU+yH5v6AiAEQxY2IaYbTQvaAiCDkDACABIAAgCKFEMWNiGmG00L2gOQMIQQEhAgwFCyABIABEAABAVPsh+T+gIgBEMWNiGmG00D2gIgg5AwAgASAAIAihRDFjYhphtNA9oDkDCEF/IQIMBAsgB0IAWQRAIAEgAEQAAEBU+yEJwKAiAEQxY2IaYbTgvaAiCDkDACABIAAgCKFEMWNiGmG04L2gOQMIQQIhAgwECyABIABEAABAVPshCUCgIgBEMWNiGmG04D2gIgg5AwAgASAAIAihRDFjYhph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AgwgACgCDAsQbCEAIAFBEGokACAAC40DAgV/A3wgAEEANgIIIABCADcCACAAQYDAABAfIgE2AgAgACABQYBAayICNgIIIAFBAEGAwAAQICEDIABBADYCFCAAQgA3AgwgACACNgIEIABBgAYQHyIBNgIMIAAgAUGABmoiAjYCFCABQQBBgAYQICEEIABBADYCICAAQgA3AhggACACNgIQIABBgAIQHyIBNgIYIAAgAUGAAmoiAjYCICABQQBBgAIQICEFIABBADYCLCAAQgA3AiQgACACNgIcIABBgMAAEB8iAjYCJCAAIAJBgEBrIgE2AiwgACABNgIoIANBgICA/AM2AgBBASEBA0AgAbciBkQYLURU+yEJQKJEAAAAAAAAoD+iIgcQNCEIIAMgAUECdGogBkQYLURU+yFZP6IQR0QAAAAAAADgP6JEAAAAAAAA4D+gIAggB6O2u6K2OAIAIAFBAWoiAUGAEEcNAAsgAEIANwMwIABBQGtCADcDACAAQgA3AzggBUEAQYACECAaIARBAEGABhAgGiACQQBBgMAAECAaCwUAQbwiCxMAIABBBGpBACABKAIEQaQiRhsLXQECfyACKAIAIgIgACgCBCIEKAIAIgMgAiADSRsiAgRAIAEoAgAgACgCCCgCACACECsgACgCBCIEKAIAIQMLIAQgAyACazYCACAAKAIIIgAgACgCACACajYCACACCxQAIAFB/CA2AgAgASAAKQIENwIECxwBAX9BDBAfIgFB/CA2AgAgASAAKQIENwIEIAELBQBB7CALEwAgAEEEakEAIAEoAgRB1CBGGwszACACKAIAIgIEQCAAKAIEKAIAIAEoAgAgAhArCyAAKAIIIAIgACgCDCgCACgCFG42AgALHgAgAUGoHzYCACABIAApAgQ3AgQgASAAKAIMNgIMCyYBAX9BEBAfIgFBqB82AgAgASAAKQIENwIEIAEgACgCDDYCDCABC8cCAQV/IAAoAggoAgAgAC8BBGoiAyACKAIIKAIAIAIvAQRqIgRHBEAgBCADIAAtAAAQIRoLIAIgAC0AACIDOgAAIAAtAAAiBCABLQAAIgVrQQFqIgZBAU4EQEEAIQMDQAJAIAIoAggoAgAgAi8BBGogA2otAAAiBkUNACAFQQJJDQBBASEEA0AgASgCCCgCACABLwEEaiAEai0AACIHBEAg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IAE2AgAgASACNgIIIAEhAwsgAiACKAIIIgAtAAw6AAwgAEEBOgAMIANBAToADCAAIAAoAgAiASgCBCICNgIAIAIEQCACIAA2AggLIAEgACgCCDYCCCAAKAIIIgIgAigCACAAR0ECdGogATYCACABIAA2AgQgACABNgIIDwsgAigCCCIBIAEoAgAgAkZBAnRqKAIAIQIMAAsACyAEQQE6AAwLDwsgAS0ADA0AIAIhAwwBCyADQQE6AAwgAkEAOgAMIAIgAygCBCIANgIAIAAEQCAAIAI2AggLIAMgAigCCDYCCCACKAIIIgAgACgCACACR0ECdGogAzYCACADIAI2AgQgAiADNgIIIAIhAQsgAyADKAIIIgAtAAw6AAwgAEEBOgAMIAFBAToADCAAIAAoAgQiASgCACICNgIEIAIEQCACIAA2AggLIAEgACgCCDYCCCAAKAIIIgIgAigCACAAR0ECdGogATYCACABIAA2AgAgACABNgIIC/4FAQR/IAAoAqADIQEgAEEANgKgAyABBEAgASgCJCICBEAgASACNgIoIAIQHgsgASgCGCICBEAgASACNgIcIAIQHgsgASgCDCICBEAgASACNgIQIAIQHgsgASgCACICBEAgASACNgIEIAIQHgsgARAeCyAAKAKUAyIDBEACfyADIAMgACgCmAMiAUYNABoDQCABQQxrIgIoAgAiBARAIAFBCGsgBDYCACAEEB4LIAIiASADRw0ACyAAKAKUAwshASAAIAM2ApgDIAEQHgsgACgCiAMiAQRAIAAgATYCjAMgARAeCyAAKAL8AiIBBEAgACABNgKAAyABEB4LIAAoAvACIgEEQCAAIAE2AvQCIAEQHgsgACgC5AIiAQRAIAAgATYC6AIgARAeCyAAKALYAiIBBEAgACABNgLcAiABEB4LIAAoArwCIgEEQCAAIAE2AsACIAEQHgsgACgCsAIiAQRAIAAgATYCtAIgARAeCyAAKAKYAiIDBEACfyADIAMgACgCnAIiAUYNABoDQCABQQxrIgIoAgAiBARAIAFBCGsgBDYCACAEEB4LIAIiASADRw0ACyAAKAKYAgshASAAIAM2ApwCIAEQHgsgACgCiAIiAQRAIAAgATYCjAIgARAeCyAAKAL8ASIDBEACfyADIAMgACgCgAIiAUYNABoDQCABQQxrIgIoAgAiBARA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ACABNgIAIAAgAjYCBAwBCyAAIAI6AAsgACEBCyABIAMgAhAhIAJqQQA6AAAMAQsgAEIANwIAIABBADYCCAsgA0GAAmokAAugAQEBfyMAQUBqIgMkAAJ/QQEgACABQQAQIg0AGkEAIAFFDQAaQQAgAUH0zQAQKSIBRQ0AGiADQQhqQQRyQQBBNBAgGiADQQE2AjggA0F/NgIUIAMgADYCECADIAE2AgggASADQQhqIAIoAgBBASABKAIAKAIcEQcAIAMoAiAiAEEBRgRAIAIgAygCGDYCAAsgAEEBRgshACADQUBrJAAgAAtNAQJ/IAEtAAAhAgJAIAAtAAAiA0UNACACIANHDQADQCABLQABIQIgAC0AASIDRQ0BIAFBAWohASAAQQFqIQAgAiADRg0ACwsgAyACawsIACAAEF4QHguEAgEEfyMAQSBrIgMkACACKAIAIgRBcEkEQAJAAkAgBEELTwRAIARBEGpBcHEiBhAfIQUgAyAGQYCAgIB4cjYCCCADIAU2AgAgAyAENgIEDAELIAMgBDoACyADIQUgBEUNAQsgBSACQQRqIAQQIRoLIAQgBWpBADoAACADQRBqIAEgAyAAEQMAAkAgAywAGyIAQQBOBEAgAEH/AXEiAEEEahAvIgIgADYCACACQQRqIANBEGogABAhGgwBCyADKAIUIgFBBGoQLyICIAE2AgAgAkEEaiADKAIQIgAgARAhGiAAEB4LIAMsAAtBf0wEQCADKAIAEB4LIANBIGokACACDwsQRAALCAAgABBDEB4LBgBBgcsACzIBAX8jAEEQayIBJAAgASAAKAIENgIIIAEoAghBAToAACAAKAIIQQE6AAAgAUEQaiQACy4BAX8CQCAAKAIIIgAtAAAiAUEBRwR/IAFBAnENASAAQQI6AABBAQVBAAsPCwALNgECfyMAQRBrIgEkAAJ/IAEgACgCBDYCCCABKAIILQAARQsEQCAAEMEBIQILIAFBEGokACACCz8CAX8BfiMAQRBrIgEkACABIAApAwBCgJTr3AN+NwMAIAFBCGoiACABKQMANwMAIAApAwAhAiABQRBqJAAgAgtAAgJ/AX4jAEEQayICJAAjAEEQayIDJAAgARDDASEEIANBEGokACACIAQ3AwggACACKQMINwMAIAJBEGokACAAC1QCAX8BfiMAQSBrIgIkACACQQhq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2A1BogxBtNEAQcUOQQcgAEG00QBByQ5BCCABEARBBBAfIgBBFDYCAEEEEB8iAUEUNgIAQdgNQbcMQZwNQbwOQQkgAEGcDUHADkEKIAEQBEEEEB8iAEEYNgIAQQQQHyIBQRg2AgBB2A1BxwxBnA1BvA5BCSAAQZwNQcAOQQogARAEQdcMQQFB0A5BsA5BC0EMEAVB7AxBAkHUDkG8DkENQQ4QBUHxDEECQdwOQeQOQQ9BEBAFQfYMQQVBkA9ByBBBEUESEAVB/QxBA0HQEEHcEEETQRQQBQsL20sYAEGACAuZEVNhbXBsZUZvcm1hdABHR1dBVkVfU0FNUExFX0ZPUk1BVF9VTkRFRklORUQAR0dXQVZFX1NBTVBMRV9GT1JNQVRfVTgAR0dXQVZFX1NBTVBMRV9GT1JNQVRfSTgAR0dXQVZFX1NBTVBMRV9GT1JNQVRfVTE2AEdHV0FWRV9TQU1QTEVfRk9STUFUX0kxNgBHR1dBVkVfU0FNUExFX0ZPUk1BVF9GMzIAVHhQcm90b2NvbElkAEdHV0FWRV9UWF9QUk9UT0NPTF9BVURJQkxFX05PUk1BTABHR1dBVkVfVFhfUFJPVE9DT0xfQVVESUJMRV9GQVNUAEdHV0FWRV9UWF9QUk9UT0NPTF9BVURJQkxFX0ZBU1RFU1QAR0dXQVZFX1RYX1BST1RPQ09MX1VMVFJBU09VTkRfTk9STUFMAEdHV0FWRV9UWF9QUk9UT0NPTF9VTFRSQVNPVU5EX0ZBU1QAR0dXQVZFX1RYX1BST1RPQ09MX1VMVFJBU09VTkRfRkFTVEVTVABHR1dBVkVfVFhfUFJPVE9DT0xfRFRfTk9STUFMAEdHV0FWRV9UWF9QUk9UT0NPTF9EVF9GQVNUAEdHV0FWRV9UWF9QUk9UT0NPTF9EVF9GQVNURVNUAFBhcmFtZXRlcnMAcGF5bG9hZExlbmd0aABzYW1wbGVSYXRlSW5wAHNhbXBsZVJhdGVPdXQAc2FtcGxlc1BlckZyYW1lAHNvdW5kTWFya2VyVGhyZXNob2xkAHNhbXBsZUZvcm1hdElucABzYW1wbGVGb3JtYXRPdXQAZ2V0RGVmYXVsdFBhcmFtZXRlcnMAaW5pdABmcmVlAGVuY29kZQBkZWNvZGUAMTlnZ3dhdmVfU2FtcGxlRm9ybWF0AAAA0CgAAIQGAAAxOWdnd2F2ZV9UeFByb3RvY29sSWQAAADQKAAApAYAADE3Z2d3YXZlX1BhcmFtZXRlcnMAHCkAAMQGAABQMTdnZ3dhdmVfUGFyYW1ldGVycwAAAAD8KQAA4AYAAAAAAADYBgAAUEsxN2dnd2F2ZV9QYXJhbWV0ZXJzAAAA/CkAAAgHAAABAAAA2AYAAGlpAHYAdmkA+AYAAGlpaQB2aWlpAGZpaQB2aWlmAAAA2AYAAIQoAADYBgAAJCgAAIQoAAB2aWkATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJY0VFAAAcKQAAaAcAALgHAACEKAAAMAgAALwGAACEKAAATjEwZW1zY3JpcHRlbjN2YWxFAAAcKQAApAcAAE5TdDNfXzIxMmJhc2ljX3N0cmluZ0ljTlNfMTFjaGFyX3RyYWl0c0ljRUVOU185YWxsb2NhdG9ySWNFRUVFAE5TdDNfXzIyMV9fYmFzaWNfc3RyaW5nX2NvbW1vbklMYjFFRUUAAAAAHCkAAP8HAACgKQAAwAcAAAAAAAABAAAAKAgAAAAAAABpaWlpaWkAADAIAACEKAAAMAgAAGlpaWkASW52YWxpZCBHR1dhdmUgaW5zdGFuY2UgJWQKAEZhaWxlZCB0byBpbml0aWFsaXplIEdHV2F2ZSBpbnN0YW5jZSAlZAoASW52YWxpZCBwYXlsb2FkIGxlZ250aABJbnZhbGlkIG9yIHVuc3VwcG9ydGVkIGNhcHR1cmUgc2FtcGxlIGZvcm1hdABJbnZhbGlkIG9yIHVuc3VwcG9ydGVkIHBsYXliYWNrIHNhbXBsZSBmb3JtYXQASW52YWxpZCBzYW1wbGVzIHBlciBmcmFtZQBFcnJvcjogY2FwdHVyZSBzYW1wbGUgcmF0ZSAoJWcgSHopIG11c3QgYmUgPj0gJWcgSHoKAEludmFsaWQgY2FwdHVyZS9wbGF5YmFjayBzYW1wbGUgcmF0ZQBFcnJvcjogY2FwdHVyZSBzYW1wbGUgcmF0ZSAoJWcgSHopIG11c3QgYmUgPD0gJWcgSHoKAE5lZ2F0aXZlIGRhdGEgc2l6ZTogJWQKAFRydW5jYXRpbmcgZGF0YSBmcm9tICVkIHRvICVkIGJ5dGVzCgBJbnZhbGlkIHZvbHVtZTogJWQKAEZhaWx1cmUgZHVyaW5nIGNhcHR1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Y29kZUUzJF8xAAAAHCkAACQRAAAAAAAAAQAAAAEAAAACAAAAAgAAAAQAAAB2b2lkAGJvb2wAY2hhcgBzaWduZWQgY2hhcgB1bnNpZ25lZCBjaGFyAHNob3J0AHVuc2lnbmVkIHNob3J0AGludAB1bnNpZ25lZCBpbnQAbG9uZwB1bnNpZ25lZCBsb25nAGZsb2F0AGRvdWJsZQBzdGQ6OnN0cmluZwBzdGQ6OmJhc2ljX3N0cmluZzx1bnNpZ25lZCBjaGFyPgBzdGQ6OndzdHJpbmcAc3RkOjp1MTZzdHJpbmcAc3RkOjp1MzJzdHJpbmcAZW1zY3JpcHRlbjo6dmFsAGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGNoYXI+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHNpZ25lZCBjaGFyPgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1bnNpZ25lZCBjaGFyPgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxzaG9ydD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dW5zaWduZWQgc2hvcnQ+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGludD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dW5zaWduZWQgaW50PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxsb25nPgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1bnNpZ25lZCBsb25nPgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxpbnQ4X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVpbnQ4X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGludDE2X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVpbnQxNl90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxpbnQzMl90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1aW50MzJfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8ZmxvYXQ+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGRvdWJsZT4ATlN0M19fMjEyYmFzaWNfc3RyaW5nSWhOU18xMWNoYXJfdHJhaXRzSWhFRU5TXzlhbGxvY2F0b3JJaEVFRUUAAAAAoCkAAHIUAAAAAAAAAQAAACgIAAAAAAAATlN0M19fMjEyYmFzaWNfc3RyaW5nSXdOU18xMWNoYXJfdHJhaXRzSXdFRU5TXzlhbGxvY2F0b3JJd0VFRUUAAKApAADMFAAAAAAAAAEAAAAoCAAAAAAAAE5TdDNfXzIxMmJhc2ljX3N0cmluZ0lEc05TXzExY2hhcl90cmFpdHNJRHNFRU5TXzlhbGxvY2F0b3JJRHNFRUVFAAAAoCkAACQVAAAAAAAAAQAAACgIAAAAAAAATlN0M19fMjEyYmFzaWNfc3RyaW5nSURpTlNfMTFjaGFyX3RyYWl0c0lEaUVFTlNfOWFsbG9jYXRvcklEaUVFRUUAAACgKQAAgBUAAAAAAAABAAAAKAgAAAAAAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0lhRUUAABwpAADcFQAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJaEVFAAAcKQAABBYAAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SXNFRQAAHCkAACwWAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0l0RUUAABwpAABUFgAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJaUVFAAAcKQAAfBYAAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SWpFRQAAHCkAAKQWAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0lsRUUAABwpAADMFgAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJbUVFAAAcKQAA9BYAAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SWZFRQAAHCkAABwXAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0lkRUUAABwpAABEFwAAAAAAAAMAAAAEAAAABAAAAAYAAACD+aIARE5uAPwpFQDRVycA3TT1AGLbwAA8mZUAQZBDAGNR/gC73qsAt2HFADpuJADSTUIASQbgAAnqLgAcktEA6x3+ACmxHADoPqcA9TWCAES7LgCc6YQAtCZwAEF+XwDWkTkAU4M5AJz0OQCLX4QAKPm9APgfOwDe/5cAD5gFABEv7wAKWosAbR9tAM9+NgAJyycARk+3AJ5mPwAt6l8Auid1AOXrxwA9e/EA9zkHAJJSigD7a+oA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";
            if (!isDataURI(wasmBinaryFile)) { wasmBinaryFile = locateFile(wasmBinaryFile) }

            function getBinary(file) { try { if (file == wasmBinaryFile && wasmBinary) { return new Uint8Array(wasmBinary) } var binary = tryParseAsDataURI(file); if (binary) { return binary } if (readBinary) { return readBinary(file) } else { throw "both async and sync fetching of the wasm failed" } } catch (err) { abort(err) } }

            function getBinaryPromise() { if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) { if (typeof fetch === "function" && !isFileURI(wasmBinaryFile)) { return fetch(wasmBinaryFile, { credentials: "same-origin" }).then(function(response) { if (!response["ok"]) { throw "failed to load wasm binary file at '" + wasmBinaryFile + "'" } return response["arrayBuffer"]() }).catch(function() { return getBinary(wasmBinaryFile) }) } else { if (readAsync) { return new Promise(function(resolve, reject) { readAsync(wasmBinaryFile, function(response) { resolve(new Uint8Array(response)) }, reject) }) } } } return Promise.resolve().then(function() { return getBinary(wasmBinaryFile) }) }

            function createWasm() {
                var info = { "a": asmLibraryArg };

                function receiveInstance(instance, module) {
                    var exports = instance.exports;
                    Module["asm"] = exports;
                    wasmMemory = Module["asm"]["E"];
                    updateGlobalBufferAndViews(wasmMemory.buffer);
                    wasmTable = Module["asm"]["F"];
                    removeRunDependency("wasm-instantiate")
                }
                addRunDependency("wasm-instantiate");

                function receiveInstantiatedSource(output) { receiveInstance(output["instance"]) }

                function instantiateArrayBuffer(receiver) {
                    return getBinaryPromise().then(function(binary) { return WebAssembly.instantiate(binary, info) }).then(receiver, function(reason) {
                        err("failed to asynchronously prepare wasm: " + reason);
                        abort(reason)
                    })
                }

                function instantiateAsync() {
                    if (!wasmBinary && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && !isFileURI(wasmBinaryFile) && typeof fetch === "function") {
                        return fetch(wasmBinaryFile, { credentials: "same-origin" }).then(function(response) {
                            var result = WebAssembly.instantiateStreaming(response, info);
                            return result.then(receiveInstantiatedSource, function(reason) {
                                err("wasm streaming compile failed: " + reason);
                                err("falling back to ArrayBuffer instantiation");
                                return instantiateArrayBuffer(receiveInstantiatedSource)
                            })
                        })
                    } else { return instantiateArrayBuffer(receiveInstantiatedSource) }
                }
                if (Module["instantiateWasm"]) { try { var exports = Module["instantiateWasm"](info, receiveInstance); return exports } catch (e) { err("Module.instantiateWasm callback failed with error: " + e); return false } }
                instantiateAsync().catch(readyPromiseReject);
                return {}
            }

            function callRuntimeCallbacks(callbacks) { while (callbacks.length > 0) { var callback = callbacks.shift(); if (typeof callback == "function") { callback(Module); continue } var func = callback.func; if (typeof func === "number") { if (callback.arg === undefined) { wasmTable.get(func)() } else { wasmTable.get(func)(callback.arg) } } else { func(callback.arg === undefined ? null : callback.arg) } } }

            function _tzset() {
                if (_tzset.called) return;
                _tzset.called = true;
                var currentYear = (new Date).getFullYear();
                var winter = new Date(currentYear, 0, 1);
                var summer = new Date(currentYear, 6, 1);
                var winterOffset = winter.getTimezoneOffset();
                var summerOffset = summer.getTimezoneOffset();
                var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
                HEAP32[__get_timezone() >> 2] = stdTimezoneOffset * 60;
                HEAP32[__get_daylight() >> 2] = Number(winterOffset != summerOffset);

                function extractZone(date) { var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/); return match ? match[1] : "GMT" }
                var winterName = extractZone(winter);
                var summerName = extractZone(summer);
                var winterNamePtr = allocateUTF8(winterName);
                var summerNamePtr = allocateUTF8(summerName);
                if (summerOffset < winterOffset) {
                    HEAP32[__get_tzname() >> 2] = winterNamePtr;
                    HEAP32[__get_tzname() + 4 >> 2] = summerNamePtr
                } else {
                    HEAP32[__get_tzname() >> 2] = summerNamePtr;
                    HEAP32[__get_tzname() + 4 >> 2] = winterNamePtr
                }
            }

            function _asctime_r(tmPtr, buf) {
                var date = { tm_sec: HEAP32[tmPtr >> 2], tm_min: HEAP32[tmPtr + 4 >> 2], tm_hour: HEAP32[tmPtr + 8 >> 2], tm_mday: HEAP32[tmPtr + 12 >> 2], tm_mon: HEAP32[tmPtr + 16 >> 2], tm_year: HEAP32[tmPtr + 20 >> 2], tm_wday: HEAP32[tmPtr + 24 >> 2] };
                var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                var s = days[date.tm_wday] + " " + months[date.tm_mon] + (date.tm_mday < 10 ? "  " : " ") + date.tm_mday + (date.tm_hour < 10 ? " 0" : " ") + date.tm_hour + (date.tm_min < 10 ? ":0" : ":") + date.tm_min + (date.tm_sec < 10 ? ":0" : ":") + date.tm_sec + " " + (1900 + date.tm_year) + "\n";
                stringToUTF8(s, buf, 26);
                return buf
            }

            function ___asctime_r(a0, a1) { return _asctime_r(a0, a1) }
            var ExceptionInfoAttrs = { DESTRUCTOR_OFFSET: 0, REFCOUNT_OFFSET: 4, TYPE_OFFSET: 8, CAUGHT_OFFSET: 12, RETHROWN_OFFSET: 13, SIZE: 16 };

            function ___cxa_allocate_exception(size) { return _malloc(size + ExceptionInfoAttrs.SIZE) + ExceptionInfoAttrs.SIZE }

            function ExceptionInfo(excPtr) {
                this.excPtr = excPtr;
                this.ptr = excPtr - ExceptionInfoAttrs.SIZE;
                this.set_type = function(type) { HEAP32[this.ptr + ExceptionInfoAttrs.TYPE_OFFSET >> 2] = type };
                this.get_type = function() { return HEAP32[this.ptr + ExceptionInfoAttrs.TYPE_OFFSET >> 2] };
                this.set_destructor = function(destructor) { HEAP32[this.ptr + ExceptionInfoAttrs.DESTRUCTOR_OFFSET >> 2] = destructor };
                this.get_destructor = function() { return HEAP32[this.ptr + ExceptionInfoAttrs.DESTRUCTOR_OFFSET >> 2] };
                this.set_refcount = function(refcount) { HEAP32[this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET >> 2] = refcount };
                this.set_caught = function(caught) {
                    caught = caught ? 1 : 0;
                    HEAP8[this.ptr + ExceptionInfoAttrs.CAUGHT_OFFSET >> 0] = caught
                };
                this.get_caught = function() { return HEAP8[this.ptr + ExceptionInfoAttrs.CAUGHT_OFFSET >> 0] != 0 };
                this.set_rethrown = function(rethrown) {
                    rethrown = rethrown ? 1 : 0;
                    HEAP8[this.ptr + ExceptionInfoAttrs.RETHROWN_OFFSET >> 0] = rethrown
                };
                this.get_rethrown = function() { return HEAP8[this.ptr + ExceptionInfoAttrs.RETHROWN_OFFSET >> 0] != 0 };
                this.init = function(type, destructor) {
                    this.set_type(type);
                    this.set_destructor(destructor);
                    this.set_refcount(0);
                    this.set_caught(false);
                    this.set_rethrown(false)
                };
                this.add_ref = function() {
                    var value = HEAP32[this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET >> 2];
                    HEAP32[this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET >> 2] = value + 1
                };
                this.release_ref = function() {
                    var prev = HEAP32[this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET >> 2];
                    HEAP32[this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET >> 2] = prev - 1;
                    return prev === 1
                }
            }
            var exceptionLast = 0;
            var uncaughtExceptionCount = 0;

            function ___cxa_throw(ptr, type, destructor) {
                var info = new ExceptionInfo(ptr);
                info.init(type, destructor);
                exceptionLast = ptr;
                uncaughtExceptionCount++;
                throw ptr
            }

            function _localtime_r(time, tmPtr) {
                _tzset();
                var date = new Date(HEAP32[time >> 2] * 1e3);
                HEAP32[tmPtr >> 2] = date.getSeconds();
                HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
                HEAP32[tmPtr + 8 >> 2] = date.getHours();
                HEAP32[tmPtr + 12 >> 2] = date.getDate();
                HEAP32[tmPtr + 16 >> 2] = date.getMonth();
                HEAP32[tmPtr + 20 >> 2] = date.getFullYear() - 1900;
                HEAP32[tmPtr + 24 >> 2] = date.getDay();
                var start = new Date(date.getFullYear(), 0, 1);
                var yday = (date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24) | 0;
                HEAP32[tmPtr + 28 >> 2] = yday;
                HEAP32[tmPtr + 36 >> 2] = -(date.getTimezoneOffset() * 60);
                var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
                var winterOffset = start.getTimezoneOffset();
                var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
                HEAP32[tmPtr + 32 >> 2] = dst;
                var zonePtr = HEAP32[__get_tzname() + (dst ? 4 : 0) >> 2];
                HEAP32[tmPtr + 40 >> 2] = zonePtr;
                return tmPtr
            }

            function ___localtime_r(a0, a1) { return _localtime_r(a0, a1) }

            function getShiftFromSize(size) {
                switch (size) {
                    case 1:
                        return 0;
                    case 2:
                        return 1;
                    case 4:
                        return 2;
                    case 8:
                        return 3;
                    default:
                        throw new TypeError("Unknown type size: " + size)
                }
            }

            function embind_init_charCodes() {
                var codes = new Array(256);
                for (var i = 0; i < 256; ++i) { codes[i] = String.fromCharCode(i) }
                embind_charCodes = codes
            }
            var embind_charCodes = undefined;

            function readLatin1String(ptr) { var ret = ""; var c = ptr; while (HEAPU8[c]) { ret += embind_charCodes[HEAPU8[c++]] } return ret }
            var awaitingDependencies = {};
            var registeredTypes = {};
            var typeDependencies = {};
            var char_0 = 48;
            var char_9 = 57;

            function makeLegalFunctionName(name) {
                if (undefined === name) { return "_unknown" }
                name = name.replace(/[^a-zA-Z0-9_]/g, "$");
                var f = name.charCodeAt(0);
                if (f >= char_0 && f <= char_9) { return "_" + name } else { return name }
            }

            function createNamedFunction(name, body) { name = makeLegalFunctionName(name); return new Function("body", "return function " + name + "() {\n" + '    "use strict";' + "    return body.apply(this, arguments);\n" + "};\n")(body) }

            function extendError(baseErrorType, errorName) {
                var errorClass = createNamedFunction(errorName, function(message) {
                    this.name = errorName;
                    this.message = message;
                    var stack = new Error(message).stack;
                    if (stack !== undefined) { this.stack = this.toString() + "\n" + stack.replace(/^Error(:[^\n]*)?\n/, "") }
                });
                errorClass.prototype = Object.create(baseErrorType.prototype);
                errorClass.prototype.constructor = errorClass;
                errorClass.prototype.toString = function() { if (this.message === undefined) { return this.name } else { return this.name + ": " + this.message } };
                return errorClass
            }
            var BindingError = undefined;

            function throwBindingError(message) { throw new BindingError(message) }
            var InternalError = undefined;

            function throwInternalError(message) { throw new InternalError(message) }

            function whenDependentTypesAreResolved(myTypes, dependentTypes, getTypeConverters) {
                myTypes.forEach(function(type) { typeDependencies[type] = dependentTypes });

                function onComplete(typeConverters) { var myTypeConverters = getTypeConverters(typeConverters); if (myTypeConverters.length !== myTypes.length) { throwInternalError("Mismatched type converter count") } for (var i = 0; i < myTypes.length; ++i) { registerType(myTypes[i], myTypeConverters[i]) } }
                var typeConverters = new Array(dependentTypes.length);
                var unregisteredTypes = [];
                var registered = 0;
                dependentTypes.forEach(function(dt, i) {
                    if (registeredTypes.hasOwnProperty(dt)) { typeConverters[i] = registeredTypes[dt] } else {
                        unregisteredTypes.push(dt);
                        if (!awaitingDependencies.hasOwnProperty(dt)) { awaitingDependencies[dt] = [] }
                        awaitingDependencies[dt].push(function() { typeConverters[i] = registeredTypes[dt];++registered; if (registered === unregisteredTypes.length) { onComplete(typeConverters) } })
                    }
                });
                if (0 === unregisteredTypes.length) { onComplete(typeConverters) }
            }

            function registerType(rawType, registeredInstance, options) {
                options = options || {};
                if (!("argPackAdvance" in registeredInstance)) { throw new TypeError("registerType registeredInstance requires argPackAdvance") }
                var name = registeredInstance.name;
                if (!rawType) { throwBindingError('type "' + name + '" must have a positive integer typeid pointer') }
                if (registeredTypes.hasOwnProperty(rawType)) { if (options.ignoreDuplicateRegistrations) { return } else { throwBindingError("Cannot register type '" + name + "' twice") } }
                registeredTypes[rawType] = registeredInstance;
                delete typeDependencies[rawType];
                if (awaitingDependencies.hasOwnProperty(rawType)) {
                    var callbacks = awaitingDependencies[rawType];
                    delete awaitingDependencies[rawType];
                    callbacks.forEach(function(cb) { cb() })
                }
            }

            function __embind_register_bool(rawType, name, size, trueValue, falseValue) {
                var shift = getShiftFromSize(size);
                name = readLatin1String(name);
                registerType(rawType, { name: name, "fromWireType": function(wt) { return !!wt }, "toWireType": function(destructors, o) { return o ? trueValue : falseValue }, "argPackAdvance": 8, "readValueFromPointer": function(pointer) { var heap; if (size === 1) { heap = HEAP8 } else if (size === 2) { heap = HEAP16 } else if (size === 4) { heap = HEAP32 } else { throw new TypeError("Unknown boolean type size: " + name) } return this["fromWireType"](heap[pointer >> shift]) }, destructorFunction: null })
            }

            function ClassHandle_isAliasOf(other) {
                if (!(this instanceof ClassHandle)) { return false }
                if (!(other instanceof ClassHandle)) { return false }
                var leftClass = this.$$.ptrType.registeredClass;
                var left = this.$$.ptr;
                var rightClass = other.$$.ptrType.registeredClass;
                var right = other.$$.ptr;
                while (leftClass.baseClass) {
                    left = leftClass.upcast(left);
                    leftClass = leftClass.baseClass
                }
                while (rightClass.baseClass) {
                    right = rightClass.upcast(right);
                    rightClass = rightClass.baseClass
                }
                return leftClass === rightClass && left === right
            }

            function shallowCopyInternalPointer(o) { return { count: o.count, deleteScheduled: o.deleteScheduled, preservePointerOnDelete: o.preservePointerOnDelete, ptr: o.ptr, ptrType: o.ptrType, smartPtr: o.smartPtr, smartPtrType: o.smartPtrType } }

            function throwInstanceAlreadyDeleted(obj) {
                function getInstanceTypeName(handle) { return handle.$$.ptrType.registeredClass.name }
                throwBindingError(getInstanceTypeName(obj) + " instance already deleted")
            }
            var finalizationGroup = false;

            function detachFinalizer(handle) {}

            function runDestructor($$) { if ($$.smartPtr) { $$.smartPtrType.rawDestructor($$.smartPtr) } else { $$.ptrType.registeredClass.rawDestructor($$.ptr) } }

            function releaseClassHandle($$) { $$.count.value -= 1; var toDelete = 0 === $$.count.value; if (toDelete) { runDestructor($$) } }

            function attachFinalizer(handle) {
                if ("undefined" === typeof FinalizationGroup) { attachFinalizer = function(handle) { return handle }; return handle }
                finalizationGroup = new FinalizationGroup(function(iter) { for (var result = iter.next(); !result.done; result = iter.next()) { var $$ = result.value; if (!$$.ptr) { console.warn("object already deleted: " + $$.ptr) } else { releaseClassHandle($$) } } });
                attachFinalizer = function(handle) { finalizationGroup.register(handle, handle.$$, handle.$$); return handle };
                detachFinalizer = function(handle) { finalizationGroup.unregister(handle.$$) };
                return attachFinalizer(handle)
            }

            function ClassHandle_clone() {
                if (!this.$$.ptr) { throwInstanceAlreadyDeleted(this) }
                if (this.$$.preservePointerOnDelete) { this.$$.count.value += 1; return this } else {
                    var clone = attachFinalizer(Object.create(Object.getPrototypeOf(this), { $$: { value: shallowCopyInternalPointer(this.$$) } }));
                    clone.$$.count.value += 1;
                    clone.$$.deleteScheduled = false;
                    return clone
                }
            }

            function ClassHandle_delete() {
                if (!this.$$.ptr) { throwInstanceAlreadyDeleted(this) }
                if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) { throwBindingError("Object already scheduled for deletion") }
                detachFinalizer(this);
                releaseClassHandle(this.$$);
                if (!this.$$.preservePointerOnDelete) {
                    this.$$.smartPtr = undefined;
                    this.$$.ptr = undefined
                }
            }

            function ClassHandle_isDeleted() { return !this.$$.ptr }
            var delayFunction = undefined;
            var deletionQueue = [];

            function flushPendingDeletes() {
                while (deletionQueue.length) {
                    var obj = deletionQueue.pop();
                    obj.$$.deleteScheduled = false;
                    obj["delete"]()
                }
            }

            function ClassHandle_deleteLater() {
                if (!this.$$.ptr) { throwInstanceAlreadyDeleted(this) }
                if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) { throwBindingError("Object already scheduled for deletion") }
                deletionQueue.push(this);
                if (deletionQueue.length === 1 && delayFunction) { delayFunction(flushPendingDeletes) }
                this.$$.deleteScheduled = true;
                return this
            }

            function init_ClassHandle() {
                ClassHandle.prototype["isAliasOf"] = ClassHandle_isAliasOf;
                ClassHandle.prototype["clone"] = ClassHandle_clone;
                ClassHandle.prototype["delete"] = ClassHandle_delete;
                ClassHandle.prototype["isDeleted"] = ClassHandle_isDeleted;
                ClassHandle.prototype["deleteLater"] = ClassHandle_deleteLater
            }

            function ClassHandle() {}
            var registeredPointers = {};

            function ensureOverloadTable(proto, methodName, humanName) {
                if (undefined === proto[methodName].overloadTable) {
                    var prevFunc = proto[methodName];
                    proto[methodName] = function() { if (!proto[methodName].overloadTable.hasOwnProperty(arguments.length)) { throwBindingError("Function '" + humanName + "' called with an invalid number of arguments (" + arguments.length + ") - expects one of (" + proto[methodName].overloadTable + ")!") } return proto[methodName].overloadTable[arguments.length].apply(this, arguments) };
                    proto[methodName].overloadTable = [];
                    proto[methodName].overloadTable[prevFunc.argCount] = prevFunc
                }
            }

            function exposePublicSymbol(name, value, numArguments) {
                if (Module.hasOwnProperty(name)) {
                    if (undefined === numArguments || undefined !== Module[name].overloadTable && undefined !== Module[name].overloadTable[numArguments]) { throwBindingError("Cannot register public name '" + name + "' twice") }
                    ensureOverloadTable(Module, name, name);
                    if (Module.hasOwnProperty(numArguments)) { throwBindingError("Cannot register multiple overloads of a function with the same number of arguments (" + numArguments + ")!") }
                    Module[name].overloadTable[numArguments] = value
                } else { Module[name] = value; if (undefined !== numArguments) { Module[name].numArguments = numArguments } }
            }

            function RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast) {
                this.name = name;
                this.constructor = constructor;
                this.instancePrototype = instancePrototype;
                this.rawDestructor = rawDestructor;
                this.baseClass = baseClass;
                this.getActualType = getActualType;
                this.upcast = upcast;
                this.downcast = downcast;
                this.pureVirtualFunctions = []
            }

            function upcastPointer(ptr, ptrClass, desiredClass) {
                while (ptrClass !== desiredClass) {
                    if (!ptrClass.upcast) { throwBindingError("Expected null or instance of " + desiredClass.name + ", got an instance of " + ptrClass.name) }
                    ptr = ptrClass.upcast(ptr);
                    ptrClass = ptrClass.baseClass
                }
                return ptr
            }

            function constNoSmartPtrRawPointerToWireType(destructors, handle) { if (handle === null) { if (this.isReference) { throwBindingError("null is not a valid " + this.name) } return 0 } if (!handle.$$) { throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name) } if (!handle.$$.ptr) { throwBindingError("Cannot pass deleted object as a pointer of type " + this.name) } var handleClass = handle.$$.ptrType.registeredClass; var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass); return ptr }

            function genericPointerToWireType(destructors, handle) {
                var ptr;
                if (handle === null) { if (this.isReference) { throwBindingError("null is not a valid " + this.name) } if (this.isSmartPointer) { ptr = this.rawConstructor(); if (destructors !== null) { destructors.push(this.rawDestructor, ptr) } return ptr } else { return 0 } }
                if (!handle.$$) { throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name) }
                if (!handle.$$.ptr) { throwBindingError("Cannot pass deleted object as a pointer of type " + this.name) }
                if (!this.isConst && handle.$$.ptrType.isConst) { throwBindingError("Cannot convert argument of type " + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + " to parameter type " + this.name) }
                var handleClass = handle.$$.ptrType.registeredClass;
                ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
                if (this.isSmartPointer) {
                    if (undefined === handle.$$.smartPtr) { throwBindingError("Passing raw pointer to smart pointer is illegal") }
                    switch (this.sharingPolicy) {
                        case 0:
                            if (handle.$$.smartPtrType === this) { ptr = handle.$$.smartPtr } else { throwBindingError("Cannot convert argument of type " + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + " to parameter type " + this.name) }
                            break;
                        case 1:
                            ptr = handle.$$.smartPtr;
                            break;
                        case 2:
                            if (handle.$$.smartPtrType === this) { ptr = handle.$$.smartPtr } else {
                                var clonedHandle = handle["clone"]();
                                ptr = this.rawShare(ptr, __emval_register(function() { clonedHandle["delete"]() }));
                                if (destructors !== null) { destructors.push(this.rawDestructor, ptr) }
                            }
                            break;
                        default:
                            throwBindingError("Unsupporting sharing policy")
                    }
                }
                return ptr
            }

            function nonConstNoSmartPtrRawPointerToWireType(destructors, handle) { if (handle === null) { if (this.isReference) { throwBindingError("null is not a valid " + this.name) } return 0 } if (!handle.$$) { throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name) } if (!handle.$$.ptr) { throwBindingError("Cannot pass deleted object as a pointer of type " + this.name) } if (handle.$$.ptrType.isConst) { throwBindingError("Cannot convert argument of type " + handle.$$.ptrType.name + " to parameter type " + this.name) } var handleClass = handle.$$.ptrType.registeredClass; var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass); return ptr }

            function simpleReadValueFromPointer(pointer) { return this["fromWireType"](HEAPU32[pointer >> 2]) }

            function RegisteredPointer_getPointee(ptr) { if (this.rawGetPointee) { ptr = this.rawGetPointee(ptr) } return ptr }

            function RegisteredPointer_destructor(ptr) { if (this.rawDestructor) { this.rawDestructor(ptr) } }

            function RegisteredPointer_deleteObject(handle) { if (handle !== null) { handle["delete"]() } }

            function downcastPointer(ptr, ptrClass, desiredClass) { if (ptrClass === desiredClass) { return ptr } if (undefined === desiredClass.baseClass) { return null } var rv = downcastPointer(ptr, ptrClass, desiredClass.baseClass); if (rv === null) { return null } return desiredClass.downcast(rv) }

            function getInheritedInstanceCount() { return Object.keys(registeredInstances).length }

            function getLiveInheritedInstances() { var rv = []; for (var k in registeredInstances) { if (registeredInstances.hasOwnProperty(k)) { rv.push(registeredInstances[k]) } } return rv }

            function setDelayFunction(fn) { delayFunction = fn; if (deletionQueue.length && delayFunction) { delayFunction(flushPendingDeletes) } }

            function init_embind() {
                Module["getInheritedInstanceCount"] = getInheritedInstanceCount;
                Module["getLiveInheritedInstances"] = getLiveInheritedInstances;
                Module["flushPendingDeletes"] = flushPendingDeletes;
                Module["setDelayFunction"] = setDelayFunction
            }
            var registeredInstances = {};

            function getBasestPointer(class_, ptr) {
                if (ptr === undefined) { throwBindingError("ptr should not be undefined") }
                while (class_.baseClass) {
                    ptr = class_.upcast(ptr);
                    class_ = class_.baseClass
                }
                return ptr
            }

            function getInheritedInstance(class_, ptr) { ptr = getBasestPointer(class_, ptr); return registeredInstances[ptr] }

            function makeClassHandle(prototype, record) {
                if (!record.ptrType || !record.ptr) { throwInternalError("makeClassHandle requires ptr and ptrType") }
                var hasSmartPtrType = !!record.smartPtrType;
                var hasSmartPtr = !!record.smartPtr;
                if (hasSmartPtrType !== hasSmartPtr) { throwInternalError("Both smartPtrType and smartPtr must be specified") }
                record.count = { value: 1 };
                return attachFinalizer(Object.create(prototype, { $$: { value: record } }))
            }

            function RegisteredPointer_fromWireType(ptr) {
                var rawPointer = this.getPointee(ptr);
                if (!rawPointer) { this.destructor(ptr); return null }
                var registeredInstance = getInheritedInstance(this.registeredClass, rawPointer);
                if (undefined !== registeredInstance) {
                    if (0 === registeredInstance.$$.count.value) {
                        registeredInstance.$$.ptr = rawPointer;
                        registeredInstance.$$.smartPtr = ptr;
                        return registeredInstance["clone"]()
                    } else {
                        var rv = registeredInstance["clone"]();
                        this.destructor(ptr);
                        return rv
                    }
                }

                function makeDefaultHandle() { if (this.isSmartPointer) { return makeClassHandle(this.registeredClass.instancePrototype, { ptrType: this.pointeeType, ptr: rawPointer, smartPtrType: this, smartPtr: ptr }) } else { return makeClassHandle(this.registeredClass.instancePrototype, { ptrType: this, ptr: ptr }) } }
                var actualType = this.registeredClass.getActualType(rawPointer);
                var registeredPointerRecord = registeredPointers[actualType];
                if (!registeredPointerRecord) { return makeDefaultHandle.call(this) }
                var toType;
                if (this.isConst) { toType = registeredPointerRecord.constPointerType } else { toType = registeredPointerRecord.pointerType }
                var dp = downcastPointer(rawPointer, this.registeredClass, toType.registeredClass);
                if (dp === null) { return makeDefaultHandle.call(this) }
                if (this.isSmartPointer) { return makeClassHandle(toType.registeredClass.instancePrototype, { ptrType: toType, ptr: dp, smartPtrType: this, smartPtr: ptr }) } else { return makeClassHandle(toType.registeredClass.instancePrototype, { ptrType: toType, ptr: dp }) }
            }

            function init_RegisteredPointer() {
                RegisteredPointer.prototype.getPointee = RegisteredPointer_getPointee;
                RegisteredPointer.prototype.destructor = RegisteredPointer_destructor;
                RegisteredPointer.prototype["argPackAdvance"] = 8;
                RegisteredPointer.prototype["readValueFromPointer"] = simpleReadValueFromPointer;
                RegisteredPointer.prototype["deleteObject"] = RegisteredPointer_deleteObject;
                RegisteredPointer.prototype["fromWireType"] = RegisteredPointer_fromWireType
            }

            function RegisteredPointer(name, registeredClass, isReference, isConst, isSmartPointer, pointeeType, sharingPolicy, rawGetPointee, rawConstructor, rawShare, rawDestructor) {
                this.name = name;
                this.registeredClass = registeredClass;
                this.isReference = isReference;
                this.isConst = isConst;
                this.isSmartPointer = isSmartPointer;
                this.pointeeType = pointeeType;
                this.sharingPolicy = sharingPolicy;
                this.rawGetPointee = rawGetPointee;
                this.rawConstructor = rawConstructor;
                this.rawShare = rawShare;
                this.rawDestructor = rawDestructor;
                if (!isSmartPointer && registeredClass.baseClass === undefined) {
                    if (isConst) {
                        this["toWireType"] = constNoSmartPtrRawPointerToWireType;
                        this.destructorFunction = null
                    } else {
                        this["toWireType"] = nonConstNoSmartPtrRawPointerToWireType;
                        this.destructorFunction = null
                    }
                } else { this["toWireType"] = genericPointerToWireType }
            }

            function replacePublicSymbol(name, value, numArguments) {
                if (!Module.hasOwnProperty(name)) { throwInternalError("Replacing nonexistant public symbol") }
                if (undefined !== Module[name].overloadTable && undefined !== numArguments) { Module[name].overloadTable[numArguments] = value } else {
                    Module[name] = value;
                    Module[name].argCount = numArguments
                }
            }

            function dynCallLegacy(sig, ptr, args) { if (args && args.length) { return Module["dynCall_" + sig].apply(null, [ptr].concat(args)) } return Module["dynCall_" + sig].call(null, ptr) }

            function dynCall(sig, ptr, args) { if (sig.indexOf("j") != -1) { return dynCallLegacy(sig, ptr, args) } return wasmTable.get(ptr).apply(null, args) }

            function getDynCaller(sig, ptr) { assert(sig.indexOf("j") >= 0, "getDynCaller should only be called with i64 sigs"); var argCache = []; return function() { argCache.length = arguments.length; for (var i = 0; i < arguments.length; i++) { argCache[i] = arguments[i] } return dynCall(sig, ptr, argCache) } }

            function embind__requireFunction(signature, rawFunction) {
                signature = readLatin1String(signature);

                function makeDynCaller() { if (signature.indexOf("j") != -1) { return getDynCaller(signature, rawFunction) } return wasmTable.get(rawFunction) }
                var fp = makeDynCaller();
                if (typeof fp !== "function") { throwBindingError("unknown function pointer with signature " + signature + ": " + rawFunction) }
                return fp
            }
            var UnboundTypeError = undefined;

            function getTypeName(type) {
                var ptr = ___getTypeName(type);
                var rv = readLatin1String(ptr);
                _free(ptr);
                return rv
            }

            function throwUnboundTypeError(message, types) {
                var unboundTypes = [];
                var seen = {};

                function visit(type) {
                    if (seen[type]) { return }
                    if (registeredTypes[type]) { return }
                    if (typeDependencies[type]) { typeDependencies[type].forEach(visit); return }
                    unboundTypes.push(type);
                    seen[type] = true
                }
                types.forEach(visit);
                throw new UnboundTypeError(message + ": " + unboundTypes.map(getTypeName).join([", "]))
            }

            function __embind_register_class(rawType, rawPointerType, rawConstPointerType, baseClassRawType, getActualTypeSignature, getActualType, upcastSignature, upcast, downcastSignature, downcast, name, destructorSignature, rawDestructor) {
                name = readLatin1String(name);
                getActualType = embind__requireFunction(getActualTypeSignature, getActualType);
                if (upcast) { upcast = embind__requireFunction(upcastSignature, upcast) }
                if (downcast) { downcast = embind__requireFunction(downcastSignature, downcast) }
                rawDestructor = embind__requireFunction(destructorSignature, rawDestructor);
                var legalFunctionName = makeLegalFunctionName(name);
                exposePublicSymbol(legalFunctionName, function() { throwUnboundTypeError("Cannot construct " + name + " due to unbound types", [baseClassRawType]) });
                whenDependentTypesAreResolved([rawType, rawPointerType, rawConstPointerType], baseClassRawType ? [baseClassRawType] : [], function(base) {
                    base = base[0];
                    var baseClass;
                    var basePrototype;
                    if (baseClassRawType) {
                        baseClass = base.registeredClass;
                        basePrototype = baseClass.instancePrototype
                    } else { basePrototype = ClassHandle.prototype }
                    var constructor = createNamedFunction(legalFunctionName, function() { if (Object.getPrototypeOf(this) !== instancePrototype) { throw new BindingError("Use 'new' to construct " + name) } if (undefined === registeredClass.constructor_body) { throw new BindingError(name + " has no accessible constructor") } var body = registeredClass.constructor_body[arguments.length]; if (undefined === body) { throw new BindingError("Tried to invoke ctor of " + name + " with invalid number of parameters (" + arguments.length + ") - expected (" + Object.keys(registeredClass.constructor_body).toString() + ") parameters instead!") } return body.apply(this, arguments) });
                    var instancePrototype = Object.create(basePrototype, { constructor: { value: constructor } });
                    constructor.prototype = instancePrototype;
                    var registeredClass = new RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast);
                    var referenceConverter = new RegisteredPointer(name, registeredClass, true, false, false);
                    var pointerConverter = new RegisteredPointer(name + "*", registeredClass, false, false, false);
                    var constPointerConverter = new RegisteredPointer(name + " const*", registeredClass, false, true, false);
                    registeredPointers[rawType] = { pointerType: pointerConverter, constPointerType: constPointerConverter };
                    replacePublicSymbol(legalFunctionName, constructor);
                    return [referenceConverter, pointerConverter, constPointerConverter]
                })
            }

            function heap32VectorToArray(count, firstElement) { var array = []; for (var i = 0; i < count; i++) { array.push(HEAP32[(firstElement >> 2) + i]) } return array }

            function runDestructors(destructors) {
                while (destructors.length) {
                    var ptr = destructors.pop();
                    var del = destructors.pop();
                    del(ptr)
                }
            }

            function __embind_register_class_constructor(rawClassType, argCount, rawArgTypesAddr, invokerSignature, invoker, rawConstructor) {
                assert(argCount > 0);
                var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
                invoker = embind__requireFunction(invokerSignature, invoker);
                var args = [rawConstructor];
                var destructors = [];
                whenDependentTypesAreResolved([], [rawClassType], function(classType) {
                    classType = classType[0];
                    var humanName = "constructor " + classType.name;
                    if (undefined === classType.registeredClass.constructor_body) { classType.registeredClass.constructor_body = [] }
                    if (undefined !== classType.registeredClass.constructor_body[argCount - 1]) { throw new BindingError("Cannot register multiple constructors with identical number of parameters (" + (argCount - 1) + ") for class '" + classType.name + "'! Overload resolution is currently only performed using the parameter count, not actual type info!") }
                    classType.registeredClass.constructor_body[argCount - 1] = function unboundTypeHandler() { throwUnboundTypeError("Cannot construct " + classType.name + " due to unbound types", rawArgTypes) };
                    whenDependentTypesAreResolved([], rawArgTypes, function(argTypes) {
                        classType.registeredClass.constructor_body[argCount - 1] = function constructor_body() {
                            if (arguments.length !== argCount - 1) { throwBindingError(humanName + " called with " + arguments.length + " arguments, expected " + (argCount - 1)) }
                            destructors.length = 0;
                            args.length = argCount;
                            for (var i = 1; i < argCount; ++i) { args[i] = argTypes[i]["toWireType"](destructors, arguments[i - 1]) }
                            var ptr = invoker.apply(null, args);
                            runDestructors(destructors);
                            return argTypes[0]["fromWireType"](ptr)
                        };
                        return []
                    });
                    return []
                })
            }

            function validateThis(this_, classType, humanName) { if (!(this_ instanceof Object)) { throwBindingError(humanName + ' with invalid "this": ' + this_) } if (!(this_ instanceof classType.registeredClass.constructor)) { throwBindingError(humanName + ' incompatible with "this" of type ' + this_.constructor.name) } if (!this_.$$.ptr) { throwBindingError("cannot call emscripten binding method " + humanName + " on deleted object") } return upcastPointer(this_.$$.ptr, this_.$$.ptrType.registeredClass, classType.registeredClass) }

            function __embind_register_class_property(classType, fieldName, getterReturnType, getterSignature, getter, getterContext, setterArgumentType, setterSignature, setter, setterContext) {
                fieldName = readLatin1String(fieldName);
                getter = embind__requireFunction(getterSignature, getter);
                whenDependentTypesAreResolved([], [classType], function(classType) {
                    classType = classType[0];
                    var humanName = classType.name + "." + fieldName;
                    var desc = { get: function() { throwUnboundTypeError("Cannot access " + humanName + " due to unbound types", [getterReturnType, setterArgumentType]) }, enumerable: true, configurable: true };
                    if (setter) { desc.set = function() { throwUnboundTypeError("Cannot access " + humanName + " due to unbound types", [getterReturnType, setterArgumentType]) } } else { desc.set = function(v) { throwBindingError(humanName + " is a read-only property") } }
                    Object.defineProperty(classType.registeredClass.instancePrototype, fieldName, desc);
                    whenDependentTypesAreResolved([], setter ? [getterReturnType, setterArgumentType] : [getterReturnType], function(types) {
                        var getterReturnType = types[0];
                        var desc = { get: function() { var ptr = validateThis(this, classType, humanName + " getter"); return getterReturnType["fromWireType"](getter(getterContext, ptr)) }, enumerable: true };
                        if (setter) {
                            setter = embind__requireFunction(setterSignature, setter);
                            var setterArgumentType = types[1];
                            desc.set = function(v) {
                                var ptr = validateThis(this, classType, humanName + " setter");
                                var destructors = [];
                                setter(setterContext, ptr, setterArgumentType["toWireType"](destructors, v));
                                runDestructors(destructors)
                            }
                        }
                        Object.defineProperty(classType.registeredClass.instancePrototype, fieldName, desc);
                        return []
                    });
                    return []
                })
            }
            var emval_free_list = [];
            var emval_handle_array = [{}, { value: undefined }, { value: null }, { value: true }, { value: false }];

            function __emval_decref(handle) {
                if (handle > 4 && 0 === --emval_handle_array[handle].refcount) {
                    emval_handle_array[handle] = undefined;
                    emval_free_list.push(handle)
                }
            }

            function count_emval_handles() { var count = 0; for (var i = 5; i < emval_handle_array.length; ++i) { if (emval_handle_array[i] !== undefined) {++count } } return count }

            function get_first_emval() { for (var i = 5; i < emval_handle_array.length; ++i) { if (emval_handle_array[i] !== undefined) { return emval_handle_array[i] } } return null }

            function init_emval() {
                Module["count_emval_handles"] = count_emval_handles;
                Module["get_first_emval"] = get_first_emval
            }

            function __emval_register(value) {
                switch (value) {
                    case undefined:
                        { return 1 }
                    case null:
                        { return 2 }
                    case true:
                        { return 3 }
                    case false:
                        { return 4 }
                    default:
                        { var handle = emval_free_list.length ? emval_free_list.pop() : emval_handle_array.length;emval_handle_array[handle] = { refcount: 1, value: value }; return handle }
                }
            }

            function __embind_register_emval(rawType, name) {
                name = readLatin1String(name);
                registerType(rawType, {
                    name: name,
                    "fromWireType": function(handle) {
                        var rv = emval_handle_array[handle].value;
                        __emval_decref(handle);
                        return rv
                    },
                    "toWireType": function(destructors, value) { return __emval_register(value) },
                    "argPackAdvance": 8,
                    "readValueFromPointer": simpleReadValueFromPointer,
                    destructorFunction: null
                })
            }

            function enumReadValueFromPointer(name, shift, signed) {
                switch (shift) {
                    case 0:
                        return function(pointer) { var heap = signed ? HEAP8 : HEAPU8; return this["fromWireType"](heap[pointer]) };
                    case 1:
                        return function(pointer) { var heap = signed ? HEAP16 : HEAPU16; return this["fromWireType"](heap[pointer >> 1]) };
                    case 2:
                        return function(pointer) { var heap = signed ? HEAP32 : HEAPU32; return this["fromWireType"](heap[pointer >> 2]) };
                    default:
                        throw new TypeError("Unknown integer type: " + name)
                }
            }

            function __embind_register_enum(rawType, name, size, isSigned) {
                var shift = getShiftFromSize(size);
                name = readLatin1String(name);

                function ctor() {}
                ctor.values = {};
                registerType(rawType, { name: name, constructor: ctor, "fromWireType": function(c) { return this.constructor.values[c] }, "toWireType": function(destructors, c) { return c.value }, "argPackAdvance": 8, "readValueFromPointer": enumReadValueFromPointer(name, shift, isSigned), destructorFunction: null });
                exposePublicSymbol(name, ctor)
            }

            function requireRegisteredType(rawType, humanName) { var impl = registeredTypes[rawType]; if (undefined === impl) { throwBindingError(humanName + " has unknown type " + getTypeName(rawType)) } return impl }

            function __embind_register_enum_value(rawEnumType, name, enumValue) {
                var enumType = requireRegisteredType(rawEnumType, "enum");
                name = readLatin1String(name);
                var Enum = enumType.constructor;
                var Value = Object.create(enumType.constructor.prototype, { value: { value: enumValue }, constructor: { value: createNamedFunction(enumType.name + "_" + name, function() {}) } });
                Enum.values[enumValue] = Value;
                Enum[name] = Value
            }

            function _embind_repr(v) { if (v === null) { return "null" } var t = typeof v; if (t === "object" || t === "array" || t === "function") { return v.toString() } else { return "" + v } }

            function floatReadValueFromPointer(name, shift) {
                switch (shift) {
                    case 2:
                        return function(pointer) { return this["fromWireType"](HEAPF32[pointer >> 2]) };
                    case 3:
                        return function(pointer) { return this["fromWireType"](HEAPF64[pointer >> 3]) };
                    default:
                        throw new TypeError("Unknown float type: " + name)
                }
            }

            function __embind_register_float(rawType, name, size) {
                var shift = getShiftFromSize(size);
                name = readLatin1String(name);
                registerType(rawType, { name: name, "fromWireType": function(value) { return value }, "toWireType": function(destructors, value) { if (typeof value !== "number" && typeof value !== "boolean") { throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name) } return value }, "argPackAdvance": 8, "readValueFromPointer": floatReadValueFromPointer(name, shift), destructorFunction: null })
            }

            function new_(constructor, argumentList) {
                if (!(constructor instanceof Function)) { throw new TypeError("new_ called with constructor type " + typeof constructor + " which is not a function") }
                var dummy = createNamedFunction(constructor.name || "unknownFunctionName", function() {});
                dummy.prototype = constructor.prototype;
                var obj = new dummy;
                var r = constructor.apply(obj, argumentList);
                return r instanceof Object ? r : obj
            }

            function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc) {
                var argCount = argTypes.length;
                if (argCount < 2) { throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!") }
                var isClassMethodFunc = argTypes[1] !== null && classType !== null;
                var needsDestructorStack = false;
                for (var i = 1; i < argTypes.length; ++i) { if (argTypes[i] !== null && argTypes[i].destructorFunction === undefined) { needsDestructorStack = true; break } }
                var returns = argTypes[0].name !== "void";
                var argsList = "";
                var argsListWired = "";
                for (var i = 0; i < argCount - 2; ++i) {
                    argsList += (i !== 0 ? ", " : "") + "arg" + i;
                    argsListWired += (i !== 0 ? ", " : "") + "arg" + i + "Wired"
                }
                var invokerFnBody = "return function " + makeLegalFunctionName(humanName) + "(" + argsList + ") {\n" + "if (arguments.length !== " + (argCount - 2) + ") {\n" + "throwBindingError('function " + humanName + " called with ' + arguments.length + ' arguments, expected " + (argCount - 2) + " args!');\n" + "}\n";
                if (needsDestructorStack) { invokerFnBody += "var destructors = [];\n" }
                var dtorStack = needsDestructorStack ? "destructors" : "null";
                var args1 = ["throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"];
                var args2 = [throwBindingError, cppInvokerFunc, cppTargetFunc, runDestructors, argTypes[0], argTypes[1]];
                if (isClassMethodFunc) { invokerFnBody += "var thisWired = classParam.toWireType(" + dtorStack + ", this);\n" }
                for (var i = 0; i < argCount - 2; ++i) {
                    invokerFnBody += "var arg" + i + "Wired = argType" + i + ".toWireType(" + dtorStack + ", arg" + i + "); // " + argTypes[i + 2].name + "\n";
                    args1.push("argType" + i);
                    args2.push(argTypes[i + 2])
                }
                if (isClassMethodFunc) { argsListWired = "thisWired" + (argsListWired.length > 0 ? ", " : "") + argsListWired }
                invokerFnBody += (returns ? "var rv = " : "") + "invoker(fn" + (argsListWired.length > 0 ? ", " : "") + argsListWired + ");\n";
                if (needsDestructorStack) { invokerFnBody += "runDestructors(destructors);\n" } else {
                    for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) {
                        var paramName = i === 1 ? "thisWired" : "arg" + (i - 2) + "Wired";
                        if (argTypes[i].destructorFunction !== null) {
                            invokerFnBody += paramName + "_dtor(" + paramName + "); // " + argTypes[i].name + "\n";
                            args1.push(paramName + "_dtor");
                            args2.push(argTypes[i].destructorFunction)
                        }
                    }
                }
                if (returns) { invokerFnBody += "var ret = retType.fromWireType(rv);\n" + "return ret;\n" } else {}
                invokerFnBody += "}\n";
                args1.push(invokerFnBody);
                var invokerFunction = new_(Function, args1).apply(null, args2);
                return invokerFunction
            }

            function __embind_register_function(name, argCount, rawArgTypesAddr, signature, rawInvoker, fn) {
                var argTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
                name = readLatin1String(name);
                rawInvoker = embind__requireFunction(signature, rawInvoker);
                exposePublicSymbol(name, function() { throwUnboundTypeError("Cannot call " + name + " due to unbound types", argTypes) }, argCount - 1);
                whenDependentTypesAreResolved([], argTypes, function(argTypes) {
                    var invokerArgsArray = [argTypes[0], null].concat(argTypes.slice(1));
                    replacePublicSymbol(name, craftInvokerFunction(name, invokerArgsArray, null, rawInvoker, fn), argCount - 1);
                    return []
                })
            }

            function integerReadValueFromPointer(name, shift, signed) {
                switch (shift) {
                    case 0:
                        return signed ? function readS8FromPointer(pointer) { return HEAP8[pointer] } : function readU8FromPointer(pointer) { return HEAPU8[pointer] };
                    case 1:
                        return signed ? function readS16FromPointer(pointer) { return HEAP16[pointer >> 1] } : function readU16FromPointer(pointer) { return HEAPU16[pointer >> 1] };
                    case 2:
                        return signed ? function readS32FromPointer(pointer) { return HEAP32[pointer >> 2] } : function readU32FromPointer(pointer) { return HEAPU32[pointer >> 2] };
                    default:
                        throw new TypeError("Unknown integer type: " + name)
                }
            }

            function __embind_register_integer(primitiveType, name, size, minRange, maxRange) {
                name = readLatin1String(name);
                if (maxRange === -1) { maxRange = 4294967295 }
                var shift = getShiftFromSize(size);
                var fromWireType = function(value) { return value };
                if (minRange === 0) {
                    var bitshift = 32 - 8 * size;
                    fromWireType = function(value) { return value << bitshift >>> bitshift }
                }
                var isUnsignedType = name.indexOf("unsigned") != -1;
                registerType(primitiveType, { name: name, "fromWireType": fromWireType, "toWireType": function(destructors, value) { if (typeof value !== "number" && typeof value !== "boolean") { throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name) } if (value < minRange || value > maxRange) { throw new TypeError('Passing a number "' + _embind_repr(value) + '" from JS side to C/C++ side to an argument of type "' + name + '", which is outside the valid range [' + minRange + ", " + maxRange + "]!") } return isUnsignedType ? value >>> 0 : value | 0 }, "argPackAdvance": 8, "readValueFromPointer": integerReadValueFromPointer(name, shift, minRange !== 0), destructorFunction: null })
            }

            function __embind_register_memory_view(rawType, dataTypeIndex, name) {
                var typeMapping = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array];
                var TA = typeMapping[dataTypeIndex];

                function decodeMemoryView(handle) { handle = handle >> 2; var heap = HEAPU32; var size = heap[handle]; var data = heap[handle + 1]; return new TA(buffer, data, size) }
                name = readLatin1String(name);
                registerType(rawType, { name: name, "fromWireType": decodeMemoryView, "argPackAdvance": 8, "readValueFromPointer": decodeMemoryView }, { ignoreDuplicateRegistrations: true })
            }

            function __embind_register_std_string(rawType, name) {
                name = readLatin1String(name);
                var stdStringIsUTF8 = name === "std::string";
                registerType(rawType, {
                    name: name,
                    "fromWireType": function(value) {
                        var length = HEAPU32[value >> 2];
                        var str;
                        if (stdStringIsUTF8) {
                            var decodeStartPtr = value + 4;
                            for (var i = 0; i <= length; ++i) {
                                var currentBytePtr = value + 4 + i;
                                if (i == length || HEAPU8[currentBytePtr] == 0) {
                                    var maxRead = currentBytePtr - decodeStartPtr;
                                    var stringSegment = UTF8ToString(decodeStartPtr, maxRead);
                                    if (str === undefined) { str = stringSegment } else {
                                        str += String.fromCharCode(0);
                                        str += stringSegment
                                    }
                                    decodeStartPtr = currentBytePtr + 1
                                }
                            }
                        } else {
                            var a = new Array(length);
                            for (var i = 0; i < length; ++i) { a[i] = String.fromCharCode(HEAPU8[value + 4 + i]) }
                            str = a.join("")
                        }
                        _free(value);
                        return str
                    },
                    "toWireType": function(destructors, value) {
                        if (value instanceof ArrayBuffer) { value = new Uint8Array(value) }
                        var getLength;
                        var valueIsOfTypeString = typeof value === "string";
                        if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) { throwBindingError("Cannot pass non-string to std::string") }
                        if (stdStringIsUTF8 && valueIsOfTypeString) { getLength = function() { return lengthBytesUTF8(value) } } else { getLength = function() { return value.length } }
                        var length = getLength();
                        var ptr = _malloc(4 + length + 1);
                        HEAPU32[ptr >> 2] = length;
                        if (stdStringIsUTF8 && valueIsOfTypeString) { stringToUTF8(value, ptr + 4, length + 1) } else {
                            if (valueIsOfTypeString) {
                                for (var i = 0; i < length; ++i) {
                                    var charCode = value.charCodeAt(i);
                                    if (charCode > 255) {
                                        _free(ptr);
                                        throwBindingError("String has UTF-16 code units that do not fit in 8 bits")
                                    }
                                    HEAPU8[ptr + 4 + i] = charCode
                                }
                            } else { for (var i = 0; i < length; ++i) { HEAPU8[ptr + 4 + i] = value[i] } }
                        }
                        if (destructors !== null) { destructors.push(_free, ptr) }
                        return ptr
                    },
                    "argPackAdvance": 8,
                    "readValueFromPointer": simpleReadValueFromPointer,
                    destructorFunction: function(ptr) { _free(ptr) }
                })
            }

            function __embind_register_std_wstring(rawType, charSize, name) {
                name = readLatin1String(name);
                var decodeString, encodeString, getHeap, lengthBytesUTF, shift;
                if (charSize === 2) {
                    decodeString = UTF16ToString;
                    encodeString = stringToUTF16;
                    lengthBytesUTF = lengthBytesUTF16;
                    getHeap = function() { return HEAPU16 };
                    shift = 1
                } else if (charSize === 4) {
                    decodeString = UTF32ToString;
                    encodeString = stringToUTF32;
                    lengthBytesUTF = lengthBytesUTF32;
                    getHeap = function() { return HEAPU32 };
                    shift = 2
                }
                registerType(rawType, {
                    name: name,
                    "fromWireType": function(value) {
                        var length = HEAPU32[value >> 2];
                        var HEAP = getHeap();
                        var str;
                        var decodeStartPtr = value + 4;
                        for (var i = 0; i <= length; ++i) {
                            var currentBytePtr = value + 4 + i * charSize;
                            if (i == length || HEAP[currentBytePtr >> shift] == 0) {
                                var maxReadBytes = currentBytePtr - decodeStartPtr;
                                var stringSegment = decodeString(decodeStartPtr, maxReadBytes);
                                if (str === undefined) { str = stringSegment } else {
                                    str += String.fromCharCode(0);
                                    str += stringSegment
                                }
                                decodeStartPtr = currentBytePtr + charSize
                            }
                        }
                        _free(value);
                        return str
                    },
                    "toWireType": function(destructors, value) {
                        if (!(typeof value === "string")) { throwBindingError("Cannot pass non-string to C++ string type " + name) }
                        var length = lengthBytesUTF(value);
                        var ptr = _malloc(4 + length + charSize);
                        HEAPU32[ptr >> 2] = length >> shift;
                        encodeString(value, ptr + 4, length + charSize);
                        if (destructors !== null) { destructors.push(_free, ptr) }
                        return ptr
                    },
                    "argPackAdvance": 8,
                    "readValueFromPointer": simpleReadValueFromPointer,
                    destructorFunction: function(ptr) { _free(ptr) }
                })
            }

            function __embind_register_void(rawType, name) {
                name = readLatin1String(name);
                registerType(rawType, { isVoid: true, name: name, "argPackAdvance": 0, "fromWireType": function() { return undefined }, "toWireType": function(destructors, o) { return undefined } })
            }

            function __emval_incref(handle) { if (handle > 4) { emval_handle_array[handle].refcount += 1 } }

            function __emval_take_value(type, argv) { type = requireRegisteredType(type, "_emval_take_value"); var v = type["readValueFromPointer"](argv); return __emval_register(v) }

            function _abort() { abort() }
            var _emscripten_get_now;
            if (ENVIRONMENT_IS_NODE) { _emscripten_get_now = function() { var t = process["hrtime"](); return t[0] * 1e3 + t[1] / 1e6 } } else if (typeof dateNow !== "undefined") { _emscripten_get_now = dateNow } else _emscripten_get_now = function() { return performance.now() };
            var _emscripten_get_now_is_monotonic = true;

            function setErrNo(value) { HEAP32[___errno_location() >> 2] = value; return value }

            function _clock_gettime(clk_id, tp) {
                var now;
                if (clk_id === 0) { now = Date.now() } else if ((clk_id === 1 || clk_id === 4) && _emscripten_get_now_is_monotonic) { now = _emscripten_get_now() } else { setErrNo(28); return -1 }
                HEAP32[tp >> 2] = now / 1e3 | 0;
                HEAP32[tp + 4 >> 2] = now % 1e3 * 1e3 * 1e3 | 0;
                return 0
            }

            function _emscripten_memcpy_big(dest, src, num) { HEAPU8.copyWithin(dest, src, src + num) }

            function _emscripten_get_heap_size() { return HEAPU8.length }

            function emscripten_realloc_buffer(size) {
                try {
                    wasmMemory.grow(size - buffer.byteLength + 65535 >>> 16);
                    updateGlobalBufferAndViews(wasmMemory.buffer);
                    return 1
                } catch (e) {}
            }

            function _emscripten_resize_heap(requestedSize) {
                requestedSize = requestedSize >>> 0;
                var oldSize = _emscripten_get_heap_size();
                var maxHeapSize = 2147483648;
                if (requestedSize > maxHeapSize) { return false }
                var minHeapSize = 16777216;
                for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
                    var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
                    overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
                    var newSize = Math.min(maxHeapSize, alignUp(Math.max(minHeapSize, requestedSize, overGrownHeapSize), 65536));
                    var replacement = emscripten_realloc_buffer(newSize);
                    if (replacement) { return true }
                }
                return false
            }
            var SYSCALLS = {
                mappings: {},
                buffers: [null, [],
                    []
                ],
                printChar: function(stream, curr) {
                    var buffer = SYSCALLS.buffers[stream];
                    if (curr === 0 || curr === 10) {
                        (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
                        buffer.length = 0
                    } else { buffer.push(curr) }
                },
                varargs: undefined,
                get: function() { SYSCALLS.varargs += 4; var ret = HEAP32[SYSCALLS.varargs - 4 >> 2]; return ret },
                getStr: function(ptr) { var ret = UTF8ToString(ptr); return ret },
                get64: function(low, high) { return low }
            };

            function _fd_close(fd) { return 0 }

            function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {}

            function _fd_write(fd, iov, iovcnt, pnum) {
                var num = 0;
                for (var i = 0; i < iovcnt; i++) {
                    var ptr = HEAP32[iov + i * 8 >> 2];
                    var len = HEAP32[iov + (i * 8 + 4) >> 2];
                    for (var j = 0; j < len; j++) { SYSCALLS.printChar(fd, HEAPU8[ptr + j]) }
                    num += len
                }
                HEAP32[pnum >> 2] = num;
                return 0
            }

            function _setTempRet0($i) { setTempRet0($i | 0) }

            function _time(ptr) { var ret = Date.now() / 1e3 | 0; if (ptr) { HEAP32[ptr >> 2] = ret } return ret }
            embind_init_charCodes();
            BindingError = Module["BindingError"] = extendError(Error, "BindingError");
            InternalError = Module["InternalError"] = extendError(Error, "InternalError");
            init_ClassHandle();
            init_RegisteredPointer();
            init_embind();
            UnboundTypeError = Module["UnboundTypeError"] = extendError(Error, "UnboundTypeError");
            init_emval();
            var ASSERTIONS = false;

            function intArrayToString(array) {
                var ret = [];
                for (var i = 0; i < array.length; i++) {
                    var chr = array[i];
                    if (chr > 255) {
                        if (ASSERTIONS) { assert(false, "Character code " + chr + " (" + String.fromCharCode(chr) + ")  at offset " + i + " not in 0x00-0xFF.") }
                        chr &= 255
                    }
                    ret.push(String.fromCharCode(chr))
                }
                return ret.join("")
            }
            var decodeBase64 = typeof atob === "function" ? atob : function(input) {
                var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
                var output = "";
                var chr1, chr2, chr3;
                var enc1, enc2, enc3, enc4;
                var i = 0;
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
                do {
                    enc1 = keyStr.indexOf(input.charAt(i++));
                    enc2 = keyStr.indexOf(input.charAt(i++));
                    enc3 = keyStr.indexOf(input.charAt(i++));
                    enc4 = keyStr.indexOf(input.charAt(i++));
                    chr1 = enc1 << 2 | enc2 >> 4;
                    chr2 = (enc2 & 15) << 4 | enc3 >> 2;
                    chr3 = (enc3 & 3) << 6 | enc4;
                    output = output + String.fromCharCode(chr1);
                    if (enc3 !== 64) { output = output + String.fromCharCode(chr2) }
                    if (enc4 !== 64) { output = output + String.fromCharCode(chr3) }
                } while (i < input.length);
                return output
            };

            function intArrayFromBase64(s) { if (typeof ENVIRONMENT_IS_NODE === "boolean" && ENVIRONMENT_IS_NODE) { var buf; try { buf = Buffer.from(s, "base64") } catch (_) { buf = new Buffer(s, "base64") } return new Uint8Array(buf["buffer"], buf["byteOffset"], buf["byteLength"]) } try { var decoded = decodeBase64(s); var bytes = new Uint8Array(decoded.length); for (var i = 0; i < decoded.length; ++i) { bytes[i] = decoded.charCodeAt(i) } return bytes } catch (_) { throw new Error("Converting base64 string to bytes failed.") } }

            function tryParseAsDataURI(filename) { if (!isDataURI(filename)) { return } return intArrayFromBase64(filename.slice(dataURIPrefix.length)) }
            var asmLibraryArg = { "y": ___asctime_r, "d": ___cxa_allocate_exception, "g": ___cxa_throw, "x": ___localtime_r, "C": __embind_register_bool, "A": __embind_register_class, "r": __embind_register_class_constructor, "e": __embind_register_class_property, "B": __embind_register_emval, "n": __embind_register_enum, "a": __embind_register_enum_value, "k": __embind_register_float, "f": __embind_register_function, "c": __embind_register_integer, "b": __embind_register_memory_view, "l": __embind_register_std_string, "h": __embind_register_std_wstring, "D": __embind_register_void, "o": __emval_decref, "p": __emval_incref, "q": __emval_take_value, "i": _abort, "w": _clock_gettime, "u": _emscripten_memcpy_big, "v": _emscripten_resize_heap, "z": _fd_close, "s": _fd_seek, "j": _fd_write, "t": _setTempRet0, "m": _time };
            var asm = createWasm();
            var ___wasm_call_ctors = Module["___wasm_call_ctors"] = function() { return (___wasm_call_ctors = Module["___wasm_call_ctors"] = Module["asm"]["G"]).apply(null, arguments) };
            var _malloc = Module["_malloc"] = function() { return (_malloc = Module["_malloc"] = Module["asm"]["H"]).apply(null, arguments) };
            var _free = Module["_free"] = function() { return (_free = Module["_free"] = Module["asm"]["I"]).apply(null, arguments) };
            var ___getTypeName = Module["___getTypeName"] = function() { return (___getTypeName = Module["___getTypeName"] = Module["asm"]["J"]).apply(null, arguments) };
            var ___embind_register_native_and_builtin_types = Module["___embind_register_native_and_builtin_types"] = function() { return (___embind_register_native_and_builtin_types = Module["___embind_register_native_and_builtin_types"] = Module["asm"]["K"]).apply(null, arguments) };
            var ___errno_location = Module["___errno_location"] = function() { return (___errno_location = Module["___errno_location"] = Module["asm"]["L"]).apply(null, arguments) };
            var __get_tzname = Module["__get_tzname"] = function() { return (__get_tzname = Module["__get_tzname"] = Module["asm"]["M"]).apply(null, arguments) };
            var __get_daylight = Module["__get_daylight"] = function() { return (__get_daylight = Module["__get_daylight"] = Module["asm"]["N"]).apply(null, arguments) };
            var __get_timezone = Module["__get_timezone"] = function() { return (__get_timezone = Module["__get_timezone"] = Module["asm"]["O"]).apply(null, arguments) };
            var dynCall_jiji = Module["dynCall_jiji"] = function() { return (dynCall_jiji = Module["dynCall_jiji"] = Module["asm"]["P"]).apply(null, arguments) };
            var calledRun;

            function ExitStatus(status) {
                this.name = "ExitStatus";
                this.message = "Program terminated with exit(" + status + ")";
                this.status = status
            }
            dependenciesFulfilled = function runCaller() { if (!calledRun) run(); if (!calledRun) dependenciesFulfilled = runCaller };

            function run(args) {
                args = args || arguments_;
                if (runDependencies > 0) { return }
                preRun();
                if (runDependencies > 0) return;

                function doRun() {
                    if (calledRun) return;
                    calledRun = true;
                    Module["calledRun"] = true;
                    if (ABORT) return;
                    initRuntime();
                    preMain();
                    readyPromiseResolve(Module);
                    if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
                    postRun()
                }
                if (Module["setStatus"]) {
                    Module["setStatus"]("Running...");
                    setTimeout(function() {
                        setTimeout(function() { Module["setStatus"]("") }, 1);
                        doRun()
                    }, 1)
                } else { doRun() }
            }
            Module["run"] = run;
            if (Module["preInit"]) { if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]]; while (Module["preInit"].length > 0) { Module["preInit"].pop()() } }
            noExitRuntime = true;
            run();


            return ggwave_factory.ready
        }
    );
})();
if (typeof exports === 'object' && typeof module === 'object')
    module.exports = ggwave_factory;
else if (typeof define === 'function' && define['amd'])
    define([], function() { return ggwave_factory; });
else if (typeof exports === 'object')
    exports["ggwave_factory"] = ggwave_factory;