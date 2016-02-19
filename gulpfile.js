'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var babelify = require('babelify');
var path = require("path");
var fs = require("fs");
var webpack = require('webpack-stream');
var babel = require('gulp-babel');
var rename = require("gulp-rename");
// React Scripts

gulp.task('browerify', function() {
    browserify("./src/test.js")
        .transform("babelify", {presets: ["es2015"]})
        .bundle()
        .pipe(fs.createWriteStream("./build/browerify-bundle.js"));

});

gulp.task('webpack', function() {
    gulp.src('./src/test.js').
        pipe(webpack({
            entry: './src/test.js',
            output: {
                //path: './build/',
                filename:"./webpack-bundle.js"
            },
            module: {
                loaders: [
                    {
                        loader: 'babel-loader',
                        query: {
                            presets: ['es2015']
                        }
                    }
                ]
            }
        }))

        .pipe(gulp.dest("./build"));

});

gulp.task('babel',function() {
    gulp.src('./src/test.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(rename("babel-bundle.js"))
        .pipe(gulp.dest("./build"))
});

gulp.task("default",[
    "browerify","webpack","babel"
])
