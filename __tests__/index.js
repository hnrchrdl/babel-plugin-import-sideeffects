const plugin = require("../").default;
const pluginTester = require("babel-plugin-tester").default;

pluginTester({
  plugin,
  title: "basic usage",
  snapshot: false,
  tests: [
    {
      title: "unchanged with no options",
      code: `
        import component from "my-component-library";
      `,
      output: `
        import component from "my-component-library";
      `,
    },
    {
      title: "preprends sideeffect import with exact match",
      pluginOptions: {
        sideEffects: {
          "my-component-library": "my-component-library/styles.css",
        },
      },
      code: `
        import component from "my-component-library";
      `,
      output: `
        import "my-component-library/styles.css";
        import component from "my-component-library";
      `,
    },
    {
      title: "preprends sideeffect import with partial match",
      pluginOptions: {
        sideEffects: {
          "component-library": "my-component-library/styles.css",
        },
      },
      code: `
        import component from "my-component-library";
      `,
      output: `
        import "my-component-library/styles.css";
        import component from "my-component-library";
      `,
    },
    {
      title: "preprends sideeffect import with partial match 2",
      pluginOptions: {
        sideEffects: {
          "my-component-library": "my-component-library/styles.css",
        },
      },
      code: `
        import component from "my-component-library/some-path";
      `,
      output: `
        import "my-component-library/styles.css";
        import component from "my-component-library/some-path";
      `,
    },
    {
      title: "preprends sideeffect import with partial match 3",
      pluginOptions: {
        sideEffects: {
          "^@scope": "[*]/styles.css",
        },
      },
      code: `
        import component from "@scope/my-component-library";
      `,
      output: `
        import "@scope/my-component-library/styles.css";
        import component from "@scope/my-component-library";
      `,
    },
    {
      title: "unchanged if code matches partially",
      pluginOptions: {
        sideEffects: {
          "my-component-library": "my-component-library/styles.css",
        },
      },
      code: `
        import component from "component-library";
      `,
      output: `
        import component from "component-library";
      `,
    },
    {
      title: "multiple sideeffects per import",
      pluginOptions: {
        sideEffects: {
          "my-component-library": ["sideeffect1", "sideeffect2", "sideeffect3"],
        },
      },
      code: `
        import component from "my-component-library";
      `,
      output: `
        import "sideeffect1";
        import "sideeffect2";
        import "sideeffect3";
        import component from "my-component-library";
      `,
    },
    {
      title: "preprends sideeffect import with source replacement",
      pluginOptions: {
        sideEffects: {
          "my-component-library": "[*]/styles.css",
        },
      },
      code: `
        import component from "my-component-library";
      `,
      output: `
        import "my-component-library/styles.css";
        import component from "my-component-library";
      `,
    },
    {
      title:
        "preprends sideeffect import with source replacement including path",
      pluginOptions: {
        sideEffects: {
          "my-component-library": "[*]/styles.css",
        },
      },
      code: `
        import component from "my-component-library/some-path";
      `,
      output: `
        import "my-component-library/some-path/styles.css";
        import component from "my-component-library/some-path";
      `,
    },
    {
      title: "replace import specifiers and package",
      pluginOptions: {
        sideEffects: {
          "my-component-library": "[package]/dist/[specifier]/styles.css",
        },
      },
      code: `
        import { Component } from "my-component-library";
      `,
      output: `
        import "my-component-library/dist/Component/styles.css";
        import { Component } from "my-component-library";
      `,
    },
    {
      title: "replace import specifiers, package and scope",
      pluginOptions: {
        sideEffects: {
          "@scope/my-component-library":
            "[scope]/[package]/dist/[specifier]/styles.css",
        },
      },
      code: `
        import { Component } from "@scope/my-component-library";
      `,
      output: `
        import "@scope/my-component-library/dist/Component/styles.css";
        import { Component } from "@scope/my-component-library";
      `,
    },
    {
      title:
        "replace import specifiers, package and scope for multiple import specifiers",
      pluginOptions: {
        sideEffects: {
          "@scope/my-component-library":
            "[scope]/[package]/dist/[specifier]/styles.css",
        },
      },
      code: `
        import { Component, Example } from "@scope/my-component-library";
      `,
      output: `
        import "@scope/my-component-library/dist/Component/styles.css";
        import "@scope/my-component-library/dist/Example/styles.css";
        import { Component, Example } from "@scope/my-component-library";
      `,
    },
    {
      title: "multiple import statements",
      pluginOptions: {
        sideEffects: {
          "my-component-library1": "[*]/styles.css",
          "my-component-library2": "[*]/styles.css",
        },
      },
      code: `
        import component1 from "my-component-library1";
        import component2 from "my-component-library2";
      `,
      output: `
        import "my-component-library1/styles.css";
        import component1 from "my-component-library1";
        import "my-component-library2/styles.css";
        import component2 from "my-component-library2";
      `,
    },
    {
      title: "multiple imports regexp support",
      pluginOptions: {
        sideEffects: {
          "@scope/(component1|component2)": "[*]/styles.css",
        },
      },
      code: `
        import component1 from "@scope/component1";
        import component2 from "@scope/component2";
        import component3 from "@scope/component3";
      `,
      output: `
        import "@scope/component1/styles.css";
        import component1 from "@scope/component1";
        import "@scope/component2/styles.css";
        import component2 from "@scope/component2";
        import component3 from "@scope/component3";
      `,
    },
    {
      title: "function expression support",
      pluginOptions: {
        sideEffects: {
          "@scope/components$": ({ source, specifier }) => {
            return `${source}/dist/${specifier}/styles.css`;
          },
        },
      },
      code: `
        import { Component1, Component2 } from "@scope/components";
      `,
      output: `
        import "@scope/components/dist/Component1/styles.css";
        import "@scope/components/dist/Component2/styles.css";
        import { Component1, Component2 } from "@scope/components";
      `,
    },
    {
      title: "function expression support 2",
      pluginOptions: {
        sideEffects: {
          "@scope/components$": ({ scope, package: pkgName, specifier }) => {
            return `${scope}/${pkgName}/dist/${specifier}/styles.css`;
          },
        },
      },
      code: `
        import { Component1, Component2 } from "@scope/components";
      `,
      output: `
        import "@scope/components/dist/Component1/styles.css";
        import "@scope/components/dist/Component2/styles.css";
        import { Component1, Component2 } from "@scope/components";
      `,
    },
    {
      title: "multiple imports regexp support with multiple named exports",
      pluginOptions: {
        sideEffects: {
          "@reach/(accordion|checkbox)": "[*]/styles.css",
        },
      },
      code: `
        import { Accordion,  AccordionItem,  AccordionButton,  AccordionPanel,} from "@reach/accordion";
        import { CustomCheckbox,  CustomCheckboxContainer,  CustomCheckboxInput } from "@reach/checkbox";
      `,
      output: `
        import "@reach/accordion/styles.css";
        import {
          Accordion,
          AccordionItem,
          AccordionButton,
          AccordionPanel,
        } from "@reach/accordion";
        import "@reach/checkbox/styles.css";
        import {
          CustomCheckbox,
          CustomCheckboxContainer,
          CustomCheckboxInput,
        } from "@reach/checkbox";
      `,
    },
    {
      title: "multiple imports regexp support with multiple named exports",
      pluginOptions: {
        sideEffects: {
          "@reach/(accordion|checkbox)": "[*]/styles.css",
        },
        insert: "after",
      },
      code: `
        import { Accordion,  AccordionItem,  AccordionButton,  AccordionPanel,} from "@reach/accordion";
        import { CustomCheckbox,  CustomCheckboxContainer,  CustomCheckboxInput } from "@reach/checkbox";
      `,
      output: `
        import {
          Accordion,
          AccordionItem,
          AccordionButton,
          AccordionPanel,
        } from "@reach/accordion";
        import "@reach/accordion/styles.css";
        import {
          CustomCheckbox,
          CustomCheckboxContainer,
          CustomCheckboxInput,
        } from "@reach/checkbox";
        import "@reach/checkbox/styles.css";
      `,
    },
  ],
});

const snapShotTests = [
  {
    code: `
import { Accordion,  AccordionItem,  AccordionButton,  AccordionPanel } from "@reach/accordion";
  `,
    pluginOptions: {
      sideEffects: {
        "^@reach/(accordion|checkbox)$": "[*]/style.css",
      },
    },
  },
  {
    code: `
import { Component1, Component2 } from 'my-awesome-library'
  `,
    pluginOptions: {
      sideEffects: {
        "^my-awesome-library$": [
          "[package]/global.css",
          "[package]/[specifier]/style.css",
        ],
      },
    },
  },
  {
    code: `
import Component1 from 'my-awesome-library/component1'
import Component2 from 'my-awesome-library/component2'

  `,
    pluginOptions: {
      sideEffects: {
        "^my-awesome-library": ["[*]/style.css"],
      },
    },
  },
  {
    code: `
import { Component } from '@my-scope/my-awesome-library'
  `,
    pluginOptions: {
      sideEffects: {
        "^@my-scope/my-awesome-library$": ({
          scope,
          package: pkgName,
          specifier,
        }) => `${scope}/${pkgName}/dist/${specifier.toLowerCase()}/styles.css`,
      },
      insert: "after",
    },
  },
  {
    code: `
import component1 from "@scope/component1";
  `,
    pluginOptions: {
      sideEffects: {
        "@scope/(component1|component2)": "[*]/styles.css",
      },
    },
  },
  {
    code: `
import { Component1, Component2 } from "@scope/components";
  `,
    pluginOptions: {
      sideEffects: {
        "^@scope/components$": "[*]/dist/[specifier]/styles.css",
      },
    },
  },
  {
    code: `
import { Component1, Component2 } from "@scope/components";
  `,
    pluginOptions: {
      sideEffects: {
        "^@scope/components$": "[scope]/styles/[specifier]/styles.css",
      },
    },
  },
];

pluginTester({
  plugin,
  title: "snapshots",
  snapshot: true,
  tests: snapShotTests.map((t) => ({
    title: JSON.stringify(t.pluginOptions),
    ...t,
  })),
});
