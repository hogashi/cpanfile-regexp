const regExpToString = (regExp: RegExp): string =>
  regExp.toString().slice(1, -1);
const r = (...patterns: RegExp[]): RegExp => {
  return new RegExp(
    [
      '(',
      patterns.map((pattern) => regExpToString(pattern)).join(''),
      ')',
    ].join('')
  );
};
/** rrepeat(/a/, '+') => /a+/ */
const rrepeat = (pattern: RegExp, repeatStr: string): RegExp =>
  new RegExp(regExpToString(pattern) + repeatStr);

// regexp patterns
const or = /|/;
const q = /['"]/;
const nqs = /[^'"]+/;
const sp = /\s*/;
const el = r(sp, /;/, sp);
const moduleName = r(nqs, or, q, nqs, q);
const phase = r(nqs, or, q, nqs, q);
const versionNum = /[0-9.]+/;
const versionStr = r(q, nqs, q);
const version = r(versionNum, or, versionStr);
const comma = r(sp, /(?:,|=>)/, sp);
const moduleOrmoduleNameVersion = r(moduleName, rrepeat(r(comma, version), '?'));
const moduleStatements = r(
  sp,
  /(?:requires|author_requires|configureRequires|test_requires|conflicts|recommends)/,
  sp,
  moduleOrmoduleNameVersion,
  el
);
const comment = r(sp, /#[^\n]*\n/);
const sub = r(
  sp,
  /sub\s*\{/,
  rrepeat(r(sp, r(moduleStatements, or, comment), sp), '*'),
  /\}/,
  el
);
const on = r(sp, /on/, sp, phase, comma, sub, el);
const cpanfileRegExp = new RegExp(
  r(moduleStatements, or, on, or, comment),
  'g'
);
