//dev task
"use strict";

import gulp from 'gulp'
import path from 'path'

export default function(projPath, cb){
    let devPath = '/Users/alex/Desktop/ztemp/aDateEvt/dev/'

        gulp.src(projPath)
            .pipe(gulp.dest(devPath))
            .on('end', function () {
                console.log(`copy in util success.`);
            });

        cb && cb()
}

/*
const path = require('path');
const del = require('del');
const async = require('async');
const gulp = require('gulp');
const less = require('gulp-less');

const Common = require(path.join(__dirname, '../common.js'));

function dev(projectPath, log, callback) {
    const bs = require('browser-sync').create();  // 自动刷新浏览器

    let projectConfigPath = path.join(projectPath, Common.CONFIGNAME);
    let config = null;

    if (Common.fileExist(projectConfigPath)) {
        config = Common.requireUncached(projectConfigPath);
    } else {
        config = Common.requireUncached(path.join(__dirname, '../../' + Common.CONFIGNAME));
    }

    let paths = {
        src: {
        },
        dev: {
            dir: path.join(projectPath, './dev'),
            css: path.join(projectPath, './dev/css'),
            html: path.join(projectPath, './dev/html'),
            js: path.join(projectPath, './dev/js')
        }
    };

    // just copy
    function copyHandler(type, file, cb) {
        if (typeof file === 'function') {
            cb = file;
            file = paths['src'][type];
        }

        gulp.src(file, {base: paths.src.dir})
            .pipe(gulp.dest(paths.dev.dir))
            .on('end', function () {
                console.log(`copy ${type} success.`);
                log(`copy ${type} success.`);
                cb ? cb() : reloadHandler();
            });
    }

    function reloadHandler() {
        config.livereload && bs.reload();
    }

    function compileLess(cb) {
        gulp.src(paths.src.less, {base: paths.src.dir})
            .pipe(less({relativeUrls: true}))
            .on('error', function (error) {
                console.log(error.message);
            })
            .pipe(gulp.dest(paths.dev.dir))
            .on('end', function () {
                if (cb) {
                    console.log('compile Less success.');
                    log('compile Less success.');
                    cb();
                } else {
                    reloadHandler();
                }
            })
    }

    function compileHtml(cb) {
        //option base is required on LocalDev
        gulp.src(paths.src.html, {base: paths.src.dir})
            .pipe(gulp.dest(paths.dev.dir))
            .on('end', function () {
                if (cb) {
                    console.log('compile Html success.');
                    log('compile Html success.');
                    cb && cb();
                } else {
                    reloadHandler();
                }
            })
    }

    //监听文件
    function watch(cb) {
        var watcher = gulp.watch([
                paths.src.html,
                paths.src.js,
                paths.src.lessWatcher,
                paths.src.img,
                paths.src.slice,
                paths.src.media
            ],
            {ignored: /[\/\\]\./}
        );

        watcher
            .on('change', function (file) {
                console.log(file + ' has been changed');
                log(file + ' has been changed');
                watchHandler('changed', file);
            })
            .on('add', function (file) {
                console.log(file + ' has been added');
                log(file + ' has been added');
                watchHandler('add', file);
            })
            .on('unlink', function (file) {
                console.log(file + ' is deleted');
                log(file + ' is deleted');
                watchHandler('removed', file);
            });

        console.log('watching...');
        log('watching...');

        cb();
    }

    function watchHandler(type, file) {

        let target = file.split('src')[1].match(/[\/\\](\w+)[\/\\]/);

        if (target.length && target[1]) {
            target = target[1];
        }

        switch (target) {
            case 'img':
                if (type === 'removed') {
                    let tmp = file.replace(/src/, 'dev');
                    del([tmp], {force: true}).then(function () {
                        reloadHandler();
                    });
                } else {
                    copyHandler('img', file);
                }
                break;

            case 'slice':
                if (type === 'removed') {
                    var tmp = file.replace(/src/, 'dev');
                    del([tmp], {force: true});
                } else {
                    copyHandler('slice', file);
                }
                break;

            case 'js':
                if (type === 'removed') {
                    var tmp = file.replace(/src/, 'dev');
                    del([tmp], {force: true});
                } else {
                    copyHandler('js', file);
                }
                break;

            case 'media':
                if (type === 'removed') {
                    var tmp = file.replace(/src/, 'dev');
                    del([tmp], {force: true});
                } else {
                    copyHandler('media', file);
                }
                break;

                //todo less?
            case 'css':
                var ext = path.extname(file);

                if (type === 'removed') {
                    var tmp = file.replace(/src/, 'dev').replace('.less', '.css');
                    del([tmp], {force: true});
                } else {
                    if (ext === '.less') {
                        compileLess();
                    } else {
                        // compileSass();
                    }
                }

                break;

            case 'html':
                if (type === 'removed') {
                    let tmp = file.replace(/src/, 'dev');
                    del([tmp], {force: true}).then(function () { });
                } else {
                    compileHtml();
                }

                break;
        }

    };

    //启动 livereload
    function startServer(cb) {
        bs.init({
            server: {
                baseDir: paths.dev.dir,
                directory: true
            },
            startPath: "/html",
            port: 8088,
            reloadDelay: 0,
            timestamps: true,
            notify: {      
                styles: [
                    "margin: 0",
                    "padding: 5px",
                    "position: fixed",
                    "font-size: 12px",
                    "z-index: 9999",
                    "bottom: 0px",
                    "right: 0px",
                    "border-radius: 0",
                    "background-color: rgba(255,100,33,0.8)",
                    "color: white",
                    "text-align: center"
                ]
            }
        });

        cb();
    }

    async.series([
        function (next) {
            del(paths.dev.dir, {force: true}).then(function () { next(); })
        },
        function (next) {
            async.parallel([
                function (cb) {
                    copyHandler('img', cb);
                },
                function (cb) {
                    copyHandler('slice', cb);
                },
                function (cb) {
                    copyHandler('js', cb);
                },
                function (cb) {
                    copyHandler('media', cb);
                },
                function (cb) {
                    compileLess(cb);
                },
                function (cb) {
                    compileHtml(cb);
                }
            ], function (error) {
                if (error) {
                    throw new Error(error);
                }

                next();
            })
        },
        function (next) {
            watch(next);
        },
        function (next) {
            startServer(next);
        }
    ], function (error) {
        if (error) {
            throw new Error(error);
        }

        callback && callback(bs);
    });
}


export default {dev}
*/



//disk task