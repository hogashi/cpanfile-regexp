const regExpToString = (regExp: RegExp): string =>
  regExp.toString().slice(1, -1);
const r = (...patterns: RegExp[]): RegExp => {
  return new RegExp(
    [
      '(?:',
      patterns.map((pattern) => regExpToString(pattern)).join(''),
      ')',
    ].join('')
  );
};
const rg = (...patterns: RegExp[]): RegExp => {
  return new RegExp(`(${regExpToString(r(...patterns))})`);
};
/** rrepeat(/a/, '+') => /a+/ */
const rrepeat = (pattern: RegExp, repeatStr: string): RegExp =>
  new RegExp(regExpToString(pattern) + repeatStr);

// regexp patterns
const or = /|/;
const q = /['"]/;
const nqs = /[^'"]+/;
const sp = /\s*/;
const el = r(sp, /;/);
const moduleName = r(nqs, or, q, nqs, q);
const phase = r(nqs, or, q, nqs, q);
const versionNum = /[0-9.]+/;
const versionStr = r(q, nqs, q);
const version = r(versionNum, or, versionStr);
const comma = r(sp, /(?:,|=>)/, sp);
const moduleOrmoduleNameVersion = r(
  moduleName,
  rrepeat(r(comma, version), '?')
);
const moduleStatements = rg(
  /(?:requires|author_requires|configureRequires|test_requires|conflicts|recommends)/,
  sp,
  moduleOrmoduleNameVersion,
  el
);
const comment = /#[^\n]*(\n|$)/;
const sub = r(
  /sub\s*\{/,
  rrepeat(r(sp, r(moduleStatements, or, comment)), '*'),
  /\s*\}/
);
const on = r(/on/, sp, phase, comma, sub, el);
const cpanfileRegExp = new RegExp(
  r(sp, r(moduleStatements, or, on, or, comment)),
  'g'
);
