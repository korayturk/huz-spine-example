import { readdirSync } from "fs";
import path from "path";
import babel from "rollup-plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import PackageJSON from "./package.json";
import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import json from "@rollup/plugin-json";
import postcss from "rollup-plugin-postcss";

const EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".json"];

const getChunks = (URI) =>
  readdirSync(path.resolve(URI))
    .filter((x) => x.includes(".js"))
    .reduce((a, c) => ({ ...a, [c.replace(".js", "")]: `src/${c}` }), {});

const env = process.env.NODE_ENV;
const externals = [
  "react",
  "react-dom",
  "redux",
  "react-redux",
  "@material-ui/core",
  "@byhuz/huz-ui-project",
  "react-i18next",
  "i18next",
];

const commonPlugins = () => [
  json(),
  postcss(),
  external({
    includeDependencies: true,
  }),
  resolve({
    extensions: EXTENSIONS,
    preferBuiltins: true,
    dedupe: externals,
  }),
  commonjs({
    include: /node_modules/,
  }),
  babel({
    babelrc: false,
    presets: [["@babel/preset-env", { modules: false }], "@babel/preset-react"],
    extensions: EXTENSIONS,
    exclude: "node_modules/**",
    plugins: [["@babel/plugin-transform-runtime"]],
    runtimeHelpers: true,
  }),
  replace({ "process.env.NODE_ENV": JSON.stringify(env) }),
  terser(),
];

export default [
  {
    input: `src/index.js`,
    output: {
      esModule: false,
      dir: "dist/iife",
      format: "iife",
      name: "SpineByHuz",
      exports: "named",
      globals: {
        react: "React",
        "react-dom": "ReactDOM",
        redux: "Redux",
        "react-redux": "ReactRedux",
        "@material-ui/core": "MaterialUI",
        "@material-ui/core/styles": "MaterialUI",
        "@byhuz/huz-ui-project": "HuzUIProject",
        i18next: "i18next",
        "react-i18next": "ReactI18next",
      },
    },
    plugins: [
      json(),
      postcss(),
      external(),      
      resolve({
        preferBuiltins: false,
      }),
      commonjs({
        include: /node_modules/,
      }),
      babel({
        presets: ["@babel/preset-env", "@babel/preset-react"],
        exclude: /node_modules/,
        runtimeHelpers: true,
        plugins: [["@babel/plugin-transform-runtime"]],
      }),
      replace({ "process.env.NODE_ENV": JSON.stringify(env) }),
      terser(),
    ],
    external: externals,
  },
  {
    input: `src/@editor/index.js`,
    output: {
      dir: "dist/@editor/iife",
      format: "iife",
      name: "SpineByHuz", //BaseByOrbit
      exports: "named",
    },
    plugins: [
      replace({
        __PACKAGE_HOST__: process.env.DEVELOPMENT
          ? "http://localhost:5000"
          : `https://pm.byorbit.com/${PackageJSON.name}/${PackageJSON.version}`,
      }),
    ],
  },
  {
    input: getChunks(`src`),
    output: [
      {
        dir: `dist/esm`,
        format: "esm",
        exports: "named",
        sourcemap: false,
      },
      {
        dir: `dist/cjs`,
        format: "cjs",
        exports: "named",
        sourcemap: false,
      },
    ],
    plugins: commonPlugins(),
    external: externals,
  },
];
