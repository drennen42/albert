var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync').create(),
  browserify = require('browserify'),
  path = require('path'),
  babel = require('gulp-babel'),
  fs = require('fs'),
  source = require('vinyl-source-stream'),
  babelify = require('babelify');

gulp.task('sass', function () {
  gulp.src('./public/css/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest('./public/css'))
    .pipe(livereload());
});

gulp.task('watch', function() {
 gulp.src('./public/css/*.scss')
});

gulp.task('scripts', function() {
  return browserify({entries: './public/js/**/*.js', extensions: ['.js'], debug: true})
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist'));
  // return browserify(name)
    // .transform(babelify)
    // .bundle()
    // .pipe(source(main.js))
    // return gulp.src('./public/js/**/*.js')
    // .pipe(babel())
    // .pipe(gulp.dest('./public'));
});

gulp.task('develop', function () {
  livereload.listen();
  nodemon({
    script: 'app.js',
    ext: 'js coffee handlebars',
    stdout: false
  }).on('readable', function () {
    this.stdout.on('data', function (chunk) {
      if(/^Express server listening on port/.test(chunk)){
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "localhost:3000"
    });
});

gulp.task('default', [
  'sass',
  'develop',
  'watch'
]);
