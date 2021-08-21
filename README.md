# cpanfile-regexp

cpanfile regexp in node

```js
const cpanfile = `
# https://github.com/miyagawa/cpanfile/blob/5e89c54bb388402db3a0bb61a44de875860df3d1/cpanfile
requires 'CPAN::Meta', 2.12091;
requires 'CPAN::Meta::Prereqs', 2.12091;
requires 'parent';

recommends 'Pod::Usage';

on test => sub {
    requires 'Test::More', 0.88;
    requires 'File::pushd';
};
`;
```

```
console.log(
  [...cpanfile.matchAll(new RegExp(r(moduleStatements, or, comment), 'g'))].map(statement => [...statement])
);
```

`=>`

```js
[
  [
    '# https://github.com/miyagawa/cpanfile/blob/5e89c54bb388402db3a0bb61a44de875860df3d1/cpanfile\n',
    undefined
  ],
  [
    "requires 'CPAN::Meta', 2.12091;",
    "requires 'CPAN::Meta', 2.12091;"
  ],
  [
    "requires 'CPAN::Meta::Prereqs', 2.12091;",
    "requires 'CPAN::Meta::Prereqs', 2.12091;"
  ],
  [
    "requires 'parent';",
    "requires 'parent';"
  ],
  [
    "recommends 'Pod::Usage';",
    "recommends 'Pod::Usage';"
  ],
  [
    "requires 'Test::More', 0.88;",
    "requires 'Test::More', 0.88;"
  ],
  [
    "requires 'File::pushd';",
    "requires 'File::pushd';"
  ]
]
```

---

```
console.log(
  [...cpanfile.matchAll(cpanfileRegExp)].map(statement => statement.filter(fragment => fragment))
);
```

`=>`

```js
[
  [
    '\n' +
      '# https://github.com/miyagawa/cpanfile/blob/5e89c54bb388402db3a0bb61a44de875860df3d1/cpanfile\n'
  ],
  [
    "requires 'CPAN::Meta', 2.12091;",
    "requires 'CPAN::Meta', 2.12091;"
  ],
  [
    "\nrequires 'CPAN::Meta::Prereqs', 2.12091;",
    "requires 'CPAN::Meta::Prereqs', 2.12091;"
  ],
  [
    "\nrequires 'parent';",
    "requires 'parent';"
  ],
  [
    "\n\nrecommends 'Pod::Usage';",
    "recommends 'Pod::Usage';"
  ],
  [
    '\n' +
      '\n' +
      'on test => sub {\n' +
      "    requires 'Test::More', 0.88;\n" +
      "    requires 'File::pushd';\n" +
      '};',
    "requires 'File::pushd';"
  ]
]
```
