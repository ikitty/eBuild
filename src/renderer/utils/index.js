"use strict";

import gulp from 'gulp'
import path from 'path'
import devTask from './devTask'

const tempPath = path.join(__dirname, '../template/event/**/*')
const createTask = (targetPath)=> {
    gulp.src(tempPath)
        .pipe(gulp.dest(targetPath))
        .on('end', ()=>{
            console.log('Util.createTask: Ok');
        })
}

console.log('util index', devTask);

export default {
    createTask,
    devTask: devTask.devTask
}
