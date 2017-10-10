const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const eslint = require('gulp-eslint');
const fs = require('fs');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');


// Custom ESLint configuration file
const eslintConfig = require('./config/eslint-config');


// Define relevant paths
const paths = {
  src: {
    html: './src/**/*.html',
    scripts: './src/**/*.js',
    stylesheets: ['./src/**/*.css', './src/**/*.scss', './src/**/*.sass'],
  },
  html: './src/*.html',
  scripts: './src/*.js',
  stylesheets: ['./src/*.css', './src/*.scss', './src/*.sass'],
  dest: './build/',
};


gulp.task('lint:scripts', () => {
  return gulp.src(paths.scripts)
    .pipe(eslint(eslintConfig))
    .pipe(eslint.format());
});


// NOTE: DEFUNCT - use build:scripts instead
// Concatenate and minify scripts in the src directory
gulp.task('scripts', () => {
	return gulp.src(paths.scripts)
	.pipe(concat('build.js'))
	.pipe(uglify())
	.pipe(gulp.dest(paths.dest));
});


gulp.task('build:scripts', () => {
	browserify('./src/v1.js')
  .transform('babelify', {presets: ['es2015', 'react']})
  .bundle()
  .pipe(source('v1-transformed.js'))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest(paths.dest))
});

