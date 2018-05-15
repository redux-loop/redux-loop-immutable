import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import commonjs from 'rollup-plugin-commonjs';

var env = process.env.NODE_ENV
var config = {
  output: {
    format: 'umd',
    name: 'ReduxLoopImmutable'
  },
  plugins: [
    nodeResolve({
      jsnext: true
    }),
    babel({
      exclude: 'node_modules/**',
      plugins: ['external-helpers']
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    commonjs({
      include: 'node_modules/**',
      namedExports: {
        'node_modules/immutable/dist/immutable.js': [ 'Map', 'is', 'fromJS']
      }
    }),
  ]
}

if (env === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  )
}

export default config
