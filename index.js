var regExpToString = function (regExp) {
    return regExp.toString().slice(1, -1);
};
var r = function () {
    var patterns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        patterns[_i] = arguments[_i];
    }
    return new RegExp([
        '(',
        patterns.map(function (pattern) { return regExpToString(pattern); }).join(''),
        ')',
    ].join(''));
};
/** rrepeat(/a/, '+') => /a+/ */
var rrepeat = function (pattern, repeatStr) {
    return new RegExp(regExpToString(pattern) + repeatStr);
};
// regexp patterns
var or = /|/;
var q = /['"]/;
var nqs = /[^'"]+/;
var sp = /\s*/;
var el = r(sp, /;/, sp);
var moduleName = r(nqs, or, q, nqs, q);
var phase = r(nqs, or, q, nqs, q);
var versionNum = /[0-9.]+/;
var versionStr = r(q, nqs, q);
var version = r(versionNum, or, versionStr);
var comma = r(sp, /(?:,|=>)/, sp);
var moduleOrmoduleNameVersion = r(moduleName, rrepeat(r(comma, version), '?'));
var moduleStatements = r(/(?:requires|author_requires|configureRequires|test_requires|conflicts|recommends)/, sp, moduleOrmoduleNameVersion, el);
var comment = /#[^\n]*(\n|$)/;
var sub = r(/sub\s*\{/, rrepeat(r(sp, moduleStatements, or, comment), '*'), /\s*\}/);
var on = r(/on/, sp, phase, comma, sub, el);
var cpanfileRegExp = new RegExp(r(sp, r(moduleStatements, or, on, or, comment)), 'g');
