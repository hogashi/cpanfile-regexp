// 便利関数たち
/** `/foo?\nbar/` から `"foo?\\nbar"` をつくる */
var regExpToString = function (regExp) {
    return regExp.toString().slice(1, -1);
};
/**
 * 複数の正規表現を組み合わせてひとつの正規表現にする(まとめてグループ化される(キャプチャなし))
 * - `r(/foo?\nbar/, /|/, /(baz)*\s/)` --> `/(?:foo?\nbar|(baz)*\s)/`
 */
var r = function () {
    var patterns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        patterns[_i] = arguments[_i];
    }
    return new RegExp([
        '(?:',
        patterns.map(function (pattern) { return regExpToString(pattern); }).join(''),
        ')',
    ].join(''));
};
/**
 * `r()` のキャプチャあり版
 * - `rcapture(/foo?\nbar/, /|/, /(baz)*\s/)` --> `/((?:foo?\nbar|(baz)*\s))/`
 * - `r()` を使うので内側に1つグループを余計につくる(内側のはキャプチャなしなので意味はない)
 */
var rcapture = function () {
    var patterns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        patterns[_i] = arguments[_i];
    }
    return new RegExp("(" + regExpToString(r.apply(void 0, patterns)) + ")");
};
/**
 * 正規表現の末尾に繰り返し記号をつける
 * - `rrepeat(/foo/, '?')` --> `/foo?/`
 * - `rrepeat(/b(ar)/, '+')` --> `/b(ar)+/`
 */
var rrepeat = function (pattern, repeatStr) {
    return new RegExp(regExpToString(pattern) + repeatStr);
};
// パターンたち
var or = /|/;
/** クオート */
var q = /['"]/;
/** クオート以外の連続1個以上 */
var nqs = /[^'"]+/;
/** 空白文字の連続0個以上 */
var sp = /\s*/;
/** Perlの文の終了(セミコロンとその前の空白文字) */
var el = r(sp, /;/);
/** モジュール名(クオートないことがある(ファットカンマのときとか)) */
var moduleName = r(nqs, or, q, nqs, q);
/** onにつくphase名(クオートないことがある(ファットカンマのときとか)) */
var phase = r(nqs, or, q, nqs, q);
/** バージョンの指定(数字) */
var versionNum = /[0-9.]+/;
/** バージョンの指定(文字列( `'> 0.5.0, < 1.0.0'` のようなこともある)) */
var versionStr = r(q, nqs, q);
/** バージョンの指定(数字か文字列) */
var version = r(versionNum, or, versionStr);
/** カンマかファットカンマ(とその前後の空白文字) */
var comma = r(sp, /(?:,|=>)/, sp);
/** モジュール名だけ, またはモジュール名とバージョン指定 */
var moduleOrmoduleNameVersion = r(moduleName, rrepeat(r(comma, version), '?'));
/** モジュールの指定の文(種類がいろいろある) */
var moduleStatements = rcapture(/(?:requires|author_requires|configureRequires|test_requires|conflicts|recommends)/, sp, moduleOrmoduleNameVersion, el);
/** コメント文 */
var comment = /#[^\n]*(?:\n|$)/;
/** サブルーチン(中にモジュールの指定の文が0個以上入る) */
var sub = r(/sub\s*\{/, rrepeat(r(sp, r(moduleStatements, or, comment)), '*'), /\s*\}/);
/** on(phaseとsubが指定されてセミコロンが続く) */
var on = r(/on/, sp, phase, comma, sub, el);
/**
 * cpanfileに対して全体を見れる正規表現
 * - 地べたの文とonがひとつずつ取れる
 */
var cpanfileRegExp = new RegExp(r(sp, r(moduleStatements, or, on, or, comment)), 'g');
