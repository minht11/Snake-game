import typescript from 'rollup-plugin-typescript2'
import copy from 'rollup-plugin-copy-glob'
import nodeResolve from 'rollup-plugin-node-resolve'
import modify from 'rollup-plugin-modify'
import randomstring from 'randomstring'
import { terser } from 'rollup-plugin-terser'
import minifyHTML from 'rollup-plugin-minify-html-literals'

const isDevelopment = process.env.BUILD === 'development'

const minify = !isDevelopment 
? [
  terser(),
  minifyHTML(),
]
: []

const mainOptions = {
  input: 'src/app.ts',
  output: [
    {
      dir: 'dist/',
      format: 'es',
      sourcemap: false
    },
  ],
  plugins: [
    nodeResolve({
      jsnext: true,
      extensions: [ '.ts', '.js', '.json' ]
    }),
    typescript({
      typescript: require("typescript"),
      verbosity: 2,
      clean: true,
      sourceMap: false,
    }),
    copy([
      { 
        files: './src/static/',
        dest: 'dist/'
      },
    ], {
      verbose: false, 
      watch: isDevelopment,
    }),
    ...minify
  ],
  external: ['./game.js'],
}

const serviceWorker =  {
  input: 'src/service-worker/service-worker.ts',
  output: [
    {
      file: 'dist/service-worker.js',
      format: 'es',
      sourcemap: false
    },
  ],
  plugins: [
    modify({
      find: 'sw_hash_replacement',
      replace: () => randomstring.generate()
    }),
    typescript({
      typescript: require("typescript"),
      verbosity: 2,
      clean: true,
      sourceMap: false,
    }),
    ...minify
  ],
}

export default [mainOptions, serviceWorker]