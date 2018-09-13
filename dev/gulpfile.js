'use strict'
const gulp = require('gulp')
const sass = require('gulp-sass')
const flatten = require('gulp-flatten')
const replace = require('gulp-replace')
const concat = require('gulp-concat')
const imagemin = require('gulp-imagemin')
const svgstore = require('gulp-svgstore')
const svgmin = require('gulp-svgmin')
const rename = require('gulp-rename')
const jshint = require('gulp-jshint')
const watch = require('gulp-watch')
const shell = require('gulp-shell')
const streamqueue = require('streamqueue')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')

const config = {
  input: {
    baseDir: './dev',
    scss_main: './scss/main.scss',
    scss_all: './scss/*.scss',
    images: './images/*.+(jpg|jpeg|gif|png)',
    svgs: './svg/**/*.svg',
    js: [
      './js/*.js'
    ],
    checkoutJs: [
      './js/checkout/*.js'
    ]
  },
  output: {
    liquid: '../theme/',
    assets: '../theme/assets/',
  }
}

///////////////////////////////////////////////////////
///// COMPILE ALL SCSS - WITH ESCAPED LIQUID
///////////////////////////////////////////////////////

gulp.task('sass', function () {
  return gulp.src(config.input.scss_main)
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('theme.css.liquid'))
    .pipe(gulp.dest(config.output.assets))
})

///////////////////////////////////////////////////////
///////// CONCATENATE AND LINT JS
///////////////////////////////////////////////////////

gulp.task('js', function () {
  return gulp.src(config.input.js)
    .pipe(concat('dev.js'))
    .pipe(babel({
      presets: ['es2015']
    }))
    .on('error', function (err) {
      console.log(err.toString())
      this.emit('end')
    })
    .pipe(concat('theme.js'))
    .pipe(uglify())
    .pipe(gulp.dest(config.output.assets))
})

gulp.task('vendorJs', function () {
  return streamqueue({objectMode: true},
    gulp.src('./bower_components/jquery/dist/jquery.js'),
    gulp.src('./node_modules/handlebars-intl/dist/handlebars-intl-with-locales.js'),
    gulp.src('./node_modules/handlebars/dist/handlebars.js'),
    gulp.src('./js/vendor/slick.js'),
    gulp.src('./bower_components/magnific-popup/dist/jquery.magnific-popup.js'),
    gulp.src('./bower_components/favico.js/favico.js'),
    gulp.src('./bower_components/scrollreveal/dist/scrollreveal.js'),
    gulp.src('./bower_components/materialize/js/initial.js'),
    gulp.src('./bower_components/materialize/js/jquery.easing.1.3.js'),
    gulp.src('./bower_components/materialize/js/global.js'),
    gulp.src('./bower_components/materialize/js/scrollspy.js'),
    gulp.src('./node_modules/tippy.js/dist/tippy.js')
  )
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest(config.outputDir))
})

gulp.task('checkoutJs', function () {
  // return streamqueue({objectMode: true},
  //   gulp.src('./bower_components/matchheight/dist/jquery.matchHeight.js'),
  //   gulp.src(config.src.checkoutJs)
  // )
  //   .pipe(concat('checkout-youfoodz.js'))
  //   .pipe(uglify())
  //   .pipe(gulp.dest(config.outputDir))

    return gulp.src(config.input.checkoutJs)
        .pipe(concat('checkout-dev.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .on('error', function (err) {
            console.log(err.toString())
            this.emit('end')
        })
        .pipe(concat('checkout.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.output.assets))
})


///////////////////////////////////////////////////////
//////// COMPRESS IMAGES
///////////////////////////////////////////////////////

gulp.task('compressImages', function () {
  return gulp.src(config.input.images)
    .pipe(imagemin([], {}))
    .pipe(gulp.dest(config.output.assets))
})

///////////////////////////////////////////////////////
//////// COMPILE REMAINING ASSETS
///////////////////////////////////////////////////////

// gulp.task('assets', function () {
//   return gulp.src(config.src.assets)
//     .pipe(gulp.dest(config.outputDir))
// })
//
// gulp.task('fonts', function () {
//   return gulp.src(config.src.fonts)
//     .pipe(flatten())
//     .pipe(replace('../font/', '')) // Necessary due to Shopify's flat assets structure
//     .pipe(gulp.dest(config.outputDir))
// })

///////////////////////////////////////////////////////
//////// CONCATENATE SVGS INTO ONE SYMBOL AND MINIFY
///////////////////////////////////////////////////////

/**
 * There are compatibility issues with the svg files generated from Figma with this particular svg minifier. In order
 * to get around them, you will need to:
 *    - ensure your svg file has no <use /> tags. Any fill or transform attributes should be copied from the use tag
 *      and added to the path they reference
 *    - once that's been done, the <use /> tags can then be replaced with the updated <path> tag
 *    - all <defs> tags can be deleted
 *    - the <use /> tag is replaced by the <path> (rather than converting <defs> to <g>) in order to retain any transform attributes on the parent <g>
 */

// gulp.task('svgstore', function () {
//   return gulp.src(config.src.svgs)
//     .pipe(svgmin(function (file) {
//       return {
//         plugins: [{
//           cleanupIDs: {
//             minify: true
//           },
//           removeUnknownsAndDefaults: true,
//           removeUselessStrokeAndFill: true
//         }]
//       }
//     }))
//     .pipe(svgstore())
//     .pipe(rename('svg-defs.liquid'))
//     .pipe(gulp.dest('./liquid/snippets'))
// })

///////////////////////////////////////////////////////
//////// WATCHES
///////////////////////////////////////////////////////

// JS and sass watches
gulp.task('watch_js_sass', function () {
  gulp.watch(config.input.scss_all, ['sass'])
  gulp.watch(config.input.js, ['js'])
  // gulp.watch(config.src.vendorJs, ['vendorJs'])
  gulp.watch(config.src.checkoutJs, ['checkoutJs'])
})


// Watch all liquid and json files inside the folder 'liquid'
const liquidSource = './liquid'
gulp.task('watch_liquid', function () {
  gulp.src(liquidSource + '/**/*.{liquid,json}', {base: liquidSource})
    .pipe(watch(liquidSource, {base: liquidSource}))
    .pipe(gulp.dest('../theme/'))
})

///////////////////////////////////////////////////////
//////// SHELL COMMAND TO OPEN THEME WATCH
///////////////////////////////////////////////////////

gulp.task('theme_watch', shell.task([
  'ttab -d ../theme theme watch'
]))

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////

// gulp.task('default', ['sass', 'checkoutJs', 'scrollJs', 'kleberJs', 'vendorJs', 'yotpoJs', 'js', 'reactJs', 'compressImages', 'assets', 'fonts', 'svgstore', 'watch_js_sass', 'watch_liquid', 'theme_watch'])
gulp.task('default', ['sass', 'checkoutJs', 'js', 'compressImages', 'watch_liquid', 'watch_js_sass'])
