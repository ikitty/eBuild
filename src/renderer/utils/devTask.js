"use strict";
import gulp from 'gulp'
import path from 'path'
import del from 'del'
import async from 'async'
import browserSync from 'browser-sync'

const devTask = (taskPath, cb)=>{
    // gulp.src(projPath)
    //     .pipe(gulp.dest(devPath))
    //     .on('end', function () {
    //         console.log(`copy in util success.`);
    //     });

    const bs = browserSync.create();

    let paths = {
        src: {
            dir: path.join(taskPath, './src'),
            css: path.join(taskPath, './src/css/**/*'),
            html: path.join(taskPath, './src/html/**/*'),
            js: path.join(taskPath, './src/js/**/*'),
            img: path.join(taskPath, './src/img/**/*')
        },
        dev: {
            dir: path.join(taskPath, './dev'),
            css: path.join(taskPath, './dev/css'),
            html: path.join(taskPath, './dev/html'),
            js: path.join(taskPath, './dev/js'),
            img: path.join(taskPath, './dev/img')
        }
    };

    function copyHandler(type, file, cb) {
        if (typeof file === 'function') {
            cb = file;
            file = paths['src'][type];
        }

        gulp.src(file, {base: paths.src.dir})
        // gulp.src(file)
            .pipe(gulp.dest(paths.dev.dir))
            .on('end', function () {
                console.log(`Copy ${type} success.`);
                // log(`copy ${type} success.`);
                cb ? cb() : reloadHandler();
            });
    }

    function reloadHandler() {
        // bs.reload()
        // config.livereload && bs.reload();
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
        // gulp.src(paths.src.html, {base: paths.src.dir})
            .pipe(gulp.dest(paths.dev.dir))
            .on('end', function () {
                if (cb) {
                    console.log('compile Html success.');
                    // log('compile Html success.');
                    cb && cb();
                }
            })
    }

    //监听文件
    function watch(cb) {
        var watcher = gulp.watch([
                paths.src.html,
                paths.src.js,
                paths.src.img
            ],
            {ignored: /[\/\\]\./}
        );

        watcher
            .on('change', function (trans) {
                console.log(trans.path + ' has been changed');
                // log(file + ' has been changed');
                watchHandler(trans.type, trans.path);
            })
            .on('add', function (file) {
                console.log(file + ' has been added');
                // log(file + ' has been added');
                watchHandler('add', file);
            })
            .on('unlink', function (file) {
                console.log(file + ' is deleted');
                // log(file + ' is deleted');
                watchHandler('removed', file);
            });

        console.log('watching...');
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

            case 'js':
                if (type === 'removed') {
                    var tmp = file.replace(/src/, 'dev');
                    del([tmp], {force: true});
                } else {
                    copyHandler('js', file);
                }
                break;
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

    function startServer(cb) {
        bs.init({
            server: {
                baseDir: paths.dev.dir,
                directory: true
            },
            //todo fileExist html or htm
            startPath: "/html/index.html",
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
                    copyHandler('js', cb);
                },
                function (cb) {
                    compileHtml(cb);
                }
            ], function (error) {
                if (error) { throw new Error(error); }
                next();
            })
        },
        function (next) {
            watch(next);
        },
        function (next) {
            console.log('should start server', 1);
            startServer(next);
        }
    ], function (error) {
        if (error) {
            throw new Error(error);
        }

        // callback && callback();
    });

    cb && cb()
}

// export default {devTask}

//如果是这样单个导出（没有default keyword） 那么import时 需要使用{}
//如果是export default {},那么import时是不能使用{}单独导入某个接口的
export {
    devTask
}