const STORAGE_KEY = 'eBuild'
const Store = window.localStorage


const state = {
    project_list: JSON.parse(Store.getItem(STORAGE_KEY) || '[]')
}

const mutations = {
    AddCount (state, proj){ 
        state.project_list = [...state.project_list, proj]

        Store.setItem(STORAGE_KEY, JSON.stringify(state.project_list) )
    }
    ,MinusCount (state, proj){ 
        //todo 直接修改数据，导致无法追踪状态了。。
        state.project_list.shift()

        Store.setItem(STORAGE_KEY, JSON.stringify(state.project_list) )
    }
}

const actions = {
    someAsyncTask({ commit }) {
        // commit('INCREMENT_MAIN_COUNTER')
    }
}

export default {
    state,
    mutations,
    actions
}
