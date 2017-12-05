import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import IndexPage from '@/components/index'
import ProjectAdd from '@/components/project_add'
import ProjectList from '@/components/project_list'
import Setting from '@/components/setting'

export default new Router({
  routes: [
    { path: '*', redirect: '/' },
    { path: '/', name: 'index', component: IndexPage },
    { path: '/project_add', name: 'projectAdd', component: ProjectAdd },
    { path: '/project_list', name: 'projectList', component: ProjectList },
    { path: '/setting', name: 'setting', component: Setting },

    //TODO add project_import
    // { path: '/project_import', name: 'projectImport', component: ProjectAdd },
  ]
})