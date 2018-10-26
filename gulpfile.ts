import * as gulp from 'gulp'
import * as ts from 'gulp-typescript'

function tsProject(settings?: ts.Settings): ts.CompileStream {
  return ts.createProject('tsconfig.json', settings)(
    ts.reporter.defaultReporter()
  )
}

const test = {
  src: gulp.src('{test,src}/**/*.{ts,tsx}'),
  dest: gulp.dest('out')
}

gulp.task('build:test', () =>
  test.src.pipe(tsProject()).js.pipe(test.dest)
)