const {
  FuseBox,
  QuantumPlugin,
  SourceMapPlainJsPlugin
} = require('fuse-box')
const { task, src } = require('fuse-box/sparky')

task('build', ['clean', 'build:cjs', 'build:umd'])

task('clean', async () => {
  await src('lib')
    .clean('lib')
    .exec()
})

task('build:cjs', async () => {
  const fuse = FuseBox.init({
    homeDir: 'src',
    output: 'lib/$name.js',
    sourceMaps: true,
    tsConfig: [
      {
        compilerOptions: {
          module: 'commonjs'
        }
      }
    ],
    plugins: [
      QuantumPlugin({
        target: 'npm',
        bakeApiIntoBundle: true,
        containedAPI: true
      }),
      SourceMapPlainJsPlugin()
    ]
  })

  fuse.bundle('deviation').instructions('> [index.ts]')
  await fuse.run()
})

task('build:umd', async () => {
  const fuse = FuseBox.init({
    homeDir: 'src',
    output: 'lib/$name.js',
    package: {
      name: 'deviation',
      main: 'index.ts'
    },
    globals: {
      rxjs: 'rxjs',
      'rxjs.operators': 'rxjs/operators',
      lodash: 'lodash'
    },
    sourceMaps: true,
    tsConfig: [
      {
        compilerOptions: {
          module: 'umd'
        }
      }
    ],
    plugins: [
      QuantumPlugin({
        target: 'browser',
        bakeApiIntoBundle: true,
        containedAPI: true
      }),
      SourceMapPlainJsPlugin()
    ]
  })

  fuse.bundle('deviation.umd').instructions('> [index.ts]')
  await fuse.run()
})
