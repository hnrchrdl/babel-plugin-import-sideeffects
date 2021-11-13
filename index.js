"use strict";

const arrayify = (a) => (Array.isArray(a) ? a : [a]);
const addSideeffect = (t, path, source) => {
  path.insertBefore(t.importDeclaration([], t.stringLiteral(newSource)));
};
const isMatch = (pattern, source) => new RegExp(pattern).test(source);
const plugin = ({ types: t }) => {
  return {
    visitor: {
      ImportDeclaration(path, state = {}) {
        const source = path.node.source.value;
        Object.keys(state).forEach((pattern) => {
          if (isMatch(pattern, source)) {
            path.stop();
            arrayify(state[pattern]).forEach((sideEffectSource) => {
              addSideeffect(t, path, sideEffectSource.replace("[*]", source));
            });
          }
        });
      },
    },
  };
};

exports.default = plugin;
