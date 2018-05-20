// import { resolve } from "url";
import os from 'os'
import path from 'path'

const STORAGE_KEY = 'eBuild'
const Store = window.localStorage

const LS = {
    get(){
        return JSON.parse(Store.getItem(STORAGE_KEY) || '{}')
    }
    ,set(dataObj){
        Store.setItem(STORAGE_KEY, JSON.stringify(dataObj))
    }
}

let defState = LS.get()
const state = {
    task_list: defState.task_list || []
    ,current_task: defState.current_task || {}
    ,working_dir: defState.working_dir || path.join(os.homedir(), './Desktop/')
    ,config: defState.config || {}
    ,serveStatus: false
    ,tpl: defState.tpl || []
}

const mutations = {
    AddTask (state, task){ 
        state.task_list.push(task)
        LS.set(state)
    }
    ,UpdateTask(state, task){
        state.task_list = state.task_list.map(item => {
            if (item.name == task.name) {
                return task
            }else{
                return item
            }
        })
        LS.set(state)
    }
    ,DelTask (state, task){ 
        state.task_list = state.task_list.filter(item=>item.name != task.name)
        LS.set(state)
    }
    ,SetCurrentTask(state, task){
        state.current_task = task
        LS.set(state)
    }
    ,SetWorkingDir(state, dir){
        state.working_dir = dir
        LS.set(state)
    }
    ,SaveConfig(state, item){
        state.config = item
        LS.set(state)
    }
    ,SaveServeStatus(state, v){
        state.serveStatus = v
        LS.set(state)
    }
    ,AddTpl(state, v){
        state.tpl.push(v)
        LS.set(state)
    }
}

const actions = {
    addTask({commit}, task){
        return new Promise((resolve, reject)=>{
            commit('AddTask', task)
            resolve()
        })
    }
    ,updateTask({commit}, task){
        return new Promise((resolve, reject)=>{
            commit('UpdateTask', task)
            resolve()
        })
    }
    ,delTask({commit}, task){
        return new Promise((resolve, reject)=>{
            commit('DelTask', task)
            resolve()
        })
    }
    ,setCurrentTask({commit}, task){
        return new Promise((resolve, reject)=>{
            commit('SetCurrentTask', task)
            resolve()
        })
    }
    ,setWorkingDir({commit}, dir){
        return new Promise((resolve, reject)=>{
            commit('SetWorkingDir', dir)
            resolve()
        })
    }
    ,saveConfig({commit}, item){
        return new Promise((resolve, reject)=>{
            commit('SaveConfig', item)
            resolve()
        })
    }
    ,saveServeStatus({commit}, item){
        return new Promise((resolve, reject)=>{
            commit('SaveServeStatus', item)
            resolve()
        })
    }
    ,addTpl({commit}, task){
        return new Promise((resolve, reject)=>{
            commit('AddTpl', task)
            resolve()
        })
    }
}

export default {
    state,
    mutations,
    actions
}
