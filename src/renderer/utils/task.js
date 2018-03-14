"use strict";
import gulp from 'gulp'
import path from 'path'
import del from 'del'
import async from 'async'
import browserSync from 'browser-sync'
import gulpWatch from 'gulp-watch'
import gulpIf from 'gulp-if'
import gulpRename from 'gulp-rename'
import gulpReplace from 'gulp-replace'
import gulpPxToRem from 'gulp-px2rem'
import gulpEncode from 'gulp-convert-encoding'
import gulpToUtf8 from 'gulp-utf8-convert'
import gulpUglify from 'gulp-uglify'


let imgPrefix = '//game.gtimg.cn/images/'

//todo 多个bs实例的控制， 允许多个实例？如何切换？ 单个实例，UI如何提示

const BS = browserSync.create();
const startServer = function (rootPath, cb) {
    BS.init({
        server: rootPath,
        startPath: "/",
        // startPath: "/html/",
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

const stopTask = (sendLog)=>{
    BS.exit()
    sendLog({cont: '停止本地预览', ret: 'ok'})
}

const getRelativePath = (path)=>{
    // winPath is : c:\\desktop\\xxx\\yyy , BUT macPath is: /xx/yy/zz
    let reg = /[\\\/]\w+[\\\/]src[\\\/].*/g  
    let ret = path.match(reg)
    return ret && ret[0] || ''
}

const startTask = (doBuild = false, task, sendLog, cb)=>{
    let taskPath = task.path
    imgPrefix = '//game.gtimg.cn/images/' + task.domain + '/act/' + task.name + '/'

    let paths = {
        src: {
            dir: path.join(taskPath, './src'),
            html: path.join(taskPath, './src/*.{html,htm,shtml}'), //glob pattern
            css: path.join(taskPath, './src/css/**/*'),
            js: path.join(taskPath, './src/js/**/*'),
            img: path.join(taskPath, './src/images/**/*')
        },
        target: {
            dir: path.join(taskPath, './dev'),
            html: path.join(taskPath, './dev/'),
            css: path.join(taskPath, './dev/css'),
            js: path.join(taskPath, './dev/js'),
            img: path.join(taskPath, './dev/images')
        }
    };
    if (doBuild) {
        paths.target = {
            dir: path.join(taskPath, './build'),
            html: path.join(taskPath, './build/'),
            css: path.join(taskPath, './build/css'),
            js: path.join(taskPath, './build/js'),
            img: path.join(taskPath, './build/ossweb-img')
        }
    }

    function doCopy(type, file, cb) {
        var modify 
        if (file == 'all') {
            file = paths['src'][type]
            modify = type + '文件' 
        }else{
            modify = getRelativePath(file)
        }

        //todo update
        if (type == 'img' ) {
            console.log('copy for img', file);
            gulp.src(file, {base: path.join(paths.src.dir , './images') })
                .pipe(gulp.dest(paths.target[type]))
                .on('end', function () {
                    sendLog({cont: '更新' + modify , ret:'ok'})
                    cb && cb()
                    BS.reload()
                });
        }else{

            gulp.src(file, {base: paths.src.dir})
                .pipe(gulp.dest(paths.target.dir))
                .on('end', function () {
                    sendLog({cont: '更新' + modify , ret:'ok'})
                    cb && cb()
                    BS.reload()
                });

        }
    }

    //HTML
    function compileHtml(cb) {
        gulp.src(paths.src.html, {base: paths.src.dir})
            //must convert to utf8
            .pipe(gulpEncode({from: 'gbk',to: 'utf-8'}) )

            .pipe(gulpIf( !doBuild, gulpReplace(/charset="\w+"/gi, 'charset="utf-8"')  ))
            .pipe(gulpReplace(/(src|href)=('|")https?:\/\//gi, '$1=$2//' ))

            //build
            .pipe(gulpIf( doBuild, gulpReplace('src="images/', 'src="' + imgPrefix) ))
            // utf-8 for dev (browserSync utf8 only), gbk for build
            .pipe(gulpIf( doBuild, gulpEncode({from: 'utf-8',to: 'gbk'}) ))

            .pipe(gulp.dest(paths.target.dir))
            .on('end', function () {
                sendLog({cont:'编译HTML', ret: 'ok'})
                cb && cb();
                BS.reload()
            })
    }

    //CSS 
    function compileCSS(cb){
        gulp.src(paths.src.css, {base: paths.src.dir})
            // for build
            .pipe(gulpIf( doBuild, gulpReplace('../images/', imgPrefix) ))
            .pipe(gulpIf( doBuild, gulpPxToRem({ rootValue: 50,  unitPrecision:3, minPx: 1 }) ))
            //todo css min

            .pipe(gulp.dest(paths.target.dir))
            .on('end', function () {
                sendLog({cont:'编译CSS', ret: 'ok'})
                cb && cb();
                BS.reload()
            })

    }
    //JS TODO
    function compileJS(cb){
        gulp.src(paths.src.js, {base: paths.src.dir})
            .pipe(gulpIf( doBuild, gulpReplace('../images/', imgPrefix) ))
            .pipe(gulpIf( doBuild, gulpUglify() ))

            .pipe(gulp.dest(paths.target.dir))
            .on('end', function () {
                sendLog({cont:'编译JS', ret: 'ok'})
                cb && cb();
                BS.reload()
            })
    }

    //监听文件
    function watch(cb) {
        gulpWatch([paths.src.dir], {ignored: /[\/\\]\./}, function(arg){
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
        target = target && target[1] ? target[1] : 'html'

        switch (target) {
            case 'images':
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
                    compileCSS()
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
            let dirStr = (doBuild ? '打包' : '测试') + '环境目录'
            sendLog({cont: `开始清除${dirStr}`})
            del(paths.target.dir, {force: true}).then(function () {
                sendLog({cont: `成功清除${dirStr}`, ret:'ok'})
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
                    compileCSS(cb)
                },
                function (cb) {
                    sendLog({cont:'开始处理JS文件'})
                    compileJS(cb)
                    // doCopy('js', 'all',  cb);
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
            if (doBuild) {
                next()
                return
            }

            sendLog({cont:'开始监听src目录中的文件'})
            watch(next);
        },
        function (next) {
            if (doBuild) {
                next()
                return
            }

            sendLog({cont:'开始启动本地服务器'})
            startServer(paths.target.dir, function(){
                sendLog({cont:'启动本地服务器', ret: 'ok'})
                sendLog({cont:'正在监听项目src目录...', ret: 'ok'})
                next()
            });
        }
    ], function (error) {
        if (error) { throw new Error(error); }
    });

    cb && cb()
}

const serveTask = (task, sendLog, cb = ()=>{} )=>{
    //convert 2 utfe
    let p = [path.join(task.path, './*.{html,htm,shtml}'), '!' + path.join(task.path, './__*.*')]
    gulp.src(p)
        .pipe(gulpRename(function(path){
            path.basename = '__' + path.basename
            path.extname = '.html' 
        }))
        .pipe(gulpToUtf8({
            encNotMatchHandle:function (file) {
                console.log('file not match: ', file);
            }
        }) )
        .pipe( gulpReplace(/charset="\w+"/gi, 'charset="utf-8"')  )
        .pipe(gulp.dest(task.path))

    sendLog({cont:'开始启动本地服务器...', ret: 'info'})

    startServer({
        baseDir:task.path,
        directory: true
    }, function(){
        sendLog({cont:'启动本地服务器', ret: 'ok'})
        cb()
    });
}
export { startTask, stopTask, serveTask }