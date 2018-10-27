import typescript from 'rollup-plugin-typescript'
import resolve from 'rollup-plugin-node-resolve'

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'lib/cjs/deviation.js',
        format: 'cjs',
        sourcemap: true
      },
      {
        file: 'lib/esm/deviation.js',
        format: 'esm',
        sourcemap: true
      },
      {
        name: 'deviation',
        file: 'lib/umd/deviation.js',
        format: 'umd',
        sourcemap: true,
        globals: {
          rxjs: 'rxjs',
          react: 'react',
          lodash: 'lodash'
        }
      }
    ],
    external: ['react', 'rxjs', 'lodash'],
    plugins: [
      resolve(),
      typescript({
        target: 'es5'
      })
    ]
  }
]
