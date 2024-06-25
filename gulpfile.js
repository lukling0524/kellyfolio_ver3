const gulp = require('gulp');

// plugins
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass')(require('sass'));

// paths
const paths = {
  js: 'src/js/*.js',
  scss: 'src/scss/*.scss',
};

// js 난독화
gulp.task('concat', function () {
  return gulp
    .src(paths.js)
    .pipe(uglify())
    .pipe(concat('common.min.js'))
    .pipe(gulp.dest('public/js'));
});

// scss compiling
gulp.task('scss', function () {
  return gulp
    .src(paths.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public/css'));
});

gulp.task('watch', function () {
  gulp.watch(paths.js, gulp.series('concat'));
  gulp.watch(paths.scss, gulp.series('scss'));
});

gulp.task('default', gulp.series('concat', 'scss', 'watch'));
