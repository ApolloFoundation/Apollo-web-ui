var browserify = require('browserify');
var source     = require('vinyl-source-stream');

var gulp      = require('gulp');
var nano      = require('gulp-cssnano');
var htmlMin   = require('gulp-htmlmin');
var inject    = require('gulp-inject-string');
var sass      = require('gulp-sass');
var pug       = require('gulp-pug');
var rename    = require('gulp-rename');
var prettify  = require('gulp-html-prettify');
var streamify = require('gulp-streamify');
var uglify    = require('gulp-uglify');
var gutil     = require('gulp-util');

var failsafe = false;

function isLocal() {
	return !gutil.env.env;
}
function isTesting() {
	return gutil.env.env === 'testing';
}
function isStaging() {
	return gutil.env.env === 'staging';
}
function isProduction() {
	return gutil.env.env === 'production';
}

function failsafePipe(pipe, callback) {
	return failsafe
		? pipe.on('error', shallow(callback))
		: pipe;
}
function shallow(callback) {
	return function (error) {
		callback(error);
	};
}

var paths = new function() {
	this.srcDir  = 'src';
	this.distDir = 'dist';
	
	// Files to be copied to `distDir`
	this.files = [
		// this.srcDir + '/folder/**/*' // Copy whole folder with subfolders
		// this.srcDir + '/file.txt'    // Copy specified file
		this.srcDir + '/fonts/**/*',   // Copy specified file
		this.srcDir + '/img/**/*'    // Copy specified file
	];
	
	this.cssDir   = this.srcDir + '/css';
	this.cssFiles = this.cssDir + '/**/*.css';
	
	this.htmlDir   = this.srcDir;
	this.html      = this.htmlDir + '/**/*.html';
	this.htmlFiles = this.html;
	this.htmlOut   = this.distDir;
	
	this.imgDir   = this.srcDir + '/img';
	this.imgFiles = this.imgDir + '/**/*';
	this.imgOut   = this.distDir + '/img';
	
	this.jsDir   = this.srcDir + '/js';
	this.js      = this.jsDir + '/index.js';
	this.jsFiles = this.jsDir + '/**/*.js';
	this.jsOut   = this.distDir + '/js';
	
	this.sassDir   = this.srcDir + '/sass';
	this.sass      = this.sassDir + '/index.scss';
	this.sassFiles = this.sassDir + '/**/*.scss';
	this.sassOut   = this.distDir + '/css';
	
	this.pugDir   = this.srcDir + '/pug';
	this.pug      = [
		this.pugDir + '/**/*.pug',
		'!' + this.pugDir + '/includes/**/*'
	];
	this.pugFiles = this.pugDir + '/**/*';
	this.pugOut   = this.distDir;
};

// Files

gulp.task('files-copy', function () {
	return gulp.src(paths.files, {
		base: paths.srcDir
	})
		.pipe(gulp.dest(paths.distDir));
});
gulp.task('files', ['files-copy']);

// Images

gulp.task('img-copy', function () {
	return gulp.src(paths.imgFiles)
		.pipe(gulp.dest(paths.imgOut));
});
gulp.task('images', ['img-copy']);

// Markup

gulp.task('html-min', function (callback) {
	return gulp.src(paths.html)
		.pipe(isLocal() || isTesting()
			? inject.replace('<!--\\s*?weinre\\s*?-->', '<script async src="http://weinre.dev.gvia.group/target/target-script-min.js"></script>')
			: gutil.noop())
		.pipe(isStaging()
			? inject.replace('<!--\\s*?weinre\\s*?-->', '<script async src="http://weinre.dev.gvia.group/target/target-script-min.js#staging"></script>')
			: gutil.noop())
		.pipe(isProduction()
			? inject.replace('<!--\\s*?weinre\\s*?-->', '')
			: gutil.noop())
		.pipe(failsafePipe(htmlMin({
			collapseWhitespace: true,
			conservativeCollapse: true
		}), callback))
		.pipe(gulp.dest(paths.htmlOut));
});
gulp.task('pug-compile', function (callback) {
	return gulp.src(paths.pug)
		.pipe(isLocal() || isTesting()
			? inject.replace('//-?\\s*?weinre', 'script(async src="http://weinre.dev.gvia.group/target/target-script-min.js")')
			: gutil.noop())
		.pipe(isStaging()
			? inject.replace('//-?\\s*?weinre', 'script(async src="http://weinre.dev.gvia.group/target/target-script-min.js#staging")')
			: gutil.noop())
		.pipe(isProduction()
			? inject.replace('//-?\\s*?weinre', '')
			: gutil.noop())
		.pipe(failsafePipe(pug(), callback))
		.pipe(prettify({indent_char: ' ', indent_size: 2}))
		
		.pipe(gulp.dest(paths.pugOut));
});
gulp.task('markup', ['html-min', 'pug-compile']);

// Scripts

gulp.task('js-browserify', function (callback) {
	return failsafePipe(browserify(paths.js, {
		debug: isLocal()
	})
		.bundle(), callback)
		.pipe(source('script.all.min.js'))
		.pipe(!isLocal() ? streamify(failsafePipe(uglify(), callback)) : gutil.noop())
		.pipe(gulp.dest(paths.jsOut));
});
gulp.task('scripts', ['js-browserify']);

// Styles

gulp.task('scss-compile', function (callback) {
	return gulp.src(paths.sass)
		.pipe(failsafePipe(sass(), callback))
		.pipe(!isLocal() ? failsafePipe(nano(), callback) : gutil.noop())
		.pipe(rename('style.all.min.css'))
		.pipe(gulp.dest(paths.sassOut));
});
gulp.task('styles', ['scss-compile']);

// Stages

gulp.task('watch', function () {
	failsafe = true;
	gulp.watch(paths.files, ['files']);
	gulp.watch(paths.imgFiles, ['images']);
	gulp.watch([paths.htmlFiles, paths.pugFiles], ['markup']);
	gulp.watch(paths.jsFiles, ['scripts']);
	gulp.watch([paths.cssFiles, paths.sassFiles], ['styles']);
});

gulp.task('build', ['files', 'images', 'markup', 'scripts', 'styles']);

gulp.task('default', ['build']);
