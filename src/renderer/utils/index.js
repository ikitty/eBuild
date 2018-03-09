"use strict";

import gulp from 'gulp'
import path from 'path'
import del from 'del'
import {startTask ,stopTask, serveTask} from './task'

const tempPath = path.join(__dirname, '../template/event/**/*')
const createTask = (targetPath)=> {
    // console.log('temppath is ', tempPath);
    gulp.src(tempPath)
        .pipe(gulp.dest(targetPath))
        .on('end', ()=>{
            console.log('Util.createTask: Ok');
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
