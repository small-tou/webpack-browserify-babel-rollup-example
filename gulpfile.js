'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var babelify = require('babelify');
var path = require("path");
var fs = require("fs");
var webpack = require('webpack-stream');
var babel = require('gulp-babel');
var rollup = require( 'rollup' );
var commonjsRollup = require('rollup-plugin-commonjs');
var npmRollup = require("rollup-plugin-node-resolve");
var babelRollup = require('rollup-plugin-babel');

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

gulp.task('rollup',function(){
    rollup.rollup({
        // The bundle's starting point. This file will be
        // included, along with the minimum necessary code
        // from its dependencies
        entry: './src/test.js',
        plugins: [
            babelRollup({
                exclude: 'node_modules/**'
            }),
            npmRollup({ jsnext: true, main: true}),
            // non-CommonJS modules will be ignored, but you can also
            // specifically include/exclude files
            commonjsRollup()
        ]
    }).then( function ( bundle ) {
        console.log("success")
        // Generate bundle + sourcemap
        //var result = bundle.generate({
        //    // output format - 'amd', 'cjs', 'es6', 'iife', 'umd'
        //    format: 'iife'
        //});

        //fs.writeFileSync( 'build/rollup-bundle.js', result.code );

        // Alternatively, let Rollup do it for you
        // (this returns a promise). This is much
        // easier if you're generating a sourcemap
        bundle.write({
            format: 'iife',
            dest: 'build/rollup-bundle.js'
        });
    }).catch(function(e){
        console.trace(e);
    });
})
gulp.task("default",[
    "browerify","webpack","babel","rollup"
])
