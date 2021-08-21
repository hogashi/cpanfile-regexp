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
var moduleNameVersion = r(moduleName, comma, version);
var moduleOrmoduleNameVersion = r(moduleName, or, moduleNameVersion);
var makeModuleStatement = function (name) {
    return r(sp, new RegExp(name), sp, moduleOrmoduleNameVersion, el);
};
var requires = makeModuleStatement('requires');
var author_requires = makeModuleStatement('author_requires');
var configureRequires = makeModuleStatement('configureRequires');
var test_requires = makeModuleStatement('test_requires');
var conflicts = makeModuleStatement('conflicts');
var recommends = makeModuleStatement('recommends');
var moduleStatements = r(requires, or, author_requires, or, configureRequires, or, test_requires, or, conflicts, or, recommends);
var comment = r(sp, /#[^\n]+\n/);
var sub = r(sp, /sub\s*\{/, rrepeat(r(sp, r(moduleStatements, or, comment), sp), '*'), /\}/, el);
var on = r(sp, /on/, sp, phase, comma, sub, el);
var cpanfileRegExp = new RegExp(r(moduleStatements, or, on, or, comment), 'g');
