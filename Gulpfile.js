'use strict';

var gulp = require('gulp')
var sass = require('gulp-sass')
var minCss = require('gulp-minify-css')
var rename = require('gulp-rename')


var config = {
   srcCss : 'sass/styles.scss',
   destCss: 'css'
}

gulp.task('sass', function () {
  return gulp.src(config.srcCss)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(config.destCss))
    .pipe(minCss())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(config.destCss));
});

gulp.task('sass:watch', function () {
  gulp.watch('sass/*.scss', ['sass']);
});
