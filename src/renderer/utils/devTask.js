"use strict";
import gulp from 'gulp'
import path from 'path'
import del from 'del'
import async from 'async'
import browserSync from 'browser-sync'
import gulpWatch from 'gulp-watch'

const BS = browserSync.create();
const startServer = function (rootPath, cb) {
    BS.init({
        server: rootPath,
        startPath: "/html/",
        port: 8098,
        reloadDelay: 0,
        timestamps: true,
        notify: {      
            styles: [
                "margin: 0", "padding: 5px", "position: fixed", "font-size: 12px", "z-index: 9999", "bottom: 2px", "right: 2px",
                "background-color: #3399ff", "color: white", "text-align: center"
            ]
        }
    });
    cb();
}

const getRelativePath = (path)=>{
    // winPath is : c:\\desktop\\xxx\\yyy , 
    // macPath is: /xx/yy/zz, all to:  \project\src\...
    let reg = /\\\w+\\src\\.*/g  
    if (process.platform == 'darwin') {
        reg = /\/\w+\/src\/.*/g
    }
    let ret = path.match(reg)
    return ret && ret[0] || ''
}

const devTask = (taskPath, sendLog, cb)=>{
    let paths = {
        src: {
            dir: path.join(taskPath, './src'),
            html: path.join(taskPath, './src/html/**/*'),
            css: path.join(taskPath, './src/css/**/*'),
            js: path.join(taskPath, './src/js/**/*'),
            img: path.join(taskPath, './src/img/**/*')
        },
        dev: {
            dir: path.join(taskPath, './dev'),
            html: path.join(taskPath, './dev/html'),
            css: path.join(taskPath, './dev/css'),
            js: path.join(taskPath, './dev/js'),
            img: path.join(taskPath, './dev/img')
        }
    };

    function doCopy(type, file, cb) {
        var modify 
        if (file == 'all') {
            file = paths['src'][type]
            modify = type + '文件' 
        }else{
            modify = getRelativePath(file)
        }

        gulp.src(file, {base: paths.src.dir})
            .pipe(gulp.dest(paths.dev.dir))
            .on('end', function () {
                sendLog({cont: '更新' + modify , ret:'ok'})
                cb && cb()
                BS.reload()
            });
    }

    function compileHtml(cb) {
        gulp.src(paths.src.html, {base: paths.src.dir})
            //TODO add str replace
            .pipe(gulp.dest(paths.dev.dir))
            .on('end', function () {
                sendLog({cont:'编译HTML', ret: 'ok'})
                cb && cb();
                BS.reload()
            })
    }

    //TODO
    function compileCSS(cb){

    }
    //TODO
    function compileJS(cb){

    }

    //监听文件
    function watch(cb) {
        //todo add ignore
        gulpWatch([paths.src.dir], function(arg){
            let e = arg.event
            let orgPath = arg.history[0]

            let path = getRelativePath(orgPath)
            let action = e=='add'? '添加': e=='change' ? '修改': '删除'

            sendLog({cont: action + '文件: ' + path})
            handleWatch(e, orgPath)
        })
        cb && cb();
    }

    function handleWatch(type, file) {
        let target = file.split('src')[1].match(/[\/\\](\w+)[\/\\]/);
        if (target.length && target[1]) {
            target = target[1];
        }

        switch (target) {
            case 'img':
                if (type === 'unlink') {
                    let tmp = file.replace(/src/, 'dev');
                    del([tmp], {force: true}).then(function () {
                        sendLog({cont: '删除对应IMG文件', ret: 'ok'})
                    });
                } else {
                    doCopy('img', file);
                }
                break;

            case 'js':
                if (type === 'unlink') {
                    var tmp = file.replace(/src/, 'dev');
                    del([tmp], {force: true}).then(function () {
                        sendLog({cont: '删除对应JS文件', ret: 'ok'})
                    });
                } else {
                    //TODO isMinify
                    doCopy('js', file);
                }
                break;
            case 'css':
                var ext = path.extname(file);

                if (type === 'unlink') {
                    var tmp = file.replace(/src/, 'dev').replace('.less', '.css');
                    del([tmp], {force: true}).then(function () {
                        sendLog({cont: '删除对应CSS文件', ret: 'ok'})
                    });
                } else {
                    //TODO compile css , px2rem, pathReplace
                    doCopy('css', file);
                    // if (ext === '.less') {
                    //     compileLess();
                    // } else {
                    //     doCopy('css', file);
                    // }
                }
                break;

            case 'html':
                if (type === 'unlink') {
                    let tmp = file.replace(/src/, 'dev');
                    del([tmp], {force: true}).then(function () {
                        sendLog({cont: '删除对应HTML文件', ret: 'ok'})
                    });
                } else {
                    compileHtml();
                }
                break;
        }
    };

    //init
    async.series([
        function (next) {
            sendLog({cont:'开始清除dev目录文件'})
            del(paths.dev.dir, {force: true}).then(function () {
                sendLog({cont:'清除dev目录文件', ret:'ok'})
                next();
            })
        },
        function (next) {
            async.parallel([
                function (cb) {
                    sendLog({cont:'开始处理IMG文件'})
                    doCopy('img', 'all',  cb);
                },
                function (cb) {
                    sendLog({cont:'开始处理CSS文件'})
                    doCopy('css', 'all', cb);
                },
                function (cb) {
                    sendLog({cont:'开始处理JS文件'})
                    doCopy('js', 'all',  cb);
                },
                function (cb) {
                    sendLog({cont:'开始编译HTML'})
                    compileHtml(cb);
                }
            ], function (error) {
                if (error) { throw new Error(error); }
                next();
            })
        },
        function (next) {
            sendLog({cont:'开始监听src目录中的文件'})
            watch(next);
        },
        function (next) {
            sendLog({cont:'开始启动本地服务器'})
            startServer(paths.dev.dir, next);
        }
    ], function (error) {
        if (error) { throw new Error(error); }
    });

    cb && cb()
}

export { devTask }