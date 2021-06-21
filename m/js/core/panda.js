"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var panda;
(function (panda) {
    var AdvancedError = /** @class */ (function (_super) {
        __extends(AdvancedError, _super);
        function AdvancedError(message, code, skipstack) {
            var _newTarget = this.constructor;
            if (code === void 0) { code = 0; }
            if (skipstack === void 0) { skipstack = false; }
            var _this = _super.call(this, message) || this;
            _this.stack = null;
            _this.name = null;
            _this._toString = null;
            _this.__proto__ = _newTarget.prototype;
            _this.message = message;
            _this.code = code;
            _this.name = panda.Introspection.getClassName(_this);
            if (!skipstack) {
                var error = new Error(_this.message);
                if (!panda.BrowserSpecific.hasStackOnUnthrowedError()) {
                    try {
                        throw error;
                    }
                    catch (e) { }
                }
                _this.stack = _this.getStack(error);
            }
            return _this;
        }
        Object.defineProperty(AdvancedError.prototype, "errorID", {
            get: function () {
                return this.code;
            },
            enumerable: false,
            configurable: true
        });
        AdvancedError.prototype.toString = function () {
            if (!this._toString) {
                this._toString = this.name + ': ' + this.message;
            }
            return this._toString;
        };
        AdvancedError.prototype.getStack = function (e) {
            var stack;
            stack = AdvancedError.getStacktrace(e);
            if (!stack || stack === '') {
                return this.toString() + '\nstack unavailable';
            }
            var lines = stack.split('\n');
            if (lines[0] === ('Error: ' + this.message)) {
                lines.shift();
            }
            var obj = this;
            if (panda.BrowserSpecific.errorHasExtenderConstructorLine()) {
                while (obj instanceof AdvancedError) {
                    obj = panda.Introspection.getObjectProto(obj);
                    lines.shift();
                }
            }
            lines.unshift(this.toString());
            return lines.join('\n');
        };
        AdvancedError.getStacktrace = function (error) {
            var stack;
            if (error) {
                try {
                    stack = error['stack'];
                }
                catch (e) { }
            }
            if (!stack) {
                try {
                    stack = '';
                    var f = arguments.callee.caller.caller;
                    while (f) {
                        stack += (panda.Introspection.getFunctionName(f) + '\n');
                        f = f.caller;
                    }
                }
                catch (e) { }
                ;
            }
            return stack;
        };
        return AdvancedError;
    }(Error));
    panda.AdvancedError = AdvancedError;
    var NotImplementedError = /** @class */ (function (_super) {
        __extends(NotImplementedError, _super);
        function NotImplementedError() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return NotImplementedError;
    }(AdvancedError));
    panda.NotImplementedError = NotImplementedError;
    ;
    var ArgumentError = /** @class */ (function (_super) {
        __extends(ArgumentError, _super);
        function ArgumentError() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ArgumentError;
    }(AdvancedError));
    panda.ArgumentError = ArgumentError;
    ;
    var NotSupportedError = /** @class */ (function (_super) {
        __extends(NotSupportedError, _super);
        function NotSupportedError() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return NotSupportedError;
    }(AdvancedError));
    panda.NotSupportedError = NotSupportedError;
    ;
})(panda || (panda = {}));
///ts:ref=AdvancedError
/// <reference path="../utils/AdvancedError.ts"/> ///ts:ref:generated
var panda;
(function (panda) {
    var UserAgentParser;
    (function (UserAgentParser) {
        var ParseResult = /** @class */ (function () {
            function ParseResult() {
                this.userAgent = 'unknown';
                this.browser = 'unknown';
                this.versionNumber = 0;
                this.version = 'unknown';
                this.parentBrowser = 'unknown';
                this.parentVersion = 'unknown';
                this.parentVersionNumber = 0;
                this.osType = 'unknown';
                this.osName = 'unknown';
                this.osVersion = 'unknown';
                this.osVersionNumber = 0;
                this.archtecture = 'unknown';
                this.parsedCorretly = false;
                this.fatalParsingError = false;
                this.mobileExperimental = null;
                this.products = [];
                this.comments = [];
            }
            ParseResult.prototype.getFirstProductByName = function (name) {
                if (!this._productHash) {
                    this._productHash = new Object();
                    for (var _i = 0, _a = this.products; _i < _a.length; _i++) {
                        var product = _a[_i];
                        if (!this._productHash[product.browser]) {
                            this._productHash[product.browser] = product;
                        }
                    }
                    for (var _b = 0, _c = this.comments; _b < _c.length; _b++) {
                        var token = _c[_b];
                        if (token instanceof Extended.CommentProductToken) {
                            var product = token.product;
                            if (!this._productHash[product.browser]) {
                                this._productHash[product.browser] = product;
                            }
                        }
                    }
                }
                return this._productHash[name];
            };
            return ParseResult;
        }());
        UserAgentParser.ParseResult = ParseResult;
        function parse(agent) {
            panda.Console.here;
            var result = new ParseResult();
            result.userAgent = agent;
            try {
                var splitted = Internal.splitAgent(agent, false);
                if (!splitted) {
                    result.fatalParsingError = true;
                    return result;
                }
                result.products = Internal.parseProducts(splitted);
                result.comments = Internal.parseComments(splitted);
                Internal.fillOSProperties(result);
                Internal.fillBrowserProperties(result);
            }
            catch (splittingError) {
                panda.Console.errorUncritical(splittingError);
            }
            return result;
        }
        UserAgentParser.parse = parse;
        var Extended;
        (function (Extended) {
            var Product = /** @class */ (function () {
                function Product() {
                    this.browser = 'unknown';
                    this.versionNumber = 0;
                    this.version = 'unknown';
                }
                return Product;
            }());
            Extended.Product = Product;
            var CommentToken = /** @class */ (function () {
                function CommentToken() {
                }
                return CommentToken;
            }());
            Extended.CommentToken = CommentToken;
            var CommentUnknownToken = /** @class */ (function (_super) {
                __extends(CommentUnknownToken, _super);
                function CommentUnknownToken() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return CommentUnknownToken;
            }(CommentToken));
            Extended.CommentUnknownToken = CommentUnknownToken;
            var CommentOSToken = /** @class */ (function (_super) {
                __extends(CommentOSToken, _super);
                function CommentOSToken() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return CommentOSToken;
            }(CommentToken));
            Extended.CommentOSToken = CommentOSToken;
            var CommentArchitectureToken = /** @class */ (function (_super) {
                __extends(CommentArchitectureToken, _super);
                function CommentArchitectureToken() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return CommentArchitectureToken;
            }(CommentToken));
            Extended.CommentArchitectureToken = CommentArchitectureToken;
            var CommentProductToken = /** @class */ (function (_super) {
                __extends(CommentProductToken, _super);
                function CommentProductToken() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return CommentProductToken;
            }(CommentToken));
            Extended.CommentProductToken = CommentProductToken;
            var CommentVersionToken = /** @class */ (function (_super) {
                __extends(CommentVersionToken, _super);
                function CommentVersionToken() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return CommentVersionToken;
            }(CommentToken));
            Extended.CommentVersionToken = CommentVersionToken;
        })(Extended = UserAgentParser.Extended || (UserAgentParser.Extended = {}));
        var Internal;
        (function (Internal) {
            var ParseProductError = /** @class */ (function (_super) {
                __extends(ParseProductError, _super);
                function ParseProductError(message, code) {
                    if (code === void 0) { code = 0; }
                    return _super.call(this, message, code, true) || this;
                }
                return ParseProductError;
            }(panda.AdvancedError));
            Internal.ParseProductError = ParseProductError;
            var SplitError = /** @class */ (function (_super) {
                __extends(SplitError, _super);
                function SplitError(message, code) {
                    if (code === void 0) { code = 0; }
                    return _super.call(this, message, code, true) || this;
                }
                return SplitError;
            }(panda.AdvancedError));
            Internal.SplitError = SplitError;
            var ProductName;
            (function (ProductName) {
                ProductName.Opera = 'Opera';
                ProductName.Version = 'Version';
                ProductName.Chrome = 'Chrome';
                ProductName.Edge = 'Edge';
                ProductName.AppleWebKit = 'AppleWebKit';
                ProductName.Safari = 'Safari';
                ProductName.Mozilla = 'Mozilla';
                ProductName.OPR = 'OPR';
                ProductName.YaBrowser = 'YaBrowser';
                ProductName.Yowser = 'Yowser';
                ProductName.Gecko = 'Gecko';
                ProductName.Firefox = 'Firefox';
                ProductName.Nichrome = 'Nichrome';
                ProductName.Amigo = 'Amigo';
                ProductName.Trident = 'Trident';
                ProductName.MSIE = 'MSIE';
                ProductName.CanvasFrame = 'CanvasFrame';
                ProductName.PaleMoon = 'PaleMoon';
                ProductName.Goanna = 'Goanna';
                ProductName.AOL = 'AOL';
                ProductName.AOLBuild = 'AOLBuild';
                ProductName.Mobile = 'Mobile';
                ProductName.CriOS = 'CriOS';
                ProductName.FxiOS = 'FxiOS';
                ProductName.AdobeAIR = 'AdobeAIR';
            })(ProductName = Internal.ProductName || (Internal.ProductName = {}));
            function fillBrowserProperties(result) {
                panda.Console.here;
                var testers = [
                    tryChrome,
                    tryEdge,
                    tryFirefox,
                    tryOldOpera,
                    tryNewOpera,
                    tryYandex,
                    tryFacebook,
                    tryIE,
                    trySafari,
                    tryAir,
                    tryChromeIos,
                    tryFirefoxIos,
                    tryPaleMoon,
                    tryAol,
                    tryOneProductGoogleExtender,
                    tryOneProductFirefoxExtender,
                ];
                for (var _i = 0, testers_1 = testers; _i < testers_1.length; _i++) {
                    var func = testers_1[_i];
                    var stopTrying = func(result);
                    if (stopTrying) {
                        break;
                    }
                    if (result.parsedCorretly) {
                        break;
                    }
                }
            }
            Internal.fillBrowserProperties = fillBrowserProperties;
            function tryOldOpera(result) {
                var opera = result.getFirstProductByName(ProductName.Opera);
                if (!opera) {
                    return false;
                }
                var version = result.getFirstProductByName(ProductName.Version);
                if (!version) {
                    panda.Console.errorUncritical(new panda.AdvancedError('Old Opera without version', 130));
                    return false;
                }
                result.browser = opera.browser;
                result.version = version.version;
                result.versionNumber = version.versionNumber;
                result.parentBrowser = opera.browser;
                result.parentVersion = version.version;
                result.parentVersionNumber = version.versionNumber;
                if (result.products.length === 3) {
                    result.parsedCorretly = true;
                }
                return true;
            }
            Internal.tryOldOpera = tryOldOpera;
            function tryChrome(result) {
                var chrome = result.getFirstProductByName(ProductName.Chrome);
                if (!chrome) {
                    return false;
                }
                var edge = result.getFirstProductByName(ProductName.Edge);
                if (edge) {
                    return false;
                }
                var mozilla = result.getFirstProductByName(ProductName.Mozilla);
                if (!mozilla) {
                    panda.Console.errorUncritical(new panda.AdvancedError('Chrome without Mozilla', 131));
                    return false;
                }
                if (mozilla.versionNumber !== 5) {
                    panda.Console.errorUncritical(new panda.AdvancedError('Chrome with mozilla version !==5', 132));
                    return false;
                }
                var webKit = result.getFirstProductByName(ProductName.AppleWebKit);
                if (!webKit) {
                    panda.Console.errorUncritical(new panda.AdvancedError('Chrome without AppleWebKit', 133));
                    return false;
                }
                var safari = result.getFirstProductByName(ProductName.Safari);
                if (!safari) {
                    panda.Console.errorUncritical(new panda.AdvancedError('Chrome without Safari', 134));
                    return false;
                }
                result.browser = chrome.browser;
                result.version = chrome.version;
                result.versionNumber = chrome.versionNumber;
                result.parentBrowser = chrome.browser;
                result.parentVersion = chrome.version;
                result.parentVersionNumber = chrome.versionNumber;
                if (result.products.length === 4) {
                    result.parsedCorretly = true;
                }
                return false;
            }
            Internal.tryChrome = tryChrome;
            function tryChromeIos(result) {
                var crios = result.getFirstProductByName(ProductName.CriOS);
                if (!crios) {
                    return false;
                }
                var mozilla = result.getFirstProductByName(ProductName.Mozilla);
                if (!mozilla) {
                    panda.Console.errorUncritical(new panda.AdvancedError('CriOS without Mozilla', 131));
                    return false;
                }
                if (mozilla.versionNumber !== 5) {
                    panda.Console.errorUncritical(new panda.AdvancedError('CriOS with mozilla version !==5', 132));
                    return false;
                }
                var webKit = result.getFirstProductByName(ProductName.AppleWebKit);
                if (!webKit) {
                    panda.Console.errorUncritical(new panda.AdvancedError('CriOS without AppleWebKit', 133));
                    return false;
                }
                var safari = result.getFirstProductByName(ProductName.Safari);
                if (!safari) {
                    panda.Console.errorUncritical(new panda.AdvancedError('CriOS without Safari', 134));
                    return false;
                }
                var mobile = result.getFirstProductByName(ProductName.Mobile);
                if (!mobile) {
                    panda.Console.errorUncritical(new panda.AdvancedError('Mobile without Safari', 134));
                    return false;
                }
                result.browser = 'Chrome';
                result.version = crios.version;
                result.versionNumber = crios.versionNumber;
                result.parentBrowser = 'Chrome';
                result.parentVersion = crios.version;
                result.parentVersionNumber = crios.versionNumber;
                result.mobileExperimental = true;
                if (result.products.length === 5) {
                    result.parsedCorretly = true;
                }
                return false;
            }
            Internal.tryChromeIos = tryChromeIos;
            function tryFirefoxIos(result) {
                var fxiOS = result.getFirstProductByName(ProductName.FxiOS);
                if (!fxiOS) {
                    return false;
                }
                var mozilla = result.getFirstProductByName(ProductName.Mozilla);
                if (!mozilla) {
                    panda.Console.errorUncritical(new panda.AdvancedError('FxiOS without Mozilla', 131));
                    return false;
                }
                if (mozilla.versionNumber !== 5) {
                    panda.Console.errorUncritical(new panda.AdvancedError('FxiOS with mozilla version !==5', 132));
                    return false;
                }
                var webKit = result.getFirstProductByName(ProductName.AppleWebKit);
                if (!webKit) {
                    panda.Console.errorUncritical(new panda.AdvancedError('FxiOS without AppleWebKit', 133));
                    return false;
                }
                var safari = result.getFirstProductByName(ProductName.Safari);
                if (!safari) {
                    panda.Console.errorUncritical(new panda.AdvancedError('FxiOS without Safari', 134));
                    return false;
                }
                var mobile = result.getFirstProductByName(ProductName.Mobile);
                if (!mobile) {
                    panda.Console.errorUncritical(new panda.AdvancedError('Mobile without Safari', 134));
                    return false;
                }
                result.browser = 'Firefox';
                result.version = fxiOS.version;
                result.versionNumber = fxiOS.versionNumber;
                result.parentBrowser = 'Firefox';
                result.parentVersion = fxiOS.version;
                result.parentVersionNumber = fxiOS.versionNumber;
                result.mobileExperimental = true;
                if (result.products.length === 5) {
                    result.parsedCorretly = true;
                }
                return false;
            }
            Internal.tryFirefoxIos = tryFirefoxIos;
            function tryNewOpera(result) {
                var opr = result.getFirstProductByName(ProductName.OPR);
                if (!opr) {
                    return false;
                }
                if (result.parentBrowser !== ProductName.Chrome) {
                    panda.Console.errorUncritical(new panda.AdvancedError('New Opera without Chrome', 134));
                    return false;
                }
                result.browser = ProductName.Opera;
                result.version = opr.version;
                result.versionNumber = opr.versionNumber;
                if (result.products.length === 5) {
                    result.parsedCorretly = true;
                }
                return true;
            }
            Internal.tryNewOpera = tryNewOpera;
            function tryEdge(result) {
                var edge = result.getFirstProductByName(ProductName.Edge);
                if (!edge) {
                    return false;
                }
                result.browser = edge.browser;
                result.version = edge.version;
                result.versionNumber = edge.versionNumber;
                if (result.products.length === 5) {
                    result.parsedCorretly = true;
                }
                result.parentBrowser = edge.browser;
                result.parentVersion = edge.version;
                result.parentVersionNumber = edge.versionNumber;
                return true;
            }
            Internal.tryEdge = tryEdge;
            function tryYandex(result) {
                var yabrowser = result.getFirstProductByName(ProductName.YaBrowser);
                if (!yabrowser) {
                    return false;
                }
                if (result.parentBrowser !== ProductName.Chrome) {
                    panda.Console.errorUncritical(new panda.AdvancedError('Yabrowser without Chrome', 135));
                    return false;
                }
                result.browser = yabrowser.browser;
                result.version = yabrowser.version;
                result.versionNumber = yabrowser.versionNumber;
                var yozer = result.getFirstProductByName(ProductName.Yowser);
                if ((result.products.length === 5 && yozer === undefined) || (result.products.length === 6 && yozer !== undefined)) {
                    result.parsedCorretly = true;
                }
                return true;
            }
            Internal.tryYandex = tryYandex;
            function tryFacebook(result) {
                var canvesFrame = result.getFirstProductByName(ProductName.CanvasFrame);
                if (!canvesFrame) {
                    return false;
                }
                if (result.parentBrowser !== ProductName.Chrome) {
                    panda.Console.errorUncritical(new panda.AdvancedError('Facebook canvesFrame without Chrome', 135));
                    return false;
                }
                result.browser = canvesFrame.browser;
                result.version = canvesFrame.version;
                result.versionNumber = canvesFrame.versionNumber;
                var index = result.userAgent.indexOf('FacebookCanvasDesktop');
                if (index >= 0) {
                    result.browser = 'FacebookCanvasDesktop';
                    result.parsedCorretly = true;
                }
                return true;
            }
            Internal.tryFacebook = tryFacebook;
            function trySafari(result) {
                if (result.products.length !== 4 && result.products.length !== 5) { // 5 for mobile
                    return false;
                }
                var mobile = result.getFirstProductByName(ProductName.Mobile);
                if (mobile && result.products.length !== 5) {
                    return false;
                }
                var safari = result.getFirstProductByName(ProductName.Safari);
                if (!safari) {
                    return false;
                }
                var version = result.getFirstProductByName(ProductName.Version);
                if (!version) {
                    return false;
                }
                var mozilla = result.getFirstProductByName(ProductName.Mozilla);
                if (!mozilla) {
                    panda.Console.errorUncritical(new panda.AdvancedError('Safari without Mozilla', 131));
                    return false;
                }
                if (mozilla.versionNumber !== 5) {
                    panda.Console.errorUncritical(new panda.AdvancedError('Safari with mozilla version !==5', 132));
                    return false;
                }
                var webKit = result.getFirstProductByName(ProductName.AppleWebKit);
                if (!webKit) {
                    panda.Console.errorUncritical(new panda.AdvancedError('Safari without AppleWebKit', 133));
                    return false;
                }
                result.browser = safari.browser;
                result.version = version.version;
                result.versionNumber = version.versionNumber;
                result.parentBrowser = safari.browser;
                result.parentVersion = version.version;
                result.parentVersionNumber = version.versionNumber;
                result.parsedCorretly = true;
                if (mobile) {
                    result.mobileExperimental = true;
                }
                return false;
            }
            Internal.trySafari = trySafari;
            function tryOneProductGoogleExtender(result) {
                if (result.parentBrowser !== ProductName.Chrome) {
                    return false;
                }
                if (result.products.length !== 5) {
                    return false;
                }
                var knownProducts = 0;
                var unknownProduct;
                for (var _i = 0, _a = result.products; _i < _a.length; _i++) {
                    var prod = _a[_i];
                    switch (prod.browser) {
                        case ProductName.Chrome:
                        case ProductName.Mozilla:
                        case ProductName.Safari:
                        case ProductName.AppleWebKit:
                            knownProducts++;
                            continue;
                        default:
                            unknownProduct = prod;
                            break;
                    }
                }
                if (knownProducts !== 4) {
                    panda.Console.errorUncritical(new panda.AdvancedError('Chrome without Chrome/Mozilla/Safari/AppleWebKit', 136));
                    return false;
                }
                result.browser = unknownProduct.browser;
                result.version = unknownProduct.version;
                result.versionNumber = unknownProduct.versionNumber;
                result.parsedCorretly = true;
                return true;
            }
            Internal.tryOneProductGoogleExtender = tryOneProductGoogleExtender;
            function tryAol(result) {
                if (result.parentBrowser !== ProductName.Chrome) {
                    return false;
                }
                if (result.products.length !== 6) {
                    return false;
                }
                var aol = result.getFirstProductByName(ProductName.AOL);
                var aolBuild = result.getFirstProductByName(ProductName.AOLBuild);
                if (!aol || !aolBuild) {
                    return false;
                }
                result.browser = aol.browser;
                result.version = aolBuild.version;
                result.versionNumber = aolBuild.versionNumber;
                result.parsedCorretly = true;
                return true;
            }
            Internal.tryAol = tryAol;
            function tryFirefox(result) {
                var firefox = result.getFirstProductByName(ProductName.Firefox);
                if (!firefox) {
                    return false;
                }
                var mozilla = result.getFirstProductByName(ProductName.Mozilla);
                if (!mozilla) {
                    panda.Console.errorUncritical(new panda.AdvancedError('Firefox without Mozilla', 136));
                    return false;
                }
                if (mozilla.versionNumber !== 5) {
                    panda.Console.errorUncritical(new panda.AdvancedError('Firefox with mozilla version !==5', 137));
                    return false;
                }
                var gecko = result.getFirstProductByName(ProductName.Gecko);
                if (!gecko) {
                    panda.Console.errorUncritical(new panda.AdvancedError('Firefox without gecko', 138));
                    return false;
                }
                result.browser = firefox.browser;
                result.version = firefox.version;
                result.versionNumber = firefox.versionNumber;
                result.parentBrowser = firefox.browser;
                result.parentVersion = firefox.version;
                result.parentVersionNumber = firefox.versionNumber;
                if (result.products.length === 3) {
                    result.parsedCorretly = true;
                }
                return false;
            }
            Internal.tryFirefox = tryFirefox;
            function tryAir(result) {
                var air = result.getFirstProductByName(ProductName.AdobeAIR);
                if (!air) {
                    return false;
                }
                var mozilla = result.getFirstProductByName(ProductName.Mozilla);
                if (!mozilla) {
                    panda.Console.errorUncritical(new panda.AdvancedError('AdobeAIR without Mozilla', 136));
                    return false;
                }
                if (mozilla.versionNumber !== 5) {
                    panda.Console.errorUncritical(new panda.AdvancedError('AdobeAIR with mozilla version !==5', 137));
                    return false;
                }
                var webkit = result.getFirstProductByName(ProductName.AppleWebKit);
                if (!webkit) {
                    panda.Console.errorUncritical(new panda.AdvancedError('AdobeAIR without webkit', 138));
                    return false;
                }
                result.browser = air.browser;
                result.version = air.version;
                result.versionNumber = air.versionNumber;
                result.parentBrowser = air.browser;
                result.parentVersion = air.version;
                result.parentVersionNumber = air.versionNumber;
                if (result.products.length === 3) {
                    result.parsedCorretly = true;
                }
                return false;
            }
            Internal.tryAir = tryAir;
            function tryPaleMoon(result) {
                var paleMoon = result.getFirstProductByName(ProductName.PaleMoon);
                if (!paleMoon) {
                    return false;
                }
                var firefox = result.getFirstProductByName(ProductName.Firefox);
                if (!firefox) {
                    panda.Console.errorUncritical(new panda.AdvancedError('Palemoon without Firefox', 136));
                    return false;
                }
                var mozilla = result.getFirstProductByName(ProductName.Mozilla);
                if (!mozilla) {
                    panda.Console.errorUncritical(new panda.AdvancedError('Palemoon without Mozilla', 136));
                    return false;
                }
                if (mozilla.versionNumber !== 5) {
                    panda.Console.errorUncritical(new panda.AdvancedError('Palemoon with mozilla version !==5', 137));
                    return false;
                }
                var gecko = result.getFirstProductByName(ProductName.Gecko);
                if (!gecko) {
                    panda.Console.errorUncritical(new panda.AdvancedError('Palemoon without gecko', 138));
                    return false;
                }
                result.browser = paleMoon.browser;
                result.version = paleMoon.version;
                result.versionNumber = paleMoon.versionNumber;
                result.parentBrowser = firefox.browser;
                result.parentVersion = firefox.version;
                result.parentVersionNumber = firefox.versionNumber;
                if (result.products.length === 5 || result.products.length === 5) {
                    result.parsedCorretly = true;
                }
                return false;
            }
            Internal.tryPaleMoon = tryPaleMoon;
            function tryOneProductFirefoxExtender(result) {
                if (result.parentBrowser !== ProductName.Firefox) {
                    return false;
                }
                if (result.products.length !== 4) {
                    return false;
                }
                var knownProducts = 0;
                var unknownProduct;
                for (var _i = 0, _a = result.products; _i < _a.length; _i++) {
                    var prod = _a[_i];
                    switch (prod.browser) {
                        case ProductName.Mozilla:
                        case ProductName.Gecko:
                        case ProductName.Firefox:
                            knownProducts++;
                            continue;
                        default:
                            unknownProduct = prod;
                            break;
                    }
                }
                if (knownProducts !== 3) {
                    panda.Console.errorUncritical(new panda.AdvancedError('Firefox  Mozilla/Gecko/Firefox', 139));
                    return false;
                }
                result.browser = unknownProduct.browser;
                result.version = unknownProduct.version;
                result.versionNumber = unknownProduct.versionNumber;
                result.parsedCorretly = true;
                return true;
            }
            Internal.tryOneProductFirefoxExtender = tryOneProductFirefoxExtender;
            var _ieRexp = /^MSIE ([^ ]+)$/;
            function tryIE(result) {
                var trident = result.getFirstProductByName(ProductName.Trident);
                if (!trident) {
                    return false;
                }
                var version;
                var ieTest;
                for (var _i = 0, _a = result.comments; _i < _a.length; _i++) {
                    var comment = _a[_i];
                    if (!version && comment instanceof Extended.CommentVersionToken) {
                        version = comment;
                    }
                    if (!ieTest) {
                        ieTest = comment.raw.match(_ieRexp);
                    }
                }
                if (version && version.versionNumber === 11) {
                    result.parentBrowser = ProductName.MSIE;
                    result.parentVersion = version.version;
                    result.parentVersionNumber = version.versionNumber;
                    result.browser = ProductName.MSIE;
                    result.version = version.version;
                    result.versionNumber = version.versionNumber;
                    result.parsedCorretly = true;
                    return true;
                }
                if (!ieTest || ieTest.length !== 2) {
                    return false;
                }
                var versionString = ieTest[1];
                var versionNumber = parseFloat(versionString) || 0;
                result.parentBrowser = ProductName.MSIE;
                result.parentVersion = versionString;
                result.parentVersionNumber = versionNumber;
                result.browser = ProductName.MSIE;
                result.version = versionString;
                result.versionNumber = versionNumber;
                result.parsedCorretly = true;
                return true;
            }
            Internal.tryIE = tryIE;
            function fillOSProperties(result) {
                var parsedComments = result.comments;
                var osParsed = false;
                for (var _i = 0, parsedComments_1 = parsedComments; _i < parsedComments_1.length; _i++) {
                    var comment = parsedComments_1[_i];
                    if (comment instanceof Extended.CommentOSToken) {
                        if (osParsed) {
                            continue;
                        }
                        result.osType = comment.osType;
                        result.osName = comment.osName;
                        result.osVersion = comment.osVersion;
                        result.osVersionNumber = comment.osVersionNumber;
                        result.archtecture = comment.architecture;
                        if (result.osName === 'Android') {
                            result.mobileExperimental = true;
                        }
                        osParsed = true;
                    }
                    if (comment instanceof Extended.CommentArchitectureToken) {
                        if (result.archtecture !== 'unknown') {
                            continue;
                        }
                        result.archtecture = comment.raw;
                    }
                }
            }
            Internal.fillOSProperties = fillOSProperties;
            function parseProducts(splitted) {
                var parsedProducts = [];
                for (var _i = 0, _a = splitted.products; _i < _a.length; _i++) {
                    var productString = _a[_i];
                    var product = parseProduct(productString, false);
                    if (product) {
                        parsedProducts.push(product);
                    }
                }
                return parsedProducts;
            }
            Internal.parseProducts = parseProducts;
            function parseComments(splitted) {
                var parsedComments = [];
                for (var _i = 0, _a = splitted.comments; _i < _a.length; _i++) {
                    var commentString = _a[_i];
                    var parsedComment = splitComment(commentString);
                    parsedComments = parsedComments.concat(parsedComment);
                }
                return parsedComments;
            }
            Internal.parseComments = parseComments;
            function splitAgent(agent, throwErrors) {
                var PRODUCT = 0;
                var COMMENT = 1;
                var UNKNOWN = 2;
                var result = new SplitterResult();
                var comments = result.comments;
                var products = result.products;
                var state = UNKNOWN;
                var part = '';
                var commentOpenBrackets = 0;
                function writeAndReset() {
                    if (commentOpenBrackets !== 0) {
                        if (throwErrors) {
                            throw new SplitError('Reset with commentOpenBrackets !== 0', 100);
                        }
                        else {
                            return null;
                        }
                    }
                    if (state === COMMENT) {
                        comments.push(part);
                    }
                    if (state === PRODUCT) {
                        products.push(part);
                    }
                    part = '';
                    state = UNKNOWN;
                }
                var debugStr = '';
                var l = agent.length;
                for (var i = 0; i < l; i++) {
                    var char = agent.charAt(i);
                    debugStr += char;
                    if (state === UNKNOWN) {
                        switch (char) {
                            case '(':
                                state = COMMENT;
                                commentOpenBrackets++;
                                continue;
                            case ')':
                                if (throwErrors) {
                                    throw new SplitError('Closed bracket in unnown state', 101);
                                }
                                else {
                                    return null;
                                }
                            case ' ':
                                continue;
                            default:
                                state = PRODUCT;
                                break;
                        }
                    }
                    if (state === PRODUCT) {
                        switch (char) {
                            case '(':
                            case ')':
                                if (throwErrors) {
                                    throw new SplitError('Bracket while product parsing', 102);
                                }
                                else {
                                    return null;
                                }
                            case ' ':
                                writeAndReset();
                                continue;
                            default:
                                part += char;
                                continue;
                        }
                    }
                    if (state === COMMENT) {
                        switch (char) {
                            case '(':
                                commentOpenBrackets++;
                                part += char;
                                continue;
                            case ')':
                                commentOpenBrackets--;
                                if (commentOpenBrackets === 0) {
                                    writeAndReset();
                                    continue;
                                }
                                if (commentOpenBrackets < 0) {
                                    if (throwErrors) {
                                        throw new SplitError('Logic error, commentOpenBrackets < 0', 103);
                                    }
                                    else {
                                        return null;
                                    }
                                }
                                part += char;
                                continue;
                            default:
                                part += char;
                                continue;
                        }
                    }
                }
                if (state === PRODUCT) {
                    products.push(part);
                }
                if (state === COMMENT) {
                    if (throwErrors) {
                        throw new SplitError('Unexpected comment end', 104);
                    }
                    else {
                        return null;
                    }
                }
                return result;
            }
            Internal.splitAgent = splitAgent;
            // product like Chrome/46.0.2490.80
            function parseProduct(product, throwErrors) {
                var name = '';
                var version = '';
                var NAME = 0;
                var VERSION = 1;
                var UNKNOWN = 2;
                var state = UNKNOWN;
                var debugStr = '';
                var l = product.length;
                for (var i = 0; i < l; i++) {
                    var char = product.charAt(i);
                    debugStr += char;
                    if (state === UNKNOWN) {
                        if (char === '/') {
                            if (name.length === 0) {
                                if (throwErrors) {
                                    throw new ParseProductError('No name before / in unknown state', 110);
                                }
                                else {
                                    return null;
                                }
                            }
                            state = VERSION;
                            continue;
                        }
                        state = NAME;
                    }
                    if (state === NAME) {
                        if (char === '/') {
                            if (name.length === 0) {
                                if (throwErrors) {
                                    throw new ParseProductError('No name before / in name state', 111);
                                }
                                else {
                                    return null;
                                }
                            }
                            state = VERSION;
                            continue;
                        }
                        name += char;
                        continue;
                    }
                    if (state === VERSION) {
                        if (char === '/') {
                            if (name === 'Nichrome' && version === 'self') { // Browser specific: Nichrome
                                version = '';
                                continue;
                            }
                            if (throwErrors) {
                                throw new ParseProductError('Unexpected / in version state', 112);
                            }
                            else {
                                return null;
                            }
                        }
                        version += char;
                        continue;
                    }
                }
                if (name.length === 0) {
                    if (throwErrors) {
                        throw new ParseProductError('No product name', 113);
                    }
                    else {
                        return null;
                    }
                }
                if (name === 'TO-Browser' && version.indexOf('TOB') === 0) {
                    version = version.slice(3);
                }
                if (version.length === 0) {
                    if (throwErrors) {
                        throw new ParseProductError('No version', 114);
                    }
                    else {
                        return null;
                    }
                }
                var result = new Extended.Product();
                result.raw = product;
                result.browser = name;
                result.version = version;
                result.versionNumber = parseFloat(version) || 0;
                return result;
            }
            Internal.parseProduct = parseProduct;
            function splitComment(comment) {
                var result = [];
                var splitted = comment.split('; ');
                for (var _i = 0, splitted_1 = splitted; _i < splitted_1.length; _i++) {
                    var part = splitted_1[_i];
                    var token = null;
                    token = tryParseOSToken(part) ||
                        tryParseProductToken(part) ||
                        tryParseVersionToken(part) ||
                        tryParseAchitectureToken(part) ||
                        new Extended.CommentUnknownToken();
                    token.raw = part;
                    result.push(token);
                }
                return result;
            }
            Internal.splitComment = splitComment;
            function tryParseAchitectureToken(str) {
                if (str === 'WOW64' || str === 'Win64' || str === 'x64') {
                    return new Extended.CommentArchitectureToken();
                }
                return null;
            }
            Internal.tryParseAchitectureToken = tryParseAchitectureToken;
            function tryParseProductToken(str) {
                var parsed = parseProduct(str, false);
                if (!parsed) {
                    return null;
                }
                var token = new Extended.CommentProductToken();
                token.product = parsed;
                return token;
            }
            Internal.tryParseProductToken = tryParseProductToken;
            function tryParseVersionToken(str) {
                var splitResult = str.match(/rv\:(.*)/);
                if (splitResult && splitResult.length === 2) {
                    var versionNumber = parseFloat(splitResult[1]);
                    if (!isNaN(versionNumber)) {
                        var result = new Extended.CommentVersionToken();
                        result.version = splitResult[1];
                        result.versionNumber = versionNumber;
                        return result;
                    }
                }
                return null;
            }
            Internal.tryParseVersionToken = tryParseVersionToken;
            function tryParseOSToken(str) {
                var result = null;
                var splitResult;
                //try { // Windows
                splitResult = str.match(/Windows NT ?(.*)/);
                if (splitResult && splitResult.length === 2) {
                    result = new Extended.CommentOSToken();
                    var version = splitResult[1];
                    if (version === '') {
                        version = 'unknown';
                    }
                    var versionNumber = parseFloat(version) || 0;
                    result.osType = 'Windows';
                    var winNames = {
                        "Windows NT 10.0": "Windows 10",
                        "Windows NT 6.3": "Windows 8.1",
                        "Windows NT 6.2": "Windows 8",
                        "Windows NT 6.1": "Windows 7",
                        "Windows NT 6.0": "Windows Vista",
                        "Windows NT 5.2": "Windows Server 2003; Windows XP x64 Edition",
                        "Windows NT 5.1": "Windows XP",
                        "Windows NT 5.01": "Windows 2000 SP1",
                        "Windows NT 5.0": "Windows 2000",
                        "Windows NT 4.0": "Windows NT 4.0",
                        "Windows NT": "Windows Unknown"
                    };
                    var name_1 = 'unknown';
                    if (!winNames[str]) {
                        panda.Console.errorUncritical(new panda.AdvancedError('Unknown windows name: ' + str, 150));
                    }
                    else {
                        name_1 = winNames[str];
                    }
                    result.osName = name_1;
                    result.osVersion = version;
                    result.osVersionNumber = versionNumber;
                    result.architecture = 'unknown';
                    return result;
                }
                // } catch (e){
                // 	PandaConsole.errorUncritical(e)
                // };
                // try { // OS X
                splitResult = str.match(/Intel Mac OS X (.*)/);
                if (splitResult && splitResult.length === 2) {
                    result = new Extended.CommentOSToken();
                    var version = splitResult[1].replace(/_/g, '.');
                    var versionNumber = parseFloat(version) || 0;
                    result.osType = 'OS X';
                    result.osName = 'Intel Mac OS X';
                    result.osVersion = version;
                    result.osVersionNumber = versionNumber;
                    result.architecture = 'Intel Mac OS X';
                    return result;
                }
                // } catch (e){
                // 	PandaConsole.errorUncritical(e)
                // };
                // try { //Chrom OS
                splitResult = str.match(/CrOS ([^ ]+) (.*)/);
                if (splitResult && splitResult.length === 3) {
                    result = new Extended.CommentOSToken();
                    var version = splitResult[2];
                    var versionNumber = parseFloat(version) || 0;
                    result.osType = 'Chrome OS';
                    result.osName = 'Chrome OS';
                    result.osVersion = version;
                    result.osVersionNumber = versionNumber;
                    result.architecture = splitResult[1];
                    return result;
                }
                // } catch (e){
                // 	PandaConsole.errorUncritical(e)
                // };
                // try { //Linux
                splitResult = str.match(/Linux (.*)/);
                if (splitResult && splitResult.length === 2) {
                    result = new Extended.CommentOSToken();
                    result.osType = 'Linux';
                    result.osName = 'Linux';
                    result.osVersion = 'unknown';
                    result.osVersionNumber = 0;
                    result.architecture = splitResult[1];
                    return result;
                }
                // } catch (e){
                // 	PandaConsole.errorUncritical(e)
                // };
                // try { // CPU iPhone OS 9_3_2 like Mac OS X
                splitResult = str.match(/CPU iPhone OS (.*) like Mac OS X/);
                if (splitResult && splitResult.length === 2) {
                    result = new Extended.CommentOSToken();
                    var version = splitResult[1].replace(/_/g, '.');
                    var versionNumber = parseFloat(version) || 0;
                    result.osType = 'iPhone';
                    result.osName = 'iPhone';
                    result.osVersion = version;
                    result.osVersionNumber = versionNumber;
                    result.architecture = 'iPhone';
                    return result;
                }
                // } catch (e){
                // 	PandaConsole.errorUncritical(e)
                // };
                // try { // iOS
                if (str == 'iOS') {
                    result = new Extended.CommentOSToken();
                    result.osType = 'iOS';
                    result.osName = 'iOS';
                    result.osVersion = 'unknown';
                    result.osVersionNumber = 0;
                    result.architecture = 'Air';
                    return result;
                }
                // } catch (e){
                // 	PandaConsole.errorUncritical(e)
                // };
                // try { // CPU OS 9_3_2 like Mac OS X //ipad
                splitResult = str.match(/CPU OS (.*) like Mac OS X/);
                if (splitResult && splitResult.length === 2) {
                    result = new Extended.CommentOSToken();
                    var version = splitResult[1].replace(/_/g, '.');
                    var versionNumber = parseFloat(version) || 0;
                    result.osType = 'iPad';
                    result.osName = 'iPad';
                    result.osVersion = version;
                    result.osVersionNumber = versionNumber;
                    result.architecture = 'iPad';
                    return result;
                }
                // } catch (e){
                // 	PandaConsole.errorUncritical(e)
                // };
                // try { // Android 4.4.2
                splitResult = str.match(/Android (.*)/);
                if (splitResult && splitResult.length === 2) {
                    result = new Extended.CommentOSToken();
                    var version = splitResult[1];
                    var versionNumber = parseFloat(version) || 0;
                    result.osType = 'Android';
                    result.osName = 'Android';
                    result.osVersion = version;
                    result.osVersionNumber = versionNumber;
                    result.architecture = 'Android';
                    return result;
                }
                // } catch (e){
                // 	PandaConsole.errorUncritical(e)
                // };
                // try { // Android
                if (str == 'Android') {
                    result = new Extended.CommentOSToken();
                    result.osType = 'Android';
                    result.osName = 'Android';
                    result.osVersion = 'unknown';
                    result.osVersionNumber = 0;
                    result.architecture = 'Air';
                    return result;
                }
                // } catch (e){
                // 	PandaConsole.errorUncritical(e)
                // };
                return result;
            }
            Internal.tryParseOSToken = tryParseOSToken;
            var SplitterResult = /** @class */ (function () {
                function SplitterResult() {
                    this.products = [];
                    this.comments = [];
                }
                return SplitterResult;
            }());
            Internal.SplitterResult = SplitterResult;
        })(Internal = UserAgentParser.Internal || (UserAgentParser.Internal = {}));
    })(UserAgentParser = panda.UserAgentParser || (panda.UserAgentParser = {}));
})(panda || (panda = {}));
///ts:ref=UserAgentParser
/// <reference path="./UserAgentParser.ts"/> ///ts:ref:generated
var panda;
(function (panda) {
    var Browser = /** @class */ (function () {
        function Browser() {
        }
        Browser.getUserAgent = function () {
            if (!Browser._userAgent) {
                Browser._userAgent = navigator.userAgent;
            }
            return Browser._userAgent;
        };
        Browser.getInfo = function () {
            if (!Browser._info) {
                var agent = Browser.getUserAgent();
                this._info = panda.UserAgentParser.parse(agent);
            }
            return Browser._info;
        };
        Browser.isIe = function () {
            return Browser.getInfo().parentBrowser === Browser.MSIE;
        };
        Browser.isEdge = function () {
            return Browser.getInfo().parentBrowser === Browser.Edge;
        };
        Browser.isChrome = function () {
            return Browser.getInfo().parentBrowser === Browser.Chrome;
        };
        Browser.isFireFox = function () {
            return Browser.getInfo().parentBrowser === Browser.Firefox;
        };
        Browser.isFacebook = function () {
            return Browser.getInfo().browser === Browser.FacebookCanvasDesktop;
        };
        Browser.isOldOpera = function () {
            return Browser.getInfo().parentBrowser === Browser.Opera; // у новой оперы parentBrowser == Chrome
        };
        Browser.isSafari = function () {
            return Browser.getInfo().parentBrowser === Browser.Safari;
        };
        Browser.isIos = function () {
            return Browser.getInfo().osType === 'iPhone' || Browser.getInfo().osType === 'iPad' || Browser.getInfo().osType === 'iOs';
        };
        Browser.isAndroid = function () {
            return Browser.getInfo().osType === 'Android';
        };
        Browser.MSIE = 'MSIE';
        Browser.Edge = 'Edge';
        Browser.Chrome = 'Chrome';
        Browser.Firefox = 'Firefox';
        Browser.Opera = 'Opera';
        Browser.Safari = 'Safari';
        Browser.YaBrowser = 'YaBrowser';
        Browser.FacebookCanvasDesktop = 'FacebookCanvasDesktop';
        Browser._userAgent = null;
        Browser._info = null;
        return Browser;
    }());
    panda.Browser = Browser;
})(panda || (panda = {}));
///ts:ref=Browser
/// <reference path="./Browser.ts"/> ///ts:ref:generated
var panda;
(function (panda) {
    var BrowserSpecific = /** @class */ (function () {
        function BrowserSpecific() {
        }
        BrowserSpecific.hasStackOnUnthrowedError = function () {
            if (BrowserSpecific._hasStackOnUnthrowedError === null) {
                BrowserSpecific._hasStackOnUnthrowedError = panda.Browser.isChrome() || panda.Browser.isFireFox() || panda.Browser.isEdge() || panda.Browser.isOldOpera() || panda.Browser.isSafari();
            }
            return BrowserSpecific._hasStackOnUnthrowedError;
        };
        BrowserSpecific.errorHasExtenderConstructorLine = function () {
            if (BrowserSpecific._errorHasExtenderConstructorLine === null) {
                BrowserSpecific._errorHasExtenderConstructorLine = !panda.Browser.isOldOpera();
            }
            return BrowserSpecific._errorHasExtenderConstructorLine;
        };
        BrowserSpecific.errorStackHasNoClass = function () {
            if (BrowserSpecific._errorStackHasNoClass === null) {
                BrowserSpecific._errorStackHasNoClass = panda.Browser.isSafari() || panda.Browser.isIos();
            }
            return BrowserSpecific._errorStackHasNoClass;
        };
        BrowserSpecific.colorsInConsole = function () {
            if (BrowserSpecific._colorsInConsole === null) {
                BrowserSpecific._colorsInConsole = panda.Browser.isChrome() || panda.Browser.isFireFox();
            }
            return BrowserSpecific._colorsInConsole;
        };
        BrowserSpecific.inconsistenceUserAgent = function () {
            if (BrowserSpecific._inconsistenceUserAgent === null) {
                BrowserSpecific._inconsistenceUserAgent = panda.Browser.isIe();
            }
            return BrowserSpecific._inconsistenceUserAgent;
        };
        BrowserSpecific.functionHoistingBug = function () {
            if (BrowserSpecific._functionHoistingBug === null) {
                var version = Math.floor(panda.Browser.getInfo().versionNumber);
                BrowserSpecific._functionHoistingBug = panda.Browser.isFireFox() && version >= 42 && version <= 45;
            }
            return BrowserSpecific._functionHoistingBug;
        };
        BrowserSpecific.unhandledErrorHasNoCol = function () {
            if (BrowserSpecific._unhandledErrorHasNoCol === null) {
                BrowserSpecific._unhandledErrorHasNoCol = panda.Browser.isOldOpera() || (panda.Browser.isIe() && panda.Browser.getInfo().versionNumber < 11);
            }
            return BrowserSpecific._unhandledErrorHasNoCol;
        };
        BrowserSpecific.unhandledErrorBug = function () {
            if (BrowserSpecific._unhandledErrorBug === null) {
                BrowserSpecific._unhandledErrorBug = panda.Browser.isEdge() || panda.Browser.isSafari() || panda.Browser.isIos() || panda.Browser.isOldOpera() || (panda.Browser.isIe() && panda.Browser.getInfo().versionNumber < 11);
            }
            return BrowserSpecific._unhandledErrorBug;
        };
        BrowserSpecific.onlyExperimentalWebGL = function () {
            if (BrowserSpecific._onlyExperimentalWebGL === null) {
                BrowserSpecific._onlyExperimentalWebGL = panda.Browser.isEdge() || panda.Browser.isIe();
            }
            return BrowserSpecific._onlyExperimentalWebGL;
        };
        BrowserSpecific.disabledWebGLDebugRendererInfo = function () {
            if (BrowserSpecific._disabledWebGLDebugRendererInfo === null) {
                BrowserSpecific._disabledWebGLDebugRendererInfo = panda.Browser.isFireFox() || panda.Browser.isIos();
            }
            return BrowserSpecific._disabledWebGLDebugRendererInfo;
        };
        BrowserSpecific.XDomainRequestNeeded = function () {
            if (BrowserSpecific._XDomainRequestNeeded === null) {
                BrowserSpecific._XDomainRequestNeeded = panda.Browser.isIe() && (Math.floor(panda.Browser.getInfo().versionNumber) === 8 || Math.floor(panda.Browser.getInfo().versionNumber) === 9);
            }
            return BrowserSpecific._XDomainRequestNeeded;
        };
        BrowserSpecific.noEventInHandlers = function () {
            if (BrowserSpecific._noEventInHandlers === null) {
                BrowserSpecific._noEventInHandlers = panda.Browser.isIe() && Math.floor(panda.Browser.getInfo().versionNumber) <= 9;
            }
            return BrowserSpecific._noEventInHandlers;
        };
        BrowserSpecific.scrrenSizeSupported = function () {
            if (BrowserSpecific._scrrenSizeSupported === null) {
                if (window.screen && typeof window.screen.width === 'number') {
                    BrowserSpecific._scrrenSizeSupported = true;
                }
                else {
                    BrowserSpecific._scrrenSizeSupported = false;
                }
            }
            return BrowserSpecific._scrrenSizeSupported;
        };
        BrowserSpecific._hasStackOnUnthrowedError = null;
        BrowserSpecific._errorHasExtenderConstructorLine = null;
        BrowserSpecific._errorStackHasNoClass = null;
        BrowserSpecific._colorsInConsole = null;
        BrowserSpecific._inconsistenceUserAgent = null; // у IE 11 юзер агент который он отдаёт при запросах не содержит .NET комментов
        BrowserSpecific._functionHoistingBug = null;
        BrowserSpecific._unhandledErrorHasNoCol = null;
        BrowserSpecific._unhandledErrorBug = null;
        BrowserSpecific._onlyExperimentalWebGL = null;
        BrowserSpecific._disabledWebGLDebugRendererInfo = null;
        BrowserSpecific._XDomainRequestNeeded = null;
        BrowserSpecific._noEventInHandlers = null;
        BrowserSpecific._scrrenSizeSupported = null;
        return BrowserSpecific;
    }());
    panda.BrowserSpecific = BrowserSpecific;
})(panda || (panda = {}));
var panda;
(function (panda) {
    var ErsatzSet = /** @class */ (function () {
        function ErsatzSet(name) {
            if (name === void 0) { name = 'unnamed'; }
            this.hash = {};
            this._name = name;
        }
        ErsatzSet.prototype.addObject = function (obj) {
            this.hash[obj.uniqId] = obj;
        };
        ErsatzSet.prototype.removeObject = function (obj) {
            var objInHash = this.hash[obj.uniqId];
            panda.Console.here;
            if (!objInHash) {
                panda.Console.errorUncritical(new panda.AdvancedError('Set ' + this._name + ' attemp to remove without object'));
            }
            delete this.hash[obj.uniqId];
        };
        ErsatzSet.prototype.hasObject = function (obj) {
            return !!this.hash[obj.uniqId];
        };
        ErsatzSet.prototype.isEmpty = function () {
            for (var key in this.hash) {
                return false;
            }
            return true;
        };
        return ErsatzSet;
    }());
    panda.ErsatzSet = ErsatzSet;
})(panda || (panda = {}));
var panda;
(function (panda) {
    var Console = /** @class */ (function () {
        function Console() {
        }
        Console.$INIT = function () {
            var origConsoleLog = console.log;
            console.log = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                Console.logDebug.apply(Console, __spreadArrays(['console.log'], args));
            };
            console.warn = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                Console.logWarn.apply(Console, __spreadArrays(['console.warn'], args));
            };
            console.error = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                Console.logError.apply(Console, __spreadArrays(['console.error'], args));
            };
            console.exception = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                Console.logError.apply(Console, __spreadArrays(['console.exception'], args));
            };
            console.assert = function (assert) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                if (!assert) {
                    Console.logWarn.apply(Console, __spreadArrays(['console.assert failed'], args));
                }
                else {
                    Console.logDebug.apply(Console, __spreadArrays(['console.assert ok'], args));
                }
            };
            Console.onErrorUncritical = new panda.Signal();
            Console.onLog = new panda.Signal();
            panda.GlobalErrorListener.onGlobalError.addListener(Console.handler_unhaltedError);
            this.onErrorUncritical.addListener(function PandaConsole_handler_errorUncritical(error) {
                Console.logWarn('' + error);
                var stack = panda.AdvancedError.getStacktrace(error);
                if (stack) {
                    Console.logWarn(stack);
                }
            });
            function colorConsoleWriter(level, message, args) {
                // let argsCopy = args.slice();
                // if (PandaConsoleMessageStyles.hasStyle(level)) {
                // 	argsCopy.unshift('%c ' + message, PandaConsoleMessageStyles.getStyle(level));
                // } else {
                // 	argsCopy.unshift(message);
                // }
                // origConsoleLog.apply(console, argsCopy);
                var argsArray = [message].concat(args);
                if (Console.filterFunc instanceof Function) {
                    if (!Console.filterFunc.apply(null, argsArray)) {
                        return;
                    }
                }
                origConsoleLog.apply(console, argsArray);
            }
            function normalConsoleWriter(level, message, args) {
                // let argsCopy = args.slice();
                // argsCopy.unshift(message);
                // origConsoleLog.apply(console, argsCopy);
                var argsArray = [message].concat(args);
                if (Console.filterFunc instanceof Function) {
                    if (!Console.filterFunc.apply(null, argsArray)) {
                        return;
                    }
                }
                origConsoleLog.apply(console, argsArray);
            }
            function stupidConsoleWriter(level, message, args) {
                if (level === panda.ConsoleMessageLevels.WARN) {
                    //debugger;
                }
                var argsArray = [message].concat(args);
                if (Console.filterFunc instanceof Function) {
                    if (!Console.filterFunc.apply(null, argsArray)) {
                        return;
                    }
                }
                origConsoleLog(level + ' ' + message + ' ' + args.join(' '));
            }
            if (typeof console === "undefined" || typeof origConsoleLog === "undefined") {
                // skip logging to console
            }
            else {
                if (origConsoleLog) {
                    if (origConsoleLog.apply) {
                        if (this.colorsSupport()) {
                            this.onLog.addListener(colorConsoleWriter);
                        }
                        else {
                            this.onLog.addListener(normalConsoleWriter);
                        }
                    }
                    else {
                        this.onLog.addListener(stupidConsoleWriter);
                    }
                }
            }
        };
        Console.logExternal = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.onLog.emit(panda.ConsoleMessageLevels.EXTERNAL, message, args);
        };
        Console.logInfo = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.onLog.emit(panda.ConsoleMessageLevels.INFO, message, args);
        };
        Console.logDebug = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.onLog.emit(panda.ConsoleMessageLevels.DEBUG, message, args);
        };
        Console.logWarn = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.onLog.emit(panda.ConsoleMessageLevels.WARN, message, args);
        };
        Console.logError = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.onLog.emit(panda.ConsoleMessageLevels.ERROR, message, args);
        };
        Console.errorUncritical = function (error) {
            this.onErrorUncritical.emit(error);
        };
        Console.handler_unhaltedError = function (msg, url, line, col, error) {
            Console.logError(msg, url, line, col, panda.AdvancedError.getStacktrace(error));
        };
        Console.colorsSupport = function () {
            if (this._colorsSupport == null) {
                this._colorsSupport = panda.BrowserSpecific.colorsInConsole();
            }
            return this._colorsSupport;
        };
        Console.here = true;
        Console.onErrorUncritical = null;
        Console.onLog = null;
        Console._colorsSupport = null;
        return Console;
    }());
    panda.Console = Console;
})(panda || (panda = {}));
///ts:ref=Console
/// <reference path="../console/Console.ts"/> ///ts:ref:generated
var panda;
(function (panda) {
    var List = /** @class */ (function () {
        function List(name) {
            this._head = null;
            this._tail = null;
            this.$name = null;
            this._length = 0;
            this.$name = name;
        }
        List.prototype.getHead = function () {
            var head = this.findValidHead();
            return this.getIteratorForNode(head);
        };
        List.prototype.getTail = function () {
            var tail = this.findValidTail();
            return this.getIteratorForNode(tail);
        };
        List.prototype.getIsEmpty = function () {
            return this._length === 0;
        };
        List.prototype.getLength = function () {
            return this._length;
        };
        /**
        * Destroys iterator after removing by default
        */
        List.prototype.remove = function (iterator, destroyIterator) {
            if (destroyIterator === void 0) { destroyIterator = true; }
            iterator.$removeElement(destroyIterator);
            this._length--;
        };
        /**
        * You MUST destroy iterator after accessing node, otherwise removed item will be zombie forever
        */
        List.prototype.search = function (searchable) {
            var iterator = this.getTail();
            while (!iterator.getEnded()) {
                if (iterator.getValue() === searchable) {
                    return iterator;
                }
                iterator.prev();
            }
            return null;
        };
        List.prototype.has = function (searchable) {
            var iterator = this.getTail();
            while (!iterator.getEnded()) {
                if (iterator.getValue() === searchable) {
                    iterator.destroy();
                    this.$returnIteratorToPool(iterator);
                    return true;
                }
                iterator.prev();
            }
            return false;
        };
        List.prototype.insert = function (insertable, priority) {
            if (priority === void 0) { priority = 0; }
            var node = this._tail;
            var insertableNode = new ListNode(this, insertable, priority);
            while (node && node.priority < priority) {
                node = node.prev;
            }
            if (!node) {
                this.addBefore(insertableNode, this._head);
            }
            else {
                this.addAfter(insertableNode, node);
            }
            this._length++;
        };
        List.prototype.findValidHead = function () {
            var head = this._head;
            while (head && !head.getIsValid()) {
                head = head.next;
            }
            return head;
        };
        List.prototype.findValidTail = function () {
            var tail = this._tail;
            while (tail && !tail.getIsValid()) {
                tail = tail.prev;
            }
            return tail;
        };
        List.prototype.getIteratorForNode = function (node) {
            var pool = List._ITERATOR_POOL;
            if (pool.length) {
                var iter = pool.pop();
                iter.$reSetup(node, this.$name);
                panda.GlobalInstanceChecker.watch(iter);
                return iter;
            }
            else {
                return new ListIterator(node, this.$name);
            }
        };
        List.prototype.$returnIteratorToPool = function (iter) {
            if (iter.getIsValid()) {
                throw new panda.AdvancedError('Attempt to return valid iterator to pool');
            }
            if (List._ITERATOR_POOL.length >= List._ITERATOR_POOL_MAX) {
                panda.Console.logWarn('List._ITERATOR_POOL.length >= List._ITERATOR_POOL_MAX, skipping');
                // do nothing with iter
                return;
            }
            panda.GlobalInstanceChecker.unWatch(iter);
            List._ITERATOR_POOL.push(iter);
        };
        List.prototype.addAfter = function (insertableNode, node) {
            if (node === void 0) { node = null; }
            if (!node) {
                if (this._tail) {
                    node = this._tail;
                }
                else {
                    this._head = insertableNode;
                    this._tail = insertableNode;
                    insertableNode.next = null;
                    insertableNode.prev = null;
                }
            }
            if (node) {
                var tail = node.next;
                node.next = insertableNode;
                insertableNode.prev = node;
                insertableNode.next = tail;
                if (tail) {
                    tail.prev = insertableNode;
                }
                else {
                    this._tail = insertableNode;
                }
            }
        };
        List.prototype.addBefore = function (insertableNode, node) {
            if (node === void 0) { node = null; }
            if (!node) {
                if (this._head) {
                    node = this._head;
                }
                else {
                    this._head = insertableNode;
                    this._tail = insertableNode;
                    insertableNode.next = null;
                    insertableNode.prev = null;
                }
            }
            if (node) {
                var head = node.prev;
                node.prev = insertableNode;
                insertableNode.next = node;
                insertableNode.prev = head;
                if (head) {
                    head.next = insertableNode;
                }
                else {
                    this._head = insertableNode;
                }
            }
        };
        List.prototype.$removeNode = function (node) {
            panda.Console.here;
            if (node.getIsValid()) {
                panda.Console.errorUncritical(new panda.AdvancedError('Attempt to remove valid Node from List'));
            }
            if (node.getRefCounter() !== 0) {
                panda.Console.errorUncritical(new panda.AdvancedError('Attempt to remove Node from List with refcounter !== 0'));
            }
            var prev = node.prev;
            if (prev) {
                prev.next = node.next;
            }
            else {
                this._head = node.next;
            }
            var next = node.next;
            if (next) {
                next.prev = node.prev;
            }
            else {
                this._tail = node.prev;
            }
            node.next = null;
            node.prev = null;
        };
        List._ITERATOR_POOL = [];
        List._ITERATOR_POOL_MAX = 1000;
        return List;
    }());
    panda.List = List;
    var ListNode = /** @class */ (function () {
        function ListNode(list, value, priority, next, prev) {
            if (value === void 0) { value = null; }
            if (next === void 0) { next = null; }
            if (prev === void 0) { prev = null; }
            this._refCounter = 0;
            this._list = list;
            this.value = value;
            this.priority = priority;
            this.next = next;
            this.prev = prev;
            this._isValid = true;
            this._listName = list.$name;
        }
        ListNode.prototype.getIsValid = function () {
            return this._isValid;
        };
        ListNode.prototype.getRefCounter = function () {
            return this._refCounter;
        };
        ListNode.prototype.setRefCounter = function (value) {
            this._refCounter = value;
            if (this._refCounter === 0 && this._isValid === false) {
                this._list.$removeNode(this);
            }
        };
        ListNode.prototype.incRefcounter = function () {
            this.setRefCounter(this._refCounter + 1);
        };
        ListNode.prototype.decRefcounter = function () {
            this.setRefCounter(this._refCounter - 1);
        };
        ListNode.prototype.invalidate = function () {
            this._isValid = false;
            this.value = null;
        };
        return ListNode;
    }());
    panda.ListNode = ListNode;
    var ListIterator = /** @class */ (function () {
        function ListIterator(node, listName) {
            this.uniqId = panda.UniqIdGenerator.getUniq();
            this._listName = listName;
            panda.GlobalInstanceChecker.watch(this);
            // @if PERF
            // PerfUtils.event(this._listName, 'ListIterator_constructor');
            // @endif
            this.setNode(node);
        }
        ListIterator.prototype.unWatch = function () {
            panda.GlobalInstanceChecker.unWatch(this);
        };
        ListIterator.prototype.$reSetup = function (node, listName) {
            this._listName = listName;
            this.setNode(node);
        };
        ListIterator.prototype.copyFrom = function (iter) {
            this._listName = iter._listName;
            this.setNode(iter.getNode());
        };
        ListIterator.prototype.clone = function () {
            // @if PERF
            // PerfUtils.event(this._listName, 'ListIterator_clone');
            // @endif
            return new ListIterator(this.getNode(), this._listName);
        };
        ListIterator.prototype.getNode = function () {
            return this.$_node;
        };
        ListIterator.prototype.setNode = function (node) {
            if (this.$_node === node) {
                return;
            }
            // @if PERF
            //PerfUtils.event(this._listName, 'setNode');
            // @endif
            panda.Console.here;
            if (this.$_node) {
                this.$_node.decRefcounter();
            }
            this.$_node = node;
            if (this.$_node) {
                if (!this.$_node.getIsValid()) {
                    panda.Console.errorUncritical(new panda.AdvancedError('Attempt set invalid node to iterator'));
                }
                this.$_node.incRefcounter();
            }
        };
        ListIterator.prototype.getEnded = function () {
            return this.getNode() === null;
        };
        ListIterator.prototype.getIsValid = function () {
            return this.getNode() !== null;
        };
        ListIterator.prototype.getValue = function () {
            var node = this.getNode();
            panda.Console.here;
            if (!node) {
                panda.Console.errorUncritical(new panda.AdvancedError('Attemt to get value from invalid iterator, without node'));
                return null;
            }
            if (!node.getIsValid()) {
                panda.Console.errorUncritical(new panda.AdvancedError('Attemt to get value from invalid iterator, with invalid node'));
                return null;
            }
            return node.value;
        };
        ListIterator.prototype.getPriority = function () {
            panda.Console.here;
            var node = this.getNode();
            if (!node) {
                panda.Console.errorUncritical(new panda.AdvancedError('Attemt to get value from invalid iterator, without node'));
                return NaN;
            }
            if (!node.getIsValid()) {
                panda.Console.errorUncritical(new panda.AdvancedError('Attemt to get value from invalid iterator, with invalid node'));
                return NaN;
            }
            return node.priority;
        };
        ListIterator.prototype.$removeElement = function (destroyIterator) {
            panda.Console.here;
            if (this.getEnded()) {
                panda.Console.errorUncritical(new panda.AdvancedError('Attemt to remove element by invalid iterator'));
                return;
            }
            this.getNode().invalidate();
            if (destroyIterator) {
                this.destroy();
            }
        };
        ListIterator.prototype.next = function () {
            panda.Console.here;
            var node = this.getNode();
            if (!node) {
                panda.Console.errorUncritical(new panda.AdvancedError('Attemt to find next on invalid iterator'));
                return null;
            }
            while (true) {
                if (node.next) {
                    node = node.next;
                    if (node.getIsValid()) {
                        this.setNode(node);
                        break;
                    }
                    else {
                        continue;
                    }
                }
                else {
                    this.setNode(null);
                    break;
                }
            }
            return this;
        };
        ListIterator.prototype.prev = function () {
            panda.Console.here;
            var node = this.getNode();
            if (!node) {
                panda.Console.errorUncritical(new panda.AdvancedError('Attemt to find prev on invalid iterator'));
                return null;
            }
            while (true) {
                if (node.prev) {
                    node = node.prev;
                    if (node.getIsValid()) {
                        this.setNode(node);
                        break;
                    }
                    else {
                        continue;
                    }
                }
                else {
                    this.setNode(null);
                    break;
                }
            }
            return this;
        };
        ListIterator.prototype.destroy = function () {
            this.setNode(null);
        };
        ListIterator.prototype.getName = function () {
            return this._listName;
        };
        return ListIterator;
    }());
    panda.ListIterator = ListIterator;
})(panda || (panda = {}));
var panda;
(function (panda) {
    var ConsoleMessageLevels = /** @class */ (function () {
        function ConsoleMessageLevels() {
        }
        ConsoleMessageLevels.WARN = "Warn";
        ConsoleMessageLevels.ERROR = "Error";
        ConsoleMessageLevels.DEBUG = "Debug";
        ConsoleMessageLevels.INFO = "Info";
        ConsoleMessageLevels.EXTERNAL = "External";
        return ConsoleMessageLevels;
    }());
    panda.ConsoleMessageLevels = ConsoleMessageLevels;
    var ConsoleMessageStyles = /** @class */ (function () {
        function ConsoleMessageStyles() {
        }
        ConsoleMessageStyles.getStyle = function (level) {
            var style = ConsoleMessageStyles[level];
            return style;
        };
        ConsoleMessageStyles.hasStyle = function (level) {
            var style = ConsoleMessageStyles[level];
            return !!style;
        };
        ConsoleMessageStyles.Warn = "background: #000000; color: #00ff5c;";
        ConsoleMessageStyles.Error = "background: #000000; color: #ff0000;";
        ConsoleMessageStyles.Debug = "background: #5b86ff; color: #000000;";
        ConsoleMessageStyles.INFO = "background: #5b86ff; color: #000000;";
        ConsoleMessageStyles.EXTERNAL = "background: #5b86ff; color: #000000;";
        return ConsoleMessageStyles;
    }());
    panda.ConsoleMessageStyles = ConsoleMessageStyles;
})(panda || (panda = {}));
var panda;
(function (panda) {
    var FlogsSenderPrivate;
    (function (FlogsSenderPrivate) {
        var FlogsSender = /** @class */ (function () {
            function FlogsSender(project, flogs2Project) {
                var _this = this;
                if (project === void 0) { project = null; }
                if (flogs2Project === void 0) { flogs2Project = null; }
                this._logChuncks = new Array();
                this._sendSheduled = false;
                this._errorMessage = null;
                this._counter = 0;
                this.project = null;
                this.flogs2Project = null;
                this.handler_log = function (level, message, args) {
                    var marker = level === panda.ConsoleMessageLevels.WARN || level === panda.ConsoleMessageLevels.ERROR;
                    _this._currenctChunk.add(marker, panda.DateUtils.now() - _this._startTimestamp, level, message, args);
                    var fullMessage = [message].concat(args).join(' ');
                    if (marker && !_this._sendSheduled && _this._counter < 10) {
                        panda.Console.logDebug('send scheduled');
                        setTimeout(_this.handler_send); // это не nextFrameCall, но и не мгновенная отправка, чтобы текущий стек доделался
                        _this._sendSheduled = true;
                        _this._errorMessage = fullMessage;
                        _this._counter++;
                    }
                };
                this.handler_chunkFull = function () {
                    _this._currenctChunk.onFull.removeListener(_this.handler_chunkFull);
                    _this.createChunk();
                };
                this.handler_send = function () {
                    var info = panda.PlatformDescriber.getInfo();
                    _this.sendTo('flogs.crazypanda.ru', _this.project || info.project + '_JS');
                    if (_this.flogs2Project) {
                        _this.sendTo('flogs2.crazypanda.ru', _this.flogs2Project);
                    }
                    panda.Console.logDebug('sent');
                    _this._sendSheduled = false;
                    _this._errorMessage = null;
                };
                this.project = project;
                this.flogs2Project = flogs2Project;
                this.createChunk();
                this._currenctChunk.add(true, 0, panda.ConsoleMessageLevels.INFO, panda.PlatformDescriber.getInfo().toString(), []);
                this._startTimestamp = panda.DateUtils.now();
            }
            FlogsSender.prototype.createChunk = function () {
                this._currenctChunk = new Chunk();
                this._currenctChunk.onFull.addListener(this.handler_chunkFull);
                this._logChuncks.push(this._currenctChunk);
            };
            FlogsSender.prototype.sendTo = function (url, projectName) {
                var uri = new panda.Url({
                    hostname: url,
                    pathname: 'addlog',
                    query: { 'rand': Math.random() }
                });
                var data = new panda.URLVariables();
                var info = panda.PlatformDescriber.getInfo();
                data.data['project'] = projectName;
                data.data['user_id'] = info.userId;
                data.data['client_id'] = info.browserInfo.browser + ' ' + info.browserInfo.version;
                data.data['username'] = info.username;
                data.data['type'] = this._errorMessage;
                data.data['log'] = this.getStringified();
                var dataString = data.toString();
                var req = new panda.URLRequest(uri, 'POST');
                req.data = dataString;
                req.requestHeaders = new Array();
                req.requestHeaders.push(new panda.URLRequestHeader('Content-Type', 'application/x-www-form-urlencoded'));
                var loader = new panda.URLLoader(req);
                loader.load();
            };
            FlogsSender.prototype.getStringified = function () {
                return this._logChuncks.join('...\nskipped\n...\n');
            };
            return FlogsSender;
        }());
        FlogsSenderPrivate.FlogsSender = FlogsSender;
        var Chunk = /** @class */ (function () {
            function Chunk(contextSize) {
                if (contextSize === void 0) { contextSize = 50; }
                this.onFull = new panda.Signal();
                this._items = new panda.List('FlogsSenderChunk');
                this._lastMarkerIndex = 0;
                this._contextSize = contextSize;
            }
            Chunk.prototype.add = function (marker, time, level, message, args) {
                var stringified = time + ' ' + level + ', ' + message;
                if (args.length) {
                    stringified += ', ' + args.join(', ');
                }
                stringified += '\n';
                var items = this._items;
                items.insert(stringified);
                if (marker) {
                    this._lastMarkerIndex = items.getLength();
                }
                if (this._lastMarkerIndex === 0) {
                    if (items.getLength() - this._lastMarkerIndex > this._contextSize) {
                        items.remove(items.getHead());
                    }
                }
                else {
                    if (items.getLength() - this._lastMarkerIndex >= this._contextSize) {
                        this.onFull.emit();
                    }
                }
            };
            Chunk.prototype.toString = function () {
                var stringified = '';
                var iterator = this._items.getHead();
                while (!iterator.getEnded()) {
                    stringified += iterator.getValue();
                    iterator.next();
                }
                return stringified;
            };
            return Chunk;
        }());
        FlogsSenderPrivate.Chunk = Chunk;
    })(FlogsSenderPrivate = panda.FlogsSenderPrivate || (panda.FlogsSenderPrivate = {}));
    panda.FlogsSender = FlogsSenderPrivate.FlogsSender;
})(panda || (panda = {}));
///ts:ref=Browser
/// <reference path="../browser/Browser.ts"/> ///ts:ref:generated
var panda;
(function (panda) {
    var PlatformDescriber = /** @class */ (function () {
        function PlatformDescriber() {
            panda.Console.here;
            try {
                this.runGuid = panda.Guid.generate();
                this.buildNumber = BuildInfo.buildNumber;
                this.buildDate = parseInt(BuildInfo.buildDate);
                this.locationHref = window.location.href;
                this.browserInfo = panda.Browser.getInfo();
                this.project = 'UnknownProject';
                this.userId = 'UnknownUsertId';
                this.sns = 'UnknownSns';
                this.username = 'UnknownUserName';
                this.webGLInfo = panda.WebGLDescriber.getInfo();
            }
            catch (e) {
                panda.Console.errorUncritical(e);
            }
        }
        PlatformDescriber.getInfo = function () {
            //d381fdbe-4f45-4314-b3a7-0751809f14b1
            if (!this._info) {
                this._info = new PlatformDescriber();
            }
            return this._info;
        };
        PlatformDescriber.prototype.getScreenWidth = function () {
            if (panda.BrowserSpecific.scrrenSizeSupported()) {
                return window.screen.width;
            }
            else {
                return 0;
            }
        };
        PlatformDescriber.prototype.getScreenHeight = function () {
            if (panda.BrowserSpecific.scrrenSizeSupported()) {
                return window.screen.height;
            }
            else {
                return 0;
            }
        };
        PlatformDescriber.prototype.getScreenAvailableWidth = function () {
            return window.innerWidth;
            //return document.documentElement.clientWidth;
        };
        PlatformDescriber.prototype.getScreenAvailableHeight = function () {
            return window.innerHeight;
            //return document.documentElement.clientHeight;
        };
        PlatformDescriber.prototype.toString = function () {
            return JSON.stringify(this, function (key, value) { if (key !== '_productHash' && key !== 'comments' && key !== 'products') {
                return value;
            } }, 4);
        };
        return PlatformDescriber;
    }());
    panda.PlatformDescriber = PlatformDescriber;
})(panda || (panda = {}));
var panda;
(function (panda) {
    var URLRequest = /** @class */ (function () {
        function URLRequest(url, method, data, requestHeaders) {
            if (method === void 0) { method = URLLoadingMethod.GET; }
            if (data === void 0) { data = null; }
            if (requestHeaders === void 0) { requestHeaders = null; }
            this.responseType = '';
            this.url = url;
            this.method = method;
            this.data = data;
            this.requestHeaders = requestHeaders;
        }
        return URLRequest;
    }());
    panda.URLRequest = URLRequest;
    var URLLoadingMethod;
    (function (URLLoadingMethod) {
        URLLoadingMethod.GET = 'GET';
        URLLoadingMethod.POST = 'POST';
    })(URLLoadingMethod = panda.URLLoadingMethod || (panda.URLLoadingMethod = {}));
    var URLRequestHeader = /** @class */ (function () {
        function URLRequestHeader(name, value) {
            this.name = name;
            this.value = value;
        }
        return URLRequestHeader;
    }());
    panda.URLRequestHeader = URLRequestHeader;
    var URLLoader = /** @class */ (function () {
        function URLLoader(request, activityTimeout) {
            var _this = this;
            if (request === void 0) { request = null; }
            if (activityTimeout === void 0) { activityTimeout = 3000000; }
            this.activityTimeout = 0;
            this.activityTimeoutHandle = 0;
            this.onHTTPStatus = new panda.Signal();
            this.onProgress = new panda.Signal();
            this.onComplete = new panda.Signal();
            this.onError = new panda.Signal();
            this.handler_error = function () {
                panda.Console.logWarn('URLLoader_handler_error');
                _this.complete(true);
            };
            this.handler_activityTimeout = function () {
                panda.Console.logWarn('URLLoader_handler_error activity_timeout');
                _this.complete(true);
            };
            this.handler_progress = function (event) {
                // нет никаких гарантий что event.loaded отображает реальный размер.
                // Например при transfer-encoding: chunked длину предсказать не возможно,
                // при этом во всех браузерах указана event.total. и в конце загрузки она может не совпадать с responce.length
                // в Firefox в этом случае размер зипнутых байтов, в хроме анзипнутых.
                if (event.lengthComputable) {
                    _this._progress = event.loaded / event.total;
                }
                _this.updateActivityTimeout();
                _this.onProgress.emit(_this, _this._progress);
                //PandaConsole.logInfo('event.lengthComputable', event.lengthComputable);
            };
            this.handler_readyStateChange = function () {
                // это метод должен быть максимально лёгким, его будут вызывать много раз
                var xhttp = _this._xhttp;
                var readyState = xhttp.readyState;
                if (readyState === 2) {
                    _this._HTTPStatus = xhttp.status;
                    _this.updateActivityTimeout();
                    _this.onHTTPStatus.emit(_this, _this._HTTPStatus);
                }
                else if (readyState === 4) {
                    _this.updateActivityTimeout();
                    _this.complete(false);
                }
            };
            this.assignRequest(request);
            this.resetProps();
            this.activityTimeout = activityTimeout;
        }
        URLLoader.prototype.getHTTPStatus = function () {
            return this._HTTPStatus;
        };
        URLLoader.prototype.getResponce = function () {
            return this._responce;
        };
        URLLoader.prototype.getCompleted = function () {
            return this._completed;
        };
        URLLoader.prototype.getLoading = function () {
            return this._loading;
        };
        /**
            Прогресс загрузки от 0 до 1. При диспатчинге onComplete всегда строго равен 1
        */
        URLLoader.prototype.getProgress = function () {
            return this._progress;
        };
        URLLoader.prototype.getError = function () {
            return this._error;
        };
        URLLoader.prototype.resetProps = function () {
            if (this._loading) {
                throw new URLLoaderError('Calling resetProps while loading');
            }
            this._progress = 0;
            this._HTTPStatus = 0;
            this._responce = null;
            this._completed = false;
            this._loading = false;
            this._error = false;
            this.clearActivityTimeout();
        };
        URLLoader.prototype.updateActivityTimeout = function () {
            if (!this.activityTimeout) {
                return;
            }
            this.clearActivityTimeout();
            this.activityTimeoutHandle = setTimeout(this.handler_activityTimeout, this.activityTimeout);
        };
        URLLoader.prototype.clearActivityTimeout = function () {
            if (this.activityTimeoutHandle) {
                clearTimeout(this.activityTimeoutHandle);
                this.activityTimeoutHandle = 0;
            }
        };
        URLLoader.prototype.load = function (req) {
            if (req === void 0) { req = null; }
            if (this._loading) {
                throw new URLLoaderError('Calling load while loading');
            }
            this.resetProps();
            this.assignRequest(req);
            var request = this.request;
            if (!request) {
                throw new URLLoaderError('No request while load called');
            }
            //PandaConsole.logDebug('URLLoader::load', request.url.href());
            var xhttp = this.createXhttp();
            this._xhttp = xhttp;
            this._loading = true;
            xhttp.open(request.method, request.url.format(), true);
            xhttp.responseType = request.responseType;
            this.addXhttpListeners(xhttp);
            if (this.requestHeadersSupported() && request.requestHeaders) {
                for (var _i = 0, _a = request.requestHeaders; _i < _a.length; _i++) {
                    var header = _a[_i];
                    xhttp.setRequestHeader(header.name, header.value);
                }
            }
            xhttp.send(request.data);
            this.updateActivityTimeout();
        };
        URLLoader.prototype.destroy = function () {
            throw new panda.NotImplementedError('URLLoader::destroy');
        };
        URLLoader.prototype.requestHeadersSupported = function () {
            return !panda.BrowserSpecific.XDomainRequestNeeded();
        };
        URLLoader.prototype.createXhttp = function () {
            if (panda.BrowserSpecific.XDomainRequestNeeded()) {
                return new XDomainRequest();
            }
            else {
                return new XMLHttpRequest();
            }
        };
        URLLoader.prototype.complete = function (error) {
            this._error = error;
            if (this._HTTPStatus !== 200) {
                this._error = true;
                panda.Console.logWarn('URLLoader::complete wrong status', this._HTTPStatus, this.request.url.format());
            }
            //PandaConsole.logDebug('URLLoader::complete', this.request.url.href());
            var xhttp = this._xhttp;
            this.removeXhttpListeners(xhttp);
            this._progress = 1;
            this._responce = xhttp.response;
            this._completed = true;
            this._loading = false;
            this.clearActivityTimeout();
            this.onComplete.emit(this, this._responce, this._error);
        };
        URLLoader.prototype.addXhttpListeners = function (xhttp) {
            xhttp.onprogress = this.handler_progress;
            xhttp.onreadystatechange = this.handler_readyStateChange;
            xhttp.onerror = this.handler_error;
        };
        URLLoader.prototype.removeXhttpListeners = function (xhttp) {
            xhttp.onprogress = null;
            xhttp.onreadystatechange = null;
            xhttp.onerror = null;
        };
        URLLoader.prototype.assignRequest = function (request) {
            if (request === void 0) { request = null; }
            var newRequest = null;
            if (request instanceof URLRequest) {
                newRequest = request;
            }
            else if (request === null) {
                newRequest = this.request;
            }
            else {
                throw new URLLoaderError('Wrong URLRequest parameter');
            }
            this.request = newRequest;
        };
        return URLLoader;
    }());
    panda.URLLoader = URLLoader;
    var URLVariables = /** @class */ (function () {
        function URLVariables(data) {
            if (data === void 0) { data = {}; }
            this.data = data;
        }
        URLVariables.prototype.toString = function () {
            var arr = new Array();
            for (var key in this.data) {
                arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(this.data[key]));
            }
            return arr.join('&').replace(/%20/g, '+');
        };
        return URLVariables;
    }());
    panda.URLVariables = URLVariables;
    var URLLoaderError = /** @class */ (function (_super) {
        __extends(URLLoaderError, _super);
        function URLLoaderError() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return URLLoaderError;
    }(panda.AdvancedError));
    panda.URLLoaderError = URLLoaderError;
})(panda || (panda = {}));
var panda;
(function (panda) {
    var settings;
    (function (settings) {
        /**
         * new panda.url.Url(string not null) always returns absolute path
         * @type {boolean}
         */
        settings.URL_USE_ROOT = false;
    })(settings = panda.settings || (panda.settings = {}));
})(panda || (panda = {}));
(function (panda) {
    var url;
    (function (url_1) {
        var util;
        (function (util) {
            function isString(obj) {
                return typeof obj === 'string';
            }
            util.isString = isString;
            function isObject(arg) {
                return typeof (arg) === 'object' && arg !== null;
            }
            util.isObject = isObject;
            function isUrl(arg) {
                return arg instanceof panda.url.Url;
            }
            util.isUrl = isUrl;
        })(util || (util = {}));
        var Url = /** @class */ (function () {
            /**
             * This is special gobi constructor on top of Node API
             * @param path
             */
            function Url(path) {
                this.protocol = null;
                this.slashes = null;
                this.auth = null;
                this.host = null;
                this.port = null;
                this.hostname = null;
                this.hash = null;
                this.search = null;
                this.query = null;
                this.pathname = null;
                this.path = null;
                this.href = null;
                if (!path)
                    return;
                if (typeof path !== 'string') {
                    this.copyFrom(path);
                    return;
                }
                if (path == '') {
                    if (panda.settings.URL_USE_ROOT) {
                        this.copyFrom(url_1.root);
                    }
                    else {
                        this.copyFrom(url_1.page);
                    }
                    return;
                }
                var copyUrl = parse(path, false, true);
                if (!copyUrl.protocol && !copyUrl.hostname) {
                    if (panda.settings.URL_USE_ROOT) {
                        url_1.root.resolveObject(copyUrl, this);
                    }
                    else {
                        url_1.page.resolveObject(copyUrl, this);
                    }
                }
                else {
                    this.copyFrom(copyUrl);
                }
            }
            Url.prototype.copyFrom = function (url) {
                var anyUrl = url;
                var anyThis = this;
                var keys = Object.keys(anyUrl);
                for (var v = 0; v < keys.length; v++) {
                    var k = keys[v];
                    anyThis[k] = anyUrl[k];
                }
                return this;
            };
            Url.prototype.parse = function (url, parseQueryString, slashesDenoteHost) {
                if (!util.isString(url)) {
                    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
                }
                // Copy chrome, IE, opera backslash-handling behavior.
                // Back slashes before the query string get converted to forward slashes
                // See: https://code.google.com/p/chromium/issues/detail?id=25916
                var queryIndex = url.indexOf('?'), splitter = (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#', uSplit = url.split(splitter), slashRegex = /\\/g;
                uSplit[0] = uSplit[0].replace(slashRegex, '/');
                url = uSplit.join(splitter);
                var rest = url;
                // trim before proceeding.
                // This is to support parse stuff like "  http://foo.com  \n"
                rest = rest.trim();
                if (!slashesDenoteHost && url.split('#').length === 1) {
                    // Try fast path regexp
                    var simplePath = simplePathPattern.exec(rest);
                    if (simplePath) {
                        this.path = rest;
                        this.href = rest;
                        this.pathname = simplePath[1];
                        if (simplePath[2]) {
                            this.search = simplePath[2];
                            if (parseQueryString) {
                                this.query = url_1.querystring.decode(this.search.substr(1));
                            }
                            else {
                                this.query = this.search.substr(1);
                            }
                        }
                        else if (parseQueryString) {
                            this.search = '';
                            this.query = {};
                        }
                        return this;
                    }
                }
                var protoArr = protocolPattern.exec(rest);
                var proto = null;
                var lowerProto = null;
                if (protoArr) {
                    proto = protoArr[0];
                    lowerProto = proto.toLowerCase();
                    this.protocol = lowerProto;
                    rest = rest.substr(proto.length);
                }
                var slashes = false;
                // figure out if it's got a host
                // user@server is *always* interpreted as a hostname, and url
                // resolution will treat //foo/bar as host=foo,path=bar because that's
                // how the browser resolves relative URLs.
                if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
                    slashes = rest.substr(0, 2) === '//';
                    if (slashes && !(proto && hostlessProtocol[proto])) {
                        rest = rest.substr(2);
                        this.slashes = true;
                    }
                }
                if (!hostlessProtocol[proto] &&
                    (slashes || (proto && !slashedProtocol[proto]))) {
                    // there's a hostname.
                    // the first instance of /, ?, ;, or # ends the host.
                    //
                    // If there is an @ in the hostname, then non-host chars *are* allowed
                    // to the left of the last @ sign, unless some host-ending character
                    // comes *before* the @-sign.
                    // URLs are obnoxious.
                    //
                    // ex:
                    // http://a@b@c/ => user:a@b host:c
                    // http://a@b?@c => user:a host:c path:/?@c
                    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
                    // Review our test case against browsers more comprehensively.
                    // find the first instance of any hostEndingChars
                    var hostEnd = -1;
                    for (var i = 0; i < hostEndingChars.length; i++) {
                        var hec = rest.indexOf(hostEndingChars[i]);
                        if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
                            hostEnd = hec;
                    }
                    // at this point, either we have an explicit point where the
                    // auth portion cannot go past, or the last @ char is the decider.
                    var auth = void 0, atSign = void 0;
                    if (hostEnd === -1) {
                        // atSign can be anywhere.
                        atSign = rest.lastIndexOf('@');
                    }
                    else {
                        // atSign must be in auth portion.
                        // http://a@b/c@d => host:b auth:a path:/c@d
                        atSign = rest.lastIndexOf('@', hostEnd);
                    }
                    // Now we have a portion which is definitely the auth.
                    // Pull that off.
                    if (atSign !== -1) {
                        auth = rest.slice(0, atSign);
                        rest = rest.slice(atSign + 1);
                        this.auth = decodeURIComponent(auth);
                    }
                    // the host is the remaining to the left of the first non-host char
                    hostEnd = -1;
                    for (var i = 0; i < nonHostChars.length; i++) {
                        var hec = rest.indexOf(nonHostChars[i]);
                        if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
                            hostEnd = hec;
                    }
                    // if we still have not hit it, then the entire thing is a host.
                    if (hostEnd === -1)
                        hostEnd = rest.length;
                    this.host = rest.slice(0, hostEnd);
                    rest = rest.slice(hostEnd);
                    // pull out port.
                    this.parseHost();
                    // we've indicated that there is a hostname,
                    // so even if it's empty, it has to be present.
                    this.hostname = this.hostname || '';
                    // if hostname begins with [ and ends with ]
                    // assume that it's an IPv6 address.
                    var ipv6Hostname = this.hostname[0] === '[' &&
                        this.hostname[this.hostname.length - 1] === ']';
                    // validate a little.
                    if (!ipv6Hostname) {
                        var hostparts = this.hostname.split(/\./);
                        for (var i = 0, l = hostparts.length; i < l; i++) {
                            var part = hostparts[i];
                            if (!part)
                                continue;
                            if (!part.match(hostnamePartPattern)) {
                                var newpart = '';
                                for (var j = 0, k = part.length; j < k; j++) {
                                    if (part.charCodeAt(j) > 127) {
                                        // we replace non-ASCII char with a temporary placeholder
                                        // we need this to make sure size of hostname is not
                                        // broken by replacing non-ASCII by nothing
                                        newpart += 'x';
                                    }
                                    else {
                                        newpart += part[j];
                                    }
                                }
                                // we test again with ASCII char only
                                if (!newpart.match(hostnamePartPattern)) {
                                    var validParts = hostparts.slice(0, i);
                                    var notHost = hostparts.slice(i + 1);
                                    var bit = part.match(hostnamePartStart);
                                    if (bit) {
                                        validParts.push(bit[1]);
                                        notHost.unshift(bit[2]);
                                    }
                                    if (notHost.length) {
                                        rest = '/' + notHost.join('.') + rest;
                                    }
                                    this.hostname = validParts.join('.');
                                    break;
                                }
                            }
                        }
                    }
                    if (this.hostname.length > hostnameMaxLen) {
                        this.hostname = '';
                    }
                    else {
                        // hostnames are always lower case.
                        this.hostname = this.hostname.toLowerCase();
                    }
                    if (!ipv6Hostname) {
                        // IDNA Support: Returns a punycoded representation of "domain".
                        // It only converts parts of the domain name that
                        // have non-ASCII characters, i.e. it doesn't matter if
                        // you call it with a domain that already is ASCII-only.
                        this.hostname = panda.url.punycode.toASCII(this.hostname);
                    }
                    var p_1 = this.port ? ':' + this.port : '';
                    var h = this.hostname || '';
                    this.host = h + p_1;
                    this.href += this.host;
                    // strip [ and ] from the hostname
                    // the host field still retains them, though
                    if (ipv6Hostname) {
                        this.hostname = this.hostname.substr(1, this.hostname.length - 2);
                        if (rest[0] !== '/') {
                            rest = '/' + rest;
                        }
                    }
                }
                // now rest is set to the post-host stuff.
                // chop off any delim chars.
                if (!unsafeProtocol[lowerProto]) {
                    // First, make 100% sure that any "autoEscape" chars get
                    // escaped, even if encodeURIComponent doesn't think they
                    // need to be.
                    for (var i = 0, l = autoEscape.length; i < l; i++) {
                        var ae = autoEscape[i];
                        if (rest.indexOf(ae) === -1)
                            continue;
                        var esc = encodeURIComponent(ae);
                        if (esc === ae) {
                            // Hackerham: there's no "escape" in JS
                            esc = '%' + ae.charCodeAt(0).toString(16).toUpperCase();
                        }
                        rest = rest.split(ae).join(esc);
                    }
                }
                // chop off from the tail first.
                var hash = rest.indexOf('#');
                if (hash !== -1) {
                    // got a fragment string.
                    this.hash = rest.substr(hash);
                    rest = rest.slice(0, hash);
                }
                var qm = rest.indexOf('?');
                if (qm !== -1) {
                    this.search = rest.substr(qm);
                    this.query = rest.substr(qm + 1);
                    if (parseQueryString) {
                        this.query = url_1.querystring.decode(this.query);
                    }
                    rest = rest.slice(0, qm);
                }
                else if (parseQueryString) {
                    // no query string, but parseQueryString still requested
                    this.search = '';
                    this.query = {};
                }
                if (rest)
                    this.pathname = rest;
                if (slashedProtocol[lowerProto] &&
                    this.hostname && !this.pathname) {
                    this.pathname = '/';
                }
                //to support http.request
                if (this.pathname || this.search) {
                    var p = this.pathname || '';
                    var s = this.search || '';
                    this.path = p + s;
                }
                // finally, reconstruct the href based on what has been validated.
                this.href = this.format();
                return this;
            };
            Url.prototype.toString = function () {
                return this.format();
            };
            Url.prototype.format = function () {
                var auth = this.auth || '';
                if (auth) {
                    auth = encodeURIComponent(auth);
                    auth = auth.replace(/%3A/i, ':');
                    auth += '@';
                }
                var protocol = this.protocol || '', pathname = this.pathname || '', hash = this.hash || '', host = null, query = '';
                if (this.host) {
                    host = auth + this.host;
                }
                else if (this.hostname) {
                    host = auth + (this.hostname.indexOf(':') === -1 ?
                        this.hostname :
                        '[' + this.hostname + ']');
                    if (this.port) {
                        host += ':' + this.port;
                    }
                }
                if (this.query &&
                    util.isObject(this.query) &&
                    Object.keys(this.query).length) {
                    query = url_1.querystring.encode(this.query);
                }
                var search = this.search || (query && ('?' + query)) || '';
                if (protocol && protocol.substr(-1) !== ':')
                    protocol += ':';
                // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
                // unless they had them to begin with.
                if (this.slashes ||
                    (!protocol || slashedProtocol[protocol]) && host !== null) {
                    host = '//' + (host || '');
                    if (pathname && pathname.charAt(0) !== '/')
                        pathname = '/' + pathname;
                }
                else if (!host) {
                    host = '';
                }
                if (hash && hash.charAt(0) !== '#')
                    hash = '#' + hash;
                if (search && search.charAt(0) !== '?')
                    search = '?' + search;
                pathname = pathname.replace(/[?#]/g, function (match) {
                    return encodeURIComponent(match);
                });
                search = search.replace('#', '%23');
                return protocol + host + pathname + search + hash;
            };
            Url.prototype.resolveObject = function (relative, result) {
                if (util.isString(relative)) {
                    var rel = new Url();
                    rel.parse(relative, false, true);
                    relative = rel;
                }
                if (!util.isUrl(relative)) {
                    return null;
                }
                result = result || new Url();
                var anyResult = result;
                var anyThis = this;
                var anyRelative = relative;
                var tkeys = Object.keys(this);
                for (var tk = 0; tk < tkeys.length; tk++) {
                    var tkey = tkeys[tk];
                    anyResult[tkey] = anyThis[tkey];
                }
                // hash is always overridden, no matter what.
                // even href="" will remove it.
                result.hash = relative.hash;
                // if the relative url is empty, then there's nothing left to do here.
                if (relative.href === '') {
                    result.href = result.format();
                    return result;
                }
                // hrefs like //foo/bar always cut to the protocol.
                if (relative.slashes && !relative.protocol) {
                    // take everything except the protocol from relative
                    var rkeys = Object.keys(relative);
                    for (var rk = 0; rk < rkeys.length; rk++) {
                        var rkey = rkeys[rk];
                        if (rkey !== 'protocol')
                            anyResult[rkey] = anyRelative[rkey];
                    }
                    //urlParse appends trailing / to urls like http://www.example.com
                    if (slashedProtocol[result.protocol] &&
                        result.hostname && !result.pathname) {
                        result.path = result.pathname = '/';
                    }
                    result.href = result.format();
                    return result;
                }
                if (relative.protocol && relative.protocol !== result.protocol) {
                    // if it's a known url protocol, then changing
                    // the protocol does weird things
                    // first, if it's not file:, then we MUST have a host,
                    // and if there was a path
                    // to begin with, then we MUST have a path.
                    // if it is file:, then the host is dropped,
                    // because that's known to be hostless.
                    // anything else is assumed to be absolute.
                    if (!slashedProtocol[relative.protocol]) {
                        var keys = Object.keys(relative);
                        for (var v = 0; v < keys.length; v++) {
                            var k = keys[v];
                            anyResult[k] = anyRelative[k];
                        }
                        result.href = result.format();
                        return result;
                    }
                    result.protocol = relative.protocol;
                    if (!relative.host && !hostlessProtocol[relative.protocol]) {
                        var relPath_1 = (relative.pathname || '').split('/');
                        while (relPath_1.length && !(relative.host = relPath_1.shift()))
                            ;
                        if (!relative.host)
                            relative.host = '';
                        if (!relative.hostname)
                            relative.hostname = '';
                        if (relPath_1[0] !== '')
                            relPath_1.unshift('');
                        if (relPath_1.length < 2)
                            relPath_1.unshift('');
                        result.pathname = relPath_1.join('/');
                    }
                    else {
                        result.pathname = relative.pathname;
                    }
                    result.search = relative.search;
                    result.query = relative.query;
                    result.host = relative.host || '';
                    result.auth = relative.auth;
                    result.hostname = relative.hostname || relative.host;
                    result.port = relative.port;
                    // to support http.request
                    if (result.pathname || result.search) {
                        var p = result.pathname || '';
                        var s = result.search || '';
                        result.path = p + s;
                    }
                    result.slashes = result.slashes || relative.slashes;
                    result.href = result.format();
                    return result;
                }
                var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/') && true, isRelAbs = (relative.host ||
                    relative.pathname && relative.pathname.charAt(0) === '/') && true, mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)) && true, removeAllDots = mustEndAbs, srcPath = result.pathname && result.pathname.split('/') || [], relPath = relative.pathname && relative.pathname.split('/') || [], psychotic = result.protocol && !slashedProtocol[result.protocol];
                // if the url is a non-slashed url, then relative
                // links like ../.. should be able
                // to crawl up to the hostname, as well.  This is strange.
                // result.protocol has already been set by now.
                // Later on, put the first path part into the host field.
                if (psychotic) {
                    result.hostname = '';
                    result.port = null;
                    if (result.host) {
                        if (srcPath[0] === '')
                            srcPath[0] = result.host;
                        else
                            srcPath.unshift(result.host);
                    }
                    result.host = '';
                    if (relative.protocol) {
                        relative.hostname = null;
                        relative.port = null;
                        if (relative.host) {
                            if (relPath[0] === '')
                                relPath[0] = relative.host;
                            else
                                relPath.unshift(relative.host);
                        }
                        relative.host = null;
                    }
                    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
                }
                if (isRelAbs) {
                    // it's absolute.
                    result.host = (relative.host || relative.host === '') ?
                        relative.host : result.host;
                    result.hostname = (relative.hostname || relative.hostname === '') ?
                        relative.hostname : result.hostname;
                    result.search = relative.search;
                    result.query = relative.query;
                    srcPath = relPath;
                    // fall through to the dot-handling below.
                }
                else if (relPath.length) {
                    // it's relative
                    // throw away the existing file, and take the new path instead.
                    if (!srcPath)
                        srcPath = [];
                    srcPath.pop();
                    srcPath = srcPath.concat(relPath);
                    result.search = relative.search;
                    result.query = relative.query;
                }
                else if (relative.search !== null && relative.search !== undefined) {
                    // just pull out the search.
                    // like href='?foo'.
                    // Put this after the other two cases because it simplifies the booleans
                    if (psychotic) {
                        result.hostname = result.host = srcPath.shift();
                        //occationaly the auth can get stuck only in host
                        //this especially happens in cases like
                        //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
                        var authInHost = result.host && result.host.indexOf('@') > 0 ?
                            result.host.split('@') : false;
                        if (authInHost) {
                            result.auth = authInHost.shift();
                            result.host = result.hostname = authInHost.shift();
                        }
                    }
                    result.search = relative.search;
                    result.query = relative.query;
                    //to support http.request
                    if (result.pathname !== null || result.search !== null) {
                        result.path = (result.pathname ? result.pathname : '') +
                            (result.search ? result.search : '');
                    }
                    result.href = result.format();
                    return result;
                }
                if (!srcPath.length) {
                    // no path at all.  easy.
                    // we've already handled the other stuff above.
                    result.pathname = null;
                    //to support http.request
                    if (result.search) {
                        result.path = '/' + result.search;
                    }
                    else {
                        result.path = null;
                    }
                    result.href = result.format();
                    return result;
                }
                // if a url ENDs in . or .., then it must get a trailing slash.
                // however, if it ends in anything else non-slashy,
                // then it must NOT get a trailing slash.
                var last = srcPath.slice(-1)[0];
                var hasTrailingSlash = ((result.host || relative.host || srcPath.length > 1) &&
                    (last === '.' || last === '..') || last === '');
                // strip single dots, resolve double dots to parent dir
                // if the path tries to go above the root, `up` ends up > 0
                var up = 0;
                for (var i = srcPath.length; i >= 0; i--) {
                    last = srcPath[i];
                    if (last === '.') {
                        srcPath.splice(i, 1);
                    }
                    else if (last === '..') {
                        srcPath.splice(i, 1);
                        up++;
                    }
                    else if (up) {
                        srcPath.splice(i, 1);
                        up--;
                    }
                }
                // if the path is allowed to go above the root, restore leading ..s
                if (!mustEndAbs && !removeAllDots) {
                    for (; up--; up) {
                        srcPath.unshift('..');
                    }
                }
                if (mustEndAbs && srcPath[0] !== '' &&
                    (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
                    srcPath.unshift('');
                }
                if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
                    srcPath.push('');
                }
                var isAbsolute = srcPath[0] === '' ||
                    (srcPath[0] && srcPath[0].charAt(0) === '/');
                // put the host back
                if (psychotic) {
                    result.hostname = result.host = isAbsolute ? '' :
                        srcPath.length ? srcPath.shift() : '';
                    //occationaly the auth can get stuck only in host
                    //this especially happens in cases like
                    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
                    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                        result.host.split('@') : false;
                    if (authInHost) {
                        result.auth = authInHost.shift();
                        result.host = result.hostname = authInHost.shift();
                    }
                }
                mustEndAbs = mustEndAbs || (result.host && srcPath.length > 0);
                if (mustEndAbs && !isAbsolute) {
                    srcPath.unshift('');
                }
                if (!srcPath.length) {
                    result.pathname = null;
                    result.path = null;
                }
                else {
                    result.pathname = srcPath.join('/');
                }
                //to support request.http
                if (result.pathname !== null || result.search !== null) {
                    result.path = (result.pathname ? result.pathname : '') +
                        (result.search ? result.search : '');
                }
                result.auth = relative.auth || result.auth;
                result.slashes = result.slashes || relative.slashes;
                result.href = result.format();
                return result;
            };
            Url.prototype.resolve = function (relative) {
                return this.resolveObject(parse(relative, false, true)).format();
            };
            Url.prototype.parseHost = function () {
                var host = this.host;
                var ports = portPattern.exec(host);
                var port = null;
                if (ports) {
                    port = ports[0];
                    if (port !== ':') {
                        this.port = port.substr(1);
                    }
                    host = host.substr(0, host.length - port.length);
                }
                if (host)
                    this.hostname = host;
            };
            return Url;
        }());
        url_1.Url = Url;
        // Reference: RFC 3986, RFC 1808, RFC 2396
        // define these here so at least they only have to be
        // compiled once on the first module load.
        var protocolPattern = /^([a-z0-9.+-]+:)/i, portPattern = /:[0-9]*$/, 
        // Special case for a simple path URL
        simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, 
        // RFC 2396: characters reserved for delimiting URLs.
        // We actually just auto-escape these.
        delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'], 
        // RFC 2396: characters not allowed for various reasons.
        unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims), 
        // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
        autoEscape = ['\''].concat(unwise), 
        // Characters that are never ever allowed in a hostname.
        // Note that any invalid chars are also handled, but these
        // are the ones that are *expected* to be seen, so we fast-path
        // them.
        nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape), hostEndingChars = ['/', '?', '#'], hostnameMaxLen = 255, hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/, hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, 
        // protocols that can allow "unsafe" and "unwise" chars.
        unsafeProtocol = {
            'javascript': true,
            'javascript:': true
        }, 
        // protocols that never have a hostname.
        hostlessProtocol = {
            'javascript': true,
            'javascript:': true
        }, 
        // protocols that always contain a // bit.
        slashedProtocol = {
            'http': true,
            'https': true,
            'ftp': true,
            'gopher': true,
            'file': true,
            'http:': true,
            'https:': true,
            'ftp:': true,
            'gopher:': true,
            'file:': true
        };
        function parse(url, parseQueryString, slashesDenoteHost) {
            if (url && util.isObject(url) && url instanceof Url)
                return url;
            var u = new Url();
            u.parse(url, parseQueryString, slashesDenoteHost);
            return u;
        }
        url_1.parse = parse;
        function format(obj) {
            // ensure it's an object, and not a string url.
            // If it's an obj, this is a no-op.
            // this way, you can call url_format() on strings
            // to clean up potentially wonky urls.
            if (util.isString(obj))
                obj = parse(obj);
            if (!(obj instanceof Url))
                return Url.prototype.format.call(obj);
            return obj.format();
        }
        url_1.format = format;
        function resolve(source, relative) {
            return parse(source, false, true).resolve(relative);
        }
        url_1.resolve = resolve;
        function resolveObject(source, relative) {
            if (!source)
                return relative;
            return parse(source, false, true).resolveObject(relative);
        }
        url_1.resolveObject = resolveObject;
        url_1.page = new Url();
        if (typeof window !== 'undefined') {
            url_1.page.protocol = window.location.protocol;
            url_1.page.hostname = window.location.hostname;
            url_1.page.pathname = window.location.pathname;
        }
        url_1.root = new Url();
        if (typeof window !== 'undefined') {
            url_1.root.protocol = window.location.protocol;
            url_1.root.hostname = window.location.hostname;
            url_1.root.pathname = '/';
        }
    })(url = panda.url || (panda.url = {}));
})(panda || (panda = {}));
// port of https://github.com/bestiejs/punycode.js/
var panda;
(function (panda) {
    var url;
    (function (url) {
        var punycode;
        (function (punycode) {
            var /** Highest positive signed 32-bit float value */ maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1
            /** Bootstring parameters */
            base = 36, tMin = 1, tMax = 26, skew = 38, damp = 700, initialBias = 72, initialN = 128, // 0x80
            delimiter = '-', // '\x2D'
            /** Regular expressions */
            regexPunycode = /^xn--/, regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
            regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators
            /** Error messages */
            errors = {
                'overflow': 'Overflow: input needs wider integers to process',
                'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
                'invalid-input': 'Invalid input'
            }, 
            /** Convenience shortcuts */
            baseMinusTMin = base - tMin, floor = Math.floor, stringFromCharCode = String.fromCharCode, 
            /** Temporary variable */
            key;
            /*--------------------------------------------------------------------------*/
            /**
             * A generic error utility function.
             * @private
             * @param {String} type The error type.
             * @returns {Error} Throws a `RangeError` with the applicable error message.
             */
            function error(type) {
                throw RangeError(errors[type]);
            }
            /**
             * A generic `Array#map` utility function.
             * @private
             * @param {Array} array The array to iterate over.
             * @param {Function} callback The function that gets called for every array
             * item.
             * @returns {Array} A new array of values returned by the callback function.
             */
            function map(array, callback) {
                var length = array.length;
                var result = [];
                while (length--) {
                    result[length] = callback(array[length]);
                }
                return result;
            }
            /**
             * A simple `Array#map`-like wrapper to work with domain name strings or email
             * addresses.
             * @private
             * @param {String} domain The domain name or email address.
             * @param {Function} callback The function that gets called for every
             * character.
             * @returns {Array} A new string of characters returned by the callback
             * function.
             */
            function mapDomain(domain, callback) {
                var parts = domain.split('@');
                var result = '';
                if (parts.length > 1) {
                    // In email addresses, only the domain name should be punycoded. Leave
                    // the local part (i.e. everything up to `@`) intact.
                    result = parts[0] + '@';
                    domain = parts[1];
                }
                // Avoid `split(regex)` for IE8 compatibility. See #17.
                domain = domain.replace(regexSeparators, '\x2E');
                var labels = domain.split('.');
                var encoded = map(labels, callback).join('.');
                return result + encoded;
            }
            /**
             * Creates an array containing the numeric code points of each Unicode
             * character in the string. While JavaScript uses UCS-2 internally,
             * this function will convert a pair of surrogate halves (each of which
             * UCS-2 exposes as separate characters) into a single code point,
             * matching UTF-16.
             * @see `punycode.ucs2.encode`
             * @see <https://mathiasbynens.be/notes/javascript-encoding>
             * @memberOf punycode.ucs2
             * @name decode
             * @param {String} str The Unicode input string (UCS-2).
             * @returns {Array} The new array of code points.
             */
            function ucs2decode(str) {
                var output = [], counter = 0, length = str.length, value, extra;
                while (counter < length) {
                    value = str.charCodeAt(counter++);
                    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
                        // high surrogate, and there is a next character
                        extra = str.charCodeAt(counter++);
                        if ((extra & 0xFC00) == 0xDC00) { // low surrogate
                            output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
                        }
                        else {
                            // unmatched surrogate; only append this code unit, in case the next
                            // code unit is the high surrogate of a surrogate pair
                            output.push(value);
                            counter--;
                        }
                    }
                    else {
                        output.push(value);
                    }
                }
                return output;
            }
            /**
             * Creates a string based on an array of numeric code points.
             * @see `punycode.ucs2.decode`
             * @memberOf punycode.ucs2
             * @name encode
             * @param {Array} codePoints The array of numeric code points.
             * @returns {String} The new Unicode string (UCS-2).
             */
            function ucs2encode(codePoints) {
                return map(codePoints, function (value) {
                    var output = '';
                    if (value > 0xFFFF) {
                        value -= 0x10000;
                        output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
                        value = 0xDC00 | value & 0x3FF;
                    }
                    output += stringFromCharCode(value);
                    return output;
                }).join('');
            }
            /**
             * Converts a basic code point into a digit/integer.
             * @see `digitToBasic()`
             * @private
             * @param {number} codePoint The basic numeric code point value.
             * @returns {number} The numeric value of a basic code point (for use in
             * representing integers) in the range `0` to `base - 1`, or `base` if
             * the code point does not represent a value.
             */
            function basicToDigit(codePoint) {
                if (codePoint - 48 < 10) {
                    return codePoint - 22;
                }
                if (codePoint - 65 < 26) {
                    return codePoint - 65;
                }
                if (codePoint - 97 < 26) {
                    return codePoint - 97;
                }
                return base;
            }
            /**
             * Converts a digit/integer into a basic code point.
             * @see `basicToDigit()`
             * @private
             * @param {number} digit The numeric value of a basic code point.
             * @param {number} flag The flag.
             * @returns {number} The basic code point whose value (when used for
             * representing integers) is `digit`, which needs to be in the range
             * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
             * used; else, the lowercase form is used. The behavior is undefined
             * if `flag` is non-zero and `digit` has no uppercase form.
             */
            function digitToBasic(digit, flag) {
                //  0..25 map to ASCII a..z or A..Z
                // 26..35 map to ASCII 0..9
                return digit + 22 + 75 * (digit < 26 ? 1 : 0) - ((flag != 0 ? 1 : 0) << 5);
            }
            /**
             * Bias adaptation function as per section 3.4 of RFC 3492.
             * http://tools.ietf.org/html/rfc3492#section-3.4
             * @private
             */
            function adapt(delta, numPoints, firstTime) {
                var k = 0;
                delta = firstTime ? floor(delta / damp) : delta >> 1;
                delta += floor(delta / numPoints);
                for ( /* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
                    delta = floor(delta / baseMinusTMin);
                }
                return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
            }
            /**
             * Converts a Punycode string of ASCII-only symbols to a string of Unicode
             * symbols.
             * @memberOf punycode
             * @param {String} input The Punycode string of ASCII-only symbols.
             * @returns {String} The resulting string of Unicode symbols.
             */
            function decode(input) {
                // Don't use UCS-2
                var output = [], inputLength = input.length, out, i = 0, n = initialN, bias = initialBias, basic, j, index, oldi, w, k, digit, t, 
                /** Cached calculation results */
                baseMinusT;
                // Handle the basic code points: let `basic` be the number of input code
                // points before the last delimiter, or `0` if there is none, then copy
                // the first basic code points to the output.
                basic = input.lastIndexOf(delimiter);
                if (basic < 0) {
                    basic = 0;
                }
                for (j = 0; j < basic; ++j) {
                    // if it's not a basic code point
                    if (input.charCodeAt(j) >= 0x80) {
                        error('not-basic');
                    }
                    output.push(input.charCodeAt(j));
                }
                // Main decoding loop: start just after the last delimiter if any basic code
                // points were copied; start at the beginning otherwise.
                for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {
                    // `index` is the index of the next character to be consumed.
                    // Decode a generalized variable-length integer into `delta`,
                    // which gets added to `i`. The overflow checking is easier
                    // if we increase `i` as we go, then subtract off its starting
                    // value at the end to obtain `delta`.
                    for (oldi = i, w = 1, k = base; /* no condition */; k += base) {
                        if (index >= inputLength) {
                            error('invalid-input');
                        }
                        digit = basicToDigit(input.charCodeAt(index++));
                        if (digit >= base || digit > floor((maxInt - i) / w)) {
                            error('overflow');
                        }
                        i += digit * w;
                        t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
                        if (digit < t) {
                            break;
                        }
                        baseMinusT = base - t;
                        if (w > floor(maxInt / baseMinusT)) {
                            error('overflow');
                        }
                        w *= baseMinusT;
                    }
                    out = output.length + 1;
                    bias = adapt(i - oldi, out, oldi == 0);
                    // `i` was supposed to wrap around from `out` to `0`,
                    // incrementing `n` each time, so we'll fix that now:
                    if (floor(i / out) > maxInt - n) {
                        error('overflow');
                    }
                    n += floor(i / out);
                    i %= out;
                    // Insert `n` at position `i` of the output
                    output.splice(i++, 0, n);
                }
                return ucs2encode(output);
            }
            punycode.decode = decode;
            /**
             * Converts a string of Unicode symbols (e.g. a domain name label) to a
             * Punycode string of ASCII-only symbols.
             * @memberOf punycode
             * @param {String} inputStr The string of Unicode symbols.
             * @returns {String} The resulting Punycode string of ASCII-only symbols.
             */
            function encode(inputStr) {
                var n, delta, handledCPCount, basicLength, bias, j, m, q, k, t, currentValue, output = [], 
                /** `inputLength` will hold the number of code points in `input`. */
                inputLength, 
                /** Cached calculation results */
                handledCPCountPlusOne, baseMinusT, qMinusT;
                // Convert the input in UCS-2 to Unicode
                var input = ucs2decode(inputStr);
                // Cache the length
                inputLength = input.length;
                // Initialize the state
                n = initialN;
                delta = 0;
                bias = initialBias;
                // Handle the basic code points
                for (j = 0; j < inputLength; ++j) {
                    currentValue = input[j];
                    if (currentValue < 0x80) {
                        output.push(stringFromCharCode(currentValue));
                    }
                }
                handledCPCount = basicLength = output.length;
                // `handledCPCount` is the number of code points that have been handled;
                // `basicLength` is the number of basic code points.
                // Finish the basic string - if it is not empty - with a delimiter
                if (basicLength) {
                    output.push(delimiter);
                }
                // Main encoding loop:
                while (handledCPCount < inputLength) {
                    // All non-basic code points < n have been handled already. Find the next
                    // larger one:
                    for (m = maxInt, j = 0; j < inputLength; ++j) {
                        currentValue = input[j];
                        if (currentValue >= n && currentValue < m) {
                            m = currentValue;
                        }
                    }
                    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
                    // but guard against overflow
                    handledCPCountPlusOne = handledCPCount + 1;
                    if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
                        error('overflow');
                    }
                    delta += (m - n) * handledCPCountPlusOne;
                    n = m;
                    for (j = 0; j < inputLength; ++j) {
                        currentValue = input[j];
                        if (currentValue < n && ++delta > maxInt) {
                            error('overflow');
                        }
                        if (currentValue == n) {
                            // Represent delta as a generalized variable-length integer
                            for (q = delta, k = base; /* no condition */; k += base) {
                                t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
                                if (q < t) {
                                    break;
                                }
                                qMinusT = q - t;
                                baseMinusT = base - t;
                                output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
                                q = floor(qMinusT / baseMinusT);
                            }
                            output.push(stringFromCharCode(digitToBasic(q, 0)));
                            bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
                            delta = 0;
                            ++handledCPCount;
                        }
                    }
                    ++delta;
                    ++n;
                }
                return output.join('');
            }
            punycode.encode = encode;
            /**
             * Converts a Punycode string representing a domain name or an email address
             * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
             * it doesn't matter if you call it on a string that has already been
             * converted to Unicode.
             * @memberOf punycode
             * @param {String} input The Punycoded domain name or email address to
             * convert to Unicode.
             * @returns {String} The Unicode representation of the given Punycode
             * string.
             */
            function toUnicode(input) {
                return mapDomain(input, function (str) {
                    return regexPunycode.test(str)
                        ? decode(str.slice(4).toLowerCase())
                        : str;
                });
            }
            punycode.toUnicode = toUnicode;
            /**
             * Converts a Unicode string representing a domain name or an email address to
             * Punycode. Only the non-ASCII parts of the domain name will be converted,
             * i.e. it doesn't matter if you call it with a domain that's already in
             * ASCII.
             * @memberOf punycode
             * @param {String} input The domain name or email address to convert, as a
             * Unicode string.
             * @returns {String} The Punycode representation of the given domain name or
             * email address.
             */
            function toASCII(input) {
                return mapDomain(input, function (str) {
                    return regexNonASCII.test(str)
                        ? 'xn--' + encode(str)
                        : str;
                });
            }
            punycode.toASCII = toASCII;
            /**
             * A string representing the current Punycode.js version number.
             * @memberOf punycode
             * @type String
             */
            punycode.version = '1.3.2';
            /**
             * An object of methods to convert from JavaScript's internal character
             * representation (UCS-2) to Unicode code points, and back.
             * @see <https://mathiasbynens.be/notes/javascript-encoding>
             * @memberOf punycode
             * @type Object
             */
            var ucs2;
            (function (ucs2) {
                ucs2.encode = ucs2encode;
                ucs2.decode = ucs2decode;
            })(ucs2 = punycode.ucs2 || (punycode.ucs2 = {}));
        })(punycode = url.punycode || (url.punycode = {}));
    })(url = panda.url || (panda.url = {}));
})(panda || (panda = {}));
var panda;
(function (panda) {
    var url;
    (function (url) {
        var querystring;
        (function (querystring) {
            function stringifyPrimitive(v) {
                switch (typeof v) {
                    case 'string':
                        return v;
                    case 'boolean':
                        return v ? 'true' : 'false';
                    case 'number':
                        return isFinite(v) ? v : '';
                    default:
                        return '';
                }
            }
            function encode(obj, sep, eq, name) {
                sep = sep || '&';
                eq = eq || '=';
                if (obj === null) {
                    obj = undefined;
                }
                if (typeof obj === 'object') {
                    return Object.keys(obj).map(function (k) {
                        var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
                        if (Array.isArray(obj[k])) {
                            return obj[k].map(function (v) {
                                return ks + encodeURIComponent(stringifyPrimitive(v));
                            }).join(sep);
                        }
                        else {
                            return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
                        }
                    }).join(sep);
                }
                if (!name)
                    return '';
                return encodeURIComponent(stringifyPrimitive(name)) + eq +
                    encodeURIComponent(stringifyPrimitive(obj));
            }
            querystring.encode = encode;
            function decode(qs, sep, eq, options) {
                sep = sep || '&';
                eq = eq || '=';
                var obj = {};
                if (typeof qs !== 'string' || qs.length === 0) {
                    return obj;
                }
                var regexp = /\+/g;
                var qs_ = qs.split(sep);
                var maxKeys = 1000;
                if (options && typeof options.maxKeys === 'number') {
                    maxKeys = options.maxKeys;
                }
                var len = qs_.length;
                // maxKeys <= 0 means that we should not limit keys count
                if (maxKeys > 0 && len > maxKeys) {
                    len = maxKeys;
                }
                for (var i = 0; i < len; ++i) {
                    var x = qs_[i].replace(regexp, '%20'), idx = x.indexOf(eq), kstr = void 0, vstr = void 0, k = void 0, v = void 0;
                    if (idx >= 0) {
                        kstr = x.substr(0, idx);
                        vstr = x.substr(idx + 1);
                    }
                    else {
                        kstr = x;
                        vstr = '';
                    }
                    k = decodeURIComponent(kstr);
                    v = decodeURIComponent(vstr);
                    if (!obj.hasOwnProperty(k)) {
                        obj[k] = v;
                    }
                    else if (Array.isArray(obj[k])) {
                        obj[k].push(v);
                    }
                    else {
                        obj[k] = [obj[k], v];
                    }
                }
                return obj;
            }
            querystring.decode = decode;
        })(querystring = url.querystring || (url.querystring = {}));
    })(url = panda.url || (panda.url = {}));
})(panda || (panda = {}));
var panda;
(function (panda) {
    var Signal = /** @class */ (function () {
        function Signal(name) {
            if (name === void 0) { name = 'Signal'; }
            this._listeners = null;
            this.uniqId = panda.UniqIdGenerator.getUniq();
            this._name = name;
            this.emit = Signal.EMIT;
            this.dispatch = Signal.EMIT;
        }
        Signal.prototype.createListenersList = function () {
            this._listeners = new panda.List(this._name);
        };
        Signal.prototype.addListener = function (listener, priority) {
            if (priority === void 0) { priority = 0; }
            if (!this._listeners) {
                this.createListenersList();
            }
            if (this.hasListener(listener)) {
                return listener;
            }
            this._listeners.insert(listener, priority);
            return listener;
        };
        Signal.prototype.hasListener = function (listener) {
            if (!this._listeners) {
                return false;
            }
            return this._listeners.has(listener);
        };
        Signal.prototype.addListenerOnce = function (listener, priority) {
            var _this = this;
            if (priority === void 0) { priority = 0; }
            var fakeListener = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                listener.apply(null, args);
                _this.removeListener(fakeListener);
            };
            this.addListener(fakeListener, priority);
            return fakeListener;
        };
        Signal.prototype.removeListener = function (listener) {
            if (!this._listeners) {
                return;
            }
            var node = this._listeners.search(listener);
            if (!node) {
                return;
            }
            this._listeners.remove(node);
        };
        Signal.prototype.emitOnIter = function (iter, args) {
            var wasError = true;
            try {
                while (!iter.getEnded()) {
                    iter.getValue().apply(null, args);
                    iter.next();
                }
                wasError = false;
            }
            finally {
                if (wasError) {
                    iter.next();
                    this.emitOnIter(iter, args);
                }
            }
        };
        Signal.prototype.clear = function () {
            this._listeners = null;
        };
        Signal.EMIT = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!this._listeners) {
                return;
            }
            var iter = this._listeners.getHead();
            this.emitOnIter(iter, args);
            this._listeners.$returnIteratorToPool(iter);
        };
        ;
        Signal.prototype.add = function (listener, priority) {
            return this.addListener(listener, priority);
        };
        Signal.prototype.addOnce = function (listener, priority) {
            if (priority === void 0) { priority = 0; }
            return this.addListenerOnce(listener, priority);
        };
        return Signal;
    }());
    panda.Signal = Signal;
})(panda || (panda = {}));
///ts:ref=Console
/// <reference path="../console/Console.ts"/> ///ts:ref:generated
var panda;
(function (panda) {
    var StatEvent = /** @class */ (function () {
        function StatEvent(projectName, siteName, eventType) {
            if (eventType === void 0) { eventType = null; }
            this._unqs = {};
            this._uniqNameRegexp = /[A-Z]/;
            this.addUniq('project', projectName, StatDataType.noType);
            this.addUniq('site', siteName, StatDataType.noType);
            if (eventType !== null) {
                this.setType(eventType);
            }
            this.addUniq('v', 2, StatDataType.noType);
        }
        StatEvent.prototype.setType = function (eventType) {
            this.addUniq('type', eventType, StatDataType.noType);
        };
        StatEvent.prototype.addUniq = function (uniqName, value, type) {
            panda.Console.here;
            this.checkUniqName(uniqName);
            if (!StatDataType.isTypeValid(type)) {
                panda.Console.errorUncritical(new panda.AdvancedError('PandaStat type is wrong ' + uniqName));
            }
            if (this.hasUniq(uniqName)) {
                panda.Console.errorUncritical(new panda.AdvancedError('PandaStat uniq name duplicate ' + uniqName));
            }
            this._unqs[uniqName] = new StatUniq(uniqName, value, type);
        };
        StatEvent.prototype.hasUniq = function (uniqName) {
            return !!this._unqs[uniqName];
        };
        StatEvent.prototype.$getData = function () {
            var obj = {};
            for (var key in this._unqs) {
                var uniq = this._unqs[key];
                if (uniq.type === StatDataType.noType) {
                    obj[uniq.uniqName] = uniq.value;
                }
                else {
                    obj[uniq.uniqName + '/' + uniq.type] = uniq.value;
                }
            }
            return obj;
        };
        StatEvent.prototype.checkUniqName = function (uniqName) {
            var valid = true;
            panda.Console.here;
            if (uniqName.match(this._uniqNameRegexp)) {
                panda.Console.errorUncritical(new panda.AdvancedError('PandaStat uniqName contains UPPERCASE symbols ' + uniqName));
                valid = false;
            }
            if (uniqName.indexOf('/') >= 0) {
                panda.Console.errorUncritical(new panda.AdvancedError('PandaStat uniq name contains "/" ' + uniqName));
                valid = false;
            }
            return valid;
        };
        return StatEvent;
    }());
    panda.StatEvent = StatEvent;
    var StatUniq = /** @class */ (function () {
        function StatUniq(uniqName, value, type) {
            this.uniqName = uniqName;
            this.value = value;
            this.type = type;
        }
        return StatUniq;
    }());
    panda.StatUniq = StatUniq;
    var StatDataType = /** @class */ (function () {
        function StatDataType() {
        }
        StatDataType.isTypeValid = function (typeName) {
            if (!StatDataType._typeCache) {
                var cache = {};
                for (var key in StatDataType) {
                    cache[StatDataType[key]] = true;
                }
                this._typeCache = cache;
            }
            return !!this._typeCache[typeName];
        };
        StatDataType.noType = 'noType';
        StatDataType.string = 's';
        StatDataType.money = 'm';
        StatDataType.date = 'date';
        StatDataType.projDict8 = 'pd8';
        StatDataType.projDict16 = 'pd16';
        StatDataType.projDict32 = 'pd32';
        StatDataType.typeDict8 = 'td8';
        StatDataType.typeDict16 = 'td16';
        StatDataType.typeDict32 = 'td32';
        StatDataType.sideDict8 = 'sd8';
        StatDataType.sideDict16 = 'sd16';
        StatDataType.sideDict32 = 'sd32';
        StatDataType.typeGroupDict8 = 'gd8';
        StatDataType.typeGroupDict16 = 'gd16';
        StatDataType.typeGroupDict32 = 'gd32';
        StatDataType.i8 = 'i8';
        StatDataType.i16 = 'i16';
        StatDataType.i32 = 'i32';
        StatDataType.i64 = 'i64';
        StatDataType.ui8 = 'ui8';
        StatDataType.ui16 = 'ui16';
        StatDataType.ui32 = 'ui32';
        StatDataType.ui64 = 'ui64';
        return StatDataType;
    }());
    panda.StatDataType = StatDataType;
})(panda || (panda = {}));
///ts:ref=StatEvent
/// <reference path="./StatEvent.ts"/> ///ts:ref:generated
var panda;
(function (panda) {
    var PlatformDescribingStatEvent = /** @class */ (function (_super) {
        __extends(PlatformDescribingStatEvent, _super);
        function PlatformDescribingStatEvent(projectName, siteName, eventType) {
            if (eventType === void 0) { eventType = null; }
            var _this = _super.call(this, projectName, siteName, eventType) || this;
            var info = panda.PlatformDescriber.getInfo();
            _this.addUniq('uid', info.userId, panda.StatDataType.noType);
            _this.addUniq('build', info.buildNumber, panda.StatDataType.i32);
            _this.addUniq('run_guid', info.runGuid, panda.StatDataType.string);
            _this.addUniq('build_date', Math.floor(info.buildDate / 1000).toString(), panda.StatDataType.string);
            //this.addUniq('location_href', info.locationHref, StatDataType.projDict8); на vk например палит кучу ненужной штуки
            _this.addUniq('user_agent', info.browserInfo.userAgent, panda.StatDataType.projDict32);
            _this.addUniq('browser', info.browserInfo.browser, panda.StatDataType.projDict32);
            _this.addUniq('browser_version', info.browserInfo.version, panda.StatDataType.projDict32);
            _this.addUniq('browser_version_number', info.browserInfo.versionNumber, panda.StatDataType.money);
            _this.addUniq('parent_browser', info.browserInfo.parentBrowser, panda.StatDataType.projDict32);
            _this.addUniq('parent_browser_version', info.browserInfo.parentVersion, panda.StatDataType.projDict32);
            _this.addUniq('parent_browser_version_number', info.browserInfo.parentVersionNumber, panda.StatDataType.money);
            _this.addUniq('os_type', info.browserInfo.osType, panda.StatDataType.projDict16);
            _this.addUniq('os_name', info.browserInfo.osName, panda.StatDataType.projDict16);
            _this.addUniq('os_version', info.browserInfo.osVersion, panda.StatDataType.projDict16);
            _this.addUniq('os_version_number', info.browserInfo.osVersionNumber, panda.StatDataType.money);
            _this.addUniq('archtecture', info.browserInfo.archtecture, panda.StatDataType.projDict16);
            _this.addUniq('parsed_corretly', '' + info.browserInfo.parsedCorretly, panda.StatDataType.projDict8);
            _this.addUniq('fatal_parsing_error', '' + info.browserInfo.fatalParsingError, panda.StatDataType.projDict8);
            _this.addUniq('mobile_experimental', '' + info.browserInfo.mobileExperimental, panda.StatDataType.projDict8);
            var glInfo = info.webGLInfo;
            _this.addUniq('video_card', glInfo.videoCard, panda.StatDataType.projDict32);
            _this.addUniq('webgl_oficially_supported', '' + glInfo.officiallySupported, panda.StatDataType.projDict8);
            _this.addUniq('webgl_supported', '' + glInfo.supported, panda.StatDataType.projDict8);
            _this.addUniq('version', glInfo.version, panda.StatDataType.projDict16);
            _this.addUniq('shading_vesion', glInfo.shadingVesion, panda.StatDataType.projDict16);
            return _this;
        }
        return PlatformDescribingStatEvent;
    }(panda.StatEvent));
    panda.PlatformDescribingStatEvent = PlatformDescribingStatEvent;
})(panda || (panda = {}));
var panda;
(function (panda) {
    var Stat = /** @class */ (function () {
        function Stat(url, collectTimeout) {
            var _this = this;
            this._queue = new Array();
            this._timeout = NaN;
            this._loader = new panda.URLLoader();
            this.onSended = new panda.Signal();
            this.handler_collectTimeOutEnded = function () {
                //PandaConsole.logDebug('PandaStat::collectTimeOutEnded', 'timeout', this._timeout);
                _this._timeout = NaN;
                if (_this._loader.getLoading()) {
                    //PandaConsole.logDebug('PandaStat::collectTimeOutEnded', 'this._loader.loading');
                    _this._loader.onComplete.addListener(_this.sendToServer);
                }
                else {
                    //PandaConsole.logDebug('PandaStat::collectTimeOutEnded', 'sendToServer');
                    _this.sendToServer();
                }
            };
            this.sendToServer = function () {
                panda.Console.logDebug('PandaStat::sendToServer');
                _this._loader.onComplete.removeListener(_this.sendToServer);
                var data = _this.stringifyEvents();
                //PandaConsole.logInfo(JSON.stringify(this._queue.map(e=>e.$getData()), null, 4));
                _this._queue.length = 0;
                var req = new panda.URLRequest(_this._url, 'POST', data);
                _this._loader.load(req);
            };
            this._url = url;
            this._collectTimeout = collectTimeout;
            this._loader.onComplete.addListener(function (loader, responce, wasError) {
                _this.onSended.emit(wasError);
            });
        }
        Stat.prototype.send = function (event) {
            if (BuildInfo.online !== 'true') {
                return;
            }
            panda.Console.here;
            if (!event.hasUniq('type')) {
                panda.Console.errorUncritical(new panda.AdvancedError('event has no type'));
            }
            if (!event.hasUniq('project')) {
                panda.Console.errorUncritical(new panda.AdvancedError('event has no project, type: ' + event.$getData()['type']));
            }
            if (!event.hasUniq('site')) {
                panda.Console.errorUncritical(new panda.AdvancedError('event has no site, type: ' + event.$getData()['type']));
            }
            //PandaConsole.logDebug('PandaStat::send', 'event.type', event.$getData()['type']);
            this._queue.push(event);
            this.scheduleSend();
        };
        Stat.prototype.scheduleSend = function () {
            //PandaConsole.logDebug('PandaStat::scheduleSend', 'timeout', this._timeout);
            if (isNaN(this._timeout)) {
                this._timeout = setTimeout(this.handler_collectTimeOutEnded, this._collectTimeout);
            }
        };
        Stat.prototype.stringifyEvents = function () {
            return JSON.stringify(this._queue.map(function (e) { return e.$getData(); }));
        };
        Stat.intance = null;
        return Stat;
    }());
    panda.Stat = Stat;
})(panda || (panda = {}));
///ts:ref=Console
/// <reference path="../console/Console.ts"/> ///ts:ref:generated
var panda;
(function (panda) {
    var WebGLUtils;
    (function (WebGLUtils) {
        function getGLContext(canvas, attributes) {
            if (attributes === void 0) { attributes = null; }
            panda.Console.here;
            if (!canvas) {
                return null;
            }
            try {
                if (!canvas.getContext) {
                    panda.Console.logDebug('WebGLUtils::getGLContext: getContext is not supported');
                    return null;
                }
                var context = canvas.getContext("webgl", attributes) || canvas.getContext("experimental-webgl", attributes);
                return context;
            }
            catch (e) {
                panda.Console.errorUncritical(e);
            }
            return null;
        }
        WebGLUtils.getGLContext = getGLContext;
        var dummyCanvas = null;
        function getDummyCanvas() {
            if (dummyCanvas == null) {
                dummyCanvas = document.createElement('canvas');
            }
            return dummyCanvas;
        }
        WebGLUtils.getDummyCanvas = getDummyCanvas;
        var dummyContext = null;
        function getDummyContext() {
            if (dummyContext == null) {
                dummyContext = getGLContext(getDummyCanvas());
            }
            return dummyContext;
        }
        WebGLUtils.getDummyContext = getDummyContext;
        function getExtension(context, name) {
            panda.Console.here;
            if (!context) {
                return null;
            }
            try {
                var extension = context.getExtension(name);
                if (extension) {
                    return extension;
                }
                else {
                    for (var _i = 0, browserPrefixes_1 = browserPrefixes; _i < browserPrefixes_1.length; _i++) {
                        var prefix = browserPrefixes_1[_i];
                        extension = context.getExtension(prefix + name);
                        if (extension) {
                            return extension;
                        }
                    }
                }
            }
            catch (e) {
                panda.Console.errorUncritical(e);
            }
            return null;
        }
        WebGLUtils.getExtension = getExtension;
        var browserPrefixes = ['MOZ_', 'WEBKIT_'];
        var extensions;
        (function (extensions) {
            extensions.ANGLE_instanced_arrays = 'ANGLE_instanced_arrays';
            extensions.OES_texture_float = 'OES_texture_float';
            extensions.OES_texture_float_linear = 'OES_texture_float_linear';
            extensions.EXT_texture_filter_anisotropic = 'EXT_texture_filter_anisotropic';
            extensions.OES_standard_derivatives = 'OES_standard_derivatives';
            extensions.OES_element_index_uint = 'OES_element_index_uint';
        })(extensions = WebGLUtils.extensions || (WebGLUtils.extensions = {}));
        var optionalExtensions;
        (function (optionalExtensions) {
            optionalExtensions.WEBGL_debug_renderer_info = 'WEBGL_debug_renderer_info';
            optionalExtensions.WEBGL_compressed_texture_s3tc = 'WEBGL_compressed_texture_s3tc';
            optionalExtensions.WEBGL_compressed_texture_pvrtc = 'WEBGL_compressed_texture_pvrtc';
            optionalExtensions.WEBGL_lose_context = 'WEBGL_lose_context';
            optionalExtensions.EXT_frag_depth = 'EXT_frag_depth';
            optionalExtensions.WEBGL_depth_texture = 'WEBGL_depth_texture';
            optionalExtensions.OES_vertex_array_object = 'OES_vertex_array_object';
        })(optionalExtensions = WebGLUtils.optionalExtensions || (WebGLUtils.optionalExtensions = {}));
    })(WebGLUtils = panda.WebGLUtils || (panda.WebGLUtils = {}));
})(panda || (panda = {}));
///ts:ref=PlatformDescriber
/// <reference path="../console/PlatformDescriber.ts"/> ///ts:ref:generated
///ts:ref=PlatformDescribingStatEvent
/// <reference path="./PlatformDescribingStatEvent.ts"/> ///ts:ref:generated
///ts:ref=WebGLUtils
/// <reference path="../webgl/WebGLUtils.ts"/> ///ts:ref:generated
var panda;
(function (panda) {
    var WebGlDescribingStatEvent = /** @class */ (function (_super) {
        __extends(WebGlDescribingStatEvent, _super);
        function WebGlDescribingStatEvent(projectName, siteName, eventType) {
            if (eventType === void 0) { eventType = null; }
            var _this = _super.call(this, projectName, siteName, eventType) || this;
            var glInfo = panda.PlatformDescriber.getInfo().webGLInfo;
            _this.addUniq('max_vertex_attributes', glInfo.maxVertexAttributes, panda.StatDataType.i32);
            _this.addUniq('max_vertex_uniform_vectors', glInfo.maxVertexUniformVectors, panda.StatDataType.i32);
            _this.addUniq('max_vertex_texture_image_units', glInfo.maxVertexTextureImageUnits, panda.StatDataType.i32);
            _this.addUniq('max_varying_vectors', glInfo.maxVaryingVectors, panda.StatDataType.i32);
            _this.addUniq('aliased_line_width_range_0', glInfo.aliasedLineWidthRange[0], panda.StatDataType.i32);
            _this.addUniq('aliased_line_width_range_1', glInfo.aliasedLineWidthRange[1], panda.StatDataType.i32);
            _this.addUniq('aliased_point_size_range_0', glInfo.aliasedPointSizeRange[0], panda.StatDataType.i32);
            _this.addUniq('aliased_point_size_range_1', glInfo.aliasedPointSizeRange[1], panda.StatDataType.i32);
            _this.addUniq('max_fragment_uniform_vectors', glInfo.maxFragmentUniformVectors, panda.StatDataType.i32);
            _this.addUniq('max_texture_image_units', glInfo.maxTextureImageUnits, panda.StatDataType.i32);
            _this.addUniq('red_bits', glInfo.redBits, panda.StatDataType.i8);
            _this.addUniq('green_bits', glInfo.greenBits, panda.StatDataType.i8);
            _this.addUniq('blue_bits', glInfo.blueBits, panda.StatDataType.i8);
            _this.addUniq('alpha_bits', glInfo.alphaBits, panda.StatDataType.i8);
            _this.addUniq('depth_bits', glInfo.depthBits, panda.StatDataType.i8);
            _this.addUniq('stencil_bits', glInfo.stencilBits, panda.StatDataType.i8);
            _this.addUniq('max_renderbuffer_size', glInfo.maxRenderbufferSize, panda.StatDataType.i32);
            _this.addUniq('max_viewport_dims_0', glInfo.maxViewportDims[0], panda.StatDataType.i32);
            _this.addUniq('max_viewport_dims_1', glInfo.maxViewportDims[1], panda.StatDataType.i32);
            _this.addUniq('max_texture_size', glInfo.maxTextureSize, panda.StatDataType.i32);
            _this.addUniq('max_cube_map_texture_size', glInfo.maxCubeMapTextureSize, panda.StatDataType.i32);
            _this.addUniq('max_combined_texture_image_units', glInfo.maxCombinedTextureImageUnits, panda.StatDataType.i32);
            _this.addUniq('major_performance_caveat', glInfo.majorPerformanceCaveat, panda.StatDataType.projDict8);
            var context = panda.WebGLUtils.getDummyContext();
            _this.addUniq('angle_instanced_arrays', panda.WebGLUtils.getExtension(context, panda.WebGLUtils.extensions.ANGLE_instanced_arrays) ? 'true' : 'false', panda.StatDataType.projDict8);
            _this.addUniq('oes_texture_float', panda.WebGLUtils.getExtension(context, panda.WebGLUtils.extensions.OES_texture_float) ? 'true' : 'false', panda.StatDataType.projDict8);
            _this.addUniq('oes_texture_float_linear', panda.WebGLUtils.getExtension(context, panda.WebGLUtils.extensions.OES_texture_float_linear) ? 'true' : 'false', panda.StatDataType.projDict8);
            _this.addUniq('ext_texture_filter_anisotropic', panda.WebGLUtils.getExtension(context, panda.WebGLUtils.extensions.EXT_texture_filter_anisotropic) ? 'true' : 'false', panda.StatDataType.projDict8);
            _this.addUniq('oes_standard_derivatives', panda.WebGLUtils.getExtension(context, panda.WebGLUtils.extensions.OES_standard_derivatives) ? 'true' : 'false', panda.StatDataType.projDict8);
            _this.addUniq('oes_element_index_uint', panda.WebGLUtils.getExtension(context, panda.WebGLUtils.extensions.OES_element_index_uint) ? 'true' : 'false', panda.StatDataType.projDict8);
            _this.addUniq('webgl_debug_renderer_info', panda.WebGLUtils.getExtension(context, panda.WebGLUtils.optionalExtensions.WEBGL_debug_renderer_info) ? 'true' : 'false', panda.StatDataType.projDict8);
            _this.addUniq('webgl_compressed_texture_s3tc', panda.WebGLUtils.getExtension(context, panda.WebGLUtils.optionalExtensions.WEBGL_compressed_texture_s3tc) ? 'true' : 'false', panda.StatDataType.projDict8);
            _this.addUniq('webgl_compressed_texture_pvrtc', panda.WebGLUtils.getExtension(context, panda.WebGLUtils.optionalExtensions.WEBGL_compressed_texture_pvrtc) ? 'true' : 'false', panda.StatDataType.projDict8);
            _this.addUniq('webgl_lose_context', panda.WebGLUtils.getExtension(context, panda.WebGLUtils.optionalExtensions.WEBGL_lose_context) ? 'true' : 'false', panda.StatDataType.projDict8);
            _this.addUniq('webgl_depth_texture', panda.WebGLUtils.getExtension(context, panda.WebGLUtils.optionalExtensions.WEBGL_depth_texture) ? 'true' : 'false', panda.StatDataType.projDict8);
            _this.addUniq('ext_frag_depth', panda.WebGLUtils.getExtension(context, panda.WebGLUtils.optionalExtensions.EXT_frag_depth) ? 'true' : 'false', panda.StatDataType.projDict8);
            return _this;
        }
        return WebGlDescribingStatEvent;
    }(panda.PlatformDescribingStatEvent));
    panda.WebGlDescribingStatEvent = WebGlDescribingStatEvent;
})(panda || (panda = {}));
var panda;
(function (panda) {
    var ArrayUtils;
    (function (ArrayUtils) {
        /**
        * shuffles specified array. Modifies argument
        * knuth-shuffle
        * http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
        *
        */
        function shuffle(array, randomFunc) {
            if (randomFunc === void 0) { randomFunc = Math.random; }
            var currentIndex = array.length;
            var temporaryValue;
            var randomIndex;
            while (0 !== currentIndex) {
                randomIndex = Math.floor(randomFunc() * currentIndex);
                currentIndex -= 1;
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
        }
        ArrayUtils.shuffle = shuffle;
        function shuffleCopy(src, randomFunc) {
            if (randomFunc === void 0) { randomFunc = Math.random; }
            var res = src.concat();
            var currentIndex = res.length;
            var temporaryValue;
            var randomIndex;
            while (0 !== currentIndex) {
                randomIndex = Math.floor(randomFunc() * currentIndex);
                currentIndex -= 1;
                temporaryValue = res[currentIndex];
                res[currentIndex] = res[randomIndex];
                res[randomIndex] = temporaryValue;
            }
            return res;
        }
        ArrayUtils.shuffleCopy = shuffleCopy;
        function equalContent(a1, a2, comparator, checkDense) {
            if (comparator === void 0) { comparator = equalFuncDefault; }
            if (checkDense === void 0) { checkDense = true; }
            if (a1 === a2) {
                return true;
            }
            if (a1.length != a2.length) {
                return false;
            }
            var l = a1.length;
            for (var i = 0; i < l; i++) {
                if (checkDense && !(i in a1) || !(i in a2)) {
                    throw new panda.AdvancedError("arrays must be dense");
                }
                if (!comparator(a1[i], a2[i])) {
                    return false;
                }
            }
            return true;
        }
        ArrayUtils.equalContent = equalContent;
        function equalContentUnordered(a1, a2, comparator) {
            if (comparator === void 0) { comparator = equalFuncDefault; }
            if (a1 === a2) {
                return true;
            }
            if (a1.length != a2.length) {
                return false;
            }
            var len = a1.length;
            var checked = new Array(len);
            for (var i = 0; i < len; i++) {
                var v1 = a1[i];
                var found = false;
                for (var j = 0; j < len; j++) {
                    if (checked[j])
                        continue;
                    var v2 = a2[j];
                    if (comparator(v1, v2)) {
                        checked[j] = true;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    return false;
                }
            }
            return true;
        }
        ArrayUtils.equalContentUnordered = equalContentUnordered;
        function equalContentUnorderedUsigMap(a1, a2) {
            if (a1 === a2) {
                return true;
            }
            if (a1.length != a2.length) {
                return false;
            }
            var map1 = makeCountMap(a1);
            var map2 = makeCountMap(a2);
            var equals = true;
            map1.forEach(function (v, k) {
                if (map2.get(k) !== v) {
                    equals = false;
                }
            });
            return equals;
        }
        ArrayUtils.equalContentUnorderedUsigMap = equalContentUnorderedUsigMap;
        function makeCountMap(a) {
            var map = new Map();
            for (var _i = 0, a_1 = a; _i < a_1.length; _i++) {
                var e = a_1[_i];
                var count = map.get(e);
                if (!count) {
                    map.set(e, 1);
                }
                else {
                    map.set(e, count + 1);
                }
            }
            return map;
        }
        ArrayUtils.makeCountMap = makeCountMap;
        function equalFuncDefault(v1, v2) {
            if (v1 === v2) {
                return true;
            }
            if (panda.Introspection.isNumber(v1) &&
                panda.Introspection.isNumber(v2) &&
                isNaN(v1) &&
                isNaN(v2)) {
                return true;
            }
            return false;
        }
        ArrayUtils.equalFuncDefault = equalFuncDefault;
        function max(array) {
            if (array.length === 0) {
                return NaN;
            }
            var max = Number.NEGATIVE_INFINITY;
            var l = array.length;
            for (var i = 0; i < l; i++) {
                var element = array[i];
                if (element > max) {
                    max = element;
                }
            }
            return max;
        }
        ArrayUtils.max = max;
        function min(array) {
            if (array.length === 0) {
                return NaN;
            }
            var min = Number.POSITIVE_INFINITY;
            var l = array.length;
            for (var i = 0; i < l; i++) {
                var element = array[i];
                if (element < min) {
                    min = element;
                }
            }
            return min;
        }
        ArrayUtils.min = min;
        function sum(array) {
            if (array.length === 0) {
                return NaN;
            }
            var sum = 0;
            var l = array.length;
            for (var i = 0; i < l; i++) {
                sum += array[i];
            }
            return sum;
        }
        ArrayUtils.sum = sum;
        function avg(array) {
            if (array.length === 0) {
                return NaN;
            }
            var sum = 0;
            var l = array.length;
            for (var i = 0; i < l; i++) {
                sum += array[i];
            }
            return sum / l;
        }
        ArrayUtils.avg = avg;
        function copy(array) {
            return array.concat();
        }
        ArrayUtils.copy = copy;
        /**
        * Sorts specified array ascending. Modifies argument/
        *
        */
        function sortAscending(array) {
            return array.sort(function (a, b) { return a - b; });
        }
        ArrayUtils.sortAscending = sortAscending;
        /**
        * Sorts specified array descending. Modifies argument/
        *
        */
        function sortDescending(array) {
            return array.sort(function (a, b) { return b - a; });
        }
        ArrayUtils.sortDescending = sortDescending;
        /**
        * Sorts specified array ascending. Modifies argument/
        *
        */
        function sortStringsAscending(array) {
            return array.sort(function (a, b) {
                if (a > b) {
                    return 1;
                }
                else if (a < b) {
                    return -1;
                }
                else {
                    return 0;
                }
            });
        }
        ArrayUtils.sortStringsAscending = sortStringsAscending;
        function sortStringsDescending(array) {
            return array.sort(function (a, b) {
                if (a > b) {
                    return -1;
                }
                else if (a < b) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
        }
        ArrayUtils.sortStringsDescending = sortStringsDescending;
        function sortOn(a, fieldNames) {
            //todo: add props and implement
            throw new panda.AdvancedError('not implemented yet');
        }
        ArrayUtils.sortOn = sortOn;
        function reverse(array, step) {
            if (step === void 0) { step = 1; }
            var right = array.length - step;
            var left = 0;
            while (left < right) {
                for (var i = 0; i < step; i++) {
                    var tmp = array[left + i];
                    array[left + i] = array[right + i];
                    array[right + i] = tmp;
                }
                left += step;
                right -= step;
            }
            return array;
        }
        ArrayUtils.reverse = reverse;
        function percentile(array, percentile) {
            if (array.length === 0) {
                return NaN;
            }
            var sorted = ArrayUtils.sortAscending(ArrayUtils.copy(array));
            var index = Math.ceil((sorted.length - 1) * percentile);
            return sorted[index];
        }
        ArrayUtils.percentile = percentile;
        function powerArray(a, mult) {
            var result = [[]];
            while (mult--) {
                result = this.multiplyArrays(result, a);
            }
            return result;
        }
        ArrayUtils.powerArray = powerArray;
        function multiplyArrays(a, b) {
            var result = [];
            for (var _i = 0, a_2 = a; _i < a_2.length; _i++) {
                var ae = a_2[_i];
                for (var _a = 0, b_1 = b; _a < b_1.length; _a++) {
                    var be = b_1[_a];
                    result.push(ae.concat(be));
                }
            }
            return result;
        }
        ArrayUtils.multiplyArrays = multiplyArrays;
        function getArraySubCombination(a, length) {
            var result = [];
            var counters = [];
            for (var i = 0; i < length; i++) {
                counters[i] = { max: a.length, counter: 0 };
            }
            do {
                var combination = [];
                for (var i = 0; i < length; i++) {
                    combination.push(a[counters[i].counter]);
                }
                result.push(combination);
            } while (ArrayUtils.arraySubCombinationNext(counters, 0));
            return result;
        }
        ArrayUtils.getArraySubCombination = getArraySubCombination;
        function arraySubCombinationNext(counters, depth) {
            if (depth == counters.length)
                return false;
            counters[depth].counter++;
            if (counters[depth].counter == counters[depth].max) {
                var ret = ArrayUtils.arraySubCombinationNext(counters, depth + 1);
                if (ret) {
                    counters[depth].counter = counters[depth + 1].counter;
                }
                return ret;
            }
            return true;
        }
        ArrayUtils.arraySubCombinationNext = arraySubCombinationNext;
        function getAllSublines(arrays, callback) {
            if (callback === void 0) { callback = null; }
            var result = [];
            var counters = [];
            for (var i = 0; i < arrays.length; i++) {
                counters[i] = { max: arrays[i].length, counter: 0 };
            }
            do {
                var combination = [];
                for (var i = 0; i < arrays.length; i++) {
                    combination.push(arrays[i][counters[i].counter]);
                }
                if (callback) {
                    callback(combination);
                }
                else {
                    result.push(combination);
                }
            } while (ArrayUtils.arraySubLineNext(counters, 0));
            return result;
        }
        ArrayUtils.getAllSublines = getAllSublines;
        function filterFileNamesByExtensions(fileNames) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (args.length <= 1) {
                throw new panda.AdvancedError('wrong arguments count');
            }
            var extensions = false && ArrayUtils.arrayToHash(null);
            extensions = {};
            if (panda.Introspection.isArray(args[0])) {
                if (args.length >= 1) {
                    throw new panda.AdvancedError('If second argument is array, no more than two arguments allowed');
                }
                extensions = ArrayUtils.arrayToHash(args[0]);
            }
            else {
                extensions = ArrayUtils.arrayToHash(args);
            }
            var res = new Array();
            for (var _a = 0, fileNames_1 = fileNames; _a < fileNames_1.length; _a++) {
                var fileName = fileNames_1[_a];
                var dotPosition = fileName.lastIndexOf('.');
                if (dotPosition == -1) {
                    continue;
                }
                var ext = fileName.substr(dotPosition + 1); // +1 for dot itself
                if (extensions[ext] == true) {
                    res.push(fileName);
                }
            }
            return res;
        }
        ArrayUtils.filterFileNamesByExtensions = filterFileNamesByExtensions;
        function arrayToHash(arr) {
            var hash = Object.create(null);
            for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                var arg = arr_1[_i];
                hash[arg] = true;
            }
            return hash;
        }
        ArrayUtils.arrayToHash = arrayToHash;
        function arraySubLineNext(counters, depth) {
            if (depth == counters.length)
                return false;
            var curCounter = counters[depth];
            curCounter.counter++;
            if (curCounter.counter == curCounter.max) {
                curCounter.counter = 0;
                return ArrayUtils.arraySubLineNext(counters, depth + 1);
            }
            return true;
        }
        ArrayUtils.arraySubLineNext = arraySubLineNext;
    })(ArrayUtils = panda.ArrayUtils || (panda.ArrayUtils = {}));
})(panda || (panda = {}));
var BuildInfo = /** @class */ (function () {
    function BuildInfo() {
    }
    Object.defineProperty(BuildInfo, "buildDate", {
        // get values form BuildProperties in exists
        get: function () { return this.getPropByName('buildDate', '0'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BuildInfo, "buildNumber", {
        get: function () { return this.getPropByName('buildNumber', '0'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BuildInfo, "online", {
        get: function () { return this.getPropByName('online', 'true'); },
        enumerable: false,
        configurable: true
    });
    BuildInfo.getPropByName = function (name, defaultValue) {
        var buildProps = window['BuildProperties'];
        return buildProps ? buildProps[name] : defaultValue;
    };
    return BuildInfo;
}());
///ts:ref=AnyFunc
/// <reference path="./AnyFunc.ts"/> ///ts:ref:generated
///ts:ref=Console
/// <reference path="../console/Console.ts"/> ///ts:ref:generated
var panda;
(function (panda) {
    var ChainerSync;
    (function (ChainerSync) {
        function chain(thisArg) {
            var funcs = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                funcs[_i - 1] = arguments[_i];
            }
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                panda.Console.here;
                var result;
                var l = funcs.length;
                for (var i = 0; i < l; i++) {
                    var func = funcs[i];
                    if (!func) {
                        continue;
                    }
                    try {
                        result = func.apply(thisArg, args);
                    }
                    catch (e) {
                        panda.Console.errorUncritical(e);
                    }
                }
                return result;
            };
        }
        ChainerSync.chain = chain;
    })(ChainerSync = panda.ChainerSync || (panda.ChainerSync = {}));
})(panda || (panda = {}));
var panda;
(function (panda) {
    var Clipboard = /** @class */ (function () {
        function Clipboard() {
        }
        // see https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
        Clipboard.setClipboardContent = function (text) {
            var n = navigator;
            if (!n.clipboard) {
                Clipboard.fallbackCopyTextToClipboard(text);
                return;
            }
            n.clipboard.writeText(text).then(function () {
                console.log('Async: Copying to clipboard was successful!');
            }, function (err) {
                console.error('Async: Could not copy text: ', err);
            });
        };
        Clipboard.fallbackCopyTextToClipboard = function (text) {
            var textArea = document.createElement("textarea");
            textArea.value = text;
            // Avoid scrolling to bottom
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                console.log('Fallback: Copying text command was ' + msg);
            }
            catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
            }
            document.body.removeChild(textArea);
        };
        return Clipboard;
    }());
    panda.Clipboard = Clipboard;
})(panda || (panda = {}));
// Based on https://github.com/zeh/prando
var panda;
(function (panda) {
    var DRandom = /** @class */ (function () {
        function DRandom(seed) {
            if (typeof (seed) === "string") {
                this._seed = this.hashCode(seed);
                this._value = this._seed;
            }
            else if (typeof (seed) === "number") {
                this._seed = seed;
                this._value = this._seed;
            }
            else {
                throw new Error('DRandom incorrect seed');
            }
        }
        DRandom.prototype.next = function (min, pseudoMax) {
            if (min === void 0) { min = 0; }
            if (pseudoMax === void 0) { pseudoMax = 1; }
            this.recalculate();
            return this.map(this._value, DRandom.MIN, DRandom.MAX, min, pseudoMax);
        };
        DRandom.prototype.recalculate = function () {
            // Xorshift*32
            // Based on George Marsaglia's work: http://www.jstatsoft.org/v08/i14/paper
            this._value ^= this._value << 13;
            this._value ^= this._value >> 17;
            this._value ^= this._value << 5;
        };
        DRandom.prototype.map = function (val, minFrom, maxFrom, minTo, maxTo) {
            return ((val - minFrom) / (maxFrom - minFrom)) * (maxTo - minTo) + minTo;
        };
        DRandom.prototype.hashCode = function (str) {
            var hash = 0;
            if (str) {
                var l = str.length;
                for (var i = 0; i < l; i++) {
                    hash = ((hash << 5) - hash) + str.charCodeAt(i);
                    hash |= 0;
                }
            }
            return hash;
        };
        DRandom.MIN = -2147483648; // Int32 min
        DRandom.MAX = 2147483647; // Int32 max
        return DRandom;
    }());
    panda.DRandom = DRandom;
})(panda || (panda = {}));
var panda;
(function (panda) {
    var DateUtils;
    (function (DateUtils) {
        function now() {
            if (Date.now) {
                return Date.now();
            }
            else {
                return (new Date()).getTime();
            }
        }
        DateUtils.now = now;
    })(DateUtils = panda.DateUtils || (panda.DateUtils = {}));
})(panda || (panda = {}));
var panda;
(function (panda) {
    var Digits = /** @class */ (function () {
        function Digits(value) {
            if (value === void 0) { value = '0'; }
            this._radix = 10;
            this._data = [];
            if (typeof value === 'number') {
                this.setFromNumber(value);
            }
            else if (typeof value === 'string') {
                this.setFromString(value);
            }
            else {
                this.setFromDigits(value);
            }
        }
        Digits.pow2 = function (radix, pow) {
            if (!Digits.__pow2__pows.has(radix)) {
                var one = Digits.radixToPrefix(radix) + '1';
                Digits.__pow2__pows.set(radix, [new Digits(one)]);
            }
            var pows = Digits.__pow2__pows.get(radix);
            for (var i = pows.length; i <= pow; ++i) {
                var prevPow2 = pows[i - 1];
                var pow2 = new Digits(prevPow2);
                pow2.mul2();
                pows.push(pow2);
            }
            return pows[pow];
        };
        Object.defineProperty(Digits.prototype, "radix", {
            get: function () { return this._radix; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Digits.prototype, "data", {
            get: function () { return this._data; },
            enumerable: false,
            configurable: true
        });
        Digits.prototype.setFromDigits = function (other) {
            var _a;
            this._radix = other.radix;
            this._data.length = 0;
            (_a = this._data).push.apply(_a, other.data);
        };
        Digits.prototype.setFromNumber = function (value) {
            if (value < 0)
                throw new Error('negative values are not supported');
            this.setToZero(10);
            while (value > 0) {
                var digit = value % 10;
                this._data.push(digit);
                value = (value - digit) / 10;
            }
        };
        Digits.prototype.setFromString = function (value) {
            if (value === void 0) { value = '0'; }
            this._radix = Digits.parseRadix(value);
            if (this._radix !== 10) {
                value = value.slice(2);
            }
            this._data.length = 0;
            for (var i = value.length - 1; i >= 0; --i) {
                var digit = Digits.charToDigit(value.charCodeAt(i));
                if (digit >= this._radix) {
                    throw new Error("digit " + digit + " bigger than radix " + this._radix);
                }
                this._data.push(digit);
            }
            this.shrink();
        };
        Digits.prototype.setFromBitFields = function (fieldSizes, fields) {
            this.setToZero(2);
            var digits = Digits.__setBitFields__digits;
            for (var i = 0; i < fields.length; ++i) {
                var field = fields[i];
                var fieldSize = fieldSizes[i];
                digits.setFromNumber(field);
                digits.setRadix(2);
                for (var j = 0; j < fieldSize; ++j) {
                    var bit = j < digits._data.length ? digits._data[j] : 0;
                    this._data.push(bit);
                }
            }
            this.shrink();
        };
        Digits.prototype.readBitFields = function (fieldSizes) {
            var digits = this;
            if (this._radix != 2) {
                digits = Digits.__readBitFields__digits;
                digits.setFromDigits(this);
                digits.setRadix(2);
            }
            var fields = [];
            var offset = 0;
            for (var _i = 0, fieldSizes_1 = fieldSizes; _i < fieldSizes_1.length; _i++) {
                var size = fieldSizes_1[_i];
                var field = 0;
                for (var pow = 0; pow < size; ++pow) {
                    var bit = offset < digits._data.length ? digits._data[offset] : 0;
                    if (bit !== 0) {
                        field += Math.pow(2, pow);
                    }
                    ++offset;
                }
                fields.push(field);
            }
            return fields;
        };
        Digits.prototype.setToZero = function (radix) {
            if (radix === void 0) { radix = -1; }
            if (radix !== -1) {
                Digits.radixToPrefix(radix);
                this._radix = radix;
            }
            this._data.length = 0;
        };
        Digits.prototype.setRadix = function (radix_) {
            var radix = typeof radix_ === 'number' ? radix_ : Digits.parseRadix(radix_);
            if (radix === this._radix)
                return;
            Digits.radixToPrefix(radix);
            if (radix === 2) {
                var bitsCount = 0;
                while (true) {
                    var nextPow = bitsCount;
                    var nextPow2 = Digits.pow2(this._radix, nextPow);
                    if (this.compare(nextPow2) === -1 /* Less */) {
                        break;
                    }
                    ++bitsCount;
                }
                var digits = Digits.__convertToRadix__digits;
                digits.setFromDigits(this);
                this.setToZero(2);
                for (var pow = bitsCount; pow >= 0; --pow) {
                    var pow2 = Digits.pow2(digits._radix, pow);
                    if (pow2.compare(digits) === 1 /* Greater */) {
                        this._data.push(0);
                    }
                    else {
                        this._data.push(1);
                        digits.sub(pow2);
                    }
                }
                this._data.reverse();
                this.shrink();
            }
            else {
                this.setRadix(2);
                var digits = Digits.__convertToRadix__digits;
                digits.setToZero(radix);
                for (var pow = 0; pow < this._data.length; ++pow) {
                    var bit = this._data[pow];
                    if (bit === 1) {
                        var pow2 = Digits.pow2(radix, pow);
                        digits.add(pow2);
                    }
                }
                this.setFromDigits(digits);
            }
        };
        Digits.prototype.compare = function (other) {
            if (this._radix !== other.radix) {
                Digits.__compare__digits.setFromDigits(other);
                Digits.__compare__digits.setRadix(this._radix);
                other = Digits.__compare__digits;
            }
            if (this._data.length !== other.data.length) {
                return this._data.length > other.data.length ? 1 /* Greater */ : -1 /* Less */;
            }
            for (var i = this._data.length - 1; i >= 0; --i) {
                var a = this._data[i];
                var b = other.data[i];
                if (a < b)
                    return -1 /* Less */;
                if (a > b)
                    return 1 /* Greater */;
            }
            return 0 /* Equal */;
        };
        Digits.prototype.add = function (other) {
            if (this._radix !== other.radix) {
                Digits.__add__digits.setFromDigits(other);
                Digits.__add__digits.setRadix(this._radix);
                other = Digits.__add__digits;
            }
            var maxLen = Math.max(this._data.length, other.data.length);
            var t = 0;
            for (var i = 0; i < maxLen; ++i) {
                var a = i < this._data.length ? this._data[i] : 0;
                var b = i < other.data.length ? other.data[i] : 0;
                var r = -this._radix + a + b + t;
                if (r < 0) {
                    r += this._radix;
                    t = 0;
                }
                else {
                    t = 1;
                }
                this._data[i] = r;
            }
            if (t != 0) {
                this._data.push(t);
            }
        };
        Digits.prototype.sub = function (other) {
            if (this._radix !== other.radix) {
                Digits.__sub__digits.setFromDigits(other);
                Digits.__sub__digits.setRadix(this._radix);
                other = Digits.__sub__digits;
            }
            var cmp = this.compare(other);
            if (cmp === -1 /* Less */)
                throw new Error('cant subtract a larger value');
            if (cmp === 0 /* Equal */) {
                this.setToZero();
                return;
            }
            var t = 0;
            for (var i = 0; i < this._data.length; ++i) {
                var a = this._data[i];
                var b = i < other.data.length ? other.data[i] : 0;
                var r = a - b + t;
                if (r < 0) {
                    r += this._radix;
                    t = -1;
                }
                else {
                    t = 0;
                }
                this._data[i] = r;
            }
            this.shrink();
        };
        Digits.prototype.mul2 = function () {
            var t = 0;
            for (var i = 0; i < this._data.length; ++i) {
                var a = this._data[i];
                var r = -this._radix + a + a + t;
                if (r < 0) {
                    r += this._radix;
                    t = 0;
                }
                else {
                    t = 1;
                }
                this._data[i] = r;
            }
            if (t != 0) {
                this._data.push(t);
            }
        };
        Digits.prototype.shrink = function () {
            var lastSignificantDigit = this._data.length - 1;
            while (lastSignificantDigit >= 0 && this._data[lastSignificantDigit] === 0) {
                --lastSignificantDigit;
            }
            this._data.length = lastSignificantDigit + 1;
        };
        Digits.prototype.toString = function () {
            if (this._data.length === 0) {
                return Digits.radixToPrefix(this._radix) + '0';
            }
            var str = '';
            for (var _i = 0, _a = this._data; _i < _a.length; _i++) {
                var digit = _a[_i];
                str = Digits.digitToChar(digit) + str;
            }
            return Digits.radixToPrefix(this._radix) + str;
        };
        Digits.codeOf = function (char) {
            return char.charCodeAt(0);
        };
        Digits.parseRadix = function (value) {
            if (value.charCodeAt(0) === Digits.codeOf('0')) {
                switch (value.charCodeAt(1)) {
                    case Digits.codeOf('K'): return 1000000000000000;
                    case Digits.codeOf('x'): return 16;
                    case Digits.codeOf('o'): return 8;
                    case Digits.codeOf('b'): return 2;
                }
            }
            return 10;
        };
        Digits.radixToPrefix = function (radix) {
            switch (radix) {
                case 1000000000000000: return '0K';
                case 16: return '0x';
                case 10: return '';
                case 8: return '0o';
                case 2: return '0b';
            }
            throw new Error("unsupported radix: " + radix);
        };
        Digits.charToDigit = function (char) {
            switch (char) {
                case Digits.codeOf('0'): return 0;
                case Digits.codeOf('1'): return 1;
                case Digits.codeOf('2'): return 2;
                case Digits.codeOf('3'): return 3;
                case Digits.codeOf('4'): return 4;
                case Digits.codeOf('5'): return 5;
                case Digits.codeOf('6'): return 6;
                case Digits.codeOf('7'): return 7;
                case Digits.codeOf('8'): return 8;
                case Digits.codeOf('9'): return 9;
                case Digits.codeOf('a'):
                case Digits.codeOf('A'): return 10;
                case Digits.codeOf('b'):
                case Digits.codeOf('B'): return 11;
                case Digits.codeOf('c'):
                case Digits.codeOf('C'): return 12;
                case Digits.codeOf('d'):
                case Digits.codeOf('D'): return 13;
                case Digits.codeOf('e'):
                case Digits.codeOf('E'): return 14;
                case Digits.codeOf('f'):
                case Digits.codeOf('F'): return 15;
            }
            throw new Error("unknown character of digit: " + char);
        };
        Digits.digitToChar = function (digit) {
            switch (digit) {
                case 0: return '0';
                case 1: return '1';
                case 2: return '2';
                case 3: return '3';
                case 4: return '4';
                case 5: return '5';
                case 6: return '6';
                case 7: return '7';
                case 8: return '8';
                case 9: return '9';
                case 10: return 'A';
                case 11: return 'B';
                case 12: return 'C';
                case 13: return 'D';
                case 14: return 'E';
                case 15: return 'F';
            }
            throw new Error("unsupported digit: " + digit);
        };
        Digits.__pow2__pows = new Map();
        Digits.__setBitFields__digits = new Digits();
        Digits.__readBitFields__digits = new Digits();
        Digits.__convertToRadix__digits = new Digits();
        Digits.__compare__digits = new Digits();
        Digits.__add__digits = new Digits();
        Digits.__sub__digits = new Digits();
        return Digits;
    }());
    panda.Digits = Digits;
})(panda || (panda = {}));
var panda;
(function (panda) {
    var GlobalErrorListener;
    (function (GlobalErrorListener) {
        GlobalErrorListener.onGlobalError = null;
        function init() {
            GlobalErrorListener.onGlobalError = new panda.Signal();
        }
        GlobalErrorListener.init = init;
        var _suppresOtput = false;
        function suppresNextOtput() {
            _suppresOtput = true;
        }
        GlobalErrorListener.suppresNextOtput = suppresNextOtput;
        function isOutputSupressed() {
            var supress = _suppresOtput;
            _suppresOtput = false;
            return supress;
        }
        GlobalErrorListener.isOutputSupressed = isOutputSupressed;
    })(GlobalErrorListener = panda.GlobalErrorListener || (panda.GlobalErrorListener = {}));
})(panda || (panda = {}));
///ts:ref=Console
/// <reference path="../console/Console.ts"/> ///ts:ref:generated
var panda;
(function (panda) {
    var GlobalInstanceChecker;
    (function (GlobalInstanceChecker) {
        var set = new Set();
        function watch(item) {
            set.add(item);
        }
        GlobalInstanceChecker.watch = watch;
        function unWatch(item) {
            set.delete(item);
        }
        GlobalInstanceChecker.unWatch = unWatch;
        function check() {
            set.forEach(function (item) {
                if (item && item.getIsValid()) {
                    panda.Console.errorUncritical(new panda.AdvancedError('Valid leaked iterator ' + item.getName()));
                }
            });
            set = new Set();
        }
        GlobalInstanceChecker.check = check;
    })(GlobalInstanceChecker = panda.GlobalInstanceChecker || (panda.GlobalInstanceChecker = {}));
})(panda || (panda = {}));
var panda;
(function (panda) {
    var Guid;
    (function (Guid) {
        function generate() {
            //http://stackoverflow.com/a/2117523
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        Guid.generate = generate;
    })(Guid = panda.Guid || (panda.Guid = {}));
})(panda || (panda = {}));
var panda;
(function (panda) {
    var HTMLUtils;
    (function (HTMLUtils) {
        function addClass(elem, cls) {
            if (elem.className.length === 0) {
                elem.className = cls;
            }
            else {
                var list = elem.className.split(' ');
                if (list.indexOf(cls) < 0) {
                    elem.className += ' ' + cls;
                }
            }
        }
        HTMLUtils.addClass = addClass;
        function removeClass(elem, cls) {
            var list = elem.className.split(' ');
            var index = list.indexOf(cls);
            if (index >= 0) {
                list.splice(index, 1);
                elem.className = list.join(' ');
            }
        }
        HTMLUtils.removeClass = removeClass;
        function createXML(rootName) {
            if (rootName === void 0) { rootName = ''; }
            var xmlDoc = CreateMSXMLDocumentObject();
            if (xmlDoc) {
                if (rootName) {
                    var rootNode = xmlDoc.createElement(rootName);
                    xmlDoc.appendChild(rootNode);
                }
            }
            else {
                if (document.implementation && document.implementation.createDocument) {
                    xmlDoc = document.implementation.createDocument('', rootName, null);
                }
            }
            return xmlDoc;
        }
        HTMLUtils.createXML = createXML;
        function CreateMSXMLDocumentObject() {
            if (typeof (ActiveXObject) != "undefined") {
                var progIDs = [
                    "Msxml2.DOMDocument.6.0",
                    "Msxml2.DOMDocument.5.0",
                    "Msxml2.DOMDocument.4.0",
                    "Msxml2.DOMDocument.3.0",
                    "MSXML2.DOMDocument",
                    "MSXML.DOMDocument"
                ];
                for (var i = 0; i < progIDs.length; i++) {
                    try {
                        return new ActiveXObject(progIDs[i]);
                    }
                    catch (e) { }
                    ;
                }
            }
            return null;
        }
        function setXMLTextContent(elem, text) {
            if (elem.textContent) {
                elem.textContent = text;
            }
            else {
                elem.text = text;
            }
        }
        HTMLUtils.setXMLTextContent = setXMLTextContent;
        function setTextContent(elem, text) {
            if (elem.textContent) {
                elem.textContent = text;
            }
            else {
                elem.innerText = text;
            }
        }
        HTMLUtils.setTextContent = setTextContent;
        function getEventTarget(e) {
            return e.target || e.srcElement;
        }
        HTMLUtils.getEventTarget = getEventTarget;
        function init() {
            HTMLUtils.onWindowResize = new panda.Signal();
        }
        HTMLUtils.init = init;
    })(HTMLUtils = panda.HTMLUtils || (panda.HTMLUtils = {}));
})(panda || (panda = {}));
///ts:ref=Url
/// <reference path="../net/url/Url.ts"/> ///ts:ref:generated
var panda;
(function (panda) {
    panda.Url = panda.url.Url;
    function Initializer(usePerfMonior, initSocialInfo) {
        if (usePerfMonior === void 0) { usePerfMonior = true; }
        if (initSocialInfo === void 0) { initSocialInfo = initSocialInfoDefault; }
        addPolyfills();
        addMapFlashMethods();
        panda.settings.URL_USE_ROOT = true;
        panda.GlobalErrorListener.init();
        window.onerror = panda.ChainerSync.chain(window, window.onerror, function (msg, url, line, col, error) {
            panda.GlobalErrorListener.onGlobalError.emit(msg, url, line, col, error);
            return panda.GlobalErrorListener.isOutputSupressed();
        });
        panda.HTMLUtils.init();
        window.onresize = panda.ChainerSync.chain(window, window.onresize, function () {
            panda.HTMLUtils.onWindowResize.emit();
        });
        panda.Console.$INIT();
        // if (BuildInfo.online === 'true') {
        // 	let sender = new FlogsSender();
        // 	(window as any)['FlogsSenderInst'] = sender;
        // 	Console.onLog.addListener(sender.handler_log);
        // }
        initSocialInfo();
        var statUrl = new panda.url.Url();
        statUrl.hostname = 'stat.crazypanda.ru';
        statUrl.pathname = 'event';
        panda.Stat.intance = new panda.Stat(statUrl, 100);
        panda.GlobalInstanceChecker.check();
        panda.MainLoop.init(usePerfMonior);
    }
    panda.Initializer = Initializer;
    function addMapFlashMethods() {
        function transformKey(key) {
            var keyType = typeof key;
            if (keyType === 'object' && key !== null) {
                return key;
            }
            if (keyType === 'string') {
                var parsed = parseInt(key);
                if (panda.Introspection.isUint(parsed) && ('' + parsed) === key && parsed <= 268435455) {
                    return parsed;
                }
                return key;
            }
            if (keyType === 'number' && panda.Introspection.isUint(key) && key <= 268435455) {
                return key;
            }
            return "" + key;
        }
        var mapProto = Map.prototype;
        // delete(key: K): boolean;
        mapProto.fdelete = function (key) {
            var newKey = transformKey(key);
            return this.delete(newKey);
        };
        // get(key: K): V | undefined;
        mapProto.fget = function (key) {
            var newKey = transformKey(key);
            return this.get(newKey);
        };
        // has(key: K): boolean;
        mapProto.fhas = function (key) {
            var newKey = transformKey(key);
            return this.has(newKey);
        };
        // set(key: K, value: V): this;
        mapProto.fset = function (key, value) {
            var newKey = transformKey(key);
            return this.set(newKey, value);
        };
        mapProto = WeakMap.prototype;
        // delete(key: K): boolean;
        mapProto.fdelete = function (key) {
            var newKey = transformKey(key);
            return this.delete(newKey);
        };
        // get(key: K): V | undefined;
        mapProto.fget = function (key) {
            var newKey = transformKey(key);
            return this.get(newKey);
        };
        // has(key: K): boolean;
        mapProto.fhas = function (key) {
            var newKey = transformKey(key);
            return this.has(newKey);
        };
        // set(key: K, value: V): this;
        mapProto.fset = function (key, value) {
            var newKey = transformKey(key);
            return this.set(newKey, value);
        };
    }
    function addPolyfills() {
        if (!Error.throwError) {
            Error.throwError = function (cls, code, type) {
                throw new cls(type);
            };
        }
        if (!Date.prototype.toISOString) {
            (function () {
                function pad(val) {
                    if (val < 10) {
                        return '0' + val;
                    }
                    return val;
                }
                Date.prototype.toISOString = function () {
                    return this.getUTCFullYear() +
                        '-' + pad(this.getUTCMonth() + 1) +
                        '-' + pad(this.getUTCDate()) +
                        'T' + pad(this.getUTCHours()) +
                        ':' + pad(this.getUTCMinutes()) +
                        ':' + pad(this.getUTCSeconds()) +
                        '.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
                        'Z';
                };
            }());
        }
        if (!Date.prototype.hours) {
            var readWrite = {
                'date': 'Date',
                'dateUTC': 'UTCDate',
                'fullYear': 'FullYear',
                'fullYearUTC': 'UTCFullYear',
                'hours': 'Hours',
                'hoursUTC': 'UTCHours',
                'milliseconds': 'Milliseconds',
                'millisecondsUTC': 'UTCMilliseconds',
                'minutes': 'Minutes',
                'minutesUTC': 'UTCMinutes',
                'month': 'Month',
                'monthUTC': 'UTCMonth',
                'seconds': 'Seconds',
                'secondsUTC': 'UTCSeconds',
                'time': 'Time',
            };
            var readonly = {
                'day': 'Day',
                'dayUTC': 'UTCDay',
                'timezoneOffset': 'TimezoneOffset',
            };
            for (var propName in readWrite) {
                Object.defineProperty(Date.prototype, propName, {
                    configurable: true,
                    enumerable: false,
                    get: Date.prototype['get' + readWrite[propName]],
                    set: Date.prototype['set' + readWrite[propName]]
                });
            }
            for (var propName in readonly) {
                Object.defineProperty(Date.prototype, propName, {
                    configurable: true,
                    enumerable: false,
                    get: Date.prototype['get' + readonly[propName]]
                });
            }
        }
        if (!Array.prototype.filter) {
            Array.prototype.filter = function (fun /*, thisArg*/) {
                'use strict';
                if (this === void 0 || this === null) {
                    throw new TypeError();
                }
                var t = Object(this);
                var len = t.length >>> 0;
                if (typeof fun !== 'function') {
                    throw new TypeError();
                }
                var res = new Array();
                var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
                for (var i = 0; i < len; i++) {
                    if (i in t) {
                        var val = t[i];
                        // NOTE: Technically this should Object.defineProperty at
                        //       the next index, as push can be affected by
                        //       properties on Object.prototype and Array.prototype.
                        //       But that method's new, and collisions should be
                        //       rare, so use the more-compatible alternative.
                        if (fun.call(thisArg, val, i, t)) {
                            res.push(val);
                        }
                    }
                }
                return res;
            };
        }
        if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function Array_indexOf(elt /*, from*/) {
                var len = this.length >>> 0;
                var from = Number(arguments[1]) || 0;
                from = (from < 0)
                    ? Math.ceil(from)
                    : Math.floor(from);
                if (from < 0)
                    from += len;
                for (; from < len; from++) {
                    if (from in this &&
                        this[from] === elt)
                        return from;
                }
                return -1;
            };
        }
        //https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
        // Production steps of ECMA-262, Edition 5, 15.4.4.21
        // Reference: http://es5.github.io/#x15.4.4.21
        if (!Array.prototype.reduce) {
            Array.prototype.reduce = function Array_reduce(callback /*, initialValue*/) {
                'use strict';
                if (this === null) {
                    throw new TypeError('Array.prototype.reduce called on null or undefined');
                }
                if (typeof callback !== 'function') {
                    throw new TypeError(callback + ' is not a function');
                }
                var t = Object(this), len = t.length >>> 0, k = 0, value;
                if (arguments.length == 2) {
                    value = arguments[1];
                }
                else {
                    while (k < len && !(k in t)) {
                        k++;
                    }
                    if (k >= len) {
                        throw new TypeError('Reduce of empty array with no initial value');
                    }
                    value = t[k++];
                }
                for (; k < len; k++) {
                    if (k in t) {
                        value = callback(value, t[k], k, t);
                    }
                }
                return value;
            };
        }
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
        // Production steps of ECMA-262, Edition 5, 15.4.4.19
        // Reference: http://es5.github.io/#x15.4.4.19
        if (!Array.prototype.map) {
            Array.prototype.map = function Array_map(callback, thisArg) {
                var T, A, k;
                if (this === null) {
                    throw new TypeError(' this is null or not defined');
                }
                // 1. Let O be the result of calling ToObject passing the |this| 
                //    value as the argument.
                var O = Object(this);
                // 2. Let lenValue be the result of calling the Get internal 
                //    method of O with the argument "length".
                // 3. Let len be ToUint32(lenValue).
                var len = O.length >>> 0;
                // 4. If IsCallable(callback) is false, throw a TypeError exception.
                // See: http://es5.github.com/#x9.11
                if (typeof callback !== 'function') {
                    throw new TypeError(callback + ' is not a function');
                }
                // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
                if (arguments.length > 1) {
                    T = thisArg;
                }
                // 6. Let A be a new array created as if by the expression new Array(len) 
                //    where Array is the standard built-in constructor with that name and 
                //    len is the value of len.
                A = new Array(len);
                // 7. Let k be 0
                k = 0;
                // 8. Repeat, while k < len
                while (k < len) {
                    var kValue, mappedValue;
                    // a. Let Pk be ToString(k).
                    //   This is implicit for LHS operands of the in operator
                    // b. Let kPresent be the result of calling the HasProperty internal 
                    //    method of O with argument Pk.
                    //   This step can be combined with c
                    // c. If kPresent is true, then
                    if (k in O) {
                        // i. Let kValue be the result of calling the Get internal 
                        //    method of O with argument Pk.
                        kValue = O[k];
                        // ii. Let mappedValue be the result of calling the Call internal 
                        //     method of callback with T as the this value and argument 
                        //     list containing kValue, k, and O.
                        mappedValue = callback.call(T, kValue, k, O);
                        // iii. Call the DefineOwnProperty internal method of A with arguments
                        // Pk, Property Descriptor
                        // { Value: mappedValue,
                        //   Writable: true,
                        //   Enumerable: true,
                        //   Configurable: true },
                        // and false.
                        // In browsers that support Object.defineProperty, use the following:
                        // Object.defineProperty(A, k, {
                        //   value: mappedValue,
                        //   writable: true,
                        //   enumerable: true,
                        //   configurable: true
                        // });
                        // For best browser support, use the following:
                        A[k] = mappedValue;
                    }
                    // d. Increase k by 1.
                    k++;
                }
                // 9. return A
                return A;
            };
        }
        if (typeof WeakSet !== 'undefined') {
            insertWeakSet();
        }
        // if (typeof performance === 'undefined') {
        // 	(window as any)['performance'] = {};
        // }
        // 59ac1914-6ac4-4d56-99de-1666ea682655
        // смотри соответствующий тест, быстрого и адекватного способа задетектить что performance.now работает корректно не найдено
        // if (!checkPerformanceNowWorks()) {
        // 	let polyfill: Function;
        // 	if (typeof Date.now === 'undefined') {
        // 		console.log('!ACHTUNG!  Date.now is not available');
        // 		polyfill = function () {
        // 			return (new Date()).getTime();
        // 		}
        // 	} else {
        // 		polyfill = function () {
        // 			return Date.now();
        // 		}
        // 	}
        // 	(window as any)['performance']['now'] = polyfill;
        // }
        // function checkPerformanceNowWorks(): boolean {
        // 59ac1914-6ac4-4d56-99de-1666ea682655
        // 	return true;
        // }
    }
    function insertWeakSet() {
        var all = new WeakMap();
        var proto = WeakSet.prototype;
        proto.add = function (value) {
            return all.get(this).set(value, 1), this;
        };
        proto.delete = function (value) {
            return all.get(this).delete(value);
        };
        proto.has = function (value) {
            return all.get(this).has(value);
        };
        window['WeakSet'] = WeakSet;
        function WeakSet(iterable) {
            'use strict';
            all.set(this, new WeakMap);
            if (iterable)
                iterable.forEach(this.add, this);
        }
    }
    function initSocialInfoDefault() {
        var social = window.social;
        if (!social || !social.config || !social.config.stat) {
            return;
        }
        var statInfo = social.config.stat;
        var info = panda.PlatformDescriber.getInfo();
        info.sns = statInfo.site;
        info.userId = statInfo.uid;
        info.project = statInfo.project;
    }
})(panda || (panda = {}));
var panda;
(function (panda) {
    var Introspection;
    (function (Introspection) {
        // see http://stackoverflow.com/questions/332422/how-do-i-get-the-name-of-an-objects-type-in-javascript
        //const funcNameRegex:RegExp = /function ([^\( ]+?)\(/;
        var funcNameRegex = /function ([^\s\.]*?) ?\(/;
        var classNameRegex = /class ([^\s\.]*?)\s+/;
        var objNameRegex = /\[object (.+)\]/;
        /*
        export var equal:Map<string, number> = new Map();
        export var diff:Map<string, number> = new Map();
        export var all:Map<string, number> = new Map();
    
        function inc(map:Map<string, number>, key:string) {
            map.set(key, map.has(key) ? map.get(key) + 1 : 1);
        }
        */
        function getClassName(obj) {
            var name = getClassName2(obj);
            if (name == 'symbolClass') {
                throw new Error('invalid class name "symbolClass"');
            }
            return name;
            /*
            let n1 = getClassName1(obj);
            let n2 = getClassName2(obj);
            let n3 = null;
            if (obj && obj.multiname != null && obj.multiname.name != null) {
                n3 = obj.multiname.name;
            }
            if (n1 != n2) {
                if (n2 == 'JSON') {
                    inc(equal, ''+n1+' '+n2);
                }
                else if (n2 == 'ResourceShop') {
                    inc(equal, ''+n1+' '+n2);
                }
                else {
                    inc(diff, ''+n1+' '+n2);
                }
            }
            else {
                if (n2 == 'String') {
                    inc(equal, ''+n1+' '+n2);
                }
                else if (n2 == 'Number') {
                    inc(equal, ''+n1+' '+n2);
                }
                else {
                    inc(equal, ''+n1+' '+n2);
                }
            }
            if (n1 == 'Function' && n2 != '' &&  n3 != null) {
                let b = true;
            }
            n1 = getClassName1(obj);
            n2 = getClassName2(obj);
            inc(all, n1);
            inc(all, n2);
            return n2;
            */
        }
        Introspection.getClassName = getClassName;
        Introspection.getClassName2Cache = new WeakMap();
        Introspection.getClassName2StringCache = new Map();
        function getClassName2(v) {
            if (v === undefined) {
                return 'undefined';
            }
            if (v === null) {
                return 'null';
            }
            var cached = Introspection.getClassName2Cache.get(v);
            if (cached != null) {
                return cached;
            }
            var str = Object.prototype.toString.call(v);
            var result = str;
            switch (str) {
                case '[object Boolean]':
                    result = 'Boolean';
                    break;
                case '[object Number]':
                    result = 'Number';
                    break;
                case '[object String]':
                    result = 'String';
                    break;
                case '[object Array]':
                    result = 'Array';
                    break;
                case '[object Object]':
                    if (v.constructor != null && typeof v.constructor == 'function') {
                        result = getClassName2(v.constructor);
                    }
                    else {
                        result = 'Object';
                    }
                    break;
                case '[object Function]':
                    if (v.multiname != null && v.multiname.name != null) {
                        result = v.multiname.name;
                    }
                    else if (v.name != null) {
                        result = v.name;
                    }
                    else {
                        var func = Function.prototype.toString.call(v);
                        result = func.slice('function '.length, func.indexOf('('));
                        if (result == '' /* && !(v instanceof Function)*/) {
                            result = 'Function';
                        }
                    }
                    Introspection.getClassName2Cache.set(v, result);
                    break;
                default:
                    result = Introspection.getClassName2StringCache.get(str);
                    if (result == null) {
                        result = str.slice('[object '.length, str.length - 1);
                        Introspection.getClassName2StringCache.set(str, result);
                    }
                    break;
            }
            return result;
        }
        Introspection.getClassName2 = getClassName2;
        Introspection.classCache = new Map();
        function getClassName1(obj) {
            var results;
            var cacheKey = null;
            if (obj && obj.constructor && obj.constructor.multiname && obj.constructor.multiname.name) {
                return obj.constructor.multiname.name;
            }
            if (obj === undefined) {
                return typeof undefined;
            }
            else if (obj === null) {
                return "null"; // bug in ECMAScript standart
            }
            else if (obj instanceof Function) {
                cacheKey = obj;
                var cached = Introspection.classCache.get(cacheKey);
                if (cached) {
                    return cached;
                }
                var stringRepresentation = obj["toString"]();
                if (stringRepresentation.indexOf('class ') === 0) {
                    results = classNameRegex.exec(stringRepresentation);
                }
                else {
                    results = funcNameRegex.exec(stringRepresentation);
                }
            }
            else {
                var ctor = obj["constructor"];
                cacheKey = ctor;
                var cached = Introspection.classCache.get(cacheKey);
                if (cached) {
                    return cached;
                }
                var stringRepresentation = ctor["toString"]();
                if (stringRepresentation.indexOf('class ') === 0) {
                    results = classNameRegex.exec(stringRepresentation);
                }
                else {
                    results = funcNameRegex.exec(stringRepresentation);
                }
            }
            var result = "unknown";
            if (results && results.length > 1) {
                result = results[1];
                if (result.length == 0) {
                    return 'Function';
                }
            }
            else { // IE 11 case for builtInClasses like HTMLDivElement
                var stringified = Object.prototype.toString.call(obj);
                results = objNameRegex.exec(stringified);
                if (results && results.length > 1) {
                    result = results[1];
                }
            }
            if (cacheKey !== null && result !== 'unknown') {
                Introspection.classCache.set(cacheKey, result);
            }
            return result;
        }
        Introspection.getClassName1 = getClassName1;
        function getPropNames(obj) {
            var proto = obj;
            // нас не интересуют методы которые сами по себе есть на прототипе любого объекта
            // если интересуют то использовать let namesHash = Object.create(null)
            var namesHash = {};
            while (proto) {
                var props = Object.getOwnPropertyNames(proto);
                for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
                    var propName = props_1[_i];
                    if (typeof namesHash[propName] === 'undefined') {
                        namesHash[propName] = true;
                    }
                }
                proto = getObjectProto(proto);
            }
            var result = new Array();
            for (var propName in namesHash) {
                result.push(propName);
            }
            return result;
        }
        Introspection.getPropNames = getPropNames;
        function getFunctionName(f) {
            var results = funcNameRegex.exec(f["toString"]());
            var result = '';
            if (results && results.length > 1) {
                result = results[1]; // may be empty string;
            }
            if (result === '') {
                return 'unknownFunctionName';
            }
            return result;
        }
        Introspection.getFunctionName = getFunctionName;
        function getObjectProto(obj) {
            if (isPrimitive(obj)) {
                return null;
            }
            var proto = obj['__proto__'];
            if (!proto && Object.getPrototypeOf) {
                proto = Object.getPrototypeOf(obj);
                if (proto === obj) {
                    proto = null;
                }
            }
            if (!proto) {
                if (typeof obj.constructor == 'undefined') {
                    return null;
                }
                proto = obj.constructor.prototype;
                if (proto === obj) {
                    proto = null;
                }
            }
            return proto;
        }
        Introspection.getObjectProto = getObjectProto;
        function isPrimitive(obj) {
            var type = typeof obj;
            return obj === undefined || obj === null || type === "number" || type === "string" || type === "boolean";
        }
        Introspection.isPrimitive = isPrimitive;
        function isString(obj) {
            return typeof obj === 'string';
        }
        Introspection.isString = isString;
        function isArray(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }
        Introspection.isArray = isArray;
        function isInt(value) {
            return value === (value | 0);
        }
        Introspection.isInt = isInt;
        function isUint(value) {
            return value === (value >>> 0);
        }
        Introspection.isUint = isUint;
        function isNumber(value) {
            return typeof value === 'number';
        }
        Introspection.isNumber = isNumber;
        function isBoolean(value) {
            return typeof value === 'boolean';
        }
        Introspection.isBoolean = isBoolean;
        function isFunction(value) {
            return typeof value === 'function';
        }
        Introspection.isFunction = isFunction;
        var processedChain;
        function makeChainUnEnumerable(obj) {
            if (!Object.getOwnPropertyNames) {
                return;
            }
            if (!processedChain) {
                processedChain = new WeakSet();
            }
            var proto = obj;
            while (proto) {
                if (proto === Array.prototype || proto === Object.prototype || processedChain.has(proto)) {
                    return;
                }
                var keys = Object.getOwnPropertyNames(proto);
                for (var i = 0, l = keys.length; i < l; ++i) {
                    var key = keys[i];
                    var desc = Object.getOwnPropertyDescriptor(proto, key);
                    if (desc.enumerable) {
                        desc.enumerable = false;
                        Object.defineProperty(proto, key, desc);
                    }
                }
                processedChain.add(proto);
                proto = proto.__proto__;
            }
        }
        Introspection.makeChainUnEnumerable = makeChainUnEnumerable;
        function make(cls) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return makeFromArgArray(cls, args);
        }
        Introspection.make = make;
        function makeFromArgArray(cls, args) {
            var inst = new (Function.prototype.bind.apply(cls, [cls].concat(args)));
            return inst;
        }
        Introspection.makeFromArgArray = makeFromArgArray;
        function countBinds(name) {
            if (!Introspection.bindCounts[name]) {
                Introspection.bindCounts[name] = { name: name, count: 1 };
            }
            else {
                Introspection.bindCounts[name].count++;
            }
        }
        Introspection.countBinds = countBinds;
        var ClassCounterType;
        (function (ClassCounterType) {
            ClassCounterType[ClassCounterType["LegacyEntity"] = 0] = "LegacyEntity";
            ClassCounterType[ClassCounterType["bindMethodsIfNeeded"] = 1] = "bindMethodsIfNeeded";
            ClassCounterType[ClassCounterType["PixiDisplayObject"] = 2] = "PixiDisplayObject";
        })(ClassCounterType = Introspection.ClassCounterType || (Introspection.ClassCounterType = {}));
        function countClasses(cls, type) {
            var cp = cls;
            var hasLegacy = false;
            var names = [];
            var isFunc = false;
            var isObj = false;
            while (cp) {
                var name_2 = Introspection.getClassName(cp);
                if (names.indexOf(name_2) < 0) {
                    names.push(name_2);
                }
                if (type == ClassCounterType.bindMethodsIfNeeded) {
                    if (name_2 == "LegacyEntity") {
                        return;
                    }
                    if (name_2 == "PixiDisplayObject") {
                        return;
                    }
                }
                cp = Introspection.getObjectProto(cp);
            }
            var name = names[0];
            if (!Introspection.classCounts[name]) {
                Introspection.classCounts[name] = { name: name, count: 1 };
            }
            else {
                Introspection.classCounts[name].count++;
            }
            for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
                var name_3 = names_1[_i];
                countClassNestedConstructors(name_3);
            }
        }
        Introspection.countClasses = countClasses;
        function countClassNestedConstructors(name) {
            if (!Introspection.classNestedConstructorsCounts[name]) {
                Introspection.classNestedConstructorsCounts[name] = { name: name, count: 1 };
            }
            else {
                Introspection.classNestedConstructorsCounts[name].count++;
            }
        }
        Introspection.bindCounts = Object.create(null);
        Introspection.classCounts = Object.create(null);
        Introspection.classNestedConstructorsCounts = Object.create(null);
        function bindReport(top) {
            if (top === void 0) { top = 20; }
            var arr = [];
            for (var key in Introspection.bindCounts) {
                arr.push(Introspection.bindCounts[key]);
            }
            return arr.sort(function (a, b) { return b.count - a.count; }).splice(0, top);
        }
        Introspection.bindReport = bindReport;
        function classReport(top) {
            if (top === void 0) { top = 20; }
            var arr = [];
            for (var key in Introspection.classCounts) {
                arr.push(Introspection.classCounts[key]);
            }
            return arr.sort(function (a, b) { return b.count - a.count; }).splice(0, top);
        }
        Introspection.classReport = classReport;
        function classNestedConstructorsReport(top) {
            if (top === void 0) { top = 20; }
            var arr = [];
            for (var key in Introspection.classNestedConstructorsCounts) {
                arr.push(Introspection.classNestedConstructorsCounts[key]);
            }
            return arr.sort(function (a, b) { return b.count - a.count; }).splice(0, top);
        }
        Introspection.classNestedConstructorsReport = classNestedConstructorsReport;
        function bindMethodsIfNeeded(callee, newTarget, obj) {
            if (callee !== newTarget)
                return;
            panda.Introspection.countClasses(callee, panda.Introspection.ClassCounterType.bindMethodsIfNeeded);
            bindMethods(newTarget, obj);
            extractGettersSetters(newTarget, obj);
        }
        Introspection.bindMethodsIfNeeded = bindMethodsIfNeeded;
        function bindMethods(constructor, obj) {
            if (obj['__bindMethods_binded__']) {
                panda.Console.errorUncritical(new Error("Already binded"));
            }
            var methods = null;
            if (constructor.hasOwnProperty('__methodsForBinding__')) {
                methods = constructor['__methodsForBinding__'];
            }
            else {
                methods = [];
                Object.defineProperty(constructor, '__methodsForBinding__', {
                    value: methods,
                    enumerable: false,
                });
                var binded = new Set();
                var proto = panda.Introspection.getObjectProto(obj);
                while (proto != null && proto != Object.prototype) {
                    var names = Object.getOwnPropertyNames(proto);
                    for (var _i = 0, names_2 = names; _i < names_2.length; _i++) {
                        var name_4 = names_2[_i];
                        if (name_4 === 'constructor')
                            continue;
                        if (binded.has(name_4))
                            continue;
                        if (!window.bindSet.has(name_4))
                            continue;
                        binded.add(name_4);
                        var desc = Object.getOwnPropertyDescriptor(proto, name_4);
                        // if (!desc.enumerable) continue;
                        if (desc == null || desc.get != null || desc.set != null)
                            continue;
                        if (!panda.Introspection.isFunction(desc.value))
                            continue;
                        methods.push({ name: name_4, desc: desc });
                    }
                    proto = panda.Introspection.getObjectProto(proto);
                }
            }
            for (var _a = 0, methods_1 = methods; _a < methods_1.length; _a++) {
                var _b = methods_1[_a], name_5 = _b.name, desc = _b.desc;
                //Introspection.countBinds(name);
                //Introspection.countBinds('total');
                var binded = desc.value.bind(obj);
                // obj[name] = binded;
                Object.defineProperty(obj, name_5, {
                    enumerable: desc.enumerable,
                    value: binded,
                    configurable: desc.enumerable,
                    writable: desc.writable
                });
                binded['__bind_owner'] = obj;
            }
            Object.defineProperty(obj, '__bindMethods_binded__', { enumerable: false, value: true, configurable: false, writable: false });
        }
        var bindCache = new WeakMap();
        function cachedBind(func, thisArg) {
            var table = bindCache.get(func);
            if (!table) {
                table = new WeakMap();
                bindCache.set(func, table);
            }
            var cached = table.get(thisArg);
            if (!cached) {
                cached = func.bind(thisArg);
                table.set(thisArg, cached);
            }
            return cached;
        }
        Introspection.cachedBind = cachedBind;
        function extractGettersSetters(constructor, obj) {
            if (constructor.hasOwnProperty('__arePropsExtracted__'))
                return;
            Object.defineProperty(constructor, '__arePropsExtracted__', {
                value: true,
                enumerable: false,
            });
            var proto = panda.Introspection.getObjectProto(obj);
            var _loop_1 = function () {
                var __super__ = panda.Introspection.getObjectProto(proto);
                var _loop_2 = function (field) {
                    var desc = Object.getOwnPropertyDescriptor(proto, field);
                    //@popelyshev: _$_shumwayProperties надо переопределять но for in не должен их видеть
                    if (!desc.enumerable && !proto._$_shumwayProperties)
                        return "continue";
                    var isProperty = desc.get != null || desc.set != null;
                    if (!isProperty)
                        return "continue";
                    var __get__field = mangleFieldToExtractedMethod('get', field);
                    var __set__field = mangleFieldToExtractedMethod('set', field);
                    if (proto.hasOwnProperty(__get__field) || proto.hasOwnProperty(__set__field))
                        return "break";
                    if (desc.get == null) {
                        desc = {
                            get: function complementGet() {
                                if (!__super__[__get__field])
                                    throw new Error('Writeonly property!');
                                return __super__[__get__field].call(this);
                            },
                            set: desc.set,
                        };
                        Object.defineProperty(proto, field, desc);
                    }
                    else if (desc.set == null) {
                        desc = {
                            get: desc.get,
                            set: function complementSet(v) {
                                if (!__super__[__set__field])
                                    throw new Error('Readonly property!');
                                __super__[__set__field].call(this, v);
                            },
                        };
                        Object.defineProperty(proto, field, desc);
                    }
                    Object.defineProperty(proto, __get__field, {
                        value: desc.get,
                        enumerable: false,
                    });
                    var setter = desc.set;
                    Object.defineProperty(proto, __set__field, {
                        value: function extractedSet(val) {
                            setter.call(this, val);
                            return val;
                        },
                        enumerable: false,
                    });
                };
                for (var _i = 0, _a = Object.getOwnPropertyNames(proto); _i < _a.length; _i++) {
                    var field = _a[_i];
                    var state_1 = _loop_2(field);
                    if (state_1 === "break")
                        break;
                }
                proto = __super__;
            };
            while (proto != null && proto != Object.prototype) {
                _loop_1();
            }
        }
        function mangleFieldToExtractedMethod(type, name) {
            return type === 'get' ? "__get__" + name : "__set__" + name;
        }
        Introspection.mangleFieldToExtractedMethod = mangleFieldToExtractedMethod;
    })(Introspection = panda.Introspection || (panda.Introspection = {}));
})(panda || (panda = {}));
///ts:ref=PandaConsole
/// No file or directory matched name "PandaConsole" ///ts:ref:generated
var panda;
(function (panda) {
    var PerfUtils;
    (function (PerfUtils) {
        function wasteMilliseconds(ms) {
            var start = performance.now();
            var delta = 0;
            var counter = 0;
            while ((delta = performance.now() - start) < ms) {
                counter++;
            }
            //PandaConsole.logDebug('wasteMilliseconds:', counter/delta, 'c/ms');
            return delta;
        }
        PerfUtils.wasteMilliseconds = wasteMilliseconds;
        PerfUtils.storage = {};
        function getEventCount(areaName, eventName) {
            var areaStorage = PerfUtils.storage[areaName];
            if (!areaStorage) {
                return 0;
            }
            return areaStorage[eventName] || 0;
        }
        PerfUtils.getEventCount = getEventCount;
        function event(areaName, eventName, delta) {
            if (delta === void 0) { delta = 1; }
            var areaStorage = PerfUtils.storage[areaName];
            if (!areaStorage) {
                areaStorage = {};
                PerfUtils.storage[areaName] = areaStorage;
            }
            areaStorage[eventName] = (areaStorage[eventName] || 0) + delta;
        }
        PerfUtils.event = event;
    })(PerfUtils = panda.PerfUtils || (panda.PerfUtils = {}));
})(panda || (panda = {}));
var panda;
(function (panda) {
    var Pixel = /** @class */ (function () {
        function Pixel(color) {
            if (color === void 0) { color = 0; }
            this.color = 0 >>> 0;
            //Unportable.bindMethodsIfNeeded(Pixel, (new.target), this, ["__getter__a", "__setter__a", "__getter__r", "__setter__r", "__getter__g", "__setter__g", "__getter__b", "__setter__b"]);
            color = color >>> 0;
            this.color = color >>> 0;
        }
        Pixel.fromColorUint = function (color) {
            color = color >>> 0;
            return new Pixel(color);
        };
        Pixel.fromColorComponents = function (a, r, g, b) {
            a = a >>> 0;
            r = r >>> 0;
            g = g >>> 0;
            b = b >>> 0;
            return new Pixel(Pixel.assembleColor(a, r, g, b));
        };
        Object.defineProperty(Pixel.prototype, "a", {
            get: function () { return this.__getter__a() >>> 0; },
            set: function (a) {
                a = a >>> 0;
                this.__setter__a(a);
            },
            enumerable: false,
            configurable: true
        });
        Pixel.prototype.__getter__a = function () {
            return (this.color >> 24 & 0xFF) >>> 0;
        };
        Pixel.prototype.__setter__a = function (a) {
            a = a >>> 0;
            if (a < 0 || a > 255) {
                throw new Error('Attempt to set color red component a = ' + a);
            }
            this.color = (this.color & 0x00FFFFFF | a << 24) >>> 0;
        };
        Object.defineProperty(Pixel.prototype, "r", {
            get: function () { return this.__getter__r() >>> 0; },
            set: function (r) {
                r = r >>> 0;
                this.__setter__r(r);
            },
            enumerable: false,
            configurable: true
        });
        Pixel.prototype.__getter__r = function () {
            return (this.color >> 16 & 0xFF) >>> 0;
        };
        Pixel.prototype.__setter__r = function (r) {
            r = r >>> 0;
            if (r < 0 || r > 255) {
                throw new Error('Attempt to set color red component r = ' + r);
            }
            this.color = (this.color & 0xFF00FFFF | r << 16) >>> 0;
        };
        Object.defineProperty(Pixel.prototype, "g", {
            get: function () { return this.__getter__g() >>> 0; },
            set: function (g) {
                g = g >>> 0;
                this.__setter__g(g);
            },
            enumerable: false,
            configurable: true
        });
        Pixel.prototype.__getter__g = function () {
            return (this.color >> 8 & 0xFF) >>> 0;
        };
        Pixel.prototype.__setter__g = function (g) {
            g = g >>> 0;
            if (g < 0 || g > 255) {
                throw new Error('Attempt to set color red component g = ' + g);
            }
            this.color = (this.color & 0xFFFF00FF | g << 8) >>> 0;
        };
        Object.defineProperty(Pixel.prototype, "b", {
            get: function () { return this.__getter__b() >>> 0; },
            set: function (b) {
                b = b >>> 0;
                this.__setter__b(b);
            },
            enumerable: false,
            configurable: true
        });
        Pixel.prototype.__getter__b = function () {
            return (this.color & 0xFF) >>> 0;
        };
        Pixel.prototype.__setter__b = function (b) {
            b = b >>> 0;
            if (b < 0 || b > 255) {
                throw new Error('Attempt to set color red component b = ' + b);
            }
            this.color = (this.color & 0xFFFFFF00 | b) >>> 0;
        };
        Pixel.getAlpha = function (color) {
            color = color >>> 0;
            return (color >> 24 & 0xFF) >>> 0;
        };
        Pixel.getR = function (color) {
            color = color >>> 0;
            return (color >> 16 & 0xFF) >>> 0;
        };
        Pixel.getG = function (color) {
            color = color >>> 0;
            return (color >> 8 & 0xFF) >>> 0;
        };
        Pixel.getB = function (color) {
            color = color >>> 0;
            return (color & 0xFF) >>> 0;
        };
        Pixel.assembleColor = function (a, r, g, b) {
            a = a >>> 0;
            r = r >>> 0;
            g = g >>> 0;
            b = b >>> 0;
            return (a << 24) + (r << 16) + (g << 8) + b >>> 0;
        };
        /**
         * Converts an HSL color value to RGB. Conversion formula
         * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
         * Assumes h, s, and l are contained in the set [0, 1] and
         * returns uint color
         * see https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
         *
         * @param   Number  h       The hue [0, 1]
         * @param   Number  s       The saturation [0, 1]
         * @param   Number  l       The lightness [0, 1]
         * @return  uint            The RGB representation
         */
        Pixel.assembleColorFromHSB = function (h, s, l) {
            var r, g, b;
            if (s == 0) {
                r = g = b = l; // achromatic
            }
            else {
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = Pixel.hue2rgb(p, q, h + 1 / 3);
                g = Pixel.hue2rgb(p, q, h);
                b = Pixel.hue2rgb(p, q, h - 1 / 3);
            }
            return Pixel.assembleColor(1, Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
        };
        Pixel.hue2rgb = function (p, q, t) {
            if (t < 0)
                t += 1;
            if (t > 1)
                t -= 1;
            if (t < 1 / 6)
                return p + (q - p) * 6 * t;
            if (t < 1 / 2)
                return q;
            if (t < 2 / 3)
                return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        Pixel.read = function (bmd, x, y) {
            return new Pixel(bmd.getPixel32(x, y));
        };
        return Pixel;
    }());
    panda.Pixel = Pixel;
})(panda || (panda = {}));
var panda;
(function (panda) {
    var UniqIdGenerator;
    (function (UniqIdGenerator) {
        var countersMap = new Map();
        function getUniq(reason) {
            if (reason === void 0) { reason = null; }
            var count = countersMap.get(reason);
            if (count === undefined) {
                countersMap.set(reason, 0);
                return 0;
            }
            else {
                var result = count + 1;
                countersMap.set(reason, result);
                return result;
            }
        }
        UniqIdGenerator.getUniq = getUniq;
    })(UniqIdGenerator = panda.UniqIdGenerator || (panda.UniqIdGenerator = {}));
})(panda || (panda = {}));
var panda;
(function (panda) {
    var Utf8Utils;
    (function (Utf8Utils) {
        // https://gist.github.com/joni/3760795
        function toUtf8Array(str) {
            // 29db5131-f47c-41fc-b589-6f03407ca826 ручное кодирование должно быть искорено
            var utf8 = [];
            for (var i = 0; i < str.length; i++) {
                var charcode = str.charCodeAt(i);
                if (charcode < 0x80)
                    utf8.push(charcode);
                else if (charcode < 0x800) {
                    utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
                }
                else if (charcode < 0xd800 || charcode >= 0xe000) {
                    utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
                }
                // surrogate pair
                else {
                    i++;
                    // UTF-16 encodes 0x10000-0x10FFFF by
                    // subtracting 0x10000 and splitting the
                    // 20 bits of 0x0-0xFFFFF into two halves
                    charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
                    utf8.push(0xf0 | (charcode >> 18), 0x80 | ((charcode >> 12) & 0x3f), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
                }
            }
            return utf8;
        }
        Utf8Utils.toUtf8Array = toUtf8Array;
        // https://gist.github.com/joni/3760795
        function fromUtf8Array(data) {
            // 29db5131-f47c-41fc-b589-6f03407ca826 ручное кодирование должно быть искорено
            var utf16Arr = [];
            for (var i = 0; i < data.length; i++) {
                var value = data[i];
                if (value < 0x80) {
                    utf16Arr.push(value);
                }
                else if (value > 0xBF && value < 0xE0) {
                    utf16Arr.push((value & 0x1F) << 6 | data[i + 1] & 0x3F);
                    i += 1;
                }
                else if (value > 0xDF && value < 0xF0) {
                    utf16Arr.push((value & 0x0F) << 12 | (data[i + 1] & 0x3F) << 6 | data[i + 2] & 0x3F);
                    i += 2;
                }
                else {
                    // surrogate pair
                    var charCode = ((value & 0x07) << 18 | (data[i + 1] & 0x3F) << 12 | (data[i + 2] & 0x3F) << 6 | data[i + 3] & 0x3F) - 0x010000;
                    utf16Arr.push(charCode >> 10 | 0xD800, charCode & 0x03FF | 0xDC00);
                    i += 3;
                }
            }
            return String.fromCharCode.apply(String, utf16Arr);
        }
        Utf8Utils.fromUtf8Array = fromUtf8Array;
        function castToString(s) {
            return s == null ? s : '' + s;
        }
        Utf8Utils.castToString = castToString;
    })(Utf8Utils = panda.Utf8Utils || (panda.Utf8Utils = {}));
})(panda || (panda = {}));
var panda;
(function (panda) {
    function safeBind(func, thisArg) {
        var argArray = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            argArray[_i - 2] = arguments[_i];
        }
        return function () {
            var externalArgs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                externalArgs[_i] = arguments[_i];
            }
            return func.apply(thisArg, argArray.concat(externalArgs));
        };
    }
    panda.safeBind = safeBind;
})(panda || (panda = {}));
var panda;
(function (panda) {
    var MainLoop;
    (function (MainLoop) {
        var inited = false;
        var lastTimeStamp = 0;
        var firstTimeStamp = 0;
        var usePerfMonitor = false;
        function init($usePerfMonitor) {
            if (inited) {
                throw new panda.AdvancedError('Attempt to init MainLoop that already inited');
            }
            usePerfMonitor = $usePerfMonitor;
            MainLoop.onEnterFrame = new panda.Signal();
            if (usePerfMonitor) {
                panda.PerfMonitor.init();
            }
            requestAnimationFrame(handler_animationFrame);
            lastTimeStamp = performance.now();
            firstTimeStamp = performance.now();
            inited = true;
        }
        MainLoop.init = init;
        MainLoop.onEnterFrame = null;
        function handler_animationFrame() {
            var now = performance.now();
            var delta = now - lastTimeStamp;
            lastTimeStamp = now;
            // @if PERF
            panda.PerfUtils.event('MainLoop', 'frame');
            // @endif
            MainLoop.onEnterFrame.emit(delta, now - firstTimeStamp, delta);
            requestAnimationFrame(handler_animationFrame);
            panda.GlobalInstanceChecker.check();
            var after = performance.now();
            if (usePerfMonitor) {
                panda.PerfMonitor.enterFrameDispatchingTime(after - now);
            }
        }
        function nextFrameCall(f) {
            var creationTimestamp = lastTimeStamp;
            var listener = MainLoop.onEnterFrame.addListener(function () {
                if (lastTimeStamp != creationTimestamp) {
                    MainLoop.onEnterFrame.removeListener(listener);
                    f();
                }
            });
        }
        MainLoop.nextFrameCall = nextFrameCall;
    })(MainLoop = panda.MainLoop || (panda.MainLoop = {}));
})(panda || (panda = {}));
///ts:ref=ArrayUtils
/// <reference path="../utils/ArrayUtils.ts"/> ///ts:ref:generated
///ts:ref=MainLoop
/// <reference path="./MainLoop.ts"/> ///ts:ref:generated
///ts:ref=PandaHTMLUtils
/// No file or directory matched name "PandaHTMLUtils" ///ts:ref:generated
var panda;
(function (panda) {
    var PerfMonitor;
    (function (PerfMonitor) {
        function init() {
            panda.MainLoop.onEnterFrame.addListener(handler_enterFrame);
            _container = document.createElement('div');
            document.getElementsByTagName('body').item(0).appendChild(_container);
            var style = _container.style;
            style['position'] = 'fixed';
            style['font-size'] = '10px';
            style['color'] = '#000000';
            style['background-color'] = 'lightblue';
            style['font-weight'] = 'bold';
            style['top'] = '0px';
            style['-webkit-touch-callout'] = 'none'; /* iOS Safari */
            style['-webkit-user-select: none'] = 'none'; /* Safari */
            style['-khtml-user-select'] = 'none'; /* Konqueror HTML */
            style['-moz-user-select: none'] = 'none'; /* Firefox */
            style['-ms-user-select'] = 'none'; /* Internet Explorer/Edge */
            style['user-select'] = 'none'; /* Non-prefixed version, currently supported by Chrome and Opera */
            panda.HTMLUtils.setTextContent(_container, 'FPS');
        }
        PerfMonitor.init = init;
        var _container;
        var _framesCounter = 0;
        var _framesDeltas = new Array();
        var _codeDetails = new Array();
        var measuringCount = 1 * 60 * 60; // one minute on 60FPS
        function handler_enterFrame(timeCoef, now, timeDelta) {
            _framesCounter++;
            var fps = 1000 / timeDelta;
            updateCounter(fps);
            var deltas = _framesDeltas;
            deltas.push(timeDelta);
            if (deltas.length > measuringCount) {
                deltas.shift();
            }
        }
        var _introText = null;
        var _avgFps = '';
        var _lasFpsUpdate = 0;
        function updateCounter(fps) {
            var delta = performance.now() - _lasFpsUpdate;
            if (delta >= 500) {
                if (!_introText) {
                    var date = new Date(parseInt(BuildInfo.buildDate));
                    ;
                    _introText = 'Build: ' + BuildInfo.buildNumber + ', ' + date.toLocaleString() + ' FPS: ';
                }
                panda.HTMLUtils.setTextContent(_container, _introText + fps.toFixed(1) + ' AVG: ' + _avgFps);
                _lasFpsUpdate = performance.now();
            }
        }
        function enterFrameDispatchingTime(timeDelta) {
            _codeDetails.push(timeDelta);
            if (_codeDetails.length > measuringCount) {
                _codeDetails.shift();
            }
            var framesDeltas = _framesDeltas;
            var avgCaculated = false;
            if (_framesCounter % 30 == 0) {
                _avgFps = (1000 / panda.ArrayUtils.avg(framesDeltas)).toFixed(2);
                avgCaculated = true;
            }
            if (_framesCounter >= measuringCount) {
                if (!avgCaculated) {
                    _avgFps = (1000 / panda.ArrayUtils.avg(framesDeltas)).toFixed(2);
                }
                var minFps = (1000 / panda.ArrayUtils.max(framesDeltas)).toFixed(2);
                var medFps = (1000 / panda.ArrayUtils.percentile(framesDeltas, 0.5)).toFixed(2);
                var avgTime = panda.ArrayUtils.avg(_codeDetails).toFixed(2);
                var maxTime = panda.ArrayUtils.max(_codeDetails).toFixed(2);
                var medTime = panda.ArrayUtils.percentile(_codeDetails, 0.5).toFixed(2);
                panda.Console.logDebug('AvgFps:', _avgFps, 'MedFps:', medFps, 'MinFps:', minFps, 'AvgCodeMs:', avgTime, 'MaxCodeMs:', maxTime, 'MedCodeMs:', medTime);
                panda.Console.logDebug(JSON.stringify(panda.PerfUtils.storage));
                _framesCounter = 0;
                panda.PerfUtils.storage = {};
            }
        }
        PerfMonitor.enterFrameDispatchingTime = enterFrameDispatchingTime;
    })(PerfMonitor = panda.PerfMonitor || (panda.PerfMonitor = {}));
})(panda || (panda = {}));
var panda;
(function (panda) {
    var TimerSystem = /** @class */ (function () {
        function TimerSystem() {
            var _this = this;
            this.numTimers = 0;
            this._callbackArray = [];
            this._callbackArrayTail = [];
            this._skipSet = new Set();
            this._inTick = false;
            this._lastTickTime = 0;
            this._objPool = [];
            this._idCounter = 1000;
            window['setTimeout'] = function () {
                _this.numTimers++;
                // @ts-ignore
                var rawArgs = arguments;
                var rawArgsLength = rawArgs.length;
                var gram;
                if (rawArgsLength == 2) {
                    gram = _this.getGram(rawArgs[0], rawArgs[1], null);
                }
                else if (rawArgsLength == 1) {
                    gram = _this.getGram(rawArgs[0], 0, null);
                }
                else {
                    var restArgs = [];
                    for (var i = 2; i < rawArgsLength; i++) {
                        restArgs[i - 2] = rawArgs[i];
                    }
                    gram = _this.getGram(rawArgs[0], rawArgs[1], restArgs);
                }
                if (_this._inTick) {
                    _this._callbackArrayTail.push(gram);
                }
                else {
                    _this._callbackArray.push(gram);
                }
                return gram.id;
            };
            window['clearTimeout'] = function (timeoutID) {
                _this._skipSet.add(timeoutID);
            };
        }
        TimerSystem.init = function () {
            if (this.instance) {
                throw new panda.AdvancedError('double TimerSystem.init()');
            }
            this.instance = new TimerSystem();
        };
        TimerSystem.tick = function (millisecondsAbsolute) {
            if (TimerSystem.instance) {
                this.instance.tick(millisecondsAbsolute);
            }
        };
        TimerSystem.prototype.getGram = function (func, time, restArgs) {
            var gram;
            if (this._objPool.length) {
                gram = this._objPool.pop();
            }
            else {
                gram = Object.create(null);
            }
            gram.func = func;
            gram.time = time + this._lastTickTime;
            gram.id = this._idCounter++;
            gram.args = restArgs;
            return gram;
        };
        TimerSystem.prototype.poolGram = function (gram) {
            this.clearGram(gram);
            this._objPool.push(gram);
        };
        TimerSystem.prototype.clearGram = function (gram) {
            gram.func = null;
            gram.time = 0;
            gram.id = 0;
            gram.args = null;
        };
        TimerSystem.prototype.tick = function (millisecondsAbsolute) {
            this._inTick = true;
            this._lastTickTime = millisecondsAbsolute;
            var j = 0;
            var callbackArray = this._callbackArray;
            for (var i = 0; i < callbackArray.length; i++) {
                var gram = callbackArray[i];
                var skip = this._skipSet.has(gram.id);
                var call = gram.time < millisecondsAbsolute;
                if (skip) {
                    this.poolGram(gram);
                }
                else if (call) {
                    gram.func.apply(window, gram.args);
                    this.poolGram(gram);
                }
                else {
                    callbackArray[j] = gram;
                    j++;
                }
            }
            callbackArray.length = j;
            for (var _i = 0, _a = this._callbackArrayTail; _i < _a.length; _i++) {
                var gram = _a[_i];
                callbackArray.push(gram);
            }
            this._callbackArrayTail.length = 0;
            this._skipSet.clear();
            // if (((millisecondsAbsolute % 10) | 0) == 0) {
            //     PandaConsole.logDebug(`numTimers: ${this.numTimers}`);
            // }
            this.numTimers = 0;
            this._inTick = false;
        };
        TimerSystem.instance = null;
        return TimerSystem;
    }());
    panda.TimerSystem = TimerSystem;
})(panda || (panda = {}));
///ts:ref=WebGLUtils
/// <reference path="./WebGLUtils.ts"/> ///ts:ref:generated
///ts:ref=Console
/// <reference path="../console/Console.ts"/> ///ts:ref:generated
///ts:ref=BrowserSpecific
/// <reference path="../browser/BrowserSpecific.ts"/> ///ts:ref:generated
var panda;
(function (panda) {
    var WebGLDescriber = /** @class */ (function () {
        function WebGLDescriber(context) {
            this.videoCard = 'unknown';
            this.officiallySupported = false;
            this.supported = false;
            this.version = 'unknown';
            this.shadingVesion = 'unknown';
            this.maxVertexAttributes = 0;
            this.maxVertexUniformVectors = 0;
            this.maxVertexTextureImageUnits = 0;
            this.maxVaryingVectors = 0;
            this.aliasedLineWidthRange = { '0': 0, '1': 0 };
            this.aliasedPointSizeRange = { '0': 0, '1': 0 };
            this.maxFragmentUniformVectors = 0;
            this.maxTextureImageUnits = 0;
            this.redBits = 0;
            this.greenBits = 0;
            this.blueBits = 0;
            this.alphaBits = 0;
            this.depthBits = 0;
            this.stencilBits = 0;
            this.maxRenderbufferSize = 0;
            this.maxViewportDims = { '0': 0, '1': 0 };
            this.maxTextureSize = 0;
            this.maxCubeMapTextureSize = 0;
            this.maxCombinedTextureImageUnits = 0;
            this.attributesAlpha = false;
            this.attributesAntialias = false;
            this.attributesDepth = false;
            this.attributesPremultipliedAlpha = false;
            this.attributesPreserveDrawingBuffer = false;
            this.attributesStencil = false;
            this.majorPerformanceCaveat = 'unknown';
            this.supportedExtensionsHash = {};
            this.shaderPrecisionFormats = new ShaderPrecisionFormats();
            panda.Console.here;
            try {
                this.officiallySupported = !!window['WebGLRenderingContext'];
                if (!context) {
                    return;
                }
                this.detectVieoCard();
                this.version = context.getParameter(context.VERSION);
                this.shadingVesion = context.getParameter(context.SHADING_LANGUAGE_VERSION);
                this.maxVertexAttributes = context.getParameter(context.MAX_VERTEX_ATTRIBS);
                this.maxVertexUniformVectors = context.getParameter(context.MAX_VERTEX_UNIFORM_VECTORS);
                this.maxVertexTextureImageUnits = context.getParameter(context.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
                this.maxVaryingVectors = context.getParameter(context.MAX_VARYING_VECTORS);
                this.aliasedLineWidthRange = context.getParameter(context.ALIASED_LINE_WIDTH_RANGE);
                this.aliasedPointSizeRange = context.getParameter(context.ALIASED_POINT_SIZE_RANGE);
                this.maxFragmentUniformVectors = context.getParameter(context.MAX_FRAGMENT_UNIFORM_VECTORS);
                this.maxTextureImageUnits = context.getParameter(context.MAX_TEXTURE_IMAGE_UNITS);
                this.redBits = context.getParameter(context.RED_BITS);
                this.greenBits = context.getParameter(context.GREEN_BITS);
                this.blueBits = context.getParameter(context.BLUE_BITS);
                this.alphaBits = context.getParameter(context.ALPHA_BITS);
                this.depthBits = context.getParameter(context.DEPTH_BITS);
                this.stencilBits = context.getParameter(context.STENCIL_BITS);
                this.maxRenderbufferSize = context.getParameter(context.MAX_RENDERBUFFER_SIZE);
                this.maxViewportDims = context.getParameter(context.MAX_VIEWPORT_DIMS);
                this.maxTextureSize = context.getParameter(context.MAX_TEXTURE_SIZE);
                this.maxCubeMapTextureSize = context.getParameter(context.MAX_CUBE_MAP_TEXTURE_SIZE);
                this.maxCombinedTextureImageUnits = context.getParameter(context.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
                var attributes = context.getContextAttributes();
                this.attributesAlpha = attributes.alpha;
                this.attributesDepth = attributes.depth;
                this.attributesStencil = attributes.stencil;
                this.attributesAntialias = attributes.antialias;
                this.attributesPremultipliedAlpha = attributes.premultipliedAlpha;
                this.attributesPreserveDrawingBuffer = attributes.preserveDrawingBuffer;
                this.majorPerformanceCaveat = this.getMajorPerformanceCaveat();
                this.detectShaderPrecisionFormat();
                var supportedExtensions = context.getSupportedExtensions();
                for (var _i = 0, supportedExtensions_1 = supportedExtensions; _i < supportedExtensions_1.length; _i++) {
                    var extension = supportedExtensions_1[_i];
                    this.supportedExtensionsHash[extension] = true;
                }
                this.supported = true;
            }
            catch (e) {
                panda.Console.errorUncritical(e);
            }
        }
        WebGLDescriber.getInfo = function () {
            if (!this._info) {
                this._info = new WebGLDescriber(panda.WebGLUtils.getDummyContext());
            }
            return this._info;
        };
        WebGLDescriber.prototype.getMajorPerformanceCaveat = function () {
            //let canvas = $('<canvas />', { width : '1', height : '1' }).appendTo('body');
            var canvas = document.createElement('canvas');
            var opts = { failIfMajorPerformanceCaveat: true };
            var context = (canvas.getContext("webgl", opts) || canvas.getContext("experimental-webgl", opts));
            if (!context) {
                return 'yes';
            }
            if (context.getContextAttributes().failIfMajorPerformanceCaveat === undefined) {
                // If getContextAttributes() doesn't include the failIfMajorPerformanceCaveat
                // property, assume the browser doesn't implement it yet.
                return 'not_supported';
            }
            return 'no';
        };
        WebGLDescriber.prototype.detectVieoCard = function () {
            panda.Console.here;
            try {
                var context = panda.WebGLUtils.getDummyContext();
                var extension = panda.WebGLUtils.getExtension(context, panda.WebGLUtils.optionalExtensions.WEBGL_debug_renderer_info);
                if (!extension) {
                    this.videoCard = 'detecting disabled';
                    return;
                }
                this.videoCard = context.getParameter(extension.UNMASKED_RENDERER_WEBGL);
            }
            catch (e) {
                panda.Console.errorUncritical(e);
                this.videoCard = 'detecting error';
            }
        };
        WebGLDescriber.prototype.detectShaderPrecisionFormat = function () {
            var context = panda.WebGLUtils.getDummyContext();
            this.shaderPrecisionFormats.vlf = this.getDescibedShaderPrecisionFormat(context.VERTEX_SHADER, context.LOW_FLOAT);
            this.shaderPrecisionFormats.vmf = this.getDescibedShaderPrecisionFormat(context.VERTEX_SHADER, context.MEDIUM_FLOAT);
            this.shaderPrecisionFormats.vhf = this.getDescibedShaderPrecisionFormat(context.VERTEX_SHADER, context.HIGH_FLOAT);
            this.shaderPrecisionFormats.vli = this.getDescibedShaderPrecisionFormat(context.VERTEX_SHADER, context.LOW_INT);
            this.shaderPrecisionFormats.vmi = this.getDescibedShaderPrecisionFormat(context.VERTEX_SHADER, context.MEDIUM_INT);
            this.shaderPrecisionFormats.vhi = this.getDescibedShaderPrecisionFormat(context.VERTEX_SHADER, context.HIGH_INT);
            this.shaderPrecisionFormats.flf = this.getDescibedShaderPrecisionFormat(context.FRAGMENT_SHADER, context.LOW_FLOAT);
            this.shaderPrecisionFormats.fmf = this.getDescibedShaderPrecisionFormat(context.FRAGMENT_SHADER, context.MEDIUM_FLOAT);
            this.shaderPrecisionFormats.fhf = this.getDescibedShaderPrecisionFormat(context.FRAGMENT_SHADER, context.HIGH_FLOAT);
            this.shaderPrecisionFormats.fli = this.getDescibedShaderPrecisionFormat(context.FRAGMENT_SHADER, context.LOW_INT);
            this.shaderPrecisionFormats.fmi = this.getDescibedShaderPrecisionFormat(context.FRAGMENT_SHADER, context.MEDIUM_INT);
            this.shaderPrecisionFormats.fhi = this.getDescibedShaderPrecisionFormat(context.FRAGMENT_SHADER, context.HIGH_INT);
        };
        WebGLDescriber.prototype.getDescibedShaderPrecisionFormat = function (shaderType, precisionType) {
            var context = panda.WebGLUtils.getDummyContext();
            var shpf = context.getShaderPrecisionFormat(context.VERTEX_SHADER, context.LOW_FLOAT);
            return { rangeMin: shpf.rangeMin, rangeMax: shpf.rangeMax, precision: shpf.precision };
        };
        WebGLDescriber.prototype.toString = function () {
            return JSON.stringify(this, null, 4);
        };
        return WebGLDescriber;
    }());
    panda.WebGLDescriber = WebGLDescriber;
    var ShaderPrecisionFormats = /** @class */ (function () {
        function ShaderPrecisionFormats() {
        }
        return ShaderPrecisionFormats;
    }());
    panda.ShaderPrecisionFormats = ShaderPrecisionFormats;
})(panda || (panda = {}));
var panda;
(function (panda) {
    var WebGlBufferWrapper = /** @class */ (function () {
        function WebGlBufferWrapper() {
            this.buffer = null;
            this.itemSize = 0;
            this.length = 0;
            this.name = '';
        }
        return WebGlBufferWrapper;
    }());
    panda.WebGlBufferWrapper = WebGlBufferWrapper;
})(panda || (panda = {}));
//# sourceMappingURL=panda.js.map