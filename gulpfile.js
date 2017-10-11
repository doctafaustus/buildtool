const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const eslint = require('gulp-eslint');
const rename = require('gulp-rename');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const glob = require('glob');
const es = require('event-stream');
const insert = require('gulp-insert');
const stringify = require('stringify');
const sassify = require('sassify');


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


gulp.task('build:scripts', (done) => {

 	glob(paths.scripts, (err, files) => {
	 	if (err) done(err);

		const tasks = files.map(entry => {
			return browserify({ entries: [entry] })
		  .transform('babelify', {presets: ['es2015', 'es2016', 'es2017', 'react']})
      .transform(stringify, {
        appliesTo: {
          includeExtensions: ['.html', '.css', '.sass', '.scss']
        },
        minify: true,
      })
		  .bundle()
		  .pipe(source(entry.replace('./src/', '')))
		  .pipe(rename({ extname: '.bundle.js' }))
		  .pipe(buffer())
		  .pipe(uglify())
      .pipe(insert.prepend('/* jshint ignore:start */\n'))
      .pipe(insert.append('\n/* jshint ignore:end */'))
		  .pipe(gulp.dest(paths.dest));
		});

		es.merge(tasks).on('end', done);
	});
});

