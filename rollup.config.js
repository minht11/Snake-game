import typescript from 'rollup-plugin-typescript2'
import copy from 'rollup-plugin-copy-glob'
import nodeResolve from 'rollup-plugin-node-resolve'

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
    copy(
    [
      { files: './src/static/', dest: 'dist/' },
    ],
    { verbose: false, watch: true }),
  ],
  external: ['./game.js'],
  experimentalCodeSplitting: true
}

export default mainOptions