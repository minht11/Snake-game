import typescript from 'rollup-plugin-typescript2'
import copy from 'rollup-plugin-copy'
import nodeResolve from 'rollup-plugin-node-resolve'
import modify from 'rollup-plugin-modify'
import randomstring from 'randomstring'
import { terser } from 'rollup-plugin-terser'
import minifyHTML from 'rollup-plugin-minify-html-literals'
import babel from 'rollup-plugin-babel'

const isDevelopment = process.env.BUILD === 'development'

const minify = !isDevelopment 
? [
  terser(),
  minifyHTML(),
]
: []

const mainPlugins = [
  nodeResolve({
    extensions: [ '.ts', '.js' ]
  }),
  typescript({
    typescript: require("typescript"),
    verbosity: 2,
    clean: true,
    sourceMap: false,
  }),
]

const mainBundle  = {
  input: [
    'src/app.ts',
    'src/service-worker/service-worker.ts',
  ],
  output: [
    {
      dir: 'dist/',
      format: 'es',
      sourcemap: false
    },
  ],
  plugins: [
    ...mainPlugins,
    ...minify,
    modify({
      find: 'sw_hash_replacement',
      replace: () => randomstring.generate()
    }),
    copy({
      targets: {
        'src/static/': 'dist'
      }
    }),
  ],
}

const mainBundleES5 = {
  input: 'src/app.ts',
  output: [
    {
      file: 'dist/app-es5.js',
      format: 'iife',
      sourcemap: false
    },
  ],
  plugins: [
    ...mainPlugins,
    babel({
      extensions: ['.js', '.ts'],
    }),
    ...minify,
  ],
  external: [
    '../wasm-game.js',
  ],
}

export default [
  mainBundle,
  mainBundleES5,
]