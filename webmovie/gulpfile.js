var gulp = require('gulp');
var browserSync = require('browser-sync');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');

// combine json
var gutil = require('gulp-util');
var data = require('gulp-data');
var fs = require('fs');
var markdown = require('gulp-markdown-to-json');
var merge = require('gulp-merge-json');

// use jade with yaml data
var data = require('gulp-data');
var yaml = require('gulp-yaml');

// without error
var plumber = require('gulp-plumber');

// optimize css
var postcss = require('gulp-postcss');
var assets = require('postcss-assets');
var autoprefixer = require('autoprefixer');
var cssnano = require('gulp-cssnano');
var minifyname = require('gulp-minify-cssnames');
var uncss = require('gulp-uncss');
var shorthand = require('gulp-shorthand');
var rename = require("gulp-rename");
var csscomb = require('gulp-csscomb');

// optimize js
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');

var dir = {
    stylus: '_styles/',
    jade: '_templates/',
    js: '_build/js/',
    yaml: '_templates/',
    md: '_templates/posts/',
    json: '_templates/config/'
};

var build = {
    stylus: '_build/css/',
    jade: '_build/',
    js: '_build/js/',
    yaml: '_templates/config/',
    md: '_templates/config/',
    json: '_templates/config/data/'
};

gulp.task('browserSync', function() {
    browserSync.init({
        open: true,
        server: {
            baseDir: '_build'
        }
    });
});

gulp.task('stylus', function() {
    gulp.src(dir.stylus + 'main.styl')
        .pipe(plumber())
        .pipe(stylus({
            'include css': true
        }))
        .pipe(postcss([assets({
            loadPaths: ['img/']
        }), autoprefixer({
            browsers: ['last 3 version', 'ie > 7']
        })]))
        .pipe(csscomb())
        .pipe(gulp.dest(build.stylus));
});

gulp.task('sass', function() {
    gulp.src(dir.stylus + 'main.sass')
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([assets({
            loadPaths: ['img/']
        }), autoprefixer({
            browsers: ['last 3 version', 'ie > 7']
        })]))
        .pipe(csscomb())
        .pipe(gulp.dest(build.stylus));
});

gulp.task('js', function() {
    gulp.src(build.js + 'functions.js')
        .pipe(sourcemaps.init())
        .pipe(stylus())
        .pipe(sourcemaps.write('./map'));
});

gulp.task('markdown', function() {
    gulp.src(dir.md + '**/*.md')
        .pipe(plumber())
        .pipe(gutil.buffer())
        .pipe(markdown('posts.json'))
        .pipe(gulp.dest(build.md));
});

gulp.task('yaml', function() {
    gulp.src(dir.yaml + 'config.yml')
        .pipe(plumber())
        .pipe(yaml())
        .pipe(gulp.dest(build.yaml));
});

gulp.task('json', function() {
    gulp.src(dir.json + '*.json')
        .pipe(merge("data.json"))
        .pipe(gulp.dest(build.json));
});

gulp.task('jade', function() {
    gulp.src(dir.jade + 'index.jade')
        .pipe(plumber())
        .pipe(data(function(file) {
            return JSON.parse(fs.readFileSync(build.json + 'data.json'));
        }))
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(build.jade));
});

gulp.task('watch', ['browserSync'], function() {
    gulp.watch(dir.md + '**/*.md', ['markdown']);
    gulp.watch(dir.yaml + 'config.yml', ['yaml']);
    gulp.watch(dir.json + '**/*.json', ['json']);
    gulp.watch([dir.jade + '**/*.jade', build.json + 'data.json'], ['jade'], browserSync.reload);
    gulp.watch(build.jade + 'index.html', browserSync.reload);
    gulp.watch(dir.stylus + '**/*.styl', ['stylus'], browserSync.reload);
    gulp.watch(build.stylus + 'main.css', browserSync.reload);
    gulp.watch(build.js + 'functions.js', browserSync.reload);
});

gulp.task('default', ['watch']);


gulp.task('optimize-css', function() {
    gulp.src(build.stylus + 'main.css')
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(shorthand())
        .pipe(minifyname())
        .pipe(cssnano())
        .pipe(uncss({
            html: [build.jade + 'index.html']
        }))
        .pipe(gulp.dest(build.stylus));
});

gulp.task('es5', function() {
    gulp.src(build.js + 'functions.js')
        // .pipe(concat('all.js'))
        .pipe(rename({
            suffix: '.es5'
        }))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('_build/js'));
});

gulp.task('optimize-js', function() {
    gulp.src(build.js + 'functions.es5.js')
        .pipe(concat('all.js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('_build/js'));
});


gulp.task('optimize', ['optimize-css', 'babel', 'optimize-js']);
