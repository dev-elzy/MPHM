
import {Buffer} from "node:buffer";
globalThis.Buffer = Buffer;

import {AsyncLocalStorage} from "node:async_hooks";
globalThis.AsyncLocalStorage = AsyncLocalStorage;


const defaultDefineProperty = Object.defineProperty;
Object.defineProperty = function(o, p, a) {
  if(p=== '__import_unsupported' && Boolean(globalThis.__import_unsupported)) {
    return;
  }
  return defaultDefineProperty(o, p, a);
};

  
  
  globalThis.openNextDebug = false;globalThis.openNextVersion = "4.0.2";globalThis.nextVersion = "16.2.10";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/@opennextjs/aws/dist/utils/error.js
function isOpenNextError(e) {
  try {
    return "__openNextInternal" in e;
  } catch {
    return false;
  }
}
var init_error = __esm({
  "node_modules/@opennextjs/aws/dist/utils/error.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/adapters/logger.js
function debug(...args) {
  if (globalThis.openNextDebug) {
    console.log(...args);
  }
}
function warn(...args) {
  console.warn(...args);
}
function error(...args) {
  if (args.some((arg) => isDownplayedErrorLog(arg))) {
    return debug(...args);
  }
  if (args.some((arg) => isOpenNextError(arg))) {
    const error2 = args.find((arg) => isOpenNextError(arg));
    if (error2.logLevel < getOpenNextErrorLogLevel()) {
      return;
    }
    if (error2.logLevel === 0) {
      return console.log(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    if (error2.logLevel === 1) {
      return warn(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    return console.error(...args);
  }
  console.error(...args);
}
function getOpenNextErrorLogLevel() {
  const strLevel = process.env.OPEN_NEXT_ERROR_LOG_LEVEL ?? "1";
  switch (strLevel.toLowerCase()) {
    case "debug":
    case "0":
      return 0;
    case "error":
    case "2":
      return 2;
    default:
      return 1;
  }
}
var DOWNPLAYED_ERROR_LOGS, isDownplayedErrorLog;
var init_logger = __esm({
  "node_modules/@opennextjs/aws/dist/adapters/logger.js"() {
    init_error();
    DOWNPLAYED_ERROR_LOGS = [
      {
        clientName: "S3Client",
        commandName: "GetObjectCommand",
        errorName: "NoSuchKey"
      }
    ];
    isDownplayedErrorLog = (errorLog) => DOWNPLAYED_ERROR_LOGS.some((downplayedInput) => downplayedInput.clientName === errorLog?.clientName && downplayedInput.commandName === errorLog?.commandName && (downplayedInput.errorName === errorLog?.error?.name || downplayedInput.errorName === errorLog?.error?.Code));
  }
});

// node_modules/cookie/dist/index.js
var require_dist = __commonJS({
  "node_modules/cookie/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseCookie = parseCookie;
    exports.parse = parseCookie;
    exports.stringifyCookie = stringifyCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    exports.parseSetCookie = parseSetCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    var cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
    var cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
    var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
    var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
    var maxAgeRegExp = /^-?\d+$/;
    var __toString = Object.prototype.toString;
    var NullObject = /* @__PURE__ */ (() => {
      const C = function() {
      };
      C.prototype = /* @__PURE__ */ Object.create(null);
      return C;
    })();
    function parseCookie(str, options) {
      const obj = new NullObject();
      const len = str.length;
      if (len < 2)
        return obj;
      const dec = options?.decode || decode;
      let index = 0;
      do {
        const eqIdx = eqIndex(str, index, len);
        if (eqIdx === -1)
          break;
        const endIdx = endIndex(str, index, len);
        if (eqIdx > endIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        const key = valueSlice(str, index, eqIdx);
        if (obj[key] === void 0) {
          obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx));
        }
        index = endIdx + 1;
      } while (index < len);
      return obj;
    }
    function stringifyCookie(cookie, options) {
      const enc = options?.encode || encodeURIComponent;
      const cookieStrings = [];
      for (const name of Object.keys(cookie)) {
        const val = cookie[name];
        if (val === void 0)
          continue;
        if (!cookieNameRegExp.test(name)) {
          throw new TypeError(`cookie name is invalid: ${name}`);
        }
        const value = enc(val);
        if (!cookieValueRegExp.test(value)) {
          throw new TypeError(`cookie val is invalid: ${val}`);
        }
        cookieStrings.push(`${name}=${value}`);
      }
      return cookieStrings.join("; ");
    }
    function stringifySetCookie(_name, _val, _opts) {
      const cookie = typeof _name === "object" ? _name : { ..._opts, name: _name, value: String(_val) };
      const options = typeof _val === "object" ? _val : _opts;
      const enc = options?.encode || encodeURIComponent;
      if (!cookieNameRegExp.test(cookie.name)) {
        throw new TypeError(`argument name is invalid: ${cookie.name}`);
      }
      const value = cookie.value ? enc(cookie.value) : "";
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`argument val is invalid: ${cookie.value}`);
      }
      let str = cookie.name + "=" + value;
      if (cookie.maxAge !== void 0) {
        if (!Number.isInteger(cookie.maxAge)) {
          throw new TypeError(`option maxAge is invalid: ${cookie.maxAge}`);
        }
        str += "; Max-Age=" + cookie.maxAge;
      }
      if (cookie.domain) {
        if (!domainValueRegExp.test(cookie.domain)) {
          throw new TypeError(`option domain is invalid: ${cookie.domain}`);
        }
        str += "; Domain=" + cookie.domain;
      }
      if (cookie.path) {
        if (!pathValueRegExp.test(cookie.path)) {
          throw new TypeError(`option path is invalid: ${cookie.path}`);
        }
        str += "; Path=" + cookie.path;
      }
      if (cookie.expires) {
        if (!isDate(cookie.expires) || !Number.isFinite(cookie.expires.valueOf())) {
          throw new TypeError(`option expires is invalid: ${cookie.expires}`);
        }
        str += "; Expires=" + cookie.expires.toUTCString();
      }
      if (cookie.httpOnly) {
        str += "; HttpOnly";
      }
      if (cookie.secure) {
        str += "; Secure";
      }
      if (cookie.partitioned) {
        str += "; Partitioned";
      }
      if (cookie.priority) {
        const priority = typeof cookie.priority === "string" ? cookie.priority.toLowerCase() : void 0;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError(`option priority is invalid: ${cookie.priority}`);
        }
      }
      if (cookie.sameSite) {
        const sameSite = typeof cookie.sameSite === "string" ? cookie.sameSite.toLowerCase() : cookie.sameSite;
        switch (sameSite) {
          case true:
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError(`option sameSite is invalid: ${cookie.sameSite}`);
        }
      }
      return str;
    }
    function parseSetCookie(str, options) {
      const dec = options?.decode || decode;
      const len = str.length;
      const endIdx = endIndex(str, 0, len);
      const eqIdx = eqIndex(str, 0, endIdx);
      const setCookie = eqIdx === -1 ? { name: "", value: dec(valueSlice(str, 0, endIdx)) } : {
        name: valueSlice(str, 0, eqIdx),
        value: dec(valueSlice(str, eqIdx + 1, endIdx))
      };
      let index = endIdx + 1;
      while (index < len) {
        const endIdx2 = endIndex(str, index, len);
        const eqIdx2 = eqIndex(str, index, endIdx2);
        const attr = eqIdx2 === -1 ? valueSlice(str, index, endIdx2) : valueSlice(str, index, eqIdx2);
        const val = eqIdx2 === -1 ? void 0 : valueSlice(str, eqIdx2 + 1, endIdx2);
        switch (attr.toLowerCase()) {
          case "httponly":
            setCookie.httpOnly = true;
            break;
          case "secure":
            setCookie.secure = true;
            break;
          case "partitioned":
            setCookie.partitioned = true;
            break;
          case "domain":
            setCookie.domain = val;
            break;
          case "path":
            setCookie.path = val;
            break;
          case "max-age":
            if (val && maxAgeRegExp.test(val))
              setCookie.maxAge = Number(val);
            break;
          case "expires":
            if (!val)
              break;
            const date = new Date(val);
            if (Number.isFinite(date.valueOf()))
              setCookie.expires = date;
            break;
          case "priority":
            if (!val)
              break;
            const priority = val.toLowerCase();
            if (priority === "low" || priority === "medium" || priority === "high") {
              setCookie.priority = priority;
            }
            break;
          case "samesite":
            if (!val)
              break;
            const sameSite = val.toLowerCase();
            if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
              setCookie.sameSite = sameSite;
            }
            break;
        }
        index = endIdx2 + 1;
      }
      return setCookie;
    }
    function endIndex(str, min, len) {
      const index = str.indexOf(";", min);
      return index === -1 ? len : index;
    }
    function eqIndex(str, min, max) {
      const index = str.indexOf("=", min);
      return index < max ? index : -1;
    }
    function valueSlice(str, min, max) {
      let start = min;
      let end = max;
      do {
        const code = str.charCodeAt(start);
        if (code !== 32 && code !== 9)
          break;
      } while (++start < end);
      while (end > start) {
        const code = str.charCodeAt(end - 1);
        if (code !== 32 && code !== 9)
          break;
        end--;
      }
      return str.slice(start, end);
    }
    function decode(str) {
      if (str.indexOf("%") === -1)
        return str;
      try {
        return decodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]";
    }
  }
});

// node_modules/@opennextjs/aws/dist/http/util.js
function parseSetCookieHeader(cookies) {
  if (!cookies) {
    return [];
  }
  if (typeof cookies === "string") {
    return cookies.split(/(?<!Expires=\w+),/i).map((c) => c.trim());
  }
  return cookies;
}
function getQueryFromIterator(it) {
  const query = {};
  for (const [key, value] of it) {
    if (key in query) {
      if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    } else {
      query[key] = value;
    }
  }
  return query;
}
var init_util = __esm({
  "node_modules/@opennextjs/aws/dist/http/util.js"() {
    init_logger();
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/utils.js
function getQueryFromSearchParams(searchParams) {
  return getQueryFromIterator(searchParams.entries());
}
var init_utils = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/utils.js"() {
    init_util();
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/edge.js
var edge_exports = {};
__export(edge_exports, {
  default: () => edge_default
});
import { Buffer as Buffer2 } from "node:buffer";
var import_cookie, NULL_BODY_STATUSES, converter, edge_default;
var init_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/edge.js"() {
    import_cookie = __toESM(require_dist(), 1);
    init_util();
    init_utils();
    NULL_BODY_STATUSES = /* @__PURE__ */ new Set([101, 103, 204, 205, 304]);
    converter = {
      convertFrom: async (event) => {
        const url = new URL(event.url);
        const searchParams = url.searchParams;
        const query = getQueryFromSearchParams(searchParams);
        const headers = {};
        event.headers.forEach((value, key) => {
          headers[key] = value;
        });
        const rawPath = url.pathname;
        const method = event.method;
        const shouldHaveBody = method !== "GET" && method !== "HEAD";
        const body = shouldHaveBody ? Buffer2.from(await event.arrayBuffer()) : void 0;
        const cookieHeader = event.headers.get("cookie");
        const cookies = cookieHeader ? import_cookie.default.parse(cookieHeader) : {};
        return {
          type: "core",
          method,
          rawPath,
          url: event.url,
          body,
          headers,
          remoteAddress: event.headers.get("x-forwarded-for") ?? "::1",
          query,
          cookies
        };
      },
      convertTo: async (result) => {
        if ("internalEvent" in result) {
          const request = new Request(result.internalEvent.url, {
            body: result.internalEvent.body,
            method: result.internalEvent.method,
            headers: {
              ...result.internalEvent.headers,
              "x-forwarded-host": result.internalEvent.headers.host
            }
          });
          if (globalThis.__dangerous_ON_edge_converter_returns_request === true) {
            return request;
          }
          const cfCache = (result.isISR || result.internalEvent.rawPath.startsWith("/_next/image")) && process.env.DISABLE_CACHE !== "true" ? { cacheEverything: true } : {};
          return fetch(request, {
            // This is a hack to make sure that the response is cached by Cloudflare
            // See https://developers.cloudflare.com/workers/examples/cache-using-fetch/#caching-html-resources
            // @ts-expect-error - This is a Cloudflare specific option
            cf: cfCache
          });
        }
        const headers = new Headers();
        for (const [key, value] of Object.entries(result.headers)) {
          if (key === "set-cookie" && typeof value === "string") {
            const cookies = parseSetCookieHeader(value);
            for (const cookie of cookies) {
              headers.append(key, cookie);
            }
            continue;
          }
          if (Array.isArray(value)) {
            for (const v of value) {
              headers.append(key, v);
            }
          } else {
            headers.set(key, value);
          }
        }
        const body = NULL_BODY_STATUSES.has(result.statusCode) ? null : result.body;
        return new Response(body, {
          status: result.statusCode,
          headers
        });
      },
      name: "edge"
    };
    edge_default = converter;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js
var cloudflare_edge_exports = {};
__export(cloudflare_edge_exports, {
  default: () => cloudflare_edge_default
});
var cfPropNameMapping, handler, cloudflare_edge_default;
var init_cloudflare_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js"() {
    cfPropNameMapping = {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: [encodeURIComponent, "x-open-next-city"],
      country: "x-open-next-country",
      regionCode: "x-open-next-region",
      latitude: "x-open-next-latitude",
      longitude: "x-open-next-longitude"
    };
    handler = async (handler3, converter2) => async (request, env, ctx) => {
      globalThis.process = process;
      for (const [key, value] of Object.entries(env)) {
        if (typeof value === "string") {
          process.env[key] = value;
        }
      }
      const internalEvent = await converter2.convertFrom(request);
      const cfProperties = request.cf;
      for (const [propName, mapping] of Object.entries(cfPropNameMapping)) {
        const propValue = cfProperties?.[propName];
        if (propValue != null) {
          const [encode, headerName] = Array.isArray(mapping) ? mapping : [null, mapping];
          internalEvent.headers[headerName] = encode ? encode(propValue) : propValue;
        }
      }
      const response = await handler3(internalEvent, {
        waitUntil: ctx.waitUntil.bind(ctx)
      });
      const result = await converter2.convertTo(response);
      return result;
    };
    cloudflare_edge_default = {
      wrapper: handler,
      name: "cloudflare-edge",
      supportStreaming: true,
      edgeRuntime: true
    };
  }
});

// node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js
var pattern_env_exports = {};
__export(pattern_env_exports, {
  default: () => pattern_env_default
});
function initializeOnce() {
  if (initialized)
    return;
  cachedOrigins = JSON.parse(process.env.OPEN_NEXT_ORIGIN ?? "{}");
  const functions = globalThis.openNextConfig.functions ?? {};
  for (const key in functions) {
    if (key !== "default") {
      const value = functions[key];
      const regexes = [];
      for (const pattern of value.patterns) {
        const regexPattern = `/${pattern.replace(/\*\*/g, "(.*)").replace(/\*/g, "([^/]*)").replace(/\//g, "\\/").replace(/\?/g, ".")}`;
        regexes.push(new RegExp(regexPattern));
      }
      cachedPatterns.push({
        key,
        patterns: value.patterns,
        regexes
      });
    }
  }
  initialized = true;
}
var cachedOrigins, cachedPatterns, initialized, envLoader, pattern_env_default;
var init_pattern_env = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js"() {
    init_logger();
    cachedPatterns = [];
    initialized = false;
    envLoader = {
      name: "env",
      resolve: async (_path) => {
        try {
          initializeOnce();
          for (const { key, patterns, regexes } of cachedPatterns) {
            for (const regex of regexes) {
              if (regex.test(_path)) {
                debug("Using origin", key, patterns);
                return cachedOrigins[key];
              }
            }
          }
          if (_path.startsWith("/_next/image") && cachedOrigins.imageOptimizer) {
            debug("Using origin", "imageOptimizer", _path);
            return cachedOrigins.imageOptimizer;
          }
          if (cachedOrigins.default) {
            debug("Using default origin", cachedOrigins.default, _path);
            return cachedOrigins.default;
          }
          return false;
        } catch (e) {
          error("Error while resolving origin", e);
          return false;
        }
      }
    };
    pattern_env_default = envLoader;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js
var dummy_exports = {};
__export(dummy_exports, {
  default: () => dummy_default
});
var resolver, dummy_default;
var init_dummy = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js"() {
    resolver = {
      name: "dummy"
    };
    dummy_default = resolver;
  }
});

// node_modules/@opennextjs/aws/dist/utils/stream.js
import { ReadableStream as ReadableStream2 } from "node:stream/web";
function toReadableStream(value, isBase64) {
  return new ReadableStream2({
    pull(controller) {
      controller.enqueue(Buffer.from(value, isBase64 ? "base64" : "utf8"));
      controller.close();
    }
  }, { highWaterMark: 0 });
}
function emptyReadableStream() {
  if (process.env.OPEN_NEXT_FORCE_NON_EMPTY_RESPONSE === "true") {
    return new ReadableStream2({
      pull(controller) {
        maybeSomethingBuffer ??= Buffer.from("SOMETHING");
        controller.enqueue(maybeSomethingBuffer);
        controller.close();
      }
    }, { highWaterMark: 0 });
  }
  return new ReadableStream2({
    start(controller) {
      controller.close();
    }
  });
}
var maybeSomethingBuffer;
var init_stream = __esm({
  "node_modules/@opennextjs/aws/dist/utils/stream.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js
var fetch_exports = {};
__export(fetch_exports, {
  default: () => fetch_default
});
var fetchProxy, fetch_default;
var init_fetch = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js"() {
    init_stream();
    fetchProxy = {
      name: "fetch-proxy",
      // @ts-ignore
      proxy: async (internalEvent) => {
        const { url, headers: eventHeaders, method, body } = internalEvent;
        const headers = Object.fromEntries(Object.entries(eventHeaders).filter(([key]) => key.toLowerCase() !== "cf-connecting-ip"));
        const response = await fetch(url, {
          method,
          headers,
          body
        });
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
          const cur = responseHeaders[key];
          if (cur === void 0) {
            responseHeaders[key] = value;
          } else if (Array.isArray(cur)) {
            cur.push(value);
          } else {
            responseHeaders[key] = [cur, value];
          }
        });
        return {
          type: "core",
          headers: responseHeaders,
          statusCode: response.status,
          isBase64Encoded: true,
          body: response.body ?? emptyReadableStream()
        };
      }
    };
    fetch_default = fetchProxy;
  }
});

// .next/server/edge-runtime-webpack.js
var require_edge_runtime_webpack = __commonJS({
  ".next/server/edge-runtime-webpack.js"() {
    "use strict";
    (() => {
      "use strict";
      var deferred, installedChunks, webpackJsonpCallback, chunkLoadingGlobal, __webpack_modules__ = {}, __webpack_module_cache__ = {};
      function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (void 0 !== cachedModule) return cachedModule.exports;
        var module2 = __webpack_module_cache__[moduleId] = { exports: {} }, threw = true;
        try {
          __webpack_modules__[moduleId](module2, module2.exports, __webpack_require__), threw = false;
        } finally {
          threw && delete __webpack_module_cache__[moduleId];
        }
        return module2.exports;
      }
      __webpack_require__.m = __webpack_modules__, __webpack_require__.amdO = {}, deferred = [], __webpack_require__.O = (result, chunkIds, fn, priority) => {
        if (chunkIds) {
          priority = priority || 0;
          for (var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
          deferred[i] = [chunkIds, fn, priority];
          return;
        }
        for (var notFulfilled = 1 / 0, i = 0; i < deferred.length; i++) {
          for (var [chunkIds, fn, priority] = deferred[i], fulfilled = true, j = 0; j < chunkIds.length; j++) (false & priority || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => __webpack_require__.O[key](chunkIds[j])) ? chunkIds.splice(j--, 1) : (fulfilled = false, priority < notFulfilled && (notFulfilled = priority));
          if (fulfilled) {
            deferred.splice(i--, 1);
            var r = fn();
            void 0 !== r && (result = r);
          }
        }
        return result;
      }, __webpack_require__.n = (module2) => {
        var getter = module2 && module2.__esModule ? () => module2.default : () => module2;
        return __webpack_require__.d(getter, { a: getter }), getter;
      }, __webpack_require__.d = (exports2, definition) => {
        for (var key in definition) __webpack_require__.o(definition, key) && !__webpack_require__.o(exports2, key) && Object.defineProperty(exports2, key, { enumerable: true, get: definition[key] });
      }, __webpack_require__.g = function() {
        if ("object" == typeof globalThis) return globalThis;
        try {
          return this || Function("return this")();
        } catch (e) {
          if ("object" == typeof window) return window;
        }
      }(), __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop), __webpack_require__.r = (exports2) => {
        "u" > typeof Symbol && Symbol.toStringTag && Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(exports2, "__esModule", { value: true });
      }, installedChunks = { 149: 0 }, __webpack_require__.O.j = (chunkId) => 0 === installedChunks[chunkId], webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
        var moduleId, chunkId, [chunkIds, moreModules, runtime] = data, i = 0;
        if (chunkIds.some((id) => 0 !== installedChunks[id])) {
          for (moduleId in moreModules) __webpack_require__.o(moreModules, moduleId) && (__webpack_require__.m[moduleId] = moreModules[moduleId]);
          if (runtime) var result = runtime(__webpack_require__);
        }
        for (parentChunkLoadingFunction && parentChunkLoadingFunction(data); i < chunkIds.length; i++) chunkId = chunkIds[i], __webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId] && installedChunks[chunkId][0](), installedChunks[chunkId] = 0;
        return __webpack_require__.O(result);
      }, (chunkLoadingGlobal = self.webpackChunk_N_E = self.webpackChunk_N_E || []).forEach(webpackJsonpCallback.bind(null, 0)), chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
    })();
  }
});

// node-built-in-modules:node:buffer
var node_buffer_exports = {};
import * as node_buffer_star from "node:buffer";
var init_node_buffer = __esm({
  "node-built-in-modules:node:buffer"() {
    __reExport(node_buffer_exports, node_buffer_star);
  }
});

// node-built-in-modules:node:async_hooks
var node_async_hooks_exports = {};
import * as node_async_hooks_star from "node:async_hooks";
var init_node_async_hooks = __esm({
  "node-built-in-modules:node:async_hooks"() {
    __reExport(node_async_hooks_exports, node_async_hooks_star);
  }
});

// .next/server/src/middleware.js
var require_middleware = __commonJS({
  ".next/server/src/middleware.js"() {
    "use strict";
    (self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([[550], { 42: (module2) => {
      !function() {
        "use strict";
        var e = { 114: function(e2) {
          function assertPath(e3) {
            if ("string" != typeof e3) throw TypeError("Path must be a string. Received " + JSON.stringify(e3));
          }
          function normalizeStringPosix(e3, r3) {
            for (var f, t = "", i = 0, n = -1, a = 0, l = 0; l <= e3.length; ++l) {
              if (l < e3.length) f = e3.charCodeAt(l);
              else if (47 === f) break;
              else f = 47;
              if (47 === f) {
                if (n === l - 1 || 1 === a) ;
                else if (n !== l - 1 && 2 === a) {
                  if (t.length < 2 || 2 !== i || 46 !== t.charCodeAt(t.length - 1) || 46 !== t.charCodeAt(t.length - 2)) {
                    if (t.length > 2) {
                      var s = t.lastIndexOf("/");
                      if (s !== t.length - 1) {
                        -1 === s ? (t = "", i = 0) : i = (t = t.slice(0, s)).length - 1 - t.lastIndexOf("/"), n = l, a = 0;
                        continue;
                      }
                    } else if (2 === t.length || 1 === t.length) {
                      t = "", i = 0, n = l, a = 0;
                      continue;
                    }
                  }
                  r3 && (t.length > 0 ? t += "/.." : t = "..", i = 2);
                } else t.length > 0 ? t += "/" + e3.slice(n + 1, l) : t = e3.slice(n + 1, l), i = l - n - 1;
                n = l, a = 0;
              } else 46 === f && -1 !== a ? ++a : a = -1;
            }
            return t;
          }
          function _format(e3, r3) {
            var t = r3.dir || r3.root, i = r3.base || (r3.name || "") + (r3.ext || "");
            return t ? t === r3.root ? t + i : t + e3 + i : i;
          }
          var r2 = { resolve: function resolve() {
            for (var t, n, e3 = "", r3 = false, i = arguments.length - 1; i >= -1 && !r3; i--) i >= 0 ? n = arguments[i] : (void 0 === t && (t = ""), n = t), assertPath(n), 0 !== n.length && (e3 = n + "/" + e3, r3 = 47 === n.charCodeAt(0));
            if (e3 = normalizeStringPosix(e3, !r3), r3) if (e3.length > 0) return "/" + e3;
            else return "/";
            return e3.length > 0 ? e3 : ".";
          }, normalize: function normalize(e3) {
            if (assertPath(e3), 0 === e3.length) return ".";
            var r3 = 47 === e3.charCodeAt(0), t = 47 === e3.charCodeAt(e3.length - 1);
            return (0 !== (e3 = normalizeStringPosix(e3, !r3)).length || r3 || (e3 = "."), e3.length > 0 && t && (e3 += "/"), r3) ? "/" + e3 : e3;
          }, isAbsolute: function isAbsolute(e3) {
            return assertPath(e3), e3.length > 0 && 47 === e3.charCodeAt(0);
          }, join: function join() {
            if (0 == arguments.length) return ".";
            for (var e3, t = 0; t < arguments.length; ++t) {
              var i = arguments[t];
              assertPath(i), i.length > 0 && (void 0 === e3 ? e3 = i : e3 += "/" + i);
            }
            return void 0 === e3 ? "." : r2.normalize(e3);
          }, relative: function relative(e3, t) {
            if (assertPath(e3), assertPath(t), e3 === t || (e3 = r2.resolve(e3)) === (t = r2.resolve(t))) return "";
            for (var i = 1; i < e3.length && 47 === e3.charCodeAt(i); ++i) ;
            for (var n = e3.length, a = n - i, f = 1; f < t.length && 47 === t.charCodeAt(f); ++f) ;
            for (var s = t.length - f, o = a < s ? a : s, u = -1, h = 0; h <= o; ++h) {
              if (h === o) {
                if (s > o) {
                  if (47 === t.charCodeAt(f + h)) return t.slice(f + h + 1);
                  else if (0 === h) return t.slice(f + h);
                } else a > o && (47 === e3.charCodeAt(i + h) ? u = h : 0 === h && (u = 0));
                break;
              }
              var c = e3.charCodeAt(i + h);
              if (c !== t.charCodeAt(f + h)) break;
              47 === c && (u = h);
            }
            var g = "";
            for (h = i + u + 1; h <= n; ++h) (h === n || 47 === e3.charCodeAt(h)) && (0 === g.length ? g += ".." : g += "/..");
            return g.length > 0 ? g + t.slice(f + u) : (f += u, 47 === t.charCodeAt(f) && ++f, t.slice(f));
          }, _makeLong: function _makeLong(e3) {
            return e3;
          }, dirname: function dirname(e3) {
            if (assertPath(e3), 0 === e3.length) return ".";
            for (var r3 = e3.charCodeAt(0), t = 47 === r3, i = -1, n = true, a = e3.length - 1; a >= 1; --a) if (47 === (r3 = e3.charCodeAt(a))) {
              if (!n) {
                i = a;
                break;
              }
            } else n = false;
            return -1 === i ? t ? "/" : "." : t && 1 === i ? "//" : e3.slice(0, i);
          }, basename: function basename(e3, r3) {
            if (void 0 !== r3 && "string" != typeof r3) throw TypeError('"ext" argument must be a string');
            assertPath(e3);
            var a, t = 0, i = -1, n = true;
            if (void 0 !== r3 && r3.length > 0 && r3.length <= e3.length) {
              if (r3.length === e3.length && r3 === e3) return "";
              var f = r3.length - 1, l = -1;
              for (a = e3.length - 1; a >= 0; --a) {
                var s = e3.charCodeAt(a);
                if (47 === s) {
                  if (!n) {
                    t = a + 1;
                    break;
                  }
                } else -1 === l && (n = false, l = a + 1), f >= 0 && (s === r3.charCodeAt(f) ? -1 == --f && (i = a) : (f = -1, i = l));
              }
              return t === i ? i = l : -1 === i && (i = e3.length), e3.slice(t, i);
            }
            for (a = e3.length - 1; a >= 0; --a) if (47 === e3.charCodeAt(a)) {
              if (!n) {
                t = a + 1;
                break;
              }
            } else -1 === i && (n = false, i = a + 1);
            return -1 === i ? "" : e3.slice(t, i);
          }, extname: function extname(e3) {
            assertPath(e3);
            for (var r3 = -1, t = 0, i = -1, n = true, a = 0, f = e3.length - 1; f >= 0; --f) {
              var l = e3.charCodeAt(f);
              if (47 === l) {
                if (!n) {
                  t = f + 1;
                  break;
                }
                continue;
              }
              -1 === i && (n = false, i = f + 1), 46 === l ? -1 === r3 ? r3 = f : 1 !== a && (a = 1) : -1 !== r3 && (a = -1);
            }
            return -1 === r3 || -1 === i || 0 === a || 1 === a && r3 === i - 1 && r3 === t + 1 ? "" : e3.slice(r3, i);
          }, format: function format(e3) {
            if (null === e3 || "object" != typeof e3) throw TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof e3);
            return _format("/", e3);
          }, parse: function parse3(e3) {
            assertPath(e3);
            var n, r3 = { root: "", dir: "", base: "", ext: "", name: "" };
            if (0 === e3.length) return r3;
            var t = e3.charCodeAt(0), i = 47 === t;
            i ? (r3.root = "/", n = 1) : n = 0;
            for (var a = -1, f = 0, l = -1, s = true, o = e3.length - 1, u = 0; o >= n; --o) {
              if (47 === (t = e3.charCodeAt(o))) {
                if (!s) {
                  f = o + 1;
                  break;
                }
                continue;
              }
              -1 === l && (s = false, l = o + 1), 46 === t ? -1 === a ? a = o : 1 !== u && (u = 1) : -1 !== a && (u = -1);
            }
            return -1 === a || -1 === l || 0 === u || 1 === u && a === l - 1 && a === f + 1 ? -1 !== l && (0 === f && i ? r3.base = r3.name = e3.slice(1, l) : r3.base = r3.name = e3.slice(f, l)) : (0 === f && i ? (r3.name = e3.slice(1, a), r3.base = e3.slice(1, l)) : (r3.name = e3.slice(f, a), r3.base = e3.slice(f, l)), r3.ext = e3.slice(a, l)), f > 0 ? r3.dir = e3.slice(0, f - 1) : i && (r3.dir = "/"), r3;
          }, sep: "/", delimiter: ":", win32: null, posix: null };
          r2.posix = r2, e2.exports = r2;
        } }, r = {};
        function __nccwpck_require__1(t) {
          var i = r[t];
          if (void 0 !== i) return i.exports;
          var n = r[t] = { exports: {} }, a = true;
          try {
            e[t](n, n.exports, __nccwpck_require__1), a = false;
          } finally {
            a && delete r[t];
          }
          return n.exports;
        }
        __nccwpck_require__1.ab = "//", module2.exports = __nccwpck_require__1(114);
      }();
    }, 232: (module2) => {
      (() => {
        "use strict";
        var e = { 993: (e2) => {
          var t2 = Object.prototype.hasOwnProperty, n2 = "~";
          function Events() {
          }
          function EE(e3, t3, n3) {
            this.fn = e3, this.context = t3, this.once = n3 || false;
          }
          function addListener(e3, t3, r, i, s) {
            if ("function" != typeof r) throw TypeError("The listener must be a function");
            var o = new EE(r, i || e3, s), u = n2 ? n2 + t3 : t3;
            return e3._events[u] ? e3._events[u].fn ? e3._events[u] = [e3._events[u], o] : e3._events[u].push(o) : (e3._events[u] = o, e3._eventsCount++), e3;
          }
          function clearEvent(e3, t3) {
            0 == --e3._eventsCount ? e3._events = new Events() : delete e3._events[t3];
          }
          function EventEmitter() {
            this._events = new Events(), this._eventsCount = 0;
          }
          Object.create && (Events.prototype = /* @__PURE__ */ Object.create(null), new Events().__proto__ || (n2 = false)), EventEmitter.prototype.eventNames = function eventNames() {
            var r, i, e3 = [];
            if (0 === this._eventsCount) return e3;
            for (i in r = this._events) t2.call(r, i) && e3.push(n2 ? i.slice(1) : i);
            return Object.getOwnPropertySymbols ? e3.concat(Object.getOwnPropertySymbols(r)) : e3;
          }, EventEmitter.prototype.listeners = function listeners(e3) {
            var t3 = n2 ? n2 + e3 : e3, r = this._events[t3];
            if (!r) return [];
            if (r.fn) return [r.fn];
            for (var i = 0, s = r.length, o = Array(s); i < s; i++) o[i] = r[i].fn;
            return o;
          }, EventEmitter.prototype.listenerCount = function listenerCount(e3) {
            var t3 = n2 ? n2 + e3 : e3, r = this._events[t3];
            return r ? r.fn ? 1 : r.length : 0;
          }, EventEmitter.prototype.emit = function emit(e3, t3, r, i, s, o) {
            var u = n2 ? n2 + e3 : e3;
            if (!this._events[u]) return false;
            var c, h, a = this._events[u], l = arguments.length;
            if (a.fn) {
              switch (a.once && this.removeListener(e3, a.fn, void 0, true), l) {
                case 1:
                  return a.fn.call(a.context), true;
                case 2:
                  return a.fn.call(a.context, t3), true;
                case 3:
                  return a.fn.call(a.context, t3, r), true;
                case 4:
                  return a.fn.call(a.context, t3, r, i), true;
                case 5:
                  return a.fn.call(a.context, t3, r, i, s), true;
                case 6:
                  return a.fn.call(a.context, t3, r, i, s, o), true;
              }
              for (h = 1, c = Array(l - 1); h < l; h++) c[h - 1] = arguments[h];
              a.fn.apply(a.context, c);
            } else {
              var f, _ = a.length;
              for (h = 0; h < _; h++) switch (a[h].once && this.removeListener(e3, a[h].fn, void 0, true), l) {
                case 1:
                  a[h].fn.call(a[h].context);
                  break;
                case 2:
                  a[h].fn.call(a[h].context, t3);
                  break;
                case 3:
                  a[h].fn.call(a[h].context, t3, r);
                  break;
                case 4:
                  a[h].fn.call(a[h].context, t3, r, i);
                  break;
                default:
                  if (!c) for (f = 1, c = Array(l - 1); f < l; f++) c[f - 1] = arguments[f];
                  a[h].fn.apply(a[h].context, c);
              }
            }
            return true;
          }, EventEmitter.prototype.on = function on(e3, t3, n3) {
            return addListener(this, e3, t3, n3, false);
          }, EventEmitter.prototype.once = function once(e3, t3, n3) {
            return addListener(this, e3, t3, n3, true);
          }, EventEmitter.prototype.removeListener = function removeListener(e3, t3, r, i) {
            var s = n2 ? n2 + e3 : e3;
            if (!this._events[s]) return this;
            if (!t3) return clearEvent(this, s), this;
            var o = this._events[s];
            if (o.fn) o.fn !== t3 || i && !o.once || r && o.context !== r || clearEvent(this, s);
            else {
              for (var u = 0, a = [], l = o.length; u < l; u++) (o[u].fn !== t3 || i && !o[u].once || r && o[u].context !== r) && a.push(o[u]);
              a.length ? this._events[s] = 1 === a.length ? a[0] : a : clearEvent(this, s);
            }
            return this;
          }, EventEmitter.prototype.removeAllListeners = function removeAllListeners(e3) {
            var t3;
            return e3 ? (t3 = n2 ? n2 + e3 : e3, this._events[t3] && clearEvent(this, t3)) : (this._events = new Events(), this._eventsCount = 0), this;
          }, EventEmitter.prototype.off = EventEmitter.prototype.removeListener, EventEmitter.prototype.addListener = EventEmitter.prototype.on, EventEmitter.prefixed = n2, EventEmitter.EventEmitter = EventEmitter, e2.exports = EventEmitter;
        }, 213: (e2) => {
          e2.exports = (e3, t2) => (t2 = t2 || (() => {
          }), e3.then((e4) => new Promise((e5) => {
            e5(t2());
          }).then(() => e4), (e4) => new Promise((e5) => {
            e5(t2());
          }).then(() => {
            throw e4;
          })));
        }, 574: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.default = function lowerBound(e3, t3, n2) {
            let r = 0, i = e3.length;
            for (; i > 0; ) {
              let s = i / 2 | 0, o = r + s;
              0 >= n2(e3[o], t3) ? (r = ++o, i -= s + 1) : i = s;
            }
            return r;
          };
        }, 821: (e2, t2, n2) => {
          Object.defineProperty(t2, "__esModule", { value: true });
          let r = n2(574);
          class PriorityQueue {
            constructor() {
              this._queue = [];
            }
            enqueue(e3, t3) {
              let n3 = { priority: (t3 = Object.assign({ priority: 0 }, t3)).priority, run: e3 };
              if (this.size && this._queue[this.size - 1].priority >= t3.priority) return void this._queue.push(n3);
              let i = r.default(this._queue, n3, (e4, t4) => t4.priority - e4.priority);
              this._queue.splice(i, 0, n3);
            }
            dequeue() {
              let e3 = this._queue.shift();
              return null == e3 ? void 0 : e3.run;
            }
            filter(e3) {
              return this._queue.filter((t3) => t3.priority === e3.priority).map((e4) => e4.run);
            }
            get size() {
              return this._queue.length;
            }
          }
          t2.default = PriorityQueue;
        }, 816: (e2, t2, n2) => {
          let r = n2(213);
          class TimeoutError extends Error {
            constructor(e3) {
              super(e3), this.name = "TimeoutError";
            }
          }
          let pTimeout = (e3, t3, n3) => new Promise((i, s) => {
            if ("number" != typeof t3 || t3 < 0) throw TypeError("Expected `milliseconds` to be a positive number");
            if (t3 === 1 / 0) return void i(e3);
            let o = setTimeout(() => {
              if ("function" == typeof n3) {
                try {
                  i(n3());
                } catch (e4) {
                  s(e4);
                }
                return;
              }
              let r2 = "string" == typeof n3 ? n3 : `Promise timed out after ${t3} milliseconds`, o2 = n3 instanceof Error ? n3 : new TimeoutError(r2);
              "function" == typeof e3.cancel && e3.cancel(), s(o2);
            }, t3);
            r(e3.then(i, s), () => {
              clearTimeout(o);
            });
          });
          e2.exports = pTimeout, e2.exports.default = pTimeout, e2.exports.TimeoutError = TimeoutError;
        } }, t = {};
        function __nccwpck_require__1(n2) {
          var r = t[n2];
          if (void 0 !== r) return r.exports;
          var i = t[n2] = { exports: {} }, s = true;
          try {
            e[n2](i, i.exports, __nccwpck_require__1), s = false;
          } finally {
            s && delete t[n2];
          }
          return i.exports;
        }
        __nccwpck_require__1.ab = "//";
        var n = {};
        (() => {
          Object.defineProperty(n, "__esModule", { value: true });
          let t2 = __nccwpck_require__1(993), r = __nccwpck_require__1(816), i = __nccwpck_require__1(821), empty = () => {
          }, s = new r.TimeoutError();
          class PQueue extends t2 {
            constructor(e2) {
              var t3, n2, r2, s2;
              if (super(), this._intervalCount = 0, this._intervalEnd = 0, this._pendingCount = 0, this._resolveEmpty = empty, this._resolveIdle = empty, !("number" == typeof (e2 = Object.assign({ carryoverConcurrencyCount: false, intervalCap: 1 / 0, interval: 0, concurrency: 1 / 0, autoStart: true, queueClass: i.default }, e2)).intervalCap && e2.intervalCap >= 1)) throw TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${null != (n2 = null == (t3 = e2.intervalCap) ? void 0 : t3.toString()) ? n2 : ""}\` (${typeof e2.intervalCap})`);
              if (void 0 === e2.interval || !(Number.isFinite(e2.interval) && e2.interval >= 0)) throw TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${null != (s2 = null == (r2 = e2.interval) ? void 0 : r2.toString()) ? s2 : ""}\` (${typeof e2.interval})`);
              this._carryoverConcurrencyCount = e2.carryoverConcurrencyCount, this._isIntervalIgnored = e2.intervalCap === 1 / 0 || 0 === e2.interval, this._intervalCap = e2.intervalCap, this._interval = e2.interval, this._queue = new e2.queueClass(), this._queueClass = e2.queueClass, this.concurrency = e2.concurrency, this._timeout = e2.timeout, this._throwOnTimeout = true === e2.throwOnTimeout, this._isPaused = false === e2.autoStart;
            }
            get _doesIntervalAllowAnother() {
              return this._isIntervalIgnored || this._intervalCount < this._intervalCap;
            }
            get _doesConcurrentAllowAnother() {
              return this._pendingCount < this._concurrency;
            }
            _next() {
              this._pendingCount--, this._tryToStartAnother(), this.emit("next");
            }
            _resolvePromises() {
              this._resolveEmpty(), this._resolveEmpty = empty, 0 === this._pendingCount && (this._resolveIdle(), this._resolveIdle = empty, this.emit("idle"));
            }
            _onResumeInterval() {
              this._onInterval(), this._initializeIntervalIfNeeded(), this._timeoutId = void 0;
            }
            _isIntervalPaused() {
              let e2 = Date.now();
              if (void 0 === this._intervalId) {
                let t3 = this._intervalEnd - e2;
                if (!(t3 < 0)) return void 0 === this._timeoutId && (this._timeoutId = setTimeout(() => {
                  this._onResumeInterval();
                }, t3)), true;
                this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0;
              }
              return false;
            }
            _tryToStartAnother() {
              if (0 === this._queue.size) return this._intervalId && clearInterval(this._intervalId), this._intervalId = void 0, this._resolvePromises(), false;
              if (!this._isPaused) {
                let e2 = !this._isIntervalPaused();
                if (this._doesIntervalAllowAnother && this._doesConcurrentAllowAnother) {
                  let t3 = this._queue.dequeue();
                  return !!t3 && (this.emit("active"), t3(), e2 && this._initializeIntervalIfNeeded(), true);
                }
              }
              return false;
            }
            _initializeIntervalIfNeeded() {
              this._isIntervalIgnored || void 0 !== this._intervalId || (this._intervalId = setInterval(() => {
                this._onInterval();
              }, this._interval), this._intervalEnd = Date.now() + this._interval);
            }
            _onInterval() {
              0 === this._intervalCount && 0 === this._pendingCount && this._intervalId && (clearInterval(this._intervalId), this._intervalId = void 0), this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0, this._processQueue();
            }
            _processQueue() {
              for (; this._tryToStartAnother(); ) ;
            }
            get concurrency() {
              return this._concurrency;
            }
            set concurrency(e2) {
              if (!("number" == typeof e2 && e2 >= 1)) throw TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${e2}\` (${typeof e2})`);
              this._concurrency = e2, this._processQueue();
            }
            async add(e2, t3 = {}) {
              return new Promise((n2, i2) => {
                let run = async () => {
                  this._pendingCount++, this._intervalCount++;
                  try {
                    let o = void 0 === this._timeout && void 0 === t3.timeout ? e2() : r.default(Promise.resolve(e2()), void 0 === t3.timeout ? this._timeout : t3.timeout, () => {
                      (void 0 === t3.throwOnTimeout ? this._throwOnTimeout : t3.throwOnTimeout) && i2(s);
                    });
                    n2(await o);
                  } catch (e3) {
                    i2(e3);
                  }
                  this._next();
                };
                this._queue.enqueue(run, t3), this._tryToStartAnother(), this.emit("add");
              });
            }
            async addAll(e2, t3) {
              return Promise.all(e2.map(async (e3) => this.add(e3, t3)));
            }
            start() {
              return this._isPaused && (this._isPaused = false, this._processQueue()), this;
            }
            pause() {
              this._isPaused = true;
            }
            clear() {
              this._queue = new this._queueClass();
            }
            async onEmpty() {
              if (0 !== this._queue.size) return new Promise((e2) => {
                let t3 = this._resolveEmpty;
                this._resolveEmpty = () => {
                  t3(), e2();
                };
              });
            }
            async onIdle() {
              if (0 !== this._pendingCount || 0 !== this._queue.size) return new Promise((e2) => {
                let t3 = this._resolveIdle;
                this._resolveIdle = () => {
                  t3(), e2();
                };
              });
            }
            get size() {
              return this._queue.size;
            }
            sizeBy(e2) {
              return this._queue.filter(e2).length;
            }
            get pending() {
              return this._pendingCount;
            }
            get isPaused() {
              return this._isPaused;
            }
            get timeout() {
              return this._timeout;
            }
            set timeout(e2) {
              this._timeout = e2;
            }
          }
          n.default = PQueue;
        })(), module2.exports = n;
      })();
    }, 259: (module2) => {
      (() => {
        "use strict";
        "u" > typeof __nccwpck_require__ && (__nccwpck_require__.ab = "//");
        var e = {};
        (() => {
          function lexer2(e2) {
            for (var n = [], r = 0; r < e2.length; ) {
              var t = e2[r];
              if ("*" === t || "+" === t || "?" === t) {
                n.push({ type: "MODIFIER", index: r, value: e2[r++] });
                continue;
              }
              if ("\\" === t) {
                n.push({ type: "ESCAPED_CHAR", index: r++, value: e2[r++] });
                continue;
              }
              if ("{" === t) {
                n.push({ type: "OPEN", index: r, value: e2[r++] });
                continue;
              }
              if ("}" === t) {
                n.push({ type: "CLOSE", index: r, value: e2[r++] });
                continue;
              }
              if (":" === t) {
                for (var a = "", i = r + 1; i < e2.length; ) {
                  var o = e2.charCodeAt(i);
                  if (o >= 48 && o <= 57 || o >= 65 && o <= 90 || o >= 97 && o <= 122 || 95 === o) {
                    a += e2[i++];
                    continue;
                  }
                  break;
                }
                if (!a) throw TypeError("Missing parameter name at ".concat(r));
                n.push({ type: "NAME", index: r, value: a }), r = i;
                continue;
              }
              if ("(" === t) {
                var c = 1, f = "", i = r + 1;
                if ("?" === e2[i]) throw TypeError('Pattern cannot start with "?" at '.concat(i));
                for (; i < e2.length; ) {
                  if ("\\" === e2[i]) {
                    f += e2[i++] + e2[i++];
                    continue;
                  }
                  if (")" === e2[i]) {
                    if (0 == --c) {
                      i++;
                      break;
                    }
                  } else if ("(" === e2[i] && (c++, "?" !== e2[i + 1])) throw TypeError("Capturing groups are not allowed at ".concat(i));
                  f += e2[i++];
                }
                if (c) throw TypeError("Unbalanced pattern at ".concat(r));
                if (!f) throw TypeError("Missing pattern at ".concat(r));
                n.push({ type: "PATTERN", index: r, value: f }), r = i;
                continue;
              }
              n.push({ type: "CHAR", index: r, value: e2[r++] });
            }
            return n.push({ type: "END", index: r, value: "" }), n;
          }
          function parse3(e2, n) {
            void 0 === n && (n = {});
            for (var r = lexer2(e2), t = n.prefixes, a = void 0 === t ? "./" : t, i = n.delimiter, o = void 0 === i ? "/#?" : i, c = [], f = 0, u = 0, p = "", tryConsume = function(e3) {
              if (u < r.length && r[u].type === e3) return r[u++].value;
            }, mustConsume = function(e3) {
              var n2 = tryConsume(e3);
              if (void 0 !== n2) return n2;
              var t2 = r[u], a2 = t2.type, i2 = t2.index;
              throw TypeError("Unexpected ".concat(a2, " at ").concat(i2, ", expected ").concat(e3));
            }, consumeText = function() {
              for (var n2, e3 = ""; n2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR"); ) e3 += n2;
              return e3;
            }, isSafe = function(e3) {
              for (var n2 = 0; n2 < o.length; n2++) {
                var t2 = o[n2];
                if (e3.indexOf(t2) > -1) return true;
              }
              return false;
            }, safePattern = function(e3) {
              var n2 = c[c.length - 1], r2 = e3 || (n2 && "string" == typeof n2 ? n2 : "");
              if (n2 && !r2) throw TypeError('Must have text between two parameters, missing text after "'.concat(n2.name, '"'));
              return !r2 || isSafe(r2) ? "[^".concat(escapeString2(o), "]+?") : "(?:(?!".concat(escapeString2(r2), ")[^").concat(escapeString2(o), "])+?");
            }; u < r.length; ) {
              var v = tryConsume("CHAR"), s = tryConsume("NAME"), d = tryConsume("PATTERN");
              if (s || d) {
                var g = v || "";
                -1 === a.indexOf(g) && (p += g, g = ""), p && (c.push(p), p = ""), c.push({ name: s || f++, prefix: g, suffix: "", pattern: d || safePattern(g), modifier: tryConsume("MODIFIER") || "" });
                continue;
              }
              var x = v || tryConsume("ESCAPED_CHAR");
              if (x) {
                p += x;
                continue;
              }
              if (p && (c.push(p), p = ""), tryConsume("OPEN")) {
                var g = consumeText(), l = tryConsume("NAME") || "", m = tryConsume("PATTERN") || "", T = consumeText();
                mustConsume("CLOSE"), c.push({ name: l || (m ? f++ : ""), pattern: l && !m ? safePattern(g) : m, prefix: g, suffix: T, modifier: tryConsume("MODIFIER") || "" });
                continue;
              }
              mustConsume("END");
            }
            return c;
          }
          function tokensToFunction2(e2, n) {
            void 0 === n && (n = {});
            var r = flags2(n), t = n.encode, a = void 0 === t ? function(e3) {
              return e3;
            } : t, i = n.validate, o = void 0 === i || i, c = e2.map(function(e3) {
              if ("object" == typeof e3) return new RegExp("^(?:".concat(e3.pattern, ")$"), r);
            });
            return function(n2) {
              for (var r2 = "", t2 = 0; t2 < e2.length; t2++) {
                var i2 = e2[t2];
                if ("string" == typeof i2) {
                  r2 += i2;
                  continue;
                }
                var f = n2 ? n2[i2.name] : void 0, u = "?" === i2.modifier || "*" === i2.modifier, p = "*" === i2.modifier || "+" === i2.modifier;
                if (Array.isArray(f)) {
                  if (!p) throw TypeError('Expected "'.concat(i2.name, '" to not repeat, but got an array'));
                  if (0 === f.length) {
                    if (u) continue;
                    throw TypeError('Expected "'.concat(i2.name, '" to not be empty'));
                  }
                  for (var v = 0; v < f.length; v++) {
                    var s = a(f[v], i2);
                    if (o && !c[t2].test(s)) throw TypeError('Expected all "'.concat(i2.name, '" to match "').concat(i2.pattern, '", but got "').concat(s, '"'));
                    r2 += i2.prefix + s + i2.suffix;
                  }
                  continue;
                }
                if ("string" == typeof f || "number" == typeof f) {
                  var s = a(String(f), i2);
                  if (o && !c[t2].test(s)) throw TypeError('Expected "'.concat(i2.name, '" to match "').concat(i2.pattern, '", but got "').concat(s, '"'));
                  r2 += i2.prefix + s + i2.suffix;
                  continue;
                }
                if (!u) {
                  var d = p ? "an array" : "a string";
                  throw TypeError('Expected "'.concat(i2.name, '" to be ').concat(d));
                }
              }
              return r2;
            };
          }
          function regexpToFunction2(e2, n, r) {
            void 0 === r && (r = {});
            var t = r.decode, a = void 0 === t ? function(e3) {
              return e3;
            } : t;
            return function(r2) {
              var t2 = e2.exec(r2);
              if (!t2) return false;
              for (var i = t2[0], o = t2.index, c = /* @__PURE__ */ Object.create(null), f = 1; f < t2.length; f++) !function(e3) {
                if (void 0 !== t2[e3]) {
                  var r3 = n[e3 - 1];
                  "*" === r3.modifier || "+" === r3.modifier ? c[r3.name] = t2[e3].split(r3.prefix + r3.suffix).map(function(e4) {
                    return a(e4, r3);
                  }) : c[r3.name] = a(t2[e3], r3);
                }
              }(f);
              return { path: i, index: o, params: c };
            };
          }
          function escapeString2(e2) {
            return e2.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
          }
          function flags2(e2) {
            return e2 && e2.sensitive ? "" : "i";
          }
          function regexpToRegexp2(e2, n) {
            if (!n) return e2;
            for (var r = /\((?:\?<(.*?)>)?(?!\?)/g, t = 0, a = r.exec(e2.source); a; ) n.push({ name: a[1] || t++, prefix: "", suffix: "", modifier: "", pattern: "" }), a = r.exec(e2.source);
            return e2;
          }
          function arrayToRegexp2(e2, n, r) {
            var t = e2.map(function(e3) {
              return pathToRegexp2(e3, n, r).source;
            });
            return new RegExp("(?:".concat(t.join("|"), ")"), flags2(r));
          }
          function stringToRegexp2(e2, n, r) {
            return tokensToRegexp2(parse3(e2, r), n, r);
          }
          function tokensToRegexp2(e2, n, r) {
            void 0 === r && (r = {});
            for (var t = r.strict, a = void 0 !== t && t, i = r.start, c = r.end, u = r.encode, p = void 0 === u ? function(e3) {
              return e3;
            } : u, v = r.delimiter, d = r.endsWith, x = "[".concat(escapeString2(void 0 === d ? "" : d), "]|$"), h = "[".concat(escapeString2(void 0 === v ? "/#?" : v), "]"), l = void 0 === i || i ? "^" : "", m = 0; m < e2.length; m++) {
              var E = e2[m];
              if ("string" == typeof E) l += escapeString2(p(E));
              else {
                var w = escapeString2(p(E.prefix)), y = escapeString2(p(E.suffix));
                if (E.pattern) if (n && n.push(E), w || y) if ("+" === E.modifier || "*" === E.modifier) {
                  var R = "*" === E.modifier ? "?" : "";
                  l += "(?:".concat(w, "((?:").concat(E.pattern, ")(?:").concat(y).concat(w, "(?:").concat(E.pattern, "))*)").concat(y, ")").concat(R);
                } else l += "(?:".concat(w, "(").concat(E.pattern, ")").concat(y, ")").concat(E.modifier);
                else {
                  if ("+" === E.modifier || "*" === E.modifier) throw TypeError('Can not repeat "'.concat(E.name, '" without a prefix and suffix'));
                  l += "(".concat(E.pattern, ")").concat(E.modifier);
                }
                else l += "(?:".concat(w).concat(y, ")").concat(E.modifier);
              }
            }
            if (void 0 === c || c) a || (l += "".concat(h, "?")), l += r.endsWith ? "(?=".concat(x, ")") : "$";
            else {
              var A = e2[e2.length - 1], _ = "string" == typeof A ? h.indexOf(A[A.length - 1]) > -1 : void 0 === A;
              a || (l += "(?:".concat(h, "(?=").concat(x, "))?")), _ || (l += "(?=".concat(h, "|").concat(x, ")"));
            }
            return new RegExp(l, flags2(r));
          }
          function pathToRegexp2(e2, n, r) {
            return e2 instanceof RegExp ? regexpToRegexp2(e2, n) : Array.isArray(e2) ? arrayToRegexp2(e2, n, r) : stringToRegexp2(e2, n, r);
          }
          Object.defineProperty(e, "__esModule", { value: true }), e.pathToRegexp = e.tokensToRegexp = e.regexpToFunction = e.match = e.tokensToFunction = e.compile = e.parse = void 0, e.parse = parse3, e.compile = function compile2(e2, n) {
            return tokensToFunction2(parse3(e2, n), n);
          }, e.tokensToFunction = tokensToFunction2, e.match = function match2(e2, n) {
            var r = [];
            return regexpToFunction2(pathToRegexp2(e2, r, n), r, n);
          }, e.regexpToFunction = regexpToFunction2, e.tokensToRegexp = tokensToRegexp2, e.pathToRegexp = pathToRegexp2;
        })(), module2.exports = e;
      })();
    }, 318: (__unused_webpack_module, exports2, __webpack_require__) => {
      "use strict";
      var Buffer3 = __webpack_require__(356).Buffer;
      Object.defineProperty(exports2, "__esModule", { value: true }), function _export(target, all) {
        for (var name in all) Object.defineProperty(target, name, { enumerable: true, get: all[name] });
      }(exports2, { handleFetch: function() {
        return handleFetch;
      }, interceptFetch: function() {
        return interceptFetch;
      }, reader: function() {
        return reader;
      } });
      let _context = __webpack_require__(643), reader = { url: (req) => req.url, header: (req, name) => req.headers.get(name) };
      function getTestStack() {
        let stack = (Error().stack ?? "").split("\n");
        for (let i = 1; i < stack.length; i++) if (stack[i].length > 0) {
          stack = stack.slice(i);
          break;
        }
        return (stack = (stack = (stack = stack.filter((f) => !f.includes("/next/dist/"))).slice(0, 5)).map((s) => s.replace("webpack-internal:///(rsc)/", "").trim())).join("    ");
      }
      async function buildProxyRequest(testData, request) {
        let { url, method, headers, body, cache, credentials, integrity, mode, redirect, referrer, referrerPolicy } = request;
        return { testData, api: "fetch", request: { url, method, headers: [...Array.from(headers), ["next-test-stack", getTestStack()]], body: body ? Buffer3.from(await request.arrayBuffer()).toString("base64") : null, cache, credentials, integrity, mode, redirect, referrer, referrerPolicy } };
      }
      function buildResponse(proxyResponse) {
        let { status, headers, body } = proxyResponse.response;
        return new Response(body ? Buffer3.from(body, "base64") : null, { status, headers: new Headers(headers) });
      }
      async function handleFetch(originalFetch, request) {
        let testInfo = (0, _context.getTestReqInfo)(request, reader);
        if (!testInfo) return originalFetch(request);
        let { testData, proxyPort } = testInfo, proxyRequest = await buildProxyRequest(testData, request), resp = await originalFetch(`http://localhost:${proxyPort}`, { method: "POST", body: JSON.stringify(proxyRequest), next: { internal: true } });
        if (!resp.ok) throw Object.defineProperty(Error(`Proxy request failed: ${resp.status}`), "__NEXT_ERROR_CODE", { value: "E146", enumerable: false, configurable: true });
        let proxyResponse = await resp.json(), { api } = proxyResponse;
        switch (api) {
          case "continue":
            return originalFetch(request);
          case "abort":
          case "unhandled":
            throw Object.defineProperty(Error(`Proxy request aborted [${request.method} ${request.url}]`), "__NEXT_ERROR_CODE", { value: "E145", enumerable: false, configurable: true });
          case "fetch":
            return buildResponse(proxyResponse);
          default:
            return api;
        }
      }
      function interceptFetch(originalFetch) {
        return __webpack_require__.g.fetch = function testFetch(input, init) {
          var _init_next;
          return (null == init || null == (_init_next = init.next) ? void 0 : _init_next.internal) ? originalFetch(input, init) : handleFetch(originalFetch, new Request(input, init));
        }, () => {
          __webpack_require__.g.fetch = originalFetch;
        };
      }
    }, 345: (module2, __unused_webpack_exports, __webpack_require__) => {
      "use strict";
      module2.exports = __webpack_require__(417);
    }, 356: (module2) => {
      "use strict";
      module2.exports = (init_node_buffer(), __toCommonJS(node_buffer_exports));
    }, 417: (__unused_webpack_module, exports2) => {
      "use strict";
      var ReactSharedInternals_A = null;
      Symbol.for("react.transitional.element"), Symbol.for("react.portal"), Symbol.for("react.fragment"), Symbol.for("react.strict_mode"), Symbol.for("react.profiler"), Symbol.for("react.forward_ref"), Symbol.for("react.suspense"), Symbol.for("react.memo"), Symbol.for("react.lazy"), Symbol.for("react.activity"), Symbol.for("react.view_transition"), Symbol.iterator;
      Object.prototype.hasOwnProperty;
      function createCacheRoot() {
        return /* @__PURE__ */ new WeakMap();
      }
      function createCacheNode() {
        return { s: 0, v: void 0, o: null, p: null };
      }
      exports2.cache = function(fn) {
        return function() {
          var dispatcher = ReactSharedInternals_A;
          if (!dispatcher) return fn.apply(null, arguments);
          var fnMap = dispatcher.getCacheForType(createCacheRoot);
          void 0 === (dispatcher = fnMap.get(fn)) && (dispatcher = createCacheNode(), fnMap.set(fn, dispatcher)), fnMap = 0;
          for (var l = arguments.length; fnMap < l; fnMap++) {
            var arg = arguments[fnMap];
            if ("function" == typeof arg || "object" == typeof arg && null !== arg) {
              var objectCache = dispatcher.o;
              null === objectCache && (dispatcher.o = objectCache = /* @__PURE__ */ new WeakMap()), void 0 === (dispatcher = objectCache.get(arg)) && (dispatcher = createCacheNode(), objectCache.set(arg, dispatcher));
            } else null === (objectCache = dispatcher.p) && (dispatcher.p = objectCache = /* @__PURE__ */ new Map()), void 0 === (dispatcher = objectCache.get(arg)) && (dispatcher = createCacheNode(), objectCache.set(arg, dispatcher));
          }
          if (1 === dispatcher.s) return dispatcher.v;
          if (2 === dispatcher.s) throw dispatcher.v;
          try {
            var result = fn.apply(null, arguments);
            return (fnMap = dispatcher).s = 1, fnMap.v = result;
          } catch (error2) {
            throw (result = dispatcher).s = 2, result.v = error2, error2;
          }
        };
      };
    }, 446: (module2, __unused_webpack_exports, __webpack_require__) => {
      (() => {
        "use strict";
        let O, P, N, S, C;
        var t, n, a, o, i, c, s, u, l, g, p, d, _, f, b, v, e = { 491: (e2, t2, r2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ContextAPI = void 0;
          let n2 = r2(223), a2 = r2(172), o2 = r2(930), i2 = "context", c2 = new n2.NoopContextManager();
          class ContextAPI {
            static getInstance() {
              return this._instance || (this._instance = new ContextAPI()), this._instance;
            }
            setGlobalContextManager(e3) {
              return (0, a2.registerGlobal)(i2, e3, o2.DiagAPI.instance());
            }
            active() {
              return this._getContextManager().active();
            }
            with(e3, t3, r3, ...n3) {
              return this._getContextManager().with(e3, t3, r3, ...n3);
            }
            bind(e3, t3) {
              return this._getContextManager().bind(e3, t3);
            }
            _getContextManager() {
              return (0, a2.getGlobal)(i2) || c2;
            }
            disable() {
              this._getContextManager().disable(), (0, a2.unregisterGlobal)(i2, o2.DiagAPI.instance());
            }
          }
          t2.ContextAPI = ContextAPI;
        }, 930: (e2, t2, r2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagAPI = void 0;
          let n2 = r2(56), a2 = r2(912), o2 = r2(957), i2 = r2(172);
          class DiagAPI {
            constructor() {
              function _logProxy(e4) {
                return function(...t3) {
                  let r3 = (0, i2.getGlobal)("diag");
                  if (r3) return r3[e4](...t3);
                };
              }
              const e3 = this;
              e3.setLogger = (t3, r3 = { logLevel: o2.DiagLogLevel.INFO }) => {
                var n3, c2, s2;
                if (t3 === e3) {
                  let t4 = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
                  return e3.error(null != (n3 = t4.stack) ? n3 : t4.message), false;
                }
                "number" == typeof r3 && (r3 = { logLevel: r3 });
                let u2 = (0, i2.getGlobal)("diag"), l2 = (0, a2.createLogLevelDiagLogger)(null != (c2 = r3.logLevel) ? c2 : o2.DiagLogLevel.INFO, t3);
                if (u2 && !r3.suppressOverrideMessage) {
                  let e4 = null != (s2 = Error().stack) ? s2 : "<failed to generate stacktrace>";
                  u2.warn(`Current logger will be overwritten from ${e4}`), l2.warn(`Current logger will overwrite one already registered from ${e4}`);
                }
                return (0, i2.registerGlobal)("diag", l2, e3, true);
              }, e3.disable = () => {
                (0, i2.unregisterGlobal)("diag", e3);
              }, e3.createComponentLogger = (e4) => new n2.DiagComponentLogger(e4), e3.verbose = _logProxy("verbose"), e3.debug = _logProxy("debug"), e3.info = _logProxy("info"), e3.warn = _logProxy("warn"), e3.error = _logProxy("error");
            }
            static instance() {
              return this._instance || (this._instance = new DiagAPI()), this._instance;
            }
          }
          t2.DiagAPI = DiagAPI;
        }, 653: (e2, t2, r2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.MetricsAPI = void 0;
          let n2 = r2(660), a2 = r2(172), o2 = r2(930), i2 = "metrics";
          class MetricsAPI {
            static getInstance() {
              return this._instance || (this._instance = new MetricsAPI()), this._instance;
            }
            setGlobalMeterProvider(e3) {
              return (0, a2.registerGlobal)(i2, e3, o2.DiagAPI.instance());
            }
            getMeterProvider() {
              return (0, a2.getGlobal)(i2) || n2.NOOP_METER_PROVIDER;
            }
            getMeter(e3, t3, r3) {
              return this.getMeterProvider().getMeter(e3, t3, r3);
            }
            disable() {
              (0, a2.unregisterGlobal)(i2, o2.DiagAPI.instance());
            }
          }
          t2.MetricsAPI = MetricsAPI;
        }, 181: (e2, t2, r2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.PropagationAPI = void 0;
          let n2 = r2(172), a2 = r2(874), o2 = r2(194), i2 = r2(277), c2 = r2(369), s2 = r2(930), u2 = "propagation", l2 = new a2.NoopTextMapPropagator();
          class PropagationAPI {
            constructor() {
              this.createBaggage = c2.createBaggage, this.getBaggage = i2.getBaggage, this.getActiveBaggage = i2.getActiveBaggage, this.setBaggage = i2.setBaggage, this.deleteBaggage = i2.deleteBaggage;
            }
            static getInstance() {
              return this._instance || (this._instance = new PropagationAPI()), this._instance;
            }
            setGlobalPropagator(e3) {
              return (0, n2.registerGlobal)(u2, e3, s2.DiagAPI.instance());
            }
            inject(e3, t3, r3 = o2.defaultTextMapSetter) {
              return this._getGlobalPropagator().inject(e3, t3, r3);
            }
            extract(e3, t3, r3 = o2.defaultTextMapGetter) {
              return this._getGlobalPropagator().extract(e3, t3, r3);
            }
            fields() {
              return this._getGlobalPropagator().fields();
            }
            disable() {
              (0, n2.unregisterGlobal)(u2, s2.DiagAPI.instance());
            }
            _getGlobalPropagator() {
              return (0, n2.getGlobal)(u2) || l2;
            }
          }
          t2.PropagationAPI = PropagationAPI;
        }, 997: (e2, t2, r2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.TraceAPI = void 0;
          let n2 = r2(172), a2 = r2(846), o2 = r2(139), i2 = r2(607), c2 = r2(930), s2 = "trace";
          class TraceAPI {
            constructor() {
              this._proxyTracerProvider = new a2.ProxyTracerProvider(), this.wrapSpanContext = o2.wrapSpanContext, this.isSpanContextValid = o2.isSpanContextValid, this.deleteSpan = i2.deleteSpan, this.getSpan = i2.getSpan, this.getActiveSpan = i2.getActiveSpan, this.getSpanContext = i2.getSpanContext, this.setSpan = i2.setSpan, this.setSpanContext = i2.setSpanContext;
            }
            static getInstance() {
              return this._instance || (this._instance = new TraceAPI()), this._instance;
            }
            setGlobalTracerProvider(e3) {
              let t3 = (0, n2.registerGlobal)(s2, this._proxyTracerProvider, c2.DiagAPI.instance());
              return t3 && this._proxyTracerProvider.setDelegate(e3), t3;
            }
            getTracerProvider() {
              return (0, n2.getGlobal)(s2) || this._proxyTracerProvider;
            }
            getTracer(e3, t3) {
              return this.getTracerProvider().getTracer(e3, t3);
            }
            disable() {
              (0, n2.unregisterGlobal)(s2, c2.DiagAPI.instance()), this._proxyTracerProvider = new a2.ProxyTracerProvider();
            }
          }
          t2.TraceAPI = TraceAPI;
        }, 277: (e2, t2, r2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.deleteBaggage = t2.setBaggage = t2.getActiveBaggage = t2.getBaggage = void 0;
          let n2 = r2(491), o2 = (0, r2(780).createContextKey)("OpenTelemetry Baggage Key");
          function getBaggage(e3) {
            return e3.getValue(o2) || void 0;
          }
          t2.getBaggage = getBaggage, t2.getActiveBaggage = function getActiveBaggage() {
            return getBaggage(n2.ContextAPI.getInstance().active());
          }, t2.setBaggage = function setBaggage(e3, t3) {
            return e3.setValue(o2, t3);
          }, t2.deleteBaggage = function deleteBaggage(e3) {
            return e3.deleteValue(o2);
          };
        }, 993: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.BaggageImpl = void 0;
          class BaggageImpl {
            constructor(e3) {
              this._entries = e3 ? new Map(e3) : /* @__PURE__ */ new Map();
            }
            getEntry(e3) {
              let t3 = this._entries.get(e3);
              if (t3) return Object.assign({}, t3);
            }
            getAllEntries() {
              return Array.from(this._entries.entries()).map(([e3, t3]) => [e3, t3]);
            }
            setEntry(e3, t3) {
              let r2 = new BaggageImpl(this._entries);
              return r2._entries.set(e3, t3), r2;
            }
            removeEntry(e3) {
              let t3 = new BaggageImpl(this._entries);
              return t3._entries.delete(e3), t3;
            }
            removeEntries(...e3) {
              let t3 = new BaggageImpl(this._entries);
              for (let r2 of e3) t3._entries.delete(r2);
              return t3;
            }
            clear() {
              return new BaggageImpl();
            }
          }
          t2.BaggageImpl = BaggageImpl;
        }, 830: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.baggageEntryMetadataSymbol = void 0, t2.baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata");
        }, 369: (e2, t2, r2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.baggageEntryMetadataFromString = t2.createBaggage = void 0;
          let n2 = r2(930), a2 = r2(993), o2 = r2(830), i2 = n2.DiagAPI.instance();
          t2.createBaggage = function createBaggage(e3 = {}) {
            return new a2.BaggageImpl(new Map(Object.entries(e3)));
          }, t2.baggageEntryMetadataFromString = function baggageEntryMetadataFromString(e3) {
            return "string" != typeof e3 && (i2.error(`Cannot create baggage metadata from unknown type: ${typeof e3}`), e3 = ""), { __TYPE__: o2.baggageEntryMetadataSymbol, toString: () => e3 };
          };
        }, 67: (e2, t2, r2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.context = void 0, t2.context = r2(491).ContextAPI.getInstance();
        }, 223: (e2, t2, r2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopContextManager = void 0;
          let n2 = r2(780);
          class NoopContextManager {
            active() {
              return n2.ROOT_CONTEXT;
            }
            with(e3, t3, r3, ...n3) {
              return t3.call(r3, ...n3);
            }
            bind(e3, t3) {
              return t3;
            }
            enable() {
              return this;
            }
            disable() {
              return this;
            }
          }
          t2.NoopContextManager = NoopContextManager;
        }, 780: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ROOT_CONTEXT = t2.createContextKey = void 0, t2.createContextKey = function createContextKey(e3) {
            return Symbol.for(e3);
          };
          class BaseContext {
            constructor(e3) {
              const t3 = this;
              t3._currentContext = e3 ? new Map(e3) : /* @__PURE__ */ new Map(), t3.getValue = (e4) => t3._currentContext.get(e4), t3.setValue = (e4, r2) => {
                let n2 = new BaseContext(t3._currentContext);
                return n2._currentContext.set(e4, r2), n2;
              }, t3.deleteValue = (e4) => {
                let r2 = new BaseContext(t3._currentContext);
                return r2._currentContext.delete(e4), r2;
              };
            }
          }
          t2.ROOT_CONTEXT = new BaseContext();
        }, 506: (e2, t2, r2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.diag = void 0, t2.diag = r2(930).DiagAPI.instance();
        }, 56: (e2, t2, r2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagComponentLogger = void 0;
          let n2 = r2(172);
          class DiagComponentLogger {
            constructor(e3) {
              this._namespace = e3.namespace || "DiagComponentLogger";
            }
            debug(...e3) {
              return logProxy("debug", this._namespace, e3);
            }
            error(...e3) {
              return logProxy("error", this._namespace, e3);
            }
            info(...e3) {
              return logProxy("info", this._namespace, e3);
            }
            warn(...e3) {
              return logProxy("warn", this._namespace, e3);
            }
            verbose(...e3) {
              return logProxy("verbose", this._namespace, e3);
            }
          }
          function logProxy(e3, t3, r3) {
            let a2 = (0, n2.getGlobal)("diag");
            if (a2) return r3.unshift(t3), a2[e3](...r3);
          }
          t2.DiagComponentLogger = DiagComponentLogger;
        }, 972: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagConsoleLogger = void 0;
          let r2 = [{ n: "error", c: "error" }, { n: "warn", c: "warn" }, { n: "info", c: "info" }, { n: "debug", c: "debug" }, { n: "verbose", c: "trace" }];
          class DiagConsoleLogger {
            constructor() {
              function _consoleFunc(e3) {
                return function(...t3) {
                  if (console) {
                    let r3 = console[e3];
                    if ("function" != typeof r3 && (r3 = console.log), "function" == typeof r3) return r3.apply(console, t3);
                  }
                };
              }
              for (let e3 = 0; e3 < r2.length; e3++) this[r2[e3].n] = _consoleFunc(r2[e3].c);
            }
          }
          t2.DiagConsoleLogger = DiagConsoleLogger;
        }, 912: (e2, t2, r2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.createLogLevelDiagLogger = void 0;
          let n2 = r2(957);
          t2.createLogLevelDiagLogger = function createLogLevelDiagLogger(e3, t3) {
            function _filterFunc(r3, n3) {
              let a2 = t3[r3];
              return "function" == typeof a2 && e3 >= n3 ? a2.bind(t3) : function() {
              };
            }
            return e3 < n2.DiagLogLevel.NONE ? e3 = n2.DiagLogLevel.NONE : e3 > n2.DiagLogLevel.ALL && (e3 = n2.DiagLogLevel.ALL), t3 = t3 || {}, { error: _filterFunc("error", n2.DiagLogLevel.ERROR), warn: _filterFunc("warn", n2.DiagLogLevel.WARN), info: _filterFunc("info", n2.DiagLogLevel.INFO), debug: _filterFunc("debug", n2.DiagLogLevel.DEBUG), verbose: _filterFunc("verbose", n2.DiagLogLevel.VERBOSE) };
          };
        }, 957: (e2, t2) => {
          var e1;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagLogLevel = void 0, (e1 = t2.DiagLogLevel || (t2.DiagLogLevel = {}))[e1.NONE = 0] = "NONE", e1[e1.ERROR = 30] = "ERROR", e1[e1.WARN = 50] = "WARN", e1[e1.INFO = 60] = "INFO", e1[e1.DEBUG = 70] = "DEBUG", e1[e1.VERBOSE = 80] = "VERBOSE", e1[e1.ALL = 9999] = "ALL";
        }, 172: (e2, t2, r2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.unregisterGlobal = t2.getGlobal = t2.registerGlobal = void 0;
          let n2 = r2(200), a2 = r2(521), o2 = r2(130), i2 = a2.VERSION.split(".")[0], c2 = Symbol.for(`opentelemetry.js.api.${i2}`), s2 = n2._globalThis;
          t2.registerGlobal = function registerGlobal(e3, t3, r3, n3 = false) {
            var o3;
            let i3 = s2[c2] = null != (o3 = s2[c2]) ? o3 : { version: a2.VERSION };
            if (!n3 && i3[e3]) {
              let t4 = Error(`@opentelemetry/api: Attempted duplicate registration of API: ${e3}`);
              return r3.error(t4.stack || t4.message), false;
            }
            if (i3.version !== a2.VERSION) {
              let t4 = Error(`@opentelemetry/api: Registration of version v${i3.version} for ${e3} does not match previously registered API v${a2.VERSION}`);
              return r3.error(t4.stack || t4.message), false;
            }
            return i3[e3] = t3, r3.debug(`@opentelemetry/api: Registered a global for ${e3} v${a2.VERSION}.`), true;
          }, t2.getGlobal = function getGlobal(e3) {
            var t3, r3;
            let n3 = null == (t3 = s2[c2]) ? void 0 : t3.version;
            if (n3 && (0, o2.isCompatible)(n3)) return null == (r3 = s2[c2]) ? void 0 : r3[e3];
          }, t2.unregisterGlobal = function unregisterGlobal(e3, t3) {
            t3.debug(`@opentelemetry/api: Unregistering a global for ${e3} v${a2.VERSION}.`);
            let r3 = s2[c2];
            r3 && delete r3[e3];
          };
        }, 130: (e2, t2, r2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.isCompatible = t2._makeCompatibilityCheck = void 0;
          let n2 = r2(521), a2 = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
          function _makeCompatibilityCheck(e3) {
            let t3 = /* @__PURE__ */ new Set([e3]), r3 = /* @__PURE__ */ new Set(), n3 = e3.match(a2);
            if (!n3) return () => false;
            let o2 = { major: +n3[1], minor: +n3[2], patch: +n3[3], prerelease: n3[4] };
            if (null != o2.prerelease) return function isExactmatch(t4) {
              return t4 === e3;
            };
            function _reject(e4) {
              return r3.add(e4), false;
            }
            return function isCompatible(e4) {
              if (t3.has(e4)) return true;
              if (r3.has(e4)) return false;
              let n4 = e4.match(a2);
              if (!n4) return _reject(e4);
              let i2 = { major: +n4[1], minor: +n4[2], patch: +n4[3], prerelease: n4[4] };
              if (null != i2.prerelease || o2.major !== i2.major) return _reject(e4);
              if (0 === o2.major) return o2.minor === i2.minor && o2.patch <= i2.patch ? (t3.add(e4), true) : _reject(e4);
              return o2.minor <= i2.minor ? (t3.add(e4), true) : _reject(e4);
            };
          }
          t2._makeCompatibilityCheck = _makeCompatibilityCheck, t2.isCompatible = _makeCompatibilityCheck(n2.VERSION);
        }, 886: (e2, t2, r2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.metrics = void 0, t2.metrics = r2(653).MetricsAPI.getInstance();
        }, 901: (e2, t2) => {
          var e1;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ValueType = void 0, (e1 = t2.ValueType || (t2.ValueType = {}))[e1.INT = 0] = "INT", e1[e1.DOUBLE = 1] = "DOUBLE";
        }, 102: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.createNoopMeter = t2.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = t2.NOOP_OBSERVABLE_GAUGE_METRIC = t2.NOOP_OBSERVABLE_COUNTER_METRIC = t2.NOOP_UP_DOWN_COUNTER_METRIC = t2.NOOP_HISTOGRAM_METRIC = t2.NOOP_COUNTER_METRIC = t2.NOOP_METER = t2.NoopObservableUpDownCounterMetric = t2.NoopObservableGaugeMetric = t2.NoopObservableCounterMetric = t2.NoopObservableMetric = t2.NoopHistogramMetric = t2.NoopUpDownCounterMetric = t2.NoopCounterMetric = t2.NoopMetric = t2.NoopMeter = void 0;
          class NoopMeter {
            createHistogram(e3, r2) {
              return t2.NOOP_HISTOGRAM_METRIC;
            }
            createCounter(e3, r2) {
              return t2.NOOP_COUNTER_METRIC;
            }
            createUpDownCounter(e3, r2) {
              return t2.NOOP_UP_DOWN_COUNTER_METRIC;
            }
            createObservableGauge(e3, r2) {
              return t2.NOOP_OBSERVABLE_GAUGE_METRIC;
            }
            createObservableCounter(e3, r2) {
              return t2.NOOP_OBSERVABLE_COUNTER_METRIC;
            }
            createObservableUpDownCounter(e3, r2) {
              return t2.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
            }
            addBatchObservableCallback(e3, t3) {
            }
            removeBatchObservableCallback(e3) {
            }
          }
          t2.NoopMeter = NoopMeter;
          class NoopMetric {
          }
          t2.NoopMetric = NoopMetric;
          class NoopCounterMetric extends NoopMetric {
            add(e3, t3) {
            }
          }
          t2.NoopCounterMetric = NoopCounterMetric;
          class NoopUpDownCounterMetric extends NoopMetric {
            add(e3, t3) {
            }
          }
          t2.NoopUpDownCounterMetric = NoopUpDownCounterMetric;
          class NoopHistogramMetric extends NoopMetric {
            record(e3, t3) {
            }
          }
          t2.NoopHistogramMetric = NoopHistogramMetric;
          class NoopObservableMetric {
            addCallback(e3) {
            }
            removeCallback(e3) {
            }
          }
          t2.NoopObservableMetric = NoopObservableMetric;
          class NoopObservableCounterMetric extends NoopObservableMetric {
          }
          t2.NoopObservableCounterMetric = NoopObservableCounterMetric;
          class NoopObservableGaugeMetric extends NoopObservableMetric {
          }
          t2.NoopObservableGaugeMetric = NoopObservableGaugeMetric;
          class NoopObservableUpDownCounterMetric extends NoopObservableMetric {
          }
          function createNoopMeter() {
            return t2.NOOP_METER;
          }
          t2.NoopObservableUpDownCounterMetric = NoopObservableUpDownCounterMetric, t2.NOOP_METER = new NoopMeter(), t2.NOOP_COUNTER_METRIC = new NoopCounterMetric(), t2.NOOP_HISTOGRAM_METRIC = new NoopHistogramMetric(), t2.NOOP_UP_DOWN_COUNTER_METRIC = new NoopUpDownCounterMetric(), t2.NOOP_OBSERVABLE_COUNTER_METRIC = new NoopObservableCounterMetric(), t2.NOOP_OBSERVABLE_GAUGE_METRIC = new NoopObservableGaugeMetric(), t2.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new NoopObservableUpDownCounterMetric(), t2.createNoopMeter = createNoopMeter;
        }, 660: (e2, t2, r2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NOOP_METER_PROVIDER = t2.NoopMeterProvider = void 0;
          let n2 = r2(102);
          class NoopMeterProvider {
            getMeter(e3, t3, r3) {
              return n2.NOOP_METER;
            }
          }
          t2.NoopMeterProvider = NoopMeterProvider, t2.NOOP_METER_PROVIDER = new NoopMeterProvider();
        }, 200: function(e2, t2, r2) {
          var n2 = this && this.__createBinding || (Object.create ? function(e3, t3, r3, n3) {
            void 0 === n3 && (n3 = r3), Object.defineProperty(e3, n3, { enumerable: true, get: function() {
              return t3[r3];
            } });
          } : function(e3, t3, r3, n3) {
            void 0 === n3 && (n3 = r3), e3[n3] = t3[r3];
          }), a2 = this && this.__exportStar || function(e3, t3) {
            for (var r3 in e3) "default" === r3 || Object.prototype.hasOwnProperty.call(t3, r3) || n2(t3, e3, r3);
          };
          Object.defineProperty(t2, "__esModule", { value: true }), a2(r2(46), t2);
        }, 651: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2._globalThis = void 0, t2._globalThis = "object" == typeof globalThis ? globalThis : __webpack_require__.g;
        }, 46: function(e2, t2, r2) {
          var n2 = this && this.__createBinding || (Object.create ? function(e3, t3, r3, n3) {
            void 0 === n3 && (n3 = r3), Object.defineProperty(e3, n3, { enumerable: true, get: function() {
              return t3[r3];
            } });
          } : function(e3, t3, r3, n3) {
            void 0 === n3 && (n3 = r3), e3[n3] = t3[r3];
          }), a2 = this && this.__exportStar || function(e3, t3) {
            for (var r3 in e3) "default" === r3 || Object.prototype.hasOwnProperty.call(t3, r3) || n2(t3, e3, r3);
          };
          Object.defineProperty(t2, "__esModule", { value: true }), a2(r2(651), t2);
        }, 939: (e2, t2, r2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.propagation = void 0, t2.propagation = r2(181).PropagationAPI.getInstance();
        }, 874: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopTextMapPropagator = void 0;
          class NoopTextMapPropagator {
            inject(e3, t3) {
            }
            extract(e3, t3) {
              return e3;
            }
            fields() {
              return [];
            }
          }
          t2.NoopTextMapPropagator = NoopTextMapPropagator;
        }, 194: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.defaultTextMapSetter = t2.defaultTextMapGetter = void 0, t2.defaultTextMapGetter = { get(e3, t3) {
            if (null != e3) return e3[t3];
          }, keys: (e3) => null == e3 ? [] : Object.keys(e3) }, t2.defaultTextMapSetter = { set(e3, t3, r2) {
            null != e3 && (e3[t3] = r2);
          } };
        }, 845: (e2, t2, r2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.trace = void 0, t2.trace = r2(997).TraceAPI.getInstance();
        }, 403: (e2, t2, r2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NonRecordingSpan = void 0;
          let n2 = r2(476);
          class NonRecordingSpan {
            constructor(e3 = n2.INVALID_SPAN_CONTEXT) {
              this._spanContext = e3;
            }
            spanContext() {
              return this._spanContext;
            }
            setAttribute(e3, t3) {
              return this;
            }
            setAttributes(e3) {
              return this;
            }
            addEvent(e3, t3) {
              return this;
            }
            setStatus(e3) {
              return this;
            }
            updateName(e3) {
              return this;
            }
            end(e3) {
            }
            isRecording() {
              return false;
            }
            recordException(e3, t3) {
            }
          }
          t2.NonRecordingSpan = NonRecordingSpan;
        }, 614: (e2, t2, r2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopTracer = void 0;
          let n2 = r2(491), a2 = r2(607), o2 = r2(403), i2 = r2(139), c2 = n2.ContextAPI.getInstance();
          class NoopTracer {
            startSpan(e3, t3, r3 = c2.active()) {
              if (null == t3 ? void 0 : t3.root) return new o2.NonRecordingSpan();
              let s2 = r3 && (0, a2.getSpanContext)(r3);
              return isSpanContext(s2) && (0, i2.isSpanContextValid)(s2) ? new o2.NonRecordingSpan(s2) : new o2.NonRecordingSpan();
            }
            startActiveSpan(e3, t3, r3, n3) {
              let o3, i3, s2;
              if (arguments.length < 2) return;
              2 == arguments.length ? s2 = t3 : 3 == arguments.length ? (o3 = t3, s2 = r3) : (o3 = t3, i3 = r3, s2 = n3);
              let u2 = null != i3 ? i3 : c2.active(), l2 = this.startSpan(e3, o3, u2), g2 = (0, a2.setSpan)(u2, l2);
              return c2.with(g2, s2, void 0, l2);
            }
          }
          function isSpanContext(e3) {
            return "object" == typeof e3 && "string" == typeof e3.spanId && "string" == typeof e3.traceId && "number" == typeof e3.traceFlags;
          }
          t2.NoopTracer = NoopTracer;
        }, 124: (e2, t2, r2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopTracerProvider = void 0;
          let n2 = r2(614);
          class NoopTracerProvider {
            getTracer(e3, t3, r3) {
              return new n2.NoopTracer();
            }
          }
          t2.NoopTracerProvider = NoopTracerProvider;
        }, 125: (e2, t2, r2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ProxyTracer = void 0;
          let a2 = new (r2(614)).NoopTracer();
          class ProxyTracer {
            constructor(e3, t3, r3, n2) {
              this._provider = e3, this.name = t3, this.version = r3, this.options = n2;
            }
            startSpan(e3, t3, r3) {
              return this._getTracer().startSpan(e3, t3, r3);
            }
            startActiveSpan(e3, t3, r3, n2) {
              let a3 = this._getTracer();
              return Reflect.apply(a3.startActiveSpan, a3, arguments);
            }
            _getTracer() {
              if (this._delegate) return this._delegate;
              let e3 = this._provider.getDelegateTracer(this.name, this.version, this.options);
              return e3 ? (this._delegate = e3, this._delegate) : a2;
            }
          }
          t2.ProxyTracer = ProxyTracer;
        }, 846: (e2, t2, r2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ProxyTracerProvider = void 0;
          let n2 = r2(125), o2 = new (r2(124)).NoopTracerProvider();
          class ProxyTracerProvider {
            getTracer(e3, t3, r3) {
              var a2;
              return null != (a2 = this.getDelegateTracer(e3, t3, r3)) ? a2 : new n2.ProxyTracer(this, e3, t3, r3);
            }
            getDelegate() {
              var e3;
              return null != (e3 = this._delegate) ? e3 : o2;
            }
            setDelegate(e3) {
              this._delegate = e3;
            }
            getDelegateTracer(e3, t3, r3) {
              var n3;
              return null == (n3 = this._delegate) ? void 0 : n3.getTracer(e3, t3, r3);
            }
          }
          t2.ProxyTracerProvider = ProxyTracerProvider;
        }, 996: (e2, t2) => {
          var e1;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.SamplingDecision = void 0, (e1 = t2.SamplingDecision || (t2.SamplingDecision = {}))[e1.NOT_RECORD = 0] = "NOT_RECORD", e1[e1.RECORD = 1] = "RECORD", e1[e1.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED";
        }, 607: (e2, t2, r2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.getSpanContext = t2.setSpanContext = t2.deleteSpan = t2.setSpan = t2.getActiveSpan = t2.getSpan = void 0;
          let n2 = r2(780), a2 = r2(403), o2 = r2(491), i2 = (0, n2.createContextKey)("OpenTelemetry Context Key SPAN");
          function getSpan(e3) {
            return e3.getValue(i2) || void 0;
          }
          function setSpan(e3, t3) {
            return e3.setValue(i2, t3);
          }
          t2.getSpan = getSpan, t2.getActiveSpan = function getActiveSpan() {
            return getSpan(o2.ContextAPI.getInstance().active());
          }, t2.setSpan = setSpan, t2.deleteSpan = function deleteSpan(e3) {
            return e3.deleteValue(i2);
          }, t2.setSpanContext = function setSpanContext(e3, t3) {
            return setSpan(e3, new a2.NonRecordingSpan(t3));
          }, t2.getSpanContext = function getSpanContext(e3) {
            var t3;
            return null == (t3 = getSpan(e3)) ? void 0 : t3.spanContext();
          };
        }, 325: (e2, t2, r2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.TraceStateImpl = void 0;
          let n2 = r2(564);
          class TraceStateImpl {
            constructor(e3) {
              this._internalState = /* @__PURE__ */ new Map(), e3 && this._parse(e3);
            }
            set(e3, t3) {
              let r3 = this._clone();
              return r3._internalState.has(e3) && r3._internalState.delete(e3), r3._internalState.set(e3, t3), r3;
            }
            unset(e3) {
              let t3 = this._clone();
              return t3._internalState.delete(e3), t3;
            }
            get(e3) {
              return this._internalState.get(e3);
            }
            serialize() {
              return this._keys().reduce((e3, t3) => (e3.push(t3 + "=" + this.get(t3)), e3), []).join(",");
            }
            _parse(e3) {
              !(e3.length > 512) && (this._internalState = e3.split(",").reverse().reduce((e4, t3) => {
                let r3 = t3.trim(), a2 = r3.indexOf("=");
                if (-1 !== a2) {
                  let o2 = r3.slice(0, a2), i2 = r3.slice(a2 + 1, t3.length);
                  (0, n2.validateKey)(o2) && (0, n2.validateValue)(i2) && e4.set(o2, i2);
                }
                return e4;
              }, /* @__PURE__ */ new Map()), this._internalState.size > 32 && (this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, 32))));
            }
            _keys() {
              return Array.from(this._internalState.keys()).reverse();
            }
            _clone() {
              let e3 = new TraceStateImpl();
              return e3._internalState = new Map(this._internalState), e3;
            }
          }
          t2.TraceStateImpl = TraceStateImpl;
        }, 564: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.validateValue = t2.validateKey = void 0;
          let r2 = "[_0-9a-z-*/]", n2 = `[a-z]${r2}{0,255}`, a2 = `[a-z0-9]${r2}{0,240}@[a-z]${r2}{0,13}`, o2 = RegExp(`^(?:${n2}|${a2})$`), i2 = /^[ -~]{0,255}[!-~]$/, c2 = /,|=/;
          t2.validateKey = function validateKey(e3) {
            return o2.test(e3);
          }, t2.validateValue = function validateValue(e3) {
            return i2.test(e3) && !c2.test(e3);
          };
        }, 98: (e2, t2, r2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.createTraceState = void 0;
          let n2 = r2(325);
          t2.createTraceState = function createTraceState(e3) {
            return new n2.TraceStateImpl(e3);
          };
        }, 476: (e2, t2, r2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.INVALID_SPAN_CONTEXT = t2.INVALID_TRACEID = t2.INVALID_SPANID = void 0;
          let n2 = r2(475);
          t2.INVALID_SPANID = "0000000000000000", t2.INVALID_TRACEID = "00000000000000000000000000000000", t2.INVALID_SPAN_CONTEXT = { traceId: t2.INVALID_TRACEID, spanId: t2.INVALID_SPANID, traceFlags: n2.TraceFlags.NONE };
        }, 357: (e2, t2) => {
          var e1;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.SpanKind = void 0, (e1 = t2.SpanKind || (t2.SpanKind = {}))[e1.INTERNAL = 0] = "INTERNAL", e1[e1.SERVER = 1] = "SERVER", e1[e1.CLIENT = 2] = "CLIENT", e1[e1.PRODUCER = 3] = "PRODUCER", e1[e1.CONSUMER = 4] = "CONSUMER";
        }, 139: (e2, t2, r2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.wrapSpanContext = t2.isSpanContextValid = t2.isValidSpanId = t2.isValidTraceId = void 0;
          let n2 = r2(476), a2 = r2(403), o2 = /^([0-9a-f]{32})$/i, i2 = /^[0-9a-f]{16}$/i;
          function isValidTraceId(e3) {
            return o2.test(e3) && e3 !== n2.INVALID_TRACEID;
          }
          function isValidSpanId(e3) {
            return i2.test(e3) && e3 !== n2.INVALID_SPANID;
          }
          t2.isValidTraceId = isValidTraceId, t2.isValidSpanId = isValidSpanId, t2.isSpanContextValid = function isSpanContextValid(e3) {
            return isValidTraceId(e3.traceId) && isValidSpanId(e3.spanId);
          }, t2.wrapSpanContext = function wrapSpanContext(e3) {
            return new a2.NonRecordingSpan(e3);
          };
        }, 847: (e2, t2) => {
          var e1;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.SpanStatusCode = void 0, (e1 = t2.SpanStatusCode || (t2.SpanStatusCode = {}))[e1.UNSET = 0] = "UNSET", e1[e1.OK = 1] = "OK", e1[e1.ERROR = 2] = "ERROR";
        }, 475: (e2, t2) => {
          var e1;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.TraceFlags = void 0, (e1 = t2.TraceFlags || (t2.TraceFlags = {}))[e1.NONE = 0] = "NONE", e1[e1.SAMPLED = 1] = "SAMPLED";
        }, 521: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.VERSION = void 0, t2.VERSION = "1.6.0";
        } }, t1 = {};
        function __nccwpck_require__1(r2) {
          var n2 = t1[r2];
          if (void 0 !== n2) return n2.exports;
          var a2 = t1[r2] = { exports: {} }, o2 = true;
          try {
            e[r2].call(a2.exports, a2, a2.exports, __nccwpck_require__1), o2 = false;
          } finally {
            o2 && delete t1[r2];
          }
          return a2.exports;
        }
        __nccwpck_require__1.ab = "//";
        var r = {};
        Object.defineProperty(r, "__esModule", { value: true }), r.trace = r.propagation = r.metrics = r.diag = r.context = r.INVALID_SPAN_CONTEXT = r.INVALID_TRACEID = r.INVALID_SPANID = r.isValidSpanId = r.isValidTraceId = r.isSpanContextValid = r.createTraceState = r.TraceFlags = r.SpanStatusCode = r.SpanKind = r.SamplingDecision = r.ProxyTracerProvider = r.ProxyTracer = r.defaultTextMapSetter = r.defaultTextMapGetter = r.ValueType = r.createNoopMeter = r.DiagLogLevel = r.DiagConsoleLogger = r.ROOT_CONTEXT = r.createContextKey = r.baggageEntryMetadataFromString = void 0, t = __nccwpck_require__1(369), Object.defineProperty(r, "baggageEntryMetadataFromString", { enumerable: true, get: function() {
          return t.baggageEntryMetadataFromString;
        } }), n = __nccwpck_require__1(780), Object.defineProperty(r, "createContextKey", { enumerable: true, get: function() {
          return n.createContextKey;
        } }), Object.defineProperty(r, "ROOT_CONTEXT", { enumerable: true, get: function() {
          return n.ROOT_CONTEXT;
        } }), a = __nccwpck_require__1(972), Object.defineProperty(r, "DiagConsoleLogger", { enumerable: true, get: function() {
          return a.DiagConsoleLogger;
        } }), o = __nccwpck_require__1(957), Object.defineProperty(r, "DiagLogLevel", { enumerable: true, get: function() {
          return o.DiagLogLevel;
        } }), i = __nccwpck_require__1(102), Object.defineProperty(r, "createNoopMeter", { enumerable: true, get: function() {
          return i.createNoopMeter;
        } }), c = __nccwpck_require__1(901), Object.defineProperty(r, "ValueType", { enumerable: true, get: function() {
          return c.ValueType;
        } }), s = __nccwpck_require__1(194), Object.defineProperty(r, "defaultTextMapGetter", { enumerable: true, get: function() {
          return s.defaultTextMapGetter;
        } }), Object.defineProperty(r, "defaultTextMapSetter", { enumerable: true, get: function() {
          return s.defaultTextMapSetter;
        } }), u = __nccwpck_require__1(125), Object.defineProperty(r, "ProxyTracer", { enumerable: true, get: function() {
          return u.ProxyTracer;
        } }), l = __nccwpck_require__1(846), Object.defineProperty(r, "ProxyTracerProvider", { enumerable: true, get: function() {
          return l.ProxyTracerProvider;
        } }), g = __nccwpck_require__1(996), Object.defineProperty(r, "SamplingDecision", { enumerable: true, get: function() {
          return g.SamplingDecision;
        } }), p = __nccwpck_require__1(357), Object.defineProperty(r, "SpanKind", { enumerable: true, get: function() {
          return p.SpanKind;
        } }), d = __nccwpck_require__1(847), Object.defineProperty(r, "SpanStatusCode", { enumerable: true, get: function() {
          return d.SpanStatusCode;
        } }), _ = __nccwpck_require__1(475), Object.defineProperty(r, "TraceFlags", { enumerable: true, get: function() {
          return _.TraceFlags;
        } }), f = __nccwpck_require__1(98), Object.defineProperty(r, "createTraceState", { enumerable: true, get: function() {
          return f.createTraceState;
        } }), b = __nccwpck_require__1(139), Object.defineProperty(r, "isSpanContextValid", { enumerable: true, get: function() {
          return b.isSpanContextValid;
        } }), Object.defineProperty(r, "isValidTraceId", { enumerable: true, get: function() {
          return b.isValidTraceId;
        } }), Object.defineProperty(r, "isValidSpanId", { enumerable: true, get: function() {
          return b.isValidSpanId;
        } }), v = __nccwpck_require__1(476), Object.defineProperty(r, "INVALID_SPANID", { enumerable: true, get: function() {
          return v.INVALID_SPANID;
        } }), Object.defineProperty(r, "INVALID_TRACEID", { enumerable: true, get: function() {
          return v.INVALID_TRACEID;
        } }), Object.defineProperty(r, "INVALID_SPAN_CONTEXT", { enumerable: true, get: function() {
          return v.INVALID_SPAN_CONTEXT;
        } }), O = __nccwpck_require__1(67), Object.defineProperty(r, "context", { enumerable: true, get: function() {
          return O.context;
        } }), P = __nccwpck_require__1(506), Object.defineProperty(r, "diag", { enumerable: true, get: function() {
          return P.diag;
        } }), N = __nccwpck_require__1(886), Object.defineProperty(r, "metrics", { enumerable: true, get: function() {
          return N.metrics;
        } }), S = __nccwpck_require__1(939), Object.defineProperty(r, "propagation", { enumerable: true, get: function() {
          return S.propagation;
        } }), C = __nccwpck_require__1(845), Object.defineProperty(r, "trace", { enumerable: true, get: function() {
          return C.trace;
        } }), r.default = { context: O.context, diag: P.diag, metrics: N.metrics, propagation: S.propagation, trace: C.trace }, module2.exports = r;
      })();
    }, 521: (module2) => {
      "use strict";
      module2.exports = (init_node_async_hooks(), __toCommonJS(node_async_hooks_exports));
    }, 643: (__unused_webpack_module, exports2, __webpack_require__) => {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true }), function _export(target, all) {
        for (var name in all) Object.defineProperty(target, name, { enumerable: true, get: all[name] });
      }(exports2, { getTestReqInfo: function() {
        return getTestReqInfo;
      }, withRequest: function() {
        return withRequest;
      } });
      let testStorage = new (__webpack_require__(521)).AsyncLocalStorage();
      function extractTestInfoFromRequest(req, reader) {
        let proxyPortHeader = reader.header(req, "next-test-proxy-port");
        if (!proxyPortHeader) return;
        let url = reader.url(req);
        return { url, proxyPort: Number(proxyPortHeader), testData: reader.header(req, "next-test-data") || "" };
      }
      function withRequest(req, reader, fn) {
        let testReqInfo = extractTestInfoFromRequest(req, reader);
        return testReqInfo ? testStorage.run(testReqInfo, fn) : fn();
      }
      function getTestReqInfo(req, reader) {
        let testReqInfo = testStorage.getStore();
        return testReqInfo || (req && reader ? extractTestInfoFromRequest(req, reader) : void 0);
      }
    }, 654: (module2, __unused_webpack_exports, __webpack_require__) => {
      "use strict";
      module2.exports = __webpack_require__(42);
    }, 852: (module2) => {
      (() => {
        "use strict";
        "u" > typeof __nccwpck_require__ && (__nccwpck_require__.ab = "//");
        var e = {};
        (() => {
          e.parse = parse3, e.serialize = serialize;
          var i = decodeURIComponent, t = encodeURIComponent, a = /; */, n = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
          function parse3(e2, r) {
            if ("string" != typeof e2) throw TypeError("argument str must be a string");
            for (var t2 = {}, o = e2.split(a), s = (r || {}).decode || i, p = 0; p < o.length; p++) {
              var f = o[p], u = f.indexOf("=");
              if (!(u < 0)) {
                var v = f.substr(0, u).trim(), c = f.substr(++u, f.length).trim();
                '"' == c[0] && (c = c.slice(1, -1)), void 0 == t2[v] && (t2[v] = tryDecode(c, s));
              }
            }
            return t2;
          }
          function serialize(e2, r, i2) {
            var a2 = i2 || {}, o = a2.encode || t;
            if ("function" != typeof o) throw TypeError("option encode is invalid");
            if (!n.test(e2)) throw TypeError("argument name is invalid");
            var s = o(r);
            if (s && !n.test(s)) throw TypeError("argument val is invalid");
            var p = e2 + "=" + s;
            if (null != a2.maxAge) {
              var f = a2.maxAge - 0;
              if (isNaN(f) || !isFinite(f)) throw TypeError("option maxAge is invalid");
              p += "; Max-Age=" + Math.floor(f);
            }
            if (a2.domain) {
              if (!n.test(a2.domain)) throw TypeError("option domain is invalid");
              p += "; Domain=" + a2.domain;
            }
            if (a2.path) {
              if (!n.test(a2.path)) throw TypeError("option path is invalid");
              p += "; Path=" + a2.path;
            }
            if (a2.expires) {
              if ("function" != typeof a2.expires.toUTCString) throw TypeError("option expires is invalid");
              p += "; Expires=" + a2.expires.toUTCString();
            }
            if (a2.httpOnly && (p += "; HttpOnly"), a2.secure && (p += "; Secure"), a2.sameSite) switch ("string" == typeof a2.sameSite ? a2.sameSite.toLowerCase() : a2.sameSite) {
              case true:
              case "strict":
                p += "; SameSite=Strict";
                break;
              case "lax":
                p += "; SameSite=Lax";
                break;
              case "none":
                p += "; SameSite=None";
                break;
              default:
                throw TypeError("option sameSite is invalid");
            }
            return p;
          }
          function tryDecode(e2, r) {
            try {
              return r(e2);
            } catch (r2) {
              return e2;
            }
          }
        })(), module2.exports = e;
      })();
    }, 889: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      "use strict";
      let api, memoryCache, tracer;
      __webpack_require__.r(__webpack_exports__), __webpack_require__.d(__webpack_exports__, { default: () => next_middleware_loaderabsolutePagePath_private_next_root_dir_2Fsrc_2Fmiddleware_ts_page_2Fsrc_2Fmiddleware_rootDir_D_3A_5CDEVELZY_5CMPHM_matchers_W3sicmVnZXhwIjoiXig_2FOlxcLyhfbmV4dFxcL2RhdGFcXC9bXi9dezEsfSkpPyg_2FOlxcLygoPyFhcGl8X25leHRcXC9zdGF0aWN8X25leHRcXC9pbWFnZXxmYXZpY29uLmljbykuKikpKFxcLmpzb258XFwucnNjfFxcLnNlZ21lbnRzXFwvLitcXC5zZWdtZW50XFwucnNjKT9bXFwvI1xcP10_2FJCIsIm9yaWdpbmFsU291cmNlIjoiLygoPyFhcGl8X25leHQvc3RhdGljfF9uZXh0L2ltYWdlfGZhdmljb24uaWNvKS4qKSJ9XQ_3D_3D_preferredRegion_middlewareConfig_eyJtYXRjaGVycyI6W3sicmVnZXhwIjoiXig_2FOlxcLyhfbmV4dFxcL2RhdGFcXC9bXi9dezEsfSkpPyg_2FOlxcLygoPyFhcGl8X25leHRcXC9zdGF0aWN8X25leHRcXC9pbWFnZXxmYXZpY29uLmljbykuKikpKFxcLmpzb258XFwucnNjfFxcLnNlZ21lbnRzXFwvLitcXC5zZWdtZW50XFwucnNjKT9bXFwvI1xcP10_2FJCIsIm9yaWdpbmFsU291cmNlIjoiLygoPyFhcGl8X25leHQvc3RhdGljfF9uZXh0L2ltYWdlfGZhdmljb24uaWNvKS4qKSJ9XX0_3D_, handler: () => handler3 });
      var reason, BaseServerSpan, LoadComponentsSpan, NextServerSpan, NextNodeServerSpan, StartServerSpan, RenderSpan, AppRenderSpan, RouterSpan, NodeSpan, AppRouteRouteHandlersSpan, ResolveMetadataSpan, MiddlewareSpan, CachedRouteKind, IncrementalCacheKind, _globalThis, middleware_namespaceObject = {};
      async function getEdgeInstrumentationModule() {
        return "_ENTRIES" in globalThis && _ENTRIES.middleware_instrumentation && await _ENTRIES.middleware_instrumentation;
      }
      __webpack_require__.r(middleware_namespaceObject), __webpack_require__.d(middleware_namespaceObject, { config: () => config, middleware: () => middleware });
      let instrumentationModulePromise = null;
      async function registerInstrumentation() {
        if ("phase-production-build" === process.env.NEXT_PHASE) return;
        instrumentationModulePromise || (instrumentationModulePromise = getEdgeInstrumentationModule());
        let instrumentation = await instrumentationModulePromise;
        if (null == instrumentation ? void 0 : instrumentation.register) try {
          await instrumentation.register();
        } catch (err) {
          throw err.message = `An error occurred while loading instrumentation hook: ${err.message}`, err;
        }
      }
      async function edgeInstrumentationOnRequestError(...args) {
        let instrumentation = await getEdgeInstrumentationModule();
        try {
          var _instrumentation_onRequestError;
          await (null == instrumentation || null == (_instrumentation_onRequestError = instrumentation.onRequestError) ? void 0 : _instrumentation_onRequestError.call(instrumentation, ...args));
        } catch (err) {
          console.error("Error in instrumentation.onRequestError:", err);
        }
      }
      let registerInstrumentationPromise = null;
      function ensureInstrumentationRegistered() {
        return registerInstrumentationPromise || (registerInstrumentationPromise = registerInstrumentation()), registerInstrumentationPromise;
      }
      function getUnsupportedModuleErrorMessage(module2) {
        return `The edge runtime does not support Node.js '${module2}' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime`;
      }
      function __import_unsupported(moduleName) {
        let proxy = new Proxy(function() {
        }, { get(_obj, prop) {
          if ("then" === prop) return {};
          throw Object.defineProperty(Error(getUnsupportedModuleErrorMessage(moduleName)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }, construct() {
          throw Object.defineProperty(Error(getUnsupportedModuleErrorMessage(moduleName)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }, apply(_target, _this, args) {
          if ("function" == typeof args[0]) return args[0](proxy);
          throw Object.defineProperty(Error(getUnsupportedModuleErrorMessage(moduleName)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        } });
        return new Proxy({}, { get: () => proxy });
      }
      process !== __webpack_require__.g.process && (process.env = __webpack_require__.g.process.env, __webpack_require__.g.process = process);
      try {
        Object.defineProperty(globalThis, "__import_unsupported", { value: __import_unsupported, enumerable: false, configurable: false });
      } catch {
      }
      ensureInstrumentationRegistered();
      class PageSignatureError extends Error {
        constructor({ page: page2 }) {
          super(`The middleware "${page2}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `);
        }
      }
      class RemovedPageError extends Error {
        constructor() {
          super("The request.page has been deprecated in favour of `URLPattern`.\n  Read more: https://nextjs.org/docs/messages/middleware-request-page\n  ");
        }
      }
      class RemovedUAError extends Error {
        constructor() {
          super("The request.ua has been removed in favour of `userAgent` function.\n  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent\n  ");
        }
      }
      let PRERENDER_REVALIDATE_HEADER = "x-prerender-revalidate", NEXT_META_SUFFIX = ".meta", NEXT_CACHE_TAGS_HEADER = "x-next-cache-tags", NEXT_CACHE_REVALIDATED_TAGS_HEADER = "x-next-revalidated-tags", NEXT_CACHE_IMPLICIT_TAG_ID = "_N_T_", WEBPACK_LAYERS_NAMES = { shared: "shared", reactServerComponents: "rsc", serverSideRendering: "ssr", actionBrowser: "action-browser", apiNode: "api-node", apiEdge: "api-edge", middleware: "middleware", instrument: "instrument", edgeAsset: "edge-asset", appPagesBrowser: "app-pages-browser", pagesDirBrowser: "pages-dir-browser", pagesDirEdge: "pages-dir-edge", pagesDirNode: "pages-dir-node" };
      function utils_fromNodeOutgoingHttpHeaders(nodeHeaders) {
        let headers = new Headers();
        for (let [key, value1] of Object.entries(nodeHeaders)) for (let v of Array.isArray(value1) ? value1 : [value1]) void 0 !== v && ("number" == typeof v && (v = v.toString()), headers.append(key, v));
        return headers;
      }
      function splitCookiesString(cookiesString) {
        var start, ch, lastComma, nextStart, cookiesSeparatorFound, cookiesStrings = [], pos = 0;
        function skipWhitespace() {
          for (; pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos)); ) pos += 1;
          return pos < cookiesString.length;
        }
        function notSpecialChar() {
          return "=" !== (ch = cookiesString.charAt(pos)) && ";" !== ch && "," !== ch;
        }
        for (; pos < cookiesString.length; ) {
          for (start = pos, cookiesSeparatorFound = false; skipWhitespace(); ) if ("," === (ch = cookiesString.charAt(pos))) {
            for (lastComma = pos, pos += 1, skipWhitespace(), nextStart = pos; pos < cookiesString.length && notSpecialChar(); ) pos += 1;
            pos < cookiesString.length && "=" === cookiesString.charAt(pos) ? (cookiesSeparatorFound = true, pos = nextStart, cookiesStrings.push(cookiesString.substring(start, lastComma)), start = pos) : pos = lastComma + 1;
          } else pos += 1;
          (!cookiesSeparatorFound || pos >= cookiesString.length) && cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
        }
        return cookiesStrings;
      }
      function toNodeOutgoingHttpHeaders(headers) {
        let nodeHeaders = {}, cookies = [];
        if (headers) for (let [key, value1] of headers.entries()) "set-cookie" === key.toLowerCase() ? (cookies.push(...splitCookiesString(value1)), nodeHeaders[key] = 1 === cookies.length ? cookies[0] : cookies) : nodeHeaders[key] = value1;
        return nodeHeaders;
      }
      function validateURL(url) {
        try {
          return String(new URL(String(url)));
        } catch (error2) {
          throw Object.defineProperty(Error(`URL is malformed "${String(url)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, { cause: error2 }), "__NEXT_ERROR_CODE", { value: "E61", enumerable: false, configurable: true });
        }
      }
      function utils_normalizeNextQueryParam(key) {
        for (let prefix of ["nxtP", "nxtI"]) if (key !== prefix && key.startsWith(prefix)) return key.substring(prefix.length);
        return null;
      }
      ({ ...WEBPACK_LAYERS_NAMES, GROUP: { builtinReact: [WEBPACK_LAYERS_NAMES.reactServerComponents, WEBPACK_LAYERS_NAMES.actionBrowser], serverOnly: [WEBPACK_LAYERS_NAMES.reactServerComponents, WEBPACK_LAYERS_NAMES.actionBrowser, WEBPACK_LAYERS_NAMES.instrument, WEBPACK_LAYERS_NAMES.middleware], neutralTarget: [WEBPACK_LAYERS_NAMES.apiNode, WEBPACK_LAYERS_NAMES.apiEdge], clientOnly: [WEBPACK_LAYERS_NAMES.serverSideRendering, WEBPACK_LAYERS_NAMES.appPagesBrowser], bundled: [WEBPACK_LAYERS_NAMES.reactServerComponents, WEBPACK_LAYERS_NAMES.actionBrowser, WEBPACK_LAYERS_NAMES.serverSideRendering, WEBPACK_LAYERS_NAMES.appPagesBrowser, WEBPACK_LAYERS_NAMES.shared, WEBPACK_LAYERS_NAMES.instrument, WEBPACK_LAYERS_NAMES.middleware], appPages: [WEBPACK_LAYERS_NAMES.reactServerComponents, WEBPACK_LAYERS_NAMES.serverSideRendering, WEBPACK_LAYERS_NAMES.appPagesBrowser, WEBPACK_LAYERS_NAMES.actionBrowser] } });
      let responseSymbol = Symbol("response"), passThroughSymbol = Symbol("passThrough"), waitUntilSymbol = Symbol("waitUntil");
      class FetchEvent {
        constructor(_request, waitUntil) {
          this[passThroughSymbol] = false, this[waitUntilSymbol] = waitUntil ? { kind: "external", function: waitUntil } : { kind: "internal", promises: [] };
        }
        respondWith(response) {
          this[responseSymbol] || (this[responseSymbol] = Promise.resolve(response));
        }
        passThroughOnException() {
          this[passThroughSymbol] = true;
        }
        waitUntil(promise) {
          if ("external" === this[waitUntilSymbol].kind) return (0, this[waitUntilSymbol].function)(promise);
          this[waitUntilSymbol].promises.push(promise);
        }
      }
      function getWaitUntilPromiseFromEvent(event) {
        return "internal" === event[waitUntilSymbol].kind ? Promise.all(event[waitUntilSymbol].promises).then(() => {
        }) : void 0;
      }
      class NextFetchEvent extends FetchEvent {
        constructor(params) {
          var _params_context;
          super(params.request, null == (_params_context = params.context) ? void 0 : _params_context.waitUntil), this.sourcePage = params.page;
        }
        get request() {
          throw Object.defineProperty(new PageSignatureError({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new PageSignatureError({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      function detectDomainLocale2(domainItems, hostname, detectedLocale) {
        if (domainItems) {
          for (let item of (detectedLocale && (detectedLocale = detectedLocale.toLowerCase()), domainItems)) if (hostname === item.domain?.split(":", 1)[0].toLowerCase() || detectedLocale === item.defaultLocale.toLowerCase() || item.locales?.some((locale) => locale.toLowerCase() === detectedLocale)) return item;
        }
      }
      function remove_trailing_slash_removeTrailingSlash(route) {
        return route.replace(/\/$/, "") || "/";
      }
      function parsePath(path4) {
        let hashIndex = path4.indexOf("#"), queryIndex = path4.indexOf("?"), hasQuery = queryIndex > -1 && (hashIndex < 0 || queryIndex < hashIndex);
        return hasQuery || hashIndex > -1 ? { pathname: path4.substring(0, hasQuery ? queryIndex : hashIndex), query: hasQuery ? path4.substring(queryIndex, hashIndex > -1 ? hashIndex : void 0) : "", hash: hashIndex > -1 ? path4.slice(hashIndex) : "" } : { pathname: path4, query: "", hash: "" };
      }
      function addPathPrefix(path4, prefix) {
        if (!path4.startsWith("/") || !prefix) return path4;
        let { pathname, query, hash } = parsePath(path4);
        return `${prefix}${pathname}${query}${hash}`;
      }
      function addPathSuffix(path4, suffix) {
        if (!path4.startsWith("/") || !suffix) return path4;
        let { pathname, query, hash } = parsePath(path4);
        return `${pathname}${suffix}${query}${hash}`;
      }
      function pathHasPrefix(path4, prefix) {
        if ("string" != typeof path4) return false;
        let { pathname } = parsePath(path4);
        return pathname === prefix || pathname.startsWith(prefix + "/");
      }
      function addLocale(path4, locale, defaultLocale, ignorePrefix) {
        if (!locale || locale === defaultLocale) return path4;
        let lower = path4.toLowerCase();
        return !ignorePrefix && (pathHasPrefix(lower, "/api") || pathHasPrefix(lower, `/${locale.toLowerCase()}`)) ? path4 : addPathPrefix(path4, `/${locale}`);
      }
      function formatNextPathnameInfo(info) {
        let pathname = addLocale(info.pathname, info.locale, info.buildId ? void 0 : info.defaultLocale, info.ignorePrefix);
        return (info.buildId || !info.trailingSlash) && (pathname = remove_trailing_slash_removeTrailingSlash(pathname)), info.buildId && (pathname = addPathSuffix(addPathPrefix(pathname, `/_next/data/${info.buildId}`), "/" === info.pathname ? "index.json" : ".json")), pathname = addPathPrefix(pathname, info.basePath), !info.buildId && info.trailingSlash ? pathname.endsWith("/") ? pathname : addPathSuffix(pathname, "/") : remove_trailing_slash_removeTrailingSlash(pathname);
      }
      function getHostname(parsed, headers) {
        let hostname;
        if (headers?.host && !Array.isArray(headers.host)) hostname = headers.host.toString().split(":", 1)[0];
        else {
          if (!parsed.hostname) return;
          hostname = parsed.hostname;
        }
        return hostname.toLowerCase();
      }
      let cache = /* @__PURE__ */ new WeakMap();
      function normalize_locale_path_normalizeLocalePath(pathname, locales) {
        let detectedLocale;
        if (!locales) return { pathname };
        let lowercasedLocales = cache.get(locales);
        lowercasedLocales || (lowercasedLocales = locales.map((locale) => locale.toLowerCase()), cache.set(locales, lowercasedLocales));
        let segments = pathname.split("/", 2);
        if (!segments[1]) return { pathname };
        let segment = segments[1].toLowerCase(), index = lowercasedLocales.indexOf(segment);
        return index < 0 ? { pathname } : (detectedLocale = locales[index], { pathname: pathname = pathname.slice(detectedLocale.length + 1) || "/", detectedLocale });
      }
      function removePathPrefix(path4, prefix) {
        if (!pathHasPrefix(path4, prefix)) return path4;
        let withoutPrefix = path4.slice(prefix.length);
        return withoutPrefix.startsWith("/") ? withoutPrefix : `/${withoutPrefix}`;
      }
      function getNextPathnameInfo(pathname, options) {
        let { basePath, i18n, trailingSlash } = options.nextConfig ?? {}, info = { pathname, trailingSlash: "/" !== pathname ? pathname.endsWith("/") : trailingSlash };
        basePath && pathHasPrefix(info.pathname, basePath) && (info.pathname = removePathPrefix(info.pathname, basePath), info.basePath = basePath);
        let pathnameNoDataPrefix = info.pathname;
        if (info.pathname.startsWith("/_next/data/") && info.pathname.endsWith(".json")) {
          let paths = info.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/");
          info.buildId = paths[0], pathnameNoDataPrefix = "index" !== paths[1] ? `/${paths.slice(1).join("/")}` : "/", true === options.parseData && (info.pathname = pathnameNoDataPrefix);
        }
        if (i18n) {
          let result = options.i18nProvider ? options.i18nProvider.analyze(info.pathname) : normalize_locale_path_normalizeLocalePath(info.pathname, i18n.locales);
          info.locale = result.detectedLocale, info.pathname = result.pathname ?? info.pathname, !result.detectedLocale && info.buildId && (result = options.i18nProvider ? options.i18nProvider.analyze(pathnameNoDataPrefix) : normalize_locale_path_normalizeLocalePath(pathnameNoDataPrefix, i18n.locales)).detectedLocale && (info.locale = result.detectedLocale);
        }
        return info;
      }
      let REGEX_LOCALHOST_HOSTNAME = /^(?:127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)$/;
      function parseURL(url, base) {
        let parsed = new URL(String(url), base && String(base));
        return REGEX_LOCALHOST_HOSTNAME.test(parsed.hostname) && (parsed.hostname = "localhost"), parsed;
      }
      let Internal = Symbol("NextURLInternal");
      class NextURL {
        constructor(input, baseOrOpts, opts) {
          let base, options;
          "object" == typeof baseOrOpts && "pathname" in baseOrOpts || "string" == typeof baseOrOpts ? (base = baseOrOpts, options = opts || {}) : options = opts || baseOrOpts || {}, this[Internal] = { url: parseURL(input, base ?? options.base), options, basePath: "" }, this.analyze();
        }
        analyze() {
          var _this_Internal_options_nextConfig_i18n, _this_Internal_options_nextConfig, _this_Internal_domainLocale, _this_Internal_options_nextConfig_i18n1, _this_Internal_options_nextConfig1;
          let info = getNextPathnameInfo(this[Internal].url.pathname, { nextConfig: this[Internal].options.nextConfig, parseData: true, i18nProvider: this[Internal].options.i18nProvider }), hostname = getHostname(this[Internal].url, this[Internal].options.headers);
          this[Internal].domainLocale = this[Internal].options.i18nProvider ? this[Internal].options.i18nProvider.detectDomainLocale(hostname) : detectDomainLocale2(null == (_this_Internal_options_nextConfig = this[Internal].options.nextConfig) || null == (_this_Internal_options_nextConfig_i18n = _this_Internal_options_nextConfig.i18n) ? void 0 : _this_Internal_options_nextConfig_i18n.domains, hostname);
          let defaultLocale = (null == (_this_Internal_domainLocale = this[Internal].domainLocale) ? void 0 : _this_Internal_domainLocale.defaultLocale) || (null == (_this_Internal_options_nextConfig1 = this[Internal].options.nextConfig) || null == (_this_Internal_options_nextConfig_i18n1 = _this_Internal_options_nextConfig1.i18n) ? void 0 : _this_Internal_options_nextConfig_i18n1.defaultLocale);
          this[Internal].url.pathname = info.pathname, this[Internal].defaultLocale = defaultLocale, this[Internal].basePath = info.basePath ?? "", this[Internal].buildId = info.buildId, this[Internal].locale = info.locale ?? defaultLocale, this[Internal].trailingSlash = info.trailingSlash;
        }
        formatPathname() {
          return formatNextPathnameInfo({ basePath: this[Internal].basePath, buildId: this[Internal].buildId, defaultLocale: this[Internal].options.forceLocale ? void 0 : this[Internal].defaultLocale, locale: this[Internal].locale, pathname: this[Internal].url.pathname, trailingSlash: this[Internal].trailingSlash });
        }
        formatSearch() {
          return this[Internal].url.search;
        }
        get buildId() {
          return this[Internal].buildId;
        }
        set buildId(buildId) {
          this[Internal].buildId = buildId;
        }
        get locale() {
          return this[Internal].locale ?? "";
        }
        set locale(locale) {
          var _this_Internal_options_nextConfig_i18n, _this_Internal_options_nextConfig;
          if (!this[Internal].locale || !(null == (_this_Internal_options_nextConfig = this[Internal].options.nextConfig) || null == (_this_Internal_options_nextConfig_i18n = _this_Internal_options_nextConfig.i18n) ? void 0 : _this_Internal_options_nextConfig_i18n.locales.includes(locale))) throw Object.defineProperty(TypeError(`The NextURL configuration includes no locale "${locale}"`), "__NEXT_ERROR_CODE", { value: "E597", enumerable: false, configurable: true });
          this[Internal].locale = locale;
        }
        get defaultLocale() {
          return this[Internal].defaultLocale;
        }
        get domainLocale() {
          return this[Internal].domainLocale;
        }
        get searchParams() {
          return this[Internal].url.searchParams;
        }
        get host() {
          return this[Internal].url.host;
        }
        set host(value1) {
          this[Internal].url.host = value1;
        }
        get hostname() {
          return this[Internal].url.hostname;
        }
        set hostname(value1) {
          this[Internal].url.hostname = value1;
        }
        get port() {
          return this[Internal].url.port;
        }
        set port(value1) {
          this[Internal].url.port = value1;
        }
        get protocol() {
          return this[Internal].url.protocol;
        }
        set protocol(value1) {
          this[Internal].url.protocol = value1;
        }
        get href() {
          let pathname = this.formatPathname(), search = this.formatSearch();
          return `${this.protocol}//${this.host}${pathname}${search}${this.hash}`;
        }
        set href(url) {
          this[Internal].url = parseURL(url), this.analyze();
        }
        get origin() {
          return this[Internal].url.origin;
        }
        get pathname() {
          return this[Internal].url.pathname;
        }
        set pathname(value1) {
          this[Internal].url.pathname = value1;
        }
        get hash() {
          return this[Internal].url.hash;
        }
        set hash(value1) {
          this[Internal].url.hash = value1;
        }
        get search() {
          return this[Internal].url.search;
        }
        set search(value1) {
          this[Internal].url.search = value1;
        }
        get password() {
          return this[Internal].url.password;
        }
        set password(value1) {
          this[Internal].url.password = value1;
        }
        get username() {
          return this[Internal].url.username;
        }
        set username(value1) {
          this[Internal].url.username = value1;
        }
        get basePath() {
          return this[Internal].basePath;
        }
        set basePath(value1) {
          this[Internal].basePath = value1.startsWith("/") ? value1 : `/${value1}`;
        }
        toString() {
          return this.href;
        }
        toJSON() {
          return this.href;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { href: this.href, origin: this.origin, protocol: this.protocol, username: this.username, password: this.password, host: this.host, hostname: this.hostname, port: this.port, pathname: this.pathname, search: this.search, searchParams: this.searchParams, hash: this.hash };
        }
        clone() {
          return new NextURL(String(this), this[Internal].options);
        }
      }
      var _edge_runtime_cookies = __webpack_require__(918);
      let INTERNALS = Symbol("internal request");
      class request_NextRequest extends Request {
        constructor(input, init = {}) {
          const url = "string" != typeof input && "url" in input ? input.url : String(input);
          validateURL(url), input instanceof Request ? super(input, init) : super(url, init);
          const nextUrl = new NextURL(url, { headers: toNodeOutgoingHttpHeaders(this.headers), nextConfig: init.nextConfig });
          this[INTERNALS] = { cookies: new _edge_runtime_cookies.RequestCookies(this.headers), nextUrl, url: nextUrl.toString() };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, nextUrl: this.nextUrl, url: this.url, bodyUsed: this.bodyUsed, cache: this.cache, credentials: this.credentials, destination: this.destination, headers: Object.fromEntries(this.headers), integrity: this.integrity, keepalive: this.keepalive, method: this.method, mode: this.mode, redirect: this.redirect, referrer: this.referrer, referrerPolicy: this.referrerPolicy, signal: this.signal };
        }
        get cookies() {
          return this[INTERNALS].cookies;
        }
        get nextUrl() {
          return this[INTERNALS].nextUrl;
        }
        get page() {
          throw new RemovedPageError();
        }
        get ua() {
          throw new RemovedUAError();
        }
        get url() {
          return this[INTERNALS].url;
        }
      }
      class reflect_ReflectAdapter {
        static get(target, prop, receiver) {
          let value1 = Reflect.get(target, prop, receiver);
          return "function" == typeof value1 ? value1.bind(target) : value1;
        }
        static set(target, prop, value1, receiver) {
          return Reflect.set(target, prop, value1, receiver);
        }
        static has(target, prop) {
          return Reflect.has(target, prop);
        }
        static deleteProperty(target, prop) {
          return Reflect.deleteProperty(target, prop);
        }
      }
      let response_INTERNALS = Symbol("internal response"), REDIRECTS2 = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
      function handleMiddlewareField(init, headers) {
        var _init_request;
        if (null == init || null == (_init_request = init.request) ? void 0 : _init_request.headers) {
          if (!(init.request.headers instanceof Headers)) throw Object.defineProperty(Error("request.headers must be an instance of Headers"), "__NEXT_ERROR_CODE", { value: "E119", enumerable: false, configurable: true });
          let keys = [];
          for (let [key, value1] of init.request.headers) headers.set("x-middleware-request-" + key, value1), keys.push(key);
          headers.set("x-middleware-override-headers", keys.join(","));
        }
      }
      class NextResponse extends Response {
        constructor(body, init = {}) {
          super(body, init);
          const headers = this.headers, cookiesProxy = new Proxy(new _edge_runtime_cookies.ResponseCookies(headers), { get(target, prop, receiver) {
            switch (prop) {
              case "delete":
              case "set":
                return (...args) => {
                  let result = Reflect.apply(target[prop], target, args), newHeaders = new Headers(headers);
                  return result instanceof _edge_runtime_cookies.ResponseCookies && headers.set("x-middleware-set-cookie", result.getAll().map((cookie) => (0, _edge_runtime_cookies.stringifyCookie)(cookie)).join(",")), handleMiddlewareField(init, newHeaders), result;
                };
              default:
                return reflect_ReflectAdapter.get(target, prop, receiver);
            }
          } });
          this[response_INTERNALS] = { cookies: cookiesProxy, url: init.url ? new NextURL(init.url, { headers: toNodeOutgoingHttpHeaders(headers), nextConfig: init.nextConfig }) : void 0 };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, url: this.url, body: this.body, bodyUsed: this.bodyUsed, headers: Object.fromEntries(this.headers), ok: this.ok, redirected: this.redirected, status: this.status, statusText: this.statusText, type: this.type };
        }
        get cookies() {
          return this[response_INTERNALS].cookies;
        }
        static json(body, init) {
          let response = Response.json(body, init);
          return new NextResponse(response.body, response);
        }
        static redirect(url, init) {
          let status = "number" == typeof init ? init : (null == init ? void 0 : init.status) ?? 307;
          if (!REDIRECTS2.has(status)) throw Object.defineProperty(RangeError('Failed to execute "redirect" on "response": Invalid status code'), "__NEXT_ERROR_CODE", { value: "E529", enumerable: false, configurable: true });
          let initObj = "object" == typeof init ? init : {}, headers = new Headers(null == initObj ? void 0 : initObj.headers);
          return headers.set("Location", validateURL(url)), new NextResponse(null, { ...initObj, headers, status });
        }
        static rewrite(destination, init) {
          let headers = new Headers(null == init ? void 0 : init.headers);
          return headers.set("x-middleware-rewrite", validateURL(destination)), handleMiddlewareField(init, headers), new NextResponse(null, { ...init, headers });
        }
        static next(init) {
          let headers = new Headers(null == init ? void 0 : init.headers);
          return headers.set("x-middleware-next", "1"), handleMiddlewareField(init, headers), new NextResponse(null, { ...init, headers });
        }
      }
      function parseRelativeURL(url, base) {
        let baseURL = "string" == typeof base ? new URL(base) : base, relative = new URL(url, base), isRelative = relative.origin === baseURL.origin;
        return { url: isRelative ? relative.toString().slice(baseURL.origin.length) : relative.toString(), isRelative };
      }
      let app_router_headers_NEXT_ROUTER_PREFETCH_HEADER = "next-router-prefetch", FLIGHT_HEADERS = ["rsc", "next-router-state-tree", app_router_headers_NEXT_ROUTER_PREFETCH_HEADER, "next-hmr-refresh", "next-router-segment-prefetch"], app_router_headers_NEXT_RSC_UNION_QUERY = "_rsc";
      function stripInternalSearchParams(url) {
        let isStringUrl = "string" == typeof url, instance = isStringUrl ? new URL(url) : url;
        return instance.searchParams.delete(app_router_headers_NEXT_RSC_UNION_QUERY), isStringUrl ? instance.toString() : instance;
      }
      function ensureLeadingSlash(path4) {
        return path4.startsWith("/") ? path4 : `/${path4}`;
      }
      function isGroupSegment(segment) {
        return "(" === segment[0] && segment.endsWith(")");
      }
      function normalizeAppPath(route) {
        return ensureLeadingSlash(route.split("/").reduce((pathname, segment, index, segments) => !segment || isGroupSegment(segment) || "@" === segment[0] || ("page" === segment || "route" === segment) && index === segments.length - 1 ? pathname : `${pathname}/${segment}`, ""));
      }
      function app_paths_normalizeRscURL(url) {
        return url.replace(/\.rsc($|\?)/, "$1");
      }
      class ReadonlyHeadersError extends Error {
        constructor() {
          super("Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers");
        }
        static callable() {
          throw new ReadonlyHeadersError();
        }
      }
      class headers_HeadersAdapter extends Headers {
        constructor(headers) {
          super(), this.headers = new Proxy(headers, { get(target, prop, receiver) {
            if ("symbol" == typeof prop) return reflect_ReflectAdapter.get(target, prop, receiver);
            let lowercased = prop.toLowerCase(), original = Object.keys(headers).find((o) => o.toLowerCase() === lowercased);
            if (void 0 !== original) return reflect_ReflectAdapter.get(target, original, receiver);
          }, set(target, prop, value1, receiver) {
            if ("symbol" == typeof prop) return reflect_ReflectAdapter.set(target, prop, value1, receiver);
            let lowercased = prop.toLowerCase(), original = Object.keys(headers).find((o) => o.toLowerCase() === lowercased);
            return reflect_ReflectAdapter.set(target, original ?? prop, value1, receiver);
          }, has(target, prop) {
            if ("symbol" == typeof prop) return reflect_ReflectAdapter.has(target, prop);
            let lowercased = prop.toLowerCase(), original = Object.keys(headers).find((o) => o.toLowerCase() === lowercased);
            return void 0 !== original && reflect_ReflectAdapter.has(target, original);
          }, deleteProperty(target, prop) {
            if ("symbol" == typeof prop) return reflect_ReflectAdapter.deleteProperty(target, prop);
            let lowercased = prop.toLowerCase(), original = Object.keys(headers).find((o) => o.toLowerCase() === lowercased);
            return void 0 === original || reflect_ReflectAdapter.deleteProperty(target, original);
          } });
        }
        static seal(headers) {
          return new Proxy(headers, { get(target, prop, receiver) {
            switch (prop) {
              case "append":
              case "delete":
              case "set":
                return ReadonlyHeadersError.callable;
              default:
                return reflect_ReflectAdapter.get(target, prop, receiver);
            }
          } });
        }
        merge(value1) {
          return Array.isArray(value1) ? value1.join(", ") : value1;
        }
        static from(headers) {
          return headers instanceof Headers ? headers : new headers_HeadersAdapter(headers);
        }
        append(name, value1) {
          let existing = this.headers[name];
          "string" == typeof existing ? this.headers[name] = [existing, value1] : Array.isArray(existing) ? existing.push(value1) : this.headers[name] = value1;
        }
        delete(name) {
          delete this.headers[name];
        }
        get(name) {
          let value1 = this.headers[name];
          return void 0 !== value1 ? this.merge(value1) : null;
        }
        has(name) {
          return void 0 !== this.headers[name];
        }
        set(name, value1) {
          this.headers[name] = value1;
        }
        forEach(callbackfn, thisArg) {
          for (let [name, value1] of this.entries()) callbackfn.call(thisArg, value1, name, this);
        }
        *entries() {
          for (let key of Object.keys(this.headers)) {
            let name = key.toLowerCase(), value1 = this.get(name);
            yield [name, value1];
          }
        }
        *keys() {
          for (let key of Object.keys(this.headers)) {
            let name = key.toLowerCase();
            yield name;
          }
        }
        *values() {
          for (let key of Object.keys(this.headers)) {
            let value1 = this.get(key);
            yield value1;
          }
        }
        [Symbol.iterator]() {
          return this.entries();
        }
      }
      let sharedAsyncLocalStorageNotAvailableError = Object.defineProperty(Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available"), "__NEXT_ERROR_CODE", { value: "E504", enumerable: false, configurable: true });
      class FakeAsyncLocalStorage {
        disable() {
          throw sharedAsyncLocalStorageNotAvailableError;
        }
        getStore() {
        }
        run() {
          throw sharedAsyncLocalStorageNotAvailableError;
        }
        exit() {
          throw sharedAsyncLocalStorageNotAvailableError;
        }
        enterWith() {
          throw sharedAsyncLocalStorageNotAvailableError;
        }
        static bind(fn) {
          return fn;
        }
      }
      let maybeGlobalAsyncLocalStorage = "u" > typeof globalThis && globalThis.AsyncLocalStorage;
      function async_local_storage_createAsyncLocalStorage() {
        return maybeGlobalAsyncLocalStorage ? new maybeGlobalAsyncLocalStorage() : new FakeAsyncLocalStorage();
      }
      let workAsyncStorageInstance = async_local_storage_createAsyncLocalStorage();
      class ReadonlyRequestCookiesError extends Error {
        constructor() {
          super("Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#options");
        }
        static callable() {
          throw new ReadonlyRequestCookiesError();
        }
      }
      class request_cookies_RequestCookiesAdapter {
        static seal(cookies) {
          return new Proxy(cookies, { get(target, prop, receiver) {
            switch (prop) {
              case "clear":
              case "delete":
              case "set":
                return ReadonlyRequestCookiesError.callable;
              default:
                return reflect_ReflectAdapter.get(target, prop, receiver);
            }
          } });
        }
      }
      let SYMBOL_MODIFY_COOKIE_VALUES = Symbol.for("next.mutated.cookies");
      class MutableRequestCookiesAdapter {
        static wrap(cookies, onUpdateCookies) {
          let responseCookies = new _edge_runtime_cookies.ResponseCookies(new Headers());
          for (let cookie of cookies.getAll()) responseCookies.set(cookie);
          let modifiedValues = [], modifiedCookies = /* @__PURE__ */ new Set(), updateResponseCookies = () => {
            let workStore = workAsyncStorageInstance.getStore();
            if (workStore && (workStore.pathWasRevalidated = 1), modifiedValues = responseCookies.getAll().filter((c) => modifiedCookies.has(c.name)), onUpdateCookies) {
              let serializedCookies = [];
              for (let cookie of modifiedValues) {
                let tempCookies = new _edge_runtime_cookies.ResponseCookies(new Headers());
                tempCookies.set(cookie), serializedCookies.push(tempCookies.toString());
              }
              onUpdateCookies(serializedCookies);
            }
          }, wrappedCookies = new Proxy(responseCookies, { get(target, prop, receiver) {
            switch (prop) {
              case SYMBOL_MODIFY_COOKIE_VALUES:
                return modifiedValues;
              case "delete":
                return function(...args) {
                  modifiedCookies.add("string" == typeof args[0] ? args[0] : args[0].name);
                  try {
                    return target.delete(...args), wrappedCookies;
                  } finally {
                    updateResponseCookies();
                  }
                };
              case "set":
                return function(...args) {
                  modifiedCookies.add("string" == typeof args[0] ? args[0] : args[0].name);
                  try {
                    return target.set(...args), wrappedCookies;
                  } finally {
                    updateResponseCookies();
                  }
                };
              default:
                return reflect_ReflectAdapter.get(target, prop, receiver);
            }
          } });
          return wrappedCookies;
        }
      }
      function createCookiesWithMutableAccessCheck(requestStore) {
        let wrappedCookies = new Proxy(requestStore.mutableCookies, { get(target, prop, receiver) {
          switch (prop) {
            case "delete":
              return function(...args) {
                return ensureCookiesAreStillMutable(requestStore, "cookies().delete"), target.delete(...args), wrappedCookies;
              };
            case "set":
              return function(...args) {
                return ensureCookiesAreStillMutable(requestStore, "cookies().set"), target.set(...args), wrappedCookies;
              };
            default:
              return reflect_ReflectAdapter.get(target, prop, receiver);
          }
        } });
        return wrappedCookies;
      }
      function request_cookies_areCookiesMutableInCurrentPhase(requestStore) {
        return "action" === requestStore.phase;
      }
      function ensureCookiesAreStillMutable(requestStore, _callingExpression) {
        if (!request_cookies_areCookiesMutableInCurrentPhase(requestStore)) throw new ReadonlyRequestCookiesError();
      }
      var BaseServerSpan1 = ((BaseServerSpan = BaseServerSpan1 || {}).handleRequest = "BaseServer.handleRequest", BaseServerSpan.run = "BaseServer.run", BaseServerSpan.pipe = "BaseServer.pipe", BaseServerSpan.getStaticHTML = "BaseServer.getStaticHTML", BaseServerSpan.render = "BaseServer.render", BaseServerSpan.renderToResponseWithComponents = "BaseServer.renderToResponseWithComponents", BaseServerSpan.renderToResponse = "BaseServer.renderToResponse", BaseServerSpan.renderToHTML = "BaseServer.renderToHTML", BaseServerSpan.renderError = "BaseServer.renderError", BaseServerSpan.renderErrorToResponse = "BaseServer.renderErrorToResponse", BaseServerSpan.renderErrorToHTML = "BaseServer.renderErrorToHTML", BaseServerSpan.render404 = "BaseServer.render404", BaseServerSpan), LoadComponentsSpan1 = ((LoadComponentsSpan = LoadComponentsSpan1 || {}).loadDefaultErrorComponents = "LoadComponents.loadDefaultErrorComponents", LoadComponentsSpan.loadComponents = "LoadComponents.loadComponents", LoadComponentsSpan), NextServerSpan1 = ((NextServerSpan = NextServerSpan1 || {}).getRequestHandler = "NextServer.getRequestHandler", NextServerSpan.getRequestHandlerWithMetadata = "NextServer.getRequestHandlerWithMetadata", NextServerSpan.getServer = "NextServer.getServer", NextServerSpan.getServerRequestHandler = "NextServer.getServerRequestHandler", NextServerSpan.createServer = "createServer.createServer", NextServerSpan), NextNodeServerSpan1 = ((NextNodeServerSpan = NextNodeServerSpan1 || {}).compression = "NextNodeServer.compression", NextNodeServerSpan.getBuildId = "NextNodeServer.getBuildId", NextNodeServerSpan.createComponentTree = "NextNodeServer.createComponentTree", NextNodeServerSpan.clientComponentLoading = "NextNodeServer.clientComponentLoading", NextNodeServerSpan.getLayoutOrPageModule = "NextNodeServer.getLayoutOrPageModule", NextNodeServerSpan.generateStaticRoutes = "NextNodeServer.generateStaticRoutes", NextNodeServerSpan.generateFsStaticRoutes = "NextNodeServer.generateFsStaticRoutes", NextNodeServerSpan.generatePublicRoutes = "NextNodeServer.generatePublicRoutes", NextNodeServerSpan.generateImageRoutes = "NextNodeServer.generateImageRoutes.route", NextNodeServerSpan.sendRenderResult = "NextNodeServer.sendRenderResult", NextNodeServerSpan.proxyRequest = "NextNodeServer.proxyRequest", NextNodeServerSpan.runApi = "NextNodeServer.runApi", NextNodeServerSpan.render = "NextNodeServer.render", NextNodeServerSpan.renderHTML = "NextNodeServer.renderHTML", NextNodeServerSpan.imageOptimizer = "NextNodeServer.imageOptimizer", NextNodeServerSpan.getPagePath = "NextNodeServer.getPagePath", NextNodeServerSpan.getRoutesManifest = "NextNodeServer.getRoutesManifest", NextNodeServerSpan.findPageComponents = "NextNodeServer.findPageComponents", NextNodeServerSpan.getFontManifest = "NextNodeServer.getFontManifest", NextNodeServerSpan.getServerComponentManifest = "NextNodeServer.getServerComponentManifest", NextNodeServerSpan.getRequestHandler = "NextNodeServer.getRequestHandler", NextNodeServerSpan.renderToHTML = "NextNodeServer.renderToHTML", NextNodeServerSpan.renderError = "NextNodeServer.renderError", NextNodeServerSpan.renderErrorToHTML = "NextNodeServer.renderErrorToHTML", NextNodeServerSpan.render404 = "NextNodeServer.render404", NextNodeServerSpan.startResponse = "NextNodeServer.startResponse", NextNodeServerSpan.route = "route", NextNodeServerSpan.onProxyReq = "onProxyReq", NextNodeServerSpan.apiResolver = "apiResolver", NextNodeServerSpan.internalFetch = "internalFetch", NextNodeServerSpan), StartServerSpan1 = ((StartServerSpan = StartServerSpan1 || {}).startServer = "startServer.startServer", StartServerSpan), RenderSpan1 = ((RenderSpan = RenderSpan1 || {}).getServerSideProps = "Render.getServerSideProps", RenderSpan.getStaticProps = "Render.getStaticProps", RenderSpan.renderToString = "Render.renderToString", RenderSpan.renderDocument = "Render.renderDocument", RenderSpan.createBodyResult = "Render.createBodyResult", RenderSpan), constants_AppRenderSpan = ((AppRenderSpan = constants_AppRenderSpan || {}).renderToString = "AppRender.renderToString", AppRenderSpan.renderToReadableStream = "AppRender.renderToReadableStream", AppRenderSpan.getBodyResult = "AppRender.getBodyResult", AppRenderSpan.fetch = "AppRender.fetch", AppRenderSpan), RouterSpan1 = ((RouterSpan = RouterSpan1 || {}).executeRoute = "Router.executeRoute", RouterSpan), constants_NodeSpan = ((NodeSpan = constants_NodeSpan || {}).runHandler = "Node.runHandler", NodeSpan), AppRouteRouteHandlersSpan1 = ((AppRouteRouteHandlersSpan = AppRouteRouteHandlersSpan1 || {}).runHandler = "AppRouteRouteHandlers.runHandler", AppRouteRouteHandlersSpan), ResolveMetadataSpan1 = ((ResolveMetadataSpan = ResolveMetadataSpan1 || {}).generateMetadata = "ResolveMetadata.generateMetadata", ResolveMetadataSpan.generateViewport = "ResolveMetadata.generateViewport", ResolveMetadataSpan), MiddlewareSpan1 = ((MiddlewareSpan = MiddlewareSpan1 || {}).execute = "Middleware.execute", MiddlewareSpan);
      let NextVanillaSpanAllowlist = /* @__PURE__ */ new Set(["Middleware.execute", "BaseServer.handleRequest", "Render.getServerSideProps", "Render.getStaticProps", "AppRender.fetch", "AppRender.getBodyResult", "Render.renderDocument", "Node.runHandler", "AppRouteRouteHandlers.runHandler", "ResolveMetadata.generateMetadata", "ResolveMetadata.generateViewport", "NextNodeServer.createComponentTree", "NextNodeServer.findPageComponents", "NextNodeServer.getLayoutOrPageModule", "NextNodeServer.startResponse", "NextNodeServer.clientComponentLoading"]), LogSpanAllowList = /* @__PURE__ */ new Set(["NextNodeServer.findPageComponents", "NextNodeServer.createComponentTree", "NextNodeServer.clientComponentLoading"]);
      function isThenable(promise) {
        return null !== promise && "object" == typeof promise && "then" in promise && "function" == typeof promise.then;
      }
      let NEXT_OTEL_PERFORMANCE_PREFIX = process.env.NEXT_OTEL_PERFORMANCE_PREFIX, { context, propagation, trace, SpanStatusCode, SpanKind, ROOT_CONTEXT } = api = __webpack_require__(446);
      class BubbledError extends Error {
        constructor(bubble, result) {
          super(), this.bubble = bubble, this.result = result;
        }
      }
      function isBubbledError(error2) {
        return "object" == typeof error2 && null !== error2 && error2 instanceof BubbledError;
      }
      let closeSpanWithError = (span, error2) => {
        isBubbledError(error2) && error2.bubble ? span.setAttribute("next.bubble", true) : (error2 && (span.recordException(error2), span.setAttribute("error.type", error2.name)), span.setStatus({ code: SpanStatusCode.ERROR, message: null == error2 ? void 0 : error2.message })), span.end();
      }, rootSpanAttributesStore = /* @__PURE__ */ new Map(), rootSpanIdKey = api.createContextKey("next.rootSpanId"), lastSpanId = 0, clientTraceDataSetter = { set(carrier, key, value1) {
        carrier.push({ key, value: value1 });
      } };
      class NextTracerImpl {
        getTracerInstance() {
          return trace.getTracer("next.js", "0.0.1");
        }
        getContext() {
          return context;
        }
        getTracePropagationData() {
          let activeContext = context.active(), entries = [];
          return propagation.inject(activeContext, entries, clientTraceDataSetter), entries;
        }
        getActiveScopeSpan() {
          return trace.getSpan(null == context ? void 0 : context.active());
        }
        withPropagatedContext(carrier, fn, getter, force = false) {
          let activeContext = context.active();
          if (force) {
            let remoteContext2 = propagation.extract(ROOT_CONTEXT, carrier, getter);
            if (trace.getSpanContext(remoteContext2)) return context.with(remoteContext2, fn);
            let mergedContext = propagation.extract(activeContext, carrier, getter);
            return context.with(mergedContext, fn);
          }
          if (trace.getSpanContext(activeContext)) return fn();
          let remoteContext = propagation.extract(activeContext, carrier, getter);
          return context.with(remoteContext, fn);
        }
        trace(...args) {
          let [type, fnOrOptions, fnOrEmpty] = args, { fn, options } = "function" == typeof fnOrOptions ? { fn: fnOrOptions, options: {} } : { fn: fnOrEmpty, options: { ...fnOrOptions } }, spanName = options.spanName ?? type;
          if (!NextVanillaSpanAllowlist.has(type) && "1" !== process.env.NEXT_OTEL_VERBOSE || options.hideSpan) return fn();
          let spanContext = this.getSpanContext((null == options ? void 0 : options.parentSpan) ?? this.getActiveScopeSpan());
          spanContext || (spanContext = (null == context ? void 0 : context.active()) ?? ROOT_CONTEXT);
          let existingRootSpanId = spanContext.getValue(rootSpanIdKey), isRootSpan = "number" != typeof existingRootSpanId || !rootSpanAttributesStore.has(existingRootSpanId), spanId = lastSpanId++;
          return options.attributes = { "next.span_name": spanName, "next.span_type": type, ...options.attributes }, context.with(spanContext.setValue(rootSpanIdKey, spanId), () => this.getTracerInstance().startActiveSpan(spanName, options, (span) => {
            let startTime;
            NEXT_OTEL_PERFORMANCE_PREFIX && type && LogSpanAllowList.has(type) && (startTime = "performance" in globalThis && "measure" in performance ? globalThis.performance.now() : void 0);
            let cleanedUp = false, onCleanup = () => {
              !cleanedUp && (cleanedUp = true, rootSpanAttributesStore.delete(spanId), startTime && performance.measure(`${NEXT_OTEL_PERFORMANCE_PREFIX}:next-${(type.split(".").pop() || "").replace(/[A-Z]/g, (match2) => "-" + match2.toLowerCase())}`, { start: startTime, end: performance.now() }));
            };
            if (isRootSpan && rootSpanAttributesStore.set(spanId, new Map(Object.entries(options.attributes ?? {}))), fn.length > 1) try {
              return fn(span, (err) => closeSpanWithError(span, err));
            } catch (err) {
              throw closeSpanWithError(span, err), err;
            } finally {
              onCleanup();
            }
            try {
              let result = fn(span);
              if (isThenable(result)) return result.then((res) => (span.end(), res)).catch((err) => {
                throw closeSpanWithError(span, err), err;
              }).finally(onCleanup);
              return span.end(), onCleanup(), result;
            } catch (err) {
              throw closeSpanWithError(span, err), onCleanup(), err;
            }
          }));
        }
        wrap(...args) {
          let tracer2 = this, [name, options, fn] = 3 === args.length ? args : [args[0], {}, args[1]];
          return NextVanillaSpanAllowlist.has(name) || "1" === process.env.NEXT_OTEL_VERBOSE ? function() {
            let optionsObj = options;
            "function" == typeof optionsObj && "function" == typeof fn && (optionsObj = optionsObj.apply(this, arguments));
            let lastArgId = arguments.length - 1, cb = arguments[lastArgId];
            if ("function" != typeof cb) return tracer2.trace(name, optionsObj, () => fn.apply(this, arguments));
            {
              let scopeBoundCb = tracer2.getContext().bind(context.active(), cb);
              return tracer2.trace(name, optionsObj, (_span, done) => (arguments[lastArgId] = function(err) {
                return null == done || done(err), scopeBoundCb.apply(this, arguments);
              }, fn.apply(this, arguments)));
            }
          } : fn;
        }
        startSpan(...args) {
          let [type, options] = args, spanContext = this.getSpanContext((null == options ? void 0 : options.parentSpan) ?? this.getActiveScopeSpan());
          return this.getTracerInstance().startSpan(type, options, spanContext);
        }
        getSpanContext(parentSpan) {
          return parentSpan ? trace.setSpan(context.active(), parentSpan) : void 0;
        }
        getRootSpanAttributes() {
          let spanId = context.active().getValue(rootSpanIdKey);
          return rootSpanAttributesStore.get(spanId);
        }
        setRootSpanAttribute(key, value1) {
          let spanId = context.active().getValue(rootSpanIdKey), attributes = rootSpanAttributesStore.get(spanId);
          attributes && !attributes.has(key) && attributes.set(key, value1);
        }
        withSpan(span, fn) {
          let spanContext = trace.setSpan(context.active(), span);
          return context.with(spanContext, fn);
        }
      }
      let tracer_getTracer = (tracer = new NextTracerImpl(), () => tracer);
      function checkIsOnDemandRevalidate(req, previewProps) {
        let headers = headers_HeadersAdapter.from(req.headers);
        return { isOnDemandRevalidate: headers.get(PRERENDER_REVALIDATE_HEADER) === previewProps.previewModeId, revalidateOnlyGenerated: headers.has("x-prerender-revalidate-if-generated") };
      }
      let COOKIE_NAME_PRERENDER_BYPASS = "__prerender_bypass";
      Symbol("__next_preview_data"), Symbol(COOKIE_NAME_PRERENDER_BYPASS);
      class DraftModeProvider {
        constructor(previewProps, req, cookies, mutableCookies) {
          var _cookies_get;
          const isOnDemandRevalidate = previewProps && checkIsOnDemandRevalidate(req, previewProps).isOnDemandRevalidate, cookieValue = null == (_cookies_get = cookies.get(COOKIE_NAME_PRERENDER_BYPASS)) ? void 0 : _cookies_get.value;
          this._isEnabled = !!(!isOnDemandRevalidate && cookieValue && previewProps && cookieValue === previewProps.previewModeId), this._previewModeId = null == previewProps ? void 0 : previewProps.previewModeId, this._mutableCookies = mutableCookies;
        }
        get isEnabled() {
          return this._isEnabled;
        }
        enable() {
          if (!this._previewModeId) throw Object.defineProperty(Error("Invariant: previewProps missing previewModeId this should never happen"), "__NEXT_ERROR_CODE", { value: "E93", enumerable: false, configurable: true });
          this._mutableCookies.set({ name: COOKIE_NAME_PRERENDER_BYPASS, value: this._previewModeId, httpOnly: true, sameSite: "none", secure: true, path: "/" }), this._isEnabled = true;
        }
        disable() {
          this._mutableCookies.set({ name: COOKIE_NAME_PRERENDER_BYPASS, value: "", httpOnly: true, sameSite: "none", secure: true, path: "/", expires: /* @__PURE__ */ new Date(0) }), this._isEnabled = false;
        }
      }
      function getHeaders(headers) {
        let cleaned = headers_HeadersAdapter.from(headers);
        for (let header of FLIGHT_HEADERS) cleaned.delete(header);
        return headers_HeadersAdapter.seal(cleaned);
      }
      function getMutableCookies(headers, onUpdateCookies) {
        let cookies = new _edge_runtime_cookies.RequestCookies(headers_HeadersAdapter.from(headers));
        return MutableRequestCookiesAdapter.wrap(cookies, onUpdateCookies);
      }
      function mergeMiddlewareCookies(req, existingCookies) {
        if ("x-middleware-set-cookie" in req.headers && "string" == typeof req.headers["x-middleware-set-cookie"]) {
          let setCookieValue = req.headers["x-middleware-set-cookie"], responseHeaders = new Headers();
          for (let cookie of splitCookiesString(setCookieValue)) responseHeaders.append("set-cookie", cookie);
          for (let cookie of new _edge_runtime_cookies.ResponseCookies(responseHeaders).getAll()) existingCookies.set(cookie);
        }
      }
      function createRequestStoreForAPI(req, url, implicitTags, onUpdateCookies, previewProps) {
        return createRequestStoreImpl("action", req, void 0, url, {}, implicitTags, onUpdateCookies, null, previewProps, false, void 0, null);
      }
      function createRequestStoreImpl(phase, req, res, url, rootParams, implicitTags, onUpdateCookies, renderResumeDataCache, previewProps, isHmrRefresh, serverComponentsHmrCache, fallbackParams) {
        function defaultOnUpdateCookies(cookies) {
          res && res.setHeader("Set-Cookie", cookies);
        }
        let cache2 = {};
        return { type: "request", phase, implicitTags, url: { pathname: url.pathname, search: url.search ?? "" }, rootParams, get headers() {
          return cache2.headers || (cache2.headers = getHeaders(req.headers)), cache2.headers;
        }, get cookies() {
          if (!cache2.cookies) {
            let requestCookies = new _edge_runtime_cookies.RequestCookies(headers_HeadersAdapter.from(req.headers));
            mergeMiddlewareCookies(req, requestCookies), cache2.cookies = request_cookies_RequestCookiesAdapter.seal(requestCookies);
          }
          return cache2.cookies;
        }, set cookies(value) {
          cache2.cookies = value;
        }, get mutableCookies() {
          if (!cache2.mutableCookies) {
            let mutableCookies = getMutableCookies(req.headers, onUpdateCookies || (res ? defaultOnUpdateCookies : void 0));
            mergeMiddlewareCookies(req, mutableCookies), cache2.mutableCookies = mutableCookies;
          }
          return cache2.mutableCookies;
        }, get userspaceMutableCookies() {
          return cache2.userspaceMutableCookies || (cache2.userspaceMutableCookies = createCookiesWithMutableAccessCheck(this)), cache2.userspaceMutableCookies;
        }, get draftMode() {
          return cache2.draftMode || (cache2.draftMode = new DraftModeProvider(previewProps, req, this.cookies, this.mutableCookies)), cache2.draftMode;
        }, renderResumeDataCache: renderResumeDataCache ?? null, isHmrRefresh, serverComponentsHmrCache: serverComponentsHmrCache || globalThis.__serverComponentsHmrCache, fallbackParams };
      }
      let workUnitAsyncStorageInstance = async_local_storage_createAsyncLocalStorage();
      function getPrerenderResumeDataCache(workUnitStore) {
        switch (workUnitStore.type) {
          case "prerender":
          case "prerender-runtime":
          case "prerender-ppr":
          case "prerender-client":
          case "validation-client":
            return workUnitStore.prerenderResumeDataCache;
          case "request":
            if (workUnitStore.prerenderResumeDataCache) return workUnitStore.prerenderResumeDataCache;
          case "prerender-legacy":
          case "cache":
          case "private-cache":
          case "unstable-cache":
          case "generate-static-params":
            return null;
          default:
            return workUnitStore;
        }
      }
      function getRenderResumeDataCache(workUnitStore) {
        switch (workUnitStore.type) {
          case "request":
          case "prerender":
          case "prerender-runtime":
          case "prerender-client":
          case "validation-client":
            if (workUnitStore.renderResumeDataCache) return workUnitStore.renderResumeDataCache;
          case "prerender-ppr":
            return workUnitStore.prerenderResumeDataCache ?? null;
          case "cache":
          case "private-cache":
          case "unstable-cache":
          case "prerender-legacy":
          case "generate-static-params":
            return null;
          default:
            return workUnitStore;
        }
      }
      var p_queue = __webpack_require__(232), p_queue_default = __webpack_require__.n(p_queue);
      class lib_invariant_error_InvariantError extends Error {
        constructor(message, options) {
          super(`Invariant: ${message.endsWith(".") ? message : message + "."} This is a bug in Next.js.`, options), this.name = "InvariantError";
        }
      }
      class LRUNode {
        constructor(key, data, size) {
          this.prev = null, this.next = null, this.key = key, this.data = data, this.size = size;
        }
      }
      class SentinelNode {
        constructor() {
          this.prev = null, this.next = null;
        }
      }
      class lru_cache_LRUCache {
        constructor(maxSize, calculateSize, onEvict) {
          this.cache = /* @__PURE__ */ new Map(), this.totalSize = 0, this.maxSize = maxSize, this.calculateSize = calculateSize, this.onEvict = onEvict, this.head = new SentinelNode(), this.tail = new SentinelNode(), this.head.next = this.tail, this.tail.prev = this.head;
        }
        addToHead(node) {
          node.prev = this.head, node.next = this.head.next, this.head.next.prev = node, this.head.next = node;
        }
        removeNode(node) {
          node.prev.next = node.next, node.next.prev = node.prev;
        }
        moveToHead(node) {
          this.removeNode(node), this.addToHead(node);
        }
        removeTail() {
          let lastNode = this.tail.prev;
          return this.removeNode(lastNode), lastNode;
        }
        set(key, value1) {
          let size = (null == this.calculateSize ? void 0 : this.calculateSize.call(this, value1)) ?? 1;
          if (size <= 0) throw Object.defineProperty(Error(`LRUCache: calculateSize returned ${size}, but size must be > 0. Items with size 0 would never be evicted, causing unbounded cache growth.`), "__NEXT_ERROR_CODE", { value: "E1045", enumerable: false, configurable: true });
          if (size > this.maxSize) return console.warn("Single item size exceeds maxSize"), false;
          let existing = this.cache.get(key);
          if (existing) existing.data = value1, this.totalSize = this.totalSize - existing.size + size, existing.size = size, this.moveToHead(existing);
          else {
            let newNode = new LRUNode(key, value1, size);
            this.cache.set(key, newNode), this.addToHead(newNode), this.totalSize += size;
          }
          for (; this.totalSize > this.maxSize && this.cache.size > 0; ) {
            let tail = this.removeTail();
            this.cache.delete(tail.key), this.totalSize -= tail.size, null == this.onEvict || this.onEvict.call(this, tail.key, tail.data);
          }
          return true;
        }
        has(key) {
          return this.cache.has(key);
        }
        get(key) {
          let node = this.cache.get(key);
          if (node) return this.moveToHead(node), node.data;
        }
        *[Symbol.iterator]() {
          let current = this.head.next;
          for (; current && current !== this.tail; ) {
            let node = current;
            yield [node.key, node.data], current = current.next;
          }
        }
        remove(key) {
          let node = this.cache.get(key);
          node && (this.removeNode(node), this.cache.delete(key), this.totalSize -= node.size);
        }
        get size() {
          return this.cache.size;
        }
        get currentSize() {
          return this.totalSize;
        }
      }
      let tags_manifest_external_tagsManifest = /* @__PURE__ */ new Map(), tags_manifest_external_areTagsExpired = (tags, timestamp) => {
        for (let tag of tags) {
          let entry = tags_manifest_external_tagsManifest.get(tag), expiredAt = null == entry ? void 0 : entry.expired;
          if ("number" == typeof expiredAt && expiredAt <= Date.now() && expiredAt > timestamp) return true;
        }
        return false;
      }, tags_manifest_external_areTagsStale = (tags, timestamp) => {
        for (let tag of tags) {
          let entry = tags_manifest_external_tagsManifest.get(tag), staleAt = (null == entry ? void 0 : entry.stale) ?? 0;
          if ("number" == typeof staleAt && staleAt > timestamp) return true;
        }
        return false;
      };
      __webpack_require__(356).Buffer, process.env.NEXT_PRIVATE_DEBUG_CACHE, Symbol.for("@next/cache-handlers");
      let handlersMapSymbol = Symbol.for("@next/cache-handlers-map"), handlersSetSymbol = Symbol.for("@next/cache-handlers-set"), reference = globalThis;
      function getCacheHandlers() {
        if (reference[handlersSetSymbol]) return reference[handlersSetSymbol].values();
      }
      function getCacheHandlerEntries() {
        if (reference[handlersMapSymbol]) return reference[handlersMapSymbol].entries();
      }
      async function withExecuteRevalidates(store, callback) {
        if (!store) return callback();
        let savedRevalidationState = cloneRevalidationState(store);
        try {
          return await callback();
        } finally {
          let newRevalidates = diffRevalidationState(savedRevalidationState, cloneRevalidationState(store));
          await executeRevalidates(store, newRevalidates);
        }
      }
      function cloneRevalidationState(store) {
        return { pendingRevalidatedTags: store.pendingRevalidatedTags ? [...store.pendingRevalidatedTags] : [], pendingRevalidates: { ...store.pendingRevalidates }, pendingRevalidateWrites: store.pendingRevalidateWrites ? [...store.pendingRevalidateWrites] : [] };
      }
      function diffRevalidationState(prev, curr) {
        let prevTagsWithProfile = new Set(prev.pendingRevalidatedTags.map((item) => {
          let profileKey = "object" == typeof item.profile ? JSON.stringify(item.profile) : item.profile || "";
          return `${item.tag}:${profileKey}`;
        })), prevRevalidateWrites = new Set(prev.pendingRevalidateWrites);
        return { pendingRevalidatedTags: curr.pendingRevalidatedTags.filter((item) => {
          let profileKey = "object" == typeof item.profile ? JSON.stringify(item.profile) : item.profile || "";
          return !prevTagsWithProfile.has(`${item.tag}:${profileKey}`);
        }), pendingRevalidates: Object.fromEntries(Object.entries(curr.pendingRevalidates).filter(([key]) => !(key in prev.pendingRevalidates))), pendingRevalidateWrites: curr.pendingRevalidateWrites.filter((promise) => !prevRevalidateWrites.has(promise)) };
      }
      async function revalidateTags(tagsWithProfile, incrementalCache, workStore) {
        if (0 === tagsWithProfile.length) return;
        let handlers = getCacheHandlers(), promises = [], tagsByProfile = /* @__PURE__ */ new Map();
        for (let item of tagsWithProfile) {
          let existingKey, profile = item.profile;
          for (let [key] of tagsByProfile) if ("string" == typeof key && "string" == typeof profile && key === profile || "object" == typeof key && "object" == typeof profile && JSON.stringify(key) === JSON.stringify(profile) || key === profile) {
            existingKey = key;
            break;
          }
          let profileKey = existingKey || profile;
          tagsByProfile.has(profileKey) || tagsByProfile.set(profileKey, []), tagsByProfile.get(profileKey).push(item.tag);
        }
        for (let [profile, tagsForProfile] of tagsByProfile) {
          let durations;
          if (profile) {
            let cacheLife;
            if ("object" == typeof profile) cacheLife = profile;
            else if ("string" == typeof profile) {
              var _workStore_cacheLifeProfiles;
              if (!(cacheLife = null == workStore || null == (_workStore_cacheLifeProfiles = workStore.cacheLifeProfiles) ? void 0 : _workStore_cacheLifeProfiles[profile])) throw Object.defineProperty(Error(`Invalid profile provided "${profile}" must be configured under cacheLife in next.config or be "max"`), "__NEXT_ERROR_CODE", { value: "E873", enumerable: false, configurable: true });
            }
            cacheLife && (durations = { expire: cacheLife.expire });
          }
          for (let handler4 of handlers || []) profile ? promises.push(null == handler4.updateTags ? void 0 : handler4.updateTags.call(handler4, tagsForProfile, durations)) : promises.push(null == handler4.updateTags ? void 0 : handler4.updateTags.call(handler4, tagsForProfile));
          incrementalCache && promises.push(incrementalCache.revalidateTag(tagsForProfile, durations));
        }
        await Promise.all(promises);
      }
      function executeRevalidates(workStore, state) {
        let promises = [], pendingRevalidatedTags = (null == state ? void 0 : state.pendingRevalidatedTags) ?? workStore.pendingRevalidatedTags ?? [];
        return pendingRevalidatedTags.length > 0 && promises.push(revalidateTags(pendingRevalidatedTags, workStore.incrementalCache, workStore)), promises.push(...Object.values((null == state ? void 0 : state.pendingRevalidates) ?? workStore.pendingRevalidates ?? {})), promises.push(...(null == state ? void 0 : state.pendingRevalidateWrites) ?? workStore.pendingRevalidateWrites ?? []), 0 !== promises.length && Promise.all(promises).then(() => void 0);
      }
      let async_local_storage_sharedAsyncLocalStorageNotAvailableError = Object.defineProperty(Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available"), "__NEXT_ERROR_CODE", { value: "E504", enumerable: false, configurable: true });
      class async_local_storage_FakeAsyncLocalStorage {
        disable() {
          throw async_local_storage_sharedAsyncLocalStorageNotAvailableError;
        }
        getStore() {
        }
        run() {
          throw async_local_storage_sharedAsyncLocalStorageNotAvailableError;
        }
        exit() {
          throw async_local_storage_sharedAsyncLocalStorageNotAvailableError;
        }
        enterWith() {
          throw async_local_storage_sharedAsyncLocalStorageNotAvailableError;
        }
        static bind(fn) {
          return fn;
        }
      }
      let async_local_storage_maybeGlobalAsyncLocalStorage = "u" > typeof globalThis && globalThis.AsyncLocalStorage;
      function async_local_storage_bindSnapshot(fn) {
        return async_local_storage_maybeGlobalAsyncLocalStorage ? async_local_storage_maybeGlobalAsyncLocalStorage.bind(fn) : async_local_storage_FakeAsyncLocalStorage.bind(fn);
      }
      function async_local_storage_createSnapshot() {
        return async_local_storage_maybeGlobalAsyncLocalStorage ? async_local_storage_maybeGlobalAsyncLocalStorage.snapshot() : function(fn, ...args) {
          return fn(...args);
        };
      }
      let afterTaskAsyncStorageInstance = async_local_storage_maybeGlobalAsyncLocalStorage ? new async_local_storage_maybeGlobalAsyncLocalStorage() : new async_local_storage_FakeAsyncLocalStorage();
      class AfterContext {
        constructor({ waitUntil, onClose, onTaskError }) {
          this.workUnitStores = /* @__PURE__ */ new Set(), this.waitUntil = waitUntil, this.onClose = onClose, this.onTaskError = onTaskError, this.callbackQueue = new (p_queue_default())(), this.callbackQueue.pause();
        }
        after(task) {
          if (isThenable(task)) this.waitUntil || errorWaitUntilNotAvailable(), this.waitUntil(task.catch((error2) => this.reportTaskError("promise", error2)));
          else if ("function" == typeof task) this.addCallback(task);
          else throw Object.defineProperty(Error("`after()`: Argument must be a promise or a function"), "__NEXT_ERROR_CODE", { value: "E50", enumerable: false, configurable: true });
        }
        addCallback(callback) {
          this.waitUntil || errorWaitUntilNotAvailable();
          let workUnitStore = workUnitAsyncStorageInstance.getStore();
          workUnitStore && this.workUnitStores.add(workUnitStore);
          let afterTaskStore = afterTaskAsyncStorageInstance.getStore(), rootTaskSpawnPhase = afterTaskStore ? afterTaskStore.rootTaskSpawnPhase : null == workUnitStore ? void 0 : workUnitStore.phase;
          this.runCallbacksOnClosePromise || (this.runCallbacksOnClosePromise = this.runCallbacksOnClose(), this.waitUntil(this.runCallbacksOnClosePromise));
          let wrappedCallback = async_local_storage_bindSnapshot(async () => {
            try {
              await afterTaskAsyncStorageInstance.run({ rootTaskSpawnPhase }, () => callback());
            } catch (error2) {
              this.reportTaskError("function", error2);
            }
          });
          this.callbackQueue.add(wrappedCallback);
        }
        async runCallbacksOnClose() {
          return await new Promise((resolve) => this.onClose(resolve)), this.runCallbacks();
        }
        async runCallbacks() {
          if (0 === this.callbackQueue.size) return;
          for (let workUnitStore of this.workUnitStores) workUnitStore.phase = "after";
          let workStore = workAsyncStorageInstance.getStore();
          if (!workStore) throw Object.defineProperty(new lib_invariant_error_InvariantError("Missing workStore in AfterContext.runCallbacks"), "__NEXT_ERROR_CODE", { value: "E547", enumerable: false, configurable: true });
          return withExecuteRevalidates(workStore, () => (this.callbackQueue.start(), this.callbackQueue.onIdle()));
        }
        reportTaskError(taskKind, error2) {
          if (console.error("promise" === taskKind ? "A promise passed to `after()` rejected:" : "An error occurred in a function passed to `after()`:", error2), this.onTaskError) try {
            null == this.onTaskError || this.onTaskError.call(this, error2);
          } catch (handlerError) {
            console.error(Object.defineProperty(new lib_invariant_error_InvariantError("`onTaskError` threw while handling an error thrown from an `after` task", { cause: handlerError }), "__NEXT_ERROR_CODE", { value: "E569", enumerable: false, configurable: true }));
          }
        }
      }
      function errorWaitUntilNotAvailable() {
        throw Object.defineProperty(Error("`after()` will not work correctly, because `waitUntil` is not available in the current environment."), "__NEXT_ERROR_CODE", { value: "E91", enumerable: false, configurable: true });
      }
      function createLazyResult(fn) {
        let pendingResult, result = { then: (onfulfilled, onrejected) => (pendingResult || (pendingResult = Promise.resolve(fn())), pendingResult.then((value1) => {
          result.value = value1;
        }).catch(() => {
        }), pendingResult.then(onfulfilled, onrejected)) };
        return result;
      }
      function createWorkStore({ page: page2, renderOpts, isPrefetchRequest, buildId, deploymentId, previouslyRevalidatedTags, nonce }) {
        let isStaticGeneration = !renderOpts.shouldWaitOnAllReady && !renderOpts.supportsDynamicResponse && !renderOpts.isDraftMode && !renderOpts.isPossibleServerAction, shouldTrackFetchMetrics = isStaticGeneration && (!!process.env.NEXT_DEBUG_BUILD || "1" === process.env.NEXT_SSG_FETCH_METRICS), store = { isStaticGeneration, page: page2, route: normalizeAppPath(page2), incrementalCache: renderOpts.incrementalCache || globalThis.__incrementalCache, cacheLifeProfiles: renderOpts.cacheLifeProfiles, isBuildTimePrerendering: renderOpts.isBuildTimePrerendering, fetchCache: renderOpts.fetchCache, isOnDemandRevalidate: renderOpts.isOnDemandRevalidate, isDraftMode: renderOpts.isDraftMode, isPrefetchRequest, buildId, deploymentId, reactLoadableManifest: (null == renderOpts ? void 0 : renderOpts.reactLoadableManifest) || {}, assetPrefix: (null == renderOpts ? void 0 : renderOpts.assetPrefix) || "", nonce, afterContext: createAfterContext(renderOpts), cacheComponentsEnabled: renderOpts.cacheComponents, previouslyRevalidatedTags, refreshTagsByCacheKind: createRefreshTagsByCacheKind(), runInCleanSnapshot: async_local_storage_createSnapshot(), shouldTrackFetchMetrics, reactServerErrorsByDigest: /* @__PURE__ */ new Map() };
        return renderOpts.store = store, store;
      }
      function createAfterContext(renderOpts) {
        let { waitUntil, onClose, onAfterTaskError } = renderOpts;
        return new AfterContext({ waitUntil, onClose, onTaskError: onAfterTaskError });
      }
      function createRefreshTagsByCacheKind() {
        let refreshTagsByCacheKind = /* @__PURE__ */ new Map(), cacheHandlers = getCacheHandlerEntries();
        if (cacheHandlers) for (let [kind, cacheHandler] of cacheHandlers) "refreshTags" in cacheHandler && refreshTagsByCacheKind.set(kind, createLazyResult(async () => cacheHandler.refreshTags()));
        return refreshTagsByCacheKind;
      }
      class CloseController {
        onClose(callback) {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot subscribe to a closed CloseController"), "__NEXT_ERROR_CODE", { value: "E365", enumerable: false, configurable: true });
          this.target.addEventListener("close", callback), this.listeners++;
        }
        dispatchClose() {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot close a CloseController multiple times"), "__NEXT_ERROR_CODE", { value: "E229", enumerable: false, configurable: true });
          this.listeners > 0 && this.target.dispatchEvent(new Event("close")), this.isClosed = true;
        }
        constructor() {
          this.target = new EventTarget(), this.listeners = 0, this.isClosed = false;
        }
      }
      function getEdgePreviewProps() {
        return { previewModeId: process.env.__NEXT_PREVIEW_MODE_ID || "", previewModeSigningKey: process.env.__NEXT_PREVIEW_MODE_SIGNING_KEY || "", previewModeEncryptionKey: process.env.__NEXT_PREVIEW_MODE_ENCRYPTION_KEY || "" };
      }
      function getBuiltinRequestContext() {
        let ctx = globalThis[NEXT_REQUEST_CONTEXT_SYMBOL];
        return null == ctx ? void 0 : ctx.get();
      }
      let NEXT_REQUEST_CONTEXT_SYMBOL = Symbol.for("@next/request-context"), OUT_OF_CLASS_CHAR = /[^\t\x20-\x7e]/, OUT_OF_CLASS_RUN = /[^\t\x20-\x7e]+/g;
      function encodeCacheTag(tag) {
        return OUT_OF_CLASS_CHAR.test(tag) ? tag.replace(OUT_OF_CLASS_RUN, (run) => encodeURIComponent(run)) : tag;
      }
      function createTagsExpirationsByCacheKind(tags) {
        let expirationsByCacheKind = /* @__PURE__ */ new Map(), cacheHandlers = getCacheHandlerEntries();
        if (cacheHandlers) for (let [kind, cacheHandler] of cacheHandlers) "getExpiration" in cacheHandler && expirationsByCacheKind.set(kind, createLazyResult(async () => cacheHandler.getExpiration(tags)));
        return expirationsByCacheKind;
      }
      async function getImplicitTags(page2, pathname, fallbackRouteParams) {
        let tags = /* @__PURE__ */ new Set();
        for (let tag of ((pathname2) => {
          let derivedTags = ["/layout"];
          if (pathname2.startsWith("/")) {
            let pathnameParts = pathname2.split("/");
            for (let i = 1; i < pathnameParts.length + 1; i++) {
              let curPathname = pathnameParts.slice(0, i).join("/");
              curPathname && (curPathname.endsWith("/page") || curPathname.endsWith("/route") || (curPathname = `${curPathname}${!curPathname.endsWith("/") ? "/" : ""}layout`), derivedTags.push(curPathname));
            }
          }
          return derivedTags;
        })(page2)) tag = encodeCacheTag(`${NEXT_CACHE_IMPLICIT_TAG_ID}${tag}`), tags.add(tag);
        if (pathname && (!fallbackRouteParams || 0 === fallbackRouteParams.size)) {
          let tag = encodeCacheTag(`${NEXT_CACHE_IMPLICIT_TAG_ID}${pathname}`);
          tags.add(tag);
        }
        tags.has(`${NEXT_CACHE_IMPLICIT_TAG_ID}/`) && tags.add(`${NEXT_CACHE_IMPLICIT_TAG_ID}/index`), tags.has(`${NEXT_CACHE_IMPLICIT_TAG_ID}/index`) && tags.add(`${NEXT_CACHE_IMPLICIT_TAG_ID}/`);
        let tagsArray = Array.from(tags);
        return { tags: tagsArray, expirationsByCacheKind: createTagsExpirationsByCacheKind(tagsArray) };
      }
      function isRSCRequestHeader(value1) {
        return "1" === value1;
      }
      let NEXT_REQUEST_META = Symbol.for("NextInternalRequestMeta");
      function setRequestMeta(req, meta) {
        return req[NEXT_REQUEST_META] = meta, meta;
      }
      class NextRequestHint extends request_NextRequest {
        constructor(params) {
          super(params.input, params.init), this.sourcePage = params.page;
        }
        get request() {
          throw Object.defineProperty(new PageSignatureError({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new PageSignatureError({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        waitUntil() {
          throw Object.defineProperty(new PageSignatureError({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      let headersGetter = { keys: (headers) => Array.from(headers.keys()), get: (headers, key) => headers.get(key) ?? void 0 }, propagator = (request, fn) => tracer_getTracer().withPropagatedContext(request.headers, fn, headersGetter), testApisIntercepted = false;
      function ensureTestApisIntercepted() {
        if (!testApisIntercepted && (testApisIntercepted = true, "true" === process.env.NEXT_PRIVATE_TEST_PROXY)) {
          let { interceptTestApis, wrapRequestHandler } = __webpack_require__(987);
          interceptTestApis(), propagator = wrapRequestHandler(propagator);
        }
      }
      async function adapter(params) {
        var _getBuiltinRequestContext, _params_request_nextConfig_experimental_clientParamParsingOrigins, _params_request_nextConfig_experimental, _params_request_nextConfig;
        let response, cookiesFromResponse;
        ensureTestApisIntercepted(), await ensureInstrumentationRegistered();
        let isEdgeRendering = void 0 !== globalThis.__BUILD_MANIFEST;
        params.request.url = app_paths_normalizeRscURL(params.request.url);
        let requestURL = params.bypassNextUrl ? new URL(params.request.url) : new NextURL(params.request.url, { headers: params.request.headers, nextConfig: params.request.nextConfig });
        for (let key of [...requestURL.searchParams.keys()]) {
          let value1 = requestURL.searchParams.getAll(key), normalizedKey = utils_normalizeNextQueryParam(key);
          if (normalizedKey) {
            for (let val of (requestURL.searchParams.delete(normalizedKey), value1)) requestURL.searchParams.append(normalizedKey, val);
            requestURL.searchParams.delete(key);
          }
        }
        let buildId = process.env.__NEXT_BUILD_ID || "";
        "buildId" in requestURL && (buildId = requestURL.buildId || "", requestURL.buildId = "");
        let requestHeaders = utils_fromNodeOutgoingHttpHeaders(params.request.headers), isNextDataRequest = requestHeaders.has("x-nextjs-data"), isRSCRequest = isRSCRequestHeader(requestHeaders.get("rsc"));
        isNextDataRequest && "/index" === requestURL.pathname && (requestURL.pathname = "/");
        let flightHeaders = /* @__PURE__ */ new Map();
        if (!isEdgeRendering) for (let header of FLIGHT_HEADERS) {
          let value1 = requestHeaders.get(header);
          null !== value1 && (flightHeaders.set(header, value1), requestHeaders.delete(header));
        }
        let rscHash = requestURL.searchParams.get(app_router_headers_NEXT_RSC_UNION_QUERY), request = new NextRequestHint({ page: params.page, input: stripInternalSearchParams(requestURL).toString(), init: { body: params.request.body, headers: requestHeaders, method: params.request.method, nextConfig: params.request.nextConfig, signal: params.request.signal } });
        params.request.requestMeta && setRequestMeta(request, params.request.requestMeta), isNextDataRequest && Object.defineProperty(request, "__isData", { enumerable: false, value: true }), !globalThis.__incrementalCacheShared && params.IncrementalCache && (globalThis.__incrementalCache = new params.IncrementalCache({ CurCacheHandler: params.incrementalCacheHandler, minimalMode: true, fetchCacheKeyPrefix: "", dev: false, requestHeaders: params.request.headers, getPrerenderManifest: () => ({ version: -1, routes: {}, dynamicRoutes: {}, notFoundRoutes: [], preview: getEdgePreviewProps() }) }));
        let outerWaitUntil = params.request.waitUntil ?? (null == (_getBuiltinRequestContext = getBuiltinRequestContext()) ? void 0 : _getBuiltinRequestContext.waitUntil), event = new NextFetchEvent({ request, page: params.page, context: outerWaitUntil ? { waitUntil: outerWaitUntil } : void 0 });
        if ((response = await propagator(request, () => {
          if ("/middleware" === params.page || "/src/middleware" === params.page || "/proxy" === params.page || "/src/proxy" === params.page) {
            let waitUntil = event.waitUntil.bind(event), closeController = new CloseController();
            return tracer_getTracer().trace(MiddlewareSpan1.execute, { spanName: `middleware ${request.method}`, attributes: { "http.target": request.nextUrl.pathname, "http.method": request.method } }, async () => {
              try {
                var _params_request_nextConfig_experimental2, _params_request_nextConfig2, _params_request_nextConfig_experimental1, _params_request_nextConfig1;
                let previewProps = getEdgePreviewProps(), implicitTags = await getImplicitTags("/", request.nextUrl.pathname, null), requestStore = createRequestStoreForAPI(request, request.nextUrl, implicitTags, (cookies) => {
                  cookiesFromResponse = cookies;
                }, previewProps), workStore = createWorkStore({ page: "/", renderOpts: { cacheLifeProfiles: null == (_params_request_nextConfig2 = params.request.nextConfig) || null == (_params_request_nextConfig_experimental2 = _params_request_nextConfig2.experimental) ? void 0 : _params_request_nextConfig_experimental2.cacheLife, cacheComponents: false, experimental: { isRoutePPREnabled: false, authInterrupts: !!(null == (_params_request_nextConfig1 = params.request.nextConfig) || null == (_params_request_nextConfig_experimental1 = _params_request_nextConfig1.experimental) ? void 0 : _params_request_nextConfig_experimental1.authInterrupts) }, supportsDynamicResponse: true, waitUntil, onClose: closeController.onClose.bind(closeController), onAfterTaskError: void 0 }, isPrefetchRequest: "1" === request.headers.get(app_router_headers_NEXT_ROUTER_PREFETCH_HEADER), buildId: buildId ?? "", deploymentId: false, previouslyRevalidatedTags: [] });
                return await workAsyncStorageInstance.run(workStore, () => workUnitAsyncStorageInstance.run(requestStore, params.handler, request, event));
              } finally {
                setTimeout(() => {
                  closeController.dispatchClose();
                }, 0);
              }
            });
          }
          return params.handler(request, event);
        })) && !(response instanceof Response)) throw Object.defineProperty(TypeError("Expected an instance of Response to be returned"), "__NEXT_ERROR_CODE", { value: "E567", enumerable: false, configurable: true });
        response && cookiesFromResponse && response.headers.set("set-cookie", cookiesFromResponse);
        let rewrite = null == response ? void 0 : response.headers.get("x-middleware-rewrite");
        if (response && rewrite && (isRSCRequest || !isEdgeRendering)) {
          let destination = new NextURL(rewrite, { forceLocale: true, headers: params.request.headers, nextConfig: params.request.nextConfig });
          isEdgeRendering || destination.host !== request.nextUrl.host || (destination.buildId = buildId || destination.buildId, response.headers.set("x-middleware-rewrite", String(destination)));
          let { url: relativeDestination, isRelative } = parseRelativeURL(destination.toString(), requestURL.toString());
          !isEdgeRendering && isNextDataRequest && response.headers.set("x-nextjs-rewrite", relativeDestination);
          let isAllowedOrigin = !isRelative && (null == (_params_request_nextConfig = params.request.nextConfig) || null == (_params_request_nextConfig_experimental = _params_request_nextConfig.experimental) || null == (_params_request_nextConfig_experimental_clientParamParsingOrigins = _params_request_nextConfig_experimental.clientParamParsingOrigins) ? void 0 : _params_request_nextConfig_experimental_clientParamParsingOrigins.some((origin) => new RegExp(origin).test(destination.origin)));
          isRSCRequest && (isRelative || isAllowedOrigin) && (requestURL.pathname !== destination.pathname && response.headers.set("x-nextjs-rewritten-path", destination.pathname), requestURL.search !== destination.search && response.headers.set("x-nextjs-rewritten-query", destination.search.slice(1)));
        }
        if (response && rewrite && isRSCRequest && rscHash) {
          let rewriteURL = new URL(rewrite);
          rewriteURL.searchParams.has(app_router_headers_NEXT_RSC_UNION_QUERY) || (rewriteURL.searchParams.set(app_router_headers_NEXT_RSC_UNION_QUERY, rscHash), response.headers.set("x-middleware-rewrite", rewriteURL.toString()));
        }
        let redirect = null == response ? void 0 : response.headers.get("Location");
        if (response && redirect && !isEdgeRendering) {
          let redirectURL = new NextURL(redirect, { forceLocale: false, headers: params.request.headers, nextConfig: params.request.nextConfig });
          response = new Response(response.body, response), redirectURL.host === requestURL.host && (redirectURL.buildId = buildId || redirectURL.buildId, response.headers.set("Location", parseRelativeURL(redirectURL, requestURL).url)), isNextDataRequest && (response.headers.delete("Location"), response.headers.set("x-nextjs-redirect", parseRelativeURL(redirectURL.toString(), requestURL.toString()).url));
        }
        let finalResponse = response || NextResponse.next(), middlewareOverrideHeaders = finalResponse.headers.get("x-middleware-override-headers"), overwrittenHeaders = [];
        if (middlewareOverrideHeaders) {
          for (let [key, value1] of flightHeaders) finalResponse.headers.set(`x-middleware-request-${key}`, value1), overwrittenHeaders.push(key);
          overwrittenHeaders.length > 0 && finalResponse.headers.set("x-middleware-override-headers", middlewareOverrideHeaders + "," + overwrittenHeaders.join(","));
        }
        return { response: finalResponse, waitUntil: getWaitUntilPromiseFromEvent(event) ?? Promise.resolve(), fetchMetrics: request.fetchMetrics };
      }
      let { env, stdout } = (null == (_globalThis = globalThis) ? void 0 : _globalThis.process) ?? {}, enabled = env && !env.NO_COLOR && (env.FORCE_COLOR || (null == stdout ? void 0 : stdout.isTTY) && !env.CI && "dumb" !== env.TERM), replaceClose = (str, close, replace, index) => {
        let start = str.substring(0, index) + replace, end = str.substring(index + close.length), nextIndex = end.indexOf(close);
        return ~nextIndex ? start + replaceClose(end, close, replace, nextIndex) : start + end;
      }, formatter = (open, close, replace = open) => enabled ? (input) => {
        let string = "" + input, index = string.indexOf(close, open.length);
        return ~index ? open + replaceClose(string, close, replace, index) + close : open + string + close;
      } : String, bold = formatter("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m");
      formatter("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"), formatter("\x1B[3m", "\x1B[23m"), formatter("\x1B[4m", "\x1B[24m"), formatter("\x1B[7m", "\x1B[27m"), formatter("\x1B[8m", "\x1B[28m"), formatter("\x1B[9m", "\x1B[29m"), formatter("\x1B[30m", "\x1B[39m");
      let red = formatter("\x1B[31m", "\x1B[39m"), green = formatter("\x1B[32m", "\x1B[39m"), yellow = formatter("\x1B[33m", "\x1B[39m");
      formatter("\x1B[34m", "\x1B[39m");
      let magenta = formatter("\x1B[35m", "\x1B[39m");
      formatter("\x1B[38;2;173;127;168m", "\x1B[39m"), formatter("\x1B[36m", "\x1B[39m");
      let white = formatter("\x1B[37m", "\x1B[39m");
      formatter("\x1B[90m", "\x1B[39m"), formatter("\x1B[40m", "\x1B[49m"), formatter("\x1B[41m", "\x1B[49m"), formatter("\x1B[42m", "\x1B[49m"), formatter("\x1B[43m", "\x1B[49m"), formatter("\x1B[44m", "\x1B[49m"), formatter("\x1B[45m", "\x1B[49m"), formatter("\x1B[46m", "\x1B[49m"), formatter("\x1B[47m", "\x1B[49m"), white(bold("\u25CB")), red(bold("\u2A2F")), yellow(bold("\u26A0")), white(bold(" ")), green(bold("\u2713")), magenta(bold("\xBB")), new lru_cache_LRUCache(1e4, (value1) => value1.length), new lru_cache_LRUCache(1e4, (value1) => value1.length);
      var types_CachedRouteKind = ((CachedRouteKind = {}).APP_PAGE = "APP_PAGE", CachedRouteKind.APP_ROUTE = "APP_ROUTE", CachedRouteKind.PAGES = "PAGES", CachedRouteKind.FETCH = "FETCH", CachedRouteKind.REDIRECT = "REDIRECT", CachedRouteKind.IMAGE = "IMAGE", CachedRouteKind), types_IncrementalCacheKind = ((IncrementalCacheKind = {}).APP_PAGE = "APP_PAGE", IncrementalCacheKind.APP_ROUTE = "APP_ROUTE", IncrementalCacheKind.PAGES = "PAGES", IncrementalCacheKind.FETCH = "FETCH", IncrementalCacheKind.IMAGE = "IMAGE", IncrementalCacheKind);
      function voidCatch() {
      }
      new Uint8Array([60, 104, 116, 109, 108]), new Uint8Array([60, 104, 101, 97, 100]), new Uint8Array([60, 98, 111, 100, 121]), new Uint8Array([60, 47, 104, 101, 97, 100, 62]), new Uint8Array([60, 47, 98, 111, 100, 121, 62]), new Uint8Array([60, 47, 104, 116, 109, 108, 62]), new Uint8Array([60, 47, 98, 111, 100, 121, 62, 60, 47, 104, 116, 109, 108, 62]), new Uint8Array([60, 109, 101, 116, 97, 32, 110, 97, 109, 101, 61, 34, 194, 171, 110, 120, 116, 45, 105, 99, 111, 110, 194, 187, 34]), __webpack_require__(356).Buffer, new TextEncoder(), __webpack_require__(356).Buffer;
      let encoder = new TextEncoder();
      function chainStreams(...streams) {
        if (0 === streams.length) return new ReadableStream({ start(controller) {
          controller.close();
        } });
        if (1 === streams.length) return streams[0];
        let { readable, writable } = new TransformStream(), promise = streams[0].pipeTo(writable, { preventClose: true }), i = 1;
        for (; i < streams.length - 1; i++) {
          let nextStream = streams[i];
          promise = promise.then(() => nextStream.pipeTo(writable, { preventClose: true }));
        }
        let lastStream = streams[i];
        return (promise = promise.then(() => lastStream.pipeTo(writable))).catch(voidCatch), readable;
      }
      function streamFromString(str) {
        return new ReadableStream({ start(controller) {
          controller.enqueue(encoder.encode(str)), controller.close();
        } });
      }
      function streamFromBuffer(chunk) {
        return new ReadableStream({ start(controller) {
          controller.enqueue(chunk), controller.close();
        } });
      }
      async function streamToString(stream, signal) {
        let decoder = new TextDecoder("utf-8", { fatal: true }), string = "";
        for await (let chunk of stream) {
          if (null == signal ? void 0 : signal.aborted) return string;
          string += decoder.decode(chunk, { stream: true });
        }
        return string + decoder.decode();
      }
      let ResponseAbortedName = "ResponseAborted";
      class ResponseAborted extends Error {
        constructor(...args) {
          super(...args), this.name = ResponseAbortedName;
        }
      }
      function createAbortController(response) {
        let controller = new AbortController();
        return response.once("close", () => {
          response.writableFinished || controller.abort(new ResponseAborted());
        }), controller;
      }
      class detached_promise_DetachedPromise {
        constructor() {
          let resolve, reject;
          this.promise = new Promise((res, rej) => {
            resolve = res, reject = rej;
          }), this.resolve = resolve, this.reject = reject;
        }
      }
      let clientComponentLoadStart = 0, clientComponentLoadTimes = 0, clientComponentLoadCount = 0;
      function getClientComponentLoaderMetrics(options = {}) {
        let metrics = 0 === clientComponentLoadStart ? void 0 : { clientComponentLoadStart, clientComponentLoadTimes, clientComponentLoadCount };
        return options.reset && (clientComponentLoadStart = 0, clientComponentLoadTimes = 0, clientComponentLoadCount = 0), metrics;
      }
      function isAbortError(e) {
        return (null == e ? void 0 : e.name) === "AbortError" || (null == e ? void 0 : e.name) === ResponseAbortedName;
      }
      function createWriterFromResponse(res, waitUntilForEnd) {
        let started = false, drained = new detached_promise_DetachedPromise();
        function onDrain() {
          drained.resolve();
        }
        res.on("drain", onDrain), res.once("close", () => {
          res.off("drain", onDrain), drained.resolve();
        });
        let finished = new detached_promise_DetachedPromise();
        return res.once("finish", () => {
          finished.resolve();
        }), new WritableStream({ write: async (chunk) => {
          if (!started) {
            if (started = true, "performance" in globalThis && process.env.NEXT_OTEL_PERFORMANCE_PREFIX) {
              let metrics = getClientComponentLoaderMetrics();
              metrics && performance.measure(`${process.env.NEXT_OTEL_PERFORMANCE_PREFIX}:next-client-component-loading`, { start: metrics.clientComponentLoadStart, end: metrics.clientComponentLoadStart + metrics.clientComponentLoadTimes });
            }
            res.flushHeaders(), tracer_getTracer().trace(NextNodeServerSpan1.startResponse, { spanName: "start response" }, () => void 0);
          }
          try {
            let ok = res.write(chunk);
            "flush" in res && "function" == typeof res.flush && res.flush(), ok || (await drained.promise, drained = new detached_promise_DetachedPromise());
          } catch (err) {
            throw res.end(), Object.defineProperty(Error("failed to write chunk to response", { cause: err }), "__NEXT_ERROR_CODE", { value: "E321", enumerable: false, configurable: true });
          }
        }, abort: (err) => {
          res.writableFinished || res.destroy(err);
        }, close: async () => {
          if (waitUntilForEnd && await waitUntilForEnd, !res.writableFinished) return res.end(), finished.promise;
        } });
      }
      async function pipeToNodeResponse(readable, res, waitUntilForEnd) {
        try {
          let { errored, destroyed } = res;
          if (errored || destroyed) return;
          let controller = createAbortController(res), writer = createWriterFromResponse(res, waitUntilForEnd);
          await readable.pipeTo(writer, { signal: controller.signal });
        } catch (err) {
          if (isAbortError(err)) return;
          throw Object.defineProperty(Error("failed to pipe response", { cause: err }), "__NEXT_ERROR_CODE", { value: "E180", enumerable: false, configurable: true });
        }
      }
      var render_result_Buffer = __webpack_require__(356).Buffer;
      class render_result_RenderResult {
        static #_ = this.EMPTY = new render_result_RenderResult(null, { metadata: {}, contentType: null });
        static fromStatic(value1, contentType) {
          return new render_result_RenderResult(value1, { metadata: {}, contentType });
        }
        constructor(response, { contentType, waitUntil, metadata }) {
          this.response = response, this.contentType = contentType, this.metadata = metadata, this.waitUntil = waitUntil;
        }
        assignMetadata(metadata) {
          Object.assign(this.metadata, metadata);
        }
        get isNull() {
          return null === this.response;
        }
        get isDynamic() {
          return "string" != typeof this.response;
        }
        toUnchunkedString(stream = false) {
          if (null === this.response) return "";
          if ("string" != typeof this.response) {
            if (!stream) throw Object.defineProperty(new lib_invariant_error_InvariantError("dynamic responses cannot be unchunked. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E732", enumerable: false, configurable: true });
            return streamToString(this.readable);
          }
          return this.response;
        }
        get readable() {
          return null === this.response ? new ReadableStream({ start(controller) {
            controller.close();
          } }) : "string" == typeof this.response ? streamFromString(this.response) : render_result_Buffer.isBuffer(this.response) ? streamFromBuffer(this.response) : Array.isArray(this.response) ? chainStreams(...this.response) : this.response;
        }
        coerce() {
          return null === this.response ? [] : "string" == typeof this.response ? [streamFromString(this.response)] : Array.isArray(this.response) ? this.response : render_result_Buffer.isBuffer(this.response) ? [streamFromBuffer(this.response)] : [this.response];
        }
        pipeThrough(transform) {
          this.response = this.readable.pipeThrough(transform);
        }
        unshift(readable) {
          this.response = this.coerce(), this.response.unshift(readable);
        }
        push(readable) {
          this.response = this.coerce(), this.response.push(readable);
        }
        async pipeTo(writable) {
          try {
            await this.readable.pipeTo(writable, { preventClose: true }), this.waitUntil && await this.waitUntil, await writable.close();
          } catch (err) {
            if (isAbortError(err)) return void await writable.abort(err);
            throw err;
          }
        }
        async pipeToNodeResponse(res) {
          await pipeToNodeResponse(this.readable, res, this.waitUntil);
        }
      }
      function parsePositiveInt(envValue, fallback) {
        if (!envValue) return fallback;
        let parsed = parseInt(envValue, 10);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
      }
      parsePositiveInt(process.env.NEXT_PRIVATE_RESPONSE_CACHE_TTL, 1e4), parsePositiveInt(process.env.NEXT_PRIVATE_RESPONSE_CACHE_MAX_SIZE, 150);
      var path3 = __webpack_require__(654), path_default = __webpack_require__.n(path3);
      class MultiFileWriter {
        constructor(fs) {
          this.fs = fs, this.tasks = [];
        }
        findOrCreateTask(directory) {
          for (let task2 of this.tasks) if (task2[0] === directory) return task2;
          let promise = this.fs.mkdir(directory);
          promise.catch(() => {
          });
          let task = [directory, promise, []];
          return this.tasks.push(task), task;
        }
        append(filePath, data) {
          let task = this.findOrCreateTask(path_default().dirname(filePath)), promise = task[1].then(() => this.fs.writeFile(filePath, data));
          promise.catch(() => {
          }), task[2].push(promise);
        }
        wait() {
          return Promise.all(this.tasks.flatMap((task) => task[2]));
        }
      }
      function getBufferSize(buffer) {
        return (null == buffer ? void 0 : buffer.length) || 0;
      }
      function getSegmentDataSize(segmentData) {
        if (!segmentData) return 0;
        let size = 0;
        for (let [segmentPath, buffer] of segmentData) size += segmentPath.length + getBufferSize(buffer);
        return size;
      }
      function getMemoryCache(maxMemoryCacheSize) {
        return memoryCache || (memoryCache = new lru_cache_LRUCache(maxMemoryCacheSize, function length({ value: value1 }) {
          var _JSON_stringify, _value_postponed;
          if (!value1) return 25;
          if (value1.kind === types_CachedRouteKind.REDIRECT) return JSON.stringify(value1.props).length;
          if (value1.kind === types_CachedRouteKind.IMAGE) throw Object.defineProperty(Error("invariant image should not be incremental-cache"), "__NEXT_ERROR_CODE", { value: "E501", enumerable: false, configurable: true });
          if (value1.kind === types_CachedRouteKind.FETCH) return JSON.stringify(value1.data || "").length;
          if (value1.kind === types_CachedRouteKind.APP_ROUTE) return value1.body.length;
          return value1.kind === types_CachedRouteKind.APP_PAGE ? Math.max(1, value1.html.length + getBufferSize(value1.rscData) + ((null == (_value_postponed = value1.postponed) ? void 0 : _value_postponed.length) || 0) + getSegmentDataSize(value1.segmentData)) : value1.html.length + ((null == (_JSON_stringify = JSON.stringify(value1.pageData)) ? void 0 : _JSON_stringify.length) || 0);
        })), memoryCache;
      }
      class FileSystemCache {
        static #_ = this.debug = !!process.env.NEXT_PRIVATE_DEBUG_CACHE;
        constructor(ctx) {
          this.fs = ctx.fs, this.flushToDisk = ctx.flushToDisk, this.serverDistDir = ctx.serverDistDir, this.revalidatedTags = ctx.revalidatedTags, ctx.maxMemoryCacheSize ? FileSystemCache.memoryCache ? FileSystemCache.debug && console.log("FileSystemCache: memory store already initialized") : (FileSystemCache.debug && console.log("FileSystemCache: using memory store for fetch cache"), FileSystemCache.memoryCache = getMemoryCache(ctx.maxMemoryCacheSize)) : FileSystemCache.debug && console.log("FileSystemCache: not using memory store for fetch cache");
        }
        resetRequestCache() {
        }
        async revalidateTag(tags, durations) {
          if (tags = "string" == typeof tags ? [tags] : tags, FileSystemCache.debug && console.log("FileSystemCache: revalidateTag", tags, durations), 0 === tags.length) return;
          let now = Date.now();
          for (let tag of tags) {
            let existingEntry = tags_manifest_external_tagsManifest.get(tag) || {};
            if (durations) {
              let updates = { ...existingEntry };
              updates.stale = now, void 0 !== durations.expire && (updates.expired = now + 1e3 * durations.expire), tags_manifest_external_tagsManifest.set(tag, updates);
            } else tags_manifest_external_tagsManifest.set(tag, { ...existingEntry, expired: now });
          }
        }
        async get(...args) {
          var _FileSystemCache_memoryCache, _data_value, _data_value1, _data_value2, _data_value3, _data_value_headers;
          let [key, ctx] = args, { kind } = ctx, data = null == (_FileSystemCache_memoryCache = FileSystemCache.memoryCache) ? void 0 : _FileSystemCache_memoryCache.get(key);
          if (FileSystemCache.debug && (kind === types_IncrementalCacheKind.FETCH ? console.log("FileSystemCache: get", key, ctx.tags, kind, !!data) : console.log("FileSystemCache: get", key, kind, !!data)), (null == data || null == (_data_value = data.value) ? void 0 : _data_value.kind) === types_CachedRouteKind.APP_PAGE || (null == data || null == (_data_value1 = data.value) ? void 0 : _data_value1.kind) === types_CachedRouteKind.APP_ROUTE || (null == data || null == (_data_value2 = data.value) ? void 0 : _data_value2.kind) === types_CachedRouteKind.PAGES) {
            let tagsHeader = null == (_data_value_headers = data.value.headers) ? void 0 : _data_value_headers[NEXT_CACHE_TAGS_HEADER];
            if ("string" == typeof tagsHeader) {
              let cacheTags = tagsHeader.split(",");
              if (cacheTags.length > 0 && tags_manifest_external_areTagsExpired(cacheTags, data.lastModified)) return FileSystemCache.debug && console.log("FileSystemCache: expired tags", cacheTags), null;
            }
          } else if ((null == data || null == (_data_value3 = data.value) ? void 0 : _data_value3.kind) === types_CachedRouteKind.FETCH) {
            let combinedTags = ctx.kind === types_IncrementalCacheKind.FETCH ? [...ctx.tags || [], ...ctx.softTags || []] : [];
            if (combinedTags.some((tag) => this.revalidatedTags.includes(tag))) return FileSystemCache.debug && console.log("FileSystemCache: was revalidated", combinedTags), null;
            if (tags_manifest_external_areTagsExpired(combinedTags, data.lastModified)) return FileSystemCache.debug && console.log("FileSystemCache: expired tags", combinedTags), null;
          }
          return data ?? null;
        }
        async set(key, data, ctx) {
          var _FileSystemCache_memoryCache;
          if (null == (_FileSystemCache_memoryCache = FileSystemCache.memoryCache) || _FileSystemCache_memoryCache.set(key, { value: data, lastModified: Date.now() }), FileSystemCache.debug && console.log("FileSystemCache: set", key), !this.flushToDisk || !data) return;
          let writer = new MultiFileWriter(this.fs);
          if (data.kind === types_CachedRouteKind.APP_ROUTE) {
            let filePath = this.getFilePath(`${key}.body`, types_IncrementalCacheKind.APP_ROUTE);
            writer.append(filePath, data.body);
            let meta = { headers: data.headers, status: data.status, postponed: void 0, segmentPaths: void 0, prefetchHints: void 0 };
            writer.append(filePath.replace(/\.body$/, NEXT_META_SUFFIX), JSON.stringify(meta, null, 2));
          } else if (data.kind === types_CachedRouteKind.PAGES || data.kind === types_CachedRouteKind.APP_PAGE) {
            let isAppPath = data.kind === types_CachedRouteKind.APP_PAGE, htmlPath = this.getFilePath(`${key}.html`, isAppPath ? types_IncrementalCacheKind.APP_PAGE : types_IncrementalCacheKind.PAGES);
            if (writer.append(htmlPath, data.html), ctx.fetchCache || ctx.isFallback || ctx.isRoutePPREnabled || writer.append(this.getFilePath(`${key}${isAppPath ? ".rsc" : ".json"}`, isAppPath ? types_IncrementalCacheKind.APP_PAGE : types_IncrementalCacheKind.PAGES), isAppPath ? data.rscData : JSON.stringify(data.pageData)), (null == data ? void 0 : data.kind) === types_CachedRouteKind.APP_PAGE) {
              let segmentPaths;
              if (data.segmentData) {
                segmentPaths = [];
                let segmentsDir = htmlPath.replace(/\.html$/, ".segments");
                for (let [segmentPath, buffer] of data.segmentData) {
                  segmentPaths.push(segmentPath);
                  let segmentDataFilePath = segmentsDir + segmentPath + ".segment.rsc";
                  writer.append(segmentDataFilePath, buffer);
                }
              }
              let meta = { headers: data.headers, status: data.status, postponed: data.postponed, segmentPaths, prefetchHints: void 0 };
              writer.append(htmlPath.replace(/\.html$/, NEXT_META_SUFFIX), JSON.stringify(meta));
            }
          } else if (data.kind === types_CachedRouteKind.FETCH) {
            let filePath = this.getFilePath(key, types_IncrementalCacheKind.FETCH);
            writer.append(filePath, JSON.stringify({ ...data, tags: ctx.fetchCache ? ctx.tags : [] }));
          }
          await writer.wait();
        }
        getFilePath(pathname, kind) {
          switch (kind) {
            case types_IncrementalCacheKind.FETCH:
              return path_default().join(this.serverDistDir, "..", "cache", "fetch-cache", pathname);
            case types_IncrementalCacheKind.PAGES:
              return path_default().join(this.serverDistDir, "pages", pathname);
            case types_IncrementalCacheKind.IMAGE:
            case types_IncrementalCacheKind.APP_PAGE:
            case types_IncrementalCacheKind.APP_ROUTE:
              return path_default().join(this.serverDistDir, "app", pathname);
            default:
              throw Object.defineProperty(Error(`Unexpected file path kind: ${kind}`), "__NEXT_ERROR_CODE", { value: "E479", enumerable: false, configurable: true });
          }
        }
      }
      let interception_routes_INTERCEPTION_ROUTE_MARKERS = ["(..)(..)", "(.)", "(..)", "(...)"];
      function interception_routes_isInterceptionRouteAppPath(path4) {
        return void 0 !== path4.split("/").find((segment) => interception_routes_INTERCEPTION_ROUTE_MARKERS.find((m) => segment.startsWith(m)));
      }
      function extractInterceptionRouteInformation(path4) {
        let interceptingRoute, marker, interceptedRoute;
        for (let segment of path4.split("/")) if (marker = interception_routes_INTERCEPTION_ROUTE_MARKERS.find((m) => segment.startsWith(m))) {
          [interceptingRoute, interceptedRoute] = path4.split(marker, 2);
          break;
        }
        if (!interceptingRoute || !marker || !interceptedRoute) throw Object.defineProperty(Error(`Invalid interception route: ${path4}. Must be in the format /<intercepting route>/(..|...|..)(..)/<intercepted route>`), "__NEXT_ERROR_CODE", { value: "E269", enumerable: false, configurable: true });
        switch (interceptingRoute = normalizeAppPath(interceptingRoute), marker) {
          case "(.)":
            interceptedRoute = "/" === interceptingRoute ? `/${interceptedRoute}` : interceptingRoute + "/" + interceptedRoute;
            break;
          case "(..)":
            if ("/" === interceptingRoute) throw Object.defineProperty(Error(`Invalid interception route: ${path4}. Cannot use (..) marker at the root level, use (.) instead.`), "__NEXT_ERROR_CODE", { value: "E207", enumerable: false, configurable: true });
            interceptedRoute = interceptingRoute.split("/").slice(0, -1).concat(interceptedRoute).join("/");
            break;
          case "(...)":
            interceptedRoute = "/" + interceptedRoute;
            break;
          case "(..)(..)":
            let splitInterceptingRoute = interceptingRoute.split("/");
            if (splitInterceptingRoute.length <= 2) throw Object.defineProperty(Error(`Invalid interception route: ${path4}. Cannot use (..)(..) marker at the root level or one level up.`), "__NEXT_ERROR_CODE", { value: "E486", enumerable: false, configurable: true });
            interceptedRoute = splitInterceptingRoute.slice(0, -2).concat(interceptedRoute).join("/");
            break;
          default:
            throw Object.defineProperty(Error("Invariant: unexpected marker"), "__NEXT_ERROR_CODE", { value: "E112", enumerable: false, configurable: true });
        }
        return { interceptingRoute, interceptedRoute };
      }
      let TEST_ROUTE = /\/[^/]*\[[^/]+\][^/]*(?=\/|$)/, TEST_STRICT_ROUTE = /\/\[[^/]+\](?=\/|$)/;
      function isDynamicRoute(route, strict = true) {
        return (interception_routes_isInterceptionRouteAppPath(route) && (route = extractInterceptionRouteInformation(route).interceptedRoute), strict) ? TEST_STRICT_ROUTE.test(route) : TEST_ROUTE.test(route);
      }
      function normalizePagePath(page2) {
        return /^\/index(\/|$)/.test(page2) && !isDynamicRoute(page2) ? `/index${page2}` : "/" === page2 ? "/index" : ensureLeadingSlash(page2);
      }
      function toRoute(pathname) {
        return pathname.replace(/(?:\/index)?\/?$/, "") || "/";
      }
      "u" > typeof performance && ["mark", "measure", "getEntriesByName"].every((method) => "function" == typeof performance[method]);
      class SharedCacheControls {
        static #_ = this.cacheControls = /* @__PURE__ */ new Map();
        constructor(prerenderManifest) {
          this.prerenderManifest = prerenderManifest;
        }
        get(route) {
          let cacheControl = SharedCacheControls.cacheControls.get(route);
          if (cacheControl) return cacheControl;
          let prerenderData = this.prerenderManifest.routes[route];
          if (prerenderData) {
            let { initialRevalidateSeconds, initialExpireSeconds } = prerenderData;
            if (void 0 !== initialRevalidateSeconds) return { revalidate: initialRevalidateSeconds, expire: initialExpireSeconds };
          }
          let dynamicPrerenderData = this.prerenderManifest.dynamicRoutes[route];
          if (dynamicPrerenderData) {
            let { fallbackRevalidate, fallbackExpire } = dynamicPrerenderData;
            if (void 0 !== fallbackRevalidate) return { revalidate: fallbackRevalidate, expire: fallbackExpire };
          }
        }
        set(route, cacheControl) {
          SharedCacheControls.cacheControls.set(route, cacheControl);
        }
        clear() {
          SharedCacheControls.cacheControls.clear();
        }
      }
      function getPreviouslyRevalidatedTags(headers, previewModeId) {
        return "string" == typeof headers[NEXT_CACHE_REVALIDATED_TAGS_HEADER] && headers["x-next-revalidate-tag-token"] === previewModeId ? headers[NEXT_CACHE_REVALIDATED_TAGS_HEADER].split(",") : [];
      }
      __webpack_require__(259);
      class IncrementalCache {
        static #_ = this.debug = !!process.env.NEXT_PRIVATE_DEBUG_CACHE;
        constructor({ fs, dev, flushToDisk, minimalMode, serverDistDir, requestHeaders, maxMemoryCacheSize, getPrerenderManifest, fetchCacheKeyPrefix, CurCacheHandler, allowedRevalidateHeaderKeys }) {
          var _this_prerenderManifest_preview, _this_prerenderManifest, _this_prerenderManifest_preview1, _this_prerenderManifest1;
          this.locks = /* @__PURE__ */ new Map(), this.hasCustomCacheHandler = !!CurCacheHandler;
          const cacheHandlersSymbol = Symbol.for("@next/cache-handlers"), _globalThis2 = globalThis;
          if (CurCacheHandler) IncrementalCache.debug && console.log("IncrementalCache: using custom cache handler", CurCacheHandler.name);
          else {
            const globalCacheHandler = _globalThis2[cacheHandlersSymbol];
            (null == globalCacheHandler ? void 0 : globalCacheHandler.FetchCache) ? (CurCacheHandler = globalCacheHandler.FetchCache, IncrementalCache.debug && console.log("IncrementalCache: using global FetchCache cache handler")) : fs && serverDistDir && (IncrementalCache.debug && console.log("IncrementalCache: using filesystem cache handler"), CurCacheHandler = FileSystemCache);
          }
          process.env.__NEXT_TEST_MAX_ISR_CACHE && (maxMemoryCacheSize = parseInt(process.env.__NEXT_TEST_MAX_ISR_CACHE, 10)), this.dev = dev, this.disableForTestmode = "true" === process.env.NEXT_PRIVATE_TEST_PROXY, this.minimalMode = minimalMode, this.requestHeaders = requestHeaders, this.allowedRevalidateHeaderKeys = allowedRevalidateHeaderKeys, this.prerenderManifest = getPrerenderManifest(), this.cacheControls = new SharedCacheControls(this.prerenderManifest), this.fetchCacheKeyPrefix = fetchCacheKeyPrefix;
          let revalidatedTags = [];
          requestHeaders[PRERENDER_REVALIDATE_HEADER] === (null == (_this_prerenderManifest = this.prerenderManifest) || null == (_this_prerenderManifest_preview = _this_prerenderManifest.preview) ? void 0 : _this_prerenderManifest_preview.previewModeId) && (this.isOnDemandRevalidate = true), minimalMode && (revalidatedTags = this.revalidatedTags = getPreviouslyRevalidatedTags(requestHeaders, null == (_this_prerenderManifest1 = this.prerenderManifest) || null == (_this_prerenderManifest_preview1 = _this_prerenderManifest1.preview) ? void 0 : _this_prerenderManifest_preview1.previewModeId)), CurCacheHandler && (this.cacheHandler = new CurCacheHandler({ dev, fs, flushToDisk, serverDistDir, revalidatedTags, maxMemoryCacheSize, _requestHeaders: requestHeaders, fetchCacheKeyPrefix }));
        }
        calculateRevalidate(pathname, fromTime, dev, isFallback) {
          if (dev) return Math.floor(performance.timeOrigin + performance.now() - 1e3);
          let cacheControl = this.cacheControls.get(toRoute(pathname)), initialRevalidateSeconds = cacheControl ? cacheControl.revalidate : !isFallback && 1;
          return "number" == typeof initialRevalidateSeconds ? 1e3 * initialRevalidateSeconds + fromTime : initialRevalidateSeconds;
        }
        _getPathname(pathname, fetchCache) {
          return fetchCache ? pathname : normalizePagePath(pathname);
        }
        resetRequestCache() {
          var _this_cacheHandler_resetRequestCache, _this_cacheHandler;
          null == (_this_cacheHandler = this.cacheHandler) || null == (_this_cacheHandler_resetRequestCache = _this_cacheHandler.resetRequestCache) || _this_cacheHandler_resetRequestCache.call(_this_cacheHandler);
        }
        async lock(cacheKey) {
          for (; ; ) {
            let lock = this.locks.get(cacheKey);
            if (IncrementalCache.debug && console.log("IncrementalCache: lock get", cacheKey, !!lock), !lock) break;
            await lock;
          }
          let { resolve, promise } = new detached_promise_DetachedPromise();
          return IncrementalCache.debug && console.log("IncrementalCache: successfully locked", cacheKey), this.locks.set(cacheKey, promise), () => {
            resolve(), this.locks.delete(cacheKey);
          };
        }
        async revalidateTag(tags, durations) {
          var _this_cacheHandler;
          return null == (_this_cacheHandler = this.cacheHandler) ? void 0 : _this_cacheHandler.revalidateTag(tags, durations);
        }
        async generateCacheKey(url, init = {}) {
          let bodyChunks = [], encoder2 = new TextEncoder(), decoder = new TextDecoder();
          if (init.body) if (init.body instanceof Uint8Array) bodyChunks.push(decoder.decode(init.body)), init._ogBody = init.body;
          else if ("function" == typeof init.body.getReader) {
            let readableBody = init.body, chunks = [];
            try {
              await readableBody.pipeTo(new WritableStream({ write(chunk) {
                "string" == typeof chunk ? (chunks.push(encoder2.encode(chunk)), bodyChunks.push(chunk)) : (chunks.push(chunk), bodyChunks.push(decoder.decode(chunk, { stream: true })));
              } })), bodyChunks.push(decoder.decode());
              let length = chunks.reduce((total, arr) => total + arr.length, 0), arrayBuffer = new Uint8Array(length), offset = 0;
              for (let chunk of chunks) arrayBuffer.set(chunk, offset), offset += chunk.length;
              init._ogBody = arrayBuffer;
            } catch (err) {
              console.error("Problem reading body", err);
            }
          } else if ("function" == typeof init.body.keys) {
            let formData = init.body;
            for (let key of (init._ogBody = init.body, /* @__PURE__ */ new Set([...formData.keys()]))) {
              let values = formData.getAll(key);
              bodyChunks.push(`${key}=${(await Promise.all(values.map(async (val) => "string" == typeof val ? val : await val.text()))).join(",")}`);
            }
          } else if ("function" == typeof init.body.arrayBuffer) {
            let blob = init.body, arrayBuffer = await blob.arrayBuffer();
            bodyChunks.push(await blob.text()), init._ogBody = new Blob([arrayBuffer], { type: blob.type });
          } else "string" == typeof init.body && (bodyChunks.push(init.body), init._ogBody = init.body);
          let headers = "function" == typeof (init.headers || {}).keys ? Object.fromEntries(init.headers) : Object.assign({}, init.headers);
          "traceparent" in headers && delete headers.traceparent, "tracestate" in headers && delete headers.tracestate;
          let cacheString = JSON.stringify(["v3", this.fetchCacheKeyPrefix || "", url, init.method, headers, init.mode, init.redirect, init.credentials, init.referrer, init.referrerPolicy, init.integrity, init.cache, bodyChunks]);
          {
            let bufferToHex = function(buffer2) {
              return Array.prototype.map.call(new Uint8Array(buffer2), (b) => b.toString(16).padStart(2, "0")).join("");
            };
            let buffer = encoder2.encode(cacheString);
            return bufferToHex(await crypto.subtle.digest("SHA-256", buffer));
          }
        }
        async get(cacheKey, ctx) {
          var _this_cacheHandler, _cacheData_value, _cacheData_value1, _cacheData_value2, _cacheData_value3, _cacheData_value4, _cacheData_value_headers;
          let isStale2, revalidateAfter;
          if (ctx.kind === types_IncrementalCacheKind.FETCH) {
            let workUnitStore = workUnitAsyncStorageInstance.getStore(), resumeDataCache = workUnitStore ? getRenderResumeDataCache(workUnitStore) : null;
            if (resumeDataCache) {
              let memoryCacheData = resumeDataCache.fetch.get(cacheKey);
              if ((null == memoryCacheData ? void 0 : memoryCacheData.kind) === types_CachedRouteKind.FETCH) {
                let workStore = workAsyncStorageInstance.getStore();
                if (![...ctx.tags || [], ...ctx.softTags || []].some((tag) => {
                  var _this_revalidatedTags, _workStore_pendingRevalidatedTags;
                  return (null == (_this_revalidatedTags = this.revalidatedTags) ? void 0 : _this_revalidatedTags.includes(tag)) || (null == workStore || null == (_workStore_pendingRevalidatedTags = workStore.pendingRevalidatedTags) ? void 0 : _workStore_pendingRevalidatedTags.some((item) => item.tag === tag));
                })) return IncrementalCache.debug && console.log("IncrementalCache: rdc:hit", cacheKey), { isStale: false, value: memoryCacheData };
                IncrementalCache.debug && console.log("IncrementalCache: rdc:revalidated-tag", cacheKey);
              } else IncrementalCache.debug && console.log("IncrementalCache: rdc:miss", cacheKey);
            } else IncrementalCache.debug && console.log("IncrementalCache: rdc:no-resume-data");
          }
          if (this.disableForTestmode || this.dev && (ctx.kind !== types_IncrementalCacheKind.FETCH || "no-cache" === this.requestHeaders["cache-control"])) return null;
          cacheKey = this._getPathname(cacheKey, ctx.kind === types_IncrementalCacheKind.FETCH);
          let cacheData = await (null == (_this_cacheHandler = this.cacheHandler) ? void 0 : _this_cacheHandler.get(cacheKey, ctx));
          if (ctx.kind === types_IncrementalCacheKind.FETCH) {
            if (!cacheData) return null;
            if ((null == (_cacheData_value1 = cacheData.value) ? void 0 : _cacheData_value1.kind) !== types_CachedRouteKind.FETCH) throw Object.defineProperty(new lib_invariant_error_InvariantError(`Expected cached value for cache key ${JSON.stringify(cacheKey)} to be a "FETCH" kind, got ${JSON.stringify(null == (_cacheData_value2 = cacheData.value) ? void 0 : _cacheData_value2.kind)} instead.`), "__NEXT_ERROR_CODE", { value: "E653", enumerable: false, configurable: true });
            let workStore = workAsyncStorageInstance.getStore(), combinedTags = [...ctx.tags || [], ...ctx.softTags || []];
            if (combinedTags.some((tag) => {
              var _this_revalidatedTags, _workStore_pendingRevalidatedTags;
              return (null == (_this_revalidatedTags = this.revalidatedTags) ? void 0 : _this_revalidatedTags.includes(tag)) || (null == workStore || null == (_workStore_pendingRevalidatedTags = workStore.pendingRevalidatedTags) ? void 0 : _workStore_pendingRevalidatedTags.some((item) => item.tag === tag));
            })) return IncrementalCache.debug && console.log("IncrementalCache: expired tag", cacheKey), null;
            let workUnitStore = workUnitAsyncStorageInstance.getStore();
            if (workUnitStore) {
              let prerenderResumeDataCache = getPrerenderResumeDataCache(workUnitStore);
              prerenderResumeDataCache && (IncrementalCache.debug && console.log("IncrementalCache: rdc:set", cacheKey), prerenderResumeDataCache.fetch.set(cacheKey, cacheData.value));
            }
            let revalidate = ctx.revalidate || cacheData.value.revalidate, isStale3 = (performance.timeOrigin + performance.now() - (cacheData.lastModified || 0)) / 1e3 > revalidate, data = cacheData.value.data;
            return tags_manifest_external_areTagsExpired(combinedTags, cacheData.lastModified) ? null : (tags_manifest_external_areTagsStale(combinedTags, cacheData.lastModified) && (isStale3 = true), { isStale: isStale3, value: { kind: types_CachedRouteKind.FETCH, data, revalidate } });
          }
          if ((null == cacheData || null == (_cacheData_value = cacheData.value) ? void 0 : _cacheData_value.kind) === types_CachedRouteKind.FETCH) throw Object.defineProperty(new lib_invariant_error_InvariantError(`Expected cached value for cache key ${JSON.stringify(cacheKey)} not to be a ${JSON.stringify(ctx.kind)} kind, got "FETCH" instead.`), "__NEXT_ERROR_CODE", { value: "E652", enumerable: false, configurable: true });
          let entry = null, { isFallback } = ctx, cacheControl = this.cacheControls.get(toRoute(cacheKey));
          if ((null == cacheData ? void 0 : cacheData.lastModified) === -1) isStale2 = -1, revalidateAfter = -31536e6;
          else {
            let now = performance.timeOrigin + performance.now(), lastModified = (null == cacheData ? void 0 : cacheData.lastModified) || now;
            if (void 0 === (isStale2 = false !== (revalidateAfter = this.calculateRevalidate(cacheKey, lastModified, this.dev ?? false, ctx.isFallback)) && revalidateAfter < now || void 0) && ((null == cacheData || null == (_cacheData_value3 = cacheData.value) ? void 0 : _cacheData_value3.kind) === types_CachedRouteKind.APP_PAGE || (null == cacheData || null == (_cacheData_value4 = cacheData.value) ? void 0 : _cacheData_value4.kind) === types_CachedRouteKind.APP_ROUTE)) {
              let tagsHeader = null == (_cacheData_value_headers = cacheData.value.headers) ? void 0 : _cacheData_value_headers[NEXT_CACHE_TAGS_HEADER];
              if ("string" == typeof tagsHeader) {
                let cacheTags = tagsHeader.split(",");
                cacheTags.length > 0 && (tags_manifest_external_areTagsExpired(cacheTags, lastModified) ? isStale2 = -1 : tags_manifest_external_areTagsStale(cacheTags, lastModified) && (isStale2 = true));
              }
            }
          }
          return cacheData && (entry = { isStale: isStale2, cacheControl, revalidateAfter, value: cacheData.value, isFallback }), !cacheData && this.prerenderManifest.notFoundRoutes.includes(cacheKey) && (entry = { isStale: isStale2, value: null, cacheControl, revalidateAfter, isFallback }, this.set(cacheKey, entry.value, { ...ctx, cacheControl })), entry;
        }
        async set(pathname, data, ctx) {
          if ((null == data ? void 0 : data.kind) === types_CachedRouteKind.FETCH) {
            let workUnitStore = workUnitAsyncStorageInstance.getStore(), prerenderResumeDataCache = workUnitStore ? getPrerenderResumeDataCache(workUnitStore) : null;
            prerenderResumeDataCache && (IncrementalCache.debug && console.log("IncrementalCache: rdc:set", pathname), prerenderResumeDataCache.fetch.set(pathname, data));
          }
          if (this.disableForTestmode || this.dev && !ctx.fetchCache) return;
          pathname = this._getPathname(pathname, ctx.fetchCache);
          let itemSize = JSON.stringify(data).length;
          if (ctx.fetchCache && itemSize > 2097152 && !this.hasCustomCacheHandler && !ctx.isImplicitBuildTimeCache) {
            let warningText = `Failed to set Next.js data cache for ${ctx.fetchUrl || pathname}, items over 2MB can not be cached (${itemSize} bytes)`;
            if (this.dev) throw Object.defineProperty(Error(warningText), "__NEXT_ERROR_CODE", { value: "E1003", enumerable: false, configurable: true });
            console.warn(warningText);
            return;
          }
          try {
            var _this_cacheHandler;
            !ctx.fetchCache && ctx.cacheControl && this.cacheControls.set(toRoute(pathname), ctx.cacheControl), await (null == (_this_cacheHandler = this.cacheHandler) ? void 0 : _this_cacheHandler.set(pathname, data, ctx));
          } catch (error2) {
            console.warn("Failed to update prerender cache for", pathname, error2);
          }
        }
      }
      __webpack_require__(990), "u" < typeof URLPattern || URLPattern;
      var react_react_server = __webpack_require__(345);
      if (/* @__PURE__ */ new WeakMap(), react_react_server.unstable_postpone, false === ((reason = "Route %%% needs to bail out of prerendering at this point because it used ^^^. React throws this special object to indicate where. It should not be caught by your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error").includes("needs to bail out of prerendering at this point because it used") && reason.includes("Learn more: https://nextjs.org/docs/messages/ppr-caught-error"))) throw Object.defineProperty(Error("Invariant: isDynamicPostpone misidentified a postpone reason. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E296", enumerable: false, configurable: true });
      RegExp("\\n\\s+at Suspense \\(<anonymous>\\)(?:(?!\\n\\s+at (?:body|div|main|section|article|aside|header|footer|nav|form|p|span|h1|h2|h3|h4|h5|h6) \\(<anonymous>\\))[\\s\\S])*?\\n\\s+at __next_root_layout_boundary__ \\([^\\n]*\\)"), RegExp("\\n\\s+at __next_metadata_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_viewport_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_outlet_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_instant_validation_boundary__[\\n\\s]");
      let errorRef = { current: null }, create_deduped_by_callsite_server_error_logger_cache = "function" == typeof react_react_server.cache ? react_react_server.cache : (fn) => fn, logErrorOrWarn = console.warn;
      function createDedupedByCallsiteServerErrorLoggerDev(getMessage) {
        return function logDedupedError(...args) {
          logErrorOrWarn(getMessage(...args));
        };
      }
      function createCookiesAccessError(route, expression) {
        let prefix = route ? `Route "${route}" ` : "This route ";
        return Object.defineProperty(Error(`${prefix}used ${expression}. \`cookies()\` returns a Promise and must be unwrapped with \`await\` or \`React.use()\` before accessing its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`), "__NEXT_ERROR_CODE", { value: "E830", enumerable: false, configurable: true });
      }
      function createHeadersAccessError(route, expression) {
        let prefix = route ? `Route "${route}" ` : "This route ";
        return Object.defineProperty(Error(`${prefix}used ${expression}. \`headers()\` returns a Promise and must be unwrapped with \`await\` or \`React.use()\` before accessing its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`), "__NEXT_ERROR_CODE", { value: "E836", enumerable: false, configurable: true });
      }
      function createDraftModeAccessError(route, expression) {
        let prefix = route ? `Route "${route}" ` : "This route ";
        return Object.defineProperty(Error(`${prefix}used ${expression}. \`draftMode()\` returns a Promise and must be unwrapped with \`await\` or \`React.use()\` before accessing its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`), "__NEXT_ERROR_CODE", { value: "E835", enumerable: false, configurable: true });
      }
      function getResolvedSecret() {
        let secret = process.env.SESSION_SECRET;
        return secret || (console.warn("WARNING: SESSION_SECRET environment variable is missing. Using fallback secret."), "default-fallback-insecure-secret-for-production-please-change-me");
      }
      async function generateSignature(message, secret) {
        let encoder2 = new TextEncoder(), keyData = encoder2.encode(secret), messageData = encoder2.encode(message), cryptoKey = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
        return btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.sign("HMAC", cryptoKey, messageData)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      }
      async function verifySessionToken(token) {
        try {
          let parts = token.split(".");
          if (2 !== parts.length) return null;
          let [serialized, signature] = parts, expectedSignature = await generateSignature(serialized, getResolvedSecret());
          if (signature !== expectedSignature) return null;
          let base64 = serialized.replace(/-/g, "+").replace(/_/g, "/");
          for (; base64.length % 4; ) base64 += "=";
          let decodedStr = atob(base64), session = JSON.parse(decodedStr);
          if (Date.now() - session.createdAt > 6048e5) return null;
          return session;
        } catch (error2) {
          return console.error("Session verification failed:", error2), null;
        }
      }
      create_deduped_by_callsite_server_error_logger_cache((key) => {
        try {
          logErrorOrWarn(errorRef.current);
        } finally {
          errorRef.current = null;
        }
      }), /* @__PURE__ */ new WeakMap(), createDedupedByCallsiteServerErrorLoggerDev(createCookiesAccessError), /* @__PURE__ */ new WeakMap(), createDedupedByCallsiteServerErrorLoggerDev(createHeadersAccessError), /* @__PURE__ */ new WeakMap(), createDedupedByCallsiteServerErrorLoggerDev(createDraftModeAccessError);
      let PUBLIC_ROUTES = ["/login"];
      async function middleware(request) {
        let { pathname } = request.nextUrl, sessionCookie = request.cookies.get("mphm_session"), isValidSession = false;
        if (sessionCookie && await verifySessionToken(sessionCookie.value) && (isValidSession = true), PUBLIC_ROUTES.includes(pathname) || pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico")) {
          if (isValidSession && "/login" === pathname) {
            let dashboardUrl = new URL("/dashboard", request.url);
            return NextResponse.redirect(dashboardUrl);
          }
          return NextResponse.next();
        }
        if (!isValidSession) {
          let loginUrl = new URL("/login", request.url), response = NextResponse.redirect(loginUrl);
          return sessionCookie && response.cookies.delete("mphm_session"), response;
        }
        return NextResponse.next();
      }
      let config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"] };
      Object.values({ NOT_FOUND: 404, FORBIDDEN: 403, UNAUTHORIZED: 401 });
      let mod = { ...middleware_namespaceObject }, page = "/src/middleware", handlerUserland = (0, mod.middleware || mod.default);
      class ProxyMissingExportError extends Error {
        constructor(message) {
          super(message), this.stack = "";
        }
      }
      if ("function" != typeof handlerUserland) throw new ProxyMissingExportError(`The Middleware file "${page}" must export a function named \`middleware\` or a default function.`);
      function errorHandledHandler(fn) {
        return async (...args) => {
          try {
            return await fn(...args);
          } catch (err) {
            let req = args[0], url = new URL(req.url), resource = url.pathname + url.search;
            throw await edgeInstrumentationOnRequestError(err, { path: resource, method: req.method, headers: Object.fromEntries(req.headers.entries()) }, { routerKind: "Pages Router", routePath: "/proxy", routeType: "proxy", revalidateReason: void 0 }), err;
          }
        };
      }
      let internalHandler = (opts) => adapter({ ...opts, IncrementalCache, incrementalCacheHandler: null, page, handler: errorHandledHandler(handlerUserland) });
      async function handler3(request, ctx) {
        let result = await internalHandler({ request: { url: request.url, method: request.method, headers: toNodeOutgoingHttpHeaders(request.headers), nextConfig: { basePath: "", i18n: "", trailingSlash: false, experimental: { cacheLife: { default: { stale: 300, revalidate: 900, expire: 4294967294 }, seconds: { stale: 30, revalidate: 1, expire: 60 }, minutes: { stale: 300, revalidate: 60, expire: 3600 }, hours: { stale: 300, revalidate: 3600, expire: 86400 }, days: { stale: 300, revalidate: 86400, expire: 604800 }, weeks: { stale: 300, revalidate: 604800, expire: 2592e3 }, max: { stale: 300, revalidate: 2592e3, expire: 31536e3 } }, authInterrupts: false, clientParamParsingOrigins: [] } }, page: { name: page }, body: "GET" !== request.method && "HEAD" !== request.method ? request.body ?? void 0 : void 0, waitUntil: ctx.waitUntil, requestMeta: ctx.requestMeta, signal: ctx.signal || new AbortController().signal } });
        return null == ctx.waitUntil || ctx.waitUntil.call(ctx, result.waitUntil), result.response;
      }
      let next_middleware_loaderabsolutePagePath_private_next_root_dir_2Fsrc_2Fmiddleware_ts_page_2Fsrc_2Fmiddleware_rootDir_D_3A_5CDEVELZY_5CMPHM_matchers_W3sicmVnZXhwIjoiXig_2FOlxcLyhfbmV4dFxcL2RhdGFcXC9bXi9dezEsfSkpPyg_2FOlxcLygoPyFhcGl8X25leHRcXC9zdGF0aWN8X25leHRcXC9pbWFnZXxmYXZpY29uLmljbykuKikpKFxcLmpzb258XFwucnNjfFxcLnNlZ21lbnRzXFwvLitcXC5zZWdtZW50XFwucnNjKT9bXFwvI1xcP10_2FJCIsIm9yaWdpbmFsU291cmNlIjoiLygoPyFhcGl8X25leHQvc3RhdGljfF9uZXh0L2ltYWdlfGZhdmljb24uaWNvKS4qKSJ9XQ_3D_3D_preferredRegion_middlewareConfig_eyJtYXRjaGVycyI6W3sicmVnZXhwIjoiXig_2FOlxcLyhfbmV4dFxcL2RhdGFcXC9bXi9dezEsfSkpPyg_2FOlxcLygoPyFhcGl8X25leHRcXC9zdGF0aWN8X25leHRcXC9pbWFnZXxmYXZpY29uLmljbykuKikpKFxcLmpzb258XFwucnNjfFxcLnNlZ21lbnRzXFwvLitcXC5zZWdtZW50XFwucnNjKT9bXFwvI1xcP10_2FJCIsIm9yaWdpbmFsU291cmNlIjoiLygoPyFhcGl8X25leHQvc3RhdGljfF9uZXh0L2ltYWdlfGZhdmljb24uaWNvKS4qKSJ9XX0_3D_ = internalHandler;
    }, 918: (module2) => {
      "use strict";
      var __defProp2 = Object.defineProperty, __getOwnPropDesc2 = Object.getOwnPropertyDescriptor, __getOwnPropNames2 = Object.getOwnPropertyNames, __hasOwnProp2 = Object.prototype.hasOwnProperty, src_exports = {}, all = { RequestCookies: () => RequestCookies, ResponseCookies: () => ResponseCookies, parseCookie: () => parseCookie, parseSetCookie: () => parseSetCookie, stringifyCookie: () => stringifyCookie };
      for (var name in all) __defProp2(src_exports, name, { get: all[name], enumerable: true });
      function stringifyCookie(c) {
        var _a;
        let attrs = ["path" in c && c.path && `Path=${c.path}`, "expires" in c && (c.expires || 0 === c.expires) && `Expires=${("number" == typeof c.expires ? new Date(c.expires) : c.expires).toUTCString()}`, "maxAge" in c && "number" == typeof c.maxAge && `Max-Age=${c.maxAge}`, "domain" in c && c.domain && `Domain=${c.domain}`, "secure" in c && c.secure && "Secure", "httpOnly" in c && c.httpOnly && "HttpOnly", "sameSite" in c && c.sameSite && `SameSite=${c.sameSite}`, "partitioned" in c && c.partitioned && "Partitioned", "priority" in c && c.priority && `Priority=${c.priority}`].filter(Boolean), stringified = `${c.name}=${encodeURIComponent(null != (_a = c.value) ? _a : "")}`;
        return 0 === attrs.length ? stringified : `${stringified}; ${attrs.join("; ")}`;
      }
      function parseCookie(cookie) {
        let map = /* @__PURE__ */ new Map();
        for (let pair of cookie.split(/; */)) {
          if (!pair) continue;
          let splitAt = pair.indexOf("=");
          if (-1 === splitAt) {
            map.set(pair, "true");
            continue;
          }
          let [key, value1] = [pair.slice(0, splitAt), pair.slice(splitAt + 1)];
          try {
            map.set(key, decodeURIComponent(null != value1 ? value1 : "true"));
          } catch {
          }
        }
        return map;
      }
      function parseSetCookie(setCookie) {
        if (!setCookie) return;
        let [[name2, value1], ...attributes] = parseCookie(setCookie), { domain, expires, httponly, maxage, path: path3, samesite, secure, partitioned, priority } = Object.fromEntries(attributes.map(([key, value2]) => [key.toLowerCase().replace(/-/g, ""), value2]));
        return compact({ name: name2, value: decodeURIComponent(value1), domain, ...expires && { expires: new Date(expires) }, ...httponly && { httpOnly: true }, ..."string" == typeof maxage && { maxAge: Number(maxage) }, path: path3, ...samesite && { sameSite: parseSameSite(samesite) }, ...secure && { secure: true }, ...priority && { priority: parsePriority(priority) }, ...partitioned && { partitioned: true } });
      }
      function compact(t) {
        let newT = {};
        for (let key in t) t[key] && (newT[key] = t[key]);
        return newT;
      }
      module2.exports = ((to, from, except, desc) => {
        if (from && "object" == typeof from || "function" == typeof from) for (let key of __getOwnPropNames2(from)) __hasOwnProp2.call(to, key) || key === except || __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        return to;
      })(__defProp2({}, "__esModule", { value: true }), src_exports);
      var SAME_SITE = ["strict", "lax", "none"];
      function parseSameSite(string) {
        return string = string.toLowerCase(), SAME_SITE.includes(string) ? string : void 0;
      }
      var PRIORITY = ["low", "medium", "high"];
      function parsePriority(string) {
        return string = string.toLowerCase(), PRIORITY.includes(string) ? string : void 0;
      }
      function splitCookiesString(cookiesString) {
        if (!cookiesString) return [];
        var start, ch, lastComma, nextStart, cookiesSeparatorFound, cookiesStrings = [], pos = 0;
        function skipWhitespace() {
          for (; pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos)); ) pos += 1;
          return pos < cookiesString.length;
        }
        function notSpecialChar() {
          return "=" !== (ch = cookiesString.charAt(pos)) && ";" !== ch && "," !== ch;
        }
        for (; pos < cookiesString.length; ) {
          for (start = pos, cookiesSeparatorFound = false; skipWhitespace(); ) if ("," === (ch = cookiesString.charAt(pos))) {
            for (lastComma = pos, pos += 1, skipWhitespace(), nextStart = pos; pos < cookiesString.length && notSpecialChar(); ) pos += 1;
            pos < cookiesString.length && "=" === cookiesString.charAt(pos) ? (cookiesSeparatorFound = true, pos = nextStart, cookiesStrings.push(cookiesString.substring(start, lastComma)), start = pos) : pos = lastComma + 1;
          } else pos += 1;
          (!cookiesSeparatorFound || pos >= cookiesString.length) && cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
        }
        return cookiesStrings;
      }
      var RequestCookies = class {
        constructor(requestHeaders) {
          this._parsed = /* @__PURE__ */ new Map(), this._headers = requestHeaders;
          const header = requestHeaders.get("cookie");
          if (header) for (const [name2, value1] of parseCookie(header)) this._parsed.set(name2, { name: name2, value: value1 });
        }
        [Symbol.iterator]() {
          return this._parsed[Symbol.iterator]();
        }
        get size() {
          return this._parsed.size;
        }
        get(...args) {
          let name2 = "string" == typeof args[0] ? args[0] : args[0].name;
          return this._parsed.get(name2);
        }
        getAll(...args) {
          var _a;
          let all2 = Array.from(this._parsed);
          if (!args.length) return all2.map(([_, value1]) => value1);
          let name2 = "string" == typeof args[0] ? args[0] : null == (_a = args[0]) ? void 0 : _a.name;
          return all2.filter(([n]) => n === name2).map(([_, value1]) => value1);
        }
        has(name2) {
          return this._parsed.has(name2);
        }
        set(...args) {
          let [name2, value1] = 1 === args.length ? [args[0].name, args[0].value] : args, map = this._parsed;
          return map.set(name2, { name: name2, value: value1 }), this._headers.set("cookie", Array.from(map).map(([_, value2]) => stringifyCookie(value2)).join("; ")), this;
        }
        delete(names) {
          let map = this._parsed, result = Array.isArray(names) ? names.map((name2) => map.delete(name2)) : map.delete(names);
          return this._headers.set("cookie", Array.from(map).map(([_, value1]) => stringifyCookie(value1)).join("; ")), result;
        }
        clear() {
          return this.delete(Array.from(this._parsed.keys())), this;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map((v) => `${v.name}=${encodeURIComponent(v.value)}`).join("; ");
        }
      }, ResponseCookies = class {
        constructor(responseHeaders) {
          var _a, _b, _c;
          this._parsed = /* @__PURE__ */ new Map(), this._headers = responseHeaders;
          const setCookie = null != (_c = null != (_b = null == (_a = responseHeaders.getSetCookie) ? void 0 : _a.call(responseHeaders)) ? _b : responseHeaders.get("set-cookie")) ? _c : [];
          for (const cookieString of Array.isArray(setCookie) ? setCookie : splitCookiesString(setCookie)) {
            const parsed = parseSetCookie(cookieString);
            parsed && this._parsed.set(parsed.name, parsed);
          }
        }
        get(...args) {
          let key = "string" == typeof args[0] ? args[0] : args[0].name;
          return this._parsed.get(key);
        }
        getAll(...args) {
          var _a;
          let all2 = Array.from(this._parsed.values());
          if (!args.length) return all2;
          let key = "string" == typeof args[0] ? args[0] : null == (_a = args[0]) ? void 0 : _a.name;
          return all2.filter((c) => c.name === key);
        }
        has(name2) {
          return this._parsed.has(name2);
        }
        set(...args) {
          let [name2, value1, cookie] = 1 === args.length ? [args[0].name, args[0].value, args[0]] : args, map = this._parsed;
          return map.set(name2, normalizeCookie({ name: name2, value: value1, ...cookie })), replace(map, this._headers), this;
        }
        delete(...args) {
          let [name2, options] = "string" == typeof args[0] ? [args[0]] : [args[0].name, args[0]];
          return this.set({ ...options, name: name2, value: "", expires: /* @__PURE__ */ new Date(0) });
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map(stringifyCookie).join("; ");
        }
      };
      function replace(bag, headers) {
        for (let [, value1] of (headers.delete("set-cookie"), bag)) {
          let serialized = stringifyCookie(value1);
          headers.append("set-cookie", serialized);
        }
      }
      function normalizeCookie(cookie = { name: "", value: "" }) {
        return "number" == typeof cookie.expires && (cookie.expires = new Date(cookie.expires)), cookie.maxAge && (cookie.expires = new Date(Date.now() + 1e3 * cookie.maxAge)), (null === cookie.path || void 0 === cookie.path) && (cookie.path = "/"), cookie;
      }
    }, 987: (__unused_webpack_module, exports2, __webpack_require__) => {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true }), function _export(target, all) {
        for (var name in all) Object.defineProperty(target, name, { enumerable: true, get: all[name] });
      }(exports2, { interceptTestApis: function() {
        return interceptTestApis;
      }, wrapRequestHandler: function() {
        return wrapRequestHandler;
      } });
      let _context = __webpack_require__(643), _fetch = __webpack_require__(318);
      function interceptTestApis() {
        return (0, _fetch.interceptFetch)(__webpack_require__.g.fetch);
      }
      function wrapRequestHandler(handler3) {
        return (req, fn) => (0, _context.withRequest)(req, _fetch.reader, () => handler3(req, fn));
      }
    }, 990: (module2, exports2, __webpack_require__) => {
      var __WEBPACK_AMD_DEFINE_RESULT__, i = { 226: function(i2, e2) {
        !function(o) {
          "use strict";
          var s = "function", b = "undefined", w = "object", l = "string", d = "major", c = "model", u = "name", p = "type", m = "vendor", f = "version", h = "architecture", v = "console", g = "mobile", k = "tablet", x = "smarttv", _ = "wearable", y = "embedded", T = "Amazon", S = "Apple", z = "ASUS", N = "BlackBerry", A = "Browser", C = "Chrome", O = "Firefox", U = "Google", j = "Huawei", R = "Microsoft", M = "Motorola", B = "Opera", V = "Samsung", D = "Sharp", I = "Sony", F = "Xiaomi", G = "Zebra", H = "Facebook", L = "Chromium OS", Z = "Mac OS", extend = function(i3, e3) {
            var o2 = {};
            for (var a in i3) e3[a] && e3[a].length % 2 == 0 ? o2[a] = e3[a].concat(i3[a]) : o2[a] = i3[a];
            return o2;
          }, enumerize = function(i3) {
            for (var e3 = {}, o2 = 0; o2 < i3.length; o2++) e3[i3[o2].toUpperCase()] = i3[o2];
            return e3;
          }, has = function(i3, e3) {
            return typeof i3 === l && -1 !== lowerize(e3).indexOf(lowerize(i3));
          }, lowerize = function(i3) {
            return i3.toLowerCase();
          }, trim = function(i3, e3) {
            if (typeof i3 === l) return i3 = i3.replace(/^\s\s*/, ""), typeof e3 === b ? i3 : i3.substring(0, 350);
          }, rgxMapper = function(i3, e3) {
            for (var r, t, n, b2, l2, d2, o2 = 0; o2 < e3.length && !l2; ) {
              var c2 = e3[o2], u2 = e3[o2 + 1];
              for (r = t = 0; r < c2.length && !l2 && c2[r]; ) if (l2 = c2[r++].exec(i3)) for (n = 0; n < u2.length; n++) d2 = l2[++t], typeof (b2 = u2[n]) === w && b2.length > 0 ? 2 === b2.length ? typeof b2[1] == s ? this[b2[0]] = b2[1].call(this, d2) : this[b2[0]] = b2[1] : 3 === b2.length ? typeof b2[1] !== s || b2[1].exec && b2[1].test ? this[b2[0]] = d2 ? d2.replace(b2[1], b2[2]) : void 0 : this[b2[0]] = d2 ? b2[1].call(this, d2, b2[2]) : void 0 : 4 === b2.length && (this[b2[0]] = d2 ? b2[3].call(this, d2.replace(b2[1], b2[2])) : void 0) : this[b2] = d2 || void 0;
              o2 += 2;
            }
          }, strMapper = function(i3, e3) {
            for (var o2 in e3) if (typeof e3[o2] === w && e3[o2].length > 0) {
              for (var r = 0; r < e3[o2].length; r++) if (has(e3[o2][r], i3)) return "?" === o2 ? void 0 : o2;
            } else if (has(e3[o2], i3)) return "?" === o2 ? void 0 : o2;
            return i3;
          }, X = { ME: "4.90", "NT 3.11": "NT3.51", "NT 4.0": "NT4.0", 2e3: "NT 5.0", XP: ["NT 5.1", "NT 5.2"], Vista: "NT 6.0", 7: "NT 6.1", 8: "NT 6.2", 8.1: "NT 6.3", 10: ["NT 6.4", "NT 10.0"], RT: "ARM" }, K = { browser: [[/\b(?:crmo|crios)\/([\w\.]+)/i], [f, [u, "Chrome"]], [/edg(?:e|ios|a)?\/([\w\.]+)/i], [f, [u, "Edge"]], [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i], [u, f], [/opios[\/ ]+([\w\.]+)/i], [f, [u, B + " Mini"]], [/\bopr\/([\w\.]+)/i], [f, [u, B]], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i, /(ba?idubrowser)[\/ ]?([\w\.]+)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i, /(heytap|ovi)browser\/([\d\.]+)/i, /(weibo)__([\d\.]+)/i], [u, f], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i], [f, [u, "UC" + A]], [/microm.+\bqbcore\/([\w\.]+)/i, /\bqbcore\/([\w\.]+).+microm/i], [f, [u, "WeChat(Win) Desktop"]], [/micromessenger\/([\w\.]+)/i], [f, [u, "WeChat"]], [/konqueror\/([\w\.]+)/i], [f, [u, "Konqueror"]], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i], [f, [u, "IE"]], [/ya(?:search)?browser\/([\w\.]+)/i], [f, [u, "Yandex"]], [/(avast|avg)\/([\w\.]+)/i], [[u, /(.+)/, "$1 Secure " + A], f], [/\bfocus\/([\w\.]+)/i], [f, [u, O + " Focus"]], [/\bopt\/([\w\.]+)/i], [f, [u, B + " Touch"]], [/coc_coc\w+\/([\w\.]+)/i], [f, [u, "Coc Coc"]], [/dolfin\/([\w\.]+)/i], [f, [u, "Dolphin"]], [/coast\/([\w\.]+)/i], [f, [u, B + " Coast"]], [/miuibrowser\/([\w\.]+)/i], [f, [u, "MIUI " + A]], [/fxios\/([-\w\.]+)/i], [f, [u, O]], [/\bqihu|(qi?ho?o?|360)browser/i], [[u, "360 " + A]], [/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i], [[u, /(.+)/, "$1 " + A], f], [/(comodo_dragon)\/([\w\.]+)/i], [[u, /_/g, " "], f], [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i], [u, f], [/(metasr)[\/ ]?([\w\.]+)/i, /(lbbrowser)/i, /\[(linkedin)app\]/i], [u], [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i], [[u, H], f], [/(kakao(?:talk|story))[\/ ]([\w\.]+)/i, /(naver)\(.*?(\d+\.[\w\.]+).*\)/i, /safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(chromium|instagram)[\/ ]([-\w\.]+)/i], [u, f], [/\bgsa\/([\w\.]+) .*safari\//i], [f, [u, "GSA"]], [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i], [f, [u, "TikTok"]], [/headlesschrome(?:\/([\w\.]+)| )/i], [f, [u, C + " Headless"]], [/ wv\).+(chrome)\/([\w\.]+)/i], [[u, C + " WebView"], f], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i], [f, [u, "Android " + A]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i], [u, f], [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i], [f, [u, "Mobile Safari"]], [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i], [f, u], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i], [u, [f, strMapper, { "1.0": "/8", 1.2: "/1", 1.3: "/3", "2.0": "/412", "2.0.2": "/416", "2.0.3": "/417", "2.0.4": "/419", "?": "/" }]], [/(webkit|khtml)\/([\w\.]+)/i], [u, f], [/(navigator|netscape\d?)\/([-\w\.]+)/i], [[u, "Netscape"], f], [/mobile vr; rv:([\w\.]+)\).+firefox/i], [f, [u, O + " Reality"]], [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i, /panasonic;(viera)/i], [u, f], [/(cobalt)\/([\w\.]+)/i], [u, [f, /master.|lts./, ""]]], cpu: [[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i], [[h, "amd64"]], [/(ia32(?=;))/i], [[h, lowerize]], [/((?:i[346]|x)86)[;\)]/i], [[h, "ia32"]], [/\b(aarch64|arm(v?8e?l?|_?64))\b/i], [[h, "arm64"]], [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i], [[h, "armhf"]], [/windows (ce|mobile); ppc;/i], [[h, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i], [[h, /ower/, "", lowerize]], [/(sun4\w)[;\)]/i], [[h, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i], [[h, lowerize]]], device: [[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], [c, [m, V], [p, k]], [/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i], [c, [m, V], [p, g]], [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i], [c, [m, S], [p, g]], [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], [c, [m, S], [p, k]], [/(macintosh);/i], [c, [m, S]], [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i], [c, [m, D], [p, g]], [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i], [c, [m, j], [p, k]], [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i], [c, [m, j], [p, g]], [/\b(poco[\w ]+)(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i], [[c, /_/g, " "], [m, F], [p, g]], [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i], [[c, /_/g, " "], [m, F], [p, k]], [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], [c, [m, "OPPO"], [p, g]], [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], [c, [m, "Vivo"], [p, g]], [/\b(rmx[12]\d{3})(?: bui|;|\))/i], [c, [m, "Realme"], [p, g]], [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], [c, [m, M], [p, g]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], [c, [m, M], [p, k]], [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], [c, [m, "LG"], [p, k]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i], [c, [m, "LG"], [p, g]], [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i], [c, [m, "Lenovo"], [p, k]], [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i], [[c, /_/g, " "], [m, "Nokia"], [p, g]], [/(pixel c)\b/i], [c, [m, U], [p, k]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i], [c, [m, U], [p, g]], [/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [c, [m, I], [p, g]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [[c, "Xperia Tablet"], [m, I], [p, k]], [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], [c, [m, "OnePlus"], [p, g]], [/(alexa)webm/i, /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i], [c, [m, T], [p, k]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i], [[c, /(.+)/g, "Fire Phone $1"], [m, T], [p, g]], [/(playbook);[-\w\),; ]+(rim)/i], [c, m, [p, k]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i], [c, [m, N], [p, g]], [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], [c, [m, z], [p, k]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], [c, [m, z], [p, g]], [/(nexus 9)/i], [c, [m, "HTC"], [p, k]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i], [m, [c, /_/g, " "], [p, g]], [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], [c, [m, "Acer"], [p, k]], [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], [c, [m, "Meizu"], [p, g]], [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i], [m, c, [p, g]], [/(kobo)\s(ereader|touch)/i, /(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i], [m, c, [p, k]], [/(surface duo)/i], [c, [m, R], [p, k]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i], [c, [m, "Fairphone"], [p, g]], [/(u304aa)/i], [c, [m, "AT&T"], [p, g]], [/\bsie-(\w*)/i], [c, [m, "Siemens"], [p, g]], [/\b(rct\w+) b/i], [c, [m, "RCA"], [p, k]], [/\b(venue[\d ]{2,7}) b/i], [c, [m, "Dell"], [p, k]], [/\b(q(?:mv|ta)\w+) b/i], [c, [m, "Verizon"], [p, k]], [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i], [c, [m, "Barnes & Noble"], [p, k]], [/\b(tm\d{3}\w+) b/i], [c, [m, "NuVision"], [p, k]], [/\b(k88) b/i], [c, [m, "ZTE"], [p, k]], [/\b(nx\d{3}j) b/i], [c, [m, "ZTE"], [p, g]], [/\b(gen\d{3}) b.+49h/i], [c, [m, "Swiss"], [p, g]], [/\b(zur\d{3}) b/i], [c, [m, "Swiss"], [p, k]], [/\b((zeki)?tb.*\b) b/i], [c, [m, "Zeki"], [p, k]], [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i], [[m, "Dragon Touch"], c, [p, k]], [/\b(ns-?\w{0,9}) b/i], [c, [m, "Insignia"], [p, k]], [/\b((nxa|next)-?\w{0,9}) b/i], [c, [m, "NextBook"], [p, k]], [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i], [[m, "Voice"], c, [p, g]], [/\b(lvtel\-)?(v1[12]) b/i], [[m, "LvTel"], c, [p, g]], [/\b(ph-1) /i], [c, [m, "Essential"], [p, g]], [/\b(v(100md|700na|7011|917g).*\b) b/i], [c, [m, "Envizen"], [p, k]], [/\b(trio[-\w\. ]+) b/i], [c, [m, "MachSpeed"], [p, k]], [/\btu_(1491) b/i], [c, [m, "Rotor"], [p, k]], [/(shield[\w ]+) b/i], [c, [m, "Nvidia"], [p, k]], [/(sprint) (\w+)/i], [m, c, [p, g]], [/(kin\.[onetw]{3})/i], [[c, /\./g, " "], [m, R], [p, g]], [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i], [c, [m, G], [p, k]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], [c, [m, G], [p, g]], [/smart-tv.+(samsung)/i], [m, [p, x]], [/hbbtv.+maple;(\d+)/i], [[c, /^/, "SmartTV"], [m, V], [p, x]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i], [[m, "LG"], [p, x]], [/(apple) ?tv/i], [m, [c, S + " TV"], [p, x]], [/crkey/i], [[c, C + "cast"], [m, U], [p, x]], [/droid.+aft(\w)( bui|\))/i], [c, [m, T], [p, x]], [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i], [c, [m, D], [p, x]], [/(bravia[\w ]+)( bui|\))/i], [c, [m, I], [p, x]], [/(mitv-\w{5}) bui/i], [c, [m, F], [p, x]], [/Hbbtv.*(technisat) (.*);/i], [m, c, [p, x]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i], [[m, trim], [c, trim], [p, x]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i], [[p, x]], [/(ouya)/i, /(nintendo) ([wids3utch]+)/i], [m, c, [p, v]], [/droid.+; (shield) bui/i], [c, [m, "Nvidia"], [p, v]], [/(playstation [345portablevi]+)/i], [c, [m, I], [p, v]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i], [c, [m, R], [p, v]], [/((pebble))app/i], [m, c, [p, _]], [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i], [c, [m, S], [p, _]], [/droid.+; (glass) \d/i], [c, [m, U], [p, _]], [/droid.+; (wt63?0{2,3})\)/i], [c, [m, G], [p, _]], [/(quest( 2| pro)?)/i], [c, [m, H], [p, _]], [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i], [m, [p, y]], [/(aeobc)\b/i], [c, [m, T], [p, y]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i], [c, [p, g]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i], [c, [p, k]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i], [[p, k]], [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i], [[p, g]], [/(android[-\w\. ]{0,9});.+buil/i], [c, [m, "Generic"]]], engine: [[/windows.+ edge\/([\w\.]+)/i], [f, [u, "EdgeHTML"]], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], [f, [u, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i, /\b(libweb)/i], [u, f], [/rv\:([\w\.]{1,9})\b.+(gecko)/i], [f, u]], os: [[/microsoft (windows) (vista|xp)/i], [u, f], [/(windows) nt 6\.2; (arm)/i, /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i, /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i], [u, [f, strMapper, X]], [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [[u, "Windows"], [f, strMapper, X]], [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /ios;fbsv\/([\d\.]+)/i, /cfnetwork\/.+darwin/i], [[f, /_/g, "."], [u, "iOS"]], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i], [[u, Z], [f, /_/g, "."]], [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i], [f, u], [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i], [u, f], [/\(bb(10);/i], [f, [u, N]], [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i], [f, [u, "Symbian"]], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i], [f, [u, O + " OS"]], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i], [f, [u, "webOS"]], [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i], [f, [u, "watchOS"]], [/crkey\/([\d\.]+)/i], [f, [u, C + "cast"]], [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i], [[u, L], f], [/panasonic;(viera)/i, /(netrange)mmh/i, /(nettv)\/(\d+\.[\w\.]+)/i, /(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i], [u, f], [/(sunos) ?([\w\.\d]*)/i], [[u, "Solaris"], f], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, /(unix) ?([\w\.]*)/i], [u, f]] }, UAParser = function(i3, e3) {
            if (typeof i3 === w && (e3 = i3, i3 = void 0), !(this instanceof UAParser)) return new UAParser(i3, e3).getResult();
            var r = typeof o !== b && o.navigator ? o.navigator : void 0, n = i3 || (r && r.userAgent ? r.userAgent : ""), v2 = r && r.userAgentData ? r.userAgentData : void 0, x2 = e3 ? extend(K, e3) : K, _2 = r && r.userAgent == n;
            return this.getBrowser = function() {
              var i4, i1 = {};
              return i1[u] = void 0, i1[f] = void 0, rgxMapper.call(i1, n, x2.browser), i1[d] = typeof (i4 = i1[f]) === l ? i4.replace(/[^\d\.]/g, "").split(".")[0] : void 0, _2 && r && r.brave && typeof r.brave.isBrave == s && (i1[u] = "Brave"), i1;
            }, this.getCPU = function() {
              var i4 = {};
              return i4[h] = void 0, rgxMapper.call(i4, n, x2.cpu), i4;
            }, this.getDevice = function() {
              var i4 = {};
              return i4[m] = void 0, i4[c] = void 0, i4[p] = void 0, rgxMapper.call(i4, n, x2.device), _2 && !i4[p] && v2 && v2.mobile && (i4[p] = g), _2 && "Macintosh" == i4[c] && r && typeof r.standalone !== b && r.maxTouchPoints && r.maxTouchPoints > 2 && (i4[c] = "iPad", i4[p] = k), i4;
            }, this.getEngine = function() {
              var i4 = {};
              return i4[u] = void 0, i4[f] = void 0, rgxMapper.call(i4, n, x2.engine), i4;
            }, this.getOS = function() {
              var i4 = {};
              return i4[u] = void 0, i4[f] = void 0, rgxMapper.call(i4, n, x2.os), _2 && !i4[u] && v2 && "Unknown" != v2.platform && (i4[u] = v2.platform.replace(/chrome os/i, L).replace(/macos/i, Z)), i4;
            }, this.getResult = function() {
              return { ua: this.getUA(), browser: this.getBrowser(), engine: this.getEngine(), os: this.getOS(), device: this.getDevice(), cpu: this.getCPU() };
            }, this.getUA = function() {
              return n;
            }, this.setUA = function(i4) {
              return n = typeof i4 === l && i4.length > 350 ? trim(i4, 350) : i4, this;
            }, this.setUA(n), this;
          };
          UAParser.VERSION = "1.0.35", UAParser.BROWSER = enumerize([u, f, d]), UAParser.CPU = enumerize([h]), UAParser.DEVICE = enumerize([c, m, p, v, g, x, k, _, y]), UAParser.ENGINE = UAParser.OS = enumerize([u, f]), typeof e2 !== b ? (i2.exports && (e2 = i2.exports = UAParser), e2.UAParser = UAParser) : __webpack_require__.amdO ? void 0 === (__WEBPACK_AMD_DEFINE_RESULT__ = function() {
            return UAParser;
          }.call(exports2, __webpack_require__, exports2, module2)) || (module2.exports = __WEBPACK_AMD_DEFINE_RESULT__) : typeof o !== b && (o.UAParser = UAParser);
          var Q = typeof o !== b && (o.jQuery || o.Zepto);
          if (Q && !Q.ua) {
            var Y = new UAParser();
            Q.ua = Y.getResult(), Q.ua.get = function() {
              return Y.getUA();
            }, Q.ua.set = function(i3) {
              Y.setUA(i3);
              var e3 = Y.getResult();
              for (var o2 in e3) Q.ua[o2] = e3[o2];
            };
          }
        }("object" == typeof window ? window : this);
      } }, e = {};
      function __nccwpck_require__1(o) {
        var a = e[o];
        if (void 0 !== a) return a.exports;
        var r = e[o] = { exports: {} }, t = true;
        try {
          i[o].call(r.exports, r, r.exports, __nccwpck_require__1), t = false;
        } finally {
          t && delete e[o];
        }
        return r.exports;
      }
      __nccwpck_require__1.ab = "//", module2.exports = __nccwpck_require__1(226);
    } }, (__webpack_require__) => {
      var __webpack_exports__ = __webpack_require__(__webpack_require__.s = 889);
      (_ENTRIES = "u" < typeof _ENTRIES ? {} : _ENTRIES)["middleware_src/middleware"] = __webpack_exports__;
    }]);
  }
});

// node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js
var edgeFunctionHandler_exports = {};
__export(edgeFunctionHandler_exports, {
  default: () => edgeFunctionHandler
});
async function edgeFunctionHandler(request) {
  const path3 = new URL(request.url).pathname;
  const routes = globalThis._ROUTES;
  const correspondingRoute = routes.find((route) => route.regex.some((r) => new RegExp(r).test(path3)));
  if (!correspondingRoute) {
    throw new Error(`No route found for ${request.url}`);
  }
  const entry = await self._ENTRIES[`middleware_${correspondingRoute.name}`];
  const result = await entry.default({
    page: correspondingRoute.page,
    request: {
      ...request,
      page: {
        name: correspondingRoute.name
      }
    }
  });
  globalThis.__openNextAls.getStore()?.pendingPromiseRunner.add(result.waitUntil);
  const response = result.response;
  return response;
}
var init_edgeFunctionHandler = __esm({
  "node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js"() {
    globalThis._ENTRIES = {};
    globalThis.self = globalThis;
    globalThis._ROUTES = [{ "name": "src/middleware", "page": "/", "regex": ["^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!api|_next\\/static|_next\\/image|favicon.ico).*))(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$"] }];
    require_edge_runtime_webpack();
    require_middleware();
  }
});

// node_modules/@opennextjs/aws/dist/utils/promise.js
init_logger();

// node_modules/@opennextjs/aws/dist/utils/requestCache.js
var RequestCache = class {
  _caches = /* @__PURE__ */ new Map();
  /**
   * Returns the Map registered under `key`.
   * If no Map exists yet for that key, a new empty Map is created, stored, and returned.
   * Repeated calls with the same key always return the **same** Map instance.
   */
  getOrCreate(key) {
    let cache = this._caches.get(key);
    if (!cache) {
      cache = /* @__PURE__ */ new Map();
      this._caches.set(key, cache);
    }
    return cache;
  }
};

// node_modules/@opennextjs/aws/dist/utils/promise.js
var DetachedPromise = class {
  resolve;
  reject;
  promise;
  constructor() {
    let resolve;
    let reject;
    this.promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    this.resolve = resolve;
    this.reject = reject;
  }
};
var DetachedPromiseRunner = class {
  promises = [];
  withResolvers() {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    return detachedPromise;
  }
  add(promise) {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    promise.then(detachedPromise.resolve, detachedPromise.reject);
  }
  async await() {
    debug(`Awaiting ${this.promises.length} detached promises`);
    const results = await Promise.allSettled(this.promises.map((p) => p.promise));
    const rejectedPromises = results.filter((r) => r.status === "rejected");
    rejectedPromises.forEach((r) => {
      error(r.reason);
    });
  }
};
async function awaitAllDetachedPromise() {
  const store = globalThis.__openNextAls.getStore();
  const promisesToAwait = store?.pendingPromiseRunner.await() ?? Promise.resolve();
  if (store?.waitUntil) {
    store.waitUntil(promisesToAwait);
    return;
  }
  await promisesToAwait;
}
function provideNextAfterProvider() {
  const NEXT_REQUEST_CONTEXT_SYMBOL = Symbol.for("@next/request-context");
  const VERCEL_REQUEST_CONTEXT_SYMBOL = Symbol.for("@vercel/request-context");
  const store = globalThis.__openNextAls.getStore();
  const waitUntil = store?.waitUntil ?? ((promise) => store?.pendingPromiseRunner.add(promise));
  const nextAfterContext = {
    get: () => ({
      waitUntil
    })
  };
  globalThis[NEXT_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  if (process.env.EMULATE_VERCEL_REQUEST_CONTEXT) {
    globalThis[VERCEL_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  }
}
function runWithOpenNextRequestContext({ isISRRevalidation, waitUntil, requestId = Math.random().toString(36) }, fn) {
  return globalThis.__openNextAls.run({
    requestId,
    pendingPromiseRunner: new DetachedPromiseRunner(),
    isISRRevalidation,
    waitUntil,
    writtenTags: /* @__PURE__ */ new Set(),
    requestCache: new RequestCache()
  }, async () => {
    provideNextAfterProvider();
    let result;
    try {
      result = await fn();
    } finally {
      await awaitAllDetachedPromise();
    }
    return result;
  });
}

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/resolve.js
async function resolveConverter(converter2) {
  if (typeof converter2 === "function") {
    return converter2();
  }
  const m_1 = await Promise.resolve().then(() => (init_edge(), edge_exports));
  return m_1.default;
}
async function resolveWrapper(wrapper) {
  if (typeof wrapper === "function") {
    return wrapper();
  }
  const m_1 = await Promise.resolve().then(() => (init_cloudflare_edge(), cloudflare_edge_exports));
  return m_1.default;
}
async function resolveOriginResolver(originResolver) {
  if (typeof originResolver === "function") {
    return originResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_pattern_env(), pattern_env_exports));
  return m_1.default;
}
async function resolveAssetResolver(assetResolver) {
  if (typeof assetResolver === "function") {
    return assetResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_dummy(), dummy_exports));
  return m_1.default;
}
async function resolveProxyRequest(proxyRequest) {
  if (typeof proxyRequest === "function") {
    return proxyRequest();
  }
  const m_1 = await Promise.resolve().then(() => (init_fetch(), fetch_exports));
  return m_1.default;
}

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
async function createGenericHandler(handler3) {
  const config = await import("./open-next.config.mjs").then((m) => m.default);
  globalThis.openNextConfig = config;
  const handlerConfig = config[handler3.type];
  const override = handlerConfig && "override" in handlerConfig ? handlerConfig.override : void 0;
  const converter2 = await resolveConverter(override?.converter);
  const { name, wrapper } = await resolveWrapper(override?.wrapper);
  debug("Using wrapper", name);
  return wrapper(handler3.handler, converter2);
}

// node_modules/@opennextjs/aws/dist/core/routing/util.js
import crypto2 from "node:crypto";
import { parse as parseQs, stringify as stringifyQs } from "node:querystring";

// node_modules/@opennextjs/aws/dist/adapters/config/index.js
init_logger();
import path from "node:path";
globalThis.__dirname ??= "";
var NEXT_DIR = path.join(__dirname, ".next");
var OPEN_NEXT_DIR = path.join(__dirname, ".open-next");
debug({ NEXT_DIR, OPEN_NEXT_DIR });
var NextConfig = { "env": {}, "webpack": null, "typescript": { "ignoreBuildErrors": false }, "typedRoutes": false, "distDir": ".next", "cleanDistDir": true, "assetPrefix": "", "cacheMaxMemorySize": 52428800, "configOrigin": "next.config.ts", "useFileSystemPublicRoutes": true, "generateEtags": true, "pageExtensions": ["tsx", "ts", "jsx", "js"], "poweredByHeader": true, "compress": true, "images": { "deviceSizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840], "imageSizes": [32, 48, 64, 96, 128, 256, 384], "path": "/_next/image", "loader": "default", "loaderFile": "", "domains": [], "disableStaticImages": false, "minimumCacheTTL": 14400, "formats": ["image/webp"], "maximumRedirects": 3, "maximumResponseBody": 5e7, "dangerouslyAllowLocalIP": false, "dangerouslyAllowSVG": false, "contentSecurityPolicy": "script-src 'none'; frame-src 'none'; sandbox;", "contentDispositionType": "attachment", "localPatterns": [{ "pathname": "**", "search": "" }], "remotePatterns": [], "qualities": [75], "unoptimized": false, "customCacheHandler": false }, "devIndicators": { "position": "bottom-left" }, "onDemandEntries": { "maxInactiveAge": 6e4, "pagesBufferLength": 5 }, "basePath": "", "sassOptions": {}, "trailingSlash": false, "i18n": null, "productionBrowserSourceMaps": false, "excludeDefaultMomentLocales": true, "reactProductionProfiling": false, "reactStrictMode": true, "reactMaxHeadersLength": 6e3, "httpAgentOptions": { "keepAlive": true }, "logging": { "serverFunctions": true, "browserToTerminal": "warn" }, "compiler": {}, "expireTime": 31536e3, "staticPageGenerationTimeout": 60, "output": "standalone", "modularizeImports": { "@mui/icons-material": { "transform": "@mui/icons-material/{{member}}" }, "lodash": { "transform": "lodash/{{member}}" } }, "outputFileTracingRoot": "D:\\DEVELZY\\MPHM", "cacheComponents": false, "cacheLife": { "default": { "stale": 300, "revalidate": 900, "expire": 4294967294 }, "seconds": { "stale": 30, "revalidate": 1, "expire": 60 }, "minutes": { "stale": 300, "revalidate": 60, "expire": 3600 }, "hours": { "stale": 300, "revalidate": 3600, "expire": 86400 }, "days": { "stale": 300, "revalidate": 86400, "expire": 604800 }, "weeks": { "stale": 300, "revalidate": 604800, "expire": 2592e3 }, "max": { "stale": 300, "revalidate": 2592e3, "expire": 31536e3 } }, "cacheHandlers": {}, "experimental": { "appNewScrollHandler": false, "useSkewCookie": false, "cssChunking": true, "multiZoneDraftMode": false, "appNavFailHandling": false, "prerenderEarlyExit": true, "serverMinification": true, "linkNoTouchStart": false, "caseSensitiveRoutes": false, "cachedNavigations": false, "partialFallbacks": false, "dynamicOnHover": false, "varyParams": false, "prefetchInlining": false, "preloadEntriesOnStart": true, "clientRouterFilter": true, "clientRouterFilterRedirects": false, "fetchCacheKeyPrefix": "", "proxyPrefetch": "flexible", "optimisticClientCache": true, "manualClientBasePath": false, "cpus": 7, "memoryBasedWorkersCount": false, "imgOptConcurrency": null, "imgOptTimeoutInSeconds": 7, "imgOptMaxInputPixels": 268402689, "imgOptSequentialRead": null, "imgOptSkipMetadata": null, "isrFlushToDisk": true, "workerThreads": false, "optimizeCss": false, "nextScriptWorkers": false, "scrollRestoration": false, "externalDir": false, "disableOptimizedLoading": false, "gzipSize": true, "craCompat": false, "esmExternals": true, "fullySpecified": false, "swcTraceProfiling": false, "forceSwcTransforms": false, "largePageDataBytes": 128e3, "typedEnv": false, "parallelServerCompiles": false, "parallelServerBuildTraces": false, "ppr": false, "authInterrupts": false, "webpackMemoryOptimizations": false, "optimizeServerReact": true, "strictRouteTypes": false, "viewTransition": false, "removeUncaughtErrorAndRejectionListeners": false, "validateRSCRequestHeaders": false, "staleTimes": { "dynamic": 0, "static": 300 }, "reactDebugChannel": true, "serverComponentsHmrCache": true, "staticGenerationMaxConcurrency": 8, "staticGenerationMinPagesPerWorker": 25, "transitionIndicator": false, "gestureTransition": false, "inlineCss": false, "useCache": false, "globalNotFound": false, "browserDebugInfoInTerminal": "warn", "lockDistDir": true, "proxyClientMaxBodySize": 10485760, "hideLogsAfterAbort": false, "mcpServer": true, "turbopackFileSystemCacheForDev": true, "turbopackFileSystemCacheForBuild": false, "turbopackInferModuleSideEffects": true, "turbopackPluginRuntimeStrategy": "childProcesses", "optimizePackageImports": ["lucide-react", "date-fns", "lodash-es", "ramda", "antd", "react-bootstrap", "ahooks", "@ant-design/icons", "@headlessui/react", "@headlessui-float/react", "@heroicons/react/20/solid", "@heroicons/react/24/solid", "@heroicons/react/24/outline", "@visx/visx", "@tremor/react", "rxjs", "@mui/material", "@mui/icons-material", "recharts", "react-use", "effect", "@effect/schema", "@effect/platform", "@effect/platform-node", "@effect/platform-browser", "@effect/platform-bun", "@effect/sql", "@effect/sql-mssql", "@effect/sql-mysql2", "@effect/sql-pg", "@effect/sql-sqlite-node", "@effect/sql-sqlite-bun", "@effect/sql-sqlite-wasm", "@effect/sql-sqlite-react-native", "@effect/rpc", "@effect/rpc-http", "@effect/typeclass", "@effect/experimental", "@effect/opentelemetry", "@material-ui/core", "@material-ui/icons", "@tabler/icons-react", "mui-core", "react-icons/ai", "react-icons/bi", "react-icons/bs", "react-icons/cg", "react-icons/ci", "react-icons/di", "react-icons/fa", "react-icons/fa6", "react-icons/fc", "react-icons/fi", "react-icons/gi", "react-icons/go", "react-icons/gr", "react-icons/hi", "react-icons/hi2", "react-icons/im", "react-icons/io", "react-icons/io5", "react-icons/lia", "react-icons/lib", "react-icons/lu", "react-icons/md", "react-icons/pi", "react-icons/ri", "react-icons/rx", "react-icons/si", "react-icons/sl", "react-icons/tb", "react-icons/tfi", "react-icons/ti", "react-icons/vsc", "react-icons/wi"], "trustHostHeader": false, "isExperimentalCompile": false }, "htmlLimitedBots": "[\\w-]+-Google|Google-[\\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight", "bundlePagesRouterDependencies": false, "configFileName": "next.config.ts", "turbopack": { "root": "D:\\DEVELZY\\MPHM" }, "distDirRoot": ".next" };
var BuildId = "kOZct9EtBy807g4pkwDL1";
var RoutesManifest = { "basePath": "", "rewrites": { "beforeFiles": [], "afterFiles": [], "fallback": [] }, "redirects": [{ "source": "/:path+/", "destination": "/:path+", "internal": true, "priority": true, "statusCode": 308, "regex": "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$" }], "routes": { "static": [{ "page": "/", "regex": "^/(?:/)?$", "routeKeys": {}, "namedRegex": "^/(?:/)?$" }, { "page": "/_global-error", "regex": "^/_global\\-error(?:/)?$", "routeKeys": {}, "namedRegex": "^/_global\\-error(?:/)?$" }, { "page": "/_not-found", "regex": "^/_not\\-found(?:/)?$", "routeKeys": {}, "namedRegex": "^/_not\\-found(?:/)?$" }, { "page": "/api/v1/academic-years", "regex": "^/api/v1/academic\\-years(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/v1/academic\\-years(?:/)?$" }, { "page": "/api/v1/akhlaq", "regex": "^/api/v1/akhlaq(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/v1/akhlaq(?:/)?$" }, { "page": "/api/v1/attendance", "regex": "^/api/v1/attendance(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/v1/attendance(?:/)?$" }, { "page": "/api/v1/audit-logs", "regex": "^/api/v1/audit\\-logs(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/v1/audit\\-logs(?:/)?$" }, { "page": "/api/v1/auth/login", "regex": "^/api/v1/auth/login(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/v1/auth/login(?:/)?$" }, { "page": "/api/v1/auth/logout", "regex": "^/api/v1/auth/logout(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/v1/auth/logout(?:/)?$" }, { "page": "/api/v1/auth/me", "regex": "^/api/v1/auth/me(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/v1/auth/me(?:/)?$" }, { "page": "/api/v1/classes", "regex": "^/api/v1/classes(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/v1/classes(?:/)?$" }, { "page": "/api/v1/classes/import", "regex": "^/api/v1/classes/import(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/v1/classes/import(?:/)?$" }, { "page": "/api/v1/cron/cleanup", "regex": "^/api/v1/cron/cleanup(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/v1/cron/cleanup(?:/)?$" }, { "page": "/api/v1/curriculums", "regex": "^/api/v1/curriculums(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/v1/curriculums(?:/)?$" }, { "page": "/api/v1/dashboard/admin", "regex": "^/api/v1/dashboard/admin(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/v1/dashboard/admin(?:/)?$" }, { "page": "/api/v1/promotions", "regex": "^/api/v1/promotions(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/v1/promotions(?:/)?$" }, { "page": "/api/v1/recycle-bin", "regex": "^/api/v1/recycle\\-bin(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/v1/recycle\\-bin(?:/)?$" }, { "page": "/api/v1/schedules", "regex": "^/api/v1/schedules(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/v1/schedules(?:/)?$" }, { "page": "/api/v1/score-sessions", "regex": "^/api/v1/score\\-sessions(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/v1/score\\-sessions(?:/)?$" }, { "page": "/api/v1/scores", "regex": "^/api/v1/scores(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/v1/scores(?:/)?$" }, { "page": "/api/v1/semesters", "regex": "^/api/v1/semesters(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/v1/semesters(?:/)?$" }, { "page": "/api/v1/students", "regex": "^/api/v1/students(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/v1/students(?:/)?$" }, { "page": "/api/v1/students/import", "regex": "^/api/v1/students/import(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/v1/students/import(?:/)?$" }, { "page": "/api/v1/subjects", "regex": "^/api/v1/subjects(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/v1/subjects(?:/)?$" }, { "page": "/api/v1/subjects/import", "regex": "^/api/v1/subjects/import(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/v1/subjects/import(?:/)?$" }, { "page": "/api/v1/users", "regex": "^/api/v1/users(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/v1/users(?:/)?$" }, { "page": "/api/v1/users/import", "regex": "^/api/v1/users/import(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/v1/users/import(?:/)?$" }, { "page": "/dashboard", "regex": "^/dashboard(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard(?:/)?$" }, { "page": "/dashboard/akademik", "regex": "^/dashboard/akademik(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/akademik(?:/)?$" }, { "page": "/dashboard/akademik/absensi", "regex": "^/dashboard/akademik/absensi(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/akademik/absensi(?:/)?$" }, { "page": "/dashboard/akademik/akhlaq", "regex": "^/dashboard/akademik/akhlaq(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/akademik/akhlaq(?:/)?$" }, { "page": "/dashboard/akademik/jadwal", "regex": "^/dashboard/akademik/jadwal(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/akademik/jadwal(?:/)?$" }, { "page": "/dashboard/akademik/kelas", "regex": "^/dashboard/akademik/kelas(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/akademik/kelas(?:/)?$" }, { "page": "/dashboard/akademik/kurikulum", "regex": "^/dashboard/akademik/kurikulum(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/akademik/kurikulum(?:/)?$" }, { "page": "/dashboard/akademik/mata-pelajaran", "regex": "^/dashboard/akademik/mata\\-pelajaran(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/akademik/mata\\-pelajaran(?:/)?$" }, { "page": "/dashboard/akademik/nilai", "regex": "^/dashboard/akademik/nilai(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/akademik/nilai(?:/)?$" }, { "page": "/dashboard/akademik/promosi", "regex": "^/dashboard/akademik/promosi(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/akademik/promosi(?:/)?$" }, { "page": "/dashboard/akademik/semester", "regex": "^/dashboard/akademik/semester(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/akademik/semester(?:/)?$" }, { "page": "/dashboard/akademik/siswi", "regex": "^/dashboard/akademik/siswi(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/akademik/siswi(?:/)?$" }, { "page": "/dashboard/akademik/tahun-ajaran", "regex": "^/dashboard/akademik/tahun\\-ajaran(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/akademik/tahun\\-ajaran(?:/)?$" }, { "page": "/dashboard/audit", "regex": "^/dashboard/audit(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/audit(?:/)?$" }, { "page": "/dashboard/pengaturan", "regex": "^/dashboard/pengaturan(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/pengaturan(?:/)?$" }, { "page": "/dashboard/pengguna", "regex": "^/dashboard/pengguna(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/pengguna(?:/)?$" }, { "page": "/dashboard/pengguna/roles", "regex": "^/dashboard/pengguna/roles(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/pengguna/roles(?:/)?$" }, { "page": "/dashboard/recycle-bin", "regex": "^/dashboard/recycle\\-bin(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/recycle\\-bin(?:/)?$" }, { "page": "/icon.png", "regex": "^/icon\\.png(?:/)?$", "routeKeys": {}, "namedRegex": "^/icon\\.png(?:/)?$" }, { "page": "/login", "regex": "^/login(?:/)?$", "routeKeys": {}, "namedRegex": "^/login(?:/)?$" }], "dynamic": [{ "page": "/api/v1/academic-years/[id]", "regex": "^/api/v1/academic\\-years/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/v1/academic\\-years/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/v1/academic-years/[id]/clone", "regex": "^/api/v1/academic\\-years/([^/]+?)/clone(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/v1/academic\\-years/(?<nxtPid>[^/]+?)/clone(?:/)?$" }, { "page": "/api/v1/academic-years/[id]/workflow", "regex": "^/api/v1/academic\\-years/([^/]+?)/workflow(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/v1/academic\\-years/(?<nxtPid>[^/]+?)/workflow(?:/)?$" }, { "page": "/api/v1/classes/[id]", "regex": "^/api/v1/classes/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/v1/classes/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/v1/curriculums/[id]", "regex": "^/api/v1/curriculums/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/v1/curriculums/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/v1/curriculums/[id]/subjects", "regex": "^/api/v1/curriculums/([^/]+?)/subjects(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/v1/curriculums/(?<nxtPid>[^/]+?)/subjects(?:/)?$" }, { "page": "/api/v1/semesters/[id]", "regex": "^/api/v1/semesters/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/v1/semesters/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/v1/semesters/[id]/activate", "regex": "^/api/v1/semesters/([^/]+?)/activate(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/v1/semesters/(?<nxtPid>[^/]+?)/activate(?:/)?$" }, { "page": "/api/v1/students/[id]", "regex": "^/api/v1/students/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/v1/students/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/v1/subjects/[id]", "regex": "^/api/v1/subjects/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/v1/subjects/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/v1/users/[id]", "regex": "^/api/v1/users/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/v1/users/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/dashboard/akademik/nilai/[id]", "regex": "^/dashboard/akademik/nilai/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/dashboard/akademik/nilai/(?<nxtPid>[^/]+?)(?:/)?$" }], "data": { "static": [], "dynamic": [] } }, "locales": [] };
var ConfigHeaders = [{ "source": "/(.*)", "headers": [{ "key": "X-DNS-Prefetch-Control", "value": "on" }, { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" }, { "key": "X-XSS-Protection", "value": "1; mode=block" }, { "key": "X-Frame-Options", "value": "SAMEORIGIN" }, { "key": "X-Content-Type-Options", "value": "nosniff" }, { "key": "Referrer-Policy", "value": "origin-when-cross-origin" }], "regex": "^(?:/(.*))(?:/)?$" }];
var PrerenderManifest = { "version": 4, "routes": { "/": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/", "dataRoute": "/index.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/_global-error": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/_global-error", "dataRoute": "/_global-error.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/_not-found": { "initialStatus": 404, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/_not-found", "dataRoute": "/_not-found.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard", "dataRoute": "/dashboard.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard/akademik": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/akademik", "dataRoute": "/dashboard/akademik.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard/akademik/absensi": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/akademik/absensi", "dataRoute": "/dashboard/akademik/absensi.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard/akademik/akhlaq": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/akademik/akhlaq", "dataRoute": "/dashboard/akademik/akhlaq.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard/akademik/jadwal": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/akademik/jadwal", "dataRoute": "/dashboard/akademik/jadwal.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard/akademik/kelas": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/akademik/kelas", "dataRoute": "/dashboard/akademik/kelas.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard/akademik/kurikulum": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/akademik/kurikulum", "dataRoute": "/dashboard/akademik/kurikulum.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard/akademik/mata-pelajaran": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/akademik/mata-pelajaran", "dataRoute": "/dashboard/akademik/mata-pelajaran.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard/akademik/nilai": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/akademik/nilai", "dataRoute": "/dashboard/akademik/nilai.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard/akademik/promosi": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/akademik/promosi", "dataRoute": "/dashboard/akademik/promosi.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard/akademik/semester": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/akademik/semester", "dataRoute": "/dashboard/akademik/semester.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard/akademik/siswi": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/akademik/siswi", "dataRoute": "/dashboard/akademik/siswi.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard/akademik/tahun-ajaran": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/akademik/tahun-ajaran", "dataRoute": "/dashboard/akademik/tahun-ajaran.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard/audit": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/audit", "dataRoute": "/dashboard/audit.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard/pengaturan": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/pengaturan", "dataRoute": "/dashboard/pengaturan.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard/pengguna": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/pengguna", "dataRoute": "/dashboard/pengguna.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard/pengguna/roles": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/pengguna/roles", "dataRoute": "/dashboard/pengguna/roles.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard/recycle-bin": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/recycle-bin", "dataRoute": "/dashboard/recycle-bin.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/icon.png": { "initialHeaders": { "cache-control": "public, max-age=0, must-revalidate", "content-type": "image/png", "x-next-cache-tags": "_N_T_/layout,_N_T_/icon.png/layout,_N_T_/icon.png/route,_N_T_/icon.png" }, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/icon.png", "dataRoute": null, "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/login": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/login", "dataRoute": "/login.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] } }, "dynamicRoutes": {}, "notFoundRoutes": [], "preview": { "previewModeId": "897e86b9aa082b2b3c10f82cdf9e4e38", "previewModeSigningKey": "e706614c80892ab387521728cde24218e6dd6217008b2db9d38a018df0ef10f5", "previewModeEncryptionKey": "ff2eec11497b274f12dda1ed099a3b76e9a49755e7270f68581c2edf38b73319" } };
var MiddlewareManifest = { "version": 3, "middleware": { "/": { "files": ["server/edge-runtime-webpack.js", "server/src/middleware.js"], "entrypoint": "server/src/middleware.js", "name": "src/middleware", "page": "/", "matchers": [{ "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!api|_next\\/static|_next\\/image|favicon.ico).*))(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$", "originalSource": "/((?!api|_next/static|_next/image|favicon.ico).*)" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "kOZct9EtBy807g4pkwDL1", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "5BJbqGEVa2kau9CFox36aW6V9ySz6nJEkKV325xMG3g=", "__NEXT_PREVIEW_MODE_ID": "897e86b9aa082b2b3c10f82cdf9e4e38", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "e706614c80892ab387521728cde24218e6dd6217008b2db9d38a018df0ef10f5", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "ff2eec11497b274f12dda1ed099a3b76e9a49755e7270f68581c2edf38b73319" } } }, "functions": {}, "sortedMiddleware": ["/"] };
var AppPathRoutesManifest = { "/_not-found/page": "/_not-found", "/_global-error/page": "/_global-error", "/api/v1/academic-years/[id]/clone/route": "/api/v1/academic-years/[id]/clone", "/api/v1/academic-years/[id]/route": "/api/v1/academic-years/[id]", "/api/v1/academic-years/[id]/workflow/route": "/api/v1/academic-years/[id]/workflow", "/api/v1/academic-years/route": "/api/v1/academic-years", "/api/v1/akhlaq/route": "/api/v1/akhlaq", "/api/v1/attendance/route": "/api/v1/attendance", "/api/v1/audit-logs/route": "/api/v1/audit-logs", "/api/v1/auth/login/route": "/api/v1/auth/login", "/api/v1/auth/logout/route": "/api/v1/auth/logout", "/api/v1/auth/me/route": "/api/v1/auth/me", "/api/v1/classes/[id]/route": "/api/v1/classes/[id]", "/api/v1/classes/import/route": "/api/v1/classes/import", "/api/v1/classes/route": "/api/v1/classes", "/api/v1/cron/cleanup/route": "/api/v1/cron/cleanup", "/api/v1/curriculums/[id]/route": "/api/v1/curriculums/[id]", "/api/v1/curriculums/[id]/subjects/route": "/api/v1/curriculums/[id]/subjects", "/api/v1/curriculums/route": "/api/v1/curriculums", "/api/v1/dashboard/admin/route": "/api/v1/dashboard/admin", "/api/v1/promotions/route": "/api/v1/promotions", "/api/v1/recycle-bin/route": "/api/v1/recycle-bin", "/api/v1/schedules/route": "/api/v1/schedules", "/api/v1/score-sessions/route": "/api/v1/score-sessions", "/api/v1/scores/route": "/api/v1/scores", "/api/v1/semesters/[id]/activate/route": "/api/v1/semesters/[id]/activate", "/api/v1/semesters/[id]/route": "/api/v1/semesters/[id]", "/api/v1/semesters/route": "/api/v1/semesters", "/api/v1/students/[id]/route": "/api/v1/students/[id]", "/api/v1/students/import/route": "/api/v1/students/import", "/api/v1/students/route": "/api/v1/students", "/api/v1/subjects/[id]/route": "/api/v1/subjects/[id]", "/api/v1/subjects/import/route": "/api/v1/subjects/import", "/api/v1/subjects/route": "/api/v1/subjects", "/api/v1/users/[id]/route": "/api/v1/users/[id]", "/api/v1/users/import/route": "/api/v1/users/import", "/api/v1/users/route": "/api/v1/users", "/icon.png/route": "/icon.png", "/(auth)/login/page": "/login", "/page": "/", "/dashboard/akademik/absensi/page": "/dashboard/akademik/absensi", "/dashboard/akademik/akhlaq/page": "/dashboard/akademik/akhlaq", "/dashboard/akademik/jadwal/page": "/dashboard/akademik/jadwal", "/dashboard/akademik/kelas/page": "/dashboard/akademik/kelas", "/dashboard/akademik/kurikulum/page": "/dashboard/akademik/kurikulum", "/dashboard/akademik/mata-pelajaran/page": "/dashboard/akademik/mata-pelajaran", "/dashboard/akademik/nilai/[id]/page": "/dashboard/akademik/nilai/[id]", "/dashboard/akademik/nilai/page": "/dashboard/akademik/nilai", "/dashboard/akademik/page": "/dashboard/akademik", "/dashboard/akademik/promosi/page": "/dashboard/akademik/promosi", "/dashboard/akademik/semester/page": "/dashboard/akademik/semester", "/dashboard/akademik/siswi/page": "/dashboard/akademik/siswi", "/dashboard/akademik/tahun-ajaran/page": "/dashboard/akademik/tahun-ajaran", "/dashboard/audit/page": "/dashboard/audit", "/dashboard/page": "/dashboard", "/dashboard/pengaturan/page": "/dashboard/pengaturan", "/dashboard/pengguna/page": "/dashboard/pengguna", "/dashboard/pengguna/roles/page": "/dashboard/pengguna/roles", "/dashboard/recycle-bin/page": "/dashboard/recycle-bin" };
var FunctionsConfigManifest = { "version": 1, "functions": {} };
var PagesManifest = { "/404": "pages/404.html", "/500": "pages/500.html" };
process.env.NEXT_BUILD_ID = BuildId;
process.env.OPEN_NEXT_BUILD_ID = NextConfig.deploymentId ?? BuildId;
process.env.NEXT_PREVIEW_MODE_ID = PrerenderManifest?.preview?.previewModeId;

// node_modules/@opennextjs/aws/dist/http/openNextResponse.js
init_logger();
init_util();
import { Transform } from "node:stream";

// node_modules/@opennextjs/aws/dist/core/routing/util.js
init_util();
init_logger();
import { ReadableStream as ReadableStream3 } from "node:stream/web";

// node_modules/@opennextjs/aws/dist/utils/binary.js
var commonBinaryMimeTypes = /* @__PURE__ */ new Set([
  "application/octet-stream",
  // Docs
  "application/epub+zip",
  "application/msword",
  "application/pdf",
  "application/rtf",
  "application/vnd.amazon.ebook",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Fonts
  "font/otf",
  "font/woff",
  "font/woff2",
  // Images
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/vnd.microsoft.icon",
  "image/webp",
  // Audio
  "audio/3gpp",
  "audio/aac",
  "audio/basic",
  "audio/flac",
  "audio/mpeg",
  "audio/ogg",
  "audio/wavaudio/webm",
  "audio/x-aiff",
  "audio/x-midi",
  "audio/x-wav",
  // Video
  "video/3gpp",
  "video/mp2t",
  "video/mpeg",
  "video/ogg",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
  // Archives
  "application/java-archive",
  "application/vnd.apple.installer+xml",
  "application/x-7z-compressed",
  "application/x-apple-diskimage",
  "application/x-bzip",
  "application/x-bzip2",
  "application/x-gzip",
  "application/x-java-archive",
  "application/x-rar-compressed",
  "application/x-tar",
  "application/x-zip",
  "application/zip",
  // Serialized data
  "application/x-protobuf"
]);
function isBinaryContentType(contentType) {
  if (!contentType)
    return false;
  const value = contentType.split(";")[0];
  return commonBinaryMimeTypes.has(value);
}

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/i18n/accept-header.js
function parse(raw, preferences, options) {
  const lowers = /* @__PURE__ */ new Map();
  const header = raw.replace(/[ \t]/g, "");
  if (preferences) {
    let pos = 0;
    for (const preference of preferences) {
      const lower = preference.toLowerCase();
      lowers.set(lower, { orig: preference, pos: pos++ });
      if (options.prefixMatch) {
        const parts2 = lower.split("-");
        while (parts2.pop(), parts2.length > 0) {
          const joined = parts2.join("-");
          if (!lowers.has(joined)) {
            lowers.set(joined, { orig: preference, pos: pos++ });
          }
        }
      }
    }
  }
  const parts = header.split(",");
  const selections = [];
  const map = /* @__PURE__ */ new Set();
  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];
    if (!part) {
      continue;
    }
    const params = part.split(";");
    if (params.length > 2) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const token = params[0].toLowerCase();
    if (!token) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const selection = { token, pos: i, q: 1 };
    if (preferences && lowers.has(token)) {
      selection.pref = lowers.get(token).pos;
    }
    map.add(selection.token);
    if (params.length === 2) {
      const q = params[1];
      const [key, value] = q.split("=");
      if (!value || key !== "q" && key !== "Q") {
        throw new Error(`Invalid ${options.type} header`);
      }
      const score = Number.parseFloat(value);
      if (score === 0) {
        continue;
      }
      if (Number.isFinite(score) && score <= 1 && score >= 1e-3) {
        selection.q = score;
      }
    }
    selections.push(selection);
  }
  selections.sort((a, b) => {
    if (b.q !== a.q) {
      return b.q - a.q;
    }
    if (b.pref !== a.pref) {
      if (a.pref === void 0) {
        return 1;
      }
      if (b.pref === void 0) {
        return -1;
      }
      return a.pref - b.pref;
    }
    return a.pos - b.pos;
  });
  const values = selections.map((selection) => selection.token);
  if (!preferences || !preferences.length) {
    return values;
  }
  const preferred = [];
  for (const selection of values) {
    if (selection === "*") {
      for (const [preference, value] of lowers) {
        if (!map.has(preference)) {
          preferred.push(value.orig);
        }
      }
    } else {
      const lower = selection.toLowerCase();
      if (lowers.has(lower)) {
        preferred.push(lowers.get(lower).orig);
      }
    }
  }
  return preferred;
}
function acceptLanguage(header = "", preferences) {
  return parse(header, preferences, {
    type: "accept-language",
    prefixMatch: true
  })[0] || void 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
function isLocalizedPath(path3) {
  return NextConfig.i18n?.locales.includes(path3.split("/")[1].toLowerCase()) ?? false;
}
function getLocaleFromCookie(cookies) {
  const i18n = NextConfig.i18n;
  const nextLocale = cookies.NEXT_LOCALE?.toLowerCase();
  return nextLocale ? i18n?.locales.find((locale) => nextLocale === locale.toLowerCase()) : void 0;
}
function detectDomainLocale({ hostname, detectedLocale }) {
  const i18n = NextConfig.i18n;
  const domains = i18n?.domains;
  if (!domains) {
    return;
  }
  const lowercasedLocale = detectedLocale?.toLowerCase();
  for (const domain of domains) {
    const domainHostname = domain.domain.split(":", 1)[0].toLowerCase();
    if (hostname === domainHostname || lowercasedLocale === domain.defaultLocale.toLowerCase() || domain.locales?.some((locale) => lowercasedLocale === locale.toLowerCase())) {
      return domain;
    }
  }
}
function detectLocale(internalEvent, i18n) {
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  if (i18n.localeDetection === false) {
    return domainLocale?.defaultLocale ?? i18n.defaultLocale;
  }
  const cookiesLocale = getLocaleFromCookie(internalEvent.cookies);
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  debug({
    cookiesLocale,
    preferredLocale,
    defaultLocale: i18n.defaultLocale,
    domainLocale
  });
  return domainLocale?.defaultLocale ?? cookiesLocale ?? preferredLocale ?? i18n.defaultLocale;
}
function localizePath(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n) {
    return internalEvent.rawPath;
  }
  if (isLocalizedPath(internalEvent.rawPath)) {
    return internalEvent.rawPath;
  }
  const detectedLocale = detectLocale(internalEvent, i18n);
  return `/${detectedLocale}${internalEvent.rawPath}`;
}
function handleLocaleRedirect(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n || i18n.localeDetection === false || internalEvent.rawPath !== "/") {
    return false;
  }
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  const detectedLocale = detectLocale(internalEvent, i18n);
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  const preferredDomain = detectDomainLocale({
    detectedLocale: preferredLocale
  });
  if (domainLocale && preferredDomain) {
    const isPDomain = preferredDomain.domain === domainLocale.domain;
    const isPLocale = preferredDomain.defaultLocale === preferredLocale;
    if (!isPDomain || !isPLocale) {
      const scheme = `http${preferredDomain.http ? "" : "s"}`;
      const rlocale = isPLocale ? "" : preferredLocale;
      return {
        type: "core",
        statusCode: 307,
        headers: {
          Location: `${scheme}://${preferredDomain.domain}/${rlocale}`
        },
        body: emptyReadableStream(),
        isBase64Encoded: false
      };
    }
  }
  const defaultLocale = domainLocale?.defaultLocale ?? i18n.defaultLocale;
  if (detectedLocale.toLowerCase() !== defaultLocale.toLowerCase()) {
    const nextUrl = constructNextUrl(internalEvent.url, `/${detectedLocale}${NextConfig.trailingSlash ? "/" : ""}`);
    const queryString = convertToQueryString(internalEvent.query);
    return {
      type: "core",
      statusCode: 307,
      headers: {
        Location: `${nextUrl}${queryString}`
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}

// node_modules/@opennextjs/aws/dist/core/routing/queue.js
function generateShardId(rawPath, maxConcurrency, prefix) {
  let a = cyrb128(rawPath);
  let t = a += 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  const randomFloat = ((t ^ t >>> 14) >>> 0) / 4294967296;
  const randomInt = Math.floor(randomFloat * maxConcurrency);
  return `${prefix}-${randomInt}`;
}
function generateMessageGroupId(rawPath) {
  const maxConcurrency = Number.parseInt(process.env.MAX_REVALIDATE_CONCURRENCY ?? "10");
  return generateShardId(rawPath, maxConcurrency, "revalidate");
}
function cyrb128(str) {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ h1 >>> 18, 597399067);
  h2 = Math.imul(h4 ^ h2 >>> 22, 2869860233);
  h3 = Math.imul(h1 ^ h3 >>> 17, 951274213);
  h4 = Math.imul(h2 ^ h4 >>> 19, 2716044179);
  h1 ^= h2 ^ h3 ^ h4, h2 ^= h1, h3 ^= h1, h4 ^= h1;
  return h1 >>> 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/util.js
function isExternal(url, host) {
  if (!url)
    return false;
  const pattern = /^https?:\/\//;
  if (!pattern.test(url))
    return false;
  if (host) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.host !== host;
    } catch {
      return !url.includes(host);
    }
  }
  return true;
}
function convertFromQueryString(query) {
  if (query === "")
    return {};
  const queryParts = query.split("&");
  return getQueryFromIterator(queryParts.map((p) => {
    const [key, value] = p.split("=");
    return [key, value];
  }));
}
function getUrlParts(url, isExternal2) {
  if (!isExternal2) {
    const regex2 = /\/([^?]*)\??(.*)/;
    const match3 = url.match(regex2);
    return {
      hostname: "",
      pathname: match3?.[1] ? `/${match3[1]}` : url,
      protocol: "",
      queryString: match3?.[2] ?? ""
    };
  }
  const regex = /^(https?:)\/\/?([^\/\s]+)(\/[^?]*)?(\?.*)?/;
  const match2 = url.match(regex);
  if (!match2) {
    throw new Error(`Invalid external URL: ${url}`);
  }
  return {
    protocol: match2[1] ?? "https:",
    hostname: match2[2],
    pathname: match2[3] ?? "",
    queryString: match2[4]?.slice(1) ?? ""
  };
}
function constructNextUrl(baseUrl, path3) {
  const nextBasePath = NextConfig.basePath ?? "";
  const url = new URL(`${nextBasePath}${path3}`, baseUrl);
  return url.href;
}
function convertToQueryString(query) {
  const queryStrings = [];
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => queryStrings.push(`${key}=${entry}`));
    } else {
      queryStrings.push(`${key}=${value}`);
    }
  });
  return queryStrings.length > 0 ? `?${queryStrings.join("&")}` : "";
}
function getMiddlewareMatch(middlewareManifest2, functionsManifest) {
  if (functionsManifest?.functions?.["/_middleware"]) {
    return functionsManifest.functions["/_middleware"].matchers?.map(({ regexp }) => new RegExp(regexp)) ?? [/.*/];
  }
  const rootMiddleware = middlewareManifest2.middleware["/"];
  if (!rootMiddleware?.matchers)
    return [];
  return rootMiddleware.matchers.map(({ regexp }) => new RegExp(regexp));
}
function escapeRegex(str, { isPath } = {}) {
  const result = str.replaceAll("(.)", "_\xB51_").replaceAll("(..)", "_\xB52_").replaceAll("(...)", "_\xB53_");
  return isPath ? result : result.replaceAll("+", "_\xB54_");
}
function unescapeRegex(str) {
  return str.replaceAll("_\xB51_", "(.)").replaceAll("_\xB52_", "(..)").replaceAll("_\xB53_", "(...)").replaceAll("_\xB54_", "+");
}
function convertBodyToReadableStream(method, body) {
  if (method === "GET" || method === "HEAD")
    return void 0;
  if (!body)
    return void 0;
  return new ReadableStream3({
    start(controller) {
      controller.enqueue(body);
      controller.close();
    }
  });
}
var CommonHeaders;
(function(CommonHeaders2) {
  CommonHeaders2["CACHE_CONTROL"] = "cache-control";
  CommonHeaders2["NEXT_CACHE"] = "x-nextjs-cache";
})(CommonHeaders || (CommonHeaders = {}));
function normalizeLocationHeader(location, baseUrl, encodeQuery = false) {
  if (!URL.canParse(location)) {
    return location;
  }
  const locationURL = new URL(location);
  const origin = new URL(baseUrl).origin;
  let search = locationURL.search;
  if (encodeQuery && search) {
    search = `?${stringifyQs(parseQs(search.slice(1)))}`;
  }
  const href = `${locationURL.origin}${locationURL.pathname}${search}${locationURL.hash}`;
  if (locationURL.origin === origin) {
    return href.slice(origin.length);
  }
  return href;
}

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
import { createHash } from "node:crypto";
init_stream();

// node_modules/@opennextjs/aws/dist/utils/cache.js
init_logger();

// node_modules/@opennextjs/aws/dist/utils/semver.js
function compareSemver(v1, operator, v2) {
  let versionDiff = 0;
  if (v1 === "latest") {
    versionDiff = 1;
  } else {
    if (/^[^\d]/.test(v1)) {
      v1 = v1.substring(1);
    }
    if (/^[^\d]/.test(v2)) {
      v2 = v2.substring(1);
    }
    const [major1, minor1 = 0, patch1 = 0] = v1.split(".").map(Number);
    const [major2, minor2 = 0, patch2 = 0] = v2.split(".").map(Number);
    if (Number.isNaN(major1) || Number.isNaN(major2)) {
      throw new Error("The major version is required.");
    }
    if (major1 !== major2) {
      versionDiff = major1 - major2;
    } else if (minor1 !== minor2) {
      versionDiff = minor1 - minor2;
    } else if (patch1 !== patch2) {
      versionDiff = patch1 - patch2;
    }
  }
  switch (operator) {
    case "=":
      return versionDiff === 0;
    case ">=":
      return versionDiff >= 0;
    case "<=":
      return versionDiff <= 0;
    case ">":
      return versionDiff > 0;
    case "<":
      return versionDiff < 0;
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}

// node_modules/@opennextjs/aws/dist/utils/cache.js
async function isStale(key, tags, lastModified) {
  if (!compareSemver(globalThis.nextVersion, ">=", "16.0.0")) {
    return false;
  }
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  if (globalThis.tagCache.mode === "nextMode") {
    return tags.length === 0 ? false : await globalThis.tagCache.isStale?.(tags, lastModified) ?? false;
  }
  return await globalThis.tagCache.isStale?.(key, lastModified) ?? false;
}
async function hasBeenRevalidated(key, tags, cacheEntry) {
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  const value = cacheEntry.value;
  if (!value) {
    return true;
  }
  if ("type" in cacheEntry && cacheEntry.type === "page") {
    return false;
  }
  const lastModified = cacheEntry.lastModified ?? Date.now();
  if (globalThis.tagCache.mode === "nextMode") {
    return tags.length === 0 ? false : await globalThis.tagCache.hasBeenRevalidated(tags, lastModified);
  }
  const _lastModified = await globalThis.tagCache.getLastModified(key, lastModified);
  return _lastModified === -1;
}
function getTagsFromValue(value) {
  if (!value) {
    return [];
  }
  try {
    const cacheTags = value.meta?.headers?.["x-next-cache-tags"]?.split(",") ?? [];
    delete value.meta?.headers?.["x-next-cache-tags"];
    return cacheTags;
  } catch (e) {
    return [];
  }
}

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
init_logger();
var CACHE_ONE_YEAR = 60 * 60 * 24 * 365;
var CACHE_ONE_MONTH = 60 * 60 * 24 * 30;
var VARY_HEADER = "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Next-Url";
var NEXT_SEGMENT_PREFETCH_HEADER = "next-router-segment-prefetch";
var NEXT_PRERENDER_HEADER = "x-nextjs-prerender";
var NEXT_POSTPONED_HEADER = "x-nextjs-postponed";
async function computeCacheControl(path3, body, host, revalidate, lastModified, isStaleFromTagCache = false) {
  let finalRevalidate = CACHE_ONE_YEAR;
  const existingRoute = Object.entries(PrerenderManifest?.routes ?? {}).find((p) => p[0] === path3)?.[1];
  if (revalidate === void 0 && existingRoute) {
    finalRevalidate = existingRoute.initialRevalidateSeconds === false ? CACHE_ONE_YEAR : existingRoute.initialRevalidateSeconds;
  } else if (revalidate !== void 0) {
    finalRevalidate = revalidate === false ? CACHE_ONE_YEAR : revalidate;
  }
  const age = Math.round((Date.now() - (lastModified ?? 0)) / 1e3);
  const hash = (str) => createHash("md5").update(str).digest("hex");
  const etag = hash(body);
  if (revalidate === 0) {
    return {
      "cache-control": "private, no-cache, no-store, max-age=0, must-revalidate",
      "x-opennext-cache": "ERROR",
      etag
    };
  }
  const isSSG = finalRevalidate === CACHE_ONE_YEAR;
  const remainingTtl = Math.max(finalRevalidate - age, 1);
  const isStaleFromTime = !isSSG && remainingTtl === 1;
  const isStale2 = isStaleFromTime || isStaleFromTagCache;
  if (!isSSG || isStaleFromTagCache) {
    const sMaxAge = isStaleFromTagCache ? 1 : remainingTtl;
    debug("sMaxAge", {
      finalRevalidate,
      age,
      lastModified,
      revalidate,
      isStaleFromTagCache
    });
    if (isStale2) {
      let url = NextConfig.trailingSlash ? `${path3}/` : path3;
      if (NextConfig.basePath) {
        url = `${NextConfig.basePath}${url}`;
      }
      await globalThis.queue.send({
        MessageBody: {
          host,
          url,
          eTag: etag,
          lastModified: lastModified ?? Date.now()
        },
        MessageDeduplicationId: hash(`${path3}-${lastModified}-${etag}`),
        MessageGroupId: generateMessageGroupId(path3)
      });
    }
    return {
      "cache-control": `s-maxage=${sMaxAge}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
      "x-opennext-cache": isStale2 ? "STALE" : "HIT",
      etag
    };
  }
  return {
    "cache-control": `s-maxage=${CACHE_ONE_YEAR}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
    "x-opennext-cache": "HIT",
    etag
  };
}
function getBodyForAppRouter(event, cachedValue) {
  if (cachedValue.type !== "app") {
    throw new Error("getBodyForAppRouter called with non-app cache value");
  }
  try {
    const segmentHeader = `${event.headers[NEXT_SEGMENT_PREFETCH_HEADER]}`;
    const isSegmentResponse = Boolean(segmentHeader) && segmentHeader in (cachedValue.segmentData || {}) && !NextConfig.experimental?.prefetchInlining;
    const body = isSegmentResponse ? cachedValue.segmentData[segmentHeader] : cachedValue.rsc;
    return {
      body,
      additionalHeaders: isSegmentResponse ? { [NEXT_PRERENDER_HEADER]: "1", [NEXT_POSTPONED_HEADER]: "2" } : {}
    };
  } catch (e) {
    error("Error while getting body for app router from cache:", e);
    return { body: cachedValue.rsc, additionalHeaders: {} };
  }
}
async function generateResult(event, localizedPath, cachedValue, lastModified, isStaleFromTagCache = false) {
  debug("Returning result from experimental cache");
  let body = "";
  let type = "application/octet-stream";
  let isDataRequest = false;
  let additionalHeaders = {};
  if (cachedValue.type === "app") {
    isDataRequest = event.headers.rsc === "1";
    if (isDataRequest) {
      const { body: appRouterBody, additionalHeaders: appHeaders } = getBodyForAppRouter(event, cachedValue);
      body = appRouterBody;
      additionalHeaders = appHeaders;
    } else {
      body = cachedValue.html;
    }
    type = isDataRequest ? "text/x-component" : "text/html; charset=utf-8";
  } else if (cachedValue.type === "page") {
    isDataRequest = Boolean(event.query.__nextDataReq);
    body = isDataRequest ? JSON.stringify(cachedValue.json) : cachedValue.html;
    type = isDataRequest ? "application/json" : "text/html; charset=utf-8";
  } else {
    throw new Error("generateResult called with unsupported cache value type, only 'app' and 'page' are supported");
  }
  const cacheControl = await computeCacheControl(localizedPath, body, event.headers.host, cachedValue.revalidate, lastModified, isStaleFromTagCache);
  return {
    type: "core",
    // Sometimes other status codes can be cached, like 404. For these cases, we should return the correct status code
    // Also set the status code to the rewriteStatusCode if defined
    // This can happen in handleMiddleware in routingHandler.
    // `NextResponse.rewrite(url, { status: xxx})
    // The rewrite status code should take precedence over the cached one
    statusCode: event.rewriteStatusCode ?? cachedValue.meta?.status ?? 200,
    body: toReadableStream(body, false),
    isBase64Encoded: false,
    headers: {
      ...cacheControl,
      "content-type": type,
      ...cachedValue.meta?.headers,
      vary: VARY_HEADER,
      ...additionalHeaders
    }
  };
}
function escapePathDelimiters(segment, escapeEncoded) {
  return segment.replace(new RegExp(`([/#?]${escapeEncoded ? "|%(2f|23|3f|5c)" : ""})`, "gi"), (char) => encodeURIComponent(char));
}
function decodePathParams(pathname) {
  return pathname.split("/").map((segment) => {
    try {
      return escapePathDelimiters(decodeURIComponent(segment), true);
    } catch (e) {
      return segment;
    }
  }).join("/");
}
async function cacheInterceptor(event) {
  if (Boolean(event.headers["next-action"]) || Boolean(event.headers["x-prerender-revalidate"]))
    return event;
  const cookies = event.headers.cookie || "";
  const hasPreviewData = cookies.includes("__prerender_bypass") || cookies.includes("__next_preview_data");
  if (hasPreviewData) {
    debug("Preview mode detected, passing through to handler");
    return event;
  }
  let localizedPath = localizePath(event);
  if (NextConfig.basePath) {
    localizedPath = localizedPath.replace(NextConfig.basePath, "");
  }
  localizedPath = localizedPath.replace(/\/$/, "");
  localizedPath = decodePathParams(localizedPath);
  debug("Checking cache for", localizedPath, PrerenderManifest);
  const isISR = Object.keys(PrerenderManifest?.routes ?? {}).includes(localizedPath ?? "/") || Object.values(PrerenderManifest?.dynamicRoutes ?? {}).some((dr) => new RegExp(dr.routeRegex).test(localizedPath));
  debug("isISR", isISR);
  if (isISR) {
    try {
      const cachedData = await globalThis.incrementalCache.get(localizedPath ?? "/index");
      debug("cached data in interceptor", cachedData);
      if (!cachedData?.value) {
        return event;
      }
      const tags = getTagsFromValue(cachedData.value);
      if (cachedData.value?.type === "app" || cachedData.value?.type === "route") {
        const _hasBeenRevalidated = cachedData.shouldBypassTagCache ? false : await hasBeenRevalidated(localizedPath, tags, cachedData);
        if (_hasBeenRevalidated) {
          return event;
        }
      }
      const _isStale = cachedData.shouldBypassTagCache ? false : await isStale(localizedPath, tags, cachedData.lastModified ?? Date.now());
      const host = event.headers.host;
      switch (cachedData?.value?.type) {
        case "app":
        case "page":
          return generateResult(event, localizedPath, cachedData.value, cachedData.lastModified, _isStale);
        case "redirect": {
          const cacheControl = await computeCacheControl(localizedPath, "", host, cachedData.value.revalidate, cachedData.lastModified, _isStale);
          return {
            type: "core",
            statusCode: cachedData.value.meta?.status ?? 307,
            body: emptyReadableStream(),
            headers: {
              ...cachedData.value.meta?.headers ?? {},
              ...cacheControl
            },
            isBase64Encoded: false
          };
        }
        case "route": {
          const cacheControl = await computeCacheControl(localizedPath, cachedData.value.body, host, cachedData.value.revalidate, cachedData.lastModified, _isStale);
          const isBinary = isBinaryContentType(String(cachedData.value.meta?.headers?.["content-type"]));
          return {
            type: "core",
            statusCode: event.rewriteStatusCode ?? cachedData.value.meta?.status ?? 200,
            body: toReadableStream(cachedData.value.body, isBinary),
            headers: {
              ...cacheControl,
              ...cachedData.value.meta?.headers,
              vary: VARY_HEADER
            },
            isBase64Encoded: isBinary
          };
        }
        default:
          return event;
      }
    } catch (e) {
      debug("Error while fetching cache", e);
      return event;
    }
  }
  return event;
}

// node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
function parse2(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path3 = "";
  var tryConsume = function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  };
  var mustConsume = function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  };
  var consumeText = function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  };
  var isSafe = function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  };
  var safePattern = function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  };
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path3 += prefix;
        prefix = "";
      }
      if (path3) {
        result.push(path3);
        path3 = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path3 += value;
      continue;
    }
    if (path3) {
      result.push(path3);
      path3 = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
function compile(str, options) {
  return tokensToFunction(parse2(str, options), options);
}
function tokensToFunction(tokens, options) {
  if (options === void 0) {
    options = {};
  }
  var reFlags = flags(options);
  var _a = options.encode, encode = _a === void 0 ? function(x) {
    return x;
  } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
  var matches = tokens.map(function(token) {
    if (typeof token === "object") {
      return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
    }
  });
  return function(data) {
    var path3 = "";
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (typeof token === "string") {
        path3 += token;
        continue;
      }
      var value = data ? data[token.name] : void 0;
      var optional = token.modifier === "?" || token.modifier === "*";
      var repeat = token.modifier === "*" || token.modifier === "+";
      if (Array.isArray(value)) {
        if (!repeat) {
          throw new TypeError('Expected "'.concat(token.name, '" to not repeat, but got an array'));
        }
        if (value.length === 0) {
          if (optional)
            continue;
          throw new TypeError('Expected "'.concat(token.name, '" to not be empty'));
        }
        for (var j = 0; j < value.length; j++) {
          var segment = encode(value[j], token);
          if (validate && !matches[i].test(segment)) {
            throw new TypeError('Expected all "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
          }
          path3 += token.prefix + segment + token.suffix;
        }
        continue;
      }
      if (typeof value === "string" || typeof value === "number") {
        var segment = encode(String(value), token);
        if (validate && !matches[i].test(segment)) {
          throw new TypeError('Expected "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
        }
        path3 += token.prefix + segment + token.suffix;
        continue;
      }
      if (optional)
        continue;
      var typeOfMessage = repeat ? "an array" : "a string";
      throw new TypeError('Expected "'.concat(token.name, '" to be ').concat(typeOfMessage));
    }
    return path3;
  };
}
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path3 = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    };
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path: path3, index, params };
  };
}
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
function regexpToRegexp(path3, keys) {
  if (!keys)
    return path3;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path3.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path3.source);
  }
  return path3;
}
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path3) {
    return pathToRegexp(path3, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
function stringToRegexp(path3, keys, options) {
  return tokensToRegexp(parse2(path3, options), keys, options);
}
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
function pathToRegexp(path3, keys, options) {
  if (path3 instanceof RegExp)
    return regexpToRegexp(path3, keys);
  if (Array.isArray(path3))
    return arrayToRegexp(path3, keys, options);
  return stringToRegexp(path3, keys, options);
}

// node_modules/@opennextjs/aws/dist/utils/normalize-path.js
import path2 from "node:path";
function normalizeRepeatedSlashes(url) {
  const urlNoQuery = url.host + url.pathname;
  return `${url.protocol}//${urlNoQuery.replace(/\\/g, "/").replace(/\/\/+/g, "/")}${url.search}`;
}

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/routeMatcher.js
var optionalLocalePrefixRegex = `^/(?:${RoutesManifest.locales.map((locale) => `${locale}/?`).join("|")})?`;
var optionalBasepathPrefixRegex = RoutesManifest.basePath ? `^${RoutesManifest.basePath}/?` : "^/";
var optionalPrefix = optionalLocalePrefixRegex.replace("^/", optionalBasepathPrefixRegex);
function routeMatcher(routeDefinitions) {
  const regexp = routeDefinitions.map((route) => ({
    page: route.page,
    regexp: new RegExp(route.regex.replace("^/", optionalPrefix))
  }));
  const appPathsSet = /* @__PURE__ */ new Set();
  const routePathsSet = /* @__PURE__ */ new Set();
  for (const [k, v] of Object.entries(AppPathRoutesManifest)) {
    if (k.endsWith("page")) {
      appPathsSet.add(v);
    } else if (k.endsWith("route")) {
      routePathsSet.add(v);
    }
  }
  return function matchRoute(path3) {
    const foundRoutes = regexp.filter((route) => route.regexp.test(path3));
    return foundRoutes.map((foundRoute) => {
      let routeType = "page";
      if (appPathsSet.has(foundRoute.page)) {
        routeType = "app";
      } else if (routePathsSet.has(foundRoute.page)) {
        routeType = "route";
      }
      return {
        route: foundRoute.page,
        type: routeType
      };
    });
  };
}
var staticRouteMatcher = routeMatcher([
  ...RoutesManifest.routes.static,
  ...getStaticAPIRoutes()
]);
var dynamicRouteMatcher = routeMatcher(RoutesManifest.routes.dynamic);
function getStaticAPIRoutes() {
  const createRouteDefinition = (route) => ({
    page: route,
    regex: `^${route}(?:/)?$`
  });
  const dynamicRoutePages = new Set(RoutesManifest.routes.dynamic.map(({ page }) => page));
  const pagesStaticAPIRoutes = Object.keys(PagesManifest).filter((route) => route.startsWith("/api/") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  const appPathsStaticAPIRoutes = Object.values(AppPathRoutesManifest).filter((route) => (route.startsWith("/api/") || route === "/api") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  return [...pagesStaticAPIRoutes, ...appPathsStaticAPIRoutes];
}

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
var routeHasMatcher = (headers, cookies, query) => (redirect) => {
  switch (redirect.type) {
    case "header":
      return !!headers?.[redirect.key.toLowerCase()] && new RegExp(redirect.value ?? "").test(headers[redirect.key.toLowerCase()] ?? "");
    case "cookie":
      return !!cookies?.[redirect.key] && new RegExp(redirect.value ?? "").test(cookies[redirect.key] ?? "");
    case "query":
      return query[redirect.key] && Array.isArray(redirect.value) ? redirect.value.reduce((prev, current) => prev || new RegExp(current).test(query[redirect.key]), false) : new RegExp(redirect.value ?? "").test(query[redirect.key] ?? "");
    case "host":
      return headers?.host !== "" && new RegExp(redirect.value ?? "").test(headers.host);
    default:
      return false;
  }
};
function checkHas(matcher, has, inverted = false) {
  return has ? has.reduce((acc, cur) => {
    if (acc === false)
      return false;
    return inverted ? !matcher(cur) : matcher(cur);
  }, true) : true;
}
var getParamsFromSource = (source) => (value) => {
  debug("value", value);
  const _match = source(value);
  return _match ? _match.params : {};
};
var computeParamHas = (headers, cookies, query) => (has) => {
  if (!has.value)
    return {};
  const matcher = new RegExp(`^${has.value}$`);
  const fromSource = (value) => {
    const matches = value.match(matcher);
    return matches?.groups ?? {};
  };
  switch (has.type) {
    case "header":
      return fromSource(headers[has.key.toLowerCase()] ?? "");
    case "cookie":
      return fromSource(cookies[has.key] ?? "");
    case "query":
      return Array.isArray(query[has.key]) ? fromSource(query[has.key].join(",")) : fromSource(query[has.key] ?? "");
    case "host":
      return fromSource(headers.host ?? "");
  }
};
function convertMatch(match2, toDestination, destination) {
  if (!match2) {
    return destination;
  }
  const { params } = match2;
  const isUsingParams = Object.keys(params).length > 0;
  return isUsingParams ? toDestination(params) : destination;
}
function getNextConfigHeaders(event, configHeaders) {
  if (!configHeaders) {
    return {};
  }
  const matcher = routeHasMatcher(event.headers, event.cookies, event.query);
  const requestHeaders = {};
  const localizedRawPath = localizePath(event);
  for (const { headers, has, missing, regex, source, locale } of configHeaders) {
    const path3 = locale === false ? event.rawPath : localizedRawPath;
    if (new RegExp(regex).test(path3) && checkHas(matcher, has) && checkHas(matcher, missing, true)) {
      const fromSource = match(source);
      const _match = fromSource(path3);
      headers.forEach((h) => {
        try {
          const key = convertMatch(_match, compile(h.key), h.key);
          const value = convertMatch(_match, compile(h.value), h.value);
          requestHeaders[key] = value;
        } catch {
          debug(`Error matching header ${h.key} with value ${h.value}`);
          requestHeaders[h.key] = h.value;
        }
      });
    }
  }
  return requestHeaders;
}
function handleRewrites(event, rewrites) {
  const { rawPath, headers, query, cookies, url } = event;
  const localizedRawPath = localizePath(event);
  const matcher = routeHasMatcher(headers, cookies, query);
  const computeHas = computeParamHas(headers, cookies, query);
  const rewrite = rewrites.find((route) => {
    const path3 = route.locale === false ? rawPath : localizedRawPath;
    return new RegExp(route.regex).test(path3) && checkHas(matcher, route.has) && checkHas(matcher, route.missing, true);
  });
  let finalQuery = query;
  let rewrittenUrl = url;
  const isExternalRewrite = isExternal(rewrite?.destination);
  debug("isExternalRewrite", isExternalRewrite);
  if (rewrite) {
    const { pathname, protocol, hostname, queryString } = getUrlParts(rewrite.destination, isExternalRewrite);
    const pathToUse = rewrite.locale === false ? rawPath : localizedRawPath;
    debug("urlParts", { pathname, protocol, hostname, queryString });
    const toDestinationPath = compile(escapeRegex(pathname, { isPath: true }));
    const toDestinationHost = compile(escapeRegex(hostname));
    const toDestinationQuery = compile(escapeRegex(queryString));
    const params = {
      // params for the source
      ...getParamsFromSource(match(escapeRegex(rewrite.source, { isPath: true })))(pathToUse),
      // params for the has
      ...rewrite.has?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {}),
      // params for the missing
      ...rewrite.missing?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {})
    };
    const isUsingParams = Object.keys(params).length > 0;
    let rewrittenQuery = queryString;
    let rewrittenHost = hostname;
    let rewrittenPath = pathname;
    if (isUsingParams) {
      rewrittenPath = unescapeRegex(toDestinationPath(params));
      rewrittenHost = unescapeRegex(toDestinationHost(params));
      rewrittenQuery = unescapeRegex(toDestinationQuery(params));
    }
    if (NextConfig.i18n && !isExternalRewrite) {
      const strippedPathLocale = rewrittenPath.replace(new RegExp(`^/(${NextConfig.i18n.locales.join("|")})`), "");
      if (strippedPathLocale.startsWith("/api/")) {
        rewrittenPath = strippedPathLocale;
      }
    }
    rewrittenUrl = isExternalRewrite ? `${protocol}//${rewrittenHost}${rewrittenPath}` : new URL(rewrittenPath, event.url).href;
    finalQuery = {
      ...query,
      ...convertFromQueryString(rewrittenQuery)
    };
    rewrittenUrl += convertToQueryString(finalQuery);
    debug("rewrittenUrl", { rewrittenUrl, finalQuery, isUsingParams });
  }
  return {
    internalEvent: {
      ...event,
      query: finalQuery,
      rawPath: new URL(rewrittenUrl).pathname,
      url: rewrittenUrl
    },
    __rewrite: rewrite,
    isExternalRewrite
  };
}
function handleRepeatedSlashRedirect(event) {
  if (event.rawPath.match(/(\\|\/\/)/)) {
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: normalizeRepeatedSlashes(new URL(event.url))
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}
function handleTrailingSlashRedirect(event) {
  const url = new URL(event.rawPath, "http://localhost");
  if (
    // Someone is trying to redirect to a different origin, let's not do that
    url.host !== "localhost" || NextConfig.skipTrailingSlashRedirect || // We should not apply trailing slash redirect to API routes
    event.rawPath.startsWith("/api/")
  ) {
    return false;
  }
  const emptyBody = emptyReadableStream();
  if (NextConfig.trailingSlash && !(event.query.__nextDataReq === "1") && !event.rawPath.endsWith("/") && !event.rawPath.match(/[\w-]+\.[\w]+$/g)) {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0]}/${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  if (!NextConfig.trailingSlash && event.rawPath.endsWith("/") && event.rawPath !== "/") {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0].replace(/\/$/, "")}${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  return false;
}
function handleRedirects(event, redirects) {
  const repeatedSlashRedirect = handleRepeatedSlashRedirect(event);
  if (repeatedSlashRedirect)
    return repeatedSlashRedirect;
  const trailingSlashRedirect = handleTrailingSlashRedirect(event);
  if (trailingSlashRedirect)
    return trailingSlashRedirect;
  const localeRedirect = handleLocaleRedirect(event);
  if (localeRedirect)
    return localeRedirect;
  const { internalEvent, __rewrite } = handleRewrites(event, redirects.filter((r) => !r.internal));
  if (__rewrite && !__rewrite.internal) {
    return {
      type: event.type,
      statusCode: __rewrite.statusCode ?? 308,
      headers: {
        Location: internalEvent.url
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
}
function fixDataPage(internalEvent, buildId) {
  const { rawPath, query } = internalEvent;
  const basePath = NextConfig.basePath ?? "";
  const dataPattern = `${basePath}/_next/data/${buildId}`;
  if (rawPath.startsWith("/_next/data") && !rawPath.startsWith(dataPattern)) {
    return {
      type: internalEvent.type,
      statusCode: 404,
      body: toReadableStream("{}"),
      headers: {
        "Content-Type": "application/json"
      },
      isBase64Encoded: false
    };
  }
  if (rawPath.startsWith(dataPattern) && rawPath.endsWith(".json")) {
    const newPath = `${basePath}${rawPath.slice(dataPattern.length, -".json".length).replace(/^\/index$/, "/")}`;
    query.__nextDataReq = "1";
    return {
      ...internalEvent,
      rawPath: newPath,
      query,
      url: new URL(`${newPath}${convertToQueryString(query)}`, internalEvent.url).href
    };
  }
  return internalEvent;
}
function handleFallbackFalse(internalEvent, prerenderManifest) {
  const { rawPath } = internalEvent;
  const { dynamicRoutes = {}, routes = {} } = prerenderManifest ?? {};
  const prerenderedFallbackRoutes = Object.entries(dynamicRoutes).filter(([, { fallback }]) => fallback === false);
  const routeFallback = prerenderedFallbackRoutes.some(([, { routeRegex }]) => {
    const routeRegexExp = new RegExp(routeRegex);
    return routeRegexExp.test(rawPath);
  });
  const locales = NextConfig.i18n?.locales;
  const routesAlreadyHaveLocale = locales?.includes(rawPath.split("/")[1]) || // If we don't use locales, we don't need to add the default locale
  locales === void 0;
  let localizedPath = routesAlreadyHaveLocale ? rawPath : `/${NextConfig.i18n?.defaultLocale}${rawPath}`;
  if (
    // Not if localizedPath is "/" tho, because that would not make it find `isPregenerated` below since it would be try to match an empty string.
    localizedPath !== "/" && NextConfig.trailingSlash && localizedPath.endsWith("/")
  ) {
    localizedPath = localizedPath.slice(0, -1);
  }
  const matchedStaticRoute = staticRouteMatcher(localizedPath);
  const prerenderedFallbackRoutesName = prerenderedFallbackRoutes.map(([name]) => name);
  const matchedDynamicRoute = dynamicRouteMatcher(localizedPath).filter(({ route }) => !prerenderedFallbackRoutesName.includes(route));
  const isPregenerated = Object.keys(routes).includes(localizedPath);
  if (routeFallback && !isPregenerated && matchedStaticRoute.length === 0 && matchedDynamicRoute.length === 0) {
    return {
      event: {
        ...internalEvent,
        rawPath: "/404",
        url: constructNextUrl(internalEvent.url, "/404"),
        headers: {
          ...internalEvent.headers,
          "x-invoke-status": "404"
        }
      },
      isISR: false
    };
  }
  return {
    event: internalEvent,
    isISR: routeFallback || isPregenerated
  };
}

// node_modules/@opennextjs/aws/dist/core/routing/middleware.js
init_stream();
init_utils();
var middlewareManifest = MiddlewareManifest;
var functionsConfigManifest = FunctionsConfigManifest;
var middleMatch = getMiddlewareMatch(middlewareManifest, functionsConfigManifest);
var REDIRECTS = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function defaultMiddlewareLoader() {
  return Promise.resolve().then(() => (init_edgeFunctionHandler(), edgeFunctionHandler_exports));
}
async function handleMiddleware(internalEvent, initialSearch, middlewareLoader = defaultMiddlewareLoader) {
  const headers = internalEvent.headers;
  if (headers["x-isr"] && headers["x-prerender-revalidate"] === PrerenderManifest?.preview?.previewModeId)
    return internalEvent;
  const normalizedPath = localizePath(internalEvent);
  const hasMatch = middleMatch.some((r) => r.test(normalizedPath));
  if (!hasMatch)
    return internalEvent;
  const initialUrl = new URL(normalizedPath, internalEvent.url);
  initialUrl.search = initialSearch;
  const url = initialUrl.href;
  const middleware = await middlewareLoader();
  const result = await middleware.default({
    // `geo` is pre Next 15.
    geo: {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: decodeURIComponent(headers["x-open-next-city"]),
      country: headers["x-open-next-country"],
      region: headers["x-open-next-region"],
      latitude: headers["x-open-next-latitude"],
      longitude: headers["x-open-next-longitude"]
    },
    headers,
    method: internalEvent.method || "GET",
    nextConfig: {
      basePath: NextConfig.basePath,
      i18n: NextConfig.i18n,
      trailingSlash: NextConfig.trailingSlash
    },
    url,
    body: convertBodyToReadableStream(internalEvent.method, internalEvent.body)
  });
  const statusCode = result.status;
  const responseHeaders = result.headers;
  const reqHeaders = {};
  const resHeaders = {};
  const filteredHeaders = [
    "x-middleware-override-headers",
    "x-middleware-next",
    "x-middleware-rewrite",
    // We need to drop `content-encoding` because it will be decoded
    "content-encoding"
  ];
  const xMiddlewareKey = "x-middleware-request-";
  responseHeaders.forEach((value, key) => {
    if (key.startsWith(xMiddlewareKey)) {
      const k = key.substring(xMiddlewareKey.length);
      reqHeaders[k] = value;
    } else {
      if (filteredHeaders.includes(key.toLowerCase()))
        return;
      if (key.toLowerCase() === "set-cookie") {
        resHeaders[key] = resHeaders[key] ? [...resHeaders[key], value] : [value];
      } else if (REDIRECTS.has(statusCode) && key.toLowerCase() === "location") {
        resHeaders[key] = normalizeLocationHeader(value, internalEvent.url);
      } else {
        resHeaders[key] = value;
      }
    }
  });
  const rewriteUrl = responseHeaders.get("x-middleware-rewrite");
  let isExternalRewrite = false;
  let middlewareQuery = internalEvent.query;
  let newUrl = internalEvent.url;
  if (rewriteUrl) {
    newUrl = rewriteUrl;
    if (isExternal(newUrl, internalEvent.headers.host)) {
      isExternalRewrite = true;
    } else {
      const rewriteUrlObject = new URL(rewriteUrl);
      middlewareQuery = getQueryFromSearchParams(rewriteUrlObject.searchParams);
      if ("__nextDataReq" in internalEvent.query) {
        middlewareQuery.__nextDataReq = internalEvent.query.__nextDataReq;
      }
    }
  }
  if (!rewriteUrl && !responseHeaders.get("x-middleware-next")) {
    const body = result.body ?? emptyReadableStream();
    return {
      type: internalEvent.type,
      statusCode,
      headers: resHeaders,
      body,
      isBase64Encoded: false
    };
  }
  return {
    responseHeaders: resHeaders,
    url: newUrl,
    rawPath: new URL(newUrl).pathname,
    type: internalEvent.type,
    headers: { ...internalEvent.headers, ...reqHeaders },
    body: internalEvent.body,
    method: internalEvent.method,
    query: middlewareQuery,
    cookies: internalEvent.cookies,
    remoteAddress: internalEvent.remoteAddress,
    isExternalRewrite,
    rewriteStatusCode: rewriteUrl && !isExternalRewrite ? statusCode : void 0
  };
}

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
var MIDDLEWARE_HEADER_PREFIX = "x-middleware-response-";
var MIDDLEWARE_HEADER_PREFIX_LEN = MIDDLEWARE_HEADER_PREFIX.length;
var INTERNAL_HEADER_PREFIX = "x-opennext-";
var INTERNAL_HEADER_INITIAL_URL = `${INTERNAL_HEADER_PREFIX}initial-url`;
var INTERNAL_HEADER_LOCALE = `${INTERNAL_HEADER_PREFIX}locale`;
var INTERNAL_HEADER_RESOLVED_ROUTES = `${INTERNAL_HEADER_PREFIX}resolved-routes`;
var INTERNAL_HEADER_REWRITE_STATUS_CODE = `${INTERNAL_HEADER_PREFIX}rewrite-status-code`;
var INTERNAL_EVENT_REQUEST_ID = `${INTERNAL_HEADER_PREFIX}request-id`;
var geoHeaderToNextHeader = {
  "x-open-next-city": "x-vercel-ip-city",
  "x-open-next-country": "x-vercel-ip-country",
  "x-open-next-region": "x-vercel-ip-country-region",
  "x-open-next-latitude": "x-vercel-ip-latitude",
  "x-open-next-longitude": "x-vercel-ip-longitude"
};
var NEXT_INTERNAL_HEADERS = [
  "x-middleware-rewrite",
  "x-middleware-redirect",
  "x-middleware-set-cookie",
  "x-middleware-skip",
  "x-middleware-override-headers",
  "x-middleware-next",
  "x-now-route-matches",
  "x-matched-path",
  "x-nextjs-data",
  "x-next-resume-state-length"
];
function applyMiddlewareHeaders(eventOrResult, middlewareHeaders) {
  const isResult = isInternalResult(eventOrResult);
  const headers = eventOrResult.headers;
  const keyPrefix = isResult ? "" : MIDDLEWARE_HEADER_PREFIX;
  Object.entries(middlewareHeaders).forEach(([key, value]) => {
    if (value) {
      headers[keyPrefix + key] = Array.isArray(value) ? value.join(",") : value;
    }
  });
}
async function routingHandler(event, { assetResolver }) {
  try {
    for (const [openNextGeoName, nextGeoName] of Object.entries(geoHeaderToNextHeader)) {
      const value = event.headers[openNextGeoName];
      if (value) {
        event.headers[nextGeoName] = value;
      }
    }
    for (const key of Object.keys(event.headers)) {
      const lowerCaseKey = key.toLowerCase();
      if (lowerCaseKey.startsWith(INTERNAL_HEADER_PREFIX) || lowerCaseKey.startsWith(MIDDLEWARE_HEADER_PREFIX) || NEXT_INTERNAL_HEADERS.includes(lowerCaseKey)) {
        delete event.headers[key];
      }
    }
    let headers = getNextConfigHeaders(event, ConfigHeaders);
    let eventOrResult = fixDataPage(event, BuildId);
    if (isInternalResult(eventOrResult)) {
      return eventOrResult;
    }
    const redirect = handleRedirects(eventOrResult, RoutesManifest.redirects);
    if (redirect) {
      redirect.headers.Location = normalizeLocationHeader(redirect.headers.Location, event.url, true);
      debug("redirect", redirect);
      return redirect;
    }
    const middlewareEventOrResult = await handleMiddleware(
      eventOrResult,
      // We need to pass the initial search without any decoding
      // TODO: we'd need to refactor InternalEvent to include the initial querystring directly
      // Should be done in another PR because it is a breaking change
      new URL(event.url).search
    );
    if (isInternalResult(middlewareEventOrResult)) {
      return middlewareEventOrResult;
    }
    const middlewareHeadersPrioritized = globalThis.openNextConfig.dangerous?.middlewareHeadersOverrideNextConfigHeaders ?? false;
    if (middlewareHeadersPrioritized) {
      headers = {
        ...headers,
        ...middlewareEventOrResult.responseHeaders
      };
    } else {
      headers = {
        ...middlewareEventOrResult.responseHeaders,
        ...headers
      };
    }
    let isExternalRewrite = middlewareEventOrResult.isExternalRewrite ?? false;
    eventOrResult = middlewareEventOrResult;
    if (!isExternalRewrite) {
      const beforeRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.beforeFiles);
      eventOrResult = beforeRewrite.internalEvent;
      isExternalRewrite = beforeRewrite.isExternalRewrite;
      if (!isExternalRewrite) {
        const assetResult = await assetResolver?.maybeGetAssetResult?.(eventOrResult);
        if (assetResult) {
          applyMiddlewareHeaders(assetResult, headers);
          return assetResult;
        }
      }
    }
    const foundStaticRoute = staticRouteMatcher(eventOrResult.rawPath);
    const isStaticRoute = !isExternalRewrite && foundStaticRoute.length > 0;
    if (!(isStaticRoute || isExternalRewrite)) {
      const afterRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.afterFiles);
      eventOrResult = afterRewrite.internalEvent;
      isExternalRewrite = afterRewrite.isExternalRewrite;
    }
    let isISR = false;
    if (!isExternalRewrite) {
      const fallbackResult = handleFallbackFalse(eventOrResult, PrerenderManifest);
      eventOrResult = fallbackResult.event;
      isISR = fallbackResult.isISR;
    }
    const foundDynamicRoute = dynamicRouteMatcher(eventOrResult.rawPath);
    const isDynamicRoute = !isExternalRewrite && foundDynamicRoute.length > 0;
    if (!(isDynamicRoute || isStaticRoute || isExternalRewrite)) {
      const fallbackRewrites = handleRewrites(eventOrResult, RoutesManifest.rewrites.fallback);
      eventOrResult = fallbackRewrites.internalEvent;
      isExternalRewrite = fallbackRewrites.isExternalRewrite;
    }
    const isNextImageRoute = eventOrResult.rawPath.startsWith("/_next/image");
    const isRouteFoundBeforeAllRewrites = isStaticRoute || isDynamicRoute || isExternalRewrite;
    if (!(isRouteFoundBeforeAllRewrites || isNextImageRoute || // We need to check again once all rewrites have been applied
    staticRouteMatcher(eventOrResult.rawPath).length > 0 || dynamicRouteMatcher(eventOrResult.rawPath).length > 0)) {
      eventOrResult = {
        ...eventOrResult,
        rawPath: "/404",
        url: constructNextUrl(eventOrResult.url, "/404"),
        headers: {
          ...eventOrResult.headers,
          "x-middleware-response-cache-control": "private, no-cache, no-store, max-age=0, must-revalidate"
        }
      };
    }
    if (globalThis.openNextConfig.dangerous?.enableCacheInterception && !isInternalResult(eventOrResult)) {
      debug("Cache interception enabled");
      eventOrResult = await cacheInterceptor(eventOrResult);
      if (isInternalResult(eventOrResult)) {
        applyMiddlewareHeaders(eventOrResult, headers);
        return eventOrResult;
      }
    }
    applyMiddlewareHeaders(eventOrResult, headers);
    const resolvedRoutes = [
      ...foundStaticRoute,
      ...foundDynamicRoute
    ];
    debug("resolvedRoutes", resolvedRoutes);
    return {
      internalEvent: eventOrResult,
      isExternalRewrite,
      origin: false,
      isISR,
      resolvedRoutes,
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(eventOrResult, NextConfig.i18n) : void 0,
      rewriteStatusCode: middlewareEventOrResult.rewriteStatusCode
    };
  } catch (e) {
    error("Error in routingHandler", e);
    return {
      internalEvent: {
        type: "core",
        method: "GET",
        rawPath: "/500",
        url: constructNextUrl(event.url, "/500"),
        headers: {
          ...event.headers
        },
        query: event.query,
        cookies: event.cookies,
        remoteAddress: event.remoteAddress
      },
      isExternalRewrite: false,
      origin: false,
      isISR: false,
      resolvedRoutes: [],
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(event, NextConfig.i18n) : void 0
    };
  }
}
function isInternalResult(eventOrResult) {
  return eventOrResult != null && "statusCode" in eventOrResult;
}

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
globalThis.internalFetch = fetch;
globalThis.__openNextAls = new AsyncLocalStorage();
var defaultHandler = async (internalEvent, options) => {
  const middlewareConfig = globalThis.openNextConfig.middleware;
  const originResolver = await resolveOriginResolver(middlewareConfig?.originResolver);
  const externalRequestProxy = await resolveProxyRequest(middlewareConfig?.override?.proxyExternalRequest);
  const assetResolver = await resolveAssetResolver(middlewareConfig?.assetResolver);
  const requestId = Math.random().toString(36);
  return runWithOpenNextRequestContext({
    isISRRevalidation: internalEvent.headers["x-isr"] === "1",
    waitUntil: options?.waitUntil,
    requestId
  }, async () => {
    const result = await routingHandler(internalEvent, { assetResolver });
    if ("internalEvent" in result) {
      debug("Middleware intercepted event", internalEvent);
      if (!result.isExternalRewrite) {
        const origin = await originResolver.resolve(result.internalEvent.rawPath);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_HEADER_INITIAL_URL]: internalEvent.url,
              [INTERNAL_HEADER_RESOLVED_ROUTES]: JSON.stringify(result.resolvedRoutes),
              [INTERNAL_EVENT_REQUEST_ID]: requestId,
              [INTERNAL_HEADER_REWRITE_STATUS_CODE]: String(result.rewriteStatusCode)
            }
          },
          isExternalRewrite: result.isExternalRewrite,
          origin,
          isISR: result.isISR,
          initialURL: result.initialURL,
          resolvedRoutes: result.resolvedRoutes
        };
      }
      try {
        return externalRequestProxy.proxy(result.internalEvent);
      } catch (e) {
        error("External request failed.", e);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_EVENT_REQUEST_ID]: requestId
            },
            rawPath: "/500",
            url: constructNextUrl(result.internalEvent.url, "/500"),
            method: "GET"
          },
          // On error we need to rewrite to the 500 page which is an internal rewrite
          isExternalRewrite: false,
          origin: false,
          isISR: result.isISR,
          initialURL: result.internalEvent.url,
          resolvedRoutes: [{ route: "/500", type: "page" }]
        };
      }
    }
    if (process.env.OPEN_NEXT_REQUEST_ID_HEADER || globalThis.openNextDebug) {
      result.headers[INTERNAL_EVENT_REQUEST_ID] = requestId;
    }
    debug("Middleware response", result);
    return result;
  });
};
var handler2 = await createGenericHandler({
  handler: defaultHandler,
  type: "middleware"
});
var middleware_default = {
  fetch: handler2
};
export {
  middleware_default as default,
  handler2 as handler
};
