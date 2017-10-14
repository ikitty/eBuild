import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Index from '@/components/index'
import ProjectAdd from '@/components/project_add'
import ProjectList from '@/components/project_list'

export default new Router({
  routes: [
    { path: '/', name: 'projectAdd', component: ProjectAdd },
    { path: '/project_list', name: 'projectList', component: ProjectList },

    { path: '*', redirect: '/' }
  ]
})