// import { resolve } from "url";

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
    ,working_dir: defState.working_dir || '/Users/alex/Desktop/ztemp/' //todo set get default desktop dir
}

const mutations = {
    AddTask (state, task){ 
        state.task_list.push(task)
        LS.set(state)
    }
    ,DelTask (state, task){ 
        //todo delete by name and path
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
}

const actions = {
    addTask({commit}, task){
        return new Promise((resolve, reject)=>{
            commit('AddTask', task)
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
}

export default {
    state,
    mutations,
    actions
}
