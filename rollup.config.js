import typescript from 'rollup-plugin-typescript2'
import copy from 'rollup-plugin-copy-glob'
import nodeResolve from 'rollup-plugin-node-resolve'
import modify from 'rollup-plugin-modify'
import randomstring from 'randomstring'

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
      watch: true
    }),
  ],
  external: ['./game.js'],
  experimentalCodeSplitting: true
}

const serviceWorker =  {
  input: 'src/service-worker.ts',
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
  ],
}

export default [mainOptions, serviceWorker]