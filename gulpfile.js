///////////////////////////////
// Requiered
///////////////////////////////
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    del = require('del'),
    cleanCSS = require('gulp-clean-css'),
    notify = require("gulp-notify");

///////////////////////////////
// Script Tasks
///////////////////////////////
gulp.task('scripts', function(){
  gulp.src(['app/js/**/*.js', '!app/js/**/*.min.js'])
  .pipe(rename({suffix:'.min'}))
  .pipe(uglify())
  .pipe(gulp.dest('app/js'))
  .pipe(reload({stream: true}));
});

///////////////////////////////
// Styles Tasks
///////////////////////////////
gulp.task('scss', function() {
  gulp.src('app/scss/*.scss')
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(autoprefixer({browsers: ['last 2 version', 'ie 9']}))
  .pipe(sourcemaps.write('./maps'))
  .pipe(gulp.dest('./app/css'))
  .pipe(reload({stream: true}));
});

///////////////////////////////
// HTML Tasks
///////////////////////////////
gulp.task('html', function() {
  gulp.src('app/**/*.html')
  .pipe(reload({stream: true}));
});

///////////////////////////////
// Browser-Sync Tasks
///////////////////////////////
gulp.task('browser-sync', function(){
  browserSync({
    server: {
      baseDir: './app/'
    }
  });
});

///////////////////////////////
// Watch Tasks
///////////////////////////////
gulp.task('watch', function(){
  gulp.watch('app/js/**/*.js', ['scripts']);
  gulp.watch('app/scss/**/*.scss', ['scss']);
  gulp.watch('app/**/*.html', ['html']);
});

// default `gulp` task
gulp.task('default', ['scripts','scss', 'html', 'browser-sync','watch']);



///////////////////////////////
// Build Tasks
///////////////////////////////

// clean out all files and folders from build directory
gulp.task('build:removefolder', function(cb) {
  return del([
    'build/**'
  ], cb);
});

// task to create build dir for all files
gulp.task('build:copy', ['build:removefolder'], function(cb){
  return gulp.src('app/**/*/')
  .pipe(gulp.dest('build/'));
});

// task to remove unwanted build files
// list all files and directories here that you don't want to include
gulp.task('build:clean', [ 'build:minify-css'],  function(cb) {
  del([
    'build/scss/',
    'build/css/styles.css',
    'build/css/maps/styles.css.map',
    'build/js/!(*.min.js)'
  ], cb);
});//'build/css/!(*.min.css)',

// CSS Minify Tasks
gulp.task('build:minify-css', ['build:copy'], function() {
  return gulp.src('app/css/*.css')
    .pipe(sourcemaps.init())
    .pipe(cleanCSS({debug: true}, function(details) {
        console.log(details.name + ': ' + details.stats.originalSize + ' Bytes');
        console.log(details.name + ': ' + details.stats.minifiedSize + ' Bytes');
    }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('build/css'));
});

// RUN BUILD TASK for final output
//gulp.task('build', ['build:copy', 'build:clean', 'build:minify-css']);
gulp.task('build', ['build:clean']);
