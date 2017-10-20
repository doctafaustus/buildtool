// Gulp
const gulp = require('gulp');

// Gulp helpers
const insert = require('gulp-insert');
const sequence = require('gulp-sequence');
const eslint = require('gulp-eslint');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const glob = require('glob');
const es = require('event-stream');
const stringify = require('stringify');
const del = require('del');

// SCSS
const sass = require('gulp-sass');
const sassLint = require('gulp-sass-lint');
const sassify = require('sassify');

// ESLint configuration file
const eslintConfig = require('./.eslintrc.json');



// Define relevant paths
const paths = {
  src: {
    html: './src/**/*.html',
    scripts: './src/**/*.js',
    stylesheets: ['./src/**/*.css', './src/**/*.scss', './src/**/*.sass'],
  },
  html: './src/*.html',
  scripts: './src/*.js',
  stylesheets: ['src/styles/*.css', 'src/styles/*.scss', 'src/styles/*.sass'],
  dest: './build/',
};



// --- Lint ---
gulp.task('lint:stylesheets', () => {
  return gulp.src(paths.stylesheets)
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

gulp.task('lint:scripts', () => {
  return gulp.src(paths.scripts)
    .pipe(eslint(eslintConfig))
    .pipe(eslint.format());
});

gulp.task('lint', ['lint:stylesheets', 'lint:scripts']);


// --- Build ---
gulp.task('build:clean', (cb) => {
  return del(paths.dest, cb);
});

gulp.task('build:stylesheets', () => {
  return gulp.src(paths.stylesheets)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.dest));
});

gulp.task('build:scripts', (done) => {

 	glob(paths.scripts, (err, files) => {
	 	if (err) done(err);

		const tasks = files.map(entry => {
			return browserify({ entries: [entry] })
		  .transform('babelify', {presets: ['es2015', 'es2016', 'es2017', 'react']})
      .transform(sassify, {
        sourceMap: false,
      })
      .transform(stringify, {
        appliesTo: {
          includeExtensions: ['.html', '.css', '.sass', '.scss'],
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



// Build experiment
gulp.task('build', () => {
  return sequence('lint', 'build:clean', ['build:stylesheets', 'build:scripts'])();
});


// Watch and rebuild when experiment files change
gulp.task('watch', () => {
  gulp.watch(paths.src.html, ['build']);
  gulp.watch(paths.src.scripts, ['build']);
  gulp.watch(paths.src.stylesheets, ['build']);
});


// Default task
gulp.task('default', ['build', 'watch']);
