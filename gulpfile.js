var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync').create(),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  streamify = require('gulp-streamify'),
  uglify = require('gulp-uglify'),
  glob = require('glob'),
  notify = require('gulp-notify'),
  watchify = require('watchify'),
  gutil = require('gulp-util'),
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

function handleErrors () {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
      title: 'Compile Error',
      message: '<%= error.message %>'
  }).apply(this, args);

  //When running watch or browser-sync don't exit on complier error
  // if (globalWatch){
  //   this.emit('end'); // Keep gulp from hanging on this task
  // } else {
  process.exit(1);
  // }


};

gulp.task('browserify', function() {
  console.log('in gulp scripts');
        console.log('in first function');
        // glob('./public/js/**/*.js', function(er, files) {
        //   console.log('globbed files: ', files);
        // });
        var scriptFiles = glob.sync('./public/js/**/*.js'),
              file = 'bundle.js',
              props = {
                transform: [[babelify, {presets: ['es2015']}]],
                // transform: [[babelify, {presets: ['es2015']}]],
                // transform: [[babelify, {presets: ['es2015'], ignore: /\/public\/js\/middleware\//}]],
                entries: [scriptFiles]
              },
              bundler;
              console.log('scriptFiles: ', scriptFiles);

        bundler = watchify(browserify(props));

        function rebundle() {
          console.log('Rebundling');
            var stream = bundler.bundle();
            return stream.on('error', handleErrors)
                .pipe(source(file))
                .pipe(streamify(uglify()))
                .pipe(gulp.dest('./public'));
        }

        // listen for an update and run rebundle
        bundler.on('update', function() {
            gutil.log('Rebundle...');
            return rebundle();
        });

        // run it once the first time buildScript is called
        return rebundle();
    // };
});

// });

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
        proxy: "localhost:3000",
        reloadDelay: 1000
    });
});

gulp.task('default', [
  'sass',
  'browserify',
  'develop',
  'watch'
]);
