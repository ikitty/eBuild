"use strict";

import gulp from 'gulp'
import path from 'path'
import del from 'del'
import {startTask ,stopTask, serveTask} from './task'

const tempPath = path.join(__dirname, '../template/event/**/*')
const createTask = (targetPath)=> {
    //todo 第一次运行的时候总会有点问题，随便加个注释什么的就正常了。 奇怪
    console.log('temppath is ', tempPath);
    return new Promise((resolve, reject) => {
        gulp.src(tempPath)
            .pipe(gulp.dest(targetPath))
            .on('end', ()=>{
                console.log('Util.createTask: Ok');
                resolve()
            })
    })

}

//Del task path
const deleteTask = (path, cb)=> {
    return del([path], { force: true })
}

export default {
    createTask,
    deleteTask,
    startTask,
    stopTask,
    serveTask
}
