'use strict'
const gulp = require('gulp')
const shell = require('gulp-shell')

const config = {
    source: {
        baseDir: './theme/',
        js: './theme/assets/*.js',
        liquid: [
            './theme/layout/*.liquid',
            './theme/sections/*.liquid',
            './theme/snippets/*.liquid',
            './theme/templates/*.liquid',
        ],
        sass: './theme/assets/*.scss',
        images: './theme/assets/*.+(jpg|jpeg|gif|png)'
    },
    dev: {
        liquid: './dev/liquid/',
        js: './dev/js/',
        sass: './dev/scss/',
        images: './dev/images/'
    }
}

///////////////////////////////////////////////////////
// SHELL COMMAND TO DOWNLOAD AND MOVE FILE TO DEV FOLDER
///////////////////////////////////////////////////////

gulp.task('move_liquid', function () {
    return gulp.src(config.source.liquid, { base: config.source.baseDir})
        .pipe(gulp.dest(config.dev.liquid))
})

gulp.task('move_js', function () {
    return gulp.src(config.source.js)
        .pipe(gulp.dest(config.dev.js))
})

gulp.task('move_sass', function () {
    return gulp.src(config.source.sass)
        .pipe(gulp.dest(config.dev.sass))
})

gulp.task('move_image', function () {
    return gulp.src(config.source.images)
        .pipe(gulp.dest(config.dev.images))
})

gulp.task('init', [
    'move_liquid',
    'move_js',
    'move_sass',
    'move_image',
])

gulp.task('download', shell.task([
    'rm -rf theme',
    'mkdir theme',
    'theme download',
    'gulp init'
]))
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////

// gulp.task('default', ['sass', 'checkoutJs', 'scrollJs', 'kleberJs', 'vendorJs', 'yotpoJs', 'js', 'reactJs', 'compressImages', 'assets', 'fonts', 'svgstore', 'watch_js_sass', 'watch_liquid', 'theme_watch'])
gulp.task('default', ['init'])
