import { resolve } from "url";

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
    project_list: defState.project_list || []
    ,current_project: defState.current_project || {}
    ,working_dir: '/Users/alex/Desktop/ztemp/' //todo set
}

const mutations = {
    AddProj (state, proj){ 
        state.project_list = [...state.project_list, proj]
        LS.set(state)
    }
    ,RemoveCount (state, proj){ 
        state.project_list.shift()
        LS.set(state)
    }
    ,SetCurrentProject(state, cur_project){
        state.current_project = cur_project
        //todo save
    }
}

const actions = {
    addProj({commit}, proj){
        return new Promise((resolve, reject)=>{
            commit('AddProj', proj)
            resolve()
        })
    }
}

export default {
    state,
    mutations,
    actions
}
