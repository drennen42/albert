var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync').create(),
  browserify = require('browserify'),
  path = require('path'),
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
  // console.log('path: ', path.join('./public/js/clients/clients.js'));
  var name = './public/js/**/*.js';
  console.log('type of name: ', [typeof name, name]);

  // /Users/alexd/Workspace/Albert/public/js/clients/clients.js
  return browserify({entries: name, extensions: ['.js']})
    .transform(babelify)
    .bundle()
    // .pipe(source(main.js))
    .pipe(gulp.dest('.public/main.js'))
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
