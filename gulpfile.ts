import * as gulp from 'gulp'
import * as sourcemaps from 'gulp-sourcemaps'
import * as ts from 'gulp-typescript'

function tsProject(settings?: ts.Settings): ts.CompileStream {
  return ts.createProject('tsconfig.json', settings)(
    ts.reporter.defaultReporter()
  )
}

const lib = {
  src: gulp.src('src/**/*.{ts,tsx}'),
  dest: (target: string) => gulp.dest(`lib/${target}`)
}

const test = {
  src: gulp.src('{test,src}/**/*.{ts,tsx}'),
  dest: gulp.dest('out')
}

gulp.task('build', ['build:cjs', 'build:umd'])

gulp.task('build:cjs', () =>
  lib.src
    .pipe(tsProject())
    .pipe(sourcemaps.write())
    .pipe(lib.dest('cjs'))
)

gulp.task('build:umd', () =>
  lib.src
    .pipe(
      tsProject({
        module: 'umd'
      })
    )
    .pipe(sourcemaps.write())
    .pipe(lib.dest('umd'))
)

gulp.task('build:test', () =>
  test.src.pipe(tsProject()).js.pipe(test.dest)
)
