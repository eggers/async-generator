'use strict';
require('ts-node/register');

var gulp = require('gulp');

var del = require('del');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var merge = require('merge2');
var tsc = require('gulp-typescript');
var mocha = require('gulp-mocha');

var tsProject = tsc.createProject('tsconfig.json', {
  typescript: require('typescript'),
  declaration: true
});

gulp.task('clean', function() {
  return del('lib');
});

gulp.task('lint', function(){
  return gulp.src('src/**/*.ts')
  .pipe(tslint())
  .pipe(tslint.report('verbose'));
});

gulp.task('build', ['clean'], function() {
  var stream = gulp.src(['src/index.ts'])
  .pipe(sourcemaps.init())
  .pipe(tsc(tsProject));

  return merge([
    stream.dts.pipe(gulp.dest('lib')),
    stream.js.pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('lib'))
  ]);

});


gulp.task('test', function() {
  var stream = gulp.src(['src/**/*.spec.ts'])
  .pipe(mocha());
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['build', 'test']);

