import typescript from 'rollup-plugin-typescript'

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
        name: 'deviation',
        file: 'lib/umd/deviation.js',
        format: 'umd',
        sourcemap: true,
        globals: {
          rxjs: 'rxjs',
          react: 'react',
          lodash: 'lodash'
        }
      },
      {
        file: 'lib/esm/deviation.js',
        format: 'esm',
        sourcemap: true
      }
    ],
    plugins: [typescript()]
  }
]
