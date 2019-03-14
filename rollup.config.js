import typescript from 'rollup-plugin-typescript2'
import copy from 'rollup-plugin-copy-glob'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

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
    commonjs({
      sourceMap: false
    }),
    typescript({
      typescript: require("typescript"),
      verbosity: 2,
      clean: true,
      sourceMap: false,
    }),
    copy(
    [
      { files: './src/static/', dest: 'dist/' },
    ],
    { verbose: false, watch: true }),
  ],
  experimentalCodeSplitting: true
}

export default mainOptions