"use strict";

const unique = (value, index, self) => {
  return self.indexOf(value) === index;
};

const addSideeffect = (t, path, source, insert) => {
  const statement = t.importDeclaration([], t.stringLiteral(source));
  if (insert === "after") path.insertAfter(statement);
  else path.insertBefore(statement);
};

const isMatch = (pattern, source) => new RegExp(pattern).test(source);

const makeCompile =
  ({ source, scope, package: pkgName, specifier }) =>
  (mapping) => {
    if (typeof mapping === "string")
      return mapping
        .replace("[*]", source)
        .replace("[scope]", scope)
        .replace("[package]", pkgName)
        .replace("[specifier]", specifier);
    if (typeof mapping === "function")
      return mapping({
        source,
        scope,
        package: pkgName,
        specifier,
      });
    throw (
      "Type of " +
      typeof mapping +
      "is not supported as a mapping value. Must be either string, function or an array of those."
    );
  };

const makeApplySideeffect =
  (t, path, specifiers, source, sideEffects, scope, pkgName, insert) =>
  (pattern) => {
    if (!isMatch(pattern, source)) return;

    specifiers
      .reduce((prev, current) => {
        const specifierName = current.local.name;
        const compile = makeCompile({
          source,
          scope,
          package: pkgName,
          specifier: specifierName,
        });
        const mapping = sideEffects[pattern];

        return [
          ...prev,
          ...(Array.isArray(mapping)
            ? mapping.map(compile)
            : [compile(mapping)]),
        ];

        return prev;
      }, [])
      .filter(Boolean)
      .filter(unique)
      .forEach((mapping) => {
        addSideeffect(t, path, mapping, insert);
      });
  };

const plugin = ({ types: t }) => {
  return {
    visitor: {
      ImportDeclaration(
        path,
        { opts: { sideEffects = {}, insert = "before" } = {} } = {}
      ) {
        if (path.node.specifiers.length === 0)
          /* skip sideeffect imports to prevent infinite loops */ return;

        const source = path.node.source.value;
        const scope = source.startsWith("@") ? source.split("/")[0] : "";
        const pkgName = source.startsWith("@")
          ? source.split("/")[1]
          : source.split("/")[0];
        const specifiers = path.node.specifiers;

        const applySideeffect = makeApplySideeffect(
          t,
          path,
          specifiers,
          source,
          sideEffects,
          scope,
          pkgName,
          insert
        );

        Object.keys(sideEffects).forEach(applySideeffect);
      },
    },
  };
};

exports.default = plugin;
