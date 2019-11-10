"use strict";

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    browserSync = require('browser-sync').create();

// Set paths
var paths = {
  styles: {
    // By using styles/**/*.sass we're telling gulp to check all folders for any sass file
    src: "assets/scss/**/*.scss",
    // Compiled files will end up in whichever folder it's found in (partials are not compiled)
    dest: "assets/css"
  },
  scripts: {
    src: "assets/js/*.js",
    dest: "assets/js"
  },
  html: {
    src: "**/*.html",
    dest: ""
  }
};

// Compile, concat, autoprefix, and minify SCSS → CSS
function styles() {
  return gulp
    // Get stylesheet
    .src(paths.styles.src)
    // Compile Sass
    .pipe(sass())
    // Catch and log errors
    .on("error", sass.logError)
    // Use postcss with autoprefixer and compress the compiled file using cssnano
    .pipe(postcss([autoprefixer(), cssnano()]))
    // Output compiled file to destination
    .pipe(gulp.dest(paths.styles.dest))
    // Pipe the change to BrowserSync
    .pipe(browserSync.stream());
}

// Reload the page
function reload() {
  browserSync.reload();
}

// The watch task starts up PHP and BrowserSync
function watch() {
    browserSync.init({
        open: true,
        server: {
            baseDir: "./"
        }
    });
    // Tell gulp which files to watch to trigger the reload
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.html.src).on('change', browserSync.reload);
}

/*
 * Define two gulp tasks:
 * - `dev` - the default task which serves, watches, and rebuilds
 * - `build` - only runs the build process
 */
var dev = gulp.parallel(styles, watch);
var build = gulp.parallel(styles);
gulp.task('default', dev);
gulp.task('build', build);