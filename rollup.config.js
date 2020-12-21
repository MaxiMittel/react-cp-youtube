import typescript from "rollup-plugin-typescript2";
import image from '@rollup/plugin-image';
import css from 'rollup-plugin-css-only'

import pkg from "./package.json";

export default {
  input: "src/index.tsx",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      sourcemap: true,
      strict: false,
    },
  ],
  plugins: [
    typescript({ objectHashIgnoreUnknownHack: true }),
    css({ output: 'bundle.css' }),
    image()
  ],
  external: ["react", "react-dom"],
};
