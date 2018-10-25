const gulp = require('gulp')
const ts = require('gulp-typescript')

const tsProject = ts.createProject('tsconfig.json')

gulp.task('default', ['build'])

gulp.task('build', function() {
  return gulp
    .src('src/**/*.{ts,tsx}')
    .pipe(tsProject(ts.reporter.defaultReporter()))
    .js.pipe(gulp.dest('lib'))
})

gulp.task('build:test', function() {
  return gulp
    .src('{test,src}/**/*.{ts,tsx}')
    .pipe(tsProject(ts.reporter.defaultReporter()))
    .js.pipe(gulp.dest('out'))
})
