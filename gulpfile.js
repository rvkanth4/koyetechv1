'use strict';

const sass = require('gulp-sass')(require('sass'));
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const fileinclude = require('gulp-file-include');
const autoprefixer = require('gulp-autoprefixer');
const bs = require('browser-sync').create();
const rimraf = require('rimraf');
const comments = require('gulp-header-comment');

var path = {
  src: {
    html: 'source/*.html',
    others: 'source/*.+(php|ico|png)',
    htminc: 'source/partials/**/*.htm',
    incdir: 'source/partials/',
    plugins: 'source/plugins/**/*.*',
    js: 'source/js/*.js',
    images: 'source/images/**/*.+(png|jpg|gif|svg)'
  },
  build: {
    dirNetlify: 'netlify/',
    dirDev: 'theme/'
  }
};

// HTML
gulp.task('html:build', function () {
  return gulp.src(path.src.html)
    .pipe(fileinclude({
      basepath: path.src.incdir
    }))
    .pipe(comments(`
      `))
    .pipe(gulp.dest(path.build.dirDev))
    .pipe(bs.reload({
      stream: true
    }));
});


// Javascript
gulp.task('js:build', function () {
  return gulp.src(path.src.js)
    .pipe(comments(`
  `))
    .pipe(gulp.dest(path.build.dirDev + 'js/'))
    .pipe(bs.reload({
      stream: true
    }));
});

// Images
gulp.task('images:build', function () {
  return gulp.src(path.src.images)
    .pipe(gulp.dest(path.build.dirDev + 'images/'))
    .pipe(bs.reload({
      stream: true
    }));
});

// Plugins
gulp.task('plugins:build', function () {
  return gulp.src(path.src.plugins)
    .pipe(gulp.dest(path.build.dirDev + 'plugins/'))
    .pipe(bs.reload({
      stream: true
    }));
});

// Other files like favicon, php, sourcele-icon on root directory
gulp.task('others:build', function () {
  return gulp.src(path.src.others)
    .pipe(gulp.dest(path.build.dirDev))
});

// Clean Build Folder
gulp.task('clean', function (cb) {
  rimraf('./theme', cb);
});

// Watch Task
gulp.task('watch:build', function () {
  gulp.watch(path.src.html, gulp.series('html:build'));
  gulp.watch(path.src.htminc, gulp.series('html:build'));
  gulp.watch(path.src.js, gulp.series('js:build'));
  gulp.watch(path.src.images, gulp.series('images:build'));
  gulp.watch(path.src.plugins, gulp.series('plugins:build'));
});

// Build Task
gulp.task('default', gulp.series(
  'clean',
  'html:build',
  'js:build',
  'images:build',
  'plugins:build',
  'others:build',
  gulp.parallel(
    'watch:build',
    function () {
      bs.init({
        server: {
          baseDir: path.build.dirDev,
        }
      });
    })
  )
);


/* =====================================================
Netlify Builds
===================================================== */
// HTML
gulp.task('html:netlify:build', function () {
  return gulp.src(path.src.html)
    .pipe(fileinclude({
      basepath: path.src.incdir
    }))
    .pipe(gulp.dest(path.build.dirNetlify));
});


// Javascript
gulp.task('js:netlify:build', function () {
  return gulp.src(path.src.js)
    .pipe(gulp.dest(path.build.dirNetlify + 'js/'));
});

// Images
gulp.task('images:netlify:build', function () {
  return gulp.src(path.src.images)
    .pipe(gulp.dest(path.build.dirNetlify + 'images/'));
});

// Plugins
gulp.task('plugins:netlify:build', function () {
  return gulp.src(path.src.plugins)
    .pipe(gulp.dest(path.build.dirNetlify + 'plugins/'))
});

// Other files like favicon, php, apple-icon on root directory
gulp.task('others:netlify:build', function () {
  return gulp.src(path.src.others)
    .pipe(gulp.dest(path.build.dirNetlify))
});

// Build Task
gulp.task('netlify', gulp.series(
  'html:netlify:build',
  'js:netlify:build',
  'images:netlify:build',
  'plugins:netlify:build'
));