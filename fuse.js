const { FuseBox, QuantumPlugin } = require('fuse-box')
const { task, src, exec, watch } = require('fuse-box/sparky')

const lib = {
  name: 'deviation',
  homeDir: 'src',
  instructions: '> [index.ts]',
  output: 'lib/$name.js'
}

const watchOpts = {
  options: { base: 'src' },
  glob: '**/*.{ts,tsx}'
}

const targetNPM = {
  globals: {
    default: '*'
  },
  tsConfig: {
    compilerOptions: {
      module: 'commonjs'
    }
  },
  quantum: QuantumPlugin({
    target: 'npm',
    bakeApiIntoBundle: 'deviation',
    containedAPI: true
  })
}

const targetUMD = {
  name: `${lib.name}.umd`,
  target: 'browser@esnext',
  globals: {
    default: 'deviation'
  },
  tsConfig: {
    compilerOptions: {
      module: 'umd'
    }
  }
}

task('build', runBuild)
async function runBuild() {
  await exec('clean', 'build:node', 'build:umd')
}

task('watch', runWatch)
async function runWatch() {
  await exec('build')

  await watch(watchOpts.glob, watchOpts.options, () =>
    exec('build')
  ).exec()
}

task('clean', runClean)
async function runClean() {
  await src('./dist')
    .clean('dist/')
    .exec()
}

task('build:node', buildTargetNode)
async function buildTargetNode() {
  const fuse = FuseBox.init({
    homeDir: lib.homeDir,
    output: lib.output,
    globals: targetNPM.globals,
    tsConfig: [targetNPM.tsConfig],
    plugins: [targetNPM.quantum]
  })

  fuse.bundle(lib.name).instructions(lib.instructions)
  await fuse.run()
}

task('build:umd', buildTargetUMD)
async function buildTargetUMD() {
  const fuse = FuseBox.init({
    homeDir: lib.homeDir,
    output: lib.output,
    globals: targetUMD.globals,
    tsConfig: [targetUMD.tsConfig]
  })

  fuse.bundle(targetUMD.name).instructions(lib.instructions)
  await fuse.run()
}
